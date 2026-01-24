import { useState } from "react";

const AdminPrices: React.FC = () => {
  const [assetCode, setAssetCode] = useState("");
  const [price, setPrice] = useState("");

  // Mock data
  const assetPrices = [
    { code: "TSLAH", price: "125.50", paymentAsset: "USDC" },
    { code: "APPLH", price: "185.00", paymentAsset: "USDC" },
    { code: "GOOGH", price: "142.75", paymentAsset: "USDC" },
  ];

  const handleSetPrice = () => {
    if (assetCode && price) {
      console.log("Setting price:", assetCode, price);
      setAssetCode("");
      setPrice("");
    }
  };

  return (
    <>
      {/* Set Price */}
      <div className="data-card" style={{ marginBottom: "var(--space-6)" }}>
        <h3
          className="data-card__title"
          style={{ marginBottom: "var(--space-4)" }}
        >
          Set Asset Price
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr auto",
            gap: "var(--space-3)",
          }}
        >
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Asset Code</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., TSLAH"
              value={assetCode}
              onChange={(e) => setAssetCode(e.target.value.toUpperCase())}
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Price (USDC)</label>
            <input
              type="number"
              className="form-input"
              placeholder="e.g., 125.50"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <button
            className="btn btn--primary"
            onClick={handleSetPrice}
            style={{ alignSelf: "flex-end" }}
          >
            Set Price
          </button>
        </div>
      </div>

      {/* Current Prices */}
      <div className="data-card">
        <h3
          className="data-card__title"
          style={{ marginBottom: "var(--space-4)" }}
        >
          Current Asset Prices
        </h3>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Asset Code</th>
                <th>Price</th>
                <th>Payment Asset</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assetPrices.map((asset) => (
                <tr key={asset.code}>
                  <td>
                    <strong>{asset.code}</strong>
                  </td>
                  <td>${asset.price}</td>
                  <td>{asset.paymentAsset}</td>
                  <td>
                    <button
                      className="btn btn--outline"
                      style={{ padding: "4px 12px", fontSize: "12px" }}
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminPrices;
