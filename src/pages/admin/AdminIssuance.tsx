const AdminIssuance: React.FC = () => {
  // Mock data
  const issuanceEvents = [
    {
      id: "1",
      buyer: "GCDP...IZZ4",
      asset: "TSLAH",
      amount: 10,
      value: "$1,255",
      date: "2026-01-24",
    },
    {
      id: "2",
      buyer: "GBXG...XON",
      asset: "APPLH",
      amount: 5,
      value: "$925",
      date: "2026-01-23",
    },
  ];

  return (
    <>
      {/* Controls */}
      <div className="card-grid" style={{ marginBottom: "var(--space-6)" }}>
        <div className="data-card">
          <div className="data-card__header">
            <h3 className="data-card__title">Issuance Status</h3>
            <span className="data-card__badge">Active</span>
          </div>
          <p style={{ opacity: 0.7, marginBottom: "var(--space-4)" }}>
            Primary issuance is currently enabled. Users can buy tokens.
          </p>
          <button className="btn btn--secondary">Pause Issuance</button>
        </div>

        <div className="data-card">
          <div className="data-card__header">
            <h3 className="data-card__title">Total Issuance</h3>
          </div>
          <div style={{ fontSize: "var(--size-h2)", fontWeight: 800 }}>
            $45,230
          </div>
          <p style={{ opacity: 0.5, fontSize: "var(--size-caption)" }}>
            Across all assets
          </p>
        </div>
      </div>

      {/* Recent Events */}
      <div className="data-card">
        <h3
          className="data-card__title"
          style={{ marginBottom: "var(--space-4)" }}
        >
          Recent Issuance Events
        </h3>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Buyer</th>
                <th>Asset</th>
                <th>Amount</th>
                <th>Value</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {issuanceEvents.map((event) => (
                <tr key={event.id}>
                  <td style={{ fontFamily: "monospace", fontSize: "13px" }}>
                    {event.buyer}
                  </td>
                  <td>
                    <strong>{event.asset}</strong>
                  </td>
                  <td>{event.amount}</td>
                  <td>{event.value}</td>
                  <td>{event.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminIssuance;
