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
    <main className="relative grid min-h-screen grid-cols-[minmax(380px,0.8fr)_1.2fr] overflow-hidden bg-[#0c0b12] text-[#f5f3ff] max-[800px]:grid-cols-1">
      <div className="absolute inset-y-0 left-0 w-[46%] bg-[radial-gradient(ellipse_at_65%_50%,rgba(112,78,166,0.12),transparent_68%)] max-[800px]:hidden" />
      <section className="relative z-10 flex min-h-screen items-center justify-center px-8 py-12 max-[500px]:px-5">
        <div className="w-full max-w-[390px] rounded-2xl border border-white/[0.09] bg-[#15131d]/95 p-9 shadow-2xl shadow-black/30 max-[500px]:p-6">
          <a className="mb-10 flex items-center gap-3" href="/" aria-label="ZengenAI home">
            <img className="h-10 w-10 rounded-full object-cover" src={logo} alt="" />
            <span className="font-display text-lg font-bold tracking-tight">
              zengen<span className="text-violet-300">AI</span>
            </span>
          </a>
          <p className="mb-3 flex items-center gap-2 text-[9px] font-bold tracking-[0.16em] text-violet-300">
            <span className="h-px w-4 bg-violet-300" /> WORKSPACE ACCESS
          </p>
          <h1 className="mb-2 font-display text-[30px] font-bold tracking-[-0.045em]">
            Welcome back<span className="text-violet-300">.</span>
          </h1>
          <p className="mb-7 text-xs text-[#9995a8]">
            Sign in to pick up where your team left off.
          </p>
          <form className="grid gap-5" onSubmit={submit}>
            <label className="grid gap-2 text-[10px] font-medium text-[#d5d0df]">
              Email address
              <span className="flex h-11 items-center gap-3 rounded-lg border border-white/[0.09] bg-black/10 px-3 text-[#777285] focus-within:border-violet-300/50">
                <FaUser className="text-[11px]" />
                <input
                  className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-[#625e70]"
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
            <label className="grid gap-2 text-[10px] font-medium text-[#d5d0df]">
              Password
              <span className="flex h-11 items-center gap-3 rounded-lg border border-white/[0.09] bg-black/10 px-3 text-[#777285] focus-within:border-violet-300/50">
                <FaLock className="text-[11px]" />
                <input
                  className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-[#625e70]"
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
                  className="text-[#777285] hover:text-white"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </span>
            </label>
            {error && (
              <p
                className="m-0 rounded-lg border border-rose-300/20 bg-rose-400/10 px-3 py-2.5 text-[10px] text-rose-200"
                role="alert"
              >
                {error}
              </p>
            )}
            <button
              className="mt-1 flex h-11 items-center justify-center gap-2 rounded-lg bg-violet-300 text-[11px] font-bold text-[#171222] shadow-lg shadow-violet-400/15 transition hover:bg-violet-200"
              type="submit"
            >
              Sign in <FaArrowRight />
            </button>
          </form>
          <p className="mb-0 mt-6 text-center text-[9px] text-[#706b80]">
            Sign in with your zengenAI workspace account.
          </p>
        </div>
      </section>
      <aside
        className="relative flex min-h-screen items-center justify-center overflow-hidden max-[800px]:hidden"
        aria-hidden="true"
      >
        <div className="absolute h-[460px] w-[460px] rounded-full border border-dashed border-violet-200/10 animate-[spin_80s_linear_infinite]" />
        <div className="absolute h-[330px] w-[330px] rounded-full border border-violet-200/10" />
        <div className="absolute h-[210px] w-[210px] rounded-full border border-violet-200/10" />
        <div className="absolute grid h-24 w-24 place-items-center rounded-[28px] border border-violet-200/40 bg-gradient-to-br from-[#604b86] to-[#302844] text-3xl text-violet-100 shadow-[0_0_90px_rgba(169,134,240,0.25)]">
          <FaArrowRight />
        </div>
        <div className="absolute left-[18%] top-[30%] rounded-xl border border-white/10 bg-[#191723]/90 px-4 py-3 text-[10px] text-violet-100 shadow-xl">
          <span className="mr-2 text-violet-300">✦</span>YOUR AI TEAM{" "}
          <b className="ml-2 text-white">Always in sync</b>
        </div>
        <div className="absolute bottom-[30%] right-[16%] rounded-xl border border-white/10 bg-[#191723]/90 px-4 py-3 text-[10px] text-violet-100 shadow-xl">
          <span className="mr-2 text-emerald-300">✓</span>WORKFLOW STATUS{" "}
          <b className="ml-2 text-white">Moving forward</b>
        </div>
        <p className="absolute bottom-[15%] text-center font-display text-2xl font-semibold leading-tight">
          Make room for
          <br />
          <em className="not-italic text-violet-300">meaningful work.</em>
        </p>
      </aside>
    </main>
  );
}
