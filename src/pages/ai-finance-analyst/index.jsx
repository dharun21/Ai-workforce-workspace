import { useMemo, useState } from "react";
import { AppLayout } from "../../components/AppLayout";
import FinanceCompanionTools from "./FinanceCompanionTools";
import { FinancePluginsPanel, FinanceQuestionsCard } from "./FinanceWorkspaceControls";
import {
  FaArrowRight,
  FaBalanceScale,
  FaChartLine,
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaFileAlt,
  FaFileInvoice,
  FaPlus,
  FaPlug,
  FaSearch,
  FaUpload,
} from "react-icons/fa";

const PROFILE_KEY = "zengen-finance-profile";
const DOCUMENTS_KEY = "zengen-finance-documents";
const WORKFLOWS = [
  "Customer invoices and payments received",
  "Supplier invoices and bills to pay",
  "Employee expenses and reimbursements",
  "Bank transactions and reconciliation",
  "Tax records and financial reports",
];
const SOURCES = [
  "Excel or Google Sheets",
  "PDFs, scanned bills, or email attachments",
  "Accounting software",
  "Bank exports",
  "Multiple disconnected systems",
];
const SECTIONS = [
  { id: "Overview", icon: FaChartLine },
  { id: "Documents", icon: FaFileAlt },
  { id: "Plugins", icon: FaPlug },
  { id: "Receivables", icon: FaArrowRight },
  { id: "Bills", icon: FaFileInvoice },
  { id: "Reconciliation", icon: FaBalanceScale },
  { id: "Insights", icon: FaChartLine },
  { id: "Reports", icon: FaFileAlt },
  { id: "Finance rules", icon: FaCheck },
];

