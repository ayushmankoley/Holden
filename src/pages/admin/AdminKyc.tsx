import { useState } from "react";

const AdminKyc: React.FC = () => {
  const [newAddress, setNewAddress] = useState("");

  // Mock data
  const approvedAddresses = [
    "GCDPEKYIWTH4DWGYPALZ7RLGCP32C6RZ2BZAF4EJEU7BGCGOAEMEIZZ4",
    "GBXGQJWVLWOYHFLVTKWV5FGHA3LNYY2JQKM7OAJAUEQFU6LPCSEFVXON",
  ];

  const handleAddKyc = () => {
    if (newAddress.trim()) {
      console.log("Adding to KYC:", newAddress);
      setNewAddress("");
    }
  };

  return (
    <>
      {/* Add KYC */}
      <div className="data-card" style={{ marginBottom: "var(--space-6)" }}>
        <h3
          className="data-card__title"
          style={{ marginBottom: "var(--space-4)" }}
        >
          Add to KYC List
        </h3>
        <div
          style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}
        >
          <input
            type="text"
            className="form-input"
            placeholder="Enter Stellar address (G...)"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            style={{ flex: 1, minWidth: "300px" }}
          />
          <button className="btn btn--primary" onClick={handleAddKyc}>
            Add to KYC
          </button>
        </div>
      </div>

      {/* Approved Addresses */}
      <div className="data-card">
        <div className="data-card__header">
          <h3 className="data-card__title">KYC Approved Addresses</h3>
          <span className="data-card__badge">
            {approvedAddresses.length} Approved
          </span>
        </div>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {approvedAddresses.map((address) => (
                <tr key={address}>
                  <td style={{ fontFamily: "monospace", fontSize: "13px" }}>
                    {address}
                  </td>
                  <td>
                    <button
                      className="btn btn--outline"
                      style={{ padding: "4px 12px", fontSize: "12px" }}
                    >
                      Remove
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

export default AdminKyc;
