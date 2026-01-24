import { Routes, Route, Outlet } from "react-router-dom";
import "./index.css";

// Layout components
import Navigation from "./components/layout/Navigation";
import Footer from "./components/layout/Footer";

// Pages
import Home from "./pages/Home";
import AssetDetail from "./pages/assets/AssetDetail";
import Dashboard from "./pages/Dashboard/Dashboard";
import Transactions from "./pages/Transactions";
import Admin, { AdminOverview } from "./pages/admin/Admin";
import AdminKyc from "./pages/admin/AdminKyc";
import AdminPrices from "./pages/admin/AdminPrices";
import AdminIssuance from "./pages/admin/AdminIssuance";
import AdminRedemption from "./pages/admin/AdminRedemption";
import Debugger from "./pages/Debugger";

// Main App Layout with custom Navigation and Footer
const AppLayout: React.FC = () => (
  <div className="app">
    <Navigation />
    <main className="app__main">
      <Outlet />
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Assets */}
        <Route path="/assets/:assetCode" element={<AssetDetail />} />

        {/* User Dashboard */}
        <Route path="/account" element={<Dashboard />} />

        {/* Transactions */}
        <Route path="/transactions" element={<Transactions />} />

        {/* Admin Dashboard with nested routes */}
        <Route path="/admin" element={<Admin />}>
          <Route index element={<AdminOverview />} />
          <Route path="kyc" element={<AdminKyc />} />
          <Route path="prices" element={<AdminPrices />} />
          <Route path="issuance" element={<AdminIssuance />} />
          <Route path="redemption" element={<AdminRedemption />} />
        </Route>

        {/* Debugger (existing) */}
        <Route path="/debug" element={<Debugger />} />
        <Route path="/debug/:contractName" element={<Debugger />} />
      </Route>
    </Routes>
  );
}

export default App;
