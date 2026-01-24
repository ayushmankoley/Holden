import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navigation.css";

const Navigation: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleConnectClick = () => {
    void navigate("/account");
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
        >
          Connect Wallet
        </button>
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
        <NavLink
          to="/debug"
          className={({ isActive }) =>
            `nav__dropdown-link ${isActive ? "active" : ""}`
          }
          onClick={() => setMenuOpen(false)}
          role="menuitem"
        >
          Debugger
        </NavLink>
      </div>
    </nav>
  );
};

export default Navigation;
