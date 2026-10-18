import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaCheck, FaMoon, FaSun, FaUpload } from "react-icons/fa";
import { AppLayout } from "../../components/AppLayout";
import SpecialistIcon from "../../components/SpecialistIcon";
import { useAuth } from "../authentication/AuthContext";

export default function SettingsPage() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [prefs, setPrefs] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("zengenai-workforce-preferences")) || {};
      return {
        emailUpdates: true,
        taskDigest: false,
        defaultEmployee: "Finance analyst",
        ...stored,
        theme: localStorage.getItem("zengen-theme") || stored.theme || "dark",
      };
    } catch {
      return { emailUpdates: true, taskDigest: false, defaultEmployee: "Finance analyst", theme: "dark" };
    }
  });
  const navigate = useNavigate();
  function update(key, value) {
    setSaved(false);
    setPrefs((previous) => ({ ...previous, [key]: value }));
    if (key === "theme") {
      document.documentElement.dataset.theme = value;
      localStorage.setItem("zengen-theme", value);
    }
  }
  function save() {
    localStorage.setItem("zengenai-workforce-preferences", JSON.stringify(prefs));
    localStorage.setItem("zengen-theme", prefs.theme || localStorage.getItem("zengen-theme") || "dark");
    setSaved(true);
  }
  const panel = "rounded-xl border border-white/[0.07] bg-[#171620] p-5";
  const field =
    "rounded-lg border border-white/10 bg-[#111018] px-3 py-2 text-[10px] text-white outline-none focus:border-violet-300/50";
  return (
    <AppLayout section="Preferences" current="Settings">
      <div className="mx-auto max-w-[1080px] px-8 py-8 max-[760px]:px-4">
        <p className="mb-3 flex items-center gap-2 text-[9px] font-bold tracking-[0.16em] text-violet-300">
          <span className="h-px w-4 bg-violet-300" /> WORKSPACE PREFERENCES
        </p>
        <h1 className="m-0 font-display text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mb-7 mt-2 text-xs text-[#9995a8]">
          Shape how your workspace and AI team work for you.
        </p>
        <div className="grid grid-cols-[190px_minmax(0,1fr)] gap-6 max-[760px]:grid-cols-1">
          <nav className="flex flex-col gap-1 max-[760px]:flex-row max-[760px]:overflow-x-auto">
            {[
              ["General", "#general"],
              ["Appearance", "#appearance"],
              ["Notifications", "#notifications"],
              ["Account", "#account"],
            ].map(([label, target], index) => (
              <a
                key={target}
                className={`rounded-lg px-3 py-2.5 text-xs ${index === 0 ? "bg-violet-300/10 font-semibold text-violet-200" : "text-[#9995a8] hover:bg-white/[0.04]"}`}
                href={target}
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="grid gap-4">
            <section className={panel} id="general">
              <div className="mb-5 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-300/10 text-violet-200">
                  <SpecialistIcon type="team" className="h-4 w-4" />
                </span>
                <div>
                  <h2 className="mb-1 font-display text-sm font-semibold">Workspace defaults</h2>
                  <p className="mb-0 text-[10px] text-[#9995a8]">
                    Choose how your AI workspace opens.
                  </p>
                </div>
              </div>
              <label className="flex items-center justify-between gap-4 border-t border-white/[0.07] py-4 max-[500px]:items-start max-[500px]:flex-col">
                <span>
                  <strong className="block text-xs">Default AI teammate</strong>
                  <small className="mt-1 block text-[10px] text-[#9995a8]">
                    Open this teammate when entering the workspace.
                  </small>
                </span>
                <select
                  className={field}
                  value={prefs.defaultEmployee}
                  onChange={(event) => update("defaultEmployee", event.target.value)}
                >
                  <option>Finance analyst</option>
                  <option>Personal assistant</option>
                  <option>HR executive</option>
                  <option>Sales analyst</option>
                </select>
              </label>
            </section>
            <section className={panel} id="appearance">
              <div className="mb-4 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-300/10 text-amber-200">
                  {prefs.theme === "light" ? <FaSun /> : <FaMoon />}
                </span>
                <div>
                  <h2 className="mb-1 font-display text-sm font-semibold">Appearance</h2>
                  <p className="mb-0 text-[10px] text-[#9995a8]">Choose the theme for your workspace.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 border-t border-white/[0.07] pt-4 max-[500px]:grid-cols-1">
                {[{ id: "dark", label: "Dark", icon: FaMoon, detail: "The current ZengenAI look" }, { id: "light", label: "Light", icon: FaSun, detail: "A brighter workspace" }].map(({ id, label, icon: Icon, detail }) => (
                  <button key={id} type="button" aria-pressed={(prefs.theme || "dark") === id} onClick={() => update("theme", id)} className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${(prefs.theme || "dark") === id ? "border-violet-300/40 bg-violet-300/[0.08]" : "border-white/10 hover:bg-white/[0.03]"}`}>
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-violet-300/10 text-violet-200"><Icon /></span>
                    <span><strong className="block text-xs">{label}</strong><small className="mt-1 block text-[9px] text-[#9995a8]">{detail}</small></span>
                    {(prefs.theme || "dark") === id && <FaCheck className="ml-auto text-[10px] text-emerald-300" />}
                  </button>
                ))}
              </div>
            </section>
            <section className={panel} id="notifications">
              <div className="mb-4 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-sky-300/10 text-sky-200">
                  ✉
                </span>
                <div>
                  <h2 className="mb-1 font-display text-sm font-semibold">Notifications</h2>
                  <p className="mb-0 text-[10px] text-[#9995a8]">
                    Stay informed about important work.
                  </p>
                </div>
              </div>
              {[
                [
                  "emailUpdates",
                  "Email updates",
                  "Get notified when an AI teammate completes work.",
                ],
                [
                  "taskDigest",
                  "Weekly activity digest",
                  "A short summary of tasks and hours saved.",
                ],
              ].map(([key, title, description]) => (
                <label
                  className="flex items-center justify-between gap-4 border-t border-white/[0.07] py-4"
                  key={key}
                >
                  <span>
                    <strong className="block text-xs">{title}</strong>
                    <small className="mt-1 block text-[10px] text-[#9995a8]">{description}</small>
                  </span>
                  <input
                    className="h-4 w-4 accent-violet-400"
                    type="checkbox"
                    checked={prefs[key]}
                    onChange={(event) => update(key, event.target.checked)}
                  />
                </label>
              ))}
            </section>
            <section className={panel} id="account">
              <div className="mb-4 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-300/10 text-emerald-200">
                  ◉
                </span>
                <div>
                  <h2 className="mb-1 font-display text-sm font-semibold">Account access</h2>
                  <p className="mb-0 text-[10px] text-[#9995a8]">
                    Manage your ZengenAI account.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-white/[0.07] py-4 max-[500px]:items-start max-[500px]:flex-col">
                <span>
                  <strong className="block text-xs">Signed in as</strong>
                  <small className="mt-1 block text-[10px] text-[#9995a8]">
                    {user?.email}
                  </small>
                </span>
                <button
                  className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-[10px] text-white hover:border-violet-300/30"
                  type="button"
                  onClick={() => navigate("/profile")}
                >
                  Edit profile <FaArrowRight />
                </button>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-white/[0.07] py-4">
                <span>
                  <strong className="block text-xs">Data storage</strong>
                  <small className="mt-1 block text-[10px] text-[#9995a8]">
                    Finance workspace data and uploaded documents are stored by the backend.
                  </small>
                </span>
                <span className="rounded-full bg-emerald-300/10 px-2 py-1 text-[8px] font-bold text-emerald-200">
                  LOCAL
                </span>
              </div>
            </section>
            <div className="flex min-h-12 items-center justify-end gap-4">
              {saved && <span className="text-[10px] text-emerald-300">Preferences saved</span>}
              <button
                className="flex items-center gap-2 rounded-lg bg-violet-300 px-4 py-3 text-[10px] font-bold text-[#171222] transition hover:bg-violet-200"
                onClick={save}
                type="button"
              >
                <FaUpload /> Save preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
