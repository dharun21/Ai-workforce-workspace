import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Workspace from "./pages/Workspace";
import LoginPage from "./pages/authentication/Login";
import LogoutPage from "./pages/authentication/Logout";
import ProtectedRoute from "./pages/authentication/ProtectedRoute";
import { AuthProvider } from "./pages/authentication/AuthContext";
import SettingsPage from "./pages/settings";
import ProfilePage from "./pages/settings/Profile";
import FinanceIndex from "./pages/ai-finance-analyst";
import InvoiceDetailPage from "./pages/ai-finance-analyst/pages/InvoiceDetail";
import HrIndex from "./pages/ai-hr-executive";
import SalesIndex from "./pages/ai-sales-analyst";
import PersonalAssistantIndex from "./pages/ai-personal-assistant";
import LegacyFinancePage from "./pages/FinancePage";
import LegacyInvoiceDetail from "./pages/InvoiceDetail";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Workspace />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/ai/personal-assistant" element={<PersonalAssistantIndex />} />
            <Route path="/ai/finance" element={<FinanceIndex />} />
            <Route path="/ai/finance/invoices/:id" element={<InvoiceDetailPage />} />
            <Route path="/ai/hr" element={<HrIndex />} />
            <Route path="/ai/sales" element={<SalesIndex />} />
            <Route path="/finance" element={<LegacyFinancePage />} />
            <Route path="/finance/:id" element={<LegacyInvoiceDetail />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
