import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Icon } from "@stellar/design-system";
import issuanceController from "../../contracts/issuance_controller";
import "../PageStyles.css";

// Asset metadata for all 12 tokens
const ASSET_METADATA: Record<
  string,
  { name: string; exchange: string; stockSymbol: string; category: string }
> = {
  TSLAH: {
    name: "Tesla Holdings",
    exchange: "NASDAQ",
    stockSymbol: "TSLA",
    category: "US Equity",
  },
  AAPLH: {
    name: "Apple Holdings",
    exchange: "NASDAQ",
    stockSymbol: "AAPL",
    category: "US Equity",
  },
  METAH: {
    name: "Meta Holdings",
    exchange: "NASDAQ",
    stockSymbol: "META",
    category: "US Equity",
  },
  AMZNH: {
    name: "Amazon Holdings",
    exchange: "NASDAQ",
    stockSymbol: "AMZN",
    category: "US Equity",
  },
  NVDAH: {
    name: "Nvidia Holdings",
    exchange: "NASDAQ",
    stockSymbol: "NVDA",
    category: "US Equity",
  },
  SONYH: {
    name: "Sony Holdings",
    exchange: "NYSE",
    stockSymbol: "SONY",
    category: "US Equity",
  },
  TCSH: {
    name: "TCS Holdings",
    exchange: "NSE",
    stockSymbol: "TCS",
    category: "Indian Equity",
  },
  RELIANCEH: {
    name: "Reliance Holdings",
    exchange: "NSE",
    stockSymbol: "RELIANCE",
    category: "Indian Equity",
  },
  INFYH: {
    name: "Infosys Holdings",
    exchange: "NSE",
    stockSymbol: "INFY",
    category: "Indian Equity",
  },
  BAJFINANCEH: {
    name: "Bajaj Finance Holdings",
    exchange: "NSE",
    stockSymbol: "BAJFINANCE",
    category: "Indian Equity",
  },
  XAUUSDH: {
    name: "Gold Holdings",
    exchange: "COMMODITY",
    stockSymbol: "XAU/USD",
    category: "Commodity",
  },
  XAGUSDH: {
    name: "Silver Holdings",
    exchange: "COMMODITY",
    stockSymbol: "XAG/USD",
    category: "Commodity",
  },
};

const ISSUER = "GCDPEKYIWTH4DWGYPALZ7RLGCP32C6RZ2BZAF4EJEU7BGCGOAEMEIZZ4";

const AssetDetail: React.FC = () => {
  const { assetCode } = useParams<{ assetCode: string }>();
  const navigate = useNavigate();
  const [price, setPrice] = useState<string>("Loading...");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real price from chain
  useEffect(() => {
    const fetchPrice = async () => {
      if (!assetCode) return;

      try {
        setIsLoading(true);
        const result = await issuanceController.get_price({
          asset_code: assetCode,
        });
        // Convert from contract format to USD (price is USD * 1,000,000)
        const priceValue = Number(result.result.price_per_unit) / 1000000;
        setPrice(
          priceValue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
        );
      } catch (err) {
        console.error("Failed to fetch price:", err);
        setPrice("N/A");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchPrice();
  }, [assetCode]);

  const metadata = assetCode ? ASSET_METADATA[assetCode] : null;
  const assetName = metadata?.name || `${assetCode} Asset`;
  const exchange = metadata?.exchange || "Unknown";
  const stockSymbol = metadata?.stockSymbol || assetCode;
  const category = metadata?.category || "Asset";

  const handleTradeClick = () => {
    void navigate("/dashboard");
  };

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">{assetName}</h1>
        <p className="page__subtitle">
          {stockSymbol} • {exchange} • {category}
        </p>
      </div>

      <div className="page__content">
        {/* Stats Row */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-card__value">
              {isLoading ? "..." : `$${price}`}
            </div>
            <div className="stat-card__label">Current Price (USD)</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__value">✓</div>
            <div className="stat-card__label">Status: Active</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__value">{exchange}</div>
            <div className="stat-card__label">Exchange</div>
          </div>
        </div>

        {/* Trade Action Card */}
        <div className="data-card" style={{ marginTop: "var(--space-6)" }}>
          <div className="data-card__header">
            <h3 className="data-card__title">
              <Icon.Coins01 /> Trade {assetCode}
            </h3>
            <span className="data-card__badge">KYC Required</span>
          </div>
          <p style={{ marginBottom: "var(--space-5)", opacity: 0.7 }}>
            Buy or redeem {assetName} tokens through the Holden platform.
            Complete KYC verification to access trading features.
          </p>
          <div style={{ display: "flex", gap: "var(--space-3)" }}>
            <button
              className="btn btn--primary"
              style={{ flex: 1 }}
              onClick={handleTradeClick}
            >
              <Icon.ArrowUp /> Buy Tokens
            </button>
            <button
              className="btn btn--secondary"
              style={{ flex: 1 }}
              onClick={handleTradeClick}
            >
              <Icon.ArrowDown /> Redeem Tokens
            </button>
          </div>
        </div>

        {/* Asset Details */}
        <div className="data-card" style={{ marginTop: "var(--space-6)" }}>
          <h3
            className="data-card__title"
            style={{ marginBottom: "var(--space-5)" }}
          >
            Asset Details
          </h3>
          <div className="table-wrapper">
            <table className="table">
              <tbody>
                <tr>
                  <td>
                    <strong>Asset Code</strong>
                  </td>
                  <td>{assetCode}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Underlying Symbol</strong>
                  </td>
                  <td>{stockSymbol}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Exchange</strong>
                  </td>
                  <td>{exchange}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Category</strong>
                  </td>
                  <td>{category}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Issuer</strong>
                  </td>
                  <td
                    style={{
                      wordBreak: "break-all",
                      fontFamily: "monospace",
                      fontSize: "13px",
                    }}
                  >
                    {ISSUER}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Status</strong>
                  </td>
                  <td>
                    <span style={{ color: "var(--accent-lime)" }}>
                      ● Active
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDetail;
