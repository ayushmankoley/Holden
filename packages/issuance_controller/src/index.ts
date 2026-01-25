import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Typepoint,
  Duration,
} from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}

export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CBA5OGYON72HS535NQKSLOGRWFZNYPIFBWYKIQDIDHLKHFN6DI2U5XVK",
  },
} as const;

export const IssuanceError = {
  /**
   * Contract not initialized
   */
  1: { message: "NotInitialized" },
  /**
   * Contract already initialized
   */
  2: { message: "AlreadyInitialized" },
  /**
   * Caller is not the admin
   */
  3: { message: "Unauthorized" },
  /**
   * Issuance is currently paused
   */
  4: { message: "IssuancePaused" },
  /**
   * Asset is not active in registry
   */
  5: { message: "AssetNotActive" },
  /**
   * User is not KYC approved
   */
  6: { message: "KycNotApproved" },
  /**
   * Payment asset not accepted
   */
  7: { message: "PaymentAssetNotAccepted" },
  /**
   * Price not set for this asset
   */
  8: { message: "PriceNotSet" },
  /**
   * Invalid amount
   */
  9: { message: "InvalidAmount" },
  /**
   * Asset not found
   */
  10: { message: "AssetNotFound" },
  /**
   * Token not configured for asset
   */
  11: { message: "TokenNotConfigured" },
};

/**
 * Price configuration for an asset
 */
export interface PriceInfo {
  /**
   * Payment asset contract address (e.g., USDC SAC address)
   */
  payment_asset: string;
  /**
   * Price per unit in smallest denomination (e.g., 1_000_000 = 1 USDC for 7 decimals)
   */
  price_per_unit: i128;
}

export interface AssetInfo {
  active: boolean;
  exposure_ratio: i128;
  issuer: string;
  metadata_uri: string;
}

