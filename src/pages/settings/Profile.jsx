import { useState } from "react";
import { AppLayout } from "../../components/AppLayout";
import { useAuth } from "../authentication/AuthContext";
import { apiErrorMessage } from "../../api/client";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || "Dharun K");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await updateProfile({ name });
      setSaved(true);
    } catch (requestError) {
      setError(apiErrorMessage(requestError, "Could not update your profile."));
    } finally {
      setSaving(false);
    }
  }
  return (
    <AppLayout section="Account" current="Profile">
      <div className="mx-auto max-w-[900px] px-8 py-8 max-[760px]:px-4">
        <p className="mb-3 flex items-center gap-2 text-[9px] font-bold tracking-[0.16em] text-violet-300">
          <span className="h-px w-4 bg-violet-300" /> YOUR ACCOUNT
        </p>
        <h1 className="m-0 font-display text-3xl font-bold tracking-tight">Profile</h1>
        <p className="mb-7 mt-2 text-xs text-[#9995a8]">Manage the details your team sees.</p>
        <form
          className="grid max-w-[620px] gap-5 rounded-xl border border-white/[0.07] bg-[#171620] p-6"
          onSubmit={submit}
        >
          <div className="flex items-center gap-3 border-b border-white/[0.07] pb-5">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-violet-300/60 to-[#40334f] text-sm font-bold">
              {user?.initials || "DK"}
            </span>
            <span>
              <strong className="block text-sm">{name}</strong>
              <small className="text-[10px] text-[#9995a8]">Workspace owner</small>
            </span>
          </div>
          <label className="grid gap-2 text-[10px] font-medium text-[#d5d0df]">
            Display name
            <input
              className="h-10 rounded-lg border border-white/10 bg-[#111018] px-3 text-xs text-white outline-none focus:border-violet-300/50"
              required
              value={name}
              onChange={(event) => {
                setSaved(false);
                setError("");
                setName(event.target.value);
              }}
            />
          </label>
          <label className="grid gap-2 text-[10px] font-medium text-[#d5d0df]">
            Email address
            <input
              className="h-10 rounded-lg border border-white/10 bg-[#111018] px-3 text-xs text-[#9995a8] outline-none"
              type="email"
              value={user?.email || ""}
              readOnly
            />
          </label>
          <div className="flex items-center justify-end gap-4 border-t border-white/[0.07] pt-4">
            {error && <span role="alert" className="mr-auto text-[10px] text-rose-200">{error}</span>}
            {saved && <span className="text-[10px] text-emerald-300">Profile updated</span>}
            <button
              className="rounded-lg bg-violet-300 px-4 py-2.5 text-[10px] font-bold text-[#171222] hover:bg-violet-200"
              type="submit"
              disabled={saving}
            >
              {saving ? "Saving…" : "Save profile"}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
