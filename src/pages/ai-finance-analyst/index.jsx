import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AppLayout } from "../../components/AppLayout";

import OnboardingWizard from "./OnboardingWizard";
import ChatInterface from "./ChatInterface";
import { financeApi, fromFinanceDocument, fromFinanceWorkspace, toFinanceWorkspace } from "../../api/finance";
import { apiErrorMessage } from "../../api/client";
import FinanceCompanionTools from "./FinanceCompanionTools";
import FinanceInsights from "./FinanceInsights";
import PayrollPanel from "./PayrollPanel";
import { FinancePluginsPanel } from "./FinanceWorkspaceControls";
import {
  FaArrowRight,
  FaBalanceScale,
  FaBell,
  FaBuilding,
  FaChartLine,
  FaCheck,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaComments,
  FaDownload,
  FaFileAlt,
  FaFileInvoice,
  FaHandHoldingUsd,
  FaInfoCircle,
  FaMoneyBillWave,
  FaPlus,
  FaPlug,
  FaSearch,
  FaTrash,
  FaUpload,
} from "react-icons/fa";

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
  { id: "Receivables", icon: FaArrowRight },
  { id: "Bills", icon: FaFileInvoice },
  { id: "Payroll", icon: FaMoneyBillWave },
  { id: "Statements", icon: FaBalanceScale },
  { id: "Insights", icon: FaChartLine },
  { id: "Reports", icon: FaFileAlt },
  { id: "Plugins", icon: FaPlug },
  { id: "Finance rules", icon: FaCheck },
  { id: "About us", icon: FaInfoCircle },
];
const VIEWS = [
  { id: "overview", label: "Finance Overview", icon: FaChartLine },
  { id: "chat", label: "AI Chat", icon: FaComments },
];

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

function focusMoney(rows, currency) {
  return rows?.length ? rows.map((row) => formatMoney(row.amount, row.currency)).join(" · ") : formatMoney(0, currency);
}

function BusinessFocus({ focus, currency, onSection }) {
  if (!focus || focus.business_type === "general") return null;
  const retail = focus.business_type === "retail";
  const scope = retail ? "invoices" : "bills";
  const counterparties = retail ? focus.concentration?.customers : focus.concentration?.suppliers;
  const aged = focus.aging?.[scope] || [];
  const metrics = retail ? [
    ["Open customer balances", focus.balances?.invoices, "Receivables"],
    ["Overdue collections", focus.balances?.overdue_invoices, "Receivables"],
    ["Supplier bills due in 7 days", focus.balances?.due_soon_bills, "Bills"],
  ] : [
    ["Open supplier obligations", focus.balances?.bills, "Bills"],
    ["Overdue supplier bills", focus.balances?.overdue_bills, "Bills"],
    ["Customer balances due in 7 days", focus.balances?.due_soon_invoices, "Receivables"],
  ];
  return <section className="mb-5 space-y-4" aria-label={`${retail ? "Retail" : "Corporate"} finance focus`}>
    <div className="rounded-2xl border border-violet-300/20 bg-violet-300/[0.05] p-5"><p className="mb-1 text-[9px] font-bold tracking-[0.16em] text-violet-200">{retail ? "RETAIL VIEW" : "CORPORATE VIEW"} · {focus.as_of}</p><h2 className="m-0 text-base font-semibold text-white">{retail ? "Collections and store finance" : "Obligations and counterparty exposure"}</h2><p className="mb-0 mt-2 text-[11px] leading-5 text-[#aaa5b9]">{retail ? "Start with customer balances and bills. Product margins need inventory and POS records." : "Start with payables and due dates. Group profit and budgets need entity and ledger records."}</p></div>
    <div className="grid gap-3 md:grid-cols-3">{metrics.map(([label, rows, destination]) => <button key={label} type="button" onClick={() => onSection(destination)} className="rounded-xl border border-white/[0.07] bg-[#171620] p-4 text-left hover:border-violet-300/30"><span className="text-[10px] text-[#aaa5b9]">{label}</span><strong className="mt-3 block text-base text-white">{focusMoney(rows, currency)}</strong><span className="mt-1 block text-[9px] text-[#777285]">{(rows || []).reduce((sum, row) => sum + row.count, 0)} confirmed open record(s) · by currency</span></button>)}</div>
    <div className="grid gap-4 lg:grid-cols-2"><article className="rounded-2xl border border-white/[0.07] bg-[#171620] p-5"><h3 className="m-0 text-sm font-semibold text-white">{retail ? "Customer invoice aging" : "Supplier bill aging"}</h3><p className="mb-4 mt-1 text-[10px] text-[#777285]">Remaining balances by saved due date</p>{aged.length ? <div className="space-y-2">{aged.map((row) => <div key={`${row.currency}-${row.bucket}`} className="flex items-center justify-between gap-3 border-b border-white/[0.05] py-2 text-[11px]"><span className="text-[#aaa5b9]">{row.label} <small>({row.count})</small></span><strong className="text-white">{formatMoney(row.amount, row.currency)}</strong></div>)}</div> : <p className="m-0 text-xs text-[#9995a8]">No confirmed open {retail ? "customer invoices" : "supplier bills"} yet.</p>}</article><article className="rounded-2xl border border-white/[0.07] bg-[#171620] p-5"><h3 className="m-0 text-sm font-semibold text-white">{retail ? "Largest customer balances" : "Largest supplier balances"}</h3><p className="mb-4 mt-1 text-[10px] text-[#777285]">Share of identified open balances within each currency</p>{counterparties?.length ? <div className="space-y-2">{counterparties.map((row) => <div key={`${row.currency}-${row.name}`} className="flex items-center justify-between gap-3 border-b border-white/[0.05] py-2 text-[11px]"><span className="min-w-0 truncate text-[#aaa5b9]">{row.name} · {row.share_percent}%</span><strong className="shrink-0 text-white">{formatMoney(row.amount, row.currency)}</strong></div>)}</div> : <p className="m-0 text-xs text-[#9995a8]">Identified {retail ? "customers" : "suppliers"} with open balances will appear here.</p>}{focus.missing_counterparty_counts?.[scope] > 0 && <p className="mb-0 mt-3 text-[10px] text-amber-100">{focus.missing_counterparty_counts[scope]} record(s) without a name are excluded from shares.</p>}</article></div>
    <div><h3 className="mb-3 text-sm font-semibold text-white">What would complete this view</h3><div className="grid gap-3 md:grid-cols-3">{focus.missing_data?.map((item) => <article key={item.title} className="rounded-xl border border-dashed border-white/15 bg-[#111018] p-4"><span className="text-[9px] font-bold uppercase tracking-wider text-amber-100">Needs data</span><h4 className="mb-1 mt-2 text-xs font-semibold text-white">{item.title}</h4><p className="m-0 text-[10px] leading-5 text-[#9995a8]">{item.detail}</p></article>)}</div></div>
    <p className="m-0 text-[10px] leading-5 text-[#777285]">{focus.basis_note}</p>
  </section>;
}

function formatMoney(amount, currency = "USD") {
  const value = Number(amount || 0);
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

function balanceDue(record) {
  if (record.total_amount == null) return null;
  return Math.max(0, Number(record.balance_due ?? (Number(record.total_amount) - Number(record.amount_paid || 0))));
}

function PaymentControl({ record, onSave, busy }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const total = Number(record.total_amount);
  const paid = Number(record.amount_paid || 0);
  const amount = Number(draft);
  if (record.total_amount == null) return <span className="text-[9px] text-[#777285]">Confirm amount first</span>;
  if (!editing) return <button type="button" disabled={busy} onClick={() => { setDraft(String(paid)); setEditing(true); }} className="whitespace-nowrap rounded-lg border border-white/10 px-2.5 py-2 text-[9px] text-violet-200 hover:bg-white/[0.04] disabled:opacity-50">{paid > 0 ? "Edit paid total" : "Record payment"}</button>;
  return <div className="flex min-w-56 flex-wrap items-end gap-2">
    <label className="text-[9px] text-[#9995a8]">Total paid to date ({record.currency || "workspace currency"})<input type="number" min="0" max={total} step="0.01" value={draft} onChange={(event) => setDraft(event.target.value)} className="mt-1 block w-28 rounded-lg border border-white/10 bg-[#111018] px-2 py-1.5 text-[10px] text-white" /></label>
    <button type="button" onClick={() => setDraft(String(total))} className="rounded-lg border border-white/10 px-2 py-1.5 text-[9px] text-[#c5c0d0]">Full amount</button>
    <button type="button" disabled={busy || !/^\d+(?:\.\d{1,2})?$/.test(draft.trim()) || !Number.isFinite(amount) || amount > total} onClick={async () => { if (await onSave(record, amount)) setEditing(false); }} className="rounded-lg bg-violet-300 px-2 py-1.5 text-[9px] font-semibold text-[#171222] disabled:opacity-50">Save</button>
    <button type="button" onClick={() => setEditing(false)} className="px-1 text-[9px] text-[#9995a8]">Cancel</button>
  </div>;
}

function localDateIso(date = new Date()) {
  const local = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return `${local.getFullYear()}-${String(local.getMonth() + 1).padStart(2, "0")}-${String(local.getDate()).padStart(2, "0")}`;
}

function offsetIsoDate(isoDate, days) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  return localDateIso(date);
}

