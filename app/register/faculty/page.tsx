"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen, ArrowLeft, ArrowRight, GraduationCap,
  Eye, EyeOff, Loader2, AlertCircle, CheckCircle2,
  Mail, Phone, User, Building2, Briefcase, Sparkles,
} from "lucide-react";

const DESIGNATIONS = [
  "Assistant Professor", "Associate Professor", "Professor",
  "Training & Placement Officer (TPO)", "Department Head",
  "Dean", "Research Scholar", "Lab Instructor", "Other",
];
const DEPARTMENTS = [
  "Computer Science & Engineering", "Information Technology",
  "Artificial Intelligence & Data Science", "Electronics & Communication",
  "Electrical Engineering", "Mechanical Engineering",
  "Civil Engineering", "Mathematics", "Physics", "Chemistry", "Other",
];
const EXPERTISE_OPTIONS = [
  "Machine Learning", "Web Development", "Data Science", "Cloud Computing",
  "Embedded Systems", "VLSI", "Power Systems", "Structural Engineering",
  "Algorithms", "Network Security", "IoT", "Robotics", "Computer Vision",
  "Natural Language Processing", "Database Systems", "Blockchain",
];

export default function FacultyRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    phone: "", password: "",
    department: "", designation: "", institution: "",
  });
  const [expertise, setExpertise] = useState<string[]>([]);

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const toggleExpertise = (e: string) =>
    setExpertise(prev => prev.includes(e) ? prev.filter(x => x !== e) : [...prev, e]);

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setError("");
    if (!form.firstName || !form.lastName || !form.email || !form.password || !form.phone) {
      setError("Please fill all required fields."); return;
    }
    if (form.password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (!form.department) { setError("Please select a department."); return; }
    if (!form.institution.trim()) { setError("Please enter your institution name."); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
          phone: form.phone.trim(),
          role: "FACULTY",
          department: form.department,
          designation: form.designation || "Assistant Professor",
          institutionName: form.institution.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Registration failed."); setLoading(false); return; }
      router.push("/dashboard/faculty");
    } catch {
      setError("An error occurred. Please try again."); setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50/30 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-6">

        {/* Header */}
        <div className="text-center space-y-3">
          <Link href="/get-started" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition mb-2">
            <ArrowLeft size={15} /> Back to Choose Domain
          </Link>
          <div className="mx-auto h-14 w-14 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <BookOpen size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Faculty / Guide Registration</h1>
          <p className="text-sm text-slate-500">Create your faculty account to mentor students and collaborate with industry.</p>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-3 flex items-center gap-2 text-sm text-red-700">
            <AlertCircle size={15} className="shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white shadow-sm p-8 space-y-6">

          {/* Personal Info */}
          <div>
            <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><User size={15} className="text-emerald-600" /> Personal Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "First Name *", key: "firstName", placeholder: "Dr. Arvind" },
                { label: "Last Name *",  key: "lastName",  placeholder: "Tripathi" },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{f.label}</label>
                  <input value={(form as any)[f.key]} onChange={e => set(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Official Email *</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="email" value={form.email} onChange={e => set("email", e.target.value)}
                    placeholder="faculty@college.edu.in"
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number *</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)}
                    placeholder="+91-9876543210"
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Password *</label>
                <div className="relative">
                  <input type={showPwd ? "text" : "password"} value={form.password} onChange={e => set("password", e.target.value)}
                    placeholder="Min. 8 characters"
                    className="w-full pr-10 px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Info */}
          <div>
            <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><Briefcase size={15} className="text-emerald-600" /> Professional Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Department *</label>
                <select value={form.department} onChange={e => set("department", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400 bg-white">
                  <option value="">Select Department</option>
                  {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Designation</label>
                <select value={form.designation} onChange={e => set("designation", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400 bg-white">
                  <option value="">Select Designation</option>
                  {DESIGNATIONS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Institution / University *</label>
                <div className="relative">
                  <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input value={form.institution} onChange={e => set("institution", e.target.value)}
                    placeholder="e.g. SRKR Engineering College, Bhimavaram"
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
                </div>
              </div>
            </div>
          </div>

          {/* Areas of Expertise */}
          <div>
            <h2 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2"><Sparkles size={15} className="text-emerald-600" /> Areas of Expertise</h2>
            <div className="flex flex-wrap gap-2">
              {EXPERTISE_OPTIONS.map(e => (
                <button key={e} type="button" onClick={() => toggleExpertise(e)}
                  className={`text-xs px-3 py-1.5 rounded-full border font-medium transition ${
                    expertise.includes(e)
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-white text-slate-600 border-slate-200 hover:border-emerald-300"
                  }`}>
                  {expertise.includes(e) && <CheckCircle2 size={10} className="inline mr-1" />}
                  {e}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50 transition shadow-lg shadow-emerald-500/20">
            {loading ? <><Loader2 size={15} className="animate-spin" /> Creating Account…</> : <><span>Create Faculty Account</span><ArrowRight size={15} /></>}
          </button>

          <p className="text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="text-emerald-600 font-semibold hover:underline">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
