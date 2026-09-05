"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  User, Edit3, Save, X, Plus, Trash2, Github, Linkedin,
  Globe, Award, Layers, FolderGit2, CheckCircle2, AlertCircle,
  Loader2, ExternalLink, Star, Shield, Code, Calendar
} from "lucide-react";

const PROFICIENCY_LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"];
const VERIFICATION_COLORS: Record<string, string> = {
  SELF_DECLARED: "bg-slate-100 text-slate-500 border-slate-200",
  ASSESSMENT_VERIFIED: "bg-blue-50 text-blue-700 border-blue-200",
  PROJECT_VERIFIED: "bg-purple-50 text-purple-700 border-purple-200",
  CERTIFICATION_VERIFIED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  INDUSTRY_VERIFIED: "bg-amber-50 text-amber-700 border-amber-200",
};
const VERIFICATION_LABEL: Record<string, string> = {
  SELF_DECLARED: "Self Declared",
  ASSESSMENT_VERIFIED: "✓ Assessment",
  PROJECT_VERIFIED: "◆ Project",
  CERTIFICATION_VERIFIED: "★ Certification",
  INDUSTRY_VERIFIED: "✦ Industry",
};

type Tab = "overview" | "skills" | "certifications" | "achievements" | "projects";

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [editingOverview, setEditingOverview] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Edit state for overview
  const [form, setForm] = useState<Record<string, string>>({});

  // New skill state
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState("INTERMEDIATE");
  const [addingSkill, setAddingSkill] = useState(false);

  // New cert state
  const [showCertForm, setShowCertForm] = useState(false);
  const [certForm, setCertForm] = useState({ title: "", issuingBody: "", issueDate: "", expiryDate: "", credentialId: "", credentialUrl: "" });
  const [savingCert, setSavingCert] = useState(false);

  const loadProfile = async () => {
    try {
      const res = await fetch("/api/student/profile");
      const data = await res.json();
      setProfile(data.student);
      setForm({
        headline: data.student?.headline || "",
        summary: data.student?.summary || "",
        linkedinUrl: data.student?.linkedinUrl || "",
        githubUrl: data.student?.githubUrl || "",
        portfolioUrl: data.student?.portfolioUrl || "",
        leetcodeUrl: data.student?.leetcodeUrl || "",
        kaggleUrl: data.student?.kaggleUrl || "",
        internshipPref: data.student?.internshipPref || "ANY",
        employmentPref: data.student?.employmentPref || "ANY",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProfile(); }, []);

  const saveOverview = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/student/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setSuccess("Profile updated successfully!");
      setEditingOverview(false);
      loadProfile();
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const addSkill = async () => {
    if (!newSkillName.trim()) return;
    setAddingSkill(true);
    try {
      const res = await fetch("/api/student/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillName: newSkillName.trim(), proficiencyLevel: newSkillLevel }),
      });
      if (res.ok) {
        setNewSkillName("");
        setNewSkillLevel("INTERMEDIATE");
        loadProfile();
        setSuccess("Skill added!");
        setTimeout(() => setSuccess(""), 2000);
      }
    } finally {
      setAddingSkill(false);
    }
  };

  const removeSkill = async (skillId: string) => {
    await fetch(`/api/student/skills?skillId=${skillId}`, { method: "DELETE" });
    loadProfile();
  };

  const addCert = async () => {
    if (!certForm.title || !certForm.issuingBody || !certForm.issueDate) {
      setError("Title, issuing body, and issue date are required.");
      return;
    }
    setSavingCert(true);
    try {
      const res = await fetch("/api/student/certifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(certForm),
      });
      if (res.ok) {
        setShowCertForm(false);
        setCertForm({ title: "", issuingBody: "", issueDate: "", expiryDate: "", credentialId: "", credentialUrl: "" });
        loadProfile();
        setSuccess("Certification added!");
        setTimeout(() => setSuccess(""), 2000);
      }
    } finally {
      setSavingCert(false);
    }
  };

  const removeCert = async (id: string) => {
    await fetch(`/api/student/certifications?id=${id}`, { method: "DELETE" });
    loadProfile();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-blue-500" />
      </div>
    );
  }

  const student = profile;
  const firstName = student?.user?.firstName || "Student";
  const lastName = student?.user?.lastName || "";
  const skills = student?.skills || [];
  const certifications = student?.certifications || [];
  const achievements = student?.achievements || [];
  const projects = student?.projects || [];

  // Compute profile completion
  const completionSections = [
    { label: "Headline", done: !!student?.headline },
    { label: "Summary", done: !!student?.summary },
    { label: "GitHub/LinkedIn", done: !!(student?.githubUrl || student?.linkedinUrl) },
    { label: "Skills (3+)", done: skills.length >= 3 },
    { label: "Certifications", done: certifications.length > 0 },
    { label: "Projects", done: projects.length > 0 },
    { label: "Achievements", done: achievements.length > 0 },
    { label: "CGPA", done: !!student?.cgpa },
  ];
  const completedCount = completionSections.filter(s => s.done).length;
  const completion = Math.round((completedCount / completionSections.length) * 100);

  const TABS: { id: Tab; label: string; count?: number }[] = [
    { id: "overview", label: "Overview" },
    { id: "skills", label: "Skills", count: skills.length },
    { id: "certifications", label: "Certifications", count: certifications.length },
    { id: "achievements", label: "Achievements", count: achievements.length },
    { id: "projects", label: "Projects", count: projects.length },
  ];

  return (
    <div className="space-y-6 pb-10 max-w-4xl">
      {/* Feedback banner */}
      {success && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 flex items-center gap-2 text-sm text-emerald-800">
          <CheckCircle2 size={16} className="text-emerald-600" /> {success}
        </div>
      )}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-3 flex items-center gap-2 text-sm text-red-700">
          <AlertCircle size={16} className="text-red-500" /> {error}
          <button onClick={() => setError("")} className="ml-auto"><X size={14} /></button>
        </div>
      )}

      {/* Hero Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Cover gradient */}
        <div className="h-28 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700" />
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10 mb-4">
            {/* Avatar */}
            <div className="h-20 w-20 rounded-2xl border-4 border-white bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-extrabold shadow-lg shrink-0">
              {firstName[0]}{lastName[0]}
            </div>
            <div className="flex-1 min-w-0 mt-6 sm:mt-0">
              <h1 className="text-xl font-extrabold text-slate-900">{firstName} {lastName}</h1>
              <p className="text-sm text-blue-600 font-semibold">{student?.headline || "Add a professional headline"}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {student?.degree} — {student?.department} · {student?.institution?.name || "SkillBridge"}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <span className="bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-xl">
                {student?.readinessScore || 0}% Readiness
              </span>
              <Link href="/student/skill-gap"
                className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-slate-800 transition">
                Skill Gap →
              </Link>
            </div>
          </div>

          {/* Profile Completion */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700">Profile Completion</span>
              <span className="text-xs font-bold text-blue-600">{completion}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-200 overflow-hidden mb-3">
              <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-700" style={{ width: `${completion}%` }} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {completionSections.map(s => (
                <div key={s.label} className={`flex items-center gap-1 text-[11px] font-medium ${s.done ? "text-emerald-700" : "text-slate-400"}`}>
                  {s.done ? <CheckCircle2 size={11} /> : <div className="h-2.5 w-2.5 rounded-full border border-slate-300" />}
                  {s.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-slate-200 pb-px">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition ${
              activeTab === t.id ? "border-blue-600 text-blue-700" : "border-transparent text-slate-500 hover:text-slate-800"
            }`}>
            {t.label}
            {t.count !== undefined && t.count > 0 && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === t.id ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"}`}>{t.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === "overview" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Professional Profile</h2>
            {!editingOverview ? (
              <button onClick={() => setEditingOverview(true)} className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline">
                <Edit3 size={13} /> Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setEditingOverview(false)} className="flex items-center gap-1 text-xs font-semibold text-slate-500 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50"><X size={12} /> Cancel</button>
                <button onClick={saveOverview} disabled={saving} className="flex items-center gap-1 text-xs font-semibold bg-blue-600 text-white rounded-lg px-3 py-1.5 hover:bg-blue-700">
                  {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />} Save
                </button>
              </div>
            )}
          </div>

          {!editingOverview ? (
            <div className="space-y-4">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Headline</div>
                <p className="text-sm text-slate-800">{student?.headline || <span className="text-slate-400 italic">Not added yet</span>}</p>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">About</div>
                <p className="text-sm text-slate-700 leading-relaxed">{student?.summary || <span className="text-slate-400 italic">Add a professional summary about yourself.</span>}</p>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Academic Details</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Degree", value: student?.degree },
                    { label: "CGPA", value: student?.cgpa },
                    { label: "Graduation", value: student?.graduationYear },
                    { label: "Current Year", value: student?.currentYear },
                  ].map(f => (
                    <div key={f.label} className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-medium">{f.label}</div>
                      <div className="text-sm font-bold text-slate-800 mt-0.5">{f.value || "—"}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Links</div>
                <div className="flex flex-wrap gap-3">
                  {student?.linkedinUrl && <a href={student.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"><Linkedin size={14} />LinkedIn</a>}
                  {student?.githubUrl && <a href={student.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:underline"><Github size={14} />GitHub</a>}
                  {student?.portfolioUrl && <a href={student.portfolioUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:underline"><Globe size={14} />Portfolio</a>}
                  {student?.leetcodeUrl && <a href={student.leetcodeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:underline"><Code size={14} />LeetCode</a>}
                  {student?.kaggleUrl && <a href={student.kaggleUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-semibold text-cyan-600 hover:underline"><ExternalLink size={14} />Kaggle</a>}
                  {!student?.linkedinUrl && !student?.githubUrl && !student?.portfolioUrl && (
                    <span className="text-xs text-slate-400 italic">No links added yet. Click Edit to add your professional links.</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Professional Headline</label>
                <input type="text" value={form.headline} onChange={e => setForm({ ...form, headline: e.target.value })}
                  placeholder="Aspiring Full Stack Developer | B.Tech CSE 2026"
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">About / Summary</label>
                <textarea rows={4} value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })}
                  placeholder="Write a brief professional summary about your skills, interests, and career goals..."
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "LinkedIn URL", key: "linkedinUrl", placeholder: "https://linkedin.com/in/yourprofile" },
                  { label: "GitHub URL", key: "githubUrl", placeholder: "https://github.com/yourusername" },
                  { label: "Portfolio URL", key: "portfolioUrl", placeholder: "https://yourportfolio.dev" },
                  { label: "LeetCode URL", key: "leetcodeUrl", placeholder: "https://leetcode.com/yourprofile" },
                  { label: "Kaggle URL", key: "kaggleUrl", placeholder: "https://kaggle.com/yourprofile" },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">{f.label}</label>
                    <input type="url" value={form[f.key] || ""} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── SKILLS TAB ── */}
      {activeTab === "skills" && (
        <div className="space-y-5">
          {/* Add Skill */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Add a Skill</h3>
            <div className="flex gap-3 flex-wrap">
              <input type="text" value={newSkillName} onChange={e => setNewSkillName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addSkill()}
                placeholder="e.g. React, Python, Docker…"
                className="flex-1 min-w-[180px] px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
              <select value={newSkillLevel} onChange={e => setNewSkillLevel(e.target.value)}
                className="px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 bg-white">
                {PROFICIENCY_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <button onClick={addSkill} disabled={addingSkill || !newSkillName.trim()}
                className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition">
                {addingSkill ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Add
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2">Tip: Verify your skills through assessments or link them to projects to increase recruiter trust.</p>
          </div>

          {/* Skills List */}
          {skills.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <Layers size={36} className="text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500 font-medium">No skills added yet.</p>
              <p className="text-xs text-slate-400 mt-1">Add skills above to build your skill passport.</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {skills.map((ss: any) => (
                  <div key={ss.id} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-slate-900 truncate">{ss.skill?.name}</div>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">{ss.proficiencyLevel}</span>
                        <span className={`text-[10px] font-semibold border px-2 py-0.5 rounded-full ${VERIFICATION_COLORS[ss.verificationLevel] || ""}`}>
                          {VERIFICATION_LABEL[ss.verificationLevel] || ss.verificationLevel}
                        </span>
                      </div>
                    </div>
                    <button onClick={() => removeSkill(ss.skillId)} className="shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── CERTIFICATIONS TAB ── */}
      {activeTab === "certifications" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Certifications</h2>
            <button onClick={() => setShowCertForm(!showCertForm)}
              className="flex items-center gap-1.5 text-xs font-semibold bg-blue-600 text-white px-3 py-2 rounded-xl hover:bg-blue-700 transition">
              <Plus size={13} /> Add Certification
            </button>
          </div>

          {showCertForm && (
            <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900">New Certification</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Certification Title *</label>
                  <input type="text" value={certForm.title} onChange={e => setCertForm({ ...certForm, title: e.target.value })}
                    placeholder="AWS Certified Developer – Associate"
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Issuing Organization *</label>
                  <input type="text" value={certForm.issuingBody} onChange={e => setCertForm({ ...certForm, issuingBody: e.target.value })}
                    placeholder="Amazon Web Services"
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Issue Date *</label>
                  <input type="date" value={certForm.issueDate} onChange={e => setCertForm({ ...certForm, issueDate: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Expiry Date</label>
                  <input type="date" value={certForm.expiryDate} onChange={e => setCertForm({ ...certForm, expiryDate: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Credential ID</label>
                  <input type="text" value={certForm.credentialId} onChange={e => setCertForm({ ...certForm, credentialId: e.target.value })}
                    placeholder="AWS-DEV-2024-XXXXX"
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Verification URL</label>
                  <input type="url" value={certForm.credentialUrl} onChange={e => setCertForm({ ...certForm, credentialUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400" />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={addCert} disabled={savingCert}
                  className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
                  {savingCert ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save Certification
                </button>
                <button onClick={() => setShowCertForm(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
              </div>
            </div>
          )}

          {certifications.length === 0 && !showCertForm ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <Award size={36} className="text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No certifications added.</p>
              <p className="text-xs text-slate-400 mt-1">Certifications verify your skills and increase recruiter trust.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {certifications.map((cert: any) => (
                <div key={cert.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                      <Award size={18} className="text-emerald-600" />
                    </div>
                    <button onClick={() => removeCert(cert.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50">
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{cert.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{cert.issuingBody}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                    <Calendar size={11} />
                    {new Date(cert.issueDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                    {cert.expiryDate && ` – ${new Date(cert.expiryDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}`}
                  </div>
                  {cert.credentialId && <p className="text-[11px] text-slate-400 mt-1">ID: {cert.credentialId}</p>}
                  {cert.credentialUrl && (
                    <a href={cert.credentialUrl} target="_blank" rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline">
                      <Shield size={11} /> Verify Credential →
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── ACHIEVEMENTS TAB ── */}
      {activeTab === "achievements" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Achievements & Honours</h2>
            <Link href="/student/profile/achievements/new"
              className="flex items-center gap-1.5 text-xs font-semibold bg-blue-600 text-white px-3 py-2 rounded-xl hover:bg-blue-700 transition">
              <Plus size={13} /> Add Achievement
            </Link>
          </div>
          {achievements.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <Star size={36} className="text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No achievements added yet.</p>
              <p className="text-xs text-slate-400 mt-1">Add hackathon wins, awards, publications, and more.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {achievements.map((ach: any) => (
                <div key={ach.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex gap-4">
                  <div className="h-10 w-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                    <Award size={18} className="text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-slate-900">{ach.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{ach.organization} · {new Date(ach.date).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</div>
                    {ach.description && <p className="text-xs text-slate-600 mt-1 line-clamp-2">{ach.description}</p>}
                    <span className="mt-1.5 inline-block text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2 py-0.5">{ach.type}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── PROJECTS TAB ── */}
      {activeTab === "projects" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Project Portfolio</h2>
            <Link href="/student/profile/projects/new"
              className="flex items-center gap-1.5 text-xs font-semibold bg-blue-600 text-white px-3 py-2 rounded-xl hover:bg-blue-700 transition">
              <Plus size={13} /> Add Project
            </Link>
          </div>
          {projects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <FolderGit2 size={36} className="text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No projects added yet.</p>
              <p className="text-xs text-slate-400 mt-1">Projects verify your skills and show real-world experience.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.map((proj: any) => (
                <div key={proj.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition flex flex-col">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="h-9 w-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
                      <FolderGit2 size={16} className="text-purple-600" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 truncate">{proj.title}</h3>
                      {proj.category && <span className="text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 rounded-full px-2 py-0.5">{proj.category}</span>}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-3 flex-1">{proj.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {proj.technologies?.split(",").slice(0, 4).map((t: string) => (
                      <span key={t} className="text-[10px] font-medium bg-slate-100 text-slate-600 rounded-md px-2 py-0.5">{t.trim()}</span>
                    ))}
                  </div>
                  <div className="flex gap-2 text-xs pt-2 border-t border-slate-100">
                    {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 font-semibold text-slate-700 hover:underline"><Github size={12} /> Code</a>}
                    {proj.liveUrl && <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 font-semibold text-blue-600 hover:underline"><ExternalLink size={12} /> Live</a>}
                    {proj.teamSize && <span className="text-slate-400 ml-auto">{proj.teamSize === 1 ? "Solo" : `Team of ${proj.teamSize}`}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