export interface Client {
  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Initialize the IssuanceController contract.
   *
   * # Arguments
   * * `admin` - Admin address with control over the contract
   * * `asset_registry` - Address of the AssetRegistry contract
   * * `kyc_registry` - Address of the KycRegistry contract
   * * `treasury` - Address where payments are sent
   */
  initialize: (
    {
      admin,
      asset_registry,
      kyc_registry,
      treasury,
    }: {
      admin: string;
      asset_registry: string;
      kyc_registry: string;
      treasury: string;
    },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    },
  ) => Promise<AssembledTransaction<null>>;

  /**
   * Construct and simulate a set_price transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Set the price for an asset.
   *
   * # Arguments
   * * `asset_code` - The asset code (e.g., TSLAH)
   * * `payment_asset` - The payment token address (e.g., USDC SAC)
   * * `price_per_unit` - Price in smallest denomination
   */
  set_price: (
    {
      asset_code,
      payment_asset,
      price_per_unit,
    }: { asset_code: string; payment_asset: string; price_per_unit: i128 },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    },
  ) => Promise<AssembledTransaction<null>>;

  /**
   * Construct and simulate a set_token_contract transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Configure the token contract address for an asset.
   * This is the Soroban token that will be minted.
   *
   * # Arguments
   * * `asset_code` - The asset code (e.g., TSLAH)
   * * `token_address` - The Soroban token contract address
   */
  set_token_contract: (
    {
      asset_code,
      token_address,
    }: { asset_code: string; token_address: string },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    },
  ) => Promise<AssembledTransaction<null>>;

  /**
   * Construct and simulate a add_payment_asset transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Add an accepted payment asset.
   */
  add_payment_asset: (
    { asset_address }: { asset_address: string },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    },
  ) => Promise<AssembledTransaction<null>>;

  /**
   * Construct and simulate a remove_payment_asset transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Remove an accepted payment asset.
   */
  remove_payment_asset: (
    { asset_address }: { asset_address: string },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    },
  ) => Promise<AssembledTransaction<null>>;

  /**
   * Construct and simulate a pause_issuance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Pause issuance (emergency stop).
   */
  pause_issuance: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>;

  /**
   * Construct and simulate a resume_issuance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Resume issuance.
   */
  resume_issuance: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>;

  /**
   * Construct and simulate a set_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Transfer admin rights.
   */
  set_admin: (
    { new_admin }: { new_admin: string },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    },
  ) => Promise<AssembledTransaction<null>>;

  /**
   * Construct and simulate a set_treasury transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Update treasury address.
   */
  set_treasury: (
    { new_treasury }: { new_treasury: string },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    },
  ) => Promise<AssembledTransaction<null>>;

  /**
   * Construct and simulate a buy transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Buy tokens through primary issuance.
   *
   * # Flow
   * 1. Check issuance is not paused
   * 2. Check asset is active in AssetRegistry
   * 3. Check buyer is KYC-approved
   * 4. Calculate payment amount
   * 5. Transfer payment from buyer to treasury
   * 6. Mint tokens to buyer
   * 7. Emit issuance event
   *
   * # Arguments
   * * `buyer` - The address buying tokens (must sign)
   * * `asset_code` - The asset to buy (e.g., TSLAH)
   * * `amount` - Number of tokens to buy
   */
  buy: (
    {
      buyer,
      asset_code,
      amount,
    }: { buyer: string; asset_code: string; amount: i128 },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    },
  ) => Promise<AssembledTransaction<null>>;

  /**
   * Construct and simulate a get_price transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get the price info for an asset.
   */
  get_price: (
    { asset_code }: { asset_code: string },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    },
  ) => Promise<AssembledTransaction<PriceInfo>>;

  /**
   * Construct and simulate a get_accepted_payment_assets transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get all accepted payment assets.
   */
  get_accepted_payment_assets: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Array<string>>>;

  /**
   * Construct and simulate a is_paused transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Check if issuance is paused.
   */
  is_paused: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<boolean>>;

  /**
   * Construct and simulate a get_treasury transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get treasury address.
   */
  get_treasury: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<string>>;

  /**
   * Construct and simulate a get_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get admin address.
   */
  get_admin: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<string>>;

  /**
   * Construct and simulate a get_token_contract transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get token contract address for an asset.
   */
  get_token_contract: (
    { asset_code }: { asset_code: string },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    },
  ) => Promise<AssembledTransaction<string>>;

  /**
   * Construct and simulate a get_asset_registry transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get AssetRegistry contract address.
   */
  get_asset_registry: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<string>>;

  /**
   * Construct and simulate a get_kyc_registry transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get KycRegistry contract address.
   */
  get_kyc_registry: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<string>>;
}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      },
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options);
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([
        "AAAABAAAAAAAAAAAAAAADUlzc3VhbmNlRXJyb3IAAAAAAAALAAAAGENvbnRyYWN0IG5vdCBpbml0aWFsaXplZAAAAA5Ob3RJbml0aWFsaXplZAAAAAAAAQAAABxDb250cmFjdCBhbHJlYWR5IGluaXRpYWxpemVkAAAAEkFscmVhZHlJbml0aWFsaXplZAAAAAAAAgAAABdDYWxsZXIgaXMgbm90IHRoZSBhZG1pbgAAAAAMVW5hdXRob3JpemVkAAAAAwAAABxJc3N1YW5jZSBpcyBjdXJyZW50bHkgcGF1c2VkAAAADklzc3VhbmNlUGF1c2VkAAAAAAAEAAAAH0Fzc2V0IGlzIG5vdCBhY3RpdmUgaW4gcmVnaXN0cnkAAAAADkFzc2V0Tm90QWN0aXZlAAAAAAAFAAAAGFVzZXIgaXMgbm90IEtZQyBhcHByb3ZlZAAAAA5LeWNOb3RBcHByb3ZlZAAAAAAABgAAABpQYXltZW50IGFzc2V0IG5vdCBhY2NlcHRlZAAAAAAAF1BheW1lbnRBc3NldE5vdEFjY2VwdGVkAAAAAAcAAAAcUHJpY2Ugbm90IHNldCBmb3IgdGhpcyBhc3NldAAAAAtQcmljZU5vdFNldAAAAAAIAAAADkludmFsaWQgYW1vdW50AAAAAAANSW52YWxpZEFtb3VudAAAAAAAAAkAAAAPQXNzZXQgbm90IGZvdW5kAAAAAA1Bc3NldE5vdEZvdW5kAAAAAAAACgAAAB5Ub2tlbiBub3QgY29uZmlndXJlZCBmb3IgYXNzZXQAAAAAABJUb2tlbk5vdENvbmZpZ3VyZWQAAAAAAAs=",
        "AAAAAQAAACBQcmljZSBjb25maWd1cmF0aW9uIGZvciBhbiBhc3NldAAAAAAAAAAJUHJpY2VJbmZvAAAAAAAAAgAAADdQYXltZW50IGFzc2V0IGNvbnRyYWN0IGFkZHJlc3MgKGUuZy4sIFVTREMgU0FDIGFkZHJlc3MpAAAAAA1wYXltZW50X2Fzc2V0AAAAAAAAEwAAAFFQcmljZSBwZXIgdW5pdCBpbiBzbWFsbGVzdCBkZW5vbWluYXRpb24gKGUuZy4sIDFfMDAwXzAwMCA9IDEgVVNEQyBmb3IgNyBkZWNpbWFscykAAAAAAAAOcHJpY2VfcGVyX3VuaXQAAAAAAAs=",
        "AAAAAQAAAAAAAAAAAAAACUFzc2V0SW5mbwAAAAAAAAQAAAAAAAAABmFjdGl2ZQAAAAAAAQAAAAAAAAAOZXhwb3N1cmVfcmF0aW8AAAAAAAsAAAAAAAAABmlzc3VlcgAAAAAAEwAAAAAAAAAMbWV0YWRhdGFfdXJpAAAAEA==",
        "AAAAAAAAARJJbml0aWFsaXplIHRoZSBJc3N1YW5jZUNvbnRyb2xsZXIgY29udHJhY3QuCgojIEFyZ3VtZW50cwoqIGBhZG1pbmAgLSBBZG1pbiBhZGRyZXNzIHdpdGggY29udHJvbCBvdmVyIHRoZSBjb250cmFjdAoqIGBhc3NldF9yZWdpc3RyeWAgLSBBZGRyZXNzIG9mIHRoZSBBc3NldFJlZ2lzdHJ5IGNvbnRyYWN0CiogYGt5Y19yZWdpc3RyeWAgLSBBZGRyZXNzIG9mIHRoZSBLeWNSZWdpc3RyeSBjb250cmFjdAoqIGB0cmVhc3VyeWAgLSBBZGRyZXNzIHdoZXJlIHBheW1lbnRzIGFyZSBzZW50AAAAAAAKaW5pdGlhbGl6ZQAAAAAABAAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAA5hc3NldF9yZWdpc3RyeQAAAAAAEwAAAAAAAAAMa3ljX3JlZ2lzdHJ5AAAAEwAAAAAAAAAIdHJlYXN1cnkAAAATAAAAAA==",
        "AAAAAAAAAMlTZXQgdGhlIHByaWNlIGZvciBhbiBhc3NldC4KCiMgQXJndW1lbnRzCiogYGFzc2V0X2NvZGVgIC0gVGhlIGFzc2V0IGNvZGUgKGUuZy4sIFRTTEFIKQoqIGBwYXltZW50X2Fzc2V0YCAtIFRoZSBwYXltZW50IHRva2VuIGFkZHJlc3MgKGUuZy4sIFVTREMgU0FDKQoqIGBwcmljZV9wZXJfdW5pdGAgLSBQcmljZSBpbiBzbWFsbGVzdCBkZW5vbWluYXRpb24AAAAAAAAJc2V0X3ByaWNlAAAAAAAAAwAAAAAAAAAKYXNzZXRfY29kZQAAAAAAEQAAAAAAAAANcGF5bWVudF9hc3NldAAAAAAAABMAAAAAAAAADnByaWNlX3Blcl91bml0AAAAAAALAAAAAA==",
        "AAAAAAAAANNDb25maWd1cmUgdGhlIHRva2VuIGNvbnRyYWN0IGFkZHJlc3MgZm9yIGFuIGFzc2V0LgpUaGlzIGlzIHRoZSBTb3JvYmFuIHRva2VuIHRoYXQgd2lsbCBiZSBtaW50ZWQuCgojIEFyZ3VtZW50cwoqIGBhc3NldF9jb2RlYCAtIFRoZSBhc3NldCBjb2RlIChlLmcuLCBUU0xBSCkKKiBgdG9rZW5fYWRkcmVzc2AgLSBUaGUgU29yb2JhbiB0b2tlbiBjb250cmFjdCBhZGRyZXNzAAAAABJzZXRfdG9rZW5fY29udHJhY3QAAAAAAAIAAAAAAAAACmFzc2V0X2NvZGUAAAAAABEAAAAAAAAADXRva2VuX2FkZHJlc3MAAAAAAAATAAAAAA==",
        "AAAAAAAAAB5BZGQgYW4gYWNjZXB0ZWQgcGF5bWVudCBhc3NldC4AAAAAABFhZGRfcGF5bWVudF9hc3NldAAAAAAAAAEAAAAAAAAADWFzc2V0X2FkZHJlc3MAAAAAAAATAAAAAA==",
        "AAAAAAAAACFSZW1vdmUgYW4gYWNjZXB0ZWQgcGF5bWVudCBhc3NldC4AAAAAAAAUcmVtb3ZlX3BheW1lbnRfYXNzZXQAAAABAAAAAAAAAA1hc3NldF9hZGRyZXNzAAAAAAAAEwAAAAA=",
        "AAAAAAAAACBQYXVzZSBpc3N1YW5jZSAoZW1lcmdlbmN5IHN0b3ApLgAAAA5wYXVzZV9pc3N1YW5jZQAAAAAAAAAAAAA=",
        "AAAAAAAAABBSZXN1bWUgaXNzdWFuY2UuAAAAD3Jlc3VtZV9pc3N1YW5jZQAAAAAAAAAAAA==",
        "AAAAAAAAABZUcmFuc2ZlciBhZG1pbiByaWdodHMuAAAAAAAJc2V0X2FkbWluAAAAAAAAAQAAAAAAAAAJbmV3X2FkbWluAAAAAAAAEwAAAAA=",
        "AAAAAAAAABhVcGRhdGUgdHJlYXN1cnkgYWRkcmVzcy4AAAAMc2V0X3RyZWFzdXJ5AAAAAQAAAAAAAAAMbmV3X3RyZWFzdXJ5AAAAEwAAAAA=",
        "AAAAAAAAAZ9CdXkgdG9rZW5zIHRocm91Z2ggcHJpbWFyeSBpc3N1YW5jZS4KCiMgRmxvdwoxLiBDaGVjayBpc3N1YW5jZSBpcyBub3QgcGF1c2VkCjIuIENoZWNrIGFzc2V0IGlzIGFjdGl2ZSBpbiBBc3NldFJlZ2lzdHJ5CjMuIENoZWNrIGJ1eWVyIGlzIEtZQy1hcHByb3ZlZAo0LiBDYWxjdWxhdGUgcGF5bWVudCBhbW91bnQKNS4gVHJhbnNmZXIgcGF5bWVudCBmcm9tIGJ1eWVyIHRvIHRyZWFzdXJ5CjYuIE1pbnQgdG9rZW5zIHRvIGJ1eWVyCjcuIEVtaXQgaXNzdWFuY2UgZXZlbnQKCiMgQXJndW1lbnRzCiogYGJ1eWVyYCAtIFRoZSBhZGRyZXNzIGJ1eWluZyB0b2tlbnMgKG11c3Qgc2lnbikKKiBgYXNzZXRfY29kZWAgLSBUaGUgYXNzZXQgdG8gYnV5IChlLmcuLCBUU0xBSCkKKiBgYW1vdW50YCAtIE51bWJlciBvZiB0b2tlbnMgdG8gYnV5AAAAAANidXkAAAAAAwAAAAAAAAAFYnV5ZXIAAAAAAAATAAAAAAAAAAphc3NldF9jb2RlAAAAAAARAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAA",
        "AAAAAAAAACBHZXQgdGhlIHByaWNlIGluZm8gZm9yIGFuIGFzc2V0LgAAAAlnZXRfcHJpY2UAAAAAAAABAAAAAAAAAAphc3NldF9jb2RlAAAAAAARAAAAAQAAB9AAAAAJUHJpY2VJbmZvAAAA",
        "AAAAAAAAACBHZXQgYWxsIGFjY2VwdGVkIHBheW1lbnQgYXNzZXRzLgAAABtnZXRfYWNjZXB0ZWRfcGF5bWVudF9hc3NldHMAAAAAAAAAAAEAAAPqAAAAEw==",
        "AAAAAAAAABxDaGVjayBpZiBpc3N1YW5jZSBpcyBwYXVzZWQuAAAACWlzX3BhdXNlZAAAAAAAAAAAAAABAAAAAQ==",
        "AAAAAAAAABVHZXQgdHJlYXN1cnkgYWRkcmVzcy4AAAAAAAAMZ2V0X3RyZWFzdXJ5AAAAAAAAAAEAAAAT",
        "AAAAAAAAABJHZXQgYWRtaW4gYWRkcmVzcy4AAAAAAAlnZXRfYWRtaW4AAAAAAAAAAAAAAQAAABM=",
        "AAAAAAAAAChHZXQgdG9rZW4gY29udHJhY3QgYWRkcmVzcyBmb3IgYW4gYXNzZXQuAAAAEmdldF90b2tlbl9jb250cmFjdAAAAAAAAQAAAAAAAAAKYXNzZXRfY29kZQAAAAAAEQAAAAEAAAAT",
        "AAAAAAAAACNHZXQgQXNzZXRSZWdpc3RyeSBjb250cmFjdCBhZGRyZXNzLgAAAAASZ2V0X2Fzc2V0X3JlZ2lzdHJ5AAAAAAAAAAAAAQAAABM=",
        "AAAAAAAAACFHZXQgS3ljUmVnaXN0cnkgY29udHJhY3QgYWRkcmVzcy4AAAAAAAAQZ2V0X2t5Y19yZWdpc3RyeQAAAAAAAAABAAAAEw==",
      ]),
      options,
    );
  }
  public readonly fromJSON = {
    initialize: this.txFromJSON<null>,
    set_price: this.txFromJSON<null>,
    set_token_contract: this.txFromJSON<null>,
    add_payment_asset: this.txFromJSON<null>,
    remove_payment_asset: this.txFromJSON<null>,
    pause_issuance: this.txFromJSON<null>,
    resume_issuance: this.txFromJSON<null>,
    set_admin: this.txFromJSON<null>,
    set_treasury: this.txFromJSON<null>,
    buy: this.txFromJSON<null>,
    get_price: this.txFromJSON<PriceInfo>,
    get_accepted_payment_assets: this.txFromJSON<Array<string>>,
    is_paused: this.txFromJSON<boolean>,
    get_treasury: this.txFromJSON<string>,
    get_admin: this.txFromJSON<string>,
    get_token_contract: this.txFromJSON<string>,
    get_asset_registry: this.txFromJSON<string>,
    get_kyc_registry: this.txFromJSON<string>,
  };
}
