#!/bin/bash
# Link token contracts AND set admin to issuance controller
# Run from holden directory with: bash scripts/link-and-authorize.sh
#
# REQUIRED: Set your admin secret key first!
# export STELLAR_SECRET_KEY="S..."

CONTRACT_ID="CBA5OGYON72HS535NQKSLOGRWFZNYPIFBWYKIQDIDHLKHFN6DI2U5XVK"
NETWORK="testnet"

echo "Configuring tokens: Linking & Transferring Admin to IssuanceController ($CONTRACT_ID)..."
echo "Network: $NETWORK"
echo ""

# 1. APPLE (AAPLH)
echo "Configuring AAPLH..."
TOKEN="CBW2A5FKNZQFUI3O4SBHKFS4J32CQDVITIEJJC6I2FJHQ45PAM727YGS"
# Link in contract
stellar contract invoke --id $CONTRACT_ID --source-account $STELLAR_SECRET_KEY --network $NETWORK -- set_token_contract --asset_code AAPLH --token_address $TOKEN
# Transfer admin (mint) rights to IssuanceController
stellar contract invoke --id $TOKEN --source-account $STELLAR_SECRET_KEY --network $NETWORK -- set_admin --new_admin $CONTRACT_ID

# 2. META (METAH)
echo "Configuring METAH..."
TOKEN="CANQAAAFYKEV5FVGD7XI33MAVI3S74YEK3RTANHPFE2LW2X5R3AH3SU3"
stellar contract invoke --id $CONTRACT_ID --source-account $STELLAR_SECRET_KEY --network $NETWORK -- set_token_contract --asset_code METAH --token_address $TOKEN
stellar contract invoke --id $TOKEN --source-account $STELLAR_SECRET_KEY --network $NETWORK -- set_admin --new_admin $CONTRACT_ID

# 3. AMAZON (AMZNH)
echo "Configuring AMZNH..."
TOKEN="CBVAGHCR2NGYO3SONDM6VEMVO42Y3T4A753NLCW3R5F7CDZ6MZUPXZEE"
stellar contract invoke --id $CONTRACT_ID --source-account $STELLAR_SECRET_KEY --network $NETWORK -- set_token_contract --asset_code AMZNH --token_address $TOKEN
stellar contract invoke --id $TOKEN --source-account $STELLAR_SECRET_KEY --network $NETWORK -- set_admin --new_admin $CONTRACT_ID

# 4. NVIDIA (NVDAH)
echo "Configuring NVDAH..."
TOKEN="CDQ3HQGNRSNYHWEWO4BKZW5UTPGB5ML3TU42GLHEFRA6HKCVW72MEIJJ"
stellar contract invoke --id $CONTRACT_ID --source-account $STELLAR_SECRET_KEY --network $NETWORK -- set_token_contract --asset_code NVDAH --token_address $TOKEN
stellar contract invoke --id $TOKEN --source-account $STELLAR_SECRET_KEY --network $NETWORK -- set_admin --new_admin $CONTRACT_ID

# 5. SONY (SONYH)
echo "Configuring SONYH..."
TOKEN="CAMKZLXO4EKZD7BQKXJSCWHK4WKWHNJHSA5LTEPBJFIXTCVOT6TJGQ7U"
stellar contract invoke --id $CONTRACT_ID --source-account $STELLAR_SECRET_KEY --network $NETWORK -- set_token_contract --asset_code SONYH --token_address $TOKEN
stellar contract invoke --id $TOKEN --source-account $STELLAR_SECRET_KEY --network $NETWORK -- set_admin --new_admin $CONTRACT_ID

# 6. TCS (TCSH)
echo "Configuring TCSH..."
TOKEN="CBZD3GMJUIXAROTZZIMOO6O6POD7V3L5EANTSG5RF6W6NB6XGJ25ROW4"
stellar contract invoke --id $CONTRACT_ID --source-account $STELLAR_SECRET_KEY --network $NETWORK -- set_token_contract --asset_code TCSH --token_address $TOKEN
stellar contract invoke --id $TOKEN --source-account $STELLAR_SECRET_KEY --network $NETWORK -- set_admin --new_admin $CONTRACT_ID

# 7. RELIANCE (RELIANCEH)
echo "Configuring RELIANCEH..."
TOKEN="CBIYCIH7OIRJJFYRU4ESNXOWPWNGYUAXMAIAJL3C4YBFWZ67XHFER7YE"
stellar contract invoke --id $CONTRACT_ID --source-account $STELLAR_SECRET_KEY --network $NETWORK -- set_token_contract --asset_code RELIANCEH --token_address $TOKEN
stellar contract invoke --id $TOKEN --source-account $STELLAR_SECRET_KEY --network $NETWORK -- set_admin --new_admin $CONTRACT_ID

# 8. INFOSYS (INFYH)
echo "Configuring INFYH..."
TOKEN="CBJ2DT7KOFAVPXK7I4PO7QNVLE6OYLCUGQWYWSDYCKWU5GSOZM7Q7WE5"
stellar contract invoke --id $CONTRACT_ID --source-account $STELLAR_SECRET_KEY --network $NETWORK -- set_token_contract --asset_code INFYH --token_address $TOKEN
stellar contract invoke --id $TOKEN --source-account $STELLAR_SECRET_KEY --network $NETWORK -- set_admin --new_admin $CONTRACT_ID

# 9. BAJAJ FINANCE (BAJFINANCEH)
echo "Configuring BAJFINANCEH..."
TOKEN="CCE5TFKMKVEG5FX5ARLI4BZQUTRD3DII3RSCYJR2FSGGSSSUYMZZGM54"
stellar contract invoke --id $CONTRACT_ID --source-account $STELLAR_SECRET_KEY --network $NETWORK -- set_token_contract --asset_code BAJFINANCEH --token_address $TOKEN
stellar contract invoke --id $TOKEN --source-account $STELLAR_SECRET_KEY --network $NETWORK -- set_admin --new_admin $CONTRACT_ID

# 10. GOLD (XAUUSDH)
echo "Configuring XAUUSDH..."
TOKEN="CDZSZK7MVGVSOR2NQVCEUYAQIU5KUF2X5I4BRJWUAGUZHETVBMQEQ4A3"
stellar contract invoke --id $CONTRACT_ID --source-account $STELLAR_SECRET_KEY --network $NETWORK -- set_token_contract --asset_code XAUUSDH --token_address $TOKEN
stellar contract invoke --id $TOKEN --source-account $STELLAR_SECRET_KEY --network $NETWORK -- set_admin --new_admin $CONTRACT_ID

# 11. SILVER (XAGUSDH)
echo "Configuring XAGUSDH..."
TOKEN="CDXIE6V4BEAARCV45SCWBSZIVGFN4BBQMHDAYAWONYUWTBBOOMDKDX5Z"
stellar contract invoke --id $CONTRACT_ID --source-account $STELLAR_SECRET_KEY --network $NETWORK -- set_token_contract --asset_code XAGUSDH --token_address $TOKEN
stellar contract invoke --id $TOKEN --source-account $STELLAR_SECRET_KEY --network $NETWORK -- set_admin --new_admin $CONTRACT_ID

echo ""
echo "Configuration complete! Now run 'bash scripts/update-prices.sh' to fix price/payment settings."
