import { useEffect, useState } from "react";
import AssetCard from "./AssetCard";
import "./CardRing.css";

// 18 sample assets for display (more cards = less gap between them)
const SAMPLE_ASSETS = [
  { assetCode: "TSLAH", name: "Tesla Holdings", imageUrl: "" },
  { assetCode: "APPLH", name: "Apple Holdings", imageUrl: "" },
  { assetCode: "GOOGH", name: "Google Holdings", imageUrl: "" },
  { assetCode: "AMZNH", name: "Amazon Holdings", imageUrl: "" },
  { assetCode: "MSFTH", name: "Microsoft Holdings", imageUrl: "" },
  { assetCode: "NVDAH", name: "Nvidia Holdings", imageUrl: "" },
  { assetCode: "METAH", name: "Meta Holdings", imageUrl: "" },
  { assetCode: "NFLXH", name: "Netflix Holdings", imageUrl: "" },
  { assetCode: "SPOTF", name: "Spotify Holdings", imageUrl: "" },
  { assetCode: "DISNH", name: "Disney Holdings", imageUrl: "" },
  { assetCode: "ADBEH", name: "Adobe Holdings", imageUrl: "" },
  { assetCode: "INTCH", name: "Intel Holdings", imageUrl: "" },
  { assetCode: "AMDH", name: "AMD Holdings", imageUrl: "" },
  { assetCode: "COINH", name: "Coinbase Holdings", imageUrl: "" },
  { assetCode: "UBERH", name: "Uber Holdings", imageUrl: "" },
];

const CardRing: React.FC = () => {
  const [radius, setRadius] = useState(550);
  const [cardScale, setCardScale] = useState(0.8);

  // Calculate radius to span full viewport width (left to right corners)
  useEffect(() => {
    const calculateDimensions = () => {
      const vw = window.innerWidth;

      // Radius = half viewport width + extra for bigger ring
      const newRadius = vw / 2 + 250;

      // Scale cards - MUCH BIGGER sizes
      let newScale: number;
      if (vw >= 1400) {
        newScale = 1.0;
      } else if (vw >= 1200) {
        newScale = 0.95;
      } else if (vw >= 992) {
        newScale = 0.85;
      } else if (vw >= 768) {
        newScale = 0.75;
      } else {
        newScale = 0.65;
      }

      setRadius(newRadius);
      setCardScale(newScale);
    };

    calculateDimensions();
    window.addEventListener("resize", calculateDimensions);
    return () => window.removeEventListener("resize", calculateDimensions);
  }, []);

  const numCards = SAMPLE_ASSETS.length;
  const angleStep = 360 / numCards;

  return (
    <>
      {/* Desktop: Rotating ring - positioned at bottom of wrapper */}
      <div
        className="card-ring"
        aria-hidden="true"
        style={{ "--card-scale": cardScale } as React.CSSProperties}
      >
        <div className="card-ring__rotator">
          {SAMPLE_ASSETS.map((asset, index) => {
            const angle = index * angleStep;

            return (
              <div
                key={asset.assetCode}
                className="card-ring__card"
                style={{
                  transform: `rotate(${angle}deg) translateY(-${radius}px)`,
                }}
              >
                <AssetCard
                  assetCode={asset.assetCode}
                  name={asset.name}
                  imageUrl={asset.imageUrl}
                  tabIndex={-1}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: Horizontal scroll */}
      <div className="cards-row">
        {SAMPLE_ASSETS.map((asset) => (
          <AssetCard
            key={asset.assetCode}
            assetCode={asset.assetCode}
            name={asset.name}
            imageUrl={asset.imageUrl}
            size="small"
          />
        ))}
      </div>
    </>
  );
};

export default CardRing;
