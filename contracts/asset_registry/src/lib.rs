#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype,
    Address, Env, Map, Symbol, String, symbol_short,
};

/// Storage key for registry map
const REGISTRY_KEY: Symbol = symbol_short!("registry");

#[contracttype]
#[derive(Clone)]
pub struct AssetInfo {
    /// Stellar issuer account (Holden issuer)
    pub issuer: Address,

    /// Off-chain metadata reference (IPFS / HTTPS)
    pub metadata_uri: String,

    /// Exposure ratio (1_000_000 = 1.0)
    pub exposure_ratio: i128,

    /// Whether the asset is currently active
    pub active: bool,
}

#[contract]
pub struct AssetRegistry;

#[contractimpl]
impl AssetRegistry {
    /// Register a new Holden asset
    /// Can only be called by Holden admin
    pub fn register_asset(
        env: Env,
        admin: Address,
        asset_code: Symbol,
        issuer: Address,
        metadata_uri: String,
    ) {
        admin.require_auth();

        let mut registry: Map<Symbol, AssetInfo> =
            env.storage()
                .instance()
                .get(&REGISTRY_KEY)
                .unwrap_or(Map::new(&env));

        if registry.contains_key(asset_code.clone()) {
            panic!("asset already registered");
        }

        registry.set(
            asset_code.clone(),
            AssetInfo {
                issuer,
                metadata_uri,
                exposure_ratio: 1_000_000,
                active: true,
            },
        );

        env.storage().instance().set(&REGISTRY_KEY, &registry);
    }

    /// Update exposure ratio after issuer buyback + burn
    pub fn update_exposure_ratio(
        env: Env,
        admin: Address,
        asset_code: Symbol,
        new_ratio: i128,
    ) {
        admin.require_auth();

        let mut registry: Map<Symbol, AssetInfo> =
            env.storage()
                .instance()
                .get(&REGISTRY_KEY)
                .expect("registry not initialized");

        let mut info = registry
            .get(asset_code.clone())
            .expect("asset not found");

        info.exposure_ratio = new_ratio;
        registry.set(asset_code, info);

        env.storage().instance().set(&REGISTRY_KEY, &registry);
    }

    /// Enable or disable an asset
    pub fn set_active(
        env: Env,
        admin: Address,
        asset_code: Symbol,
        active: bool,
    ) {
        admin.require_auth();

        let mut registry: Map<Symbol, AssetInfo> =
            env.storage()
                .instance()
                .get(&REGISTRY_KEY)
                .expect("registry not initialized");

        let mut info = registry
            .get(asset_code.clone())
            .expect("asset not found");

        info.active = active;
        registry.set(asset_code, info);

        env.storage().instance().set(&REGISTRY_KEY, &registry);
    }

    /// Public read: get asset info
    pub fn get_asset(env: Env, asset_code: Symbol) -> AssetInfo {
        let registry: Map<Symbol, AssetInfo> =
            env.storage()
                .instance()
                .get(&REGISTRY_KEY)
                .expect("registry not initialized");

        registry
            .get(asset_code)
            .expect("asset not found")
    }
}
