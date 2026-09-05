"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Layers, Plus, Trash2, Search, Shield, Star, CheckCircle2,
  AlertCircle, Loader2, Target, BookOpen, X, ChevronDown, Filter
} from "lucide-react";

const PROFICIENCY_LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"];
const CATEGORIES = ["ALL", "Programming Languages", "Web Development", "Backend & APIs", "Databases", "Cloud & DevOps", "AI & Machine Learning", "Data & Analytics", "Mobile Development", "Cybersecurity", "Design & UX", "Soft Skills"];

const LEVEL_COLORS: Record<string, string> = {
  BEGINNER: "bg-slate-100 text-slate-600 border-slate-200",
  INTERMEDIATE: "bg-blue-50 text-blue-700 border-blue-200",
  ADVANCED: "bg-purple-50 text-purple-700 border-purple-200",
  EXPERT: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const LEVEL_BARS: Record<string, number> = {
  BEGINNER: 25, INTERMEDIATE: 50, ADVANCED: 75, EXPERT: 100,
};

const VERIFICATION_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  SELF_DECLARED:         { label: "Self Declared",        color: "bg-slate-100 text-slate-500 border-slate-200",   icon: "○" },
  ASSESSMENT_VERIFIED:   { label: "Assessment Verified",  color: "bg-blue-50 text-blue-700 border-blue-200",       icon: "✓" },
  PROJECT_VERIFIED:      { label: "Project Verified",     color: "bg-purple-50 text-purple-700 border-purple-200", icon: "◆" },
  CERTIFICATION_VERIFIED:{ label: "Cert Verified",        color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: "★" },
  INDUSTRY_VERIFIED:     { label: "Industry Verified",    color: "bg-amber-50 text-amber-700 border-amber-200",    icon: "✦" },
};

const POPULAR_SKILLS = [
  "Python", "JavaScript", "React", "Node.js", "SQL", "Java",
  "TypeScript", "AWS", "Docker", "Git", "Machine Learning", "PostgreSQL",
  "Next.js", "C++", "MongoDB", "Kubernetes", "TensorFlow", "Figma",
];