function FinanceRecordList({ records, documents, type, currency, onPayment, onReminder, busy, emptyAction }) {
  const filtered = records
    .filter((record) => record.record_type === type && record.status !== "unsupported")
    .sort((a, b) => (a.due_date || "9999").localeCompare(b.due_date || "9999"));
  const isBill = type === "expense";
  if (!filtered.length) {
    return <EmptyState title={isBill ? "No supplier bills yet" : "No customer invoices yet"} copy={isBill ? "Confirmed supplier bills will appear here with due dates and payment status." : "Confirmed customer invoices will appear here with outstanding and received status."} action={emptyAction} />;
  }
  return <div className="overflow-x-auto rounded-xl border border-white/[0.07]">
    <table className="w-full min-w-[1080px] border-collapse text-left">
      <thead><tr className="border-b border-white/[0.08] bg-white/[0.02] text-[10px] text-[#777285]">{[isBill ? "Supplier / bill" : "Customer / invoice", "Reference", "Issue date", "Due date", "Total", "Paid to date", "Balance due", "Status", "Source", "Actions"].map((label) => <th key={label} className="px-3 py-3 font-medium">{label}</th>)}</tr></thead>
      <tbody>{filtered.map((record) => {
        const statusLabel = record.status === "unsupported" ? "Unsupported" : record.status !== "confirmed" ? "Needs review" : record.payment_status === "paid" ? (isBill ? "Paid" : "Received") : getDueStatus(record.due_date) === "Overdue" ? "Overdue" : record.payment_status === "partial" ? "Partially paid" : getDueStatus(record.due_date);
        const tagStyle = record.status === "unsupported" ? "bg-white/[0.06] text-[#9995a8]" : record.status !== "confirmed" ? "bg-amber-200/10 text-amber-100" : record.payment_status === "paid" ? "bg-emerald-300/10 text-emerald-200" : statusLabel === "Overdue" ? "bg-rose-300/10 text-rose-200" : "bg-violet-300/10 text-violet-200";
        return <tr key={record.id} className="border-b border-white/[0.05] text-[11px] text-[#c5c0d0] last:border-0">
          <td className="px-3 py-4"><p className="m-0 font-medium text-white">{record.counterparty || "Name not identified"}</p><p className="mb-0 mt-1 text-[9px] text-[#777285]">{isBill ? "Supplier" : "Customer"}</p></td>
          <td className="px-3 py-4">{record.reference_number || "—"}</td>
          <td className="px-3 py-4">{formatStatementDate(record.issue_date)}</td>
          <td className="px-3 py-4">{formatStatementDate(record.due_date)}</td>
          <td className="px-3 py-4 font-semibold text-white">{record.total_amount == null ? "—" : formatMoney(record.total_amount, record.currency || currency)}</td>
          <td className="px-3 py-4">{record.status === "confirmed" ? formatMoney(record.amount_paid || 0, record.currency || currency) : "—"}</td>
          <td className="px-3 py-4 font-semibold text-white">{record.status === "confirmed" && balanceDue(record) != null ? formatMoney(balanceDue(record), record.currency || currency) : "—"}</td>
          <td className="px-3 py-4"><span className={`rounded-full px-2.5 py-1 text-[9px] ${tagStyle}`}>{statusLabel}</span></td>
          <td className="max-w-48 truncate px-3 py-4" title={documents.find((doc) => doc.id === record.document_id)?.name || "Source document"}>{documents.find((doc) => doc.id === record.document_id)?.name || "Source document"}</td>
          <td className="px-3 py-3"><div className="flex min-w-48 items-center gap-2">{record.status === "confirmed" && <PaymentControl record={record} onSave={onPayment} busy={busy} />}{isBill && record.status === "confirmed" && record.payment_status !== "paid" && <ReminderControl reminderDate={record.reminder_date} dueDate={record.due_date} busy={busy} onSave={(reminderDate) => onReminder(record, reminderDate)} />}</div></td>
        </tr>;
      })}</tbody>
    </table>
  </div>;
}

function ReminderControl({ reminderDate, dueDate, busy, onSave }) {
  const today = localDateIso();
  const presets = dueDate ? [7, 3, 1, 0].map((days) => ({
    value: offsetIsoDate(dueDate, -days),
    label: days === 0 ? "On due date" : `${days} day${days === 1 ? "" : "s"} before due date`,
  })).filter((item) => item.value >= today) : [];
  const knownPreset = presets.some((item) => item.value === reminderDate);
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState(Boolean(reminderDate && !knownPreset));
  const [selected, setSelected] = useState(reminderDate || presets[0]?.value || "");
  const [customDate, setCustomDate] = useState(knownPreset ? "" : reminderDate || "");
  const save = () => onSave(custom ? customDate : selected);
  return <div className="relative">
    <button type="button" disabled={busy} onClick={() => setOpen((value) => !value)} className="inline-flex items-center gap-1 whitespace-nowrap rounded-lg border border-white/10 px-2.5 py-2 text-[9px] text-[#c5c0d0] hover:bg-white/[0.04] disabled:opacity-50"><FaBell />{reminderDate ? `Reminder ${formatStatementDate(reminderDate)}` : "Remind me"}</button>
    {open && <div className="absolute right-0 top-full z-20 mt-2 w-64 rounded-xl border border-white/10 bg-[#1b1a24] p-3 shadow-xl">
      <p className="mb-2 mt-0 text-[10px] font-semibold text-white">Choose a reminder date</p>
      <label className="block text-[9px] text-[#9995a8]">When<select value={custom ? "custom" : selected} onChange={(event) => { setCustom(event.target.value === "custom"); if (event.target.value !== "custom") setSelected(event.target.value); }} className="mt-1 h-9 w-full rounded-lg border border-white/10 bg-[#111018] px-2 text-[10px] text-white"><option value="" disabled>Select a date</option>{presets.map((item) => <option key={item.value} value={item.value}>{item.label} · {formatStatementDate(item.value)}</option>)}<option value="custom">Choose a date</option></select></label>
      {custom && <label className="mt-2 block text-[9px] text-[#9995a8]">Reminder date<input type="date" min={today} value={customDate} onChange={(event) => setCustomDate(event.target.value)} className="mt-1 h-9 w-full rounded-lg border border-white/10 bg-[#111018] px-2 text-[10px] text-white" /></label>}
      <p className="mb-2 mt-2 text-[9px] leading-4 text-[#777285]">This saves your preference only. In-app reminders will be added later.</p>
      <div className="flex justify-end gap-2"><button type="button" onClick={() => setOpen(false)} className="rounded-lg px-2 py-1.5 text-[9px] text-[#9995a8]">Cancel</button>{reminderDate && <button type="button" disabled={busy} onClick={() => { onSave(null); setOpen(false); setCustom(false); setCustomDate(""); setSelected(presets[0]?.value || ""); }} className="rounded-lg px-2 py-1.5 text-[9px] text-rose-200">Clear</button>}<button type="button" disabled={busy || !(custom ? customDate : selected)} onClick={() => { save(); setOpen(false); }} className="rounded-lg bg-violet-300 px-3 py-1.5 text-[9px] font-bold text-[#171222] disabled:opacity-50">Save</button></div>
    </div>}
  </div>;
}

