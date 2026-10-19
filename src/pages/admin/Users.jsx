import { useCallback, useEffect, useState } from "react";
import { FaCheck, FaUsers } from "react-icons/fa";
import { adminApi } from "../../api/admin";
import { AppLayout } from "../../components/AppLayout";

const SPECIALISTS = [
  ["finance_analyst", "Finance Analyst"],
  ["personal_assistant", "Personal Assistant"],
  ["hr_executive", "HR Executive"],
  ["sales_analyst", "Sales Analyst"],
];

function formatExpiry(value) {
  if (!value) return "No expiry";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Invalid date" : "Expires " + date.toLocaleDateString();
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState("");
  const [error, setError] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      setUsers(await adminApi.listUsers());
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.detail || "Could not load user access.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  async function toggleAccess(user, specialistKey, enabled) {
    const access = user.access[specialistKey];
    const expired = access.expires_at && new Date(access.expires_at).getTime() <= Date.now();
    const key = user.id + ":" + specialistKey;
    setSavingKey(key);
    setError("");
    try {
      const updated = await adminApi.updateUserAccess(user.id, specialistKey, {
        enabled,
        expires_at: enabled && expired ? null : access.expires_at,
        monthly_usage_limit: access.monthly_usage_limit,
      });
      setUsers((current) => current.map((item) => item.id === updated.id ? updated : item));
    } catch (requestError) {
      setError(requestError.response?.data?.detail || "Could not update access.");
    } finally {
      setSavingKey("");
    }
  }

  return (
    <AppLayout section="Administration" current="User access">
      <div className="mx-auto w-full max-w-[1500px] px-8 py-8 max-[760px]:px-4">
        <header className="mb-6">
          <p className="mb-2 flex items-center gap-2 text-[9px] font-bold tracking-[0.16em] text-violet-300"><FaUsers /> ADMINISTRATION</p>
          <h1 className="m-0 font-display text-2xl font-semibold">User AI access</h1>
          <p className="mb-0 mt-2 max-w-2xl text-xs leading-5 text-[#9995a8]">Enable individual AI specialists for each account. A disabled specialist is hidden from the user and its protected pages and APIs reject access.</p>
        </header>

        {error && <p role="alert" className="mb-4 rounded-lg border border-rose-300/20 bg-rose-300/[0.06] p-3 text-xs text-rose-100">{error}</p>}

        <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-[#15141d]">
          <table className="w-full min-w-[1000px] border-collapse text-left text-xs">
            <thead className="bg-white/[0.025] text-[10px] uppercase tracking-wider text-[#9995a8]">
              <tr>
                <th className="px-4 py-4">User</th>
                <th className="px-4 py-4">Created</th>
                {SPECIALISTS.map(([key, label]) => <th key={key} className="px-4 py-4">{label}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-[#9995a8]">Loading user accounts…</td></tr>
              ) : users.map((user) => (
                <tr key={user.id} className="align-top hover:bg-white/[0.02]">
                  <td className="px-4 py-4"><strong className="block text-white">{user.name}</strong><span className="mt-1 block text-[10px] text-[#9995a8]">{user.email}{user.is_admin ? " · Admin" : ""}</span></td>
                  <td className="whitespace-nowrap px-4 py-4 text-[10px] text-[#9995a8]">{new Date(user.created_at).toLocaleDateString()}</td>
                  {SPECIALISTS.map(([key]) => {
                    const access = user.access[key];
                    const rowKey = user.id + ":" + key;
                    const busy = savingKey === rowKey;
                    const expired = access.enabled && access.expires_at && new Date(access.expires_at).getTime() <= Date.now();
                    const enabledNow = access.enabled && !expired;
                    return (
                      <td key={key} className="px-4 py-4">
                        <label className="flex cursor-pointer items-center gap-2 text-[10px] text-white">
                          <input type="checkbox" checked={enabledNow} disabled={busy} onChange={(event) => toggleAccess(user, key, event.target.checked)} className="h-4 w-4 accent-violet-400" />
                          {busy ? "Saving..." : expired ? "Expired" : enabledNow ? <><FaCheck className="text-emerald-300" /> Enabled</> : "Disabled"}
                        </label>
                        <span className="mt-2 block text-[9px] text-[#777285]">{formatExpiry(access.expires_at)}</span>
                        <span className="mt-1 block text-[9px] text-[#777285]">{access.monthly_usage_limit == null ? "No limit set" : access.monthly_usage_limit + " requests / month"}</span>
                      </td>
                    );
                  })}
                </tr>
              ))}
              {!loading && users.length === 0 && <tr><td colSpan={6} className="px-4 py-12 text-center text-[#9995a8]">No user accounts yet.</td></tr>}
            </tbody>
          </table>
        </div>
        <p className="mb-0 mt-3 text-[10px] leading-5 text-[#777285]">This screen grants access manually. Payment records, automatic expiry, and actual AI usage tracking are not connected yet.</p>
      </div>
    </AppLayout>
  );
}
