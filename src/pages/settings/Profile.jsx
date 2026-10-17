import { useState } from "react";
import { AppLayout } from "../../components/AppLayout";
import { useAuth } from "../authentication/AuthContext";
export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || "Dharun K");
  const [saved, setSaved] = useState(false);
  function submit(event) {
    event.preventDefault();
    updateProfile({ name });
    setSaved(true);
  }
  return (
    <AppLayout section="Account" current="Profile">
      <div className="page-content settings-content">
        <p className="eyebrow">
          <span className="eyebrow-line" />
          YOUR ACCOUNT
        </p>
        <h1 className="page-title">Profile</h1>
        <p className="page-subtitle">Manage the details your team sees.</p>
        <form className="profile-form settings-panel" onSubmit={submit}>
          <div className="profile-hero">
            <span className="avatar profile-large">{user?.initials || "DK"}</span>
            <span>
              <strong>{name}</strong>
              <small>Workspace owner</small>
            </span>
          </div>
          <label className="profile-field">
            Display name
            <input
              required
              value={name}
              onChange={(event) => {
                setSaved(false);
                setName(event.target.value);
              }}
            />
          </label>
          <label className="profile-field">
            Email address
            <input type="email" value={user?.email || ""} readOnly />
          </label>
          <div className="profile-submit-row">
            {saved && <span className="saved-note">Profile updated</span>}
            <button className="auth-submit settings-save" type="submit">
              Save profile
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
