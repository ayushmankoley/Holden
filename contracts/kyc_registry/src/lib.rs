#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracterror, contracttype,
    Address, Env, Map, Symbol, symbol_short,
};

// ============================================================================
// Storage Keys
// ============================================================================

/// Storage key for the KYC admin address
const ADMIN_KEY: Symbol = symbol_short!("kycadmin");

/// Storage key for the KYC approved addresses map
const APPROVED_KEY: Symbol = symbol_short!("approved");

// ============================================================================
// Events
// ============================================================================

/// Event topics for KYC updates
const EVENT_ADMIN_SET: Symbol = symbol_short!("admin_set");
const EVENT_KYC_ADDED: Symbol = symbol_short!("kyc_add");
const EVENT_KYC_REMOVED: Symbol = symbol_short!("kyc_rem");

// ============================================================================
// Error Codes
// ============================================================================

#[contracterror]
#[derive(Clone, Copy, PartialEq, Eq, Debug)]
#[repr(u32)]
pub enum KycError {
    /// Contract has not been initialized
    NotInitialized = 1,
    /// Contract has already been initialized
    AlreadyInitialized = 2,
    /// Caller is not the admin
    Unauthorized = 3,
    /// Address is already KYC approved
    AlreadyApproved = 4,
    /// Address is not KYC approved
    NotApproved = 5,
    /// Invalid address provided
    InvalidAddress = 6,
}

// ============================================================================
// Contract Definition
// ============================================================================

#[contract]
pub struct KycRegistry;

#[contractimpl]
impl KycRegistry {
    // ========================================================================
    // Initialization
    // ========================================================================

    /// Initialize the KYC Registry with an admin address.
    /// This must be called once before any other functions.
    ///
    /// # Arguments
    /// * `env` - The contract environment
    /// * `admin` - The address that will have admin privileges
    ///
    /// # Panics
    /// Panics if the contract is already initialized
    pub fn initialize(env: Env, admin: Address) {
        // Check if already initialized
        if env.storage().instance().has(&ADMIN_KEY) {
            panic!("contract already initialized");
        }

        // Store the admin address
        env.storage().instance().set(&ADMIN_KEY, &admin);

        // Initialize empty approved map
        let approved: Map<Address, bool> = Map::new(&env);
        env.storage().instance().set(&APPROVED_KEY, &approved);

        // Emit initialization event
        env.events().publish((EVENT_ADMIN_SET, admin.clone()), admin);
    }

    // ========================================================================
    // Admin Functions
    // ========================================================================

    /// Add an address to the KYC approved list.
    /// Can only be called by the admin.
    ///
    /// # Arguments
    /// * `env` - The contract environment
    /// * `address` - The address to approve for KYC
    ///
    /// # Panics
    /// Panics if:
    /// - Contract is not initialized
    /// - Caller is not the admin
    /// - Address is already approved
    pub fn add_to_kyc(env: Env, address: Address) {
        // Verify admin authorization
        let admin = Self::require_admin(&env);
        admin.require_auth();

        // Get the approved map
        let mut approved: Map<Address, bool> = env
            .storage()
            .instance()
            .get(&APPROVED_KEY)
            .expect("contract not initialized");

        // Check if already approved (optional: you can skip this check if you want idempotent behavior)
        if approved.get(address.clone()).unwrap_or(false) {
            panic!("address already KYC approved");
        }

        // Add to approved list
        approved.set(address.clone(), true);
        env.storage().instance().set(&APPROVED_KEY, &approved);

        // Emit event
        env.events().publish((EVENT_KYC_ADDED, address.clone()), address);
    }

    /// Remove an address from the KYC approved list.
    /// Can only be called by the admin.
    ///
    /// # Arguments
    /// * `env` - The contract environment
    /// * `address` - The address to remove from KYC
    ///
    /// # Panics
    /// Panics if:
    /// - Contract is not initialized
    /// - Caller is not the admin
    /// - Address is not currently approved
    pub fn remove_from_kyc(env: Env, address: Address) {
        // Verify admin authorization
        let admin = Self::require_admin(&env);
        admin.require_auth();

        // Get the approved map
        let mut approved: Map<Address, bool> = env
            .storage()
            .instance()
            .get(&APPROVED_KEY)
            .expect("contract not initialized");

        // Check if currently approved
        if !approved.get(address.clone()).unwrap_or(false) {
            panic!("address not KYC approved");
        }

        // Remove from approved list (set to false)
        approved.set(address.clone(), false);
        env.storage().instance().set(&APPROVED_KEY, &approved);

        // Emit event
        env.events().publish((EVENT_KYC_REMOVED, address.clone()), address);
    }

