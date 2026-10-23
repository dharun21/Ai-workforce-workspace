import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Workspace from "./pages/Workspace";
import LoginPage, { AdminLoginPage } from "./pages/authentication/Login";
import LogoutPage from "./pages/authentication/Logout";
import ProtectedRoute, { AdminRoute, SpecialistRoute } from "./pages/authentication/ProtectedRoute";
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
import LandingPage from "./pages/LandingPage";
import PricingPage from "./pages/PricingPage";
import AdminUsersPage from "./pages/admin/Users";
import { ForgotPasswordPage, ResetPasswordPage } from "./pages/authentication/PasswordRecovery";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/workspace" element={<Workspace />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route element={<SpecialistRoute specialist="personal_assistant" />}>
              <Route path="/ai/personal-assistant" element={<PersonalAssistantIndex />} />
            </Route>
            <Route element={<SpecialistRoute specialist="finance_analyst" />}>
              <Route path="/ai/finance" element={<FinanceIndex />} />
              <Route path="/ai/finance/chat" element={<FinanceIndex />} />
              <Route path="/ai/finance/invoices/:id" element={<InvoiceDetailPage />} />
              <Route path="/finance" element={<LegacyFinancePage />} />
              <Route path="/finance/:id" element={<LegacyInvoiceDetail />} />
            </Route>
            <Route element={<SpecialistRoute specialist="hr_executive" />}>
              <Route path="/ai/hr" element={<HrIndex />} />
            </Route>
            <Route element={<SpecialistRoute specialist="sales_analyst" />}>
              <Route path="/ai/sales" element={<SalesIndex />} />
            </Route>
            <Route element={<AdminRoute />}>
              <Route path="/admin/users" element={<AdminUsersPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
