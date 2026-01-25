import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Icon } from "@stellar/design-system";
import { useWallet } from "../../hooks/useWallet";
import { connectWallet, disconnectWallet } from "../../util/wallet";
import "./Navigation.css";

const Navigation: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);
  const { address, isPending } = useWallet();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleConnectClick = () => {
    if (address) {
      setWalletDropdownOpen(!walletDropdownOpen);
    } else {
      void connectWallet();
    }
  };

  const handleCopyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setWalletDropdownOpen(false);
    }
  };

  const handleDisconnect = async () => {
    await disconnectWallet();
    setWalletDropdownOpen(false);
  };

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [menuOpen]);

  return (
    <>
      {/* Backdrop overlay when menu is open */}
      <div
        className={`nav-backdrop ${menuOpen ? "is-visible" : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      <nav
        className={`nav ${menuOpen ? "nav--expanded" : ""}`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Navigation Header */}
        <div className="nav__header">
          <div className="nav__left">
            <button
              className="nav__menu-btn"
              onClick={toggleMenu}
              aria-expanded={menuOpen}
              aria-controls="nav-dropdown"
            >
              <span
                className={`nav__menu-icon ${menuOpen ? "is-open" : ""}`}
                aria-hidden="true"
              >
                <span></span>
                <span></span>
              </span>
              Menu
            </button>
          </div>

          <NavLink
            to="/"
            className="nav__logo"
            onClick={() => setMenuOpen(false)}
          >
            HOLDEN
            <span className="nav__glyph" aria-hidden="true">
              ✶
            </span>
          </NavLink>

          <div className="nav__right">
            <button
              className="nav__btn nav__btn--connect"
              onClick={handleConnectClick}
              disabled={isPending}
            >
              {isPending
                ? "Connecting..."
                : address
                  ? `${address.slice(0, 4)}...${address.slice(-4)}`
                  : "Connect Wallet"}
            </button>

            {/* Wallet Dropdown */}
            {address && walletDropdownOpen && (
              <div className="nav__wallet-dropdown">
                <button
                  className="nav__wallet-dropdown-item"
                  onClick={() => void handleCopyAddress()}
                >
                  <Icon.Copy01 /> Copy Address
                </button>
                <button
                  className="nav__wallet-dropdown-item nav__wallet-dropdown-item--danger"
                  onClick={() => void handleDisconnect()}
                >
                  <Icon.XClose /> Disconnect
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Expanded Menu Content */}
        <div
          id="nav-dropdown"
          className={`nav__dropdown ${menuOpen ? "is-open" : ""}`}
          role="menu"
        >
          <div className="nav__dropdown-grid">
            {/* Navigation Column */}
            {/* Navigation Column */}
            <div className="nav__dropdown-column">
              <span className="nav__dropdown-label" style={{ color: "white" }}>
                Navigation
              </span>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `nav__dropdown-link ${isActive ? "active" : ""}`
                }
                onClick={() => setMenuOpen(false)}
                role="menuitem"
              >
                Home
              </NavLink>
              <NavLink
                to="/account"
                className={({ isActive }) =>
                  `nav__dropdown-link ${isActive ? "active" : ""}`
                }
                onClick={() => setMenuOpen(false)}
                role="menuitem"
              >
                Account
              </NavLink>
            </div>

            {/* Explore Column */}
            <div className="nav__dropdown-column">
              <span className="nav__dropdown-label" style={{ color: "white" }}>
                Explore
              </span>
              <NavLink
                to="/assets/TSLAH"
                className="nav__dropdown-link"
                onClick={() => setMenuOpen(false)}
                role="menuitem"
              >
                $TSLAH
              </NavLink>
              <NavLink
                to="/assets/AAPLH"
                className="nav__dropdown-link"
                onClick={() => setMenuOpen(false)}
                role="menuitem"
              >
                $AAPLH
              </NavLink>
              <NavLink
                to="/assets/METAH"
                className="nav__dropdown-link"
                onClick={() => setMenuOpen(false)}
                role="menuitem"
              >
                $METAH
              </NavLink>
              <NavLink
                to="/assets/AMZNH"
                className="nav__dropdown-link"
                onClick={() => setMenuOpen(false)}
                role="menuitem"
              >
                $AMZNH
              </NavLink>
              <NavLink
                to="/assets/NVDAH"
                className="nav__dropdown-link"
                onClick={() => setMenuOpen(false)}
                role="menuitem"
              >
                $NVDAH
              </NavLink>
            </div>

            {/* Featured Section */}
            <div className="nav__dropdown-featured">
              <span className="nav__dropdown-badge">Featured</span>
              <div className="nav__dropdown-featured-content">
                <h3 className="nav__dropdown-featured-title">
                  Real-World Assets
                  <br />
                  On Stellar
                </h3>
                <p className="nav__dropdown-featured-text">
                  Trade tokenized stocks with instant settlement
                </p>
                <NavLink
                  to="/account"
                  className="nav__dropdown-featured-btn"
                  onClick={() => setMenuOpen(false)}
                >
                  Get Started
                </NavLink>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="nav__dropdown-footer">
            <div className="nav__social-links">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="nav__social-link"
                aria-label="Twitter"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                className="nav__social-link"
                aria-label="Discord"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </a>
              <a
                href="https://github.com/ayushmankoley/Holden"
                target="_blank"
                rel="noopener noreferrer"
                className="nav__social-link"
                aria-label="GitHub"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