export default function SkillsPage() {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Add skill form
  const [showForm, setShowForm] = useState(false);
  const [skillName, setSkillName] = useState("");
  const [proficiencyLevel, setProficiencyLevel] = useState("INTERMEDIATE");
  const [skillSearch, setSkillSearch] = useState("");

  // Filters
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [filterLevel, setFilterLevel] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/student/skills");
      const data = await res.json();
      setSkills(data.skills || []);
    } catch {
      setError("Failed to load skills.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSkills(); }, []);

  const addSkill = async (name?: string) => {
    const finalName = (name || skillName).trim();
    if (!finalName) { setError("Please enter a skill name."); return; }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/student/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillName: finalName, proficiencyLevel }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add skill");
      setSuccess(`"${finalName}" added!`);
      setSkillName("");
      setSkillSearch("");
      setShowForm(false);
      fetchSkills();
      setTimeout(() => setSuccess(""), 2500);
    } catch (e: any) {
      setError(e.message || "Failed to add skill.");
    } finally {
      setSaving(false);
    }
  };

  const removeSkill = async (skillId: string, skillName: string) => {
    setDeleting(skillId);
    try {
      await fetch(`/api/student/skills?skillId=${skillId}`, { method: "DELETE" });
      setSkills(prev => prev.filter(s => s.skillId !== skillId));
      setSuccess(`"${skillName}" removed.`);
      setTimeout(() => setSuccess(""), 2000);
    } finally {
      setDeleting(null);
    }
  };

  // Filter skills
  const filtered = skills.filter(ss => {
    const name = ss.skill?.name?.toLowerCase() || "";
    const cat = ss.skill?.category?.name || "";
    const matchSearch = !searchQuery || name.includes(searchQuery.toLowerCase());
    const matchCat = filterCategory === "ALL" || cat === filterCategory;
    const matchLevel = filterLevel === "ALL" || ss.proficiencyLevel === filterLevel;
    return matchSearch && matchCat && matchLevel;
  });

  // Stats
  const verifiedCount = skills.filter(s => s.verificationLevel !== "SELF_DECLARED").length;
  const expertCount = skills.filter(s => s.proficiencyLevel === "EXPERT").length;
  const advancedCount = skills.filter(s => s.proficiencyLevel === "ADVANCED").length;

  // Quick-add suggestions (popular skills not yet added)
  const addedNames = new Set(skills.map((s: any) => s.skill?.name?.toLowerCase()));
  const suggestions = POPULAR_SKILLS.filter(s => !addedNames.has(s.toLowerCase()));

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Layers className="text-blue-600" size={26} /> Skill Passport
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Your verified skill portfolio — the foundation of your career readiness score.
          </p>
        </div>
        <button
          onClick={() => { setShowForm(true); setSkillName(""); }}
          className="shrink-0 flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition shadow-sm"
        >
          <Plus size={16} /> Add Skill
        </button>
      </div>

      {/* Banners */}
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
          { label: "Total Skills",     value: skills.length,   color: "text-blue-600",   bg: "bg-blue-50",    border: "border-blue-100" },
          { label: "Verified Skills",  value: verifiedCount,   color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
          { label: "Advanced+",        value: advancedCount + expertCount, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100" },
          { label: "Expert Level",     value: expertCount,     color: "text-amber-600",  bg: "bg-amber-50",   border: "border-amber-100" },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl border ${s.border} ${s.bg} p-4 shadow-sm`}>
            <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
            <div className="text-xs font-medium text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Add Skill Form */}
      {showForm && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Add New Skill</h2>
            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
          </div>

          <div className="flex gap-3 flex-wrap">
            <div className="flex-1 min-w-[200px] relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={skillName}
                onChange={e => setSkillName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addSkill()}
                placeholder="e.g. React, Python, AWS, Docker…"
                autoFocus
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white"
              />
            </div>
            <select
              value={proficiencyLevel}
              onChange={e => setProficiencyLevel(e.target.value)}
              className="px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 bg-white font-medium"
            >
              {PROFICIENCY_LEVELS.map(l => (
                <option key={l} value={l}>{l.charAt(0) + l.slice(1).toLowerCase()}</option>
              ))}
            </select>
            <button
              onClick={() => addSkill()}
              disabled={saving || !skillName.trim()}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Add
            </button>
          </div>

          {/* Proficiency guide */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PROFICIENCY_LEVELS.map(l => (
              <button
                key={l}
                onClick={() => setProficiencyLevel(l)}
                className={`text-xs px-3 py-2 rounded-xl border text-left transition ${proficiencyLevel === l ? "border-blue-400 bg-blue-50 text-blue-700 font-bold" : "border-slate-200 bg-white text-slate-600 hover:border-blue-200"}`}
              >
                <div className="font-semibold mb-1">{l.charAt(0) + l.slice(1).toLowerCase()}</div>
                <div className="h-1 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${LEVEL_BARS[l]}%` }} />
                </div>
              </button>
            ))}
          </div>

          {/* Quick add popular skills */}
          {suggestions.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-2">Quick add popular skills:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.slice(0, 12).map(s => (
                  <button
                    key={s}
                    onClick={() => { setSkillName(s); addSkill(s); }}
                    disabled={saving}
                    className="text-xs px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 transition disabled:opacity-40"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Shield size={11} />
            Skills start as "Self Declared". Verify them through assessments, projects, or certifications to build recruiter trust.
          </div>
        </div>
      )}

      {/* Filters */}
      {skills.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search your skills…"
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1"><Filter size={11} /> Level:</span>
            {["ALL", ...PROFICIENCY_LEVELS].map(l => (
              <button
                key={l}
                onClick={() => setFilterLevel(l)}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition ${filterLevel === l ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"}`}
              >
                {l === "ALL" ? "All Levels" : l.charAt(0) + l.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Skills Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 animate-pulse space-y-3">
              <div className="h-4 bg-slate-200 rounded w-1/2" />
              <div className="h-2 bg-slate-100 rounded" />
              <div className="flex gap-2">
                <div className="h-6 bg-slate-200 rounded-full w-20" />
                <div className="h-6 bg-slate-100 rounded-full w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : skills.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Layers size={44} className="text-slate-300 mx-auto mb-4" />
          <h3 className="text-base font-bold text-slate-600 mb-1">No skills added yet</h3>
          <p className="text-sm text-slate-400 mb-5">
            Your Skill Passport is empty. Add skills to build your career readiness score and get matched with opportunities.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
          >
            <Plus size={15} /> Add Your First Skill
          </button>
          {/* Inline popular skills for empty state */}
          <div className="mt-6">
            <p className="text-xs font-semibold text-slate-400 mb-3">Or quickly add popular skills:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {POPULAR_SKILLS.slice(0, 10).map(s => (
                <button
                  key={s}
                  onClick={() => { setProficiencyLevel("INTERMEDIATE"); addSkill(s); }}
                  disabled={saving}
                  className="text-xs px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 transition"
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <Search size={32} className="text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-500">No skills match your filters.</p>
          <button onClick={() => { setSearchQuery(""); setFilterCategory("ALL"); setFilterLevel("ALL"); }}
            className="text-xs text-blue-600 font-semibold hover:underline mt-1">Clear filters</button>
        </div>
      ) : (
        <>
          <p className="text-xs text-slate-500 font-medium">{filtered.length} skill{filtered.length !== 1 ? "s" : ""}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((ss: any) => {
              const verif = VERIFICATION_CONFIG[ss.verificationLevel] || VERIFICATION_CONFIG.SELF_DECLARED;
              const levelClass = LEVEL_COLORS[ss.proficiencyLevel] || LEVEL_COLORS.BEGINNER;
              const barWidth = LEVEL_BARS[ss.proficiencyLevel] || 25;
              return (
                <div key={ss.skillId || ss.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition group flex flex-col"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-slate-900 truncate">{ss.skill?.name}</h3>
                      {ss.skill?.category?.name && (
                        <p className="text-xs text-slate-400 mt-0.5 truncate">{ss.skill.category.name}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeSkill(ss.skillId || ss.id, ss.skill?.name)}
                      disabled={deleting === (ss.skillId || ss.id)}
                      className="shrink-0 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition"
                    >
                      {deleting === (ss.skillId || ss.id) ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                    </button>
                  </div>

                  {/* Proficiency bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-slate-400 font-medium">Proficiency</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${levelClass}`}>
                        {ss.proficiencyLevel.charAt(0) + ss.proficiencyLevel.slice(1).toLowerCase()}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          ss.proficiencyLevel === "EXPERT" ? "bg-emerald-500" :
                          ss.proficiencyLevel === "ADVANCED" ? "bg-purple-500" :
                          ss.proficiencyLevel === "INTERMEDIATE" ? "bg-blue-500" :
                          "bg-slate-400"
                        }`}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>

                  {/* Score if available */}
                  {ss.proficiencyScore && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] text-slate-400">Assessment Score</span>
                        <span className="text-[11px] font-bold text-slate-700">{ss.proficiencyScore}%</span>
                      </div>
                      <div className="h-1 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full bg-blue-400 rounded-full" style={{ width: `${ss.proficiencyScore}%` }} />
                      </div>
                    </div>
                  )}

                  {/* Verification badge */}
                  <div className={`mt-auto flex items-center gap-1.5 text-[11px] font-semibold border px-2.5 py-1.5 rounded-lg w-fit ${verif.color}`}>
                    <span>{verif.icon}</span>
                    <span>{verif.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* CTA Hints */}
      {skills.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/student/skill-gap"
            className="rounded-2xl border border-blue-200 bg-blue-50 p-5 hover:bg-blue-100 transition flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
              <Target size={18} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">Analyze Skill Gap</div>
              <div className="text-xs text-slate-500 mt-0.5">Compare your skills against your target role.</div>
            </div>
          </Link>
          <Link href="/student/learning"
            className="rounded-2xl border border-purple-200 bg-purple-50 p-5 hover:bg-purple-100 transition flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-purple-600 flex items-center justify-center shrink-0">
              <BookOpen size={18} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">Learn Missing Skills</div>
              <div className="text-xs text-slate-500 mt-0.5">Get personalized course recommendations.</div>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
