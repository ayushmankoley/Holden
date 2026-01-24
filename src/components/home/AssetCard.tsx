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
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${name} preview`}
            className="asset-card__preview-image"
            loading="lazy"
          />
        ) : (
          <div className="asset-card__preview-placeholder">
            <div className="asset-card__preview-icon">📈</div>
            <span className="asset-card__preview-ticker">{assetCode}</span>
          </div>
        )}
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
