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
    contractId: "CA2XEEBMTCFKCCDYPRULQKYI56IGCRXWHVGZ4RDIK2KDDGQXKZKAX7N4",
  },
} as const;

export interface AssetInfo {
  /**
   * Whether the asset is currently active
   */
  active: boolean;
  /**
   * Exposure ratio (1_000_000 = 1.0)
   */
  exposure_ratio: i128;
  /**
   * Stellar issuer account (Holden issuer)
   */
  issuer: string;
  /**
   * Off-chain metadata reference (IPFS / HTTPS)
   */
  metadata_uri: string;
}

export interface Client {
  /**
   * Construct and simulate a register_asset transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Register a new Holden asset
   * Can only be called by Holden admin
   */
  register_asset: (
    {
      admin,
      asset_code,
      issuer,
      metadata_uri,
    }: {
      admin: string;
      asset_code: string;
      issuer: string;
      metadata_uri: string;
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
   * Construct and simulate a update_exposure_ratio transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Update exposure ratio after issuer buyback + burn
   */
  update_exposure_ratio: (
    {
      admin,
      asset_code,
      new_ratio,
    }: { admin: string; asset_code: string; new_ratio: i128 },
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
   * Construct and simulate a set_active transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Enable or disable an asset
   */
  set_active: (
    {
      admin,
      asset_code,
      active,
    }: { admin: string; asset_code: string; active: boolean },
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
   * Construct and simulate a get_asset transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Public read: get asset info
   */
  get_asset: (
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
  ) => Promise<AssembledTransaction<AssetInfo>>;
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
        "AAAAAQAAAAAAAAAAAAAACUFzc2V0SW5mbwAAAAAAAAQAAAAlV2hldGhlciB0aGUgYXNzZXQgaXMgY3VycmVudGx5IGFjdGl2ZQAAAAAAAAZhY3RpdmUAAAAAAAEAAAAgRXhwb3N1cmUgcmF0aW8gKDFfMDAwXzAwMCA9IDEuMCkAAAAOZXhwb3N1cmVfcmF0aW8AAAAAAAsAAAAmU3RlbGxhciBpc3N1ZXIgYWNjb3VudCAoSG9sZGVuIGlzc3VlcikAAAAAAAZpc3N1ZXIAAAAAABMAAAArT2ZmLWNoYWluIG1ldGFkYXRhIHJlZmVyZW5jZSAoSVBGUyAvIEhUVFBTKQAAAAAMbWV0YWRhdGFfdXJpAAAAEA==",
        "AAAAAAAAAD5SZWdpc3RlciBhIG5ldyBIb2xkZW4gYXNzZXQKQ2FuIG9ubHkgYmUgY2FsbGVkIGJ5IEhvbGRlbiBhZG1pbgAAAAAADnJlZ2lzdGVyX2Fzc2V0AAAAAAAEAAAAAAAAAAVhZG1pbgAAAAAAABMAAAAAAAAACmFzc2V0X2NvZGUAAAAAABEAAAAAAAAABmlzc3VlcgAAAAAAEwAAAAAAAAAMbWV0YWRhdGFfdXJpAAAAEAAAAAA=",
        "AAAAAAAAADFVcGRhdGUgZXhwb3N1cmUgcmF0aW8gYWZ0ZXIgaXNzdWVyIGJ1eWJhY2sgKyBidXJuAAAAAAAAFXVwZGF0ZV9leHBvc3VyZV9yYXRpbwAAAAAAAAMAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAAKYXNzZXRfY29kZQAAAAAAEQAAAAAAAAAJbmV3X3JhdGlvAAAAAAAACwAAAAA=",
        "AAAAAAAAABpFbmFibGUgb3IgZGlzYWJsZSBhbiBhc3NldAAAAAAACnNldF9hY3RpdmUAAAAAAAMAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAAKYXNzZXRfY29kZQAAAAAAEQAAAAAAAAAGYWN0aXZlAAAAAAABAAAAAA==",
        "AAAAAAAAABtQdWJsaWMgcmVhZDogZ2V0IGFzc2V0IGluZm8AAAAACWdldF9hc3NldAAAAAAAAAEAAAAAAAAACmFzc2V0X2NvZGUAAAAAABEAAAABAAAH0AAAAAlBc3NldEluZm8AAAA=",
      ]),
      options,
    );
  }
  public readonly fromJSON = {
    register_asset: this.txFromJSON<null>,
    update_exposure_ratio: this.txFromJSON<null>,
    set_active: this.txFromJSON<null>,
    get_asset: this.txFromJSON<AssetInfo>,
  };
}
