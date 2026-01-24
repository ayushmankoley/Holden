import { useState, useEffect } from "react";
import { Icon } from "@stellar/design-system";
import { useWallet } from "../../hooks/useWallet";
import { connectWallet } from "../../util/wallet";
import kycRegistry from "../../contracts/kyc_registry";
import "./Dashboard.css";

// Components
import KycStatusCard from "./components/KycStatusCard";
import PortfolioCard from "./components/PortfolioCard";
import TradePanel from "./components/TradePanel";

const Dashboard: React.FC = () => {
  const { address, isPending, balances } = useWallet();
  const isConnected = !!address;

  // KYC status
  const [isKycApproved, setIsKycApproved] = useState(false);
  const [isKycLoading, setIsKycLoading] = useState(true);

  // Fetch KYC status
  useEffect(() => {
    const checkKyc = async () => {
      if (!address) {
        setIsKycApproved(false);
        setIsKycLoading(false);
        return;
      }

      try {
        setIsKycLoading(true);
        const result = await kycRegistry.is_kyc_approved({ address });
        setIsKycApproved(result.result);
      } catch (error) {
        console.error("Failed to check KYC status:", error);
        setIsKycApproved(false);
      } finally {
        setIsKycLoading(false);
      }
    };

    void checkKyc();
  }, [address]);

  if (!isConnected) {
    return (
      <div className="page">
        <div className="page__header">
          <h1 className="page__title">Dashboard</h1>
          <p className="page__subtitle">
            Connect your wallet to access your dashboard
          </p>
        </div>

        <div className="page__content">
          <div
            className="data-card"
            style={{ textAlign: "center", padding: "var(--space-9)" }}
          >
            <div className="dashboard__connect-icon">
              <Icon.Wallet01 />
            </div>
            <h3 style={{ marginBottom: "var(--space-3)" }}>
              Connect Your Wallet
            </h3>
            <p style={{ opacity: 0.7, marginBottom: "var(--space-5)" }}>
              Connect a Stellar wallet to view your holdings and trade assets.
            </p>
            <button
              className="btn btn--primary"
              onClick={() => void connectWallet()}
              disabled={isPending}
            >
              {isPending ? "Connecting..." : "Connect Wallet"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Dashboard</h1>
        <p className="page__subtitle">Manage your portfolio and trade assets</p>
      </div>

      <div className="page__content">
        {/* Dashboard Grid */}
        <div className="dashboard__grid">
          {/* Left Column - KYC Status */}
          <div className="dashboard__sidebar">
            <KycStatusCard
              isLoading={isKycLoading}
              isApproved={isKycApproved}
              address={address}
            />
          </div>

          {/* Center Column - Trade Panel */}
          <div className="dashboard__main">
            <TradePanel
              isKycApproved={isKycApproved}
              address={address}
              balances={balances}
            />
          </div>

          {/* Right Column - Portfolio */}
          <div className="dashboard__sidebar">
            <PortfolioCard balances={balances} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
