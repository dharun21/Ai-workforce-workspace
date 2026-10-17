import { BrowserRouter, Routes, Route } from "react-router-dom";
import Workspace from "./pages/Workspace";
import FinancePage from "./pages/FinancePage";
import InvoiceDetail from "./pages/InvoiceDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Workspace />} />
        <Route path="/finance" element={<FinancePage />} />
        <Route path="/finance/:id" element={<InvoiceDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;