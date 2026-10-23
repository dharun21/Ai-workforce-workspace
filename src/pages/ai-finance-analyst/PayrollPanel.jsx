import { useCallback, useEffect, useMemo, useState } from "react";
import { financeApi } from "../../api/finance";
import { apiErrorMessage } from "../../api/client";

const field = "mt-1 block w-full rounded-lg border border-white/10 bg-[#111018] px-3 py-2.5 text-xs text-white outline-none focus:border-violet-300/60";
const button = "rounded-lg border border-white/10 px-3 py-2 text-[11px] font-semibold text-violet-200 hover:bg-white/[0.05] disabled:opacity-40";
const action = "rounded-lg bg-violet-300 px-4 py-2.5 text-[11px] font-bold text-[#171222] hover:bg-violet-200 disabled:opacity-40";
const card = "rounded-2xl border border-white/[0.08] bg-[#171620] p-5";
const today = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
const monthStart = () => `${today().slice(0, 7)}-01`;
const amount = (value, currency) => {
  try { return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(Number(value || 0)); }
  catch { return `${currency} ${Number(value || 0).toFixed(2)}`; }
};
const employeeBlank = (currency) => ({ employee_code: "", full_name: "", email: "", department: "", pay_type: "monthly", monthly_salary: "", hourly_rate: "", currency, annual_paid_leave_days: "0", active: true });
const slipBlank = () => ({ employee_id: "", period_start: monthStart(), period_end: today(), regular_hours: "", base_pay: "", overtime_pay: "0", bonus_pay: "0", allowances: "0", leave_deduction: "0", employee_tax: "0", other_deductions: "0", employer_contributions: "0", reimbursement_ids: [], note: "" });

function FormField({ label, children }) {
  return <label className="block min-w-0 text-[11px] text-[#aaa5b9]">{label}{children}</label>;
}

