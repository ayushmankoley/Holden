import { Layout } from "@stellar/design-system";
import "./App.module.css";
import ConnectAccount from "./components/ConnectAccount";
import { Routes, Route, Outlet, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Debugger from "./pages/Debugger";

const AppLayout: React.FC = () => (
  <main>
    <Layout.Header
      projectId="Holden"
      projectTitle="Holden"
      contentRight={
        <>
          <nav>
            <NavLink to="/debug" style={{ textDecoration: "none" }}>
              {({ isActive }) => (
                <button
                  style={{
                    opacity: isActive ? 0.5 : 1,
                    cursor: isActive ? "default" : "pointer",
                  }}
                  disabled={isActive}
                >
                  Debugger
                </button>
              )}
            </NavLink>
          </nav>
          <ConnectAccount />
        </>
      }
    />

    {/* MAIN CONTENT */}
    <Layout.Content>
      <Outlet />
    </Layout.Content>

    <Layout.Footer>
      <span>© {new Date().getFullYear()} Holden. All rights reserved.</span>
    </Layout.Footer>
  </main>
);

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/debug" element={<Debugger />} />
        <Route path="/debug/:contractName" element={<Debugger />} />
      </Route>
    </Routes>
  );
}

export default App;
