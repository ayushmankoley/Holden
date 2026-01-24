const AdminRedemption: React.FC = () => {
  // Mock data
  const redemptionRequests = [
    {
      id: "1",
      user: "GCDP...IZZ4",
      asset: "TSLAH",
      amount: 5,
      status: "pending",
      date: "2026-01-24",
    },
    {
      id: "2",
      user: "GBXG...XON",
      asset: "APPLH",
      amount: 2,
      status: "completed",
      date: "2026-01-22",
    },
  ];

  return (
    <>
      {/* Controls */}
      <div className="card-grid" style={{ marginBottom: "var(--space-6)" }}>
        <div className="data-card">
          <div className="data-card__header">
            <h3 className="data-card__title">Redemption Status</h3>
            <span className="data-card__badge">Active</span>
          </div>
          <p style={{ opacity: 0.7, marginBottom: "var(--space-4)" }}>
            Token redemption is currently enabled. Users can burn tokens.
          </p>
          <button className="btn btn--secondary">Pause Redemption</button>
        </div>

        <div className="data-card">
          <div className="data-card__header">
            <h3 className="data-card__title">Pending Value</h3>
          </div>
          <div style={{ fontSize: "var(--size-h2)", fontWeight: 800 }}>
            $8,120
          </div>
          <p style={{ opacity: 0.5, fontSize: "var(--size-caption)" }}>
            Awaiting off-chain settlement
          </p>
        </div>
      </div>

      {/* Redemption Requests */}
      <div className="data-card">
        <h3
          className="data-card__title"
          style={{ marginBottom: "var(--space-4)" }}
        >
          Redemption Requests
        </h3>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Asset</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {redemptionRequests.map((req) => (
                <tr key={req.id}>
                  <td style={{ fontFamily: "monospace", fontSize: "13px" }}>
                    {req.user}
                  </td>
                  <td>
                    <strong>{req.asset}</strong>
                  </td>
                  <td>{req.amount}</td>
                  <td>{req.date}</td>
                  <td>
                    <span
                      className="data-card__badge"
                      style={{
                        background:
                          req.status === "completed"
                            ? "var(--accent-lime)"
                            : "var(--muted-gray)",
                      }}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td>
                    {req.status === "pending" && (
                      <button
                        className="btn btn--primary"
                        style={{ padding: "4px 12px", fontSize: "12px" }}
                      >
                        Mark Complete
                      </button>
                    )}
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

export default AdminRedemption;
