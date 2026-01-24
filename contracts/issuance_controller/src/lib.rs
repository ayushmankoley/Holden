#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracterror, contracttype,
    token, Address, Env, Map, Symbol, Vec, symbol_short,
};

// ============================================================================
// Storage Keys
// ============================================================================

const ADMIN_KEY: Symbol = symbol_short!("admin");
const ASSET_REG_KEY: Symbol = symbol_short!("assetreg");
const KYC_REG_KEY: Symbol = symbol_short!("kycreg");
const TREASURY_KEY: Symbol = symbol_short!("treasury");
const PAUSED_KEY: Symbol = symbol_short!("paused");
const PRICES_KEY: Symbol = symbol_short!("prices");
const PAY_ASSETS_KEY: Symbol = symbol_short!("payasset");
const TOKEN_MAP_KEY: Symbol = symbol_short!("tokenmap");

// ============================================================================
// Events
// ============================================================================

const EVENT_ISSUANCE: Symbol = symbol_short!("issuance");
const EVENT_PAUSED: Symbol = symbol_short!("paused");
const EVENT_RESUMED: Symbol = symbol_short!("resumed");
const EVENT_PRICE_SET: Symbol = symbol_short!("priceset");

// ============================================================================
// Error Codes
// ============================================================================

#[contracterror]
#[derive(Clone, Copy, PartialEq, Eq, Debug)]
#[repr(u32)]
pub enum IssuanceError {
    /// Contract not initialized
    NotInitialized = 1,
    /// Contract already initialized
    AlreadyInitialized = 2,
    /// Caller is not the admin
    Unauthorized = 3,
    /// Issuance is currently paused
    IssuancePaused = 4,
    /// Asset is not active in registry
    AssetNotActive = 5,
    /// User is not KYC approved
    KycNotApproved = 6,
    /// Payment asset not accepted
    PaymentAssetNotAccepted = 7,
    /// Price not set for this asset
    PriceNotSet = 8,
    /// Invalid amount
    InvalidAmount = 9,
    /// Asset not found
    AssetNotFound = 10,
    /// Token not configured for asset
    TokenNotConfigured = 11,
}

// ============================================================================
// Data Types
// ============================================================================

/// Price configuration for an asset
#[contracttype]
#[derive(Clone)]
pub struct PriceInfo {
    /// Payment asset contract address (e.g., USDC SAC address)
    pub payment_asset: Address,
    /// Price per unit in smallest denomination (e.g., 1_000_000 = 1 USDC for 7 decimals)
    pub price_per_unit: i128,
}

// ============================================================================
// External Contract Interfaces (using traits)
// ============================================================================

// KycRegistry interface - defined as a mod with contractclient
mod kyc_registry_interface {
    use soroban_sdk::{contractclient, Address, Env};

    #[contractclient(name = "KycRegistryClient")]
    pub trait KycRegistryInterface {
        fn is_kyc_approved(env: Env, address: Address) -> bool;
    }
}

// AssetRegistry interface
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
pub struct IssuanceController;

#[contractimpl]
impl IssuanceController {
    // ========================================================================
    // Initialization
    // ========================================================================

    /// Initialize the IssuanceController contract.
    ///
    /// # Arguments
    /// * `admin` - Admin address with control over the contract
    /// * `asset_registry` - Address of the AssetRegistry contract
    /// * `kyc_registry` - Address of the KycRegistry contract
    /// * `treasury` - Address where payments are sent
    pub fn initialize(
        env: Env,
        admin: Address,
        asset_registry: Address,
        kyc_registry: Address,
        treasury: Address,
    ) {
        if env.storage().instance().has(&ADMIN_KEY) {
            panic!("contract already initialized");
        }

        env.storage().instance().set(&ADMIN_KEY, &admin);
        env.storage().instance().set(&ASSET_REG_KEY, &asset_registry);
        env.storage().instance().set(&KYC_REG_KEY, &kyc_registry);
        env.storage().instance().set(&TREASURY_KEY, &treasury);
        env.storage().instance().set(&PAUSED_KEY, &false);

        // Initialize empty maps
        let prices: Map<Symbol, PriceInfo> = Map::new(&env);
        env.storage().instance().set(&PRICES_KEY, &prices);

        let payment_assets: Vec<Address> = Vec::new(&env);
        env.storage().instance().set(&PAY_ASSETS_KEY, &payment_assets);

        // Token map: asset_code -> token contract address
        let token_map: Map<Symbol, Address> = Map::new(&env);
        env.storage().instance().set(&TOKEN_MAP_KEY, &token_map);
    }

