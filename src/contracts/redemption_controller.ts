import * as Client from "redemption_controller";
import { rpcUrl } from "./util";

export default new Client.Client({
  networkPassphrase: "Test SDF Network ; September 2015",
  contractId: "CAJ4DCJDREAJICGVELJSYCSJ3I6NBDQP4A43AGVW4TQJHIWUUTGNR533",
  rpcUrl,
  publicKey: undefined,
});
