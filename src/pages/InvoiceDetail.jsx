import { useParams } from "react-router-dom";

function InvoiceDetail() {
  const { id } = useParams();

  return (
    <div style={{ padding: 40 }}>

      <h2>Invoice Detail: {id}</h2>

      <hr />

      <h3>Extracted Fields</h3>
      <p>Vendor: Sample Vendor</p>
      <p>Amount: 1200</p>
      <p>Date: 2026-02-22</p>
      <p>Category: Software</p>

      <hr />

      <h3>Risk Analysis</h3>
      <p>Risk Score: 12</p>
      <p>Explanation: Low deviation from vendor history.</p>

      <hr />

      <h3>AI Processing Steps</h3>
      <ul>
        <li>Text Extraction</li>
        <li>Categorization</li>
        <li>Risk Evaluation</li>
        <li>Stored in Database</li>
      </ul>

    </div>
  );
}

export default InvoiceDetail;