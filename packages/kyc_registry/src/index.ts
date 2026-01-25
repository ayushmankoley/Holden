import { Buffer } from "buffer";
import { Address } from '@stellar/stellar-sdk';
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from '@stellar/stellar-sdk/contract';
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
} from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk'
export * as contract from '@stellar/stellar-sdk/contract'
export * as rpc from '@stellar/stellar-sdk/rpc'

if (typeof window !== 'undefined') {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CA7BJCH7EQ74WJY3TY7XDMJYU2QJPMVMZUOEVJ54IJ3C6GMMZZM43DFU",
  }
} as const

export const KycError = {
  /**
   * Contract has not been initialized
   */
  1: {message:"NotInitialized"},
  /**
   * Contract has already been initialized
   */
  2: {message:"AlreadyInitialized"},
  /**
   * Caller is not the admin
   */
  3: {message:"Unauthorized"},
  /**
   * Address is already KYC approved
   */
  4: {message:"AlreadyApproved"},
  /**
   * Address is not KYC approved
   */
  5: {message:"NotApproved"},
  /**
   * Invalid address provided
   */
  6: {message:"InvalidAddress"}
}

export interface Client {
  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Initialize the KYC Registry with an admin address.
   * This must be called once before any other functions.
   * 
   * # Arguments
   * * `env` - The contract environment
   * * `admin` - The address that will have admin privileges
   * 
   * # Panics
   * Panics if the contract is already initialized
   */
  initialize: ({admin}: {admin: string}, options?: {
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
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a add_to_kyc transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Add an address to the KYC approved list.
   * Can only be called by the admin.
   * 
   * # Arguments
   * * `env` - The contract environment
   * * `address` - The address to approve for KYC
   * 
   * # Panics
   * Panics if:
   * - Contract is not initialized
   * - Caller is not the admin
   * - Address is already approved
   */
  add_to_kyc: ({address}: {address: string}, options?: {
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
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a remove_from_kyc transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Remove an address from the KYC approved list.
   * Can only be called by the admin.
   * 
   * # Arguments
   * * `env` - The contract environment
   * * `address` - The address to remove from KYC
   * 
   * # Panics
   * Panics if:
   * - Contract is not initialized
   * - Caller is not the admin
   * - Address is not currently approved
   */
  remove_from_kyc: ({address}: {address: string}, options?: {
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
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a set_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Transfer admin rights to a new address.
   * Can only be called by the current admin.
   * 
   * # Arguments
   * * `env` - The contract environment
   * * `new_admin` - The new admin address
   * 
   * # Panics
   * Panics if:
   * - Contract is not initialized
   * - Caller is not the current admin
   */
  set_admin: ({new_admin}: {new_admin: string}, options?: {
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
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a is_kyc_approved transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Check if an address is KYC approved.
   * This is a public read function that anyone can call.
   * 
   * # Arguments
   * * `env` - The contract environment
   * * `address` - The address to check
   * 
   * # Returns
   * `true` if the address is KYC approved, `false` otherwise
   */
  is_kyc_approved: ({address}: {address: string}, options?: {
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
  }) => Promise<AssembledTransaction<boolean>>

  /**
   * Construct and simulate a get_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get the current admin address.
   * 
   * # Arguments
   * * `env` - The contract environment
   * 
   * # Returns
   * The admin address
   * 
   * # Panics
   * Panics if the contract is not initialized
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
  }) => Promise<AssembledTransaction<string>>

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
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAABAAAAAAAAAAAAAAACEt5Y0Vycm9yAAAABgAAACFDb250cmFjdCBoYXMgbm90IGJlZW4gaW5pdGlhbGl6ZWQAAAAAAAAOTm90SW5pdGlhbGl6ZWQAAAAAAAEAAAAlQ29udHJhY3QgaGFzIGFscmVhZHkgYmVlbiBpbml0aWFsaXplZAAAAAAAABJBbHJlYWR5SW5pdGlhbGl6ZWQAAAAAAAIAAAAXQ2FsbGVyIGlzIG5vdCB0aGUgYWRtaW4AAAAADFVuYXV0aG9yaXplZAAAAAMAAAAfQWRkcmVzcyBpcyBhbHJlYWR5IEtZQyBhcHByb3ZlZAAAAAAPQWxyZWFkeUFwcHJvdmVkAAAAAAQAAAAbQWRkcmVzcyBpcyBub3QgS1lDIGFwcHJvdmVkAAAAAAtOb3RBcHByb3ZlZAAAAAAFAAAAGEludmFsaWQgYWRkcmVzcyBwcm92aWRlZAAAAA5JbnZhbGlkQWRkcmVzcwAAAAAABg==",
        "AAAAAAAAAQdJbml0aWFsaXplIHRoZSBLWUMgUmVnaXN0cnkgd2l0aCBhbiBhZG1pbiBhZGRyZXNzLgpUaGlzIG11c3QgYmUgY2FsbGVkIG9uY2UgYmVmb3JlIGFueSBvdGhlciBmdW5jdGlvbnMuCgojIEFyZ3VtZW50cwoqIGBlbnZgIC0gVGhlIGNvbnRyYWN0IGVudmlyb25tZW50CiogYGFkbWluYCAtIFRoZSBhZGRyZXNzIHRoYXQgd2lsbCBoYXZlIGFkbWluIHByaXZpbGVnZXMKCiMgUGFuaWNzClBhbmljcyBpZiB0aGUgY29udHJhY3QgaXMgYWxyZWFkeSBpbml0aWFsaXplZAAAAAAKaW5pdGlhbGl6ZQAAAAAAAQAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAA==",
        "AAAAAAAAARFBZGQgYW4gYWRkcmVzcyB0byB0aGUgS1lDIGFwcHJvdmVkIGxpc3QuCkNhbiBvbmx5IGJlIGNhbGxlZCBieSB0aGUgYWRtaW4uCgojIEFyZ3VtZW50cwoqIGBlbnZgIC0gVGhlIGNvbnRyYWN0IGVudmlyb25tZW50CiogYGFkZHJlc3NgIC0gVGhlIGFkZHJlc3MgdG8gYXBwcm92ZSBmb3IgS1lDCgojIFBhbmljcwpQYW5pY3MgaWY6Ci0gQ29udHJhY3QgaXMgbm90IGluaXRpYWxpemVkCi0gQ2FsbGVyIGlzIG5vdCB0aGUgYWRtaW4KLSBBZGRyZXNzIGlzIGFscmVhZHkgYXBwcm92ZWQAAAAAAAAKYWRkX3RvX2t5YwAAAAAAAQAAAAAAAAAHYWRkcmVzcwAAAAATAAAAAA==",
        "AAAAAAAAARxSZW1vdmUgYW4gYWRkcmVzcyBmcm9tIHRoZSBLWUMgYXBwcm92ZWQgbGlzdC4KQ2FuIG9ubHkgYmUgY2FsbGVkIGJ5IHRoZSBhZG1pbi4KCiMgQXJndW1lbnRzCiogYGVudmAgLSBUaGUgY29udHJhY3QgZW52aXJvbm1lbnQKKiBgYWRkcmVzc2AgLSBUaGUgYWRkcmVzcyB0byByZW1vdmUgZnJvbSBLWUMKCiMgUGFuaWNzClBhbmljcyBpZjoKLSBDb250cmFjdCBpcyBub3QgaW5pdGlhbGl6ZWQKLSBDYWxsZXIgaXMgbm90IHRoZSBhZG1pbgotIEFkZHJlc3MgaXMgbm90IGN1cnJlbnRseSBhcHByb3ZlZAAAAA9yZW1vdmVfZnJvbV9reWMAAAAAAQAAAAAAAAAHYWRkcmVzcwAAAAATAAAAAA==",
        "AAAAAAAAAPtUcmFuc2ZlciBhZG1pbiByaWdodHMgdG8gYSBuZXcgYWRkcmVzcy4KQ2FuIG9ubHkgYmUgY2FsbGVkIGJ5IHRoZSBjdXJyZW50IGFkbWluLgoKIyBBcmd1bWVudHMKKiBgZW52YCAtIFRoZSBjb250cmFjdCBlbnZpcm9ubWVudAoqIGBuZXdfYWRtaW5gIC0gVGhlIG5ldyBhZG1pbiBhZGRyZXNzCgojIFBhbmljcwpQYW5pY3MgaWY6Ci0gQ29udHJhY3QgaXMgbm90IGluaXRpYWxpemVkCi0gQ2FsbGVyIGlzIG5vdCB0aGUgY3VycmVudCBhZG1pbgAAAAAJc2V0X2FkbWluAAAAAAAAAQAAAAAAAAAJbmV3X2FkbWluAAAAAAAAEwAAAAA=",
        "AAAAAAAAAPBDaGVjayBpZiBhbiBhZGRyZXNzIGlzIEtZQyBhcHByb3ZlZC4KVGhpcyBpcyBhIHB1YmxpYyByZWFkIGZ1bmN0aW9uIHRoYXQgYW55b25lIGNhbiBjYWxsLgoKIyBBcmd1bWVudHMKKiBgZW52YCAtIFRoZSBjb250cmFjdCBlbnZpcm9ubWVudAoqIGBhZGRyZXNzYCAtIFRoZSBhZGRyZXNzIHRvIGNoZWNrCgojIFJldHVybnMKYHRydWVgIGlmIHRoZSBhZGRyZXNzIGlzIEtZQyBhcHByb3ZlZCwgYGZhbHNlYCBvdGhlcndpc2UAAAAPaXNfa3ljX2FwcHJvdmVkAAAAAAEAAAAAAAAAB2FkZHJlc3MAAAAAEwAAAAEAAAAB",
        "AAAAAAAAAJ9HZXQgdGhlIGN1cnJlbnQgYWRtaW4gYWRkcmVzcy4KCiMgQXJndW1lbnRzCiogYGVudmAgLSBUaGUgY29udHJhY3QgZW52aXJvbm1lbnQKCiMgUmV0dXJucwpUaGUgYWRtaW4gYWRkcmVzcwoKIyBQYW5pY3MKUGFuaWNzIGlmIHRoZSBjb250cmFjdCBpcyBub3QgaW5pdGlhbGl6ZWQAAAAACWdldF9hZG1pbgAAAAAAAAAAAAABAAAAEw==" ]),
      options
    )
  }
  public readonly fromJSON = {
    initialize: this.txFromJSON<null>,
        add_to_kyc: this.txFromJSON<null>,
        remove_from_kyc: this.txFromJSON<null>,
        set_admin: this.txFromJSON<null>,
        is_kyc_approved: this.txFromJSON<boolean>,
        get_admin: this.txFromJSON<string>
  }
}