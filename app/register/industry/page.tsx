"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2, Mail, Lock, Phone, User, Globe, MapPin,
  Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, Briefcase,
} from "lucide-react";

const DOMAINS = [
  "IT Services", "Software Development", "Healthcare & Pharma", "Biotechnology",
  "Manufacturing", "Finance & Banking", "Education & EdTech", "E-Commerce",
  "Consulting", "Media & Entertainment", "Energy & Utilities", "Government & PSU",
  "Aerospace & Defence", "Ayurveda & Traditional Medicine", "Research & Development",
  "Telecommunications", "Logistics & Supply Chain", "Other",
];

export default function IndustryRegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Basic auth fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  // Company fields
  const [companyName, setCompanyName] = useState("");
  const [domain, setDomain] = useState("");
  const [website, setWebsite] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!firstName.trim() || !lastName.trim()) { setError("Full name is required."); return; }
    if (!email.trim() || !email.includes("@")) { setError("A valid email address is required."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (!companyName.trim()) { setError("Company name is required."); return; }
    if (!domain) { setError("Please select your industry/sector."); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim().toLowerCase(),
          password,
          phone: phone.trim() || undefined,
          role: "INDUSTRY",
          companyName: companyName.trim(),
          domainField: domain,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Registration failed. Please try again."); return; }

      // Profile fields — save via profile API after registration
      if (website || city || state || description) {
        await fetch("/api/industry/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ website, city, state, description, contactPerson: `${firstName} ${lastName}`, phone }),
        });
      }

      setSuccess(true);
      setTimeout(() => router.push("/industry/dashboard"), 1500);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-10 text-center max-w-sm w-full">
          <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={36} className="text-emerald-500" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Account Created!</h2>
          <p className="text-slate-500 text-sm mt-1">Redirecting to your Industry Dashboard...</p>
          <Loader2 size={20} className="animate-spin text-purple-600 mx-auto mt-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-2xl bg-purple-600 flex items-center justify-center">
              <Building2 size={22} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white">SkillBridge</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-white">Register as Industry Partner</h1>
          <p className="text-purple-200/70 text-sm mt-1">Post vacancies. Discover talent. Build your team.</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-6 sm:p-8">
            {error && (
              <div className="flex items-center gap-2.5 rounded-xl bg-red-50 border border-red-200 p-3 mb-5 text-sm text-red-700">
                <AlertCircle size={16} className="shrink-0" /> <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Person */}
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <User size={12} /> Contact Person
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">First Name *</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required
                      placeholder="Priya"
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Last Name *</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required
                      placeholder="Mehta"
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Official Email *</label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                        placeholder="hr@company.com"
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
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password *</label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required
                      placeholder="Min. 8 characters"
                      className="w-full pl-9 pr-10 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  <div className="mt-1.5 flex gap-1">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${password.length > i * 3 ? (password.length >= 12 ? "bg-emerald-400" : "bg-amber-400") : "bg-slate-200"}`} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Company Info */}
              <div className="border-t border-slate-100 pt-5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <Building2 size={12} /> Company Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Company / Organization Name *</label>
                    <div className="relative">
                      <Briefcase size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required
                        placeholder="e.g. TechCorp Solutions Pvt. Ltd."
                        className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Industry / Sector *</label>
                      <select value={domain} onChange={(e) => setDomain(e.target.value)} required
                        className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-purple-400 bg-white">
                        <option value="">Select sector</option>
                        {DOMAINS.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
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
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">City</label>
                      <input type="text" value={city} onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Bengaluru"
                        className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">State</label>
                      <input type="text" value={state} onChange={(e) => setState(e.target.value)}
                        placeholder="e.g. Karnataka"
                        className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Company Description <span className="text-slate-400">(optional)</span></label>
                    <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
                      placeholder="Brief description of your company and the kind of talent you're looking for..."
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 resize-none" />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition disabled:opacity-60 shadow-lg shadow-purple-500/25">
                {loading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                {loading ? "Creating Account..." : "Create Industry Partner Account"}
              </button>
            </form>
          </div>

          <div className="px-6 pb-5 text-center text-sm text-slate-500 border-t border-slate-100 pt-4">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-purple-600 hover:underline">Sign In</Link>
            <span className="mx-2">·</span>
            <Link href="/register" className="font-semibold text-blue-600 hover:underline">Register as Student</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
