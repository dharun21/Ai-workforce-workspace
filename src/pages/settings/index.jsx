import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaRobot, FaUpload } from "react-icons/fa";
import { AppLayout } from "../../components/AppLayout";
import { DEMO_CREDENTIALS } from "../authentication/credentials";
export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [prefs, setPrefs] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("zengenai-workforce-preferences")) || {
          emailUpdates: true,
          taskDigest: false,
          defaultEmployee: "Finance analyst",
        }
      );
    } catch {
      return {
        emailUpdates: true,
        taskDigest: false,
        defaultEmployee: "Finance analyst",
      };
    }
  });
  const navigate = useNavigate();
  function update(key, value) {
    setSaved(false);
    setPrefs((previous) => ({ ...previous, [key]: value }));
  }
  function save() {
    localStorage.setItem("zengenai-workforce-preferences", JSON.stringify(prefs));
    setSaved(true);
  }
  return (
    <AppLayout section="Preferences" current="Settings">
      <div className="page-content settings-content">
        <p className="eyebrow">
          <span className="eyebrow-line" />
          WORKSPACE PREFERENCES
        </p>
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Shape how your workspace and AI team work for you.</p>
        <div className="settings-layout">
          <nav className="settings-nav">
            <a className="settings-nav-active" href="#general">
              General
            </a>
            <a href="#notifications">Notifications</a>
            <a href="#account">Account</a>
          </nav>
          <div className="settings-panels">
            <section className="settings-panel" id="general">
              <div className="settings-panel-heading">
                <span className="settings-panel-icon">
                  <FaRobot />
                </span>
                <div>
                  <h2>Workspace defaults</h2>
                  <p>Choose how your AI workspace opens.</p>
                </div>
              </div>
              <label className="setting-row">
                <span>
                  <strong>Default AI employee</strong>
                  <small>Open this employee when entering its workspace.</small>
                </span>
                <select
                  value={prefs.defaultEmployee}
                  onChange={(event) => update("defaultEmployee", event.target.value)}
                >
                  <option>Finance analyst</option>
                  <option>HR executive</option>
                  <option>Sales analyst</option>
                </select>
              </label>
            </section>
            <section className="settings-panel" id="notifications">
              <div className="settings-panel-heading">
                <span className="settings-panel-icon">✉</span>
                <div>
                  <h2>Notifications</h2>
                  <p>Stay informed about important work.</p>
                </div>
              </div>
              <label className="setting-row">
                <span>
                  <strong>Email updates</strong>
                  <small>Get notified when an AI employee completes work.</small>
                </span>
                <input
                  className="toggle-input"
                  type="checkbox"
                  checked={prefs.emailUpdates}
                  onChange={(event) => update("emailUpdates", event.target.checked)}
                />
              </label>
              <label className="setting-row">
                <span>
                  <strong>Weekly activity digest</strong>
                  <small>A short summary of tasks and hours saved.</small>
                </span>
                <input
                  className="toggle-input"
                  type="checkbox"
                  checked={prefs.taskDigest}
                  onChange={(event) => update("taskDigest", event.target.checked)}
                />
              </label>
            </section>
            <section className="settings-panel" id="account">
              <div className="settings-panel-heading">
                <span className="settings-panel-icon">◉</span>
                <div>
                  <h2>Account access</h2>
                  <p>Manage your demo workspace account.</p>
                </div>
              </div>
              <div className="setting-row">
                <span>
                  <strong>Signed in as</strong>
                  <small>{DEMO_CREDENTIALS.email}</small>
                </span>
                <button
                  className="subtle-button"
                  type="button"
                  onClick={() => navigate("/profile")}
                >
                  Edit profile <FaArrowRight />
                </button>
              </div>
              <div className="setting-row">
                <span>
                  <strong>Data storage</strong>
                  <small>Preferences and demo session are stored in this browser.</small>
                </span>
                <span className="local-badge">LOCAL</span>
              </div>
            </section>
            <div className="settings-save-row">
              {saved && <span className="saved-note">Preferences saved</span>}
              <button className="auth-submit settings-save" onClick={save} type="button">
                <FaUpload /> Save preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
