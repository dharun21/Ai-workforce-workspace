import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { FaArrowRight, FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa";
import logo from "../../../assets/background/ZG-icon.png";
import { useAuth } from "../AuthContext";

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  if (user) return <Navigate to={location.state?.from?.pathname || "/"} replace />;

  function submit(event) {
    event.preventDefault();
    if (!login(email, password)) {
      setError("Those details don’t match an account. Check them and try again.");
      return;
    }
    navigate(location.state?.from?.pathname || "/", { replace: true });
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <a className="auth-brand" href="/" aria-label="zengenAI home">
          <span className="auth-brand-icon">
            <img src={logo} alt="" />
          </span>
          <span className="auth-brand-name">
            zengen<span>AI</span>
          </span>
        </a>

        <p className="eyebrow">
          <span className="eyebrow-line" />
          WORKSPACE ACCESS
        </p>
        <h1>
          Welcome back<span className="login-period">.</span>
        </h1>
        <p className="auth-copy">Sign in to pick up where your team left off.</p>

        <form className="auth-form" onSubmit={submit}>
          <label>
            Email address
            <span className="auth-input">
              <FaUser />
              <input
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(event) => {
                  setError("");
                  setEmail(event.target.value);
                }}
                placeholder="you@company.com"
              />
            </span>
          </label>
          <label>
            Password
            <span className="auth-input">
              <FaLock />
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => {
                  setError("");
                  setPassword(event.target.value);
                }}
                placeholder="Enter your password"
              />
              <button
                className="password-toggle"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </span>
          </label>
          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}
          <button className="auth-submit" type="submit">
            <span>Sign in</span>
            <FaArrowRight />
          </button>
        </form>
        <p className="auth-footnote">Sign in with your zengenAI workspace account.</p>
      </section>

      <div className="auth-side-art" aria-hidden="true">
        <div className="auth-art-scene">
          <span className="auth-art-orbit auth-orbit-one" />
          <span className="auth-art-orbit auth-orbit-two" />
          <span className="auth-art-orbit auth-orbit-three" />
          <div className="auth-art-core">
            <FaArrowRight />
          </div>
          <div className="auth-float-card auth-float-top">
            <span className="auth-float-icon">✦</span>
            <span>
              <small>YOUR AI TEAM</small>
              <strong>Always in sync</strong>
            </span>
            <i />
          </div>
          <div className="auth-float-card auth-float-bottom">
            <span className="auth-float-check">✓</span>
            <span>
              <small>WORKFLOW STATUS</small>
              <strong>Moving forward</strong>
            </span>
            <b>LIVE</b>
          </div>
          <p className="auth-art-caption">
            Make room for
            <br />
            <em>meaningful work.</em>
          </p>
          <span className="auth-scene-spark spark-one">✦</span>
          <span className="auth-scene-spark spark-two">✧</span>
        </div>
      </div>
    </main>
  );
}
