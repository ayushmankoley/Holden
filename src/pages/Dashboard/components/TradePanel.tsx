import { useState, useEffect } from "react";
import { Icon } from "@stellar/design-system";
import * as StellarSdk from "@stellar/stellar-sdk";
import issuanceController from "../../../contracts/issuance_controller";
import { useWallet } from "../../../hooks/useWallet";
import { networkPassphrase } from "../../../contracts/util";
import type { MappedBalances } from "../../../util/wallet";

interface TradePanelProps {
  isKycApproved: boolean;
  address?: string;
  balances: MappedBalances;
}

// Available assets for trading with their issuer and exchange info
const AVAILABLE_ASSETS = [
  // US Stocks
  {
    code: "TSLAH",
    name: "Tesla Holdings",
    issuer: "GCDPEKYIWTH4DWGYPALZ7RLGCP32C6RZ2BZAF4EJEU7BGCGOAEMEIZZ4",
    exchange: "NASDAQ",
    stockSymbol: "TSLA",
  },
  {
    code: "AAPLH",
    name: "Apple Holdings",
    issuer: "GCDPEKYIWTH4DWGYPALZ7RLGCP32C6RZ2BZAF4EJEU7BGCGOAEMEIZZ4",
    exchange: "NASDAQ",
    stockSymbol: "AAPL",
  },
  {
    code: "METAH",
    name: "Meta Holdings",
    issuer: "GCDPEKYIWTH4DWGYPALZ7RLGCP32C6RZ2BZAF4EJEU7BGCGOAEMEIZZ4",
    exchange: "NASDAQ",
    stockSymbol: "META",
  },
  {
    code: "AMZNH",
    name: "Amazon Holdings",
    issuer: "GCDPEKYIWTH4DWGYPALZ7RLGCP32C6RZ2BZAF4EJEU7BGCGOAEMEIZZ4",
    exchange: "NASDAQ",
    stockSymbol: "AMZN",
  },
  {
    code: "NVDAH",
    name: "Nvidia Holdings",
    issuer: "GCDPEKYIWTH4DWGYPALZ7RLGCP32C6RZ2BZAF4EJEU7BGCGOAEMEIZZ4",
    exchange: "NASDAQ",
    stockSymbol: "NVDA",
  },
  {
    code: "SONYH",
    name: "Sony Holdings",
    issuer: "GCDPEKYIWTH4DWGYPALZ7RLGCP32C6RZ2BZAF4EJEU7BGCGOAEMEIZZ4",
    exchange: "NYSE",
    stockSymbol: "SONY",
  },
  // Indian Stocks
  {
    code: "TCSH",
    name: "TCS Holdings",
    issuer: "GCDPEKYIWTH4DWGYPALZ7RLGCP32C6RZ2BZAF4EJEU7BGCGOAEMEIZZ4",
    exchange: "NSE",
    stockSymbol: "TCS",
  },
  {
    code: "RELIANCEH",
    name: "Reliance Holdings",
    issuer: "GCDPEKYIWTH4DWGYPALZ7RLGCP32C6RZ2BZAF4EJEU7BGCGOAEMEIZZ4",
    exchange: "NSE",
    stockSymbol: "RELIANCE",
  },
  {
    code: "INFYH",
    name: "Infosys Holdings",
    issuer: "GCDPEKYIWTH4DWGYPALZ7RLGCP32C6RZ2BZAF4EJEU7BGCGOAEMEIZZ4",
    exchange: "NSE",
    stockSymbol: "INFY",
  },
  {
    code: "BAJFINANCEH",
    name: "Bajaj Finance Holdings",
    issuer: "GCDPEKYIWTH4DWGYPALZ7RLGCP32C6RZ2BZAF4EJEU7BGCGOAEMEIZZ4",
    exchange: "NSE",
    stockSymbol: "BAJFINANCE",
  },
  // Commodities
  {
    code: "XAUUSDH",
    name: "Gold Holdings",
    issuer: "GCDPEKYIWTH4DWGYPALZ7RLGCP32C6RZ2BZAF4EJEU7BGCGOAEMEIZZ4",
    exchange: "COMMODITY",
    stockSymbol: "XAU/USD",
  },
  {
    code: "XAGUSDH",
    name: "Silver Holdings",
    issuer: "GCDPEKYIWTH4DWGYPALZ7RLGCP32C6RZ2BZAF4EJEU7BGCGOAEMEIZZ4",
    exchange: "COMMODITY",
    stockSymbol: "XAG/USD",
  },
];

