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
    contractId: "CAJ4DCJDREAJICGVELJSYCSJ3I6NBDQP4A43AGVW4TQJHIWUUTGNR533",
  },
} as const;

export const RedemptionError = {
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
   * Redemption is currently paused
   */
  4: { message: "RedemptionPaused" },
  /**
   * Asset is not active in registry
   */
  5: { message: "AssetNotActive" },
  /**
   * User is not KYC approved
   */
  6: { message: "KycNotApproved" },
  /**
   * Amount below minimum
   */
  7: { message: "BelowMinimum" },
  /**
   * Invalid amount
   */
  8: { message: "InvalidAmount" },
  /**
   * Token not configured for asset
   */
  9: { message: "TokenNotConfigured" },
};

export interface AssetInfo {
  active: boolean;
  exposure_ratio: i128;
  issuer: string;
  metadata_uri: string;
}

export interface Client {
  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Initialize the RedemptionController contract.
   *
   * # Arguments
   * * `admin` - Admin address with control over the contract
   * * `asset_registry` - Address of the AssetRegistry contract
   * * `kyc_registry` - Address of the KycRegistry contract
   */
  initialize: (
    {
      admin,
      asset_registry,
      kyc_registry,
    }: { admin: string; asset_registry: string; kyc_registry: string },
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
   * Construct and simulate a set_minimum_amount transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Set the minimum redemption amount for an asset.
   */
  set_minimum_amount: (
    { asset_code, min_amount }: { asset_code: string; min_amount: i128 },
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
   * Construct and simulate a pause_redemption transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Pause redemption (emergency stop).
   */
  pause_redemption: (options?: {
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
   * Construct and simulate a resume_redemption transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Resume redemption.
   */
  resume_redemption: (options?: {
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
   * Construct and simulate a redeem transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Redeem tokens - burns tokens and emits event for off-chain settlement.
   *
   * # Flow
   * 1. Check redemption is not paused
   * 2. Check user is KYC-approved
   * 3. Check asset is active in AssetRegistry
   * 4. Check amount ≥ minimum
   * 5. Burn tokens from user
   * 6. Emit RedemptionRequested event
   *
   * # Arguments
   * * `user` - The address redeeming tokens (must sign)
   * * `asset_code` - The asset to redeem (e.g., TSLAH)
   * * `amount` - Number of tokens to redeem
   */
  redeem: (
    {
      user,
      asset_code,
      amount,
    }: { user: string; asset_code: string; amount: i128 },
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
   * Construct and simulate a get_minimum_amount transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get the minimum redemption amount for an asset.
   */
  get_minimum_amount: (
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
  ) => Promise<AssembledTransaction<i128>>;

  /**
   * Construct and simulate a is_paused transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Check if redemption is paused.
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
        "AAAABAAAAAAAAAAAAAAAD1JlZGVtcHRpb25FcnJvcgAAAAAJAAAAGENvbnRyYWN0IG5vdCBpbml0aWFsaXplZAAAAA5Ob3RJbml0aWFsaXplZAAAAAAAAQAAABxDb250cmFjdCBhbHJlYWR5IGluaXRpYWxpemVkAAAAEkFscmVhZHlJbml0aWFsaXplZAAAAAAAAgAAABdDYWxsZXIgaXMgbm90IHRoZSBhZG1pbgAAAAAMVW5hdXRob3JpemVkAAAAAwAAAB5SZWRlbXB0aW9uIGlzIGN1cnJlbnRseSBwYXVzZWQAAAAAABBSZWRlbXB0aW9uUGF1c2VkAAAABAAAAB9Bc3NldCBpcyBub3QgYWN0aXZlIGluIHJlZ2lzdHJ5AAAAAA5Bc3NldE5vdEFjdGl2ZQAAAAAABQAAABhVc2VyIGlzIG5vdCBLWUMgYXBwcm92ZWQAAAAOS3ljTm90QXBwcm92ZWQAAAAAAAYAAAAUQW1vdW50IGJlbG93IG1pbmltdW0AAAAMQmVsb3dNaW5pbXVtAAAABwAAAA5JbnZhbGlkIGFtb3VudAAAAAAADUludmFsaWRBbW91bnQAAAAAAAAIAAAAHlRva2VuIG5vdCBjb25maWd1cmVkIGZvciBhc3NldAAAAAAAElRva2VuTm90Q29uZmlndXJlZAAAAAAACQ==",
        "AAAAAQAAAAAAAAAAAAAACUFzc2V0SW5mbwAAAAAAAAQAAAAAAAAABmFjdGl2ZQAAAAAAAQAAAAAAAAAOZXhwb3N1cmVfcmF0aW8AAAAAAAsAAAAAAAAABmlzc3VlcgAAAAAAEwAAAAAAAAAMbWV0YWRhdGFfdXJpAAAAEA==",
        "AAAAAAAAAOVJbml0aWFsaXplIHRoZSBSZWRlbXB0aW9uQ29udHJvbGxlciBjb250cmFjdC4KCiMgQXJndW1lbnRzCiogYGFkbWluYCAtIEFkbWluIGFkZHJlc3Mgd2l0aCBjb250cm9sIG92ZXIgdGhlIGNvbnRyYWN0CiogYGFzc2V0X3JlZ2lzdHJ5YCAtIEFkZHJlc3Mgb2YgdGhlIEFzc2V0UmVnaXN0cnkgY29udHJhY3QKKiBga3ljX3JlZ2lzdHJ5YCAtIEFkZHJlc3Mgb2YgdGhlIEt5Y1JlZ2lzdHJ5IGNvbnRyYWN0AAAAAAAACmluaXRpYWxpemUAAAAAAAMAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAAOYXNzZXRfcmVnaXN0cnkAAAAAABMAAAAAAAAADGt5Y19yZWdpc3RyeQAAABMAAAAA",
        "AAAAAAAAAC9TZXQgdGhlIG1pbmltdW0gcmVkZW1wdGlvbiBhbW91bnQgZm9yIGFuIGFzc2V0LgAAAAASc2V0X21pbmltdW1fYW1vdW50AAAAAAACAAAAAAAAAAphc3NldF9jb2RlAAAAAAARAAAAAAAAAAptaW5fYW1vdW50AAAAAAALAAAAAA==",
        "AAAAAAAAADJDb25maWd1cmUgdGhlIHRva2VuIGNvbnRyYWN0IGFkZHJlc3MgZm9yIGFuIGFzc2V0LgAAAAAAEnNldF90b2tlbl9jb250cmFjdAAAAAAAAgAAAAAAAAAKYXNzZXRfY29kZQAAAAAAEQAAAAAAAAANdG9rZW5fYWRkcmVzcwAAAAAAABMAAAAA",
        "AAAAAAAAACJQYXVzZSByZWRlbXB0aW9uIChlbWVyZ2VuY3kgc3RvcCkuAAAAAAAQcGF1c2VfcmVkZW1wdGlvbgAAAAAAAAAA",
        "AAAAAAAAABJSZXN1bWUgcmVkZW1wdGlvbi4AAAAAABFyZXN1bWVfcmVkZW1wdGlvbgAAAAAAAAAAAAAA",
        "AAAAAAAAABZUcmFuc2ZlciBhZG1pbiByaWdodHMuAAAAAAAJc2V0X2FkbWluAAAAAAAAAQAAAAAAAAAJbmV3X2FkbWluAAAAAAAAEwAAAAA=",
        "AAAAAAAAAatSZWRlZW0gdG9rZW5zIC0gYnVybnMgdG9rZW5zIGFuZCBlbWl0cyBldmVudCBmb3Igb2ZmLWNoYWluIHNldHRsZW1lbnQuCgojIEZsb3cKMS4gQ2hlY2sgcmVkZW1wdGlvbiBpcyBub3QgcGF1c2VkCjIuIENoZWNrIHVzZXIgaXMgS1lDLWFwcHJvdmVkCjMuIENoZWNrIGFzc2V0IGlzIGFjdGl2ZSBpbiBBc3NldFJlZ2lzdHJ5CjQuIENoZWNrIGFtb3VudCDiiaUgbWluaW11bQo1LiBCdXJuIHRva2VucyBmcm9tIHVzZXIKNi4gRW1pdCBSZWRlbXB0aW9uUmVxdWVzdGVkIGV2ZW50CgojIEFyZ3VtZW50cwoqIGB1c2VyYCAtIFRoZSBhZGRyZXNzIHJlZGVlbWluZyB0b2tlbnMgKG11c3Qgc2lnbikKKiBgYXNzZXRfY29kZWAgLSBUaGUgYXNzZXQgdG8gcmVkZWVtIChlLmcuLCBUU0xBSCkKKiBgYW1vdW50YCAtIE51bWJlciBvZiB0b2tlbnMgdG8gcmVkZWVtAAAAAAZyZWRlZW0AAAAAAAMAAAAAAAAABHVzZXIAAAATAAAAAAAAAAphc3NldF9jb2RlAAAAAAARAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAA",
        "AAAAAAAAAC9HZXQgdGhlIG1pbmltdW0gcmVkZW1wdGlvbiBhbW91bnQgZm9yIGFuIGFzc2V0LgAAAAASZ2V0X21pbmltdW1fYW1vdW50AAAAAAABAAAAAAAAAAphc3NldF9jb2RlAAAAAAARAAAAAQAAAAs=",
        "AAAAAAAAAB5DaGVjayBpZiByZWRlbXB0aW9uIGlzIHBhdXNlZC4AAAAAAAlpc19wYXVzZWQAAAAAAAAAAAAAAQAAAAE=",
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
    set_minimum_amount: this.txFromJSON<null>,
    set_token_contract: this.txFromJSON<null>,
    pause_redemption: this.txFromJSON<null>,
    resume_redemption: this.txFromJSON<null>,
    set_admin: this.txFromJSON<null>,
    redeem: this.txFromJSON<null>,
    get_minimum_amount: this.txFromJSON<i128>,
    is_paused: this.txFromJSON<boolean>,
    get_admin: this.txFromJSON<string>,
    get_token_contract: this.txFromJSON<string>,
    get_asset_registry: this.txFromJSON<string>,
    get_kyc_registry: this.txFromJSON<string>,
  };
}
