import { useState } from "react";
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

  return (
    <nav className="nav" role="navigation" aria-label="Main navigation">
      <div className="nav__left">
        <button
          className="nav__menu-btn"
          onClick={toggleMenu}
          aria-expanded={menuOpen}
          aria-controls="nav-dropdown"
        >
          <span className="nav__menu-icon" aria-hidden="true">
            <span></span>
            <span></span>
          </span>
          Menu
        </button>
      </div>

      <NavLink to="/" className="nav__logo">
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

      {/* Dropdown Menu */}
      <div
        id="nav-dropdown"
        className={`nav__dropdown ${menuOpen ? "is-open" : ""}`}
        role="menu"
      >
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
        <NavLink
          to="/transactions"
          className={({ isActive }) =>
            `nav__dropdown-link ${isActive ? "active" : ""}`
          }
          onClick={() => setMenuOpen(false)}
          role="menuitem"
        >
          Transactions
        </NavLink>
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `nav__dropdown-link ${isActive ? "active" : ""}`
          }
          onClick={() => setMenuOpen(false)}
          role="menuitem"
        >
          Admin
        </NavLink>
      </div>
    </nav>
  );
};

export default Navigation;
