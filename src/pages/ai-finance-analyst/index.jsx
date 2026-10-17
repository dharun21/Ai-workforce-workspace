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
    <AppLayout section="AI employees" current="Finance analyst">
      <div className="finance-content">
        <button className="back-link" onClick={() => navigate("/")} type="button">
          <FaArrowLeft />
          Back to AI employees
        </button>
        <div className="finance-heading">
          <div>
            <p className="eyebrow">
              <span className="eyebrow-line" />
              AI FINANCE ANALYST
            </p>
            <h1>Invoice intelligence</h1>
            <p>Review invoices, spot risk early, and keep every detail in one place.</p>
          </div>
          <button className="upload-button" onClick={() => setUploadOpen(true)} type="button">
            <FaUpload />
            Upload invoice
          </button>
        </div>
        <section className="finance-stats">
          <article className="finance-stat">
            <span>Total invoices</span>
            <strong>{invoices.length.toString().padStart(2, "0")}</strong>
            <small>Processed in this workspace</small>
          </article>
          <article className="finance-stat">
            <span>Total amount</span>
            <strong>${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong>
            <small>Across processed invoices</small>
          </article>
          <article className="finance-stat">
            <span>Flagged for review</span>
            <strong>0</strong>
            <small>Nothing needs your attention</small>
          </article>
          <article className="finance-stat">
            <span>AI extraction accuracy</span>
            <strong>94%</strong>
            <small className="good">↑ Consistent and reliable</small>
          </article>
        </section>
        <section className="invoice-panel">
          <div className="invoice-panel-head">
            <div>
              <h2>Recent invoices</h2>
              <p>Your latest documents, processed by AI.</p>
            </div>
            <label className="table-search">
              <FaSearch />
              <input
                aria-label="Search invoices"
                placeholder="Search invoices..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
          </div>
          <div className="invoice-table-wrap">
            <table className="invoice-table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Vendor</th>
                  <th>Date added</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Risk</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {visible.length ? (
                  visible.map((invoice) => (
                    <tr
                      key={invoice.id}
                      onClick={() => navigate(`/ai/finance/invoices/${invoice.id}`)}
                    >
                      <td>
                        <span className="invoice-name">
                          <span className="file-icon">
                            <FaFileInvoice />
                          </span>
                          {invoice.name}
                        </span>
                      </td>
                      <td className="invoice-vendor">{invoice.vendor}</td>
                      <td>{invoice.date}</td>
                      <td className="amount-cell">${invoice.amount.toFixed(2)}</td>
                      <td>{invoice.category}</td>
                      <td>
                        <span className="risk-pill">{invoice.risk} / 100</span>
                      </td>
                      <td>
                        <span className="invoice-status">{invoice.status}</span>
                      </td>
                      <td>→</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="empty-table" colSpan="8">
                      <strong>
                        {search ? "No matching invoices" : "Your invoice inbox is clear"}
                      </strong>
                      {search
                        ? "Try a different search."
                        : "Upload a document to let your AI analyst extract and review it."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {loading && <p className="loading-note">Your analyst is extracting invoice details…</p>}
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