function Onboarding({ onComplete, busy, notice }) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({
    businessName: "",
    businessType: "",
    industry: "",
    country: "",
    currency: "USD",
    size: "1â€“10 people",
    financialYear: "Januaryâ€“December",
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
    onComplete({ ...profile, completed: true });
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 max-[760px]:px-4">
      <div className="mb-8">
        <p className="mb-2 text-[10px] font-bold tracking-[0.18em] text-violet-300">YOUR FINANCE ANALYST</p>
        <h1 className="m-0 font-display text-3xl font-bold text-white">Letâ€™s get to know your business.</h1>
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
            <p className="mb-6 mt-2 text-xs text-[#9995a8]">Weâ€™ll use this to tailor categories, reporting, and financial periods.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Business name"><input autoFocus value={profile.businessName} onChange={(e) => update("businessName", e.target.value)} placeholder="e.g. Northstar Studio" /></Field>
              <Field label="Finance overview type"><select value={profile.businessType} onChange={(e) => update("businessType", e.target.value)}><option value="">Choose later</option><option value="Retail">Retail</option><option value="Corporate">Corporate</option></select></Field>
              <p className="mb-3 mt-0 text-[10px] text-[#9995a8]">Retail highlights collections and stock data gaps. Corporate highlights payables, budgets and entity reporting.</p>
              <Field label="Industry"><input value={profile.industry} onChange={(e) => update("industry", e.target.value)} placeholder="e.g. Retail, software, consulting" /></Field>
              <Field label="Country"><input value={profile.country} onChange={(e) => update("country", e.target.value)} placeholder="Country or region" /></Field>
              <Field label="Operating currency"><select value={profile.currency} onChange={(e) => update("currency", e.target.value)}>{["USD", "INR", "EUR", "GBP", "CAD", "AUD", "Other"].map((x) => <option key={x}>{x}</option>)}</select></Field>
              <Field label="Business size"><select value={profile.size} onChange={(e) => update("size", e.target.value)}>{["Just me", "1â€“10 people", "11â€“50 people", "51â€“200 people", "201+ people"].map((x) => <option key={x}>{x}</option>)}</select></Field>
              <Field label="Financial year"><select value={profile.financialYear} onChange={(e) => update("financialYear", e.target.value)}>{["Januaryâ€“December", "Aprilâ€“March", "Julyâ€“June", "Octoberâ€“September", "Custom"].map((x) => <option key={x}>{x}</option>)}</select></Field>
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
              Upload invoices, bills, or bank exports now, or skip this step. Text-based PDFs get basic field suggestions to review; other accepted file types are stored for now.
            </p>
            <label className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-violet-300/30 bg-violet-300/[0.035] p-6 text-center hover:bg-violet-300/[0.07]">
              <input className="sr-only" type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.csv,.xlsx" onChange={(e) => update("files", [...profile.files, ...Array.from(e.target.files || [])])} />
              <span className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-violet-300/10 text-xl text-violet-200"><FaUpload /></span>
              <strong className="text-sm">{profile.files.length ? `${profile.files.length} file(s) selected` : "Choose files to add"}</strong>
              <span className="mt-2 text-[11px] text-[#9995a8]">PDF, PNG, JPG, CSV, or XLSX Â· up to 20 MB each</span>
            </label>
            {profile.files.length > 0 && <ul className="mt-4 space-y-1 text-xs text-[#c5c0d0]">{profile.files.map((file, index) => <li key={`${file.name}-${index}`}>{file.name}</li>)}</ul>}
          </>
        )}
        {error && <p role="alert" className="mb-0 mt-4 text-xs text-rose-300">{error}</p>}
        {notice && <p role="status" className="mb-0 mt-4 rounded-lg border border-amber-200/15 bg-amber-200/[0.04] px-3 py-2 text-xs text-amber-100">{notice}</p>}
        <div className="mt-8 flex items-center justify-between border-t border-white/[0.07] pt-5">
          {step > 0 ? <button type="button" onClick={() => { setError(""); setStep(step - 1); }} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-[#c5c0d0] hover:bg-white/[0.04]"><FaChevronLeft /> Back</button> : <span className="text-[10px] text-[#777285]">About 5 minutes Â· You can edit this later</span>}
          <button type="button" disabled={busy} onClick={() => { setError(""); step < 4 ? setStep(step + 1) : finish(); }} className="inline-flex items-center gap-2 rounded-lg bg-violet-300 px-5 py-3 text-xs font-bold text-[#171222] hover:bg-violet-200 disabled:opacity-50">
            {busy ? "Saving workspaceâ€¦" : step === 4 ? "Finish setup" : "Continue"} {!busy && <FaChevronRight />}
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

function getDueStatus(dueDate) {
  if (!dueDate) return "Due date not found";
  const [year, month, day] = dueDate.split("-").map(Number);
  if (!year || !month || !day) return "Due date not found";
  const dueDay = Date.UTC(year, month - 1, day);
  const today = new Date();
  const todayDay = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const daysRemaining = Math.round((dueDay - todayDay) / 86400000);
  if (daysRemaining < 0) return "Overdue";
  if (daysRemaining === 0) return "Due today";
  if (daysRemaining <= 7) return "Due soon";
  return "Upcoming";
}

function buildMonthlyActivity(records, currency) {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    return { month, label: date.toLocaleDateString(undefined, { month: "short" }), invoices: 0, bills: 0 };
  });
  const byMonth = new Map(months.map((item) => [item.month, item]));
  records.forEach((record) => {
    const item = byMonth.get(record.issue_date?.slice(0, 7));
    if (!item || (record.currency || currency) !== currency) return;
    if (record.record_type === "invoice") item.invoices += Number(record.total_amount || 0);
    if (record.record_type === "expense") item.bills += Number(record.total_amount || 0);
  });
  return months;
}