    /// Transfer admin rights to a new address.
    /// Can only be called by the current admin.
    ///
    /// # Arguments
    /// * `env` - The contract environment
    /// * `new_admin` - The new admin address
    ///
    /// # Panics
    /// Panics if:
    /// - Contract is not initialized
    /// - Caller is not the current admin
    pub fn set_admin(env: Env, new_admin: Address) {
        // Verify current admin authorization
        let admin = Self::require_admin(&env);
        admin.require_auth();

        // Set new admin
        env.storage().instance().set(&ADMIN_KEY, &new_admin);

        // Emit event
        env.events().publish((EVENT_ADMIN_SET, new_admin.clone()), new_admin);
    }

    // ========================================================================
    // Public Read Functions
    // ========================================================================

    /// Check if an address is KYC approved.
    /// This is a public read function that anyone can call.
    ///
    /// # Arguments
    /// * `env` - The contract environment
    /// * `address` - The address to check
    ///
    /// # Returns
    /// `true` if the address is KYC approved, `false` otherwise
    pub fn is_kyc_approved(env: Env, address: Address) -> bool {
        // Get the approved map (return false if not initialized)
        let approved: Option<Map<Address, bool>> = env
            .storage()
            .instance()
            .get(&APPROVED_KEY);

        match approved {
            Some(map) => map.get(address).unwrap_or(false),
            None => false,
        }
    }

    /// Get the current admin address.
    ///
    /// # Arguments
    /// * `env` - The contract environment
    ///
    /// # Returns
    /// The admin address
    ///
    /// # Panics
    /// Panics if the contract is not initialized
    pub fn get_admin(env: Env) -> Address {
        env.storage()
            .instance()
            .get(&ADMIN_KEY)
            .expect("contract not initialized")
    }

    // ========================================================================
    // Internal Helper Functions
    // ========================================================================

    /// Internal helper to get and verify admin exists.
    fn require_admin(env: &Env) -> Address {
        env.storage()
            .instance()
            .get(&ADMIN_KEY)
            .expect("contract not initialized")
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
        let contract_id = env.register(KycRegistry, ());
        let client = KycRegistryClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        client.initialize(&admin);

        assert_eq!(client.get_admin(), admin);
    }

    #[test]
    #[should_panic(expected = "contract already initialized")]
    fn test_double_initialize_fails() {
        let env = Env::default();
        let contract_id = env.register(KycRegistry, ());
        let client = KycRegistryClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        client.initialize(&admin);
        client.initialize(&admin); // Should panic
    }

    #[test]
    fn test_add_and_check_kyc() {
        let env = Env::default();
        env.mock_all_auths();
        
        let contract_id = env.register(KycRegistry, ());
        let client = KycRegistryClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let user = Address::generate(&env);

        client.initialize(&admin);

        // User should not be approved initially
        assert!(!client.is_kyc_approved(&user));

        // Add user to KYC
        client.add_to_kyc(&user);

        // User should now be approved
        assert!(client.is_kyc_approved(&user));
    }

    #[test]
    fn test_remove_from_kyc() {
        let env = Env::default();
        env.mock_all_auths();
        
        let contract_id = env.register(KycRegistry, ());
        let client = KycRegistryClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let user = Address::generate(&env);

        client.initialize(&admin);

        // Add user to KYC
        client.add_to_kyc(&user);
        assert!(client.is_kyc_approved(&user));

        // Remove user from KYC
        client.remove_from_kyc(&user);
        assert!(!client.is_kyc_approved(&user));
    }

    #[test]
    #[should_panic(expected = "address already KYC approved")]
    fn test_add_duplicate_fails() {
        let env = Env::default();
        env.mock_all_auths();
        
        let contract_id = env.register(KycRegistry, ());
        let client = KycRegistryClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let user = Address::generate(&env);

        client.initialize(&admin);
        client.add_to_kyc(&user);
        client.add_to_kyc(&user); // Should panic
    }

    #[test]
    #[should_panic(expected = "address not KYC approved")]
    fn test_remove_non_approved_fails() {
        let env = Env::default();
        env.mock_all_auths();
        
        let contract_id = env.register(KycRegistry, ());
        let client = KycRegistryClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let user = Address::generate(&env);

        client.initialize(&admin);
        client.remove_from_kyc(&user); // Should panic
    }

    #[test]
    fn test_set_admin() {
        let env = Env::default();
        env.mock_all_auths();
        
        let contract_id = env.register(KycRegistry, ());
        let client = KycRegistryClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let new_admin = Address::generate(&env);

        client.initialize(&admin);
        assert_eq!(client.get_admin(), admin);

        client.set_admin(&new_admin);
        assert_eq!(client.get_admin(), new_admin);
    }

    #[test]
    fn test_is_kyc_approved_returns_false_when_not_initialized() {
        let env = Env::default();
        let contract_id = env.register(KycRegistry, ());
        let client = KycRegistryClient::new(&env, &contract_id);

        let user = Address::generate(&env);

        // Should return false, not panic
        assert!(!client.is_kyc_approved(&user));
    }
}
