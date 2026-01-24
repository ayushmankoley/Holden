import { useEffect, useState } from "react";
import AssetCard from "./AssetCard";
import "./CardRing.css";

// 12 sample assets for display with IPFS images
const SAMPLE_ASSETS = [
  {
    assetCode: "TSLAH",
    name: "Tesla Holdings",
    imageUrl:
      "https://ipfs.io/ipfs/bafkreidhtrfpnksjjw364fmzniudflfjhy2zauglkktfwkolyityzhruma",
  },
  {
    assetCode: "AAPLH",
    name: "Apple Holdings",
    imageUrl:
      "https://ipfs.io/ipfs/bafkreiaofe53sqvt3zu2t3zevid467sjvq5d4r7lr5y2odyfsnr44ubjm4",
  },
  {
    assetCode: "METAH",
    name: "Meta Holdings",
    imageUrl:
      "https://ipfs.io/ipfs/bafkreihlop4ueosv4edaznxz4ydwznj2vn52mdsnukmiielwgk2qugsa5e",
  },
  {
    assetCode: "AMZNH",
    name: "Amazon Holdings",
    imageUrl:
      "https://ipfs.io/ipfs/bafkreiajud4sl2piim47ojfwsxkaxgik5sfgikspkyc4i7h5fzuukq6jgi",
  },
  {
    assetCode: "NVDAH",
    name: "Nvidia Holdings",
    imageUrl:
      "https://ipfs.io/ipfs/bafkreidmobhs3hgt5xx5hzqxkpuw5vo4yyfxdzsk354nung3xq3lcr4gny",
  },
  {
    assetCode: "SONYH",
    name: "Sony Holdings",
    imageUrl:
      "https://ipfs.io/ipfs/bafkreihfiehzmgppufkdlwzerwdfz46yolpkvv4vpdjznmlwmp2hdif32m",
  },
  {
    assetCode: "TCSH",
    name: "TCS Holdings",
    imageUrl:
      "https://ipfs.io/ipfs/bafkreicds2sxkrmx7unlpmrrhdbuyy6j6kfhpsmdxhvvajzzffzjgc2inm",
  },
  {
    assetCode: "RELIANCEH",
    name: "Reliance Holdings",
    imageUrl:
      "https://ipfs.io/ipfs/bafkreiaxjg4sia4e4j3vm2z6sbohuuuelm2ppga6hhjaabc4eyipjcwcri",
  },
  {
    assetCode: "INFYH",
    name: "Infosys Holdings",
    imageUrl:
      "https://ipfs.io/ipfs/bafkreiddwklqrte622qmmqwapvfmevsfsjugy53hd5i5vt56subfsd7mpm",
  },
  {
    assetCode: "BAJFINANCEH",
    name: "Bajaj Finance Holdings",
    imageUrl:
      "https://ipfs.io/ipfs/bafkreidleyxfmrtn3dmpu4imw6zcrsrjkhz6hq6zwq7wsw5iwlbamad7we",
  },
  {
    assetCode: "XAUUSDH",
    name: "Gold Holdings",
    imageUrl:
      "https://ipfs.io/ipfs/bafkreig4ycoqllxmm35jtzso2zof3d73te3qxoalfvxumextjmef5qmfeq",
  },
  {
    assetCode: "XAGUSDH",
    name: "Silver Holdings",
    imageUrl:
      "https://ipfs.io/ipfs/bafkreigphz32byw6zhd7bfalknbedhi77l7tp4oiav3nuyc2cfamiubj3q",
  },
  {
    assetCode: "MCDH",
    name: "McDonald's Corp Holdings",
    imageUrl:
      "https://ipfs.io/ipfs/bafkreicezq6byaavlptynb7lj6dyco5bc6kg7lrzui5h7xruelcwqr5teq",
  },
  {
    assetCode: "NKEH",
    name: "Nike Holdings",
    imageUrl:
      "https://ipfs.io/ipfs/bafkreia2i4cwz5rsja6zf6a55shlc3t3wavoo3wcddvsejkbuhemazmcje",
  },
  {
    assetCode: "SBINH",
    name: "SBI Holdings",
    imageUrl:
      "https://ipfs.io/ipfs/bafkreibu55yw7pblhnwpxw5akc54tgygjepm2n3qpse34farn53b25qroq",
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
