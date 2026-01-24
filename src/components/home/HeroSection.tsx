import CardRing from "./CardRing";
import Marquee from "./Marquee";
import "./HeroSection.css";

const CHIPS = [
  "Stocks",
  "Bonds",
  "Real Estate",
  "Commodities",
  "Private Equity",
];

const HeroSection: React.FC = () => {
  return (
    <section className="hero">
      <div className="hero__content">
        <h1 className="hero__title">
          <span className="hero__title-line">Hold What</span>
          <span className="hero__title-line">
            <span className="hero__glyph" aria-hidden="true">
              ✶
            </span>{" "}
            Matters
          </span>
        </h1>

        <p className="hero__subtitle">
          Platform packed with regulated real-world assets,
          <br />
          tokenized securities, and institutional-grade infrastructure.
        </p>

        <div className="hero__chips" role="list" aria-label="Asset categories">
          {CHIPS.map((chip) => (
            <span key={chip} className="hero__chip" role="listitem">
              {chip}
            </span>
          ))}
        </div>
      </div>

      <div className="hero__ring-wrapper">
        <CardRing />
      </div>

      <div className="hero__marquee">
        <Marquee />
      </div>
    </section>
  );
};

export default HeroSection;