function RecordReviewCard({ record, documentName, onConfirm, onMarkUnsupported, busy }) {
  const hasSuggestion = ["invoice", "expense"].includes(record.record_type);
  const [editingClassification, setEditingClassification] = useState(!hasSuggestion);
  const [draft, setDraft] = useState(() => ({
    record_type: hasSuggestion ? record.record_type : "",
    counterparty: record.counterparty || "",
    reference_number: record.reference_number || "",
    total_amount: record.total_amount ?? "",
  }));
  const recordTypes = [
    { value: "invoice", label: "Customer invoice", hint: "Money owed to you" },
    { value: "expense", label: "Supplier bill / expense", hint: "Money you owe" },
  ];
  return (
    <article className="rounded-xl border border-amber-200/15 bg-amber-200/[0.025] p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div><p className="m-0 text-xs font-semibold text-white">Review this record</p>{documentName && <p className="mb-0 mt-1 text-[10px] text-violet-200/80">Source: {documentName}</p>}<p className="mb-0 mt-1 text-[10px] text-[#9995a8]">Check the extracted details. Nothing affects your totals until you confirm it.</p></div>
        <span className="rounded-full bg-amber-200/10 px-2 py-1 text-[9px] text-amber-100">Needs review</span>
      </div>
      <div className="mb-3" role={!draft.record_type || editingClassification ? "radiogroup" : undefined} aria-label="Record classification">
        {draft.record_type && !editingClassification ? <div className="flex items-center gap-2 text-[10px] text-[#c5c0d0]">
          <span>Suggested: <strong className="text-violet-200">{draft.record_type === "expense" ? "Supplier bill / expense" : "Customer invoice"}</strong></span>
          <button type="button" onClick={() => setEditingClassification(true)} className="text-violet-200 underline underline-offset-2">Change</button>
        </div> : <p className="mb-2 text-[10px] font-medium text-[#c5c0d0]">{draft.record_type ? "Choose a different classification:" : "I couldn’t confidently tell which direction this money goes. Which is it?"}</p>}
        {(!draft.record_type || editingClassification) && <div className="grid gap-2 sm:grid-cols-2">
          {recordTypes.map(({ value, label, hint }) => {
            const active = draft.record_type === value;
            return (
              <button key={value} type="button" role="radio" aria-checked={active} onClick={() => { setDraft((current) => ({ ...current, record_type: value })); setEditingClassification(false); }} className={`flex min-h-12 items-center gap-3 rounded-xl border px-4 text-left text-xs transition ${active ? "border-violet-300/40 bg-violet-300/[0.08] text-white" : "border-white/[0.08] bg-[#111018] text-[#c5c0d0] hover:border-white/20"}`}>
                <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border ${active ? "border-violet-300 bg-violet-300 text-[#171222]" : "border-white/20"}`}>{active && <FaCheck className="text-[10px]" />}</span>
                <span><span className="block font-semibold">{label}</span><span className="mt-0.5 block text-[10px] text-[#9995a8]">{hint}</span></span>
              </button>
            );
          })}
        </div>}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[[draft.record_type === "expense" ? "Supplier" : draft.record_type === "invoice" ? "Customer" : "Customer or supplier", "counterparty", "text"], ["Reference number", "reference_number", "text"], ["Total amount", "total_amount", "number"]].map(([label, key, type]) => (
          <label key={key} className="text-[10px] text-[#9995a8]">{label}<input type={type} step={type === "number" ? "0.01" : undefined} value={draft[key]} onChange={(event) => setDraft((current) => ({ ...current, [key]: event.target.value }))} className="mt-1 block h-9 w-full rounded-lg border border-white/10 bg-[#111018] px-3 text-xs text-white outline-none focus:border-violet-300/40" /></label>
        ))}
        <div className="text-[10px] text-[#9995a8]">
          <span>{draft.record_type === "expense" ? "Bill status" : draft.record_type === "invoice" ? "Invoice status" : "Due status"}</span>
          <div className="mt-1 flex h-9 items-center rounded-lg border border-white/10 bg-[#111018] px-3 text-xs text-white">{getDueStatus(record.due_date)}</div>
          {record.due_date && <span className="mt-1 block text-[9px] text-[#777285]">Based on due date {record.due_date}</span>}
        </div>
      </div>
      {record.review_notes?.length > 0 && <p className="mb-0 mt-3 text-[10px] leading-4 text-amber-100/80">{record.review_notes.join(" ")}</p>}
      <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
        {!draft.record_type && <span className="mr-auto text-[10px] text-amber-100/70">Choose a classification to enable confirmation.</span>}
        <button disabled={busy} type="button" onClick={() => onMarkUnsupported(record.id)} title="For bank or loan statements and other documents that are neither a customer invoice nor a supplier bill. The file is kept, but it stays out of income, expense, and due totals." className="rounded-lg border border-white/10 px-3 py-2 text-[10px] text-[#c5c0d0] hover:bg-white/[0.04] disabled:opacity-50">Mark as statement / unsupported</button>
        <button disabled={busy || !draft.record_type} type="button" onClick={() => onConfirm(record.id, { record_type: draft.record_type, counterparty: draft.counterparty || null, reference_number: draft.reference_number || null, total_amount: draft.total_amount === "" ? null : Number(draft.total_amount) })} className="rounded-lg bg-violet-300 px-3 py-2 text-[10px] font-bold text-[#171222] disabled:opacity-50">Confirm reviewed details</button>
      </div>
      <p className="mb-0 mt-2 text-right text-[10px] text-[#777285]">Statements stay out of income, expense, and due totals.</p>
    </article>
  );
}

export default function FinanceIndex() {
  const initialLoadStarted = useRef(false);
  const [view, setView] = useState("overview");
  const [profile, setProfile] = useState(null);
  const [overview, setOverview] = useState(null);
  const [payrollSummary, setPayrollSummary] = useState(null);
  const [loadingWorkspace, setLoadingWorkspace] = useState(true);
  const [section, setSection] = useState("Overview");
  const [documents, setDocuments] = useState([]);
  const [records, setRecords] = useState([]);
  const [statements, setStatements] = useState([]);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [loadError, setLoadError] = useState("");
  const refreshWorkspace = useCallback(async () => {
    setLoadingWorkspace(true);
    setLoadError("");
    try {
      const workspace = await financeApi.getWorkspace();
      setProfile(fromFinanceWorkspace(workspace));
      const [remoteDocuments, remoteRecords, remoteStatements, remoteOverview, remotePayroll] = await Promise.all([financeApi.listDocuments(), financeApi.listRecords(), financeApi.listStatements(), financeApi.getOverview(), financeApi.payrollOverview().catch(() => null)]);
      setDocuments(remoteDocuments.map(fromFinanceDocument));
      setRecords(remoteRecords);
      setStatements(remoteStatements);
      setOverview(remoteOverview);
      setPayrollSummary(remotePayroll);
    } catch (error) {
      if (error.response?.status === 404) {
        setProfile(null);
        setDocuments([]);
        setRecords([]);
        setStatements([]);
        setOverview(null);
        setPayrollSummary(null);
      } else {
        setLoadError(apiErrorMessage(error, "Could not load your finance workspace."));
      }
    } finally {
      setLoadingWorkspace(false);
    }
  }, []);

  useEffect(() => {
    if (initialLoadStarted.current) return;
    initialLoadStarted.current = true;
    refreshWorkspace();
  }, [refreshWorkspace]);

  const refreshOverview = useCallback(async () => {
    try { setOverview(await financeApi.getOverview()); }
    catch { setOverview(null); }
  }, []);

  const filtered = useMemo(
    () => documents.filter((item) => item.name.toLowerCase().includes(search.toLowerCase())),
    [documents, search],
  );

  async function uploadFiles(fileList) {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    setBusy(true);
    let added = 0;
    const failures = [];
    for (const file of files) {
      try {
        const document = await financeApi.uploadDocument(file);
        setDocuments((current) => [fromFinanceDocument(document), ...current.filter((item) => item.id !== document.id)]);
        added += 1;
        if (document.extension === ".pdf") {
          try {
            const result = await financeApi.processDocument(document.id);
            setDocuments((current) => current.map((item) => item.id === document.id ? { ...item, status: result.status.replaceAll("_", " ") } : item));
            setRecords((current) => [...result.records, ...current.filter((record) => !result.records.some((item) => item.id === record.id))]);
            setStatements(await financeApi.listStatements());
          } catch (error) {
            failures.push(`${file.name}: uploaded, but could not be processed (${apiErrorMessage(error, "processing failed")})`);
          }
        }
      } catch (error) {
        failures.push(`${file.name}: ${apiErrorMessage(error, "upload failed")}`);
      }
    }
    await refreshOverview();
    setNotice(failures.length ? `${added} file(s) added. ${failures.join(" Â· ")}` : `${added} file(s) uploaded to your finance workspace.`);
    setBusy(false);
  }

  async function completeOnboarding(savedProfile) {
    setBusy(true);
    try {
      const workspace = await financeApi.saveWorkspace(toFinanceWorkspace(savedProfile));
      setProfile(fromFinanceWorkspace(workspace));
      await uploadFiles(savedProfile.files);
      await refreshOverview();
    } catch (error) {
      setNotice(apiErrorMessage(error, "Could not save your finance setup."));
    } finally {
      setBusy(false);
    }
  }

  async function changeBusinessType(businessType) {
    if (!profile || businessType === profile.businessType) return;
    setBusy(true);
    try {
      const workspace = await financeApi.saveWorkspace(toFinanceWorkspace({ ...profile, businessType }));
      setProfile(fromFinanceWorkspace(workspace));
      await refreshOverview();
      setNotice(`Finance overview set to ${businessType}. Confirmed record totals were not changed.`);
    } catch (error) {
      setNotice(apiErrorMessage(error, "Could not update your overview type."));
    } finally { setBusy(false); }
  }

  async function deleteDocument(id) {
    try {
      await financeApi.deleteDocument(id);
      setDocuments((current) => current.filter((document) => document.id !== id));
      setRecords((current) => current.filter((record) => record.document_id !== id));
      setStatements((current) => current.filter((statement) => statement.document_id !== id));
      await refreshOverview();
      setNotice("Document deleted from your workspace.");
    } catch (error) {
      setNotice(apiErrorMessage(error, "Could not delete that document."));
    }
  }

  async function recheckPdf(document) {
    setBusy(true);
    try {
      const result = await financeApi.processDocument(document.id);
      setRecords((current) => [
        ...result.records,
        ...current.filter((record) => record.document_id !== document.id),
      ]);
      setDocuments((current) => current.map((item) => item.id === document.id ? { ...item, status: result.status.replaceAll("_", " ") } : item));
      setStatements(await financeApi.listStatements());
      await refreshOverview();
      setNotice(`${result.records.length} finance record(s) found in ${document.name}. Review each record below.`);
    } catch (error) {
      setNotice(apiErrorMessage(error, `Could not recheck ${document.name}.`));
    } finally {
      setBusy(false);
    }
  }

  async function markUnsupported(id) {
    setBusy(true);
    setNotice("");
    try {
      const updated = await financeApi.markRecordUnsupported(id);
      setRecords((current) => current.map((record) => record.id === id ? updated : record));
      await refreshOverview();
      setNotice("Marked as a statement/unsupported document. It stays out of income, expense, and due totals.");
    } catch (error) {
      setNotice(apiErrorMessage(error, "Could not mark that record as unsupported."));
    } finally {
      setBusy(false);
    }
  }

  async function confirmRecord(id, corrections) {
    setBusy(true);
    try {
      const updated = await financeApi.confirmRecord(id, corrections);
      setRecords((current) => current.map((record) => record.id === id ? updated : record));
      setDocuments((current) => current.map((document) => document.id === updated.document_id ? { ...document, status: "confirmed" } : document));
      await refreshOverview();
      setNotice("Finance details confirmed and saved.");
    } catch (error) {
      setNotice(apiErrorMessage(error, "Could not confirm this finance record."));
    } finally {
      setBusy(false);
    }
  }

  async function updatePayment(record, amountPaid) {
    setBusy(true);
    try {
      const updated = await financeApi.updatePayment(record.id, amountPaid);
      setRecords((current) => current.map((item) => item.id === updated.id ? updated : item));
      await refreshOverview();
      setNotice("Total paid to date saved. Remaining balance updated; no bank payment was initiated.");
      return true;
    } catch (error) {
      setNotice(apiErrorMessage(error, "Could not update payment status."));
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function saveReminder(record, reminderDate) {
    setBusy(true);
    try {
      const updated = await financeApi.updateReminder(record.id, reminderDate);
      setRecords((current) => current.map((item) => item.id === updated.id ? updated : item));
      setNotice(reminderDate ? `Reminder preference saved for ${formatStatementDate(reminderDate)}. No notification is sent yet.` : "Reminder preference cleared.");
    } catch (error) {
      setNotice(apiErrorMessage(error, "Could not save that reminder preference."));
    } finally {
      setBusy(false);
    }
  }

  async function downloadDocument(document) {
    try {
      const blob = await financeApi.downloadDocument(document.id);
      const url = URL.createObjectURL(blob);
      const link = window.document.createElement("a");
      link.href = url;
      link.download = document.name;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      setNotice(apiErrorMessage(error, "Could not download that document."));
    }
  }

  if (loadingWorkspace) {
    return <AppLayout section="My AI team" current="Finance Analyst"><div className="mx-auto max-w-3xl px-6 py-16 text-center text-sm text-[#9995a8]">Loading your finance workspace...</div></AppLayout>;
  }

  if (loadError) {
    return <AppLayout section="My AI team" current="Finance Analyst"><div className="mx-auto max-w-3xl px-6 py-16 text-center"><p role="alert" className="text-sm text-rose-200">{loadError}</p><button type="button" onClick={refreshWorkspace} className="mt-3 rounded-lg bg-violet-300 px-4 py-2 text-xs font-bold text-[#171222]">Try again</button></div></AppLayout>;
  }

  if (!profile?.completed) {
    return <AppLayout section="My AI team" current="Finance Analyst"><Onboarding onComplete={completeOnboarding} busy={busy} notice={notice} /></AppLayout>;
  }

  const currency = profile.currency || "USD";
  const confirmedRecords = records.filter((record) => record.status === "confirmed");
  const invoices = confirmedRecords.filter((record) => record.record_type === "invoice");
  const bills = confirmedRecords.filter((record) => record.record_type === "expense");
  const openInvoices = invoices.filter((record) => balanceDue(record) > 0);
  const openBills = bills.filter((record) => balanceDue(record) > 0);
  const paidBills = bills.filter((record) => record.payment_status === "paid");
  const dueBills = [...openBills].sort((a, b) => (a.due_date || "9999").localeCompare(b.due_date || "9999"));
  const dueInvoices = [...openInvoices].sort((a, b) => (a.due_date || "9999").localeCompare(b.due_date || "9999"));
  const sumInWorkspaceCurrency = (items, remaining = false) => items.reduce((total, record) => (
    (record.currency || currency).toUpperCase() === currency.toUpperCase() ? total + Number(remaining ? balanceDue(record) || 0 : record.total_amount || 0) : total
  ), 0);
  const reviewCount = records.filter((record) => record.status === "needs_review").length;
  const overdueBills = openBills.filter((record) => getDueStatus(record.due_date) === "Overdue");
  const chartMonths = buildMonthlyActivity(confirmedRecords, currency);
  const chartMaximum = Math.max(1, ...chartMonths.flatMap((item) => [item.invoices, item.bills]));

  const importButton = (
    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-violet-300 px-4 py-3 text-[11px] font-bold text-[#171222] hover:bg-violet-200">
      <input className="sr-only" type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.csv,.xlsx" disabled={busy} onChange={(e) => { uploadFiles(e.target.files); e.target.value = ""; }} />
      <FaPlus /> Import files
    </label>
  );

  const openChat = () => { void refreshWorkspace(); setView("chat"); };
  const activeView = view === "onboarding" ? "chat" : view;

  return (
    <AppLayout section="My AI team" current="Finance Analyst" contentClassName={view === "chat" ? "flex min-h-0 flex-1 flex-col overflow-hidden" : undefined}>
      <nav className="flex shrink-0 gap-1 overflow-x-auto border-b border-white/[0.08] px-7 pt-6 max-[760px]:px-4" aria-label="Finance Analyst views">
        {VIEWS.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setView(id)} aria-current={activeView === id ? "page" : undefined} className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-[11px] transition ${activeView === id ? "border-violet-300 text-violet-200" : "border-transparent text-[#9995a8] hover:text-white"}`}><Icon className="text-[10px]" />{label}</button>)}
      </nav>
      {view === "onboarding" && (
        <div className="mx-auto max-w-[1450px] px-7 py-7 max-[760px]:px-4">
          <OnboardingWizard onStartChatting={openChat} />
        </div>
      )}
      {view === "chat" && (
        <div className="mx-auto flex min-h-0 w-full max-w-[1450px] flex-1 flex-col px-7 py-4 max-[760px]:px-4">
          <ChatInterface onProfileComplete={() => setView("onboarding")} />
        </div>
      )}
      {view === "overview" && (
        <>
        <div className="mx-auto max-w-[1450px] px-7 py-7 max-[760px]:px-4">
        <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 flex items-center gap-2 text-[9px] font-bold tracking-[0.17em] text-violet-300"><span className="h-px w-4 bg-violet-300" /> FINANCE WORKSPACE</p>
            <h1 className="m-0 font-display text-3xl font-bold tracking-tight text-white">{profile.businessName}</h1>
            <p className="mb-0 mt-2 text-xs text-[#9995a8]">Your Finance Analyst AI | {profile.currency} | {profile.businessType || profile.industry || "Business finance"}</p>
          </div>
          <div className="flex flex-wrap items-end gap-3"><label className="text-[10px] text-[#9995a8]">Overview type<select aria-label="Finance overview type" value={profile.businessType || ""} disabled={busy} onChange={(event) => void changeBusinessType(event.target.value)} className="mt-1 block h-11 rounded-lg border border-white/10 bg-[#171620] px-3 text-xs text-white"><option value="" disabled>Choose a type</option><option value="Retail">Retail</option><option value="Corporate">Corporate</option></select></label>{importButton}</div>
        </header>
        {notice && <p role="status" className="mb-4 rounded-lg border border-violet-300/20 bg-violet-300/[0.06] px-4 py-3 text-xs text-violet-100">{notice}</p>}
        <nav className="mb-6 flex gap-1 overflow-x-auto border-b border-white/[0.08]" aria-label="Finance workspace">
          {SECTIONS.map(({ id, icon: Icon }) => <button key={id} type="button" onClick={() => setSection(id)} className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-[11px] transition ${section === id ? "border-violet-300 text-violet-200" : "border-transparent text-[#9995a8] hover:text-white"}`}><Icon className="text-[10px]" />{id}</button>)}
        </nav>
        {section === "Overview" && <>
          <div className="mb-5"><p className="mb-1 text-[9px] font-bold tracking-[0.16em] text-violet-300">CONFIRMED RECORDS</p><h2 className="m-0 text-base font-semibold">Your finance at a glance</h2><p className="mb-0 mt-1 text-[10px] text-[#777285]">Open totals are remaining balances after recorded payments in {currency}; other currencies are excluded. Payment amounts are user-entered and not bank reconciled. Disputes are not tracked.</p></div>
          {(reviewCount > 0 || overdueBills.length > 0) && <section className="mb-5 rounded-2xl border border-amber-200/15 bg-amber-200/[0.035] p-4"><header className="mb-3 flex items-center gap-2"><FaInfoCircle className="text-amber-200" /><h2 className="m-0 text-sm font-semibold text-white">Needs attention</h2></header><div className="grid gap-2 sm:grid-cols-2">{reviewCount > 0 && <button type="button" onClick={() => setSection("Documents")} className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-[#111018]/70 px-4 py-3 text-left text-[11px] text-amber-100"><span>{reviewCount} record{reviewCount === 1 ? "" : "s"} need review</span><span>Review <FaArrowRight className="ml-1 inline" /></span></button>}{overdueBills.length > 0 && <button type="button" onClick={() => setSection("Bills")} className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-[#111018]/70 px-4 py-3 text-left text-[11px] text-rose-200"><span>{overdueBills.length} overdue bill{overdueBills.length === 1 ? "" : "s"} · {formatMoney(sumInWorkspaceCurrency(overdueBills, true), currency)}</span><span>View bills <FaArrowRight className="ml-1 inline" /></span></button>}</div></section>}
          <section className="mb-5 grid grid-cols-4 gap-3 max-[1050px]:grid-cols-2 max-[540px]:grid-cols-1">
            <Metric label="To collect" value={formatMoney(sumInWorkspaceCurrency(openInvoices, true), currency)} note={`${openInvoices.length} customer invoice(s) with a balance`} icon={FaHandHoldingUsd} />
            <Metric label="Bills to pay" value={formatMoney(sumInWorkspaceCurrency(openBills, true), currency)} note={`${openBills.length} supplier bill(s) with a balance`} icon={FaMoneyBillWave} />
            <Metric label="Overdue bills" value={formatMoney(sumInWorkspaceCurrency(overdueBills, true), currency)} note={`${overdueBills.length} past due`} icon={FaClock} />
            <Metric label="Bills marked paid" value={formatMoney(sumInWorkspaceCurrency(paidBills), currency)} note={`${paidBills.length} bill(s) paid in full`} icon={FaCheckCircle} />
          </section>
          <BusinessFocus focus={overview?.focus} currency={currency} onSection={setSection} />
          <button type="button" onClick={() => setSection("Payroll")} className="mb-5 flex w-full flex-wrap items-center justify-between gap-4 rounded-2xl border border-violet-300/20 bg-violet-300/[0.04] p-5 text-left hover:border-violet-300/40"><div><p className="m-0 text-[9px] font-bold uppercase tracking-[0.15em] text-violet-200">Employee costs</p><h2 className="mb-0 mt-2 text-sm font-semibold text-white">Payroll & payslips</h2><p className="mb-0 mt-1 text-[11px] text-[#9995a8]">{payrollSummary ? `${payrollSummary.employee_count} active employee(s) · ${payrollSummary.draft_payslips} draft(s) · ${payrollSummary.finalized_unpaid_payslips} finalized unpaid` : "Add employees, review pay and leave, and prepare payslips."}</p></div><span className="text-xs font-semibold text-violet-200">Open payroll <FaArrowRight className="ml-1 inline" /></span></button>
          {reviewCount > 0 && <section className="mb-5 space-y-3"><h2 className="m-0 text-sm font-semibold">Needs your review</h2>{records.filter((record) => record.status === "needs_review").map((record) => <RecordReviewCard key={record.id} record={record} documentName={documents.find((document) => document.id === record.document_id)?.name} onConfirm={confirmRecord} onMarkUnsupported={markUnsupported} busy={busy} />)}</section>}
          <section className="mb-5 grid gap-4 xl:grid-cols-[1.4fr_1fr]">
            <article className="min-w-0 rounded-2xl border border-white/[0.07] bg-[#171620] p-5"><header className="mb-4 flex items-center justify-between gap-3"><div><h2 className="m-0 text-sm font-semibold">Bills coming up</h2><p className="mb-0 mt-1 text-[10px] text-[#777285]">Supplier bills with a balance, ordered by due date</p></div><button type="button" onClick={() => setSection("Bills")} className="text-[10px] text-violet-200">All bills <FaArrowRight className="ml-1 inline" /></button></header>
              {dueBills.length ? <div className="divide-y divide-white/[0.06]">{dueBills.slice(0, 5).map((record) => <div key={record.id} className="flex flex-wrap items-center gap-3 py-3"><div className="min-w-0 flex-1"><p className="m-0 truncate text-xs font-medium text-white">{record.counterparty || "Supplier not identified"}</p><p className="mb-0 mt-1 text-[9px] text-[#777285]">{record.reference_number || "No reference"} · due {formatStatementDate(record.due_date)}</p></div><span className="rounded-full bg-white/[0.05] px-2 py-1 text-[9px] text-[#c5c0d0]">{getDueStatus(record.due_date)}</span><strong className="text-xs text-white">{balanceDue(record) == null ? "Amount missing" : formatMoney(balanceDue(record), record.currency || currency)}</strong><ReminderControl reminderDate={record.reminder_date} dueDate={record.due_date} busy={busy} onSave={(reminderDate) => saveReminder(record, reminderDate)} /></div>)}</div> : <p className="m-0 rounded-lg border border-dashed border-white/10 p-5 text-xs text-[#9995a8]">No confirmed bills with a remaining balance. Supplier bills appear here after review.</p>}
            </article>
            <article className="min-w-0 rounded-2xl border border-white/[0.07] bg-[#171620] p-5"><header className="mb-4 flex items-center justify-between gap-3"><div><h2 className="m-0 text-sm font-semibold">Customer invoices to collect</h2><p className="mb-0 mt-1 text-[10px] text-[#777285]">Amounts customers owe you</p></div><button type="button" onClick={() => setSection("Receivables")} className="text-[10px] text-violet-200">Receivables <FaArrowRight className="ml-1 inline" /></button></header>
              {dueInvoices.length ? <div className="divide-y divide-white/[0.06]">{dueInvoices.slice(0, 5).map((record) => <div key={record.id} className="flex items-center gap-3 py-3"><div className="min-w-0 flex-1"><p className="m-0 truncate text-xs font-medium text-white">{record.counterparty || "Customer not identified"}</p><p className="mb-0 mt-1 text-[9px] text-[#777285]">{record.reference_number || "No reference"} · due {formatStatementDate(record.due_date)}</p></div><span className={`rounded-full px-2 py-1 text-[9px] ${getDueStatus(record.due_date) === "Overdue" ? "bg-rose-300/10 text-rose-200" : "bg-violet-300/10 text-violet-200"}`}>{getDueStatus(record.due_date)}</span><strong className="text-xs text-white">{balanceDue(record) == null ? "—" : formatMoney(balanceDue(record), record.currency || currency)}</strong></div>)}</div> : <p className="m-0 rounded-lg border border-dashed border-white/10 p-5 text-xs text-[#9995a8]">No customer invoices with a remaining balance.</p>}
            </article>
          </section>
          <section className="mb-5 rounded-2xl border border-white/[0.07] bg-[#171620] p-5"><div className="mb-5"><h2 className="m-0 text-sm font-semibold">Invoices and bills by month</h2><p className="mb-0 mt-1 text-[10px] text-[#777285]">Confirmed document amounts grouped by issue date, not cash movement.</p></div><div className="grid grid-cols-6 gap-3 max-[700px]:grid-cols-3">{chartMonths.map((item) => <div key={item.month} className="min-w-0"><div className="flex h-28 items-end justify-center gap-1 rounded-lg bg-[#111018] px-2 pb-2 pt-3"><div title={`Invoices ${formatMoney(item.invoices, currency)}`} className="w-4 rounded-t bg-violet-300" style={{ height: `${Math.max(item.invoices ? 8 : 0, (item.invoices / chartMaximum) * 100)}%` }} /><div title={`Bills ${formatMoney(item.bills, currency)}`} className="w-4 rounded-t bg-sky-300/70" style={{ height: `${Math.max(item.bills ? 8 : 0, (item.bills / chartMaximum) * 100)}%` }} /></div><p className="mb-0 mt-2 truncate text-center text-[9px] text-[#9995a8]">{item.label}</p></div>)}</div><div className="mt-4 flex flex-wrap gap-4 text-[9px] text-[#9995a8]"><span><i className="mr-1.5 inline-block h-2 w-2 rounded-sm bg-violet-300" />Customer invoices</span><span><i className="mr-1.5 inline-block h-2 w-2 rounded-sm bg-sky-300/70" />Supplier bills</span></div></section>
          <section className="rounded-2xl border border-white/[0.07] bg-[#171620] p-5"><header className="mb-3 flex items-center justify-between"><div><h2 className="m-0 text-sm font-semibold">Recently paid bills</h2><p className="mb-0 mt-1 text-[10px] text-[#777285]">Payments you marked as complete</p></div><button type="button" onClick={() => setSection("Bills")} className="text-[10px] text-violet-200">View bills <FaArrowRight className="ml-1 inline" /></button></header>{paidBills.length ? <div className="divide-y divide-white/[0.06]">{[...paidBills].sort((a, b) => (b.paid_at || "").localeCompare(a.paid_at || "")).slice(0, 4).map((record) => <div key={record.id} className="flex items-center gap-3 py-3"><span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-300/10 text-emerald-200"><FaCheck /></span><div className="min-w-0 flex-1"><p className="m-0 truncate text-xs text-white">{record.counterparty || "Supplier not identified"}</p><p className="mb-0 mt-1 text-[9px] text-[#777285]">{record.reference_number || "Supplier bill"} · paid {formatStatementDate(record.paid_at)}</p></div><strong className="text-xs text-white">{record.total_amount == null ? "—" : formatMoney(record.total_amount, record.currency || currency)}</strong></div>)}</div> : <p className="m-0 rounded-lg border border-dashed border-white/10 p-5 text-xs text-[#9995a8]">Bills you mark as paid appear here. The app does not initiate payment.</p>}</section>
        </>}
        {section === "Payroll" && <PayrollPanel currency={currency} businessType={profile.businessType || "Business"} country={profile.country || ""} onChange={setPayrollSummary} />}
        {section === "Insights" && <FinanceInsights currency={currency} />}
        {section === "Plugins" && <FinancePluginsPanel />}
        {section === "Documents" && <section className="rounded-2xl border border-white/[0.07] bg-[#171620] p-5">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><h2 className="m-0 text-base font-semibold">Documents & imports</h2><p className="mb-0 mt-1 text-xs text-[#9995a8]">Invoices, bills, receipts, and transaction files you add.</p></div><label className="flex h-9 w-64 items-center gap-2 rounded-lg border border-white/[0.08] bg-[#111018] px-3 text-[10px] text-[#777285]"><FaSearch /><input aria-label="Search imported documents" className="min-w-0 flex-1 bg-transparent text-white outline-none" placeholder="Search files..." value={search} onChange={(e) => setSearch(e.target.value)} /></label></div>
          {filtered.length ? <div className="divide-y divide-white/[0.06]">{filtered.map((doc) => { const docRecords = records.filter((record) => record.document_id === doc.id); return <div key={doc.id} className="flex flex-wrap items-center gap-3 py-3"><span className="grid h-9 w-9 place-items-center rounded-lg bg-violet-300/10 text-violet-200"><FaFileAlt /></span><div className="min-w-0 flex-1"><p className="m-0 truncate text-xs text-white">{doc.name}</p><p className="mb-0 mt-1 text-[10px] text-[#777285]">{doc.kind} · added {doc.added} · {formatFileSize(doc.sizeBytes)}</p></div><span className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[9px] text-[#c5c0d0]">{doc.status}</span>{doc.extension === ".pdf" && docRecords.length > 0 && <button type="button" disabled={busy} onClick={() => recheckPdf(doc)} className="rounded-lg border border-violet-300/20 px-3 py-2 text-[10px] text-violet-200 hover:bg-violet-300/[0.06] disabled:opacity-50">Recheck PDF for missing records</button>}<button type="button" onClick={() => downloadDocument(doc)} className="grid h-8 w-8 place-items-center rounded-lg text-[#c5c0d0] hover:bg-white/[0.06]" aria-label={`Download ${doc.name}`} title="Download"><FaDownload /></button><button type="button" onClick={() => deleteDocument(doc.id)} className="grid h-8 w-8 place-items-center rounded-lg text-rose-200 hover:bg-rose-400/10" aria-label={`Delete ${doc.name}`} title="Delete"><FaTrash /></button></div>; })}</div> : <EmptyState title={search ? "No matching files" : "No documents yet"} copy={search ? "Try another file name." : "Add a batch of invoices, bills, receipts, or bank exports to your workspace."} action={importButton} />}
        </section>}
        {section === "Receivables" && <section className="rounded-2xl border border-white/[0.07] bg-[#171620] p-5 sm:p-6">
          <header className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><p className="mb-1 text-[9px] font-bold tracking-[0.16em] text-violet-300">MONEY OWED TO YOU</p><h2 className="m-0 text-base font-semibold">Customer invoices</h2><p className="mb-0 mt-1 text-xs text-[#9995a8]">Receivables are invoices your customers owe your business.</p></div><div className="text-right"><p className="m-0 text-[9px] text-[#777285]">Outstanding amount</p><strong className="text-lg text-white">{formatMoney(sumInWorkspaceCurrency(openInvoices, true), currency)}</strong></div></header>
          <FinanceRecordList records={records} documents={documents} type="invoice" currency={currency} onPayment={updatePayment} onReminder={saveReminder} busy={busy} emptyAction={importButton} />
        </section>}
        {section === "Bills" && <section className="rounded-2xl border border-white/[0.07] bg-[#171620] p-5 sm:p-6">
          <header className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><p className="mb-1 text-[9px] font-bold tracking-[0.16em] text-sky-200">MONEY YOU OWE</p><h2 className="m-0 text-base font-semibold">Supplier bills</h2><p className="mb-0 mt-1 text-xs text-[#9995a8]">Bills are invoices from suppliers that your business needs to pay.</p></div><div className="flex gap-5 text-right"><div><p className="m-0 text-[9px] text-[#777285]">Balance due</p><strong className="text-sm text-white">{formatMoney(sumInWorkspaceCurrency(openBills, true), currency)}</strong></div><div><p className="m-0 text-[9px] text-[#777285]">Marked paid</p><strong className="text-sm text-emerald-200">{formatMoney(sumInWorkspaceCurrency(paidBills), currency)}</strong></div></div></header>
          <FinanceRecordList records={records} documents={documents} type="expense" currency={currency} onPayment={updatePayment} onReminder={saveReminder} busy={busy} emptyAction={importButton} />
        </section>}
        {section === "Statements" && <section className="rounded-2xl border border-white/[0.07] bg-[#171620] p-5">
          <div className="mb-5"><h2 className="m-0 text-base font-semibold">Bank & account statements</h2><p className="mb-0 mt-1 text-xs text-[#9995a8]">Statement details and source transactions are saved separately from invoice and expense totals.</p></div>
          {statements.length ? <div className="overflow-x-auto"><table className="w-full min-w-[1080px] border-collapse text-left"><thead><tr className="border-b border-white/[0.08] text-[10px] text-[#777285]"><th className="px-3 py-3 font-medium">Statement / file</th><th className="px-3 py-3 font-medium">Account holder</th><th className="px-3 py-3 font-medium">Account number</th><th className="px-3 py-3 font-medium">Statement date</th><th className="px-3 py-3 font-medium">Period</th><th className="px-3 py-3 font-medium">Saved transactions</th><th className="px-3 py-3 font-medium">Status</th><th className="px-3 py-3 font-medium">Action</th></tr></thead><tbody>{statements.map((statement) => <tr key={statement.id} className="border-b border-white/[0.05] text-[11px] text-[#c5c0d0]"><td className="px-3 py-4"><p className="m-0 max-w-64 truncate text-white" title={statement.document_name}>{statement.document_name}</p><p className="mb-0 mt-1">{statement.institution_name || "Institution not identified"}</p></td><td className="px-3 py-4">{statement.account_holder || "Name not identified"}</td><td className="px-3 py-4 font-mono">{statement.account_number || "Not identified"}</td><td className="px-3 py-4">{formatStatementDate(statement.statement_date)}</td><td className="px-3 py-4">{statement.period_start || statement.period_end ? `${formatStatementDate(statement.period_start)} - ${formatStatementDate(statement.period_end)}` : "Not identified"}</td><td className="px-3 py-4">{statement.transaction_count}</td><td className="px-3 py-4"><span className={`rounded-full px-2.5 py-1 text-[9px] ${statement.status === "needs_recheck" ? "bg-amber-200/10 text-amber-100" : "bg-sky-300/10 text-sky-200"}`}>{statement.status === "needs_recheck" ? "Needs recheck" : "Saved statement"}</span></td><td className="px-3 py-3">{statement.status === "needs_recheck" && <button type="button" disabled={busy} onClick={() => { const document = documents.find((item) => item.id === statement.document_id); if (document) recheckPdf(document); }} className="whitespace-nowrap rounded-lg border border-white/10 px-3 py-2 text-[9px] text-violet-200 hover:bg-white/[0.04] disabled:opacity-50">Recheck PDF</button>}</td></tr>)}</tbody></table></div> : <EmptyState title="No statements saved yet" copy="Text-based bank and account statements are listed here after extraction. Recheck an older PDF to add its statement details." action={<button type="button" onClick={() => setSection("Documents")} className="mt-4 rounded-lg border border-white/10 px-4 py-2.5 text-[10px] text-violet-200 hover:bg-white/[0.04]">Open documents <FaArrowRight className="ml-2 inline" /></button>} />}
        </section>}
        {section === "About us" && <section className="rounded-2xl border border-white/[0.07] bg-[#171620] p-6 sm:p-8">
          <div className="mb-6 flex items-start gap-4"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-violet-300/10 text-xl text-violet-200"><FaBuilding /></span><div><p className="mb-1 text-[9px] font-bold tracking-[0.16em] text-violet-300">ABOUT THE FINANCE ANALYST</p><h2 className="m-0 font-display text-xl font-semibold">Clear finance records, with you in control.</h2><p className="mb-0 mt-2 max-w-3xl text-xs leading-5 text-[#9995a8]">ZengenAI Finance Analyst organizes the invoices, supplier bills, and statements you upload so you can review what customers owe and what your business needs to pay.</p></div></div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <article className="rounded-xl border border-white/[0.07] bg-[#111018] p-4"><h3 className="m-0 text-xs font-semibold text-white">How it works</h3><ol className="mb-0 mt-3 space-y-2 pl-4 text-[10px] leading-4 text-[#9995a8]"><li>Upload a finance document.</li><li>Review the extracted values and classify it.</li><li>Confirmed invoices and bills appear in their own lists and dashboard totals.</li></ol></article>
            <article className="rounded-xl border border-white/[0.07] bg-[#111018] p-4"><h3 className="m-0 text-xs font-semibold text-white">Your finance workspace</h3><p className="mb-0 mt-3 text-[10px] leading-5 text-[#9995a8]">Business: <strong className="text-[#ddd8e8]">{profile.businessName}</strong><br />Industry: <strong className="text-[#ddd8e8]">{profile.industry || "Not set"}</strong><br />Country: <strong className="text-[#ddd8e8]">{profile.country || "Not set"}</strong><br />Currency: <strong className="text-[#ddd8e8]">{currency}</strong></p></article>
            <article className="rounded-xl border border-white/[0.07] bg-[#111018] p-4"><h3 className="m-0 text-xs font-semibold text-white">Current limits</h3><ul className="mb-0 mt-3 space-y-2 pl-4 text-[10px] leading-4 text-[#9995a8]"><li>Invoice and bill totals do not establish recognized revenue, final profit, or available cash.</li><li>Cumulative partial payments can be recorded, but disputes and bank reconciliation are not tracked yet.</li><li>Scanned image-only PDFs need OCR before their text can be read.</li><li>It does not initiate or authorize payments. Reminder dates are saved preferences; notifications are not sent yet.</li></ul></article>
          </div>
        </section>}
        {section !== "Overview" && section !== "Documents" && section !== "Plugins" && section !== "Statements" && section !== "Receivables" && section !== "Bills" && section !== "Insights" && section !== "About us" && <section className="rounded-2xl border border-white/[0.07] bg-[#171620] p-6">
          <p className="mb-2 text-[9px] font-bold tracking-[0.16em] text-violet-300">FINANCE WORKSPACE</p>
          <h2 className="m-0 font-display text-xl font-semibold">{section}</h2>
          <p className="mb-5 mt-2 max-w-2xl text-xs leading-5 text-[#9995a8]">{sectionCopy(section)}</p>
          {section === "Finance rules" ? <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <Rule label="Business name" value={profile.businessName} />
            <Rule label="Overview type" value={profile.businessType || "Not selected"} />
            <Rule label="Industry" value={profile.industry || "Not set"} />
            <Rule label="Country" value={profile.country || "Not set"} />
            <Rule label="Operating currency" value={profile.currency} />
            <Rule label="Business size" value={profile.size || "Not set"} />
            <Rule label="Financial year" value={profile.financialYear || "Not set"} />
            <Rule label="Customer payment terms" value={profile.paymentTerms || "Not set"} />
            <Rule label="Bill review threshold" value={profile.approvalLimit ? `${profile.currency} ${profile.approvalLimit}` : "Not set"} />
            <Rule label="Review owner" value={profile.reviewer || "Not assigned"} />
            <Rule label="Expense categories" value={profile.categories || "Not set"} />
            <Rule label="Finance workflows" value={profile.workflows?.length ? profile.workflows.join(" · ") : "Not selected"} />
            <Rule label="Information sources" value={profile.sources?.length ? profile.sources.join(" · ") : "Not selected"} />
            <button type="button" onClick={() => setProfile(null)} className="mt-2 w-fit rounded-lg border border-white/10 px-4 py-2.5 text-[10px] text-[#c5c0d0] hover:bg-white/[0.04]">Edit onboarding answers</button>
          </div> : <EmptyState title={`No ${section.toLowerCase()} yet`} copy={sectionCopy(section)} action={<button type="button" onClick={() => setSection("Documents")} className="mt-4 rounded-lg border border-white/10 px-4 py-2.5 text-[10px] text-violet-200 hover:bg-white/[0.04]">Go to documents <FaArrowRight className="ml-2 inline" /></button>} />}
        </section>}
        <p className="mb-0 mt-5 flex items-center gap-2 text-[10px] text-[#777285]"><FaCheck className="text-emerald-300" /> Finance workspace and files are loaded from your signed-in account.</p>
      </div>
      <FinanceCompanionTools />
        </>
      )}
    </AppLayout>
  );
}

function Rule({ label, value }) {
  return <div className="rounded-xl border border-white/[0.07] bg-[#111018] p-4"><p className="mb-1 text-[10px] text-[#777285]">{label}</p><p className="mb-0 text-xs text-white">{value}</p></div>;
}

function formatStatementDate(value) {
  if (!value) return "Not identified";
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString();
}
function formatFileSize(bytes = 0) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function sectionCopy(section) {
  const copy = {
    Receivables: "Track customer invoices, outstanding balances, due dates, and follow-up drafts. Payment status should be backed by imported records or an authorized confirmation.",
    Bills: "Organize supplier bills, due dates, approval thresholds, and recurring costs. Payment execution always requires your authorization.",
    Reconciliation: "Bring in bank transaction exports to review possible matches against invoices, bills, and recorded payments.",
    Insights: "Explore user-supplied break-even and gross-margin calculations, and ask Finance AI about confirmed invoice and bill records.",
    Reports: "Prepare monthly summaries, outstanding balance reports, vendor expenses, and downloadable finance reports.",
    "Finance rules": "Review the preferences you set during onboarding. Thresholds help flag items for review; they do not authorize financial actions.",
  };
  return copy[section] || "Keep your finance work organized in one place.";
}



