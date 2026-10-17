import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { useAuth } from "../AuthContext";
export default function LogoutPage() {
  const { logout } = useAuth();
  const [done, setDone] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    logout();
    setDone(true);
  }, [logout]);
  return (
    <main className="auth-page">
      <section className="auth-card logout-card">
        <span className="logout-icon">
          <FaCheckCircle />
        </span>
        <p className="eyebrow">
          <span className="eyebrow-line" />
          SESSION ENDED
        </p>
        <h1>{done ? "You’re signed out." : "Signing you out…"}</h1>
        <p className="auth-copy">
          Your workspace session has ended. Come back any time to pick up where your team left off.
        </p>
        <button
          className="auth-submit"
          onClick={() => navigate("/login", { replace: true })}
          type="button"
        >
          Return to sign in <FaArrowLeft />
        </button>
        <p className="auth-footnote">
          <Link to="/login">Sign in with another account</Link>
        </p>
      </section>
      <div className="auth-side-art">
        <span className="auth-art-orbit auth-orbit-one" />
        <span className="auth-art-orbit auth-orbit-two" />
        <span className="auth-art-core">✦</span>
        <p>
          Work well.
          <br />
          <em>Rest easy.</em>
        </p>
      </div>
    </main>
  );
}
