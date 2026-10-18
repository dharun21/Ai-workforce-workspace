import { useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaClock,
  FaEnvelope,
  FaGoogleDrive,
  FaRegCalendarAlt,
  FaShieldAlt,
  FaUserAstronaut,
} from "react-icons/fa";

const STORAGE_KEY = "zengen-personal-assistant-setup";
const responsibilities = [
  "Calendar and meeting planning",
  "Email organization and reply drafts",
  "To-do lists and deadlines",
  "Reminders and follow-ups",
  "Research and information gathering",
  "Document and file organization",
  "Travel and appointment planning",
  "Daily planning and productivity summaries",
];
const useCases = [
  "Personal life and daily errands",
  "Work and professional productivity",
  "Business owner and team coordination",
  "A mix of personal and professional tasks",
];
const integrations = [
  { name: "Gmail", detail: "Email summaries, action items, and reply drafts", icon: FaEnvelope },
  { name: "Google Calendar", detail: "Availability, agendas, and schedule conflicts", icon: FaRegCalendarAlt },
  { name: "Google Drive", detail: "Find and summarize files you choose to share", icon: FaGoogleDrive },
  { name: "Microsoft Outlook", detail: "Email and calendar workflows for Outlook", icon: FaEnvelope },
];
const autonomyLevels = [
  { id: "suggest", title: "Suggest only", detail: "Prepare ideas and drafts. Never make changes to connected apps." },
  { id: "approve", title: "Ask before acting", detail: "Prepare tasks, messages, and calendar changes for your approval.", recommended: true },
  { id: "routines", title: "Run approved routines", detail: "Handle specific low-risk routines you authorize; ask before sensitive actions." },
];
const inputClass = "mt-2 h-10 w-full rounded-lg border border-white/10 bg-[#111018] px-3 text-xs text-white outline-none focus:border-violet-300/50";
const labelClass = "block text-[10px] font-medium text-[#c5c0d0]";

function readSetup() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
  } catch {
    return null;
  }
}

export function hasAssistantSetup() {
  return Boolean(readSetup()?.completed);
}

function saveSetup(setup) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...setup, completed: true }));
}

