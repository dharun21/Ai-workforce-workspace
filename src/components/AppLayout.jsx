import { NavLink, useNavigate } from "react-router-dom";
import {
  FaChartBar,
  FaCog,
  FaFileInvoice,
  FaRobot,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";
import logo from "../assets/background/ZG-icon.png";
import { useAuth } from "../pages/authentication/AuthContext";
import NotificationCenter from "./NotificationCenter";

export function AppSidebar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div>
        <NavLink className="brand" to="/" aria-label="zengenAI home">
          <img src={logo} alt="zengenAI" />
          <span className="brand-name">zengenAI</span>
        </NavLink>

        <div className="workspace-switch">
          <span className="workspace-mark">Z</span>
          <span>
            <small>WORKSPACE</small>
            <strong>zengenAI</strong>
          </span>
          <span className="switch-chevron">⌄</span>
        </div>

        <p className="nav-label">WORKSPACE</p>
        <nav className="side-nav" aria-label="Main navigation">
          <NavLink end className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`} to="/">
            <FaRobot />
            <span>AI employees</span>
            <span className="nav-count">03</span>
          </NavLink>
          <NavLink
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            to="/ai/finance"
          >
            <FaFileInvoice />
            <span>Finance analyst</span>
          </NavLink>
          <NavLink className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`} to="/ai/hr">
            <FaUserCircle />
            <span>HR executive</span>
          </NavLink>
          <NavLink
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            to="/ai/sales"
          >
            <FaChartBar />
            <span>Sales analyst</span>
          </NavLink>
        </nav>

        <p className="nav-label nav-label-spaced">PREFERENCES</p>
        <NavLink
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          to="/settings"
        >
          <FaCog />
          <span>Settings</span>
        </NavLink>
      </div>

      <div className="sidebar-bottom">
        <div className="plan-card">
          <span className="plan-icon">✦</span>
          <strong>Make work flow.</strong>
          <p>Your AI team is ready when you are.</p>
        </div>
        <button className="profile-row" type="button" onClick={() => navigate("/profile")}>
          <span className="avatar avatar-initials">{user?.initials || "DK"}</span>
          <span className="profile-meta">
            <strong>{user?.name || "Dharun K"}</strong>
            <small>Workspace owner</small>
          </span>
          <FaUserCircle className="profile-more" />
        </button>
        <button className="nav-item signout-nav" type="button" onClick={() => navigate("/logout")}>
          <FaSignOutAlt />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}

export function AppLayout({ children, section = "Workspace", current = "AI employees" }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <main className="app-shell theme-dark">
      <AppSidebar />
      <section className="main-panel">
        <header className="topbar">
          <div className="breadcrumbs">
            <span>{section}</span>
            <span className="crumb-slash">/</span>
            <strong>{current}</strong>
          </div>
          <div className="topbar-actions">
            <NotificationCenter />
            <button
              className="avatar avatar-top profile-avatar-button"
              type="button"
              aria-label="Open profile"
              onClick={() => navigate("/profile")}
            >
              {user?.initials || "DK"}
            </button>
          </div>
        </header>
        {children}
      </section>
    </main>
  );
}
