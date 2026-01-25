#!/bin/bash
# Update all Holden asset prices on the issuance_controller contract
# Run from holden directory with: bash scripts/update-prices.sh
#
# REQUIRED: Set your admin secret key
# export STELLAR_SECRET_KEY="S..."

CONTRACT_ID="CBA5OGYON72HS535NQKSLOGRWFZNYPIFBWYKIQDIDHLKHFN6DI2U5XVK"
NETWORK="testnet"
PAYMENT_ASSET="CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC"

# Prices are stored as Whole XLM (USD / 0.21)

echo "Updating Holden asset prices..."
echo "Contract: $CONTRACT_ID"
echo "Network: $NETWORK"
echo ""

# Tesla - $449.06 -> ~2138 XLM
echo "Updating TSLAH..."
stellar contract invoke --id $CONTRACT_ID --source-account $STELLAR_SECRET_KEY --network $NETWORK -- set_price --asset_code TSLAH --payment_asset $PAYMENT_ASSET --price_per_unit 2138

# Apple - $248.04 -> ~1181 XLM
echo "Updating AAPLH..."
stellar contract invoke --id $CONTRACT_ID --source-account $STELLAR_SECRET_KEY --network $NETWORK -- set_price --asset_code AAPLH --payment_asset $PAYMENT_ASSET --price_per_unit 1181

# Meta - $658.76 -> ~3137 XLM
echo "Updating METAH..."
stellar contract invoke --id $CONTRACT_ID --source-account $STELLAR_SECRET_KEY --network $NETWORK -- set_price --asset_code METAH --payment_asset $PAYMENT_ASSET --price_per_unit 3137

# Amazon - $239.16 -> ~1139 XLM
echo "Updating AMZNH..."
stellar contract invoke --id $CONTRACT_ID --source-account $STELLAR_SECRET_KEY --network $NETWORK -- set_price --asset_code AMZNH --payment_asset $PAYMENT_ASSET --price_per_unit 1139

# Nvidia - $187.68 -> ~894 XLM
echo "Updating NVDAH..."
stellar contract invoke --id $CONTRACT_ID --source-account $STELLAR_SECRET_KEY --network $NETWORK -- set_price --asset_code NVDAH --payment_asset $PAYMENT_ASSET --price_per_unit 894

# Sony - $23.21 -> ~111 XLM
echo "Updating SONYH..."
stellar contract invoke --id $CONTRACT_ID --source-account $STELLAR_SECRET_KEY --network $NETWORK -- set_price --asset_code SONYH --payment_asset $PAYMENT_ASSET --price_per_unit 111

# TCS - $34.47 -> ~164 XLM
echo "Updating TCSH..."
stellar contract invoke --id $CONTRACT_ID --source-account $STELLAR_SECRET_KEY --network $NETWORK -- set_price --asset_code TCSH --payment_asset $PAYMENT_ASSET --price_per_unit 164

# Reliance - $15.14 -> ~72 XLM
echo "Updating RELIANCEH..."
stellar contract invoke --id $CONTRACT_ID --source-account $STELLAR_SECRET_KEY --network $NETWORK -- set_price --asset_code RELIANCEH --payment_asset $PAYMENT_ASSET --price_per_unit 72

# Infosys - $18.25 -> ~87 XLM
echo "Updating INFYH..."
stellar contract invoke --id $CONTRACT_ID --source-account $STELLAR_SECRET_KEY --network $NETWORK -- set_price --asset_code INFYH --payment_asset $PAYMENT_ASSET --price_per_unit 87

# Bajaj Finance - $10.15 -> ~48 XLM
echo "Updating BAJFINANCEH..."
stellar contract invoke --id $CONTRACT_ID --source-account $STELLAR_SECRET_KEY --network $NETWORK -- set_price --asset_code BAJFINANCEH --payment_asset $PAYMENT_ASSET --price_per_unit 48

# Gold - $4987.54 -> ~23750 XLM
echo "Updating XAUUSDH..."
stellar contract invoke --id $CONTRACT_ID --source-account $STELLAR_SECRET_KEY --network $NETWORK -- set_price --asset_code XAUUSDH --payment_asset $PAYMENT_ASSET --price_per_unit 23750

# Silver - $103.38 -> ~492 XLM
echo "Updating XAGUSDH..."
stellar contract invoke --id $CONTRACT_ID --source-account $STELLAR_SECRET_KEY --network $NETWORK -- set_price --asset_code XAGUSDH --payment_asset $PAYMENT_ASSET --price_per_unit 492

echo ""
echo "All prices updated!"
