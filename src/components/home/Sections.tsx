import { useState } from "react";
import "./Sections.css";

/* ==========================================================================
   Description Section
   ========================================================================== */

export const DescriptionSection: React.FC = () => {
  return (
    <section className="description-section">
      <div className="description-section__content">
        <p className="description-section__text">
          Holden is an ever-growing platform with{" "}
          <span className="description-section__highlight">
            regulated real-world assets
          </span>
          . Get exclusive access to tokenized securities, institutional-grade
          infrastructure, and compliant trading on Stellar.
        </p>
      </div>
    </section>
  );
};

/* ==========================================================================
   About Section (Asymmetric Panels)
   ========================================================================== */

export const AboutSection: React.FC = () => {
  return (
    <section className="about-section">
      <div className="about-section__grid">
        {/* Left Panel - Purple */}
        <div className="about-section__left">
          <div>
            <p className="about-section__label">Created by</p>
            <h2 className="about-section__title">The Holden</h2>
            <p className="about-section__subtitle">Team</p>
          </div>
          <button className="about-section__cta">About us</button>
        </div>

        {/* Right Panel - Dark Oval */}
        <div className="about-section__right">
          <div className="about-section__right-header">
            <p className="about-section__updates-label">Latest updates</p>
            <p className="about-section__updates-title">from Holden</p>
          </div>

          <div className="about-section__update-card">
            <div className="about-section__update-badge">
              <span className="about-section__update-badge-time">
                3 days ago
              </span>
              <span className="about-section__update-badge-new">New Asset</span>
            </div>
            <h3 className="about-section__update-title">
              Tesla Holdings (TSLAH) Now Available
            </h3>
            <p className="about-section__update-category">Equity</p>
          </div>

          <p className="about-section__note">New assets added regularly!</p>
        </div>
      </div>
    </section>
  );
};

/* ==========================================================================
   Features Section
   ========================================================================== */

const FEATURE_TABS = [
  "Asset Vault",
  "Trading",
  "Security",
  "Compliance",
  "API",
];

export const FeaturesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Asset Vault");

  return (
    <section className="features-section">
      <div className="features-section__content">
        <h2 className="features-section__title">
          A growing toolkit for
          <br />
          regulated investing
        </h2>

        <p className="features-section__subtitle">
          Access everything with a single membership:
        </p>

        <div className="features-section__tabs" role="tablist">
          {FEATURE_TABS.map((tab) => (
            <button
              key={tab}
              className={`features-section__tab ${activeTab === tab ? "is-active" : ""}`}
              onClick={() => setActiveTab(tab)}
              role="tab"
              aria-selected={activeTab === tab}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="features-section__featured">
          <div className="features-section__featured-card">
            <p className="features-section__featured-label">
              PART OF THE
              <span className="features-section__featured-badge">
                MEMBERSHIP
              </span>
            </p>
            <div
              className="features-section__featured-glyph"
              aria-hidden="true"
            >
              ✶
            </div>
            <h3 className="features-section__featured-title">
              The {activeTab}
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
};
