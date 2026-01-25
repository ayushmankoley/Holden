#!/bin/bash
# Link token contracts to the issuance controller
# Run from holden directory with: bash scripts/link-tokens.sh
#
# REQUIRED: Set your admin secret key
# export STELLAR_SECRET_KEY="S..."

CONTRACT_ID="CBA5OGYON72HS535NQKSLOGRWFZNYPIFBWYKIQDIDHLKHFN6DI2U5XVK"
NETWORK="testnet"

echo "Linking tokens to issuance controller..."
echo "Contract: $CONTRACT_ID"
echo "Network: $NETWORK"
echo ""

# Tesla (Already linked)
# Token: CAFBNW5KR5MQK4R6DTRI5BBMTVLL2OE2EFEDDGALDLTQO737XPLWUNP5

# Apple
echo "Linking AAPLH..."
stellar contract invoke --id $CONTRACT_ID --source-account $STELLAR_SECRET_KEY --network $NETWORK -- set_token_contract --asset_code AAPLH --token_address CBW2A5FKNZQFUI3O4SBHKFS4J32CQDVITIEJJC6I2FJHQ45PAM727YGS

# Meta
echo "Linking METAH..."
stellar contract invoke --id $CONTRACT_ID --source-account $STELLAR_SECRET_KEY --network $NETWORK -- set_token_contract --asset_code METAH --token_address CANQAAAFYKEV5FVGD7XI33MAVI3S74YEK3RTANHPFE2LW2X5R3AH3SU3

# Amazon
echo "Linking AMZNH..."
stellar contract invoke --id $CONTRACT_ID --source-account $STELLAR_SECRET_KEY --network $NETWORK -- set_token_contract --asset_code AMZNH --token_address CBVAGHCR2NGYO3SONDM6VEMVO42Y3T4A753NLCW3R5F7CDZ6MZUPXZEE

# Nvidia
echo "Linking NVDAH..."
stellar contract invoke --id $CONTRACT_ID --source-account $STELLAR_SECRET_KEY --network $NETWORK -- set_token_contract --asset_code NVDAH --token_address CDQ3HQGNRSNYHWEWO4BKZW5UTPGB5ML3TU42GLHEFRA6HKCVW72MEIJJ

# Sony
echo "Linking SONYH..."
stellar contract invoke --id $CONTRACT_ID --source-account $STELLAR_SECRET_KEY --network $NETWORK -- set_token_contract --asset_code SONYH --token_address CAMKZLXO4EKZD7BQKXJSCWHK4WKWHNJHSA5LTEPBJFIXTCVOT6TJGQ7U

# TCS
echo "Linking TCSH..."
stellar contract invoke --id $CONTRACT_ID --source-account $STELLAR_SECRET_KEY --network $NETWORK -- set_token_contract --asset_code TCSH --token_address CBZD3GMJUIXAROTZZIMOO6O6POD7V3L5EANTSG5RF6W6NB6XGJ25ROW4

# Reliance
echo "Linking RELIANCEH..."
stellar contract invoke --id $CONTRACT_ID --source-account $STELLAR_SECRET_KEY --network $NETWORK -- set_token_contract --asset_code RELIANCEH --token_address CBIYCIH7OIRJJFYRU4ESNXOWPWNGYUAXMAIAJL3C4YBFWZ67XHFER7YE

# Infosys
echo "Linking INFYH..."
stellar contract invoke --id $CONTRACT_ID --source-account $STELLAR_SECRET_KEY --network $NETWORK -- set_token_contract --asset_code INFYH --token_address CBJ2DT7KOFAVPXK7I4PO7QNVLE6OYLCUGQWYWSDYCKWU5GSOZM7Q7WE5

# Bajaj Finance
echo "Linking BAJFINANCEH..."
stellar contract invoke --id $CONTRACT_ID --source-account $STELLAR_SECRET_KEY --network $NETWORK -- set_token_contract --asset_code BAJFINANCEH --token_address CCE5TFKMKVEG5FX5ARLI4BZQUTRD3DII3RSCYJR2FSGGSSSUYMZZGM54

# Gold
echo "Linking XAUUSDH..."
stellar contract invoke --id $CONTRACT_ID --source-account $STELLAR_SECRET_KEY --network $NETWORK -- set_token_contract --asset_code XAUUSDH --token_address CDZSZK7MVGVSOR2NQVCEUYAQIU5KUF2X5I4BRJWUAGUZHETVBMQEQ4A3

# Silver
echo "Linking XAGUSDH..."
stellar contract invoke --id $CONTRACT_ID --source-account $STELLAR_SECRET_KEY --network $NETWORK -- set_token_contract --asset_code XAGUSDH --token_address CDXIE6V4BEAARCV45SCWBSZIVGFN4BBQMHDAYAWONYUWTBBOOMDKDX5Z

echo ""
echo "All token contracts linked!"
