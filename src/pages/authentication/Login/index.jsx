import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaUser,
} from "react-icons/fa";
import { useAuth } from "../AuthContext";
import SpecialistIcon from "../../../components/SpecialistIcon";

const loginHighlights = [
  {
    iconType: "team",
    eyebrow: "YOUR AI TEAM",
    title: "Always in sync.",
    description: "Your finance analyst and personal assistant, ready to move work forward.",
    status: "2 AI teammates ready",
  },
  {
    iconType: "finance",
    eyebrow: "FINANCE ANALYST",
    title: "Clarity in every number.",
    description: "Keep invoices and important finance details easier to stay on top of.",
    status: "Finance, made clearer",
  },
  {
    iconType: "assistant",
    eyebrow: "PERSONAL ASSISTANT",
    title: "Make room for life.",
    description: "Bring plans, reminders, and everyday thoughts into one calm place.",
    status: "A little help, always near",
  },
];

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(0);
  const activeHighlight = loginHighlights[highlightIndex];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHighlightIndex((current) => (current + 1) % loginHighlights.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);
  if (user) return <Navigate to={location.state?.from?.pathname || "/workspace"} replace />;

  function submit(event) {
    event.preventDefault();
    if (!login(email, password)) {
      setError("Those details don’t match an account. Check them and try again.");
      return;
    }
    navigate(location.state?.from?.pathname || "/workspace", { replace: true });
  }

  return (
    <main className="relative grid min-h-screen grid-cols-[minmax(380px,0.8fr)_1.2fr] overflow-hidden bg-[radial-gradient(ellipse_at_22%_50%,rgba(91,65,132,0.24),transparent_42%),radial-gradient(ellipse_at_78%_50%,rgba(83,59,122,0.2),transparent_44%),linear-gradient(115deg,#100e17,#0c0b12_54%,#100e17)] text-[#f5f3ff] max-[800px]:grid-cols-1">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(141,111,190,0.045),transparent_72%)]" />
      <section className="relative z-10 flex min-h-screen items-center justify-center px-8 py-12 max-[500px]:px-5">
        <div className="w-full max-w-[390px] rounded-2xl border border-white/[0.09] bg-[#15131d]/95 p-9 shadow-2xl shadow-black/30 max-[500px]:p-6">
          <a
            className="mb-10 flex h-12 items-center justify-center pt-4"
            href="/"
            aria-label="ZengenAI home"
          >
            <span className="flex items-start gap-3 whitespace-nowrap">
              <span
                className="text-[44px] leading-none tracking-[0.06em] text-white"
                style={{ fontFamily: "'Great Vibes', cursive" }}
              >
                Zengen
              </span>
              <span className="rounded-md border border-violet-300/25 bg-violet-300/[0.08] px-2 py-1.5 font-display text-[11px] font-bold tracking-[0.18em] text-violet-200 shadow-[0_0_16px_rgba(167,139,250,0.12)]">
                AI
              </span>
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
        className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_48%,rgba(96,70,140,0.12),transparent_55%)] max-[800px]:hidden"
        aria-hidden="true"
      >
        <div className="absolute h-[490px] w-[490px] rounded-full border border-dashed border-violet-200/10 animate-[spin_80s_linear_infinite]" />
        <div className="absolute h-[370px] w-[370px] rounded-full border border-violet-200/[0.12] animate-feature-ring-wave" />
        <div className="absolute h-[280px] w-[280px] rounded-full border border-violet-200/[0.14] animate-feature-ring-wave [animation-delay:1.8s]" />
        <div className="absolute h-[190px] w-[190px] rounded-full border border-violet-200/[0.16] animate-feature-ring-wave [animation-delay:3.6s]" />
        <div className="absolute grid h-24 w-24 place-items-center rounded-[28px] border border-violet-200/40 bg-gradient-to-br from-[#725a9b] to-[#302844] text-3xl text-violet-100 shadow-[0_0_90px_rgba(169,134,240,0.32)] transition-colors duration-700">
          <SpecialistIcon type={activeHighlight.iconType} className="h-15 w-15 transition-transform duration-500" />
        </div>
        <div className="absolute left-[10%] top-[26%] rounded-xl border border-white/10 bg-[#191723]/90 px-4 py-3 text-[10px] text-violet-100 shadow-xl backdrop-blur">
          <span className="mr-2 text-violet-300">✦</span>{activeHighlight.eyebrow}{" "}
          <b className="ml-2 text-white">{activeHighlight.status}</b>
        </div>
        <div className="absolute right-[7%] top-[43%] rounded-xl border border-white/10 bg-[#191723]/90 px-4 py-3 text-[10px] text-violet-100 shadow-xl backdrop-blur">
          <SpecialistIcon type="finance" className="mr-2 inline h-4 w-4 align-[-4px] text-violet-300" />FINANCE ANALYST
          <b className="ml-2 text-white">Clearer finances</b>
        </div>
        <div className="absolute bottom-[29%] left-[10%] rounded-xl border border-white/10 bg-[#191723]/90 px-4 py-3 text-[10px] text-violet-100 shadow-xl backdrop-blur">
          <SpecialistIcon type="assistant" className="mr-2 inline h-4 w-4 align-[-4px] text-amber-200" />PERSONAL ASSISTANT
          <b className="ml-2 text-white">Here for your day</b>
        </div>
        <div className="absolute bottom-[12%] max-w-[360px] px-6 text-center">
          <p className="mb-2 font-display text-3xl font-semibold leading-tight transition-all duration-500">
            {activeHighlight.title}
          </p>
          <p className="mx-auto mb-4 max-w-[320px] text-xs leading-relaxed text-[#aaa3ba]">
            {activeHighlight.description}
          </p>
          <div className="flex items-center justify-center gap-1.5">
            {loginHighlights.map((highlight, index) => (
              <span
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  index === highlightIndex ? "w-6 bg-violet-300" : "w-1.5 bg-violet-100/30"
                }`}
                key={highlight.eyebrow}
              />
            ))}
          </div>
        </div>
      </aside>
    </main>
  );
}
