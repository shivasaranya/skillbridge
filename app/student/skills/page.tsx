"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Layers, Plus, Trash2, Search, Shield, CheckCircle2,
  AlertCircle, Loader2, Target, BookOpen, X, Clock,
  Upload, Eye, FileText, Image as ImageIcon, ExternalLink,
  UploadCloud, Filter, RefreshCw, Award
} from "lucide-react";

const PROFICIENCY_LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"];

const LEVEL_COLORS: Record<string, string> = {
  BEGINNER:     "bg-slate-100 text-slate-600 border-slate-200",
  INTERMEDIATE: "bg-blue-50 text-blue-700 border-blue-200",
  ADVANCED:     "bg-purple-50 text-purple-700 border-purple-200",
  EXPERT:       "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const LEVEL_BARS: Record<string, number> = {
  BEGINNER: 25, INTERMEDIATE: 50, ADVANCED: 75, EXPERT: 100,
};

const LEVEL_DESC: Record<string, string> = {
  BEGINNER:     "Familiar with basics",
  INTERMEDIATE: "Can work independently",
  ADVANCED:     "Deep expertise",
  EXPERT:       "Industry-leading mastery",
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  PENDING: {
    label: "Verification Pending",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: <Clock size={11} />,
  },
  VERIFIED: {
    label: "Verified",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    icon: <CheckCircle2 size={11} />,
  },
  REJECTED: {
    label: "Certificate Rejected",
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    icon: <AlertCircle size={11} />,
  },
};

const POPULAR_SKILLS = [
  "Python", "JavaScript", "React", "Node.js", "SQL", "Java",
  "TypeScript", "AWS", "Docker", "Git", "Machine Learning", "PostgreSQL",
  "Next.js", "C++", "C", "MongoDB", "Kubernetes", "TensorFlow", "Figma",
  "Flutter", "Kotlin", "Swift", "Django", "Spring Boot",
];

