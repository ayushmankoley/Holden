import "./PageStyles.css";

const Transactions: React.FC = () => {
  // Mock transactions - in real app, fetch from contract events / horizon
  const transactions: Array<{
    id: string;
    type: "buy" | "redeem";
    asset: string;
    amount: number;
    date: string;
    status: "completed" | "pending";
  }> = [];

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Transactions</h1>
        <p className="page__subtitle">View your transaction history</p>
      </div>

      <div className="page__content">
        {transactions.length === 0 ? (
          <div className="data-card">
            <div className="empty-state">
              <div className="empty-state__icon">📜</div>
              <h4 className="empty-state__title">No transactions yet</h4>
              <p className="empty-state__text">
                Your buy and redeem transactions will appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Asset</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>
                      <span
                        style={{
                          color:
                            tx.type === "buy"
                              ? "var(--accent-lime)"
                              : "var(--accent-purple)",
                          fontWeight: 600,
                          textTransform: "uppercase",
                        }}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td>{tx.asset}</td>
                    <td>{tx.amount}</td>
                    <td>{tx.date}</td>
                    <td>
                      <span
                        className="data-card__badge"
                        style={{
                          background:
                            tx.status === "completed"
                              ? "var(--accent-lime)"
                              : "var(--muted-gray)",
                        }}
                      >
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
