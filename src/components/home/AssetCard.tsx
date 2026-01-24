import { useNavigate } from "react-router-dom";
import "./AssetCard.css";

interface AssetCardProps {
  assetCode: string;
  name: string;
  imageUrl?: string;
  isActive?: boolean;
  size?: "small" | "normal" | "large";
  style?: React.CSSProperties;
  tabIndex?: number;
}

const AssetCard: React.FC<AssetCardProps> = ({
  assetCode,
  name,
  imageUrl,
  isActive = true,
  size = "normal",
  style,
  tabIndex = 0,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    void navigate(`/assets/${assetCode}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  const sizeClass = size !== "normal" ? `asset-card--${size}` : "";

  return (
    <article
      className={`asset-card ${sizeClass}`}
      role="group"
      aria-label={`${name} (${assetCode})`}
      style={style}
      tabIndex={tabIndex}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div className="asset-card__preview">
        <div className="asset-card__content">
          <div className="asset-card__icon-wrapper">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={`${name} icon`}
                className="asset-card__icon-image"
                loading="lazy"
              />
            ) : (
              <span className="asset-card__icon-fallback">📈</span>
            )}
          </div>
          <span className="asset-card__ticker">${assetCode}</span>
        </div>
        {isActive && <span className="asset-card__badge">Active</span>}
      </div>

      <div className="asset-card__caption">
        <span className="asset-card__name">{name}</span>
        <span className="asset-card__arrow" aria-hidden="true">
          →
        </span>
      </div>
    </article>
  );
};

export default AssetCard;
