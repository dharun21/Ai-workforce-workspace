import { useState } from "react";
import { useNavigate } from "react-router-dom";

function FinancePage() {
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    // Simulate backend processing
    setTimeout(() => {
      const newInvoice = {
        id: Date.now(),
        name: file.name,
        vendor: "Sample Vendor",
        date: "2026-02-22",
        amount: 1200,
        category: "Software",
        risk: 12,
        status: "Normal"
      };

      setInvoices(prev => [...prev, newInvoice]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div style={{ padding: 40 }}>

      {/* Top Summary Bar */}
      <div style={{ display: "flex", gap: 40, marginBottom: 30 }}>
        <div>Total Invoices: {invoices.length}</div>
        <div>Total Amount: {invoices.reduce((a, b) => a + b.amount, 0)}</div>
        <div>Anomalies: {invoices.filter(i => i.status === "Anomaly").length}</div>
        <div>AI Accuracy: 94%</div>
      </div>

      {/* Add Invoice */}
      <div style={{ marginBottom: 20 }}>
        <input type="file" onChange={handleUpload} />
        {loading && <span> Processing...</span>}
      </div>

      {/* Table */}
      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>Vendor</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Risk</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.id} onClick={() => navigate(`/finance/${inv.id}`)} style={{ cursor: "pointer" }}>
              <td>{inv.name}</td>
              <td>{inv.vendor}</td>
              <td>{inv.date}</td>
              <td>{inv.amount}</td>
              <td>{inv.category}</td>
              <td>{inv.risk}</td>
              <td>{inv.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default FinancePage;