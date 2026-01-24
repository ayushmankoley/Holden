import { Icon } from "@stellar/design-system";
import type { MappedBalances } from "../../../util/wallet";

interface PortfolioCardProps {
  balances: MappedBalances;
}

// Known Holden assets - filter to show only these
const HOLDEN_ASSETS = ["TSLAH", "AAPLH", "METAH", "AMZNH", "NVDAH"];

// Format balance for display
const formatBalance = (balance: string): string => {
  const num = parseFloat(balance.replace(/,/g, ""));
  if (isNaN(num)) return "0";
  if (num === 0) return "0";
  if (num < 0.01) return num.toFixed(7);
  return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
};

const PortfolioCard: React.FC<PortfolioCardProps> = ({ balances }) => {
  // Filter balances to show only Holden-issued tokens
  const holdenHoldings = Object.entries(balances).filter(([key]) => {
    // Check if key starts with any Holden asset code
    return HOLDEN_ASSETS.some((asset) => key.startsWith(asset));
  });

  // Get XLM balance for display
  const xlmBalance = balances.xlm?.balance ?? "0";

  // Calculate total portfolio value (simplified - just count tokens)
  const totalHoldenTokens = holdenHoldings.reduce((acc, [, balance]) => {
    return acc + parseFloat(balance.balance?.replace(/,/g, "") || "0");
  }, 0);

  return (
    <div className="portfolio-card">
      <div className="portfolio-card__header">
        <h3 className="portfolio-card__title">
          <Icon.Wallet01 /> Your Holden Holdings
        </h3>
      </div>

      {/* Summary Stats */}
      {holdenHoldings.length > 0 && (
        <div className="portfolio-card__summary">
          <div className="portfolio-card__summary-item">
            <span className="portfolio-card__summary-label">Total Tokens</span>
            <span className="portfolio-card__summary-value">
              {totalHoldenTokens.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      <div className="portfolio-card__list">
        {/* Always show XLM */}
        <div className="portfolio-card__item">
          <div className="portfolio-card__asset-info">
            <span className="portfolio-card__asset-icon">◎</span>
            <span className="portfolio-card__asset-name">XLM</span>
          </div>
          <span className="portfolio-card__asset-balance">
            {formatBalance(xlmBalance)}
          </span>
        </div>

        {holdenHoldings.length > 0 ? (
          holdenHoldings.map(([key, balance]) => {
            const assetCode = key.split(":")[0];
            return (
              <div
                key={key}
                className="portfolio-card__item portfolio-card__item--holden"
              >
                <div className="portfolio-card__asset-info">
                  <span className="portfolio-card__asset-icon">●</span>
                  <span className="portfolio-card__asset-name">
                    {assetCode}
                  </span>
                </div>
                <span className="portfolio-card__asset-balance">
                  {formatBalance(balance.balance)}
                </span>
              </div>
            );
          })
        ) : (
          <div className="portfolio-card__empty">
            <div className="portfolio-card__empty-icon">
              <Icon.CoinsStacked01 />
            </div>
            <p>No Holden tokens yet</p>
            <p style={{ fontSize: "12px", marginTop: "var(--space-2)" }}>
              Buy tokens to see them here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioCard;
