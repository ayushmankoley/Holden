import { useEffect, useState } from "react";
import AssetCard from "./AssetCard";
import "./CardRing.css";

// 12 sample assets for display with local images
const SAMPLE_ASSETS = [
  {
    assetCode: "TSLAH",
    name: "Tesla Holdings",
    imageUrl: "/tesla.png",
  },
  {
    assetCode: "AAPLH",
    name: "Apple Holdings",
    imageUrl: "/apple.jpg",
  },
  {
    assetCode: "METAH",
    name: "Meta Holdings",
    imageUrl: "/meta.png",
  },
  {
    assetCode: "AMZNH",
    name: "Amazon Holdings",
    imageUrl: "/amazon.png",
  },
  {
    assetCode: "NVDAH",
    name: "Nvidia Holdings",
    imageUrl: "/nvidia.png",
  },
  {
    assetCode: "SONYH",
    name: "Sony Holdings",
    imageUrl: "/sony.png",
  },
  {
    assetCode: "TCSH",
    name: "TCS Holdings",
    imageUrl: "/tcs.webp",
  },
  {
    assetCode: "RELIANCEH",
    name: "Reliance Holdings",
    imageUrl: "/reliaance.png",
  },
  {
    assetCode: "INFYH",
    name: "Infosys Holdings",
    imageUrl: "/infosys.jpg",
  },
  {
    assetCode: "BAJFINANCEH",
    name: "Bajaj Finance Holdings",
    imageUrl: "/bajaj.jpg",
  },
  {
    assetCode: "AMZNH",
    name: "Amazon Holdings",
    imageUrl: "/amazon.png",
  },
  {
    assetCode: "AAPLH",
    name: "Apple Holdings",
    imageUrl: "/apple.jpg",
  },
  {
    assetCode: "METAH",
    name: "Meta Holdings",
    imageUrl: "/meta.png",
  },
  {
    assetCode: "XAUUSDH",
    name: "Gold Holdings",
    imageUrl: "/gold.png",
  },
  {
    assetCode: "XAGUSDH",
    name: "Silver Holdings",
    imageUrl: "/silver.png",
  },
];

const CardRing: React.FC = () => {
  const [radius, setRadius] = useState(550);
  const [cardScale, setCardScale] = useState(0.8);

  // Calculate radius to span full viewport width (left to right corners)
  useEffect(() => {
    const calculateDimensions = () => {
      const vw = window.innerWidth;

      // Radius = half viewport width + extra for bigger ring
      // Adjusted for better 125% zoom support
      let radiusOffset: number;
      if (vw >= 1600) {
        radiusOffset = 280;
      } else if (vw >= 1400) {
        radiusOffset = 250;
      } else if (vw >= 1200) {
        radiusOffset = 200;
      } else if (vw >= 1024) {
        radiusOffset = 150;
      } else if (vw >= 900) {
        radiusOffset = 100;
      } else {
        radiusOffset = 80;
      }
      const newRadius = vw / 2 + radiusOffset;

      // Scale cards - granular sizing for all zoom levels including 125%
      let newScale: number;
      if (vw >= 1600) {
        newScale = 1.0;
      } else if (vw >= 1400) {
        newScale = 0.95;
      } else if (vw >= 1200) {
        newScale = 0.88;
      } else if (vw >= 1024) {
        newScale = 0.78;
      } else if (vw >= 900) {
        newScale = 0.7;
      } else if (vw >= 768) {
        newScale = 0.65;
      } else {
        newScale = 0.55; // Mobile - smaller cards
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
