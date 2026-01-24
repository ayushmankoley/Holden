#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracterror, contracttype,
    token, Address, Env, Map, Symbol, symbol_short,
};

// ============================================================================
// Storage Keys
// ============================================================================

const ADMIN_KEY: Symbol = symbol_short!("admin");
const ASSET_REG_KEY: Symbol = symbol_short!("assetreg");
const KYC_REG_KEY: Symbol = symbol_short!("kycreg");
const PAUSED_KEY: Symbol = symbol_short!("paused");
const MIN_AMOUNTS_KEY: Symbol = symbol_short!("minamts");
const TOKEN_MAP_KEY: Symbol = symbol_short!("tokenmap");

// ============================================================================
// Events
// ============================================================================

const EVENT_REDEMPTION: Symbol = symbol_short!("redeem");
const EVENT_PAUSED: Symbol = symbol_short!("paused");
const EVENT_RESUMED: Symbol = symbol_short!("resumed");

// ============================================================================
// Error Codes
// ============================================================================

#[contracterror]
#[derive(Clone, Copy, PartialEq, Eq, Debug)]
#[repr(u32)]
pub enum RedemptionError {
    /// Contract not initialized
    NotInitialized = 1,
    /// Contract already initialized
    AlreadyInitialized = 2,
    /// Caller is not the admin
    Unauthorized = 3,
    /// Redemption is currently paused
    RedemptionPaused = 4,
    /// Asset is not active in registry
    AssetNotActive = 5,
    /// User is not KYC approved
    KycNotApproved = 6,
    /// Amount below minimum
    BelowMinimum = 7,
    /// Invalid amount
    InvalidAmount = 8,
    /// Token not configured for asset
    TokenNotConfigured = 9,
}

// ============================================================================
// External Contract Interfaces
// ============================================================================

mod kyc_registry_interface {
    use soroban_sdk::{contractclient, Address, Env};

    #[contractclient(name = "KycRegistryClient")]
    pub trait KycRegistryInterface {
        fn is_kyc_approved(env: Env, address: Address) -> bool;
    }
}

mod asset_registry_interface {
    use soroban_sdk::{contractclient, contracttype, Address, Env, String, Symbol};

    #[contracttype]
    #[derive(Clone)]
    pub struct AssetInfo {
        pub issuer: Address,
        pub metadata_uri: String,
        pub exposure_ratio: i128,
        pub active: bool,
    }

    #[contractclient(name = "AssetRegistryClient")]
    pub trait AssetRegistryInterface {
        fn get_asset(env: Env, asset_code: Symbol) -> AssetInfo;
    }
}

use kyc_registry_interface::KycRegistryClient;
use asset_registry_interface::AssetRegistryClient;

// ============================================================================
// Contract Definition
// ============================================================================

#[contract]
pub struct RedemptionController;

#[contractimpl]
impl RedemptionController {
    // ========================================================================
    // Initialization
    // ========================================================================

    /// Initialize the RedemptionController contract.
    ///
    /// # Arguments
    /// * `admin` - Admin address with control over the contract
    /// * `asset_registry` - Address of the AssetRegistry contract
    /// * `kyc_registry` - Address of the KycRegistry contract
    pub fn initialize(
        env: Env,
        admin: Address,
        asset_registry: Address,
        kyc_registry: Address,
    ) {
        if env.storage().instance().has(&ADMIN_KEY) {
            panic!("contract already initialized");
        }

        env.storage().instance().set(&ADMIN_KEY, &admin);
        env.storage().instance().set(&ASSET_REG_KEY, &asset_registry);
        env.storage().instance().set(&KYC_REG_KEY, &kyc_registry);
        env.storage().instance().set(&PAUSED_KEY, &false);

        // Initialize empty maps
        let min_amounts: Map<Symbol, i128> = Map::new(&env);
        env.storage().instance().set(&MIN_AMOUNTS_KEY, &min_amounts);

        let token_map: Map<Symbol, Address> = Map::new(&env);
        env.storage().instance().set(&TOKEN_MAP_KEY, &token_map);
    }

    // ========================================================================
    // Admin Functions
    // ========================================================================

    /// Set the minimum redemption amount for an asset.
    pub fn set_minimum_amount(env: Env, asset_code: Symbol, min_amount: i128) {
        let admin = Self::require_admin(&env);
        admin.require_auth();

        let mut min_amounts: Map<Symbol, i128> = env
            .storage()
            .instance()
            .get(&MIN_AMOUNTS_KEY)
            .expect("not initialized");

        min_amounts.set(asset_code, min_amount);
        env.storage().instance().set(&MIN_AMOUNTS_KEY, &min_amounts);
    }

