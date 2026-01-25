import * as Client from "kyc_registry";
import { rpcUrl } from "./util";

export default new Client.Client({
  networkPassphrase: "Test SDF Network ; September 2015",
  contractId: "CA7BJCH7EQ74WJY3TY7XDMJYU2QJPMVMZUOEVJ54IJ3C6GMMZZM43DFU",
  rpcUrl,
  publicKey: undefined,
});