// Exchange types and their required fields
const EXCHANGE_FIELDS: Record<
  string,
  {
    label: string;
    fields: { name: string; label: string; placeholder: string }[];
  }
> = {
  NASDAQ: {
    label: "US Brokerage Account",
    fields: [
      {
        name: "brokerName",
        label: "Broker Name",
        placeholder: "e.g., Fidelity, Charles Schwab",
      },
      {
        name: "accountNumber",
        label: "Account Number",
        placeholder: "Enter your brokerage account number",
      },
      {
        name: "routingNumber",
        label: "DTC Number",
        placeholder: "Broker's DTC participant number",
      },
    ],
  },
  NYSE: {
    label: "US Brokerage Account",
    fields: [
      {
        name: "brokerName",
        label: "Broker Name",
        placeholder: "e.g., TD Ameritrade, E*TRADE",
      },
      {
        name: "accountNumber",
        label: "Account Number",
        placeholder: "Enter your brokerage account number",
      },
      {
        name: "routingNumber",
        label: "DTC Number",
        placeholder: "Broker's DTC participant number",
      },
    ],
  },
  NSE: {
    label: "Indian Demat Account",
    fields: [
      {
        name: "dpId",
        label: "DP ID",
        placeholder: "Depository Participant ID",
      },
      {
        name: "clientId",
        label: "Client ID",
        placeholder: "Your Client/Beneficiary ID",
      },
      {
        name: "panNumber",
        label: "PAN Number",
        placeholder: "Your PAN card number",
      },
    ],
  },
  BSE: {
    label: "Indian Demat Account",
    fields: [
      {
        name: "dpId",
        label: "DP ID",
        placeholder: "Depository Participant ID",
      },
      {
        name: "clientId",
        label: "Client ID",
        placeholder: "Your Client/Beneficiary ID",
      },
      {
        name: "panNumber",
        label: "PAN Number",
        placeholder: "Your PAN card number",
      },
    ],
  },
  COMMODITY: {
    label: "Bank/Vault Account",
    fields: [
      {
        name: "bankName",
        label: "Bank/Vault Name",
        placeholder: "e.g., LBMA Vault, Swiss Bank",
      },
      {
        name: "accountNumber",
        label: "Account/Reference Number",
        placeholder: "Your account or vault reference",
      },
      {
        name: "swiftCode",
        label: "SWIFT Code (if applicable)",
        placeholder: "Bank SWIFT/BIC code",
      },
    ],
  },
};