    // ========================================================================
    // Admin Functions
    // ========================================================================

    /// Set the price for an asset.
    ///
    /// # Arguments
    /// * `asset_code` - The asset code (e.g., TSLAH)
    /// * `payment_asset` - The payment token address (e.g., USDC SAC)
    /// * `price_per_unit` - Price in smallest denomination
    pub fn set_price(
        env: Env,
        asset_code: Symbol,
        payment_asset: Address,
        price_per_unit: i128,
    ) {
        let admin = Self::require_admin(&env);
        admin.require_auth();

        let mut prices: Map<Symbol, PriceInfo> = env
            .storage()
            .instance()
            .get(&PRICES_KEY)
            .expect("not initialized");

        prices.set(
            asset_code.clone(),
            PriceInfo {
                payment_asset: payment_asset.clone(),
                price_per_unit,
            },
        );

        env.storage().instance().set(&PRICES_KEY, &prices);

        // Emit event
        env.events().publish(
            (EVENT_PRICE_SET, asset_code.clone()),
            (asset_code, payment_asset, price_per_unit),
        );
    }

    /// Configure the token contract address for an asset.
    /// This is the Soroban token that will be minted.
    ///
    /// # Arguments
    /// * `asset_code` - The asset code (e.g., TSLAH)
    /// * `token_address` - The Soroban token contract address
    pub fn set_token_contract(
        env: Env,
        asset_code: Symbol,
        token_address: Address,
    ) {
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

    /// Add an accepted payment asset.
    pub fn add_payment_asset(env: Env, asset_address: Address) {
        let admin = Self::require_admin(&env);
        admin.require_auth();

        let mut payment_assets: Vec<Address> = env
            .storage()
            .instance()
            .get(&PAY_ASSETS_KEY)
            .expect("not initialized");

        // Check if already exists
        let mut exists = false;
        for i in 0..payment_assets.len() {
            if payment_assets.get(i).unwrap() == asset_address {
                exists = true;
                break;
            }
        }

        if !exists {
            payment_assets.push_back(asset_address);
            env.storage().instance().set(&PAY_ASSETS_KEY, &payment_assets);
        }
    }

    /// Remove an accepted payment asset.
    pub fn remove_payment_asset(env: Env, asset_address: Address) {
        let admin = Self::require_admin(&env);
        admin.require_auth();

        let payment_assets: Vec<Address> = env
            .storage()
            .instance()
            .get(&PAY_ASSETS_KEY)
            .expect("not initialized");

        let mut new_assets: Vec<Address> = Vec::new(&env);
        for i in 0..payment_assets.len() {
            let addr = payment_assets.get(i).unwrap();
            if addr != asset_address {
                new_assets.push_back(addr);
            }
        }

        env.storage().instance().set(&PAY_ASSETS_KEY, &new_assets);
    }

    /// Pause issuance (emergency stop).
    pub fn pause_issuance(env: Env) {
        let admin = Self::require_admin(&env);
        admin.require_auth();

        env.storage().instance().set(&PAUSED_KEY, &true);
        env.events().publish((EVENT_PAUSED,), ());
    }

    /// Resume issuance.
    pub fn resume_issuance(env: Env) {
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

    /// Update treasury address.
    pub fn set_treasury(env: Env, new_treasury: Address) {
        let admin = Self::require_admin(&env);
        admin.require_auth();

        env.storage().instance().set(&TREASURY_KEY, &new_treasury);
    }

    // ========================================================================
    // User-Facing Functions
    // ========================================================================

    /// Buy tokens through primary issuance.
    ///
    /// # Flow
    /// 1. Check issuance is not paused
    /// 2. Check asset is active in AssetRegistry
    /// 3. Check buyer is KYC-approved
    /// 4. Calculate payment amount
    /// 5. Transfer payment from buyer to treasury
    /// 6. Mint tokens to buyer
    /// 7. Emit issuance event
    ///
    /// # Arguments
    /// * `buyer` - The address buying tokens (must sign)
    /// * `asset_code` - The asset to buy (e.g., TSLAH)
    /// * `amount` - Number of tokens to buy
    pub fn buy(
        env: Env,
        buyer: Address,
        asset_code: Symbol,
        amount: i128,
    ) {
        // Buyer must authorize this transaction
        buyer.require_auth();

        // 1. Check not paused
        let paused: bool = env
            .storage()
            .instance()
            .get(&PAUSED_KEY)
            .unwrap_or(false);
        if paused {
            panic!("issuance is paused");
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
        let is_kyc = kyc_client.is_kyc_approved(&buyer);
        if !is_kyc {
            panic!("buyer not KYC approved");
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

        // 5. Get price info
        let prices: Map<Symbol, PriceInfo> = env
            .storage()
            .instance()
            .get(&PRICES_KEY)
            .expect("not initialized");

        let price_info = prices.get(asset_code.clone()).expect("price not set");
        
        // 6. Calculate payment amount
        let payment_amount = amount
            .checked_mul(price_info.price_per_unit)
            .expect("overflow");

        // 7. Get treasury address
        let treasury: Address = env
            .storage()
            .instance()
            .get(&TREASURY_KEY)
            .expect("not initialized");

        // 8. Transfer payment from buyer to treasury
        let payment_token = token::Client::new(&env, &price_info.payment_asset);
        payment_token.transfer(&buyer, &treasury, &payment_amount);

        // 9. Get token contract for this asset and mint
        let token_map: Map<Symbol, Address> = env
            .storage()
            .instance()
            .get(&TOKEN_MAP_KEY)
            .expect("not initialized");

        let token_addr = token_map.get(asset_code.clone()).expect("token not configured");
        
        // Mint tokens to buyer (contract must be mint authority)
        let holden_token = token::StellarAssetClient::new(&env, &token_addr);
        holden_token.mint(&buyer, &amount);

        // 10. Emit issuance event
        env.events().publish(
            (EVENT_ISSUANCE, buyer.clone(), asset_code.clone()),
            (buyer, asset_code, amount, price_info.payment_asset, payment_amount),
        );
    }

    // ========================================================================
    // Public Read Functions
    // ========================================================================

    /// Get the price info for an asset.
    pub fn get_price(env: Env, asset_code: Symbol) -> PriceInfo {
        let prices: Map<Symbol, PriceInfo> = env
            .storage()
            .instance()
            .get(&PRICES_KEY)
            .expect("not initialized");

        prices.get(asset_code).expect("price not set")
    }

    /// Get all accepted payment assets.
    pub fn get_accepted_payment_assets(env: Env) -> Vec<Address> {
        env.storage()
            .instance()
            .get(&PAY_ASSETS_KEY)
            .expect("not initialized")
    }

    /// Check if issuance is paused.
    pub fn is_paused(env: Env) -> bool {
        env.storage()
            .instance()
            .get(&PAUSED_KEY)
            .unwrap_or(false)
    }

    /// Get treasury address.
    pub fn get_treasury(env: Env) -> Address {
        env.storage()
            .instance()
            .get(&TREASURY_KEY)
            .expect("not initialized")
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
        let contract_id = env.register(IssuanceController, ());
        let client = IssuanceControllerClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let asset_registry = Address::generate(&env);
        let kyc_registry = Address::generate(&env);
        let treasury = Address::generate(&env);

        client.initialize(&admin, &asset_registry, &kyc_registry, &treasury);

        assert_eq!(client.get_admin(), admin);
        assert_eq!(client.get_treasury(), treasury);
        assert_eq!(client.get_asset_registry(), asset_registry);
        assert_eq!(client.get_kyc_registry(), kyc_registry);
        assert!(!client.is_paused());
    }

    #[test]
    #[should_panic(expected = "contract already initialized")]
    fn test_double_initialize_fails() {
        let env = Env::default();
        let contract_id = env.register(IssuanceController, ());
        let client = IssuanceControllerClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let asset_registry = Address::generate(&env);
        let kyc_registry = Address::generate(&env);
        let treasury = Address::generate(&env);

        client.initialize(&admin, &asset_registry, &kyc_registry, &treasury);
        client.initialize(&admin, &asset_registry, &kyc_registry, &treasury);
    }

    #[test]
    fn test_pause_and_resume() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register(IssuanceController, ());
        let client = IssuanceControllerClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let asset_registry = Address::generate(&env);
        let kyc_registry = Address::generate(&env);
        let treasury = Address::generate(&env);

        client.initialize(&admin, &asset_registry, &kyc_registry, &treasury);

        assert!(!client.is_paused());

        client.pause_issuance();
        assert!(client.is_paused());

        client.resume_issuance();
        assert!(!client.is_paused());
    }

    #[test]
    fn test_set_and_get_price() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register(IssuanceController, ());
        let client = IssuanceControllerClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let asset_registry = Address::generate(&env);
        let kyc_registry = Address::generate(&env);
        let treasury = Address::generate(&env);
        let usdc = Address::generate(&env);

        client.initialize(&admin, &asset_registry, &kyc_registry, &treasury);

        let asset_code = Symbol::new(&env, "TSLAH");
        let price: i128 = 100_0000000; // 100 USDC (7 decimals)

        client.set_price(&asset_code, &usdc, &price);

        let price_info = client.get_price(&asset_code);
        assert_eq!(price_info.payment_asset, usdc);
        assert_eq!(price_info.price_per_unit, price);
    }

    #[test]
    fn test_add_and_remove_payment_asset() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register(IssuanceController, ());
        let client = IssuanceControllerClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let asset_registry = Address::generate(&env);
        let kyc_registry = Address::generate(&env);
        let treasury = Address::generate(&env);
        let usdc = Address::generate(&env);

        client.initialize(&admin, &asset_registry, &kyc_registry, &treasury);

        // Initially empty
        let assets = client.get_accepted_payment_assets();
        assert_eq!(assets.len(), 0);

        // Add USDC
        client.add_payment_asset(&usdc);
        let assets = client.get_accepted_payment_assets();
        assert_eq!(assets.len(), 1);
        assert_eq!(assets.get(0).unwrap(), usdc);

        // Remove USDC
        client.remove_payment_asset(&usdc);
        let assets = client.get_accepted_payment_assets();
        assert_eq!(assets.len(), 0);
    }

    #[test]
    fn test_set_token_contract() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register(IssuanceController, ());
        let client = IssuanceControllerClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let asset_registry = Address::generate(&env);
        let kyc_registry = Address::generate(&env);
        let treasury = Address::generate(&env);
        let tslah_token = Address::generate(&env);

        client.initialize(&admin, &asset_registry, &kyc_registry, &treasury);

        let asset_code = Symbol::new(&env, "TSLAH");
        client.set_token_contract(&asset_code, &tslah_token);

        let token_addr = client.get_token_contract(&asset_code);
        assert_eq!(token_addr, tslah_token);
    }

    #[test]
    fn test_set_admin() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register(IssuanceController, ());
        let client = IssuanceControllerClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let new_admin = Address::generate(&env);
        let asset_registry = Address::generate(&env);
        let kyc_registry = Address::generate(&env);
        let treasury = Address::generate(&env);

        client.initialize(&admin, &asset_registry, &kyc_registry, &treasury);
        assert_eq!(client.get_admin(), admin);

        client.set_admin(&new_admin);
        assert_eq!(client.get_admin(), new_admin);
    }

    #[test]
    fn test_set_treasury() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register(IssuanceController, ());
        let client = IssuanceControllerClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let asset_registry = Address::generate(&env);
        let kyc_registry = Address::generate(&env);
        let treasury = Address::generate(&env);
        let new_treasury = Address::generate(&env);

        client.initialize(&admin, &asset_registry, &kyc_registry, &treasury);
        assert_eq!(client.get_treasury(), treasury);

        client.set_treasury(&new_treasury);
        assert_eq!(client.get_treasury(), new_treasury);
    }
}
