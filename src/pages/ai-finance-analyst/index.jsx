import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaFileInvoice, FaSearch, FaUpload } from "react-icons/fa";
import { useMemo, useState } from "react";
import { AppLayout } from "../../components/AppLayout";
import InvoiceUploadPopup from "./popups/InvoiceUploadPopup";

export default function FinanceIndex() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const visible = useMemo(
    () =>
      invoices.filter((item) =>
        `${item.name} ${item.vendor} ${item.category}`.toLowerCase().includes(search.toLowerCase()),
      ),
    [invoices, search],
  );
  const total = invoices.reduce((sum, item) => sum + item.amount, 0);
  function upload(file) {
    setLoading(true);
    window.setTimeout(() => {
      setInvoices((items) => [
        ...items,
        {
          id: Date.now(),
          name: file.name,
          vendor: "Sample Vendor",
          date: new Date().toISOString().slice(0, 10),
          amount: 1200,
          category: "Software",
          risk: 12,
          status: "Normal",
        },
      ]);
      setLoading(false);
      setUploadOpen(false);
    }, 1000);
  }
  return (
    <AppLayout section="My AI team" current="Finance Analyst">
      <div className="mx-auto max-w-[1380px] px-8 py-7 max-[760px]:px-4">
        <button
          className="mb-5 flex items-center gap-2 text-[10px] text-[#9995a8] hover:text-violet-200"
          onClick={() => navigate("/workspace")}
          type="button"
        >
          <FaArrowLeft />
          Back to My AI team
        </button>
        <header className="mb-6 flex items-end justify-between gap-4 max-[760px]:items-start max-[760px]:flex-col">
          <div>
            <p className="mb-2 flex items-center gap-2 text-[9px] font-bold tracking-[0.16em] text-violet-300">
              <span className="h-px w-4 bg-violet-300" /> AI FINANCE ANALYST
            </p>
            <h1 className="m-0 font-display text-3xl font-bold tracking-tight">
              Invoice intelligence
            </h1>
            <p className="mb-0 mt-2 text-xs text-[#9995a8]">
              Review invoices, spot risk early, and keep every detail in one place.
            </p>
          </div>
          <button
            className="flex items-center gap-2 rounded-lg bg-violet-300 px-4 py-3 text-[10px] font-bold text-[#171222] hover:bg-violet-200"
            onClick={() => setUploadOpen(true)}
            type="button"
          >
            <FaUpload />
            Upload invoice
          </button>
        </header>
        <section className="mb-5 grid grid-cols-4 gap-3 max-[900px]:grid-cols-2 max-[500px]:grid-cols-1">
          {[
            [
              "Total invoices",
              invoices.length.toString().padStart(2, "0"),
              "Processed in this workspace",
            ],
            [
              "Total amount",
              `$${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
              "Across processed invoices",
            ],
            ["Flagged for review", "0", "Nothing needs your attention"],
            ["AI extraction accuracy", "94%", "↑ Consistent and reliable"],
          ].map(([label, value, note], index) => (
            <article className="rounded-xl border border-white/[0.07] bg-[#171620] p-4" key={label}>
              <span className="text-[10px] text-[#9995a8]">{label}</span>
              <strong className="mt-3 block font-display text-2xl font-bold tracking-tight">
                {value}
              </strong>
              <small
                className={`mt-1.5 block text-[9px] ${index === 3 ? "text-emerald-300" : "text-[#706b80]"}`}
              >
                {note}
              </small>
            </article>
          ))}
        </section>
        <section className="overflow-hidden rounded-xl border border-white/[0.07] bg-[#171620]">
          <div className="flex items-center justify-between gap-4 border-b border-white/[0.07] px-5 py-4 max-[760px]:items-start max-[760px]:flex-col">
            <div>
              <h2 className="mb-1 font-display text-sm font-semibold">Recent invoices</h2>
              <p className="mb-0 text-[10px] text-[#9995a8]">
                Your latest documents, processed by AI.
              </p>
            </div>
            <label className="flex h-9 w-[240px] items-center gap-2 rounded-lg border border-white/[0.08] bg-[#111018] px-3 text-[10px] text-[#777285] max-[760px]:w-full">
              <FaSearch />
              <input
                className="min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-[#706b80]"
                aria-label="Search invoices"
                placeholder="Search invoices..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse text-left text-[10px]">
              <thead className="bg-white/[0.02] text-[9px] uppercase tracking-wider text-[#777285]">
                <tr>
                  {[
                    "Invoice",
                    "Vendor",
                    "Date added",
                    "Amount",
                    "Category",
                    "Risk",
                    "Status",
                    "",
                  ].map((head) => (
                    <th className="px-4 py-3 font-medium" key={head}>
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {visible.length ? (
                  visible.map((invoice) => (
                    <tr
                      className="cursor-pointer transition hover:bg-white/[0.025]"
                      key={invoice.id}
                      onClick={() => navigate(`/ai/finance/invoices/${invoice.id}`)}
                    >
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-2.5">
                          <i className="grid h-8 w-8 place-items-center rounded-lg bg-violet-300/10 text-violet-200">
                            <FaFileInvoice />
                          </i>
                          <strong className="max-w-[220px] truncate text-white">
                            {invoice.name}
                          </strong>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#c1bdcb]">{invoice.vendor}</td>
                      <td className="px-4 py-3 text-[#9995a8]">{invoice.date}</td>
                      <td className="px-4 py-3 font-semibold">${invoice.amount.toFixed(2)}</td>
                      <td className="px-4 py-3 text-[#9995a8]">{invoice.category}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-emerald-300/10 px-2 py-1 text-[9px] text-emerald-200">
                          {invoice.risk} / 100
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-emerald-300/10 px-2 py-1 text-[9px] text-emerald-200">
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-violet-200">→</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-5 py-14 text-center" colSpan="8">
                      <strong className="block text-sm">
                        {search ? "No matching invoices" : "Your invoice inbox is clear"}
                      </strong>
                      <span className="mt-2 block text-[10px] text-[#9995a8]">
                        {search
                          ? "Try a different search."
                          : "Upload a document to let your AI analyst extract and review it."}
                      </span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {loading && (
            <p className="m-0 border-t border-white/[0.07] px-5 py-3 text-[10px] text-violet-200">
              Your analyst is extracting invoice details…
            </p>
          )}
        </section>
      </div>
      {uploadOpen && (
        <InvoiceUploadPopup
          onClose={() => setUploadOpen(false)}
          onUpload={upload}
          loading={loading}
        />
      )}
    </AppLayout>
  );
}
