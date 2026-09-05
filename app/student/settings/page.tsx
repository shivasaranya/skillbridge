"use client";

import { useState } from "react";
import { Settings, Bell, Shield, Eye, Trash2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [profilePublic, setProfilePublic] = useState(true);
  const [skillsPublic, setSkillsPublic] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${checked ? "bg-blue-600" : "bg-slate-200"}`}
    >
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-1"}`} />
    </button>
  );

  return (
    <div className="max-w-2xl space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <Settings className="text-slate-600" size={26} /> Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">Manage your account preferences and privacy settings.</p>
      </div>

      {saved && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 flex items-center gap-2 text-sm text-emerald-800">
          <CheckCircle2 size={16} className="text-emerald-600" /> Settings saved successfully.
        </div>
      )}

      {/* Profile Visibility */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Eye size={18} className="text-blue-600" />
          <h2 className="text-base font-bold text-slate-900">Profile Visibility</h2>
        </div>
        {[
          { label: "Public Profile", desc: "Allow companies to discover your profile", value: profilePublic, set: () => setProfilePublic(!profilePublic) },
          { label: "Skills Visible", desc: "Show your skills to recruiters", value: skillsPublic, set: () => setSkillsPublic(!skillsPublic) },
        ].map(item => (
          <div key={item.label} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
            <div>
              <div className="text-sm font-semibold text-slate-800">{item.label}</div>
              <div className="text-xs text-slate-500">{item.desc}</div>
            </div>
            <Toggle checked={item.value} onChange={item.set} />
          </div>
        ))}
        <div className="text-xs text-slate-400 flex items-center gap-1">
          <Shield size={11} /> Phone number is always private by default.
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Bell size={18} className="text-amber-500" />
          <h2 className="text-base font-bold text-slate-900">Notifications</h2>
        </div>
        {[
          { label: "Email Notifications", desc: "Receive opportunity matches and alerts by email", value: emailNotifs, set: () => setEmailNotifs(!emailNotifs) },
          { label: "In-App Notifications", desc: "Show notification badge in the portal", value: pushNotifs, set: () => setPushNotifs(!pushNotifs) },
        ].map(item => (
          <div key={item.label} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
            <div>
              <div className="text-sm font-semibold text-slate-800">{item.label}</div>
              <div className="text-xs text-slate-500">{item.desc}</div>
            </div>
            <Toggle checked={item.value} onChange={item.set} />
          </div>
        ))}
      </div>

      {/* Danger Zone */}
      <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Trash2 size={18} className="text-red-500" />
          <h2 className="text-base font-bold text-red-700">Danger Zone</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-800">Delete Account</div>
            <div className="text-xs text-slate-500">Permanently remove your account and all data.</div>
          </div>
          <button className="text-xs font-bold text-red-600 border border-red-300 rounded-xl px-4 py-2 hover:bg-red-50 transition">
            Delete
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={handleSave} className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition">
          Save Settings
        </button>
        <Link href="/student/dashboard" className="flex-1 rounded-xl border border-slate-300 py-3 text-sm font-semibold text-slate-700 text-center hover:bg-slate-50 transition">
          Cancel
        </Link>
      </div>
    </div>
  );
}
