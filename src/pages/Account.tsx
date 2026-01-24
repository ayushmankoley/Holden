import "./PageStyles.css";

const Account: React.FC = () => {
  // Mock data - in real app, get from wallet context
  const isConnected = false;
  const address = "GCDPEKYIWTH4DWGYPALZ7RLGCP32C6RZ2BZAF4EJEU7BGCGOAEMEIZZ4";
  const isKycApproved = true;

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Account</h1>
        <p className="page__subtitle">Manage your wallet and KYC status</p>
      </div>

      <div className="page__content">
        {!isConnected ? (
          <div
            className="data-card"
            style={{ textAlign: "center", padding: "var(--space-9)" }}
          >
            <div style={{ fontSize: "48px", marginBottom: "var(--space-4)" }}>
              🔗
            </div>
            <h3 style={{ marginBottom: "var(--space-3)" }}>
              Connect Your Wallet
            </h3>
            <p style={{ opacity: 0.7, marginBottom: "var(--space-5)" }}>
              Connect a Stellar wallet to view your account and trade assets.
            </p>
            <button className="btn btn--primary">Connect Wallet</button>
          </div>
        ) : (
          <>
            {/* Wallet Info */}
            <div
              className="data-card"
              style={{ marginBottom: "var(--space-6)" }}
            >
              <div className="data-card__header">
                <h3 className="data-card__title">Wallet</h3>
                <span className="data-card__badge">Connected</span>
              </div>
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: "13px",
                  wordBreak: "break-all",
                }}
              >
                {address}
              </p>
            </div>

            {/* KYC Status */}
            <div
              className="data-card"
              style={{ marginBottom: "var(--space-6)" }}
            >
              <div className="data-card__header">
                <h3 className="data-card__title">KYC Status</h3>
                {isKycApproved ? (
                  <span className="data-card__badge">Approved</span>
                ) : (
                  <span
                    className="data-card__badge"
                    style={{ background: "#FF6B6B" }}
                  >
                    Not Verified
                  </span>
                )}
              </div>
              {isKycApproved ? (
                <p style={{ opacity: 0.7 }}>
                  Your identity has been verified. You can buy and redeem
                  assets.
                </p>
              ) : (
                <>
                  <p style={{ opacity: 0.7, marginBottom: "var(--space-4)" }}>
                    Complete KYC verification to access trading features.
                  </p>
                  <button className="btn btn--primary">
                    Start KYC Verification
                  </button>
                </>
              )}
            </div>

            {/* Holdings */}
            <div className="data-card">
              <h3
                className="data-card__title"
                style={{ marginBottom: "var(--space-5)" }}
              >
                Your Holdings
              </h3>
              <div className="empty-state">
                <div className="empty-state__icon">📊</div>
                <h4 className="empty-state__title">No holdings yet</h4>
                <p className="empty-state__text">
                  Purchase assets to see your portfolio here.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Account;
