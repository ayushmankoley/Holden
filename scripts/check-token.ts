import * as IssuanceControllerClient from "issuance_controller";

const rpcUrl = "https://soroban-testnet.stellar.org";
const networkPassphrase = "Test SDF Network ; September 2015";
const contractId = "CBA5OGYON72HS535NQKSLOGRWFZNYPIFBWYKIQDIDHLKHFN6DI2U5XVK";

async function checkTokenConfig() {
    const client = new IssuanceControllerClient.Client({
        networkPassphrase,
        contractId,
        rpcUrl,
        publicKey: undefined,
    });

    const assetCode = "TCSH";
    console.log(`Checking config for ${assetCode}...`);

    try {
        // Check if token address is set
        const tokenAddress = await client.get_token_contract({ asset_code: assetCode });
        console.log(`Token Address: ${tokenAddress.result}`);

        // Check if price is set
        const priceInfo = await client.get_price({ asset_code: assetCode });
        console.log(`Price: ${priceInfo.result.price_per_unit}`);
        console.log(`Payment Asset: ${priceInfo.result.payment_asset}`);

        console.log("\nIf Token Address is found, please verify that the IssuanceController contract");
        console.log(`(${contractId})`);
        console.log("is the admin/minter of that token contract.");

    } catch (err) {
        console.error("Error fetching config:", err);
    }
}

checkTokenConfig();
