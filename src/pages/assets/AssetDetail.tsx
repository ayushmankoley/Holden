import { useParams } from "react-router-dom";
import "../PageStyles.css";

const AssetDetail: React.FC = () => {
  const { assetCode } = useParams<{ assetCode: string }>();

  // Mock data - in real app, fetch from contract
  const asset = {
    code: assetCode || "UNKNOWN",
    name: `${assetCode} Asset`,
    issuer: "GCDPEKYIWTH4DWGYPALZ7RLGCP32C6RZ2BZAF4EJEU7BGCGOAEMEIZZ4",
    active: true,
    price: "125.50",
    metadataUri:
      "ipfs://bafkreigpf7f5ytwfrtap4tmgu5mfz42ixx2p25nn5i5dg5wt2ofdlmzc5e",
  };

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">{asset.name}</h1>
        <p className="page__subtitle">Asset Code: {asset.code}</p>
      </div>

      <div className="page__content">
        {/* Stats Row */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-card__value">${asset.price}</div>
            <div className="stat-card__label">Current Price</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__value">{asset.active ? "✓" : "✗"}</div>
            <div className="stat-card__label">Status</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__value">1,250</div>
            <div className="stat-card__label">Total Supply</div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="card-grid">
          {/* Buy Card */}
          <div className="data-card">
            <div className="data-card__header">
              <h3 className="data-card__title">Buy {asset.code}</h3>
              <span className="data-card__badge">Primary Issuance</span>
            </div>
            <p style={{ marginBottom: "var(--space-5)", opacity: 0.7 }}>
              Purchase tokens through the regulated issuance flow. KYC required.
            </p>
            <div className="form-group">
              <label className="form-label">Amount</label>
              <input
                type="number"
                className="form-input"
                placeholder="Enter amount"
                min="1"
              />
            </div>
            <button className="btn btn--primary" style={{ width: "100%" }}>
              Buy Tokens
            </button>
          </div>

          {/* Redeem Card */}
          <div className="data-card">
            <div className="data-card__header">
              <h3 className="data-card__title">Redeem {asset.code}</h3>
            </div>
            <p style={{ marginBottom: "var(--space-5)", opacity: 0.7 }}>
              Burn tokens and receive underlying value through off-chain
              settlement.
            </p>
            <div className="form-group">
              <label className="form-label">Amount to Redeem</label>
              <input
                type="number"
                className="form-input"
                placeholder="Enter amount"
                min="1"
              />
            </div>
            <button className="btn btn--secondary" style={{ width: "100%" }}>
              Redeem Tokens
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
                  <td>{asset.code}</td>
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
                    {asset.issuer}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Metadata URI</strong>
                  </td>
                  <td>
                    <a
                      href={asset.metadataUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "var(--accent-purple)" }}
                    >
                      {asset.metadataUri}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Status</strong>
                  </td>
                  <td>{asset.active ? "Active" : "Inactive"}</td>
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