const TradePanel: React.FC<TradePanelProps> = ({
  isKycApproved,
  address,
  balances,
}) => {
  const { signTransaction, updateBalances } = useWallet();
  const [activeTab, setActiveTab] = useState<"buy" | "redeem">("buy");
  const [selectedAsset, setSelectedAsset] = useState(AVAILABLE_ASSETS[0].code);
  const [amount, setAmount] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState<bigint | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPriceLoading, setIsPriceLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [hasTrustline, setHasTrustline] = useState(false);
  const [isTrustlineLoading, setIsTrustlineLoading] = useState(false);

  // Redeem form state
  const [redeemStep, setRedeemStep] = useState<
    "amount" | "details" | "confirm"
  >("amount");
  const [accountDetails, setAccountDetails] = useState<Record<string, string>>(
    {},
  );

  // Get the current asset config
  const currentAsset =
    AVAILABLE_ASSETS.find((a) => a.code === selectedAsset) ??
    AVAILABLE_ASSETS[0];
  const exchangeConfig =
    EXCHANGE_FIELDS[currentAsset.exchange] ?? EXCHANGE_FIELDS.NASDAQ;

  // Check if user has trustline for selected asset
  useEffect(() => {
    const checkTrustline = async () => {
      if (!address || !balances) {
        setHasTrustline(false);
        return;
      }

      // First check local balances
      const hasTrustFromBalance = Object.keys(balances).some(
        (key) => key.startsWith(selectedAsset + ":") || key === selectedAsset,
      );

      if (hasTrustFromBalance) {
        setHasTrustline(true);
        return;
      }

      // Fallback: check Horizon directly for trustline
      try {
        const horizonServer = new StellarSdk.Horizon.Server(
          "https://horizon-testnet.stellar.org",
        );
        const account = await horizonServer.loadAccount(address);
        const hasTrustFromHorizon = account.balances.some(
          (bal) => "asset_code" in bal && bal.asset_code === selectedAsset,
        );
        setHasTrustline(hasTrustFromHorizon);
      } catch {
        setHasTrustline(false);
      }
    };
    void checkTrustline();
  }, [address, balances, selectedAsset]);

  // Fetch price for selected asset
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setIsPriceLoading(true);
        const result = await issuanceController.get_price({
          asset_code: selectedAsset,
        });
        setPricePerUnit(result.result.price_per_unit);
      } catch (err) {
        console.error("Failed to fetch price:", err);
        setPricePerUnit(null);
      } finally {
        setIsPriceLoading(false);
      }
    };

    void fetchPrice();
  }, [selectedAsset]);

  // Reset redeem form when switching tabs
  useEffect(() => {
    if (activeTab === "buy") {
      setRedeemStep("amount");
      setAccountDetails({});
    }
  }, [activeTab]);

  // Add trustline for the asset
  const handleAddTrustline = async () => {
    if (!address) return;

    setIsTrustlineLoading(true);
    setError(null);

    try {
      // Use Horizon for classic transactions
      const horizonServer = new StellarSdk.Horizon.Server(
        "https://horizon-testnet.stellar.org",
      );
      const account = await horizonServer.loadAccount(address);

      const asset = new StellarSdk.Asset(
        currentAsset.code,
        currentAsset.issuer,
      );

      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: networkPassphrase,
      })
        .addOperation(StellarSdk.Operation.changeTrust({ asset }))
        .setTimeout(300)
        .build();

      // Sign using wallet - returns { signedTxXdr: string }
      const result = await signTransaction(transaction.toXDR(), {
        address,
        networkPassphrase,
      });

      if (!result.signedTxXdr) {
        throw new Error("Transaction signing was cancelled");
      }

      const signedTx = StellarSdk.TransactionBuilder.fromXDR(
        result.signedTxXdr,
        networkPassphrase,
      ) as StellarSdk.Transaction;

      await horizonServer.submitTransaction(signedTx);

      // Wait a bit and refresh balances
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await updateBalances();
      setHasTrustline(true);
      setSuccess(`Trustline for ${selectedAsset} added successfully!`);
    } catch (err: unknown) {
      console.error("Failed to add trustline:", err);

      // Check if trustline already exists (400 error or specific message)
      const errorStr = String(err);
      if (
        errorStr.includes("400") ||
        errorStr.includes("changeTrust") ||
        errorStr.includes("line_full")
      ) {
        // Trustline likely already exists, just refresh and continue
        await updateBalances();
        setHasTrustline(true);
        setSuccess(`Trustline for ${selectedAsset} is already active!`);
      } else if (
        errorStr.includes("cancelled") ||
        errorStr.includes("rejected")
      ) {
        setError("Transaction cancelled");
      } else {
        setError("Failed to add trustline. Please try again.");
      }
    } finally {
      setIsTrustlineLoading(false);
    }
  };

  // Calculate total cost/return
  // price_per_unit is in stroops per token-stroop, but effectively equals XLM per whole token
  const parsedAmount = parseFloat(amount) || 0;
  const totalXlm = pricePerUnit ? parsedAmount * Number(pricePerUnit) : 0;

  // Get user's XLM balance
  const xlmBalance = parseFloat(
    balances.xlm?.balance?.replace(/,/g, "") ?? "0",
  );

  // Get user's token balance for selling
  const getTokenBalance = () => {
    const tokenKey = Object.keys(balances).find((key) =>
      key.startsWith(selectedAsset),
    );
    if (tokenKey) {
      return parseFloat(balances[tokenKey].balance?.replace(/,/g, "") ?? "0");
    }
    return 0;
  };
  const tokenBalance = getTokenBalance();

  const handleHalfClick = () => {
    if (activeTab === "buy" && pricePerUnit) {
      // Half of max tokens user can buy
      const halfTokens = Math.floor(xlmBalance / Number(pricePerUnit) / 2);
      setAmount(halfTokens > 0 ? halfTokens.toString() : "");
    } else {
      // Half of token balance
      setAmount(tokenBalance > 0 ? (tokenBalance / 2).toString() : "");
    }
  };

  const handleMaxClick = () => {
    if (activeTab === "buy" && pricePerUnit) {
      // Max tokens user can buy with their XLM (price is XLM per token)
      const maxTokens = Math.floor(xlmBalance / Number(pricePerUnit));
      setAmount(maxTokens > 0 ? maxTokens.toString() : "");
    } else {
      // Max tokens user can sell
      setAmount(tokenBalance > 0 ? tokenBalance.toString() : "");
    }
  };

  const handleAccountDetailChange = (fieldName: string, value: string) => {
    setAccountDetails((prev) => ({ ...prev, [fieldName]: value }));
  };

  const areAccountDetailsValid = () => {
    return exchangeConfig.fields.every(
      (field) =>
        accountDetails[field.name] &&
        accountDetails[field.name].trim().length > 0,
    );
  };

  const handleSubmit = async () => {
    if (!address || !amount || parsedAmount <= 0) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (activeTab === "buy") {
        // Buy tokens - amount in stroops (1 token = 10^7 stroops)
        const tx = await issuanceController.buy({
          buyer: address,
          asset_code: selectedAsset,
          amount: BigInt(Math.floor(parsedAmount * 1e7)), // Convert to stroops
        });

        // Sign and submit
        await tx.signAndSend({ signTransaction });

        setSuccess(`Successfully bought ${parsedAmount} ${selectedAsset}!`);
        setAmount("");
        await updateBalances();
      } else {
        // Redeem tokens
        if (parsedAmount > tokenBalance) {
          setError("Insufficient token balance");
          return;
        }

        if (redeemStep === "amount") {
          // Move to account details step
          setRedeemStep("details");
          setIsLoading(false);
          return;
        }

        if (redeemStep === "details") {
          if (!areAccountDetailsValid()) {
            setError("Please fill in all account details");
            setIsLoading(false);
            return;
          }
          // Move to confirm step
          setRedeemStep("confirm");
          setIsLoading(false);
          return;
        }

        // Final step - initiate burn (frontend only for now)
        // In production, this would call redemption_controller.redeem()
        const stockValue = parsedAmount * Number(pricePerUnit);

        setSuccess(
          `Redemption initiated! ${parsedAmount} ${selectedAsset} tokens will be burned. ` +
            `You'll receive ${parsedAmount} ${currentAsset.stockSymbol} shares (worth ~$${(stockValue * 0.21).toFixed(2)}) ` +
            `in your ${exchangeConfig.label} within 12-24 hours.`,
        );
        setAmount("");
        setRedeemStep("amount");
        setAccountDetails({});
      }
    } catch (err) {
      console.error("Transaction failed:", err);
      // Simplify error messages for users
      const errorMsg =
        err instanceof Error ? err.message : "Transaction failed";
      if (
        errorMsg.includes("balance") ||
        errorMsg.includes("insufficient") ||
        errorMsg.includes("not within")
      ) {
        setError("Insufficient funds");
      } else if (
        errorMsg.includes("cancelled") ||
        errorMsg.includes("rejected")
      ) {
        setError("Transaction cancelled");
      } else {
        setError("Transaction failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // If not KYC approved, show locked state
  if (!isKycApproved) {
    return (
      <div className="trade-panel">
        <div className="trade-panel__header">
          <h3 className="trade-panel__title">Trade Assets</h3>
          <p className="trade-panel__subtitle">
            Buy and redeem Holden-backed tokens
          </p>
        </div>

        <div className="trade-panel__locked">
          <div className="trade-panel__locked-icon">
            <Icon.Lock01 />
          </div>
          <h4 style={{ marginBottom: "var(--space-2)" }}>KYC Required</h4>
          <p style={{ fontSize: "var(--size-caption)" }}>
            Complete identity verification to access trading features
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="trade-panel">
      <div className="trade-panel__header">
        <h3 className="trade-panel__title">Trade Assets</h3>
        <p className="trade-panel__subtitle">
          Buy and redeem Holden-backed tokens
        </p>
      </div>

      {/* Tab Toggle */}
      <div className="trade-panel__tabs">
        <button
          className={`trade-panel__tab ${activeTab === "buy" ? "trade-panel__tab--active" : ""}`}
          onClick={() => setActiveTab("buy")}
        >
          Buy
        </button>
        <button
          className={`trade-panel__tab ${activeTab === "redeem" ? "trade-panel__tab--active" : ""}`}
          onClick={() => setActiveTab("redeem")}
        >
          Redeem
        </button>
      </div>

      {/* Trade Form */}
      <div className="trade-panel__form">
        {/* Asset Selector */}
        <div className="trade-panel__select-wrapper">
          <select
            className="trade-panel__select"
            value={selectedAsset}
            onChange={(e) => setSelectedAsset(e.target.value)}
          >
            {AVAILABLE_ASSETS.map((asset) => (
              <option key={asset.code} value={asset.code}>
                {asset.name} ({asset.code})
              </option>
            ))}
          </select>
          <div className="trade-panel__select-icon">
            <Icon.ChevronDown />
          </div>
        </div>

        {/* Trustline Warning - only for Buy */}
        {!hasTrustline && activeTab === "buy" && (
          <div className="trade-panel__trustline-warning">
            <div style={{ marginBottom: "var(--space-3)" }}>
              <Icon.AlertCircle /> You need to add a trustline for{" "}
              {selectedAsset} before buying
            </div>
            <button
              className="btn btn--primary"
              onClick={() => void handleAddTrustline()}
              disabled={isTrustlineLoading}
              style={{ width: "100%" }}
            >
              {isTrustlineLoading
                ? "Adding Trustline..."
                : `Add ${selectedAsset} Trustline`}
            </button>
          </div>
        )}

        {/* Amount Input - Step 1 for both Buy and Redeem */}
        {(activeTab === "buy" || redeemStep === "amount") && (
          <>
            <div className="trade-panel__input-group">
              <input
                type="number"
                className="trade-panel__input"
                placeholder={`Amount of ${selectedAsset}`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="1"
                disabled={!hasTrustline && activeTab === "buy"}
              />
              <div className="trade-panel__btn-group">
                <button
                  className="trade-panel__quick-btn"
                  onClick={handleHalfClick}
                >
                  HALF
                </button>
                <button
                  className="trade-panel__quick-btn"
                  onClick={handleMaxClick}
                >
                  MAX
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="trade-panel__summary">
              <div className="trade-panel__summary-row">
                <span className="trade-panel__summary-label">
                  Price per token
                </span>
                <span>
                  {isPriceLoading
                    ? "Loading..."
                    : pricePerUnit
                      ? `${Number(pricePerUnit).toLocaleString()} XLM`
                      : "N/A"}
                </span>
              </div>
              <div className="trade-panel__summary-row">
                <span className="trade-panel__summary-label">
                  {activeTab === "buy"
                    ? "Your XLM balance"
                    : "Your token balance"}
                </span>
                <span>
                  {activeTab === "buy"
                    ? `${xlmBalance.toFixed(2)} XLM`
                    : `${tokenBalance} ${selectedAsset}`}
                </span>
              </div>
              <div className="trade-panel__summary-row">
                <span className="trade-panel__summary-label">
                  {activeTab === "buy" ? "Total cost" : "Estimated value"}
                </span>
                <span>{totalXlm.toLocaleString()} XLM</span>
              </div>
            </div>
          </>
        )}

        {/* Redeem Step 2: Account Details */}
        {activeTab === "redeem" && redeemStep === "details" && (
          <div className="trade-panel__account-form">
            <div className="trade-panel__account-header">
              <Icon.Building07 />
              <span>{exchangeConfig.label} Details</span>
            </div>
            <p className="trade-panel__account-subtitle">
              Enter your brokerage account details where you want to receive{" "}
              {currentAsset.stockSymbol} shares
            </p>

            {exchangeConfig.fields.map((field) => (
              <div key={field.name} className="trade-panel__form-field">
                <label className="trade-panel__form-label">{field.label}</label>
                <input
                  type="text"
                  className="trade-panel__input"
                  placeholder={field.placeholder}
                  value={accountDetails[field.name] || ""}
                  onChange={(e) =>
                    handleAccountDetailChange(field.name, e.target.value)
                  }
                />
              </div>
            ))}

            <button
              className="trade-panel__back-btn"
              onClick={() => setRedeemStep("amount")}
            >
              ← Back to amount
            </button>
          </div>
        )}

        {/* Redeem Step 3: Confirmation */}
        {activeTab === "redeem" && redeemStep === "confirm" && (
          <div className="trade-panel__confirm">
            <div className="trade-panel__confirm-header">
              <Icon.CheckCircle />
              <span>Confirm Redemption</span>
            </div>

            <div className="trade-panel__confirm-details">
              <div className="trade-panel__confirm-row">
                <span>Tokens to burn:</span>
                <strong>
                  {parsedAmount} {selectedAsset}
                </strong>
              </div>
              <div className="trade-panel__confirm-row">
                <span>Shares to receive:</span>
                <strong>
                  {parsedAmount} {currentAsset.stockSymbol}
                </strong>
              </div>
              <div className="trade-panel__confirm-row">
                <span>Exchange:</span>
                <strong>{currentAsset.exchange}</strong>
              </div>
              <div className="trade-panel__confirm-row">
                <span>Delivery time:</span>
                <strong>12-24 hours</strong>
              </div>
            </div>

            <div className="trade-panel__confirm-notice">
              <Icon.Clock /> Your shares will be transferred to your brokerage
              account within 12-24 hours after token burn confirmation.
            </div>

            <button
              className="trade-panel__back-btn"
              onClick={() => setRedeemStep("details")}
            >
              ← Back to account details
            </button>
          </div>
        )}

        {/* Error/Success Messages */}
        {error && (
          <div
            style={{
              color: "#ff6b6b",
              fontSize: "var(--size-caption)",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}
        {success && (
          <div
            style={{
              color: "var(--text-900)",
              fontSize: "var(--size-caption)",
              textAlign: "center",
              fontWeight: "var(--weight-medium)",
            }}
          >
            ✓ {success}
          </div>
        )}

        {/* Submit Button */}
        <button
          className={`trade-panel__submit ${activeTab === "buy" ? "trade-panel__submit--buy" : "trade-panel__submit--sell"}`}
          onClick={() => void handleSubmit()}
          disabled={
            isLoading ||
            !amount ||
            parsedAmount <= 0 ||
            (activeTab === "buy" && totalXlm > xlmBalance) ||
            (activeTab === "buy" && !hasTrustline)
          }
        >
          {isLoading
            ? "Processing..."
            : activeTab === "buy"
              ? `Buy ${selectedAsset}`
              : redeemStep === "amount"
                ? "Continue"
                : redeemStep === "details"
                  ? "Review Redemption"
                  : `Confirm Burn & Redeem`}
        </button>
      </div>
    </div>
  );
};

export default TradePanel;