// Certificate Preview Modal
function CertPreviewModal({ fileUrl, onClose }: { fileUrl: string; onClose: () => void }) {
  const isPdf = fileUrl.toLowerCase().endsWith(".pdf");
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ width: "min(90vw, 860px)", height: "min(90vh, 640px)" }}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 shrink-0">
          <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
            {isPdf ? <FileText size={15} className="text-red-500" /> : <ImageIcon size={15} className="text-blue-500" />}
            Certificate Preview
          </span>
          <div className="flex items-center gap-2">
            <a href={fileUrl} target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline">
              <ExternalLink size={12} /> Open in new tab
            </a>
            <button onClick={onClose} className="ml-2 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition">
              <X size={16} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden bg-slate-50">
          {isPdf ? (
            <iframe src={fileUrl} className="w-full h-full border-0" title="Certificate PDF" />
          ) : (
            <div className="w-full h-full flex items-center justify-center p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={fileUrl} alt="Certificate" className="max-w-full max-h-full object-contain rounded-xl shadow" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Add & Verify Skill Modal
interface AddSkillModalProps { onClose: () => void; onSuccess: () => void; }

function AddSkillModal({ onClose, onSuccess }: AddSkillModalProps) {
  const [skillName, setSkillName] = useState("");
  const [skillSearch, setSkillSearch] = useState("");
  const [proficiencyLevel, setProficiencyLevel] = useState("INTERMEDIATE");
  const [certFile, setCertFile] = useState<File | null>(null);
  const [certPreviewUrl, setCertPreviewUrl] = useState("");
  const [certificateName, setCertificateName] = useState("");
  const [issuingOrganization, setIssuingOrganization] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [certificateId, setCertificateId] = useState("");
  const [credentialUrl, setCredentialUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [certError, setCertError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const filteredSuggestions = POPULAR_SKILLS.filter(s =>
    s.toLowerCase().includes(skillSearch.toLowerCase()) && s.toLowerCase() !== skillName.toLowerCase()
  ).slice(0, 10);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleFileChange = (file: File | null) => {
    setCertError("");
    if (!file) return;
    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
    if (!allowed.includes(file.type)) { setCertError("Only PDF, JPG, or PNG files are supported."); return; }
    if (file.size > 5 * 1024 * 1024) { setCertError("File too large. Maximum size is 5 MB."); return; }
    setCertFile(file);
    if (file.type.startsWith("image/")) setCertPreviewUrl(URL.createObjectURL(file));
    else setCertPreviewUrl("");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileChange(e.dataTransfer.files[0] || null);
  };

  const removeCert = () => {
    setCertFile(null); setCertPreviewUrl(""); setCertError("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async () => {
    setError(""); setCertError("");
    if (!skillName.trim()) { setError("Please enter or select a skill name."); return; }
    if (!certFile) { setCertError("Certificate required. Please upload valid proof of your skill."); return; }
    setSaving(true); setUploading(true);
    try {
      const fd = new FormData();
      fd.append("certificate", certFile);
      const uploadRes = await fetch("/api/student/skills/upload", { method: "POST", body: fd });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) { setCertError(uploadData.error || "Upload failed."); return; }
      setUploading(false);
      const res = await fetch("/api/student/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillName: skillName.trim(), proficiencyLevel,
          certificateName: certificateName.trim() || certFile.name,
          certificateFile: uploadData.fileUrl,
          issuingOrganization: issuingOrganization.trim(),
          issueDate, certificateId: certificateId.trim(), credentialUrl: credentialUrl.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to add skill."); return; }
      onSuccess(); onClose();
    } catch { setError("Something went wrong. Please try again."); }
    finally { setSaving(false); setUploading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full overflow-hidden flex flex-col"
        style={{ maxWidth: 640, maxHeight: "95vh" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Shield size={17} className="text-blue-600" /> Add &amp; Verify Skill
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Upload a certificate to verify your skill for recruiters</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"><X size={17} /></button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-3 flex items-center gap-2 text-sm text-red-700">
              <AlertCircle size={14} className="shrink-0 text-red-500" />{error}
              <button onClick={() => setError("")} className="ml-auto"><X size={13} /></button>
            </div>
          )}

          {/* Skill Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Skill Name <span className="text-red-500">*</span></label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" value={skillSearch || skillName}
                onChange={e => { setSkillSearch(e.target.value); setSkillName(e.target.value); }}
                placeholder="e.g. JavaScript, Python, React…" autoFocus
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
            </div>
            {skillSearch && filteredSuggestions.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {filteredSuggestions.map(s => (
                  <button key={s} type="button" onClick={() => { setSkillName(s); setSkillSearch(""); }}
                    className="text-xs px-3 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100 transition">{s}</button>
                ))}
              </div>
            )}
            {!skillSearch && (
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                <span className="text-[11px] text-slate-400 w-full">Popular:</span>
                {POPULAR_SKILLS.slice(0, 8).map(s => (
                  <button key={s} type="button" onClick={() => { setSkillName(s); setSkillSearch(""); }}
                    className={`text-xs px-3 py-1 rounded-full border font-medium transition ${skillName === s ? "border-blue-500 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700"}`}>{s}</button>
                ))}
              </div>
            )}
          </div>

          {/* Proficiency */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Proficiency Level <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PROFICIENCY_LEVELS.map(l => (
                <button key={l} type="button" onClick={() => setProficiencyLevel(l)}
                  className={`flex flex-col gap-1.5 px-3 py-2.5 rounded-xl border text-left transition ${proficiencyLevel === l ? "border-blue-500 bg-blue-50 shadow-sm" : "border-slate-200 bg-white hover:border-blue-200"}`}>
                  <span className={`text-[11px] font-extrabold ${proficiencyLevel === l ? "text-blue-700" : "text-slate-600"}`}>{l.charAt(0) + l.slice(1).toLowerCase()}</span>
                  <div className="h-1 rounded-full bg-slate-200 overflow-hidden">
                    <div className={`h-full rounded-full ${proficiencyLevel === l ? "bg-blue-500" : "bg-slate-300"}`} style={{ width: `${LEVEL_BARS[l]}%` }} />
                  </div>
                  <span className="text-[10px] text-slate-400 leading-tight">{LEVEL_DESC[l]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Certificate Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Certificate Upload <span className="text-red-500">*</span>
              <span className="ml-2 text-slate-400 font-normal">(PDF, JPG, PNG — max 5 MB)</span>
            </label>
            {certError && (
              <div className="mb-2 rounded-xl bg-red-50 border border-red-200 p-2.5 flex items-center gap-2 text-xs text-red-700">
                <AlertCircle size={13} className="shrink-0 text-red-500" />{certError}
              </div>
            )}
            {!certFile ? (
              <div onDragOver={e => e.preventDefault()} onDrop={handleDrop} onClick={() => fileRef.current?.click()}
                className="cursor-pointer border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-xl p-6 flex flex-col items-center justify-center gap-2 transition bg-slate-50 hover:bg-blue-50/40">
                <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                  <UploadCloud size={22} className="text-blue-600" />
                </div>
                <p className="text-sm font-semibold text-slate-700">Drag &amp; drop certificate here</p>
                <p className="text-xs text-slate-400">or <span className="text-blue-600 font-semibold underline underline-offset-2">browse files</span></p>
                <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
                  onChange={e => handleFileChange(e.target.files?.[0] || null)} />
              </div>
            ) : (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                  {certFile.type.startsWith("image/") ? <ImageIcon size={18} className="text-emerald-600" /> : <FileText size={18} className="text-emerald-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-emerald-800 truncate">{certFile.name}</p>
                  <p className="text-xs text-emerald-600">{(certFile.size / 1024).toFixed(0)} KB · Ready to upload</p>
                </div>
                {certPreviewUrl && (
                  <a href={certPreviewUrl} target="_blank" rel="noreferrer" className="shrink-0 p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-100 transition"><Eye size={15} /></a>
                )}
                <button onClick={removeCert} className="shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition"><X size={15} /></button>
              </div>
            )}
          </div>

          {/* Certificate Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Certificate Name <span className="text-red-500">*</span></label>
              <input type="text" value={certificateName} onChange={e => setCertificateName(e.target.value)} placeholder="e.g. Python for Everybody"
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Issuing Organization <span className="text-red-500">*</span></label>
              <input type="text" value={issuingOrganization} onChange={e => setIssuingOrganization(e.target.value)} placeholder="e.g. Coursera, NPTEL, Udemy"
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Issue Date <span className="text-red-500">*</span></label>
              <input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} max={new Date().toISOString().split("T")[0]}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Certificate ID <span className="text-slate-400 font-normal">(optional)</span></label>
              <input type="text" value={certificateId} onChange={e => setCertificateId(e.target.value)} placeholder="e.g. ABC123XYZ"
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Credential URL <span className="text-slate-400 font-normal">(optional)</span></label>
              <input type="url" value={credentialUrl} onChange={e => setCredentialUrl(e.target.value)} placeholder="https://www.coursera.org/verify/..."
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 shrink-0 flex items-center justify-between gap-3 bg-slate-50">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Shield size={12} className="text-blue-500 shrink-0" />
            Skills are reviewed and verified by SkillBridge admins.
          </div>
          <div className="flex gap-2 shrink-0">
            <button onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition">Cancel</button>
            <button onClick={handleSubmit} disabled={saving || !skillName.trim() || !certFile}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm">
              {uploading ? <><Upload size={14} className="animate-bounce" /> Uploading…</> :
               saving    ? <><Loader2 size={14} className="animate-spin" /> Submitting…</> :
                           <><CheckCircle2 size={14} /> Submit for Verification</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Skills Page
export default function SkillsPage() {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [filterLevel, setFilterLevel] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/student/skills");
      const data = await res.json();
      setSkills(data.skills || []);
    } catch { setError("Failed to load skills."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSkills(); }, []);

  const removeSkill = async (skillId: string, name: string) => {
    setDeleting(skillId);
    try {
      await fetch(`/api/student/skills?skillId=${skillId}`, { method: "DELETE" });
      setSkills(prev => prev.filter(s => s.skillId !== skillId));
      setSuccess(`"${name}" removed.`);
      setTimeout(() => setSuccess(""), 2000);
    } finally { setDeleting(null); }
  };

  const handleSuccess = () => {
    fetchSkills();
    setSuccess("Skill submitted for verification! You will be notified once verified.");
    setTimeout(() => setSuccess(""), 4000);
  };

  const verifiedCount = skills.filter(s => s.verificationStatus === "VERIFIED").length;
  const pendingCount  = skills.filter(s => s.verificationStatus === "PENDING").length;
  const rejectedCount = skills.filter(s => s.verificationStatus === "REJECTED").length;

  const filtered = skills.filter(ss => {
    const name = ss.skill?.name?.toLowerCase() || "";
    const matchSearch = !searchQuery || name.includes(searchQuery.toLowerCase());
    const matchLevel  = filterLevel  === "ALL" || ss.proficiencyLevel    === filterLevel;
    const matchStatus = filterStatus === "ALL" || ss.verificationStatus  === filterStatus;
    return matchSearch && matchLevel && matchStatus;
  });

  return (
    <>
      {showModal  && <AddSkillModal onClose={() => setShowModal(false)} onSuccess={handleSuccess} />}
      {previewUrl && <CertPreviewModal fileUrl={previewUrl} onClose={() => setPreviewUrl(null)} />}

      <div className="space-y-6 pb-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <Layers className="text-blue-600" size={26} /> Skill Passport
            </h1>
            <p className="text-sm text-slate-500 mt-1">Certificate-verified skills — the foundation of your career readiness score.</p>
          </div>
          <button onClick={() => setShowModal(true)}
            className="shrink-0 flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition shadow-sm">
            <Plus size={16} /> Add Skill
          </button>
        </div>

        {success && (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 flex items-center gap-2 text-sm text-emerald-800">
            <CheckCircle2 size={15} className="text-emerald-600 shrink-0" /> {success}
          </div>
        )}
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-3 flex items-center gap-2 text-sm text-red-700">
            <AlertCircle size={15} className="text-red-500 shrink-0" /> {error}
            <button onClick={() => setError("")} className="ml-auto shrink-0"><X size={14} /></button>
          </div>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Skills",         value: skills.length, color: "text-blue-600",    bg: "bg-blue-50",    border: "border-blue-100" },
            { label: "Verified Skills",      value: verifiedCount, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
            { label: "Verification Pending", value: pendingCount,  color: "text-amber-600",   bg: "bg-amber-50",   border: "border-amber-100" },
            { label: "Certificate Rejected", value: rejectedCount, color: "text-red-600",     bg: "bg-red-50",     border: "border-red-100" },
          ].map(s => (
            <div key={s.label} className={`rounded-2xl border ${s.border} ${s.bg} p-4 shadow-sm`}>
              <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
              <div className="text-xs font-medium text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        {skills.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search your skills…"
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1"><Filter size={11} /> Level:</span>
                {["ALL", ...PROFICIENCY_LEVELS].map(l => (
                  <button key={l} onClick={() => setFilterLevel(l)}
                    className={`text-xs px-3 py-1.5 rounded-full border font-medium transition ${filterLevel === l ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"}`}>
                    {l === "ALL" ? "All Levels" : l.charAt(0) + l.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1"><Shield size={11} /> Status:</span>
                {[["ALL","All"],["PENDING","Pending"],["VERIFIED","Verified"],["REJECTED","Rejected"]].map(([v,label]) => (
                  <button key={v} onClick={() => setFilterStatus(v)}
                    className={`text-xs px-3 py-1.5 rounded-full border font-medium transition ${filterStatus === v ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 animate-pulse space-y-3">
                <div className="h-4 bg-slate-200 rounded w-1/2" /><div className="h-2 bg-slate-100 rounded" />
                <div className="flex gap-2"><div className="h-6 bg-slate-200 rounded-full w-20" /><div className="h-6 bg-slate-100 rounded-full w-24" /></div>
              </div>
            ))}
          </div>
        ) : skills.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <div className="h-16 w-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-4">
              <Layers size={32} className="text-blue-400" />
            </div>
            <h3 className="text-base font-bold text-slate-600 mb-1">No skills added yet</h3>
            <p className="text-sm text-slate-400 mb-5 max-w-xs mx-auto">Add verified skills to build your Skill Passport and get matched with top opportunities.</p>
            <button onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition">
              <Plus size={15} /> Add Your First Skill
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <Search size={32} className="text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">No skills match your filters.</p>
            <button onClick={() => { setSearchQuery(""); setFilterLevel("ALL"); setFilterStatus("ALL"); }}
              className="text-xs text-blue-600 font-semibold hover:underline mt-1">Clear filters</button>
          </div>
        ) : (
          <>
            <p className="text-xs text-slate-500 font-medium">{filtered.length} skill{filtered.length !== 1 ? "s" : ""}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((ss: any) => {
                const status    = ss.verificationStatus || "PENDING";
                const statusCfg = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
                const levelClass = LEVEL_COLORS[ss.proficiencyLevel] || LEVEL_COLORS.BEGINNER;
                const barWidth   = LEVEL_BARS[ss.proficiencyLevel] || 25;
                const hasCert    = !!ss.certificateFile;
                const id         = ss.skillId || ss.id;
                return (
                  <div key={id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition group flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold text-slate-900 truncate">{ss.skill?.name}</h3>
                        {ss.skill?.category?.name && <p className="text-xs text-slate-400 mt-0.5 truncate">{ss.skill.category.name}</p>}
                      </div>
                      <button onClick={() => removeSkill(id, ss.skill?.name)} disabled={deleting === id}
                        className="shrink-0 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition">
                        {deleting === id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                      </button>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] text-slate-400 font-medium">Proficiency</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${levelClass}`}>{ss.proficiencyLevel.charAt(0) + ss.proficiencyLevel.slice(1).toLowerCase()}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${ss.proficiencyLevel === "EXPERT" ? "bg-emerald-500" : ss.proficiencyLevel === "ADVANCED" ? "bg-purple-500" : ss.proficiencyLevel === "INTERMEDIATE" ? "bg-blue-500" : "bg-slate-400"}`} style={{ width: `${barWidth}%` }} />
                      </div>
                    </div>
                    {ss.proficiencyScore && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] text-slate-400">Assessment Score</span>
                          <span className="text-[11px] font-bold text-slate-700">{ss.proficiencyScore}%</span>
                        </div>
                        <div className="h-1 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full bg-blue-400 rounded-full" style={{ width: `${ss.proficiencyScore}%` }} />
                        </div>
                      </div>
                    )}
                    {hasCert && (
                      <div className="flex items-center gap-2 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-2.5 py-1.5">
                        <Award size={11} className="shrink-0" />
                        <span className="truncate font-medium">
                          {ss.certificateName || "Certificate Uploaded"}{ss.issuingOrganization ? ` · ${ss.issuingOrganization}` : ""}
                        </span>
                      </div>
                    )}
                    <div className="mt-auto flex items-center justify-between gap-2 flex-wrap">
                      <div className={`flex items-center gap-1.5 text-[11px] font-semibold border px-2.5 py-1.5 rounded-lg ${statusCfg.color} ${statusCfg.bg} ${statusCfg.border}`}>
                        {statusCfg.icon}{statusCfg.label}{status === "VERIFIED" && " ✓"}
                      </div>
                      <div className="flex items-center gap-1.5">
                        {hasCert && (
                          <button onClick={() => setPreviewUrl(ss.certificateFile)}
                            className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1.5 rounded-lg transition">
                            <Eye size={11} /> View Certificate
                          </button>
                        )}
                        {status === "REJECTED" && (
                          <button onClick={() => setShowModal(true)}
                            className="flex items-center gap-1 text-[11px] font-semibold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1.5 rounded-lg transition">
                            <RefreshCw size={11} /> Replace
                          </button>
                        )}
                      </div>
                    </div>
                    {status === "REJECTED" && ss.rejectionReason && (
                      <p className="text-[11px] text-red-600 bg-red-50 border border-red-100 rounded-lg px-2.5 py-1.5">Reason: {ss.rejectionReason}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {skills.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/student/skill-gap" className="rounded-2xl border border-blue-200 bg-blue-50 p-5 hover:bg-blue-100 transition flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0"><Target size={18} className="text-white" /></div>
              <div>
                <div className="text-sm font-bold text-slate-900">Analyze Skill Gap</div>
                <div className="text-xs text-slate-500 mt-0.5">Compare your skills against your target role.</div>
              </div>
            </Link>
            <Link href="/student/learning" className="rounded-2xl border border-purple-200 bg-purple-50 p-5 hover:bg-purple-100 transition flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-purple-600 flex items-center justify-center shrink-0"><BookOpen size={18} className="text-white" /></div>
              <div>
                <div className="text-sm font-bold text-slate-900">Learn Missing Skills</div>
                <div className="text-xs text-slate-500 mt-0.5">Get personalized course recommendations.</div>
              </div>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
