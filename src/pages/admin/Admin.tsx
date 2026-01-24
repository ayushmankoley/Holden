import { NavLink, Outlet } from "react-router-dom";
import "../PageStyles.css";

const Admin: React.FC = () => {
  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Admin Dashboard</h1>
        <p className="page__subtitle">
          Manage KYC, pricing, and contract controls
        </p>
      </div>

      <div className="page__content">
        {/* Admin Navigation */}
        <nav
          style={{
            display: "flex",
            gap: "var(--space-3)",
            marginBottom: "var(--space-6)",
            flexWrap: "wrap",
          }}
        >
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `btn ${isActive ? "btn--primary" : "btn--outline"}`
            }
          >
            Overview
          </NavLink>
          <NavLink
            to="/admin/kyc"
            className={({ isActive }) =>
              `btn ${isActive ? "btn--primary" : "btn--outline"}`
            }
          >
            KYC Management
          </NavLink>
          <NavLink
            to="/admin/prices"
            className={({ isActive }) =>
              `btn ${isActive ? "btn--primary" : "btn--outline"}`
            }
          >
            Pricing
          </NavLink>
          <NavLink
            to="/admin/issuance"
            className={({ isActive }) =>
              `btn ${isActive ? "btn--primary" : "btn--outline"}`
            }
          >
            Issuance Control
          </NavLink>
          <NavLink
            to="/admin/redemption"
            className={({ isActive }) =>
              `btn ${isActive ? "btn--primary" : "btn--outline"}`
            }
          >
            Redemptions
          </NavLink>
        </nav>

        {/* Nested Routes Outlet */}
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;

/* ==========================================================================
   Admin Overview (default view)
   ========================================================================== */

export const AdminOverview: React.FC = () => {
  return (
    <>
      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-card__value">4</div>
          <div className="stat-card__label">Registered Assets</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">12</div>
          <div className="stat-card__label">KYC Approved Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">$45,230</div>
          <div className="stat-card__label">Total Issued</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">$8,120</div>
          <div className="stat-card__label">Pending Redemptions</div>
        </div>
      </div>

      {/* Contract Status */}
      <div className="card-grid">
        <div className="data-card">
          <div className="data-card__header">
            <h3 className="data-card__title">Issuance Status</h3>
            <span className="data-card__badge">Active</span>
          </div>
          <p style={{ opacity: 0.7, marginBottom: "var(--space-4)" }}>
            Primary issuance is currently enabled.
          </p>
          <button className="btn btn--outline">Pause Issuance</button>
        </div>

        <div className="data-card">
          <div className="data-card__header">
            <h3 className="data-card__title">Redemption Status</h3>
            <span className="data-card__badge">Active</span>
          </div>
          <p style={{ opacity: 0.7, marginBottom: "var(--space-4)" }}>
            Token redemption is currently enabled.
          </p>
          <button className="btn btn--outline">Pause Redemption</button>
        </div>
      </div>
    </>
  );
};
