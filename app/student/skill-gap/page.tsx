"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Target, CheckCircle2, AlertTriangle, XCircle,
  BarChart3, ArrowRight, Loader2, Sparkles, BookOpen,
  ChevronDown, ChevronUp, HelpCircle
} from "lucide-react";

const ROLES = [
  "Full Stack Developer", "Backend Developer", "Frontend Developer",
  "Data Analyst", "Data Scientist", "AI/ML Engineer",
  "Cloud Engineer", "DevOps Engineer", "Cybersecurity Analyst",
  "UI/UX Designer", "Product Manager"
];

const ROLE_ICONS: Record<string, string> = {
  "Full Stack Developer": "🌐", "Backend Developer": "⚙️", "Frontend Developer": "🎨",
  "Data Analyst": "📊", "Data Scientist": "🔬", "AI/ML Engineer": "🤖",
  "Cloud Engineer": "☁️", "DevOps Engineer": "🔧", "Cybersecurity Analyst": "🔒",
  "UI/UX Designer": "✏️", "Product Manager": "🎯",
};

export default function SkillGapPage() {
  const [selectedRole, setSelectedRole] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showExplainer, setShowExplainer] = useState(false);

  const analyze = async (role: string) => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/student/skill-gap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetRole: role }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ error: "Failed to analyze skill gap. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    analyze(role);
  };

  const scoreColor = (score: number) =>
    score >= 70 ? "text-emerald-600" : score >= 45 ? "text-amber-600" : "text-red-500";
  const scoreBarColor = (score: number) =>
    score >= 70 ? "bg-emerald-500" : score >= 45 ? "bg-amber-400" : "bg-red-400";

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <Target className="text-blue-600" size={26} /> Skill Gap Analysis
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Select a target role to see exactly which skills you have, need to improve, or are missing.
        </p>
      </div>

      {/* Role Selector Grid */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-bold text-slate-800 mb-4">Choose Your Target Role</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {ROLES.map((role) => (
            <button
              key={role}
              onClick={() => handleRoleSelect(role)}
              className={`flex items-center gap-2 px-3 py-3 rounded-xl border text-sm font-medium text-left transition ${
                selectedRole === role
                  ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                  : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-slate-50"
              }`}
            >
              <span className="text-lg">{ROLE_ICONS[role]}</span>
              <span className="leading-tight text-xs">{role}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={32} className="animate-spin text-blue-500" />
            <p className="text-sm text-slate-500">Analyzing your skill profile...</p>
          </div>
        </div>
      )}

      {/* Error */}
      {result?.error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <AlertTriangle size={28} className="text-red-400 mx-auto mb-2" />
          <p className="text-sm text-red-600">{result.error}</p>
        </div>
      )}

      {/* Results */}
      {result && !result.error && (
        <div className="space-y-5">
          {/* Readiness Score Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  {ROLE_ICONS[selectedRole]} {selectedRole} Readiness
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Estimated Career Readiness Score</p>
              </div>
              <div className="text-center">
                <div className={`text-4xl font-extrabold ${scoreColor(result.readinessScore)}`}>
                  {result.readinessScore}%
                </div>
                <div className="text-xs text-slate-400">Overall Match</div>
              </div>
            </div>

            {/* Score bar */}
            <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${scoreBarColor(result.readinessScore)}`}
                style={{ width: `${result.readinessScore}%` }}
              />
            </div>

            {/* Breakdown */}
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
              <div className="text-center">
                <div className="text-xl font-extrabold text-emerald-600">{result.breakdown?.strong || 0}</div>
                <div className="text-xs text-slate-500">Strong Skills</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-extrabold text-amber-500">{result.breakdown?.moderate || 0}</div>
                <div className="text-xs text-slate-500">Need Improvement</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-extrabold text-red-500">{result.breakdown?.missing || 0}</div>
                <div className="text-xs text-slate-500">Missing Skills</div>
              </div>
            </div>

            {/* Explainer toggle */}
            <button
              onClick={() => setShowExplainer(!showExplainer)}
              className="mt-4 flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 transition"
            >
              <HelpCircle size={13} /> How is this calculated?
              {showExplainer ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
            {showExplainer && (
              <div className="mt-3 rounded-xl bg-slate-50 border border-slate-200 p-4 text-xs text-slate-600 space-y-1">
                <p className="font-semibold text-slate-700">Scoring methodology:</p>
                <p>• Each required skill has a weight based on its importance for the role.</p>
                <p>• Your proficiency level (Beginner/Intermediate/Advanced/Expert) scales the score per skill.</p>
                <p>• Mandatory skills that are missing reduce your score significantly.</p>
                <p>• The overall score = (sum of weighted skills you have) ÷ (total possible weight) × 100</p>
                <p className="text-slate-400 italic mt-1">This is an estimated score, not a guarantee of job eligibility.</p>
              </div>
            )}
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Strong */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <h3 className="text-sm font-bold text-emerald-800">Strong Skills</h3>
                <span className="ml-auto text-xs font-bold bg-emerald-100 text-emerald-700 rounded-full px-2 py-0.5">
                  {result.strongSkills?.length || 0}
                </span>
              </div>
              {result.strongSkills?.length === 0 ? (
                <p className="text-xs text-emerald-600">Add your skills to see what you already have.</p>
              ) : (
                <div className="space-y-2">
                  {result.strongSkills?.map((s: any) => (
                    <div key={s.skill} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-emerald-100">
                      <div>
                        <div className="text-xs font-semibold text-slate-800">{s.skill}</div>
                        <div className="text-[10px] text-emerald-600 capitalize">{s.verificationLevel?.replace("_", " ") || "Self Declared"}</div>
                      </div>
                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200">
                        {s.level}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Moderate */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={16} className="text-amber-600" />
                <h3 className="text-sm font-bold text-amber-800">Needs Improvement</h3>
                <span className="ml-auto text-xs font-bold bg-amber-100 text-amber-700 rounded-full px-2 py-0.5">
                  {result.moderateSkills?.length || 0}
                </span>
              </div>
              {result.moderateSkills?.length === 0 ? (
                <p className="text-xs text-amber-600">No skills at intermediate level for this role.</p>
              ) : (
                <div className="space-y-2">
                  {result.moderateSkills?.map((s: any) => (
                    <div key={s.skill} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-amber-100">
                      <div>
                        <div className="text-xs font-semibold text-slate-800">{s.skill}</div>
                        <div className="text-[10px] text-amber-600">Level up to Intermediate+</div>
                      </div>
                      <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200">
                        {s.level}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Missing */}
            <div className="rounded-2xl border border-red-200 bg-red-50/50 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <XCircle size={16} className="text-red-500" />
                <h3 className="text-sm font-bold text-red-800">Missing Skills</h3>
                <span className="ml-auto text-xs font-bold bg-red-100 text-red-600 rounded-full px-2 py-0.5">
                  {result.missingSkills?.length || 0}
                </span>
              </div>
              {result.missingSkills?.length === 0 ? (
                <div className="text-center py-4">
                  <CheckCircle2 size={28} className="text-emerald-500 mx-auto mb-1" />
                  <p className="text-xs text-emerald-600 font-semibold">You have all required skills!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {result.missingSkills?.map((s: any) => (
                    <div key={s.skill} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-red-100">
                      <div>
                        <div className="text-xs font-semibold text-slate-800">{s.skill}</div>
                        <div className="text-[10px] text-red-500">{s.mandatory ? "Mandatory" : "Preferred"}</div>
                      </div>
                      <Link href="/student/learning" className="text-[10px] font-bold text-blue-600 hover:underline">
                        Learn →
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Priority Skills */}
          {result.prioritySkills?.length > 0 && (
            <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={18} className="text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Priority Skills to Learn</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {result.prioritySkills.map((skill: string, i: number) => (
                  <div key={skill} className="flex items-center gap-2 bg-white border border-blue-200 rounded-xl px-4 py-2 shadow-sm">
                    <span className="text-blue-600 font-extrabold text-sm">#{i + 1}</span>
                    <span className="text-sm font-semibold text-slate-800">{skill}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/student/learning"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
              >
                <BookOpen size={15} /> Start Learning These Skills
                <ArrowRight size={14} />
              </Link>
            </div>
          )}

          {/* Suggested Resources */}
          {result.suggestedResources?.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Recommended Courses for Missing Skills</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.suggestedResources.map((r: any) => (
                  <div key={r.id} className="flex gap-3 border border-slate-200 rounded-xl p-3">
                    <div className="h-8 w-8 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                      <BookOpen size={14} className="text-purple-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">{r.title}</div>
                      <div className="text-[11px] text-slate-500">{r.provider} · {r.cost}</div>
                      {r.skill && <div className="text-[11px] text-purple-600 font-medium">Covers: {r.skill.name}</div>}
                    </div>
                    <a href={r.url} target="_blank" rel="noreferrer"
                      className="shrink-0 self-center text-xs font-bold text-blue-600 hover:underline">
                      Start →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty state (no role selected) */}
      {!loading && !selectedRole && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Target size={40} className="text-slate-300 mx-auto mb-3" />
          <p className="text-base font-semibold text-slate-500">Select a target role above to start</p>
          <p className="text-sm text-slate-400 mt-1">We'll compare your skills against industry requirements.</p>
        </div>
      )}
    </div>
  );
}
