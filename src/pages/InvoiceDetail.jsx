import { Navigate, useParams } from "react-router-dom";
export default function LegacyInvoiceDetail() {
  const { id } = useParams();
  return <Navigate to={`/ai/finance/invoices/${id}`} replace />;
}
