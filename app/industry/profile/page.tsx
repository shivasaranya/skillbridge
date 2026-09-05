"use client";

import { useEffect, useState } from "react";
import { Building2, Save, Loader2, CheckCircle2, AlertCircle, Globe, Phone, Mail, MapPin, User } from "lucide-react";

const DOMAINS = [
  "IT Services", "Software Development", "Healthcare & Pharma", "Biotechnology",
  "Manufacturing", "Finance & Banking", "Education & EdTech", "E-Commerce",
  "Consulting", "Media & Entertainment", "Energy & Utilities", "Government & PSU",
  "Aerospace & Defence", "Ayurveda & Traditional Medicine", "Research & Development",
  "Telecommunications", "Logistics & Supply Chain", "Other",
];

const SIZES = [
  { value: "STARTUP", label: "Startup (1–50)" },
  { value: "SME", label: "SME (51–250)" },
  { value: "MIDSIZE", label: "Mid-size (251–1000)" },
  { value: "ENTERPRISE", label: "Enterprise (1000+)" },
  { value: "MNC", label: "Multinational (MNC)" },
];

export default function IndustryProfilePage() {
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [domain, setDomain] = useState("");
  const [size, setSize] = useState("ENTERPRISE");
  const [website, setWebsite] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetch("/api/industry/profile")
      .then((r) => r.json())
      .then((data) => {
        const c = data.company;
        if (c) {
          setCompany(c);
          setCompanyName(c.companyName ?? "");
          setContactPerson(c.contactPerson ?? "");
          setPhone(c.phone ?? c.user?.phone ?? "");
          setDomain(c.domain ?? "");
          setSize(c.size ?? "ENTERPRISE");
          setWebsite(c.website ?? "");
          setCity(c.city ?? "");
          setState(c.state ?? "");
          setDescription(c.description ?? "");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) { setError("Company name is required."); return; }
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/industry/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, contactPerson, phone, domain, size, website, city, state, description }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to save."); return; }
      setSuccess(true);
      setCompany(data.company);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-[50vh] flex items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-purple-600" /></div>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2"><Building2 size={20} className="text-purple-600" /> Company Profile</h1>
        <p className="text-sm text-slate-500 mt-0.5">This information is visible to students browsing your vacancies.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          <AlertCircle size={15} className="shrink-0" /> {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-700">
          <CheckCircle2 size={15} className="shrink-0" /> Profile saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
        {/* Company Identity */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Company Identity</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Company / Organization Name *</label>
              <div className="relative">
                <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Industry / Sector</label>
              <select value={domain} onChange={(e) => setDomain(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-purple-400 bg-white">
                <option value="">Select sector</option>
                {DOMAINS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Company Size</label>
              <select value={size} onChange={(e) => setSize(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-purple-400 bg-white">
                {SIZES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Contact Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Contact Person</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="e.g. Priya Mehta (HR Manager)"
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Website</label>
              <div className="relative">
                <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://www.company.com"
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Official Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" value={company?.user?.email ?? ""} disabled
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-400 cursor-not-allowed" />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Email cannot be changed after registration.</p>
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Location</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">City</label>
              <div className="relative">
                <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Bengaluru"
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">State</label>
              <input type="text" value={state} onChange={(e) => setState(e.target.value)}
                placeholder="e.g. Karnataka"
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Company Description</label>
          <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your company, culture, mission, and what makes it a great place to work..."
            className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 resize-none" />
          <p className="text-[10px] text-slate-400 mt-1">{description.length}/500 characters</p>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 transition disabled:opacity-60">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