    /// Configure the token contract address for an asset.
    pub fn set_token_contract(env: Env, asset_code: Symbol, token_address: Address) {
        let admin = Self::require_admin(&env);
        admin.require_auth();

        let mut token_map: Map<Symbol, Address> = env
            .storage()
            .instance()
            .get(&TOKEN_MAP_KEY)
            .expect("not initialized");

        token_map.set(asset_code, token_address);
        env.storage().instance().set(&TOKEN_MAP_KEY, &token_map);
    }

    /// Pause redemption (emergency stop).
    pub fn pause_redemption(env: Env) {
        let admin = Self::require_admin(&env);
        admin.require_auth();

        env.storage().instance().set(&PAUSED_KEY, &true);
        env.events().publish((EVENT_PAUSED,), ());
    }

    /// Resume redemption.
    pub fn resume_redemption(env: Env) {
        let admin = Self::require_admin(&env);
        admin.require_auth();

        env.storage().instance().set(&PAUSED_KEY, &false);
        env.events().publish((EVENT_RESUMED,), ());
    }

    /// Transfer admin rights.
    pub fn set_admin(env: Env, new_admin: Address) {
        let admin = Self::require_admin(&env);
        admin.require_auth();

        env.storage().instance().set(&ADMIN_KEY, &new_admin);
    }

    // ========================================================================
    // User-Facing Functions
    // ========================================================================

    /// Redeem tokens - burns tokens and emits event for off-chain settlement.
    ///
    /// # Flow
    /// 1. Check redemption is not paused
    /// 2. Check user is KYC-approved
    /// 3. Check asset is active in AssetRegistry
    /// 4. Check amount ≥ minimum
    /// 5. Burn tokens from user
    /// 6. Emit RedemptionRequested event
    ///
    /// # Arguments
    /// * `user` - The address redeeming tokens (must sign)
    /// * `asset_code` - The asset to redeem (e.g., TSLAH)
    /// * `amount` - Number of tokens to redeem
    pub fn redeem(
        env: Env,
        user: Address,
        asset_code: Symbol,
        amount: i128,
    ) {
        // User must authorize this transaction
        user.require_auth();

        // 1. Check not paused
        let paused: bool = env
            .storage()
            .instance()
            .get(&PAUSED_KEY)
            .unwrap_or(false);
        if paused {
            panic!("redemption is paused");
        }

        // 2. Validate amount
        if amount <= 0 {
            panic!("invalid amount");
        }

        // 3. Check KYC approval
        let kyc_registry_addr: Address = env
            .storage()
            .instance()
            .get(&KYC_REG_KEY)
            .expect("not initialized");

        let kyc_client = KycRegistryClient::new(&env, &kyc_registry_addr);
        let is_kyc = kyc_client.is_kyc_approved(&user);
        if !is_kyc {
            panic!("user not KYC approved");
        }

        // 4. Check asset is active in registry
        let asset_registry_addr: Address = env
            .storage()
            .instance()
            .get(&ASSET_REG_KEY)
            .expect("not initialized");

        let asset_client = AssetRegistryClient::new(&env, &asset_registry_addr);
        let asset_info = asset_client.get_asset(&asset_code);
        if !asset_info.active {
            panic!("asset not active");
        }

        // 5. Check minimum amount
        let min_amounts: Map<Symbol, i128> = env
            .storage()
            .instance()
            .get(&MIN_AMOUNTS_KEY)
            .expect("not initialized");

        let min_amount = min_amounts.get(asset_code.clone()).unwrap_or(0);
        if amount < min_amount {
            panic!("amount below minimum");
        }

        // 6. Get token contract and burn
        let token_map: Map<Symbol, Address> = env
            .storage()
            .instance()
            .get(&TOKEN_MAP_KEY)
            .expect("not initialized");

        let token_addr = token_map.get(asset_code.clone()).expect("token not configured");

        // Burn tokens from user (uses StellarAssetClient which has burn_from)
        let token_client = token::Client::new(&env, &token_addr);
        token_client.burn(&user, &amount);

        // 7. Get current timestamp
        let timestamp = env.ledger().timestamp();

        // 8. Emit redemption event for off-chain settlement
        env.events().publish(
            (EVENT_REDEMPTION, user.clone(), asset_code.clone()),
            (user, asset_code, amount, timestamp),
        );
    }

    // ========================================================================
    // Public Read Functions
    // ========================================================================

    /// Get the minimum redemption amount for an asset.
    pub fn get_minimum_amount(env: Env, asset_code: Symbol) -> i128 {
        let min_amounts: Map<Symbol, i128> = env
            .storage()
            .instance()
            .get(&MIN_AMOUNTS_KEY)
            .expect("not initialized");

        min_amounts.get(asset_code).unwrap_or(0)
    }

