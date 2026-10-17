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
    <main className="grid min-h-screen place-items-center bg-[#0c0b12] px-5 py-10 text-[#f5f3ff]">
      <section className="w-full max-w-[460px] rounded-2xl border border-white/[0.09] bg-[#15131d] p-9 text-center shadow-2xl shadow-black/30 max-[500px]:p-6">
        <span className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-2xl border border-emerald-300/20 bg-emerald-400/10 text-2xl text-emerald-300">
          <FaCheckCircle />
        </span>
        <p className="mb-3 flex items-center justify-center gap-2 text-[9px] font-bold tracking-[0.16em] text-violet-300">
          <span className="h-px w-4 bg-violet-300" /> SESSION ENDED
        </p>
        <h1 className="mb-2 font-display text-3xl font-bold tracking-tight">
          {done ? "You’re signed out." : "Signing you out…"}
        </h1>
        <p className="mb-7 text-xs leading-relaxed text-[#9995a8]">
          Your workspace session has ended. Come back any time to pick up where your team left off.
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
      </section>
    </main>
  );
}
