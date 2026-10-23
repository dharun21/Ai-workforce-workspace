import { NavLink, useNavigate } from "react-router-dom";
import {
  FaCog,
  FaComments,
  FaDollarSign,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";
import { useAuth } from "../pages/authentication/AuthContext";
import NotificationCenter from "./NotificationCenter";
import SpecialistIcon from "./SpecialistIcon";

const baseLink =
  "group flex h-11 items-center gap-3 rounded-xl px-3 text-sm text-[#9995a8] transition hover:bg-white/[0.045] hover:text-white max-[760px]:w-11 max-[760px]:justify-center max-[760px]:px-0";
const activeLink = "bg-violet-300/10 font-semibold text-violet-200 hover:bg-violet-300/15";
export function AppSidebar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const specialistCount = user?.specialists?.length || 0;
  const linkClass = ({ isActive }) => `${baseLink} ${isActive ? activeLink : ""}`;

  return (
    <aside className="z-20 flex h-screen w-[250px] shrink-0 flex-col border-r border-white/[0.07] bg-[#111018] px-4 py-6 max-[1050px]:w-[220px] max-[760px]:w-[66px] max-[760px]:items-center max-[760px]:px-2">
      <div className="w-full">
        <NavLink
          className="mb-10 flex h-12 items-center justify-center px-2 pt-4 max-[760px]:px-0"
          to="/workspace"
          aria-label="ZengenAI home"
        >
          <span className="flex items-start gap-3 whitespace-nowrap max-[760px]:hidden">
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
        </NavLink>
        <p className="mb-3 px-3 text-[9px] font-bold tracking-[0.18em] text-[#706b80] max-[760px]:hidden">
          WORKSPACE
        </p>
        <nav className="grid gap-1.5" aria-label="Main navigation">
          <NavLink end className={linkClass} to="/workspace">
            <SpecialistIcon type="team" className="h-4 w-4 shrink-0" />
            <span className="max-[760px]:hidden">{specialistCount ? "My AI team" : "Explore AI team"}</span>
            {specialistCount > 0 && <span className="ml-auto rounded-md bg-violet-300/10 px-1.5 py-0.5 text-[9px] font-bold text-violet-200 max-[760px]:hidden">
              {String(specialistCount).padStart(2, "0")}
            </span>}
          </NavLink>
          {user?.specialists?.includes("personal_assistant") && (
            <NavLink className={linkClass} to="/ai/personal-assistant">
              <SpecialistIcon type="assistant" className="h-4 w-4 shrink-0" />
              <span className="max-[760px]:hidden">Personal assistant</span>
            </NavLink>
          )}
          {user?.specialists?.includes("finance_analyst") && (
            <>
              <NavLink end className={linkClass} to="/ai/finance">
                <SpecialistIcon type="finance" className="h-4 w-4 shrink-0" />
                <span className="max-[760px]:hidden">Finance analyst</span>
              </NavLink>
              <NavLink className={linkClass} to="/ai/finance/chat">
                <FaComments className="shrink-0 text-sm" />
                <span className="max-[760px]:hidden">AI chat</span>
              </NavLink>
            </>
          )}
          {user?.specialists?.includes("hr_executive") && (
            <NavLink className={linkClass} to="/ai/hr">
              <SpecialistIcon type="hr" className="h-4 w-4 shrink-0" />
              <span className="max-[760px]:hidden">HR executive</span>
            </NavLink>
          )}
          {user?.specialists?.includes("sales_analyst") && (
            <NavLink className={linkClass} to="/ai/sales">
              <SpecialistIcon type="sales" className="h-4 w-4 shrink-0" />
              <span className="max-[760px]:hidden">Sales analyst</span>
            </NavLink>
          )}
        </nav>
        <p className="mb-3 mt-6 px-3 text-[9px] font-bold tracking-[0.18em] text-[#706b80] max-[760px]:hidden">
          PREFERENCES
        </p>
        {user?.is_admin && (
          <NavLink className={linkClass} to="/admin/users">
            <FaUserCircle className="shrink-0 text-base" />
            <span className="max-[760px]:hidden">Admin access</span>
          </NavLink>
        )}
        <NavLink className={linkClass} to="/settings">
          <FaCog className="shrink-0 text-base" />
          <span className="max-[760px]:hidden">Settings</span>
        </NavLink>
        <NavLink className={linkClass} to="/pricing">
          <FaDollarSign className="h-4 w-4 shrink-0" />
          <span className="max-[760px]:hidden">Pricing</span>
        </NavLink>
      </div>
      <div className="mt-auto w-full">
        <div className="mb-4 rounded-xl border border-violet-300/15 bg-gradient-to-br from-violet-300/[0.09] to-transparent p-4 max-[760px]:hidden">
          <span className="mb-2 block text-violet-200">✦</span>
          <strong className="block text-xs text-white">Make work flow.</strong>
          <p className="mb-0 mt-1.5 text-[10px] leading-relaxed text-[#9995a8]">
            Your AI team is ready when you are.
          </p>
        </div>
        <button
          className="mb-2 flex w-full items-center gap-3 border-t border-white/[0.07] px-2 py-4 text-left hover:bg-white/[0.03] max-[760px]:justify-center"
          type="button"
          onClick={() => navigate("/profile")}
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-300/60 to-[#40334f] text-[10px] font-bold text-white">
            {user?.initials || "DK"}
          </span>
          <span className="min-w-0 flex-1 max-[760px]:hidden">
            <strong className="block truncate text-xs text-white">
              {user?.name || "Dharun K"}
            </strong>
            <small className="text-[12px] text-[#898497]">Workspace owner</small>
          </span>
          <FaUserCircle className="text-[#898497] max-[760px]:hidden" />
        </button>
        <button className={`${baseLink} w-full`} type="button" onClick={() => navigate("/logout")}>
          <FaSignOutAlt className="shrink-0 text-base" />
          <span className="max-[760px]:hidden">Sign out</span>
        </button>
      </div>
    </aside>
  );
}

export function AppLayout({ children, section = "Workspace", current = "My AI team", contentClassName }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <main className="app-layout-shell flex h-dvh min-h-0 overflow-hidden bg-[#0c0b12] text-[#f5f3ff]">
      <AppSidebar />
      <section className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="z-10 flex h-[70px] shrink-0 items-center justify-between border-b border-white/[0.07] bg-[#0f0e16]/95 px-8 backdrop-blur max-[760px]:px-4">
          <div className="flex items-center gap-3 text-xs text-[#9995a8]">
            <span>{section}</span>
            <span className="text-[#514d5d]">/</span>
            <strong className="font-medium text-white">{current}</strong>
          </div>
          <div className="flex items-center gap-4">
            <NotificationCenter />
            <button
              className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#d7bea3] to-[#755b55] text-[10px] font-bold text-white"
              type="button"
              aria-label="Open profile"
              onClick={() => navigate("/profile")}
            >
              {user?.initials || "DK"}
            </button>
          </div>
        </header>
        <div className={contentClassName || "min-h-0 flex-1 overflow-y-auto"}>{children}</div>
      </section>
    </main>
  );
}