    /// Check if redemption is paused.
    pub fn is_paused(env: Env) -> bool {
        env.storage()
            .instance()
            .get(&PAUSED_KEY)
            .unwrap_or(false)
    }

    /// Get admin address.
    pub fn get_admin(env: Env) -> Address {
        env.storage()
            .instance()
            .get(&ADMIN_KEY)
            .expect("not initialized")
    }

    /// Get token contract address for an asset.
    pub fn get_token_contract(env: Env, asset_code: Symbol) -> Address {
        let token_map: Map<Symbol, Address> = env
            .storage()
            .instance()
            .get(&TOKEN_MAP_KEY)
            .expect("not initialized");

        token_map.get(asset_code).expect("token not configured")
    }

    /// Get AssetRegistry contract address.
    pub fn get_asset_registry(env: Env) -> Address {
        env.storage()
            .instance()
            .get(&ASSET_REG_KEY)
            .expect("not initialized")
    }

    /// Get KycRegistry contract address.
    pub fn get_kyc_registry(env: Env) -> Address {
        env.storage()
            .instance()
            .get(&KYC_REG_KEY)
            .expect("not initialized")
    }

    // ========================================================================
    // Internal Helpers
    // ========================================================================

    fn require_admin(env: &Env) -> Address {
        env.storage()
            .instance()
            .get(&ADMIN_KEY)
            .expect("not initialized")
    }
}

// ============================================================================
// Tests
// ============================================================================

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::testutils::Address as _;

    #[test]
    fn test_initialize() {
        let env = Env::default();
        let contract_id = env.register(RedemptionController, ());
        let client = RedemptionControllerClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let asset_registry = Address::generate(&env);
        let kyc_registry = Address::generate(&env);

        client.initialize(&admin, &asset_registry, &kyc_registry);

        assert_eq!(client.get_admin(), admin);
        assert_eq!(client.get_asset_registry(), asset_registry);
        assert_eq!(client.get_kyc_registry(), kyc_registry);
        assert!(!client.is_paused());
    }

    #[test]
    #[should_panic(expected = "contract already initialized")]
    fn test_double_initialize_fails() {
        let env = Env::default();
        let contract_id = env.register(RedemptionController, ());
        let client = RedemptionControllerClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let asset_registry = Address::generate(&env);
        let kyc_registry = Address::generate(&env);

        client.initialize(&admin, &asset_registry, &kyc_registry);
        client.initialize(&admin, &asset_registry, &kyc_registry);
    }

    #[test]
    fn test_pause_and_resume() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register(RedemptionController, ());
        let client = RedemptionControllerClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let asset_registry = Address::generate(&env);
        let kyc_registry = Address::generate(&env);

        client.initialize(&admin, &asset_registry, &kyc_registry);

        assert!(!client.is_paused());

        client.pause_redemption();
        assert!(client.is_paused());

        client.resume_redemption();
        assert!(!client.is_paused());
    }

    #[test]
    fn test_set_minimum_amount() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register(RedemptionController, ());
        let client = RedemptionControllerClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let asset_registry = Address::generate(&env);
        let kyc_registry = Address::generate(&env);

        client.initialize(&admin, &asset_registry, &kyc_registry);

        let asset_code = Symbol::new(&env, "TSLAH");
        
        // Default is 0
        assert_eq!(client.get_minimum_amount(&asset_code), 0);

        // Set minimum to 10
        client.set_minimum_amount(&asset_code, &10);
        assert_eq!(client.get_minimum_amount(&asset_code), 10);
    }

    #[test]
    fn test_set_token_contract() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register(RedemptionController, ());
        let client = RedemptionControllerClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let asset_registry = Address::generate(&env);
        let kyc_registry = Address::generate(&env);
        let tslah_token = Address::generate(&env);

        client.initialize(&admin, &asset_registry, &kyc_registry);

        let asset_code = Symbol::new(&env, "TSLAH");
        client.set_token_contract(&asset_code, &tslah_token);

        assert_eq!(client.get_token_contract(&asset_code), tslah_token);
    }

    #[test]
    fn test_set_admin() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register(RedemptionController, ());
        let client = RedemptionControllerClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let new_admin = Address::generate(&env);
        let asset_registry = Address::generate(&env);
        let kyc_registry = Address::generate(&env);

        client.initialize(&admin, &asset_registry, &kyc_registry);
        assert_eq!(client.get_admin(), admin);

        client.set_admin(&new_admin);
        assert_eq!(client.get_admin(), new_admin);
    }
}
