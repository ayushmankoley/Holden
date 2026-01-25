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
          <div className="about-section__brand">
            <p className="about-section__label">Created by</p>
            <img
              src="/holden-logo.png"
              alt="Holden Logo"
              className="about-section__logo"
            />
            <p className="about-section__subtitle">Team</p>
            <p className="about-section__description">
              Building the future of finance with regulated, tokenized
              real-world assets. Secure, compliant, and always accessible.
            </p>
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
