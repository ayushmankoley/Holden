import * as IssuanceControllerClient from "issuance_controller";

const rpcUrl = "https://soroban-testnet.stellar.org";
const networkPassphrase = "Test SDF Network ; September 2015";
const contractId = "CBA5OGYON72HS535NQKSLOGRWFZNYPIFBWYKIQDIDHLKHFN6DI2U5XVK";

const ASSETS = [
    "TSLAH", "AAPLH", "METAH", "AMZNH", "NVDAH",
    "SONYH", "TCSH", "RELIANCEH", "INFYH", "BAJFINANCEH",
    "XAUUSDH", "XAGUSDH"
];

async function checkAllTokens() {
    const client = new IssuanceControllerClient.Client({
        networkPassphrase,
        contractId,
        rpcUrl,
        publicKey: undefined,
    });

    console.log("Checking token configuration for all assets...");
    console.log("------------------------------------------------");

    for (const assetCode of ASSETS) {
        try {
            // Check if token address is set
            const tokenAddress = await client.get_token_contract({ asset_code: assetCode });
            console.log(`[OK] ${assetCode}: ${tokenAddress.result}`);
        } catch (err) {
            console.log(`[FAIL] ${assetCode}: Token contract NOT set`);
        }
    }
}

checkAllTokens();
