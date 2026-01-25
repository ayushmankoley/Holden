/**
 * Price Checker Script
 * Fetches current prices from the issuance controller and compares with correct values
 * 
 * Run with: npx ts-node scripts/check-prices.ts
 */

import * as IssuanceControllerClient from "issuance_controller";

const rpcUrl = "https://soroban-testnet.stellar.org";
const networkPassphrase = "Test SDF Network ; September 2015";
const contractId = "CBA5OGYON72HS535NQKSLOGRWFZNYPIFBWYKIQDIDHLKHFN6DI2U5XVK";

// Correct prices in USD (these are the actual stock/commodity prices)
const CORRECT_PRICES_USD: Record<string, number> = {
    TSLAH: 449.06,      // Tesla
    AAPLH: 248.04,      // Apple
    METAH: 658.76,      // Meta
    AMZNH: 239.16,      // Amazon
    NVDAH: 187.68,      // Nvidia
    SONYH: 23.21,       // Sony
    TCSH: 34.47,        // TCS
    RELIANCEH: 15.14,   // Reliance
    INFYH: 18.25,       // Infosys
    BAJFINANCEH: 10.15, // Bajaj Finance
    XAUUSDH: 4987.54,   // Gold
    XAGUSDH: 103.38,    // Silver
};

// Convert USD to contract format (USD * 1,000,000)
const usdToContractFormat = (usd: number): bigint => BigInt(Math.round(usd * 1000000));

async function checkPrices() {
    const client = new IssuanceControllerClient.Client({
        networkPassphrase,
        contractId,
        rpcUrl,
        publicKey: undefined,
    });

    console.log("=".repeat(70));
    console.log("HOLDEN ASSET PRICE CHECK");
    console.log("=".repeat(70));
    console.log("");

    const pricesToUpdate: { asset: string; current: bigint; correct: bigint; currentUsd: number; correctUsd: number }[] = [];

    for (const [assetCode, correctUsd] of Object.entries(CORRECT_PRICES_USD)) {
        try {
            const result = await client.get_price({ asset_code: assetCode });
            const currentPrice = result.result.price_per_unit;
            const currentUsd = Number(currentPrice) / 1000000;
            const correctContractPrice = usdToContractFormat(correctUsd);

            const isCorrect = currentPrice === correctContractPrice;
            const status = isCorrect ? "✓ OK" : "✗ WRONG";

            console.log(`${assetCode.padEnd(12)} | Current: $${currentUsd.toFixed(2).padStart(10)} | Correct: $${correctUsd.toFixed(2).padStart(10)} | ${status}`);

            if (!isCorrect) {
                pricesToUpdate.push({
                    asset: assetCode,
                    current: currentPrice,
                    correct: correctContractPrice,
                    currentUsd,
                    correctUsd,
                });
            }
        } catch (err) {
            console.log(`${assetCode.padEnd(12)} | ERROR: Price not set`);
            pricesToUpdate.push({
                asset: assetCode,
                current: BigInt(0),
                correct: usdToContractFormat(correctUsd),
                currentUsd: 0,
                correctUsd,
            });
        }
    }

    console.log("");
    console.log("=".repeat(70));

    if (pricesToUpdate.length === 0) {
        console.log("All prices are correct! No updates needed.");
    } else {
        console.log(`${pricesToUpdate.length} price(s) need to be updated:`);
        console.log("");
        for (const item of pricesToUpdate) {
            console.log(`  ${item.asset}: $${item.currentUsd.toFixed(2)} → $${item.correctUsd.toFixed(2)}`);
            console.log(`    Contract value: ${item.current} → ${item.correct}`);
        }
    }

    console.log("=".repeat(70));

    return pricesToUpdate;
}

checkPrices().catch(console.error);