export default function PayrollPanel({ currency = "USD", businessType = "Retail", country = "", onChange }) {
  const [tab, setTab] = useState("Payslips");
  const [employees, setEmployees] = useState([]);
  const [leave, setLeave] = useState([]);
  const [claims, setClaims] = useState([]);
  const [slips, setSlips] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [summary, setSummary] = useState(null);
  const [employeeDraft, setEmployeeDraft] = useState(null);
  const [leaveDraft, setLeaveDraft] = useState(null);
  const [claimDraft, setClaimDraft] = useState(null);
  const [taxDraft, setTaxDraft] = useState(null);
  const [slipDraft, setSlipDraft] = useState(null);
  const [reviewed, setReviewed] = useState({});
  const [taxReviewed, setTaxReviewed] = useState({});
  const [paymentDraft, setPaymentDraft] = useState(null);
  const [claimPaymentDraft, setClaimPaymentDraft] = useState(null);
  const [taxPaymentDraft, setTaxPaymentDraft] = useState(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    const [e, l, c, p, t, s] = await Promise.all([
      financeApi.listEmployees(), financeApi.listLeave(), financeApi.listReimbursements(),
      financeApi.listPayslips(), financeApi.listGovernmentTaxes(), financeApi.payrollOverview(),
    ]);
    setEmployees(e); setLeave(l); setClaims(c); setSlips(p); setTaxes(t); setSummary(s);
    onChange?.(s);
  }, [onChange]);
  useEffect(() => {
    let alive = true;
    load().catch((e) => { if (alive) setError(apiErrorMessage(e, "Could not load payroll.")); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [load]);

  async function save(work, message) {
    setBusy(true); setError(""); setNotice("");
    try { await work(); await load(); setNotice(message); return true; }
    catch (e) { setError(apiErrorMessage(e, "Could not save this payroll item.")); return false; }
    finally { setBusy(false); }
  }

  const activeEmployees = employees.filter((person) => person.active);
  const selectedEmployee = employees.find((person) => person.id === slipDraft?.employee_id);
  const availableClaims = claims.filter((claim) => claim.employee_id === slipDraft?.employee_id && claim.currency === selectedEmployee?.currency && claim.status === "approved" && !claim.payslip_id);
  const selectedClaims = availableClaims.filter((claim) => slipDraft?.reimbursement_ids.includes(claim.id));
  const preview = useMemo(() => {
    if (!slipDraft || !selectedEmployee) return null;
    const base = selectedEmployee.pay_type === "hourly"
      ? Number(slipDraft.regular_hours || 0) * Number(selectedEmployee.hourly_rate || 0)
      : Number(slipDraft.base_pay || selectedEmployee.monthly_salary || 0);
    const insideGross = selectedClaims.filter((claim) => claim.payroll_treatment === "inside_gross").reduce((sum, claim) => sum + Number(claim.amount), 0);
    const outsideGross = selectedClaims.filter((claim) => claim.payroll_treatment === "outside_gross").reduce((sum, claim) => sum + Number(claim.amount), 0);
    const gross = base + insideGross + Number(slipDraft.overtime_pay || 0) + Number(slipDraft.bonus_pay || 0)
      + Number(slipDraft.allowances || 0) - Number(slipDraft.leave_deduction || 0);
    const net = gross - Number(slipDraft.employee_tax || 0) - Number(slipDraft.other_deductions || 0);
    return { gross, net, payout: net + outsideGross, cost: gross + Number(slipDraft.employer_contributions || 0) + outsideGross };
  }, [selectedEmployee, selectedClaims, slipDraft]);

  async function download(slip) {
    setBusy(true); setError("");
    try {
      const blob = await financeApi.downloadPayslip(slip.id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `payslip-${slip.employee_code}-${slip.period_end}.pdf`;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) { setError(apiErrorMessage(e, "Could not download this payslip.")); }
    finally { setBusy(false); }
  }

  return <section className="space-y-6" aria-label="Employee payroll">
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div><p className="mb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-violet-200">People costs · {businessType}</p><h2 className="m-0 font-display text-2xl font-semibold text-white">Payroll & payslips</h2><p className="mb-0 mt-2 max-w-2xl text-xs leading-5 text-[#9995a8]">Manage employee pay, leave, and reimbursements. A payslip is an employee pay document, not a customer invoice. Payments and tax filings happen outside Zengen.</p></div>
      <button type="button" className={button} onClick={() => { setLoading(true); load().catch((e) => setError(apiErrorMessage(e))).finally(() => setLoading(false)); }}>Refresh</button>
    </header>
    {error && <p role="alert" className="rounded-xl border border-rose-300/20 bg-rose-300/5 p-3 text-xs text-rose-200">{error}</p>}
    {notice && <p role="status" className="rounded-xl border border-emerald-300/20 bg-emerald-300/5 p-3 text-xs text-emerald-200">{notice}</p>}
    {loading ? <p className="text-sm text-[#9995a8]">Loading payroll…</p> : <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[["Active employees", summary?.employee_count], ["Draft payslips", summary?.draft_payslips], ["Finalized, unpaid", summary?.finalized_unpaid_payslips], ["To employee", amount(summary?.next_payroll_amount, summary?.currency || currency)]].map(([label, value]) => <div key={label} className={card}><p className="m-0 text-[11px] text-[#9995a8]">{label}</p><strong className="mt-3 block text-xl text-white">{value ?? 0}</strong></div>)}
      </div>
      <p className="m-0 text-[10px] leading-5 text-[#777285]">{summary?.basis_note} {summary?.confirmed_unpaid_taxes ? `${summary.confirmed_unpaid_taxes} confirmed government tax record(s) remain marked unpaid.` : ""}</p>
      <nav className="flex gap-3 overflow-x-auto border-b border-white/10 pb-3" aria-label="Payroll sections">{["Payslips", "Employees", "Leave", "Reimbursements", "Taxes"].map((name) => <button key={name} type="button" onClick={() => setTab(name)} className={`shrink-0 rounded-lg px-3 py-2 text-xs ${tab === name ? "bg-violet-300/15 text-violet-200" : "text-[#9995a8] hover:bg-white/5"}`}>{name}</button>)}</nav>

      {tab === "Employees" && <div className="space-y-4">
        <div className="flex items-center justify-between"><h3 className="m-0 text-sm font-semibold text-white">Employee directory</h3><button className={action} onClick={() => setEmployeeDraft(employeeBlank(currency))}>Add employee</button></div>
        {employeeDraft && <form className={`${card} grid gap-3 md:grid-cols-3`} onSubmit={async (event) => { event.preventDefault(); if (await save(() => financeApi.saveEmployee({ ...employeeDraft, monthly_salary: employeeDraft.pay_type === "monthly" ? employeeDraft.monthly_salary : null, hourly_rate: employeeDraft.pay_type === "hourly" ? employeeDraft.hourly_rate : null, email: employeeDraft.email || null, department: employeeDraft.department || null }), "Employee saved.")) setEmployeeDraft(null); }}>
          <h4 className="m-0 md:col-span-3 text-sm text-white">{employeeDraft.id ? "Edit employee" : "New employee"}</h4>
          <FormField label="Employee code"><input required maxLength={40} className={field} value={employeeDraft.employee_code} onChange={(e) => setEmployeeDraft({ ...employeeDraft, employee_code: e.target.value })} /></FormField>
          <FormField label="Full name"><input required maxLength={160} className={field} value={employeeDraft.full_name} onChange={(e) => setEmployeeDraft({ ...employeeDraft, full_name: e.target.value })} /></FormField>
          <FormField label="Email for future sharing"><input type="email" className={field} value={employeeDraft.email || ""} onChange={(e) => setEmployeeDraft({ ...employeeDraft, email: e.target.value })} /></FormField>
          <FormField label={businessType === "Corporate" ? "Department / cost center" : "Store / team"}><input className={field} value={employeeDraft.department || ""} onChange={(e) => setEmployeeDraft({ ...employeeDraft, department: e.target.value })} /></FormField>
          <FormField label="Pay basis"><select className={field} value={employeeDraft.pay_type} onChange={(e) => setEmployeeDraft({ ...employeeDraft, pay_type: e.target.value })}><option value="monthly">Monthly salary</option><option value="hourly">Hourly</option></select></FormField>
          <FormField label={employeeDraft.pay_type === "monthly" ? "Monthly salary" : "Hourly rate"}><input required type="number" min="0" step="0.01" className={field} value={employeeDraft.pay_type === "monthly" ? employeeDraft.monthly_salary ?? "" : employeeDraft.hourly_rate ?? ""} onChange={(e) => setEmployeeDraft({ ...employeeDraft, [employeeDraft.pay_type === "monthly" ? "monthly_salary" : "hourly_rate"]: e.target.value })} /></FormField>
          <FormField label="Currency"><input required maxLength={3} className={field} value={employeeDraft.currency} onChange={(e) => setEmployeeDraft({ ...employeeDraft, currency: e.target.value.toUpperCase() })} /></FormField>
          <FormField label="Annual paid leave allowance (days)"><input required type="number" min="0" max="366" step="0.5" className={field} value={employeeDraft.annual_paid_leave_days} onChange={(e) => setEmployeeDraft({ ...employeeDraft, annual_paid_leave_days: e.target.value })} /></FormField>
          {employeeDraft.id && <FormField label="Status"><select className={field} value={employeeDraft.active ? "active" : "inactive"} onChange={(e) => setEmployeeDraft({ ...employeeDraft, active: e.target.value === "active" })}><option value="active">Active</option><option value="inactive">Inactive</option></select></FormField>}
          <div className="flex gap-2 md:col-span-3"><button disabled={busy} className={action}>Save employee</button><button type="button" className={button} onClick={() => setEmployeeDraft(null)}>Cancel</button></div>
        </form>}
        <div className="grid gap-3 md:grid-cols-2">{employees.map((person) => <article key={person.id} className={card}><div className="flex items-start justify-between gap-3"><div><strong className="text-sm text-white">{person.full_name}</strong><p className="mb-0 mt-1 text-[11px] text-[#9995a8]">{person.employee_code} · {person.department || "No team"} · {person.active ? "Active" : "Inactive"}</p></div><button className={button} onClick={() => setEmployeeDraft({ ...person, email: person.email || "", department: person.department || "" })}>Edit</button></div><p className="mb-0 mt-3 text-xs text-[#c5c0d0]">{person.pay_type === "monthly" ? `${amount(person.monthly_salary, person.currency)} / month` : `${amount(person.hourly_rate, person.currency)} / hour`}</p><p className="mb-0 mt-1 text-[11px] text-[#9995a8]">Paid leave remaining this year: {person.paid_leave_remaining_days} of {person.annual_paid_leave_days} days</p></article>)}</div>
        {!employees.length && <p className="text-xs text-[#9995a8]">Add an employee to prepare their first payslip.</p>}
      </div>}

      {tab === "Leave" && <div className="space-y-4"><div className="flex items-center justify-between"><h3 className="m-0 text-sm text-white">Leave requests</h3><button className={action} disabled={!activeEmployees.length} onClick={() => setLeaveDraft({ employee_id: activeEmployees[0]?.id || "", start_date: today(), end_date: today(), days: "1", leave_type: "paid", note: "" })}>Add leave</button></div>
        {leaveDraft && <form className={`${card} grid gap-3 md:grid-cols-3`} onSubmit={async (event) => { event.preventDefault(); if (await save(() => financeApi.createLeave({ ...leaveDraft, note: leaveDraft.note || null }), "Leave entered for review.")) setLeaveDraft(null); }}><FormField label="Employee"><select className={field} value={leaveDraft.employee_id} onChange={(e) => setLeaveDraft({ ...leaveDraft, employee_id: e.target.value })}>{activeEmployees.map((p) => <option key={p.id} value={p.id}>{p.full_name}</option>)}</select></FormField><FormField label="Start date"><input required type="date" className={field} value={leaveDraft.start_date} onChange={(e) => setLeaveDraft({ ...leaveDraft, start_date: e.target.value })} /></FormField><FormField label="End date"><input required type="date" className={field} value={leaveDraft.end_date} onChange={(e) => setLeaveDraft({ ...leaveDraft, end_date: e.target.value })} /></FormField><FormField label="Days under your policy"><input required type="number" min="0.01" max="366" step="0.01" className={field} value={leaveDraft.days} onChange={(e) => setLeaveDraft({ ...leaveDraft, days: e.target.value })} /></FormField><FormField label="Type"><select className={field} value={leaveDraft.leave_type} onChange={(e) => setLeaveDraft({ ...leaveDraft, leave_type: e.target.value })}><option value="paid">Paid</option><option value="unpaid">Unpaid</option></select></FormField><FormField label="Note"><input className={field} value={leaveDraft.note} onChange={(e) => setLeaveDraft({ ...leaveDraft, note: e.target.value })} /></FormField><div className="flex gap-2 md:col-span-3"><button disabled={busy} className={action}>Save for review</button><button type="button" className={button} onClick={() => setLeaveDraft(null)}>Cancel</button></div></form>}
        <p className="text-[11px] text-[#9995a8]">Paid leave balance uses your entered annual allowance and approved paid days in the same calendar year. Unpaid leave never changes salary automatically; enter any permitted adjustment in the payslip.</p>
        {leave.map((item) => <article key={item.id} className={`${card} flex flex-wrap items-center justify-between gap-3`}><div><strong className="text-xs text-white">{employees.find((p) => p.id === item.employee_id)?.full_name || "Employee"} · {item.days} {item.leave_type} day(s)</strong><p className="mb-0 mt-1 text-[11px] text-[#9995a8]">{item.start_date} to {item.end_date} · {item.status}{item.note ? ` · ${item.note}` : ""}</p></div>{item.status === "pending" && <div className="flex gap-2"><button disabled={busy} className={button} onClick={() => void save(() => financeApi.decideLeave(item.id, "approve"), "Leave approved.")}>Approve</button><button disabled={busy} className={button} onClick={() => void save(() => financeApi.decideLeave(item.id, "reject"), "Leave rejected.")}>Reject</button></div>}{item.status === "approved" && <button disabled={busy} className={button} onClick={() => void save(() => financeApi.decideLeave(item.id, "cancel"), "Approved leave canceled.")}>Cancel approval</button>}</article>)}
        {!leave.length && <p className="text-xs text-[#9995a8]">No leave entries yet.</p>}
      </div>}

      {tab === "Reimbursements" && <div className="space-y-4"><div className="flex items-center justify-between"><h3 className="m-0 text-sm text-white">Employee expense claims</h3><button className={action} disabled={!activeEmployees.length} onClick={() => setClaimDraft({ employee_id: activeEmployees[0]?.id || "", expense_date: today(), category: "Travel", description: "", receipt_reference: "", payroll_treatment: "", amount: "", currency: activeEmployees[0]?.currency || currency })}>Add claim</button></div>
        {claimDraft && <form className={`${card} grid gap-3 md:grid-cols-3`} onSubmit={async (event) => { event.preventDefault(); if (await save(() => financeApi.createReimbursement({ ...claimDraft, receipt_reference: claimDraft.receipt_reference || null }), "Claim entered for review.")) setClaimDraft(null); }}><FormField label="Employee"><select className={field} value={claimDraft.employee_id} onChange={(e) => { const person = employees.find((p) => p.id === e.target.value); setClaimDraft({ ...claimDraft, employee_id: e.target.value, currency: person?.currency || currency }); }}>{activeEmployees.map((p) => <option key={p.id} value={p.id}>{p.full_name}</option>)}</select></FormField><FormField label="Expense date"><input required type="date" className={field} value={claimDraft.expense_date} onChange={(e) => setClaimDraft({ ...claimDraft, expense_date: e.target.value })} /></FormField><FormField label="Category"><input required className={field} value={claimDraft.category} onChange={(e) => setClaimDraft({ ...claimDraft, category: e.target.value })} /></FormField><FormField label="Business purpose"><input required className={field} value={claimDraft.description} onChange={(e) => setClaimDraft({ ...claimDraft, description: e.target.value })} /></FormField><FormField label="Receipt / evidence reference"><input className={field} value={claimDraft.receipt_reference} onChange={(e) => setClaimDraft({ ...claimDraft, receipt_reference: e.target.value })} /></FormField><FormField label={`Amount (${claimDraft.currency})`}><input required type="number" min="0.01" step="0.01" className={field} value={claimDraft.amount} onChange={(e) => setClaimDraft({ ...claimDraft, amount: e.target.value })} /></FormField><FormField label="Payroll treatment (check local rules)"><select required className={field} value={claimDraft.payroll_treatment} onChange={(e) => setClaimDraft({ ...claimDraft, payroll_treatment: e.target.value })}><option value="" disabled>Select treatment</option><option value="outside_gross">Outside gross pay</option><option value="inside_gross">Include in gross pay</option></select></FormField><div className="flex gap-2 md:col-span-3"><button disabled={busy} className={action}>Save for review</button><button type="button" className={button} onClick={() => setClaimDraft(null)}>Cancel</button></div></form>}
        <p className="text-[11px] text-[#9995a8]">Approval here records your decision; Zengen does not verify a receipt or determine whether reimbursement is taxable. Approved claims may be added to one payslip.</p>
        {claims.map((item) => <article key={item.id} className={`${card} flex flex-wrap items-center justify-between gap-3`}><div><strong className="text-xs text-white">{employees.find((p) => p.id === item.employee_id)?.full_name || "Employee"} · {amount(item.amount, item.currency)}</strong><p className="mb-0 mt-1 text-[11px] text-[#9995a8]">{item.expense_date} · {item.category} · {item.description} · {item.status}{item.payslip_id ? " · linked to payslip" : ""}</p><p className="mb-0 mt-1 text-[10px] text-[#777285]">Evidence: {item.receipt_reference || "not provided"} ? {item.payroll_treatment === "inside_gross" ? "Included in gross pay" : "Outside gross pay"}</p></div>{item.status === "pending" && <div className="flex gap-2"><button disabled={busy} className={button} onClick={() => void save(() => financeApi.decideReimbursement(item.id, "approve"), "Claim approved.")}>Approve</button><button disabled={busy} className={button} onClick={() => void save(() => financeApi.decideReimbursement(item.id, "reject"), "Claim rejected.")}>Reject</button></div>}{item.status === "approved" && !item.payslip_id && <button disabled={busy} className={button} onClick={() => void save(() => financeApi.decideReimbursement(item.id, "cancel"), "Approved claim canceled.")}>Cancel approval</button>}{item.status === "approved" && !item.payslip_id && item.payroll_treatment === "outside_gross" && <button className={button} onClick={() => setClaimPaymentDraft({ id: item.id, paid_at: today(), payment_reference: "" })}>Record direct payment</button>}{claimPaymentDraft?.id === item.id && <div className="w-full flex flex-wrap items-end gap-2 border-t border-white/10 pt-3"><FormField label="Paid date"><input type="date" max={today()} className={field} value={claimPaymentDraft.paid_at} onChange={(e) => setClaimPaymentDraft({ ...claimPaymentDraft, paid_at: e.target.value })} /></FormField><FormField label="Payment reference (optional)"><input className={field} value={claimPaymentDraft.payment_reference} onChange={(e) => setClaimPaymentDraft({ ...claimPaymentDraft, payment_reference: e.target.value })} /></FormField><button disabled={busy} className={action} onClick={async () => { if (await save(() => financeApi.markReimbursementPaid(item.id, claimPaymentDraft.paid_at, claimPaymentDraft.payment_reference), "Direct reimbursement payment recorded.")) setClaimPaymentDraft(null); }}>Mark paid</button><button className={button} onClick={() => setClaimPaymentDraft(null)}>Cancel</button></div>}</article>)}
        {!claims.length && <p className="text-xs text-[#9995a8]">No reimbursement claims yet.</p>}
      </div>}

      {tab === "Taxes" && <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="m-0 text-sm text-white">Government tax records</h3><p className="mb-0 mt-1 text-[11px] text-[#9995a8]">Record only taxes that apply to your business. Zengen does not calculate rates, file returns, or send payments.</p></div><button className={action} onClick={() => setTaxDraft({ tax_type: "", jurisdiction: country, authority_name: "", period_start: monthStart(), period_end: today(), due_date: "", amount: "", currency, note: "" })}>Add tax record</button></div>
        {taxDraft && <form className={`${card} grid gap-3 md:grid-cols-3`} onSubmit={async (event) => { event.preventDefault(); if (await save(() => financeApi.createGovernmentTax({ ...taxDraft, due_date: taxDraft.due_date || null, authority_name: taxDraft.authority_name || null, note: taxDraft.note || null }), "Tax draft saved for review.")) setTaxDraft(null); }}>
          <h4 className="m-0 text-sm text-white md:col-span-3">New tax draft</h4>
          <FormField label="Tax type"><input required className={field} placeholder="Payroll tax, GST, VAT, income tax…" value={taxDraft.tax_type} onChange={(e) => setTaxDraft({ ...taxDraft, tax_type: e.target.value })} /></FormField>
          <FormField label="Country / jurisdiction"><input required className={field} value={taxDraft.jurisdiction} onChange={(e) => setTaxDraft({ ...taxDraft, jurisdiction: e.target.value })} /></FormField>
          <FormField label="Government authority (optional)"><input className={field} value={taxDraft.authority_name} onChange={(e) => setTaxDraft({ ...taxDraft, authority_name: e.target.value })} /></FormField>
          <FormField label="Tax period start"><input required type="date" className={field} value={taxDraft.period_start} onChange={(e) => setTaxDraft({ ...taxDraft, period_start: e.target.value })} /></FormField>
          <FormField label="Tax period end"><input required type="date" className={field} value={taxDraft.period_end} onChange={(e) => setTaxDraft({ ...taxDraft, period_end: e.target.value })} /></FormField>
          <FormField label="Due date (if known)"><input type="date" className={field} value={taxDraft.due_date} onChange={(e) => setTaxDraft({ ...taxDraft, due_date: e.target.value })} /></FormField>
          <FormField label={`Amount (${taxDraft.currency})`}><input required type="number" min="0" step="0.01" className={field} value={taxDraft.amount} onChange={(e) => setTaxDraft({ ...taxDraft, amount: e.target.value })} /></FormField>
          <FormField label="Currency"><input required maxLength={3} className={field} value={taxDraft.currency} onChange={(e) => setTaxDraft({ ...taxDraft, currency: e.target.value.toUpperCase() })} /></FormField>
          <FormField label="Basis / filing reference"><input className={field} value={taxDraft.note} onChange={(e) => setTaxDraft({ ...taxDraft, note: e.target.value })} /></FormField>
          <p className="m-0 text-[10px] text-[#9995a8] md:col-span-3">A record here is your entered obligation. Confirm the applicable law, rate, filing period, and amount with your accountant or tax authority before confirming.</p>
          <div className="flex gap-2 md:col-span-3"><button disabled={busy} className={action}>Save draft</button><button type="button" className={button} onClick={() => setTaxDraft(null)}>Cancel</button></div>
        </form>}
        {taxes.map((tax) => <article key={tax.id} className={card}>
          <div className="flex flex-wrap items-start justify-between gap-3"><div><strong className="text-sm text-white">{tax.tax_type}</strong><p className="mb-0 mt-1 text-[11px] text-[#9995a8]">{tax.jurisdiction}{tax.authority_name ? ` · ${tax.authority_name}` : ""} · period {tax.period_start} to {tax.period_end} · due {tax.due_date || "not entered"}</p><p className="mb-0 mt-1 text-[11px] text-[#9995a8]">{tax.status}{tax.paid_at ? ` on ${tax.paid_at}` : ""}{tax.payment_reference ? ` · ref ${tax.payment_reference}` : ""}{tax.note ? ` · ${tax.note}` : ""}</p></div><strong className="text-sm text-white">{amount(tax.amount, tax.currency)}</strong></div>
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-white/10 pt-3">{tax.status === "draft" ? <><label className="flex items-center gap-2 text-[11px] text-[#c5c0d0]"><input type="checkbox" checked={Boolean(taxReviewed[tax.id])} onChange={(e) => setTaxReviewed((current) => ({ ...current, [tax.id]: e.target.checked }))} />I checked the applicable rules and amount</label><button disabled={busy || !taxReviewed[tax.id]} className={action} onClick={() => void save(() => financeApi.confirmGovernmentTax(tax.id), "Tax record confirmed.")}>Confirm</button><button disabled={busy} className={button} onClick={() => void save(() => financeApi.deleteDraftGovernmentTax(tax.id), "Tax draft removed.")}>Delete draft</button></> : tax.status === "confirmed" ? <button className={button} onClick={() => setTaxPaymentDraft({ id: tax.id, paid_at: today(), payment_reference: "" })}>Record external payment</button> : null}</div>
          {taxPaymentDraft?.id === tax.id && <div className="mt-3 flex flex-wrap items-end gap-2"><FormField label="Paid date"><input type="date" max={today()} className={field} value={taxPaymentDraft.paid_at} onChange={(e) => setTaxPaymentDraft({ ...taxPaymentDraft, paid_at: e.target.value })} /></FormField><FormField label="Payment / filing reference"><input className={field} value={taxPaymentDraft.payment_reference} onChange={(e) => setTaxPaymentDraft({ ...taxPaymentDraft, payment_reference: e.target.value })} /></FormField><button disabled={busy} className={action} onClick={async () => { if (await save(() => financeApi.markGovernmentTaxPaid(tax.id, taxPaymentDraft.paid_at, taxPaymentDraft.payment_reference), "External tax payment recorded.")) setTaxPaymentDraft(null); }}>Mark paid</button><button className={button} onClick={() => setTaxPaymentDraft(null)}>Cancel</button></div>}
        </article>)}
        {!taxes.length && <p className="m-0 rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-5 text-xs leading-5 text-[#9995a8]">No tax records entered. Create one only when a tax is applicable and you have reviewed its basis.</p>}
      </div>}

      {tab === "Payslips" && <div className="space-y-4"><div className="flex items-center justify-between"><h3 className="m-0 text-sm text-white">Employee payslips</h3><button className={action} disabled={!activeEmployees.length} onClick={() => { setSlipDraft({ ...slipBlank(), employee_id: activeEmployees[0].id }); }}>Prepare payslip</button></div>
        {slipDraft && <form className={`${card} grid gap-3 md:grid-cols-3`} onSubmit={async (event) => { event.preventDefault(); const input = { ...slipDraft, regular_hours: selectedEmployee?.pay_type === "hourly" ? slipDraft.regular_hours : null, base_pay: selectedEmployee?.pay_type === "monthly" ? (slipDraft.base_pay || selectedEmployee.monthly_salary) : null, note: slipDraft.note || null }; if (await save(() => financeApi.createPayslip(input), "Draft payslip saved. Review it before finalizing.")) setSlipDraft(null); }}>
          <h4 className="m-0 md:col-span-3 text-sm text-white">Prepare a draft</h4>
          <FormField label="Employee"><select className={field} value={slipDraft.employee_id} onChange={(e) => setSlipDraft({ ...slipDraft, employee_id: e.target.value, reimbursement_ids: [], base_pay: "", regular_hours: "" })}>{activeEmployees.map((p) => <option key={p.id} value={p.id}>{p.full_name}</option>)}</select></FormField>
          <FormField label="Period start"><input required type="date" className={field} value={slipDraft.period_start} onChange={(e) => setSlipDraft({ ...slipDraft, period_start: e.target.value })} /></FormField><FormField label="Period end"><input required type="date" className={field} value={slipDraft.period_end} onChange={(e) => setSlipDraft({ ...slipDraft, period_end: e.target.value })} /></FormField>
          {selectedEmployee?.pay_type === "hourly" ? <FormField label={`Regular hours × ${amount(selectedEmployee.hourly_rate, selectedEmployee.currency)}`}><input required type="number" min="0" max="1000" step="0.01" className={field} value={slipDraft.regular_hours} onChange={(e) => setSlipDraft({ ...slipDraft, regular_hours: e.target.value })} /></FormField> : <FormField label={`Base salary (${selectedEmployee?.currency || currency})`}><input required type="number" min="0" step="0.01" className={field} value={slipDraft.base_pay !== "" ? slipDraft.base_pay : (selectedEmployee?.monthly_salary ?? "")} onChange={(e) => setSlipDraft({ ...slipDraft, base_pay: e.target.value })} /></FormField>}
          {[["overtime_pay", "Overtime pay"], ["bonus_pay", "Bonus / commission"], ["allowances", "Allowances"], ["leave_deduction", "Unpaid leave adjustment"], ["employee_tax", "Employee tax withheld"], ["other_deductions", "Other deductions"], ["employer_contributions", "Employer contributions"]].map(([key, label]) => <FormField key={key} label={label}><input required type="number" min="0" step="0.01" className={field} value={slipDraft[key]} onChange={(e) => setSlipDraft({ ...slipDraft, [key]: e.target.value })} /></FormField>)}
          <FormField label="Internal note"><input className={field} value={slipDraft.note} onChange={(e) => setSlipDraft({ ...slipDraft, note: e.target.value })} /></FormField>
          {availableClaims.length > 0 && <div className="md:col-span-3"><p className="mb-2 text-[11px] text-[#aaa5b9]">Approved reimbursements to include</p><div className="grid gap-2 sm:grid-cols-2">{availableClaims.map((claim) => <label key={claim.id} className="flex items-center gap-2 rounded-lg border border-white/10 p-2 text-[11px] text-[#c5c0d0]"><input type="checkbox" checked={slipDraft.reimbursement_ids.includes(claim.id)} onChange={(e) => setSlipDraft({ ...slipDraft, reimbursement_ids: e.target.checked ? [...slipDraft.reimbursement_ids, claim.id] : slipDraft.reimbursement_ids.filter((id) => id !== claim.id) })} />{claim.description} · {amount(claim.amount, claim.currency)}</label>)}</div></div>}
          {preview && <div className="rounded-xl border border-violet-300/20 bg-violet-300/[0.04] p-4 md:col-span-3"><p className="m-0 text-[10px] text-[#aaa5b9]">Preview from entered amounts · server recalculates when saved</p><div className="mt-2 grid gap-2 text-xs text-white sm:grid-cols-4"><span>Gross: {amount(preview.gross, selectedEmployee.currency)}</span><span>Net salary: {amount(preview.net, selectedEmployee.currency)}</span><span>To employee: {amount(preview.payout, selectedEmployee.currency)}</span><span>Employer cost: {amount(preview.cost, selectedEmployee.currency)}</span></div></div>}
          <p className="m-0 text-[10px] leading-5 text-[#9995a8] md:col-span-3">Enter tax amounts from the applicable local rules. Paid leave is already within salary; enter an unpaid-leave adjustment only if your policy and law permit it. PDF export currently supports Western-script characters; review the downloaded copy if names or notes use another script. No payment or email is sent.</p>
          <div className="flex gap-2 md:col-span-3"><button disabled={busy || (preview && (preview.gross < 0 || preview.net < 0))} className={action}>Save draft</button><button type="button" className={button} onClick={() => setSlipDraft(null)}>Cancel</button></div>
        </form>}
        {slips.map((slip) => <article key={slip.id} className={card}><div className="flex flex-wrap items-start justify-between gap-3"><div><strong className="text-sm text-white">{slip.employee_name}</strong><p className="mb-0 mt-1 text-[11px] text-[#9995a8]">{slip.period_start} to {slip.period_end} · {slip.status}{slip.paid_at ? ` on ${slip.paid_at}` : ""}</p><p className="mb-0 mt-1 text-[10px] text-[#777285]">{slip.employee_email ? `Saved email for future Gmail sharing: ${slip.employee_email}` : "Add an employee email before future Gmail sharing"}</p></div><strong className="text-sm text-white">{amount(slip.cash_to_employee, slip.currency)} to employee</strong></div><p className="mt-3 text-[11px] text-[#aaa5b9]">Gross {amount(slip.gross_pay, slip.currency)} · tax withheld {amount(slip.employee_tax, slip.currency)} · reimbursements {amount(slip.reimbursement_total, slip.currency)} · employer cost {amount(slip.employer_cost, slip.currency)}</p><div className="mt-4 flex flex-wrap gap-2 border-t border-white/[0.07] pt-4">{slip.status === "draft" ? <><label className="flex items-center gap-2 text-[11px] text-[#c5c0d0]"><input type="checkbox" checked={Boolean(reviewed[slip.id])} onChange={(e) => setReviewed((current) => ({ ...current, [slip.id]: e.target.checked }))} />I reviewed pay, leave and tax amounts</label><button disabled={busy || !reviewed[slip.id]} className={action} onClick={() => void save(() => financeApi.finalizePayslip(slip.id), "Payslip finalized and ready to download.")}>Finalize</button><button disabled={busy} className={button} onClick={() => void save(() => financeApi.deleteDraftPayslip(slip.id), "Draft removed; linked claims are available again.")}>Delete draft</button></> : <><button disabled={busy} className={button} onClick={() => void download(slip)}>Download PDF</button><button type="button" disabled title="Gmail sharing will be added later" className={button}>Share via Gmail · later</button>{slip.status === "finalized" && <button className={button} onClick={() => setPaymentDraft({ id: slip.id, paid_at: today(), payment_reference: "" })}>Record external payment</button>}</>}</div>{paymentDraft?.id === slip.id && <div className="mt-3 flex flex-wrap items-end gap-2"><FormField label="Paid date"><input type="date" max={today()} className={field} value={paymentDraft.paid_at} onChange={(e) => setPaymentDraft({ ...paymentDraft, paid_at: e.target.value })} /></FormField><FormField label="Bank / payment reference (optional)"><input className={field} value={paymentDraft.payment_reference} onChange={(e) => setPaymentDraft({ ...paymentDraft, payment_reference: e.target.value })} /></FormField><button disabled={busy} className={action} onClick={async () => { if (await save(() => financeApi.markPayslipPaid(slip.id, paymentDraft.paid_at, paymentDraft.payment_reference), "External payment recorded.")) setPaymentDraft(null); }}>Mark paid</button><button className={button} onClick={() => setPaymentDraft(null)}>Cancel</button></div>}</article>)}
        {!slips.length && <p className="text-xs text-[#9995a8]">No payslips yet. Add an employee and prepare a draft.</p>}
      </div>}
    </>}
  </section>;
}
