import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FaArrowRight, FaLock, FaUser } from "react-icons/fa";
import { apiErrorMessage } from "../../api/client";
import { confirmPasswordReset, requestPasswordReset } from "../../api/auth";

function Brand() {
  return <Link to="/login" aria-label="ZengenAI sign in" className="mb-8 flex items-center justify-center gap-2">
    <span className="text-[42px] leading-none text-white" style={{ fontFamily: "'Great Vibes', cursive" }}>Zengen</span>
    <span className="rounded-md border border-violet-300/25 bg-violet-300/[0.08] px-2 py-1.5 text-[10px] font-bold tracking-[0.18em] text-violet-200">AI</span>
  </Link>;
}

function AuthCard({ eyebrow, title, description, children }) {
  return <main className="grid min-h-screen place-items-center bg-[radial-gradient(ellipse_at_50%_45%,rgba(91,65,132,0.2),transparent_48%),#0c0b12] px-5 py-10 text-[#f5f3ff]">
    <section className="w-full max-w-[440px] rounded-2xl border border-white/[0.09] bg-[#15131d]/95 p-8 shadow-2xl max-[500px]:p-6">
      <Brand />
      <p className="mb-2 text-[9px] font-bold tracking-[0.17em] text-violet-300">{eyebrow}</p>
      <h1 className="m-0 font-display text-[27px] font-bold tracking-tight">{title}</h1>
      <p className="mb-6 mt-2 text-xs leading-5 text-[#9995a8]">{description}</p>
      {children}
    </section>
  </main>;
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await requestPasswordReset(email.trim());
      setSent(true);
    } catch (requestError) {
      setError(apiErrorMessage(requestError, "We couldn't send the request. Please try again."));
    } finally {
      setBusy(false);
    }
  }

  return <AuthCard eyebrow="ACCOUNT RECOVERY" title={sent ? "Check your inbox." : "Forgot your password?"} description={sent ? "If an account matches that email, we sent a reset link and a six-digit code. Both work for 20 minutes." : "Enter the email address for your account. We'll send a secure reset link and a one-time code if it matches."}>
    {!sent && <form className="grid gap-4" onSubmit={submit}>
      <label className="grid gap-2 text-[10px] font-medium text-[#d5d0df]">Email address
        <span className="flex h-11 items-center gap-3 rounded-lg border border-white/[0.09] bg-black/10 px-3 text-[#777285] focus-within:border-violet-300/50"><FaUser className="text-[11px]" /><input className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-[#625e70]" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" /></span>
      </label>
      {error && <p role="alert" className="m-0 rounded-lg border border-rose-300/20 bg-rose-400/10 px-3 py-2.5 text-[10px] text-rose-200">{error}</p>}
      <button disabled={busy} className="mt-1 flex h-11 items-center justify-center gap-2 rounded-lg bg-violet-300 text-[11px] font-bold text-[#171222] hover:bg-violet-200 disabled:opacity-60" type="submit">{busy ? "Sending..." : "Send reset instructions"} {!busy && <FaArrowRight />}</button>
    </form>}
    {sent && <Link className="flex h-11 items-center justify-center rounded-lg bg-violet-300 text-xs font-bold text-[#171222] hover:bg-violet-200" to={`/reset-password?email=${encodeURIComponent(email.trim())}`}>Enter the email code</Link>}
    <p className="mb-0 mt-6 text-center text-[10px] text-[#817b8e]"><Link className="text-violet-200 hover:text-white" to="/login">Back to sign in</Link></p>
  </AuthCard>;
}

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";
  const [useCode, setUseCode] = useState(!token);
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Those passwords don't match.");
      return;
    }
    setBusy(true);
    try {
      await confirmPasswordReset(useCode ? { email: email.trim(), code, new_password: password } : { token, new_password: password });
      navigate("/login", { replace: true, state: { notice: "Password updated. Sign in with your new password." } });
    } catch (requestError) {
      setError(apiErrorMessage(requestError, "This reset link or code may have expired. Request a new one."));
    } finally {
      setBusy(false);
    }
  }

  return <AuthCard eyebrow="ACCOUNT SECURITY" title="Create a new password." description="Choose a strong password with at least 12 characters.">
    <form className="grid gap-4" onSubmit={submit}>
      {useCode && <>
        <label className="grid gap-2 text-[10px] font-medium text-[#d5d0df]">Email address
          <span className="flex h-11 items-center gap-3 rounded-lg border border-white/[0.09] bg-black/10 px-3 text-[#777285] focus-within:border-violet-300/50"><FaUser className="text-[11px]" /><input className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></span>
        </label>
        <label className="grid gap-2 text-[10px] font-medium text-[#d5d0df]">Six-digit code
          <input className="h-11 rounded-lg border border-white/[0.09] bg-black/10 px-3 text-sm tracking-[0.3em] text-white outline-none focus:border-violet-300/50" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="000000" />
        </label>
      </>}
      <label className="grid gap-2 text-[10px] font-medium text-[#d5d0df]">New password
        <span className="flex h-11 items-center gap-3 rounded-lg border border-white/[0.09] bg-black/10 px-3 text-[#777285] focus-within:border-violet-300/50"><FaLock className="text-[11px]" /><input className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none" type="password" autoComplete="new-password" minLength={12} maxLength={256} required value={password} onChange={(event) => setPassword(event.target.value)} /></span>
      </label>
      <label className="grid gap-2 text-[10px] font-medium text-[#d5d0df]">Confirm new password
        <span className="flex h-11 items-center gap-3 rounded-lg border border-white/[0.09] bg-black/10 px-3 text-[#777285] focus-within:border-violet-300/50"><FaLock className="text-[11px]" /><input className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none" type="password" autoComplete="new-password" minLength={12} maxLength={256} required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} /></span>
      </label>
      {error && <p role="alert" className="m-0 rounded-lg border border-rose-300/20 bg-rose-400/10 px-3 py-2.5 text-[10px] text-rose-200">{error}</p>}
      <button disabled={busy} className="mt-1 flex h-11 items-center justify-center gap-2 rounded-lg bg-violet-300 text-[11px] font-bold text-[#171222] hover:bg-violet-200 disabled:opacity-60" type="submit">{busy ? "Updating..." : "Update password"} {!busy && <FaArrowRight />}</button>
    </form>
    {token && <button className="mt-4 w-full text-center text-[10px] text-violet-200 hover:text-white" type="button" onClick={() => setUseCode((value) => !value)}>{useCode ? "Use the secure reset link instead" : "Use the email code instead"}</button>}
    <p className="mb-0 mt-5 text-center text-[10px] text-[#817b8e]"><Link className="text-violet-200 hover:text-white" to="/forgot-password">Request a new link or code</Link></p>
  </AuthCard>;
}