function readStored(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function Metric({ label, value, note, icon: Icon, style }) {
  return (
    <article style={style} className="h-full min-w-0 rounded-2xl border border-white/[0.07] bg-[#171620] p-5">
      <div className="flex items-center justify-between text-xs text-[#9995a8]">
        {label}
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-300/10 text-violet-200">
          <Icon />
        </span>
      </div>
      <strong className="mt-4 block font-display text-2xl font-bold text-white">{value}</strong>
      <p className="mb-0 mt-1 text-[11px] text-[#777285]">{note}</p>
    </article>
  );
}

function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({
    businessName: "",
    industry: "",
    country: "",
    currency: "USD",
    size: "1–10 people",
    financialYear: "January–December",
    workflows: [],
    sources: [],
    paymentTerms: "Net 30",
    approvalLimit: "",
    reviewer: "",
    categories: "Software, Travel, Supplies, Payroll, Other",
    files: [],
  });
  const [error, setError] = useState("");
  const update = (key, value) => setProfile((current) => ({ ...current, [key]: value }));
  const toggle = (key, value) =>
    update(key, profile[key].includes(value)
      ? profile[key].filter((item) => item !== value)
      : [...profile[key], value]);
  const finish = () => {
    if (!profile.businessName.trim()) {
      setError("Add your business name to continue.");
      setStep(0);
      return;
    }
    localStorage.setItem(PROFILE_KEY, JSON.stringify({ ...profile, completed: true }));
    onComplete({ ...profile, completed: true });
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 max-[760px]:px-4">
      <div className="mb-8">
        <p className="mb-2 text-[10px] font-bold tracking-[0.18em] text-violet-300">YOUR FINANCE ANALYST</p>
        <h1 className="m-0 font-display text-3xl font-bold text-white">Let’s get to know your business.</h1>
        <p className="mb-0 mt-2 max-w-2xl text-sm leading-6 text-[#9995a8]">
          A few details help shape useful finance workflows. You can change these preferences anytime.
        </p>
      </div>
      <div className="mb-7 flex gap-2" aria-label={`Step ${step + 1} of 5`}>
        {["Business", "Work", "Sources", "Rules", "Import"].map((label, index) => (
          <div className="min-w-0 flex-1" key={label}>
            <div className={`mb-2 h-1 rounded-full ${index <= step ? "bg-violet-300" : "bg-white/10"}`} />
            <span className={`text-[10px] ${index === step ? "text-violet-200" : "text-[#777285]"}`}>{label}</span>
          </div>
        ))}
      </div>
      <section className="rounded-2xl border border-white/[0.08] bg-[#171620] p-6 sm:p-8">
        {step === 0 && (
          <>
            <h2 className="m-0 font-display text-xl font-semibold">Tell us about your business</h2>
            <p className="mb-6 mt-2 text-xs text-[#9995a8]">We’ll use this to tailor categories, reporting, and financial periods.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Business name"><input autoFocus value={profile.businessName} onChange={(e) => update("businessName", e.target.value)} placeholder="e.g. Northstar Studio" /></Field>
              <Field label="Industry"><input value={profile.industry} onChange={(e) => update("industry", e.target.value)} placeholder="e.g. Retail, software, consulting" /></Field>
              <Field label="Country"><input value={profile.country} onChange={(e) => update("country", e.target.value)} placeholder="Country or region" /></Field>
              <Field label="Operating currency"><select value={profile.currency} onChange={(e) => update("currency", e.target.value)}>{["USD", "INR", "EUR", "GBP", "CAD", "AUD", "Other"].map((x) => <option key={x}>{x}</option>)}</select></Field>
              <Field label="Business size"><select value={profile.size} onChange={(e) => update("size", e.target.value)}>{["Just me", "1–10 people", "11–50 people", "51–200 people", "201+ people"].map((x) => <option key={x}>{x}</option>)}</select></Field>
              <Field label="Financial year"><select value={profile.financialYear} onChange={(e) => update("financialYear", e.target.value)}>{["January–December", "April–March", "July–June", "October–September", "Custom"].map((x) => <option key={x}>{x}</option>)}</select></Field>
            </div>
          </>
        )}
        {step === 1 && <ChoiceStep title="What does your finance team handle?" subtitle="Choose all the activities you want to organize in this workspace." items={WORKFLOWS} selected={profile.workflows} onToggle={(item) => toggle("workflows", item)} />}
        {step === 2 && <ChoiceStep title="Where does your finance information live?" subtitle="Select the sources you use today. You can bring files in later, too." items={SOURCES} selected={profile.sources} onToggle={(item) => toggle("sources", item)} />}
        {step === 3 && (
          <>
            <h2 className="m-0 font-display text-xl font-semibold">Set a few starter rules</h2>
            <p className="mb-6 mt-2 text-xs text-[#9995a8]">These are editable defaults. Nothing here authorizes payments or sends messages.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Typical customer payment terms"><select value={profile.paymentTerms} onChange={(e) => update("paymentTerms", e.target.value)}>{["Due on receipt", "Net 7", "Net 14", "Net 30", "Net 60", "Other"].map((x) => <option key={x}>{x}</option>)}</select></Field>
              <Field label="Flag bills above (optional)"><input type="number" min="0" value={profile.approvalLimit} onChange={(e) => update("approvalLimit", e.target.value)} placeholder={`Amount in ${profile.currency}`} /></Field>
              <Field label="Who reviews flagged items?"><input value={profile.reviewer} onChange={(e) => update("reviewer", e.target.value)} placeholder="Name or role (optional)" /></Field>
              <Field label="Starter expense categories"><input value={profile.categories} onChange={(e) => update("categories", e.target.value)} /></Field>
            </div>
          </>
        )}
        {step === 4 && (
          <>
            <h2 className="m-0 font-display text-xl font-semibold">Bring in existing records</h2>
            <p className="mb-6 mt-2 max-w-2xl text-xs leading-5 text-[#9995a8]">
              Add invoices, bills, or bank CSVs now, or skip this step. Files are listed in your workspace; automatic extraction and connected accounts will be enabled when the finance services are connected.
            </p>
            <label className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-violet-300/30 bg-violet-300/[0.035] p-6 text-center hover:bg-violet-300/[0.07]">
              <input className="sr-only" type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.csv,.xlsx,.xls" onChange={(e) => update("files", [...profile.files, ...Array.from(e.target.files || []).map((file) => file.name)])} />
              <span className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-violet-300/10 text-xl text-violet-200"><FaUpload /></span>
              <strong className="text-sm">{profile.files.length ? `${profile.files.length} file(s) selected` : "Choose files to add"}</strong>
              <span className="mt-2 text-[11px] text-[#9995a8]">PDF, images, CSV, or Excel · multiple files supported</span>
            </label>
            {profile.files.length > 0 && <ul className="mt-4 space-y-1 text-xs text-[#c5c0d0]">{profile.files.map((name, index) => <li key={`${name}-${index}`}>{name}</li>)}</ul>}
          </>
        )}
        {error && <p role="alert" className="mb-0 mt-4 text-xs text-rose-300">{error}</p>}
        <div className="mt-8 flex items-center justify-between border-t border-white/[0.07] pt-5">
          {step > 0 ? <button type="button" onClick={() => { setError(""); setStep(step - 1); }} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-[#c5c0d0] hover:bg-white/[0.04]"><FaChevronLeft /> Back</button> : <span className="text-[10px] text-[#777285]">About 5 minutes · You can edit this later</span>}
          <button type="button" onClick={() => { setError(""); step < 4 ? setStep(step + 1) : finish(); }} className="inline-flex items-center gap-2 rounded-lg bg-violet-300 px-5 py-3 text-xs font-bold text-[#171222] hover:bg-violet-200">
            {step === 4 ? "Finish setup" : "Continue"} <FaChevronRight />
          </button>
        </div>
      </section>
      <p className="mb-0 mt-4 text-center text-[10px] text-[#777285]">Your records stay under your control. Payment actions always need your authorization.</p>
    </div>
  );
}

function Field({ label, children }) {
  const child = {
    ...children,
    props: {
      ...children.props,
      className: `mt-2 h-11 w-full rounded-lg border border-white/[0.09] bg-[#111018] px-3 text-xs text-white outline-none transition focus:border-violet-300/50 ${children.props.className || ""}`,
    },
  };
  return <label className="block text-[11px] font-medium text-[#c5c0d0]">{label}{child}</label>;
}

function ChoiceStep({ title, subtitle, items, selected, onToggle }) {
  return (
    <>
      <h2 className="m-0 font-display text-xl font-semibold">{title}</h2>
      <p className="mb-6 mt-2 text-xs text-[#9995a8]">{subtitle}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {items.map((item) => {
          const active = selected.includes(item);
          return <button type="button" key={item} onClick={() => onToggle(item)} className={`flex min-h-14 items-center gap-3 rounded-xl border px-4 text-left text-xs transition ${active ? "border-violet-300/40 bg-violet-300/[0.08] text-white" : "border-white/[0.08] bg-[#111018] text-[#c5c0d0] hover:border-white/20"}`}>
            <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border ${active ? "border-violet-300 bg-violet-300 text-[#171222]" : "border-white/20"}`}>{active && <FaCheck className="text-[10px]" />}</span>{item}
          </button>;
        })}
      </div>
    </>
  );
}

function EmptyState({ title, copy, action }) {
  return <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.015] px-5 py-12 text-center">
    <span className="mx-auto mb-4 grid h-11 w-11 place-items-center rounded-xl bg-violet-300/10 text-violet-200"><FaFileAlt /></span>
    <h3 className="m-0 text-sm font-semibold text-white">{title}</h3>
    <p className="mx-auto mb-0 mt-2 max-w-lg text-xs leading-5 text-[#9995a8]">{copy}</p>
    {action}
  </div>;
}

export default function FinanceIndex() {
  const [profile, setProfile] = useState(() => readStored(PROFILE_KEY, null));
  const [section, setSection] = useState("Overview");
  const [documents, setDocuments] = useState(() => readStored(DOCUMENTS_KEY, []));
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const filtered = useMemo(
    () => documents.filter((item) => item.name.toLowerCase().includes(search.toLowerCase())),
    [documents, search],
  );

  function addFiles(fileList) {
    const added = Array.from(fileList || []).map((file) => ({
      id: `${Date.now()}-${file.name}-${Math.random().toString(36).slice(2, 7)}`,
      name: file.name,
      added: new Date().toLocaleDateString(),
      status: "Added to workspace",
      kind: file.name.split(".").pop()?.toUpperCase() || "FILE",
    }));
    const next = [...added, ...documents];
    setDocuments(next);
    localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(next));
    setNotice(added.length ? `${added.length} file(s) added. They are ready for finance processing once services are connected.` : "");
    window.setTimeout(() => setNotice(""), 6000);
  }

  function completeOnboarding(savedProfile) {
    setProfile(savedProfile);
    if (savedProfile.files.length) {
      const imported = savedProfile.files.map((name, index) => ({
        id: `${Date.now()}-${index}-${name}`,
        name,
        added: new Date().toLocaleDateString(),
        status: "Added to workspace",
        kind: name.split(".").pop()?.toUpperCase() || "FILE",
      }));
      const next = [...imported, ...documents];
      setDocuments(next);
      localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(next));
    }
  }

  if (!profile?.completed) {
    return <AppLayout section="My AI team" current="Finance Analyst"><Onboarding onComplete={completeOnboarding} /></AppLayout>;
  }

  const importButton = (
    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-violet-300 px-4 py-3 text-[11px] font-bold text-[#171222] hover:bg-violet-200">
      <input className="sr-only" type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.csv,.xlsx,.xls" onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
      <FaPlus /> Import files
    </label>
  );

  return (
    <AppLayout section="My AI team" current="Finance Analyst">
      <div className="mx-auto max-w-[1450px] px-7 py-7 max-[760px]:px-4">
        <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 flex items-center gap-2 text-[9px] font-bold tracking-[0.17em] text-violet-300"><span className="h-px w-4 bg-violet-300" /> FINANCE WORKSPACE</p>
            <h1 className="m-0 font-display text-3xl font-bold tracking-tight text-white">{profile.businessName}</h1>
            <p className="mb-0 mt-2 text-xs text-[#9995a8]">Your AI Finance Analyst · {profile.currency} · {profile.industry || "Business finance"}</p>
          </div>
          {importButton}
        </header>
        {notice && <p role="status" className="mb-4 rounded-lg border border-violet-300/20 bg-violet-300/[0.06] px-4 py-3 text-xs text-violet-100">{notice}</p>}
        <nav className="mb-6 flex gap-1 overflow-x-auto border-b border-white/[0.08]" aria-label="Finance workspace">
          {SECTIONS.map(({ id, icon: Icon }) => <button key={id} type="button" onClick={() => setSection(id)} className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-[11px] transition ${section === id ? "border-violet-300 text-violet-200" : "border-transparent text-[#9995a8] hover:text-white"}`}><Icon className="text-[10px]" />{id}</button>)}
        </nav>
        {section === "Overview" && <>
          <section className="mb-5 grid grid-cols-4 gap-3 max-[1000px]:grid-cols-2 max-[520px]:grid-cols-1">
            <Metric label="Outstanding receivables" value={profile.currency + " 0.00"} note="From imported customer invoices" icon={FaArrowRight} />
            <Metric label="Bills due soon" value={profile.currency + " 0.00"} note="Supplier bills with upcoming due dates" icon={FaClock} />
            <Metric label="Needs your review" value={documents.length.toString()} note="Imported files awaiting processing" icon={FaCheck} />
            <Metric label="Documents added" value={documents.length.toString()} note="This workspace · local file list" icon={FaFileInvoice} />
          </section>
          <section className="mb-5 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
            <article className="rounded-2xl border border-violet-300/20 bg-[radial-gradient(ellipse_at_top_right,rgba(167,139,250,0.12),transparent_55%),#171620] p-6">
              <p className="mb-2 text-[9px] font-bold tracking-[0.16em] text-violet-200">FINANCE AUTOPILOT</p>
              <h2 className="m-0 font-display text-xl font-semibold">A clear view of what needs attention.</h2>
              <p className="mb-5 mt-2 max-w-2xl text-xs leading-5 text-[#aaa5b7]">Build a dependable picture of money owed, bills coming due, and exceptions to review. Imported values and projections will appear when records are processed.</p>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => setSection("Documents")} className="rounded-lg bg-violet-300 px-4 py-2.5 text-[10px] font-bold text-[#171222]">Review documents <FaArrowRight className="ml-2 inline" /></button>
                <button type="button" onClick={() => setSection("Finance rules")} className="rounded-lg border border-white/10 px-4 py-2.5 text-[10px] text-[#c5c0d0] hover:bg-white/[0.04]">Set finance rules</button>
              </div>
            </article>
            <FinanceQuestionsCard documents={documents} onOpenDocuments={() => setSection("Documents")} />
          </section>
          <section className="rounded-2xl border border-white/[0.07] bg-[#171620] p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="m-0 text-sm font-semibold">Recent finance activity</h2>
                <p className="mb-0 mt-1 text-[10px] text-[#777285]">A record of work in this workspace</p>
              </div>
              <button type="button" onClick={() => setSection("Documents")} className="text-[10px] text-violet-200">View documents <FaArrowRight className="ml-1 inline" /></button>
            </div>
            {documents.length ? (
              <div className="divide-y divide-white/[0.06]">
                {documents.slice(0, 5).map((doc) => (
                  <div key={doc.id} className="flex items-center gap-3 py-3">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-violet-300/10 text-violet-200"><FaFileAlt /></span>
                    <div className="min-w-0 flex-1">
                      <p className="m-0 truncate text-xs text-white">{doc.name}</p>
                      <p className="mb-0 mt-1 text-[10px] text-[#777285]">{doc.kind} · added {doc.added}</p>
                    </div>
                    <span className="text-[10px] text-[#9995a8]">{doc.status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="Your finance workspace is ready" copy="Import invoices, bills, or bank exports. This dashboard will surface verified records and items that need your review." action={importButton} />
            )}
          </section>
        </>}
        {section === "Plugins" && <FinancePluginsPanel />}
        {section === "Documents" && <section className="rounded-2xl border border-white/[0.07] bg-[#171620] p-5">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><h2 className="m-0 text-base font-semibold">Documents & imports</h2><p className="mb-0 mt-1 text-xs text-[#9995a8]">Invoices, bills, receipts, and transaction files you add.</p></div><label className="flex h-9 w-64 items-center gap-2 rounded-lg border border-white/[0.08] bg-[#111018] px-3 text-[10px] text-[#777285]"><FaSearch /><input aria-label="Search imported documents" className="min-w-0 flex-1 bg-transparent text-white outline-none" placeholder="Search files..." value={search} onChange={(e) => setSearch(e.target.value)} /></label></div>
          {filtered.length ? <div className="divide-y divide-white/[0.06]">{filtered.map((doc) => <div key={doc.id} className="flex items-center gap-3 py-3"><span className="grid h-9 w-9 place-items-center rounded-lg bg-violet-300/10 text-violet-200"><FaFileAlt /></span><div className="min-w-0 flex-1"><p className="m-0 truncate text-xs text-white">{doc.name}</p><p className="mb-0 mt-1 text-[10px] text-[#777285]">{doc.kind} · added {doc.added}</p></div><span className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[9px] text-[#c5c0d0]">{doc.status}</span></div>)}</div> : <EmptyState title={search ? "No matching files" : "No documents yet"} copy={search ? "Try another file name." : "Add a batch of invoices, bills, receipts, or bank exports to your workspace."} action={importButton} />}
        </section>}
        {section !== "Overview" && section !== "Documents" && section !== "Plugins" && <section className="rounded-2xl border border-white/[0.07] bg-[#171620] p-6">
          <p className="mb-2 text-[9px] font-bold tracking-[0.16em] text-violet-300">FINANCE WORKSPACE</p>
          <h2 className="m-0 font-display text-xl font-semibold">{section}</h2>
          <p className="mb-5 mt-2 max-w-2xl text-xs leading-5 text-[#9995a8]">{sectionCopy(section)}</p>
          {section === "Finance rules" ? <div className="grid gap-3 sm:grid-cols-2">
            <Rule label="Payment terms" value={profile.paymentTerms} />
            <Rule label="Bill review threshold" value={profile.approvalLimit ? `${profile.currency} ${profile.approvalLimit}` : "Not set"} />
            <Rule label="Review owner" value={profile.reviewer || "Not assigned"} />
            <Rule label="Expense categories" value={profile.categories || "Not set"} />
            <Rule label="Business size" value={profile.size} />
            <Rule label="Financial year" value={profile.financialYear} />
            <button type="button" onClick={() => { localStorage.removeItem(PROFILE_KEY); setProfile(null); }} className="mt-2 w-fit rounded-lg border border-white/10 px-4 py-2.5 text-[10px] text-[#c5c0d0] hover:bg-white/[0.04]">Edit onboarding answers</button>
          </div> : <EmptyState title={`No ${section.toLowerCase()} yet`} copy={sectionCopy(section)} action={<button type="button" onClick={() => setSection("Documents")} className="mt-4 rounded-lg border border-white/10 px-4 py-2.5 text-[10px] text-violet-200 hover:bg-white/[0.04]">Go to documents <FaArrowRight className="ml-2 inline" /></button>} />}
        </section>}
        <p className="mb-0 mt-5 flex items-center gap-2 text-[10px] text-[#777285]"><FaCheck className="text-emerald-300" /> Setup saved in this browser · Finance data connections are not active yet</p>
      </div>
      <FinanceCompanionTools />
    </AppLayout>
  );
}

function Rule({ label, value }) {
  return <div className="rounded-xl border border-white/[0.07] bg-[#111018] p-4"><p className="mb-1 text-[10px] text-[#777285]">{label}</p><p className="mb-0 text-xs text-white">{value}</p></div>;
}

function sectionCopy(section) {
  const copy = {
    Receivables: "Track customer invoices, outstanding balances, due dates, and follow-up drafts. Payment status should be backed by imported records or an authorized confirmation.",
    Bills: "Organize supplier bills, due dates, approval thresholds, and recurring costs. Payment execution always requires your authorization.",
    Reconciliation: "Bring in bank transaction exports to review possible matches against invoices, bills, and recorded payments.",
    Insights: "Understand income, expenses, trends, and estimated cash flow, with the underlying records shown alongside each insight.",
    Reports: "Prepare monthly summaries, outstanding balance reports, vendor expenses, and downloadable finance reports.",
    "Finance rules": "Review the preferences you set during onboarding. Thresholds help flag items for review; they do not authorize financial actions.",
  };
  return copy[section] || "Keep your finance work organized in one place.";
}



