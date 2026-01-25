import * as Client from 'asset_registry';
import { rpcUrl } from './util';

export default new Client.Client({
  networkPassphrase: 'Test SDF Network ; September 2015',
  contractId: 'CA2XEEBMTCFKCCDYPRULQKYI56IGCRXWHVGZ4RDIK2KDDGQXKZKAX7N4',
  rpcUrl,
  publicKey: undefined,
});
