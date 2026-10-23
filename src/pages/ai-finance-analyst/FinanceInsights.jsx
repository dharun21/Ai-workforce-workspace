import { useState } from "react";
import { intelligenceApi } from "../../api/intelligence";
import { apiErrorMessage } from "../../api/client";

const inputClass = "mt-1 w-full rounded-lg border border-white/10 bg-[#111018] px-3 py-2 text-sm text-white outline-none focus:border-violet-300/50";

function formatMoney(value, currency) {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(Number(value));
  } catch {
    return `${currency} ${Number(value).toFixed(2)}`;
  }
}

function AmountInput({ label, value, onChange }) {
  return <label className="block text-[11px] text-[#c5c0d0]">{label}<input type="number" min="0" step="any" required value={value} onChange={(event) => onChange(event.target.value)} className={inputClass} /></label>;
}

export default function FinanceInsights({ currency }) {
  const [breakEvenInput, setBreakEvenInput] = useState({ fixed: "", price: "", variable: "" });
  const [marginInput, setMarginInput] = useState({ revenue: "", cogs: "" });
  const [breakEvenResult, setBreakEvenResult] = useState(null);
  const [marginResult, setMarginResult] = useState(null);
  const [breakEvenError, setBreakEvenError] = useState("");
  const [marginError, setMarginError] = useState("");
  const [busy, setBusy] = useState("");
  const updateBreakEvenInput = (key, value) => {
    setBreakEvenInput((prev) => ({ ...prev, [key]: value }));
    setBreakEvenResult(null);
  };
  const updateMarginInput = (key, value) => {
    setMarginInput((prev) => ({ ...prev, [key]: value }));
    setMarginResult(null);
  };

  async function calculateBreakEven(event) {
    event.preventDefault();
    setBreakEvenError("");
    setBreakEvenResult(null);
    setBusy("break-even");
    try {
      setBreakEvenResult(await intelligenceApi.breakEven(Number(breakEvenInput.fixed), Number(breakEvenInput.price), Number(breakEvenInput.variable)));
    } catch (error) {
      setBreakEvenError(apiErrorMessage(error, "Could not calculate break-even."));
    } finally {
      setBusy("");
    }
  }

  async function calculateMargin(event) {
    event.preventDefault();
    setMarginError("");
    setMarginResult(null);
    setBusy("margin");
    try {
      setMarginResult(await intelligenceApi.grossMargin(Number(marginInput.revenue), Number(marginInput.cogs)));
    } catch (error) {
      setMarginError(apiErrorMessage(error, "Could not calculate gross margin."));
    } finally {
      setBusy("");
    }
  }

  return <section className="space-y-5">
    <div className="rounded-2xl border border-white/[0.07] bg-[#171620] p-5">
      <p className="mb-1 text-[9px] font-bold tracking-[0.16em] text-violet-300">FINANCE INSIGHTS</p>
      <h2 className="m-0 text-lg font-semibold">Explore your numbers</h2>
      <p className="mb-0 mt-2 max-w-3xl text-xs leading-5 text-[#9995a8]">These calculators use only the values you enter here. They do not read your workspace records or update your books. Keep every input in {currency} and use the same period for related costs and revenue.</p>
    </div>
    <div className="grid gap-4 lg:grid-cols-2">
      <form onSubmit={calculateBreakEven} className="rounded-2xl border border-white/[0.07] bg-[#171620] p-5">
        <h3 className="m-0 text-sm font-semibold">Break-even units</h3>
        <p className="mt-1 text-[11px] leading-5 text-[#9995a8]">Estimate the whole units needed to cover fixed costs at a constant sale price and variable cost.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <AmountInput label={`Fixed costs (${currency})`} value={breakEvenInput.fixed} onChange={(value) => updateBreakEvenInput("fixed", value)} />
          <AmountInput label={`Price per unit (${currency})`} value={breakEvenInput.price} onChange={(value) => updateBreakEvenInput("price", value)} />
          <AmountInput label={`Variable cost per unit (${currency})`} value={breakEvenInput.variable} onChange={(value) => updateBreakEvenInput("variable", value)} />
        </div>
        <button type="submit" disabled={Boolean(busy)} className="mt-4 rounded-lg bg-violet-300 px-4 py-2.5 text-[11px] font-semibold text-[#171222] disabled:opacity-50">{busy === "break-even" ? "Calculating..." : "Calculate break-even"}</button>
        {breakEvenError && <p role="alert" className="mt-3 text-xs text-rose-200">{breakEvenError}</p>}
        {breakEvenResult && <div role="status" className="mt-4 rounded-xl border border-violet-300/20 bg-violet-300/[0.05] p-4 text-xs leading-5 text-[#d3cfdd]">
          {breakEvenResult.break_even_units == null ? <p className="m-0">{breakEvenResult.note}</p> : <><strong className="block text-lg text-white">{Number(breakEvenResult.break_even_units).toLocaleString()} units</strong><p className="mb-0 mt-1">Sales at that volume: {formatMoney(breakEvenResult.break_even_revenue, currency)}</p><p className="mb-0 mt-1">Contribution per unit: {formatMoney(breakEvenResult.contribution_margin, currency)}</p><p className="mb-0 mt-2 text-[#aaa5b8]">Formula: fixed costs ÷ (price per unit − variable cost per unit), rounded up to whole units. Assumes all units sell and costs cover the same period.</p></>}
        </div>}
      </form>
      <form onSubmit={calculateMargin} className="rounded-2xl border border-white/[0.07] bg-[#171620] p-5">
        <h3 className="m-0 text-sm font-semibold">Gross margin</h3>
        <p className="mt-1 text-[11px] leading-5 text-[#9995a8]">Use recognized revenue and the related cost of goods sold. Invoice and bill totals alone are insufficient.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <AmountInput label={`Recognized revenue (${currency})`} value={marginInput.revenue} onChange={(value) => updateMarginInput("revenue", value)} />
          <AmountInput label={`Cost of goods sold (${currency})`} value={marginInput.cogs} onChange={(value) => updateMarginInput("cogs", value)} />
        </div>
        <button type="submit" disabled={Boolean(busy)} className="mt-4 rounded-lg bg-violet-300 px-4 py-2.5 text-[11px] font-semibold text-[#171222] disabled:opacity-50">{busy === "margin" ? "Calculating..." : "Calculate gross margin"}</button>
        {marginError && <p role="alert" className="mt-3 text-xs text-rose-200">{marginError}</p>}
        {marginResult && <div role="status" className="mt-4 rounded-xl border border-violet-300/20 bg-violet-300/[0.05] p-4 text-xs leading-5 text-[#d3cfdd]">
          {Number(marginInput.revenue) === 0 ? <p className="m-0">Gross margin percentage is undefined when revenue is zero.</p> : <><strong className="block text-lg text-white">{Number(marginResult.gross_margin_percent).toFixed(2)}%</strong><p className="mb-0 mt-1">Gross profit: {formatMoney(marginResult.gross_margin, currency)}</p><p className="mb-0 mt-2 text-[#aaa5b8]">Formula: (revenue − cost of goods sold) ÷ revenue × 100. This is not net profit or available cash.</p></>}
        </div>}
      </form>
    </div>
    <div className="rounded-2xl border border-white/[0.07] bg-[#171620] p-5 text-xs leading-5 text-[#9995a8]">
      <h3 className="m-0 text-sm font-semibold text-white">Ask Finance AI about your records</h3>
      <p className="mb-0 mt-2">Try “What if all unpaid invoices are paid next month?”, “Show my partially paid invoices”, or “Which supplier bills are overdue?” The chat uses remaining balances after recorded payments and shows records used. Disputes and bank reconciliation are not tracked yet.</p>
    </div>
  </section>;
}