function Choice({ active, children, onClick }) {
  return (
    <button type="button" onClick={onClick} className={`flex min-h-12 w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-xs transition ${active ? "border-violet-300/40 bg-violet-300/[0.08] text-white" : "border-white/[0.08] bg-[#111018] text-[#c5c0d0] hover:border-white/20"}`}>
      <span className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border ${active ? "border-violet-300 bg-violet-300 text-[#171222]" : "border-white/20"}`}>{active && <FaCheck className="text-[8px]" />}</span>
      {children}
    </button>
  );
}

export default function AssistantOnboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [setup, setSetup] = useState(() => readSetup() || {
    responsibilities: [],
    useCase: "A mix of personal and professional tasks",
    name: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
    language: "English",
    workStart: "09:00",
    workEnd: "17:00",
    style: "Friendly",
    quietStart: "21:00",
    quietEnd: "08:00",
    integrations: [],
    autonomy: "approve",
    briefing: "Morning",
  });
  const [testPrompt, setTestPrompt] = useState("Summarize my schedule for tomorrow and suggest three priorities.");
  const [error, setError] = useState("");

  function update(key, value) {
    setSetup((current) => ({ ...current, [key]: value }));
  }

  function toggleList(key, value) {
    setSetup((current) => ({
      ...current,
      [key]: current[key].includes(value) ? current[key].filter((item) => item !== value) : [...current[key], value],
    }));
  }

  function next() {
    if (step === 1 && !setup.responsibilities.length) {
      setError("Choose at least one area so your assistant knows where to start.");
      return;
    }
    if (step === 2 && !setup.name.trim()) {
      setError("Add a name so your assistant knows how to address you.");
      return;
    }
    setError("");
    setStep((current) => Math.min(current + 1, 7));
  }

  function finish() {
    const completed = { ...setup, completed: true };
    saveSetup(setup);
    onComplete(completed);
  }

  const stepNames = ["Welcome", "Focus", "Personalize", "Apps", "Permissions", "Briefings", "Review", "Ready"];

  return (
    <main className="mx-auto max-w-5xl px-6 py-9 max-[760px]:px-4">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="mb-1 text-[9px] font-bold tracking-[0.16em] text-violet-300">PERSONAL ASSISTANT SETUP</p>
          <p className="m-0 text-[10px] text-[#777285]">A few thoughtful choices · about 3–5 minutes</p>
        </div>
        <span className="text-[10px] text-[#9995a8]">{step + 1} / {stepNames.length}</span>
      </div>
      <div className="mb-7 flex gap-1.5" aria-label={`Step ${step + 1} of ${stepNames.length}`}>
        {stepNames.map((name, index) => <span key={name} title={name} className={`h-1 flex-1 rounded-full ${index <= step ? "bg-violet-300" : "bg-white/10"}`} />)}
      </div>

      <section className="min-h-[480px] rounded-2xl border border-white/[0.08] bg-[#171620] p-7 shadow-2xl max-[600px]:p-5">
        {step === 0 && <div className="flex min-h-[420px] flex-col justify-center">
          <span className="mb-6 grid h-14 w-14 place-items-center rounded-2xl border border-violet-300/20 bg-violet-300/10 text-2xl text-violet-200"><FaUserAstronaut /></span>
          <p className="mb-2 text-[9px] font-bold tracking-[0.16em] text-violet-300">YOUR DAY, WITH MORE ROOM</p>
          <h1 className="m-0 max-w-2xl font-display text-3xl font-semibold leading-tight text-white">Meet your Personal Assistant.</h1>
          <p className="mb-0 mt-3 max-w-2xl text-sm leading-6 text-[#aaa5b7]">Your day, organized. Your tasks, moving. Your time, protected. Set up help with planning, reminders, email drafts, and everyday follow-through.</p>
          <p className="mb-0 mt-3 text-[10px] text-[#777285]">Connect apps only if you want to. You can change these choices later.</p>
        </div>}

        {step === 1 && <>
          <StepHeading title="What should your assistant help with?" detail="Select every area you’d like to make a little easier." />
          <div className="grid gap-2 sm:grid-cols-2">{responsibilities.map((item) => <Choice key={item} active={setup.responsibilities.includes(item)} onClick={() => toggleList("responsibilities", item)}>{item}</Choice>)}</div>
          <h3 className="mb-3 mt-7 text-xs font-semibold text-white">How will you mainly use it?</h3>
          <div className="grid gap-2 sm:grid-cols-2">{useCases.map((item) => <Choice key={item} active={setup.useCase === item} onClick={() => update("useCase", item)}>{item}</Choice>)}</div>
        </>}

        {step === 2 && <>
          <StepHeading title="Make it feel like yours." detail="Just the useful basics. Your assistant can learn the rest as you go." />
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={labelClass}>What should it call you?<input autoFocus className={inputClass} value={setup.name} onChange={(event) => update("name", event.target.value)} placeholder="Your preferred name" /></label>
            <label className={labelClass}>Time zone<input className={inputClass} value={setup.timezone} onChange={(event) => update("timezone", event.target.value)} /></label>
            <label className={labelClass}>Preferred language<select className={inputClass} value={setup.language} onChange={(event) => update("language", event.target.value)}>{["English", "हिन्दी", "தமிழ்", "తెలుగు", "ಕನ್ನಡ", "Other"].map((language) => <option key={language}>{language}</option>)}</select></label>
            <label className={labelClass}>Communication style<select className={inputClass} value={setup.style} onChange={(event) => update("style", event.target.value)}>{["Friendly", "Concise", "Detailed"].map((style) => <option key={style}>{style}</option>)}</select></label>
            <label className={labelClass}>Usual day starts<input type="time" className={inputClass} value={setup.workStart} onChange={(event) => update("workStart", event.target.value)} /></label>
            <label className={labelClass}>Usual day ends<input type="time" className={inputClass} value={setup.workEnd} onChange={(event) => update("workEnd", event.target.value)} /></label>
          </div>
          <div className="mt-5 rounded-xl border border-white/[0.07] bg-[#111018] p-4">
            <p className="mb-3 flex items-center gap-2 text-[10px] font-semibold text-white"><FaClock className="text-violet-200" /> Quiet hours</p>
            <div className="grid grid-cols-2 gap-3"><label className={labelClass}>From<input type="time" className={inputClass} value={setup.quietStart} onChange={(event) => update("quietStart", event.target.value)} /></label><label className={labelClass}>Until<input type="time" className={inputClass} value={setup.quietEnd} onChange={(event) => update("quietEnd", event.target.value)} /></label></div>
          </div>
        </>}

        {step === 3 && <>
          <StepHeading title="Connect the apps you use." detail="Optional. Pick only what supports your selected tasks; you can skip this and connect later." />
          <div className="grid gap-3 sm:grid-cols-2">{integrations.map(({ name, detail, icon: Icon }) => {
            const selected = setup.integrations.includes(name);
            return <button key={name} type="button" onClick={() => toggleList("integrations", name)} className={`rounded-xl border p-4 text-left transition ${selected ? "border-violet-300/35 bg-violet-300/[0.06]" : "border-white/[0.08] bg-[#111018] hover:border-white/20"}`}>
              <div className="flex items-start gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-violet-300/10 text-violet-200"><Icon /></span><span className="min-w-0 flex-1"><strong className="block text-xs text-white">{name}</strong><small className="mt-1 block text-[10px] leading-4 text-[#9995a8]">{detail}</small></span><span className={`rounded-full px-2 py-1 text-[8px] ${selected ? "bg-violet-300/15 text-violet-200" : "bg-white/[0.05] text-[#777285]"}`}>{selected ? "Selected" : "Optional"}</span></div>
            </button>;
          })}</div>
          <p className="mb-0 mt-5 rounded-lg border border-amber-200/10 bg-amber-200/[0.03] p-3 text-[10px] leading-5 text-[#aaa5b7]">These selections are saved as setup preferences only. No account is connected and no information is shared yet.</p>
        </>}

        {step === 4 && <>
          <StepHeading title="Choose how much autonomy feels right." detail="You stay in control. Your choice here does not grant app access or permission to take consequential actions." />
          <div className="grid gap-3">{autonomyLevels.map((level) => <button key={level.id} type="button" onClick={() => update("autonomy", level.id)} className={`rounded-xl border p-4 text-left ${setup.autonomy === level.id ? "border-violet-300/40 bg-violet-300/[0.07]" : "border-white/[0.08] bg-[#111018]"}`}>
            <div className="flex items-center gap-2"><strong className="text-xs text-white">{level.title}</strong>{level.recommended && <span className="rounded-full bg-violet-300/15 px-2 py-1 text-[8px] font-semibold text-violet-200">RECOMMENDED</span>}{setup.autonomy === level.id && <FaCheck className="ml-auto text-[10px] text-emerald-200" />}</div>
            <p className="mb-0 mt-2 text-[10px] leading-5 text-[#9995a8]">{level.detail}</p>
          </button>)}</div>
          <div className="mt-5 flex gap-3 rounded-xl border border-emerald-300/10 bg-emerald-300/[0.03] p-4 text-[10px] leading-5 text-[#aaa5b7]"><FaShieldAlt className="mt-0.5 shrink-0 text-emerald-200" /><p className="m-0">Sending messages, cancelling meetings, making purchases, and deleting data always need your explicit permission.</p></div>
        </>}

        {step === 5 && <>
          <StepHeading title="When should your assistant check in?" detail="Choose a briefing rhythm. It respects the time zone and quiet hours you set." />
          <div className="grid gap-2 sm:grid-cols-2">{["Morning", "Evening", "Morning and evening", "Only when I ask"].map((item) => <Choice key={item} active={setup.briefing === item} onClick={() => update("briefing", item)}>{item === "Morning" ? "Morning · priorities and schedule" : item === "Evening" ? "Evening · wrap-up and tomorrow" : item === "Morning and evening" ? "Morning and evening" : item}</Choice>)}</div>
          <div className="mt-6 rounded-xl border border-white/[0.07] bg-[#111018] p-4"><p className="mb-2 text-[10px] font-semibold text-white">A briefing can include</p><ul className="m-0 grid gap-2 pl-4 text-[10px] leading-4 text-[#9995a8] sm:grid-cols-2"><li>Meetings and preparation</li><li>Tasks and approaching deadlines</li><li>Follow-ups that are still waiting</li><li>Possible conflicts and priorities</li></ul></div>
        </>}

        {step === 6 && <>
          <StepHeading title="Review your assistant setup." detail="Check what you selected before opening the workspace." />
          <div className="grid gap-3 sm:grid-cols-2">
            <Review title="Focus areas" value={setup.responsibilities.join(", ") || "None selected"} />
            <Review title="Your preferences" value={`${setup.name} · ${setup.language} · ${setup.style} · ${setup.timezone}`} />
            <Review title="Apps" value={setup.integrations.length ? `${setup.integrations.join(", ")} (selected only; not connected)` : "None selected"} />
            <Review title="Autonomy and briefings" value={`${autonomyLevels.find((level) => level.id === setup.autonomy)?.title} · ${setup.briefing} · Quiet hours ${setup.quietStart}–${setup.quietEnd}`} />
          </div>
          <label className={`${labelClass} mt-5`}>Try a low-risk request<textarea className="mt-2 min-h-20 w-full rounded-lg border border-white/10 bg-[#111018] p-3 text-xs text-white outline-none focus:border-violet-300/50" value={testPrompt} onChange={(event) => setTestPrompt(event.target.value)} /></label>
          <div className="mt-3 rounded-xl border border-violet-300/15 bg-violet-300/[0.04] p-4"><p className="mb-1 text-[9px] font-bold tracking-wider text-violet-200">LOCAL PREVIEW · NO APPS CHECKED</p><p className="m-0 text-[10px] leading-5 text-[#aaa5b7]">Your assistant is ready to help with this request once an AI service and any relevant app connections are configured. This setup preview does not access your calendar or email.</p></div>
        </>}

        {step === 7 && <div className="flex min-h-[420px] flex-col justify-center">
          <span className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-emerald-300/10 text-2xl text-emerald-200"><FaCheck /></span>
          <p className="mb-2 text-[9px] font-bold tracking-[0.16em] text-violet-300">READY WHEN YOU ARE</p>
          <h1 className="m-0 font-display text-3xl font-semibold text-white">Your assistant is ready, {setup.name || "there"}.</h1>
          <p className="mb-0 mt-3 max-w-xl text-sm leading-6 text-[#aaa5b7]">Your daily workspace is set up around {setup.responsibilities.length} focus area{setup.responsibilities.length === 1 ? "" : "s"}. You can adjust these choices any time.</p>
          <div className="mt-6 flex flex-wrap gap-2">{["My Day", "Tasks & Follow-ups", "Inbox Assistant", "Apps & Rules"].map((item) => <span key={item} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-[10px] text-[#c5c0d0]">{item}</span>)}</div>
        </div>}

        {error && <p role="alert" className="mb-0 mt-5 text-[10px] text-rose-300">{error}</p>}
        <footer className="mt-8 flex items-center justify-between gap-3 border-t border-white/[0.07] pt-5">
          {step > 0 && step < 7 ? <button type="button" onClick={() => { setError(""); setStep((current) => current - 1); }} className="inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-[10px] text-[#c5c0d0] hover:bg-white/[0.04]"><FaArrowLeft /> Back</button> : <span className="text-[9px] text-[#777285]">Your choices stay in this browser for now.</span>}
          {step < 7 ? <button type="button" onClick={next} className="inline-flex items-center gap-2 rounded-lg bg-violet-300 px-4 py-3 text-[10px] font-bold text-[#171222] hover:bg-violet-200">{step === 0 ? "Set up my assistant" : step === 3 ? "Continue · connect later" : "Continue"}<FaArrowRight /></button> : <button type="button" onClick={finish} className="inline-flex items-center gap-2 rounded-lg bg-violet-300 px-5 py-3 text-[10px] font-bold text-[#171222] hover:bg-violet-200">Open my workspace<FaArrowRight /></button>}
        </footer>
      </section>
    </main>
  );
}

function StepHeading({ title, detail }) {
  return <div className="mb-6"><h2 className="m-0 font-display text-xl font-semibold text-white">{title}</h2><p className="mb-0 mt-2 max-w-2xl text-xs leading-5 text-[#9995a8]">{detail}</p></div>;
}

function Review({ title, value }) {
  return <article className="rounded-xl border border-white/[0.07] bg-[#111018] p-4"><h3 className="mb-2 mt-0 text-[10px] font-semibold text-violet-200">{title}</h3><p className="m-0 text-[10px] leading-5 text-[#aaa5b7]">{value}</p></article>;
}
