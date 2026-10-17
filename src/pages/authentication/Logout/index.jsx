import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaHeart } from "react-icons/fa";
import { useAuth } from "../AuthContext";
import SpecialistIcon from "../../../components/SpecialistIcon";

export default function LogoutPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    logout();
  }, [logout]);
  return (
    <main className="relative grid min-h-screen grid-cols-[minmax(380px,0.8fr)_1.2fr] overflow-hidden bg-[radial-gradient(ellipse_at_22%_50%,rgba(91,65,132,0.24),transparent_42%),radial-gradient(ellipse_at_78%_50%,rgba(83,59,122,0.2),transparent_44%),linear-gradient(115deg,#100e17,#0c0b12_54%,#100e17)] text-[#f5f3ff] max-[800px]:grid-cols-1">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(141,111,190,0.045),transparent_72%)]" />
      <section className="relative z-10 flex min-h-screen items-center justify-center px-8 py-12 max-[500px]:px-5">
        <div className="w-full max-w-[390px] rounded-2xl border border-white/[0.09] bg-[#15131d]/95 p-9 text-center shadow-2xl shadow-black/30 max-[500px]:p-6">
          <Link
            className="mb-10 flex h-12 items-center justify-center pt-4"
            to="/login"
            aria-label="ZengenAI sign in"
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
          </Link>
          <p className="mb-4 flex items-center justify-center gap-2 text-[9px] font-bold tracking-[0.16em] text-violet-300">
            <FaHeart className="text-[10px]" /> A LITTLE LOVE FROM YOUR AI TEAM
          </p>
          <h1 className="mb-3 font-display text-3xl font-bold leading-tight tracking-tight">
            We’ll be here when you need us.
          </h1>
          <p className="mb-7 text-xs leading-relaxed text-[#9995a8]">
            Even while you’re away, your AI team is ready to keep work moving and help make the busy parts feel lighter.
          </p>
          <button
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-violet-300 text-[11px] font-bold text-[#171222] transition hover:bg-violet-200"
            onClick={() => navigate("/login", { replace: true })}
            type="button"
          >
            Return to sign in <FaArrowLeft />
          </button>
          <p className="mb-0 mt-5 text-[10px] text-[#898497]">
            <Link className="hover:text-violet-200" to="/login">
              Sign in with another account
            </Link>
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
        <div className="absolute grid h-24 w-24 place-items-center rounded-[28px] border border-violet-200/40 bg-gradient-to-br from-[#725a9b] to-[#302844] text-3xl text-pink-100 shadow-[0_0_90px_rgba(169,134,240,0.32)]">
          <FaHeart className="animate-pulse text-2xl" />
        </div>
        <div className="absolute left-[7%] top-[25%] rounded-xl border border-white/10 bg-[#191723]/90 px-4 py-3 text-[10px] text-violet-100 shadow-xl backdrop-blur">
          <SpecialistIcon type="finance" className="mr-2 inline h-3 w-3 align-[-2px] text-violet-300" />FINANCE ANALYST
          <b className="ml-2 text-white">Your numbers, in focus</b>
        </div>
        <div className="absolute right-[5%] top-[37%] rounded-xl border border-white/10 bg-[#191723]/90 px-4 py-3 text-[10px] text-violet-100 shadow-xl backdrop-blur">
          <SpecialistIcon type="assistant" className="mr-2 inline h-3 w-3 align-[-2px] text-amber-200" />PERSONAL ASSISTANT
          <b className="ml-2 text-white">A little help with everything</b>
        </div>
        <div className="absolute left-[7%] top-[62%] rounded-xl border border-white/10 bg-[#191723]/90 px-4 py-3 text-[10px] text-violet-100 shadow-xl backdrop-blur">
          <SpecialistIcon type="hr" className="mr-2 inline h-3 w-3 align-[-2px] text-sky-200" />AI HR EXECUTIVE
          <b className="ml-2 text-violet-200">Coming soon</b>
        </div>
        <div className="absolute right-[5%] top-[67%] rounded-xl border border-white/10 bg-[#191723]/90 px-4 py-3 text-[10px] text-violet-100 shadow-xl backdrop-blur">
          <SpecialistIcon type="sales" className="mr-2 inline h-3 w-3 align-[-2px] text-emerald-200" />AI SALES ANALYST
          <b className="ml-2 text-violet-200">Coming soon</b>
        </div>
        <div className="absolute bottom-[12%] max-w-[360px] px-6 text-center">
          <p className="mb-2 font-display text-3xl font-semibold leading-tight">
            Thanks for being here.
            <br />
            <span className="text-violet-300">We’ve got your back. ♥</span>
          </p>
          <p className="mx-auto max-w-[320px] text-xs leading-relaxed text-[#aaa3ba]">
            Finance insights, everyday support, and new AI teammates—all in your corner.
          </p>
        </div>
      </aside>
    </main>
  );
}
