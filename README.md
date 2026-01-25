# Holden
> **Hold What Matters.**  
> Trade tokenized real-world assets on Stellar with instant settlement and 24/7 liquidity.

![Holden UI Preview](/UI.PNG)

[![Live Demo](https://img.shields.io/badge/Live_Demo-holdenn.vercel.app-blue?style=for-the-badge&logo=vercel)](https://holdenn.vercel.app/)

---

## ⚡ Overview

**Holden** is a decentralized application (dApp) built on the Stellar network (Soroban) that allows users to trade fractionalized real-world assets (RWAs) like Stocks, Commodities, and Indices.

By leveraging Stellar’s speed and low fees, Holden provides a seamless trading experience where users can buy, sell, and redeem assets instantly using XLM or USDC.

### Key Features
- **Tokenized Assets**: Trade Tesla ($TSLAH), Apple ($AAPLH), Gold ($XAUUSDH) and more.
- **Instant Settlement**: Trades settle in seconds on the Stellar ledger.
- **Admin Controls**: Robust issuance and redemption controls via smart contracts.
- **KYC Integration**: Compliance-ready architecture with separate KYC registry.

---

## 🚀 Contract Addresses (Testnet)

These contracts are deployed on the Stellar Testnet.

| Contract | Address |
|----------|---------|
| **Issuance Controller** | `CBA5OGYON72HS535NQKSLOGRWFZNYPIFBWYKIQDIDHLKHFN6DI2U5XVK` |
| **Redemption Controller** | `CAJ4DCJDREAJICGVELJSYCSJ3I6NBDQP4A43AGVW4TQJHIWUUTGNR533` |
| **Asset Registry** | `CA2XEEBMTCFKCCDYPRULQKYI56IGCRXWHVGZ4RDIK2KDDGQXKZKAX7N4` |
| **KYC Registry** | `CA7BJCH7EQ74WJY3TY7XDMJYU2QJPMVMZUOEVJ54IJ3C6GMMZZM43DFU` |

---

## 🛠️ Setup & Development

Follow these steps to run Holden locally.

### Prerequisites
- Node.js > 18.x
- Stellar CLI (soroban-cli)

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/ayushmankoley/Holden.git
cd Holden/holden

# Install dependencies
npm install
```

### 2. Environment Setup

Create `environments.toml` in the root:

```toml
[testnet]
network_passphrase = "Test SDF Network ; September 2015"
rpc_url = "https://soroban-testnet.stellar.org"
```

### 3. Run Development Server

```bash
npm run dev
```
Visit `http://localhost:5173` to view the app.

---

## 📜 How it Works

1. **KYC**: Users must be approved in the KYC Registry (simulated in testnet).
2. **Buying**: Users pay XLM/USDC to the Issuance Controller.
3. **Minting**: The controller validates payment and mints Asset Tokens (e.g., TSLAH) to the user.
4. **Redeeming**: Users send Asset Tokens back to be burned in exchange for underlying value (simulated).

---

## 🔗 Links

- **Live Site**: [https://holdenn.vercel.app/](https://holdenn.vercel.app/)
- **GitHub**: [https://github.com/ayushmankoley/Holden](https://github.com/ayushmankoley/Holden)
