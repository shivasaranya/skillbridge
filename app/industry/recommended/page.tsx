"use client";

import { useEffect, useState } from "react";
import {
  Sparkles, Loader2, AlertCircle, CheckCircle2, Star, Github,
  Linkedin, FileText, ExternalLink, ChevronDown, Users, Briefcase,
} from "lucide-react";

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80 ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
    score >= 60 ? "bg-blue-100 text-blue-700 border-blue-200" :
    score >= 40 ? "bg-amber-100 text-amber-700 border-amber-200" :
    "bg-slate-100 text-slate-500 border-slate-200";
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-bold border rounded-full px-2.5 py-1 ${color}`}>
      <Star size={10} /> {score}% Match
    </span>
  );
}

export default function IndustryRecommendedPage() {
  const [vacancies, setVacancies] = useState<any[]>([]);
  const [selectedVacancy, setSelectedVacancy] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [vacancyTitle, setVacancyTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [vacanciesLoading, setVacanciesLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/industry/vacancies?status=OPEN")
      .then((r) => r.json())
      .then((d) => {
        setVacancies(d.vacancies ?? []);
        if (d.vacancies?.length > 0) setSelectedVacancy(d.vacancies[0].id);
      })
      .finally(() => setVacanciesLoading(false));
  }, []);

  const fetchRecommendations = async (vacancyId: string) => {
    if (!vacancyId) return;
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const res = await fetch(`/api/industry/recommended?vacancyId=${vacancyId}`);
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to fetch."); return; }
      setResults(data.recommendations ?? []);
      setVacancyTitle(data.vacancyTitle ?? "");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedVacancy) fetchRecommendations(selectedVacancy);
  }, [selectedVacancy]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <Sparkles size={20} className="text-amber-500" /> Recommended Candidates
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Real students from SkillBridge database, matched by skills, qualification, and alignment to your vacancy.
        </p>
      </div>

      {/* Vacancy Selector */}
      {vacanciesLoading ? (
        <div className="flex items-center gap-2 text-sm text-slate-500"><Loader2 size={15} className="animate-spin text-purple-600" /> Loading vacancies...</div>
      ) : vacancies.length === 0 ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 flex items-center gap-2">
          <AlertCircle size={15} className="shrink-0" />
          No active vacancies. <a href="/industry/vacancies/new" className="font-semibold underline ml-1">Post a vacancy</a> to find matching candidates.
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <label className="text-sm font-semibold text-slate-700 shrink-0">Select Vacancy:</label>
          <div className="relative flex-1 max-w-lg">
            <select value={selectedVacancy} onChange={(e) => setSelectedVacancy(e.target.value)}
              className="w-full appearance-none px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 pr-9">
              {vacancies.map((v) => <option key={v.id} value={v.id}>{v.title} — {v.location}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          <AlertCircle size={15} className="shrink-0" /> {error}
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <p className="text-sm text-slate-500">Running skill-match algorithm across student database...</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700">
              <span className="text-purple-700">{results.length}</span> candidates matched for <span className="text-purple-700">&quot;{vacancyTitle}&quot;</span>
            </p>
            <p className="text-xs text-slate-400">Sorted by match score (highest first)</p>
          </div>

          {results.map((r, idx) => {
            const s = r.student;
            const name = `${s.user.firstName} ${s.user.lastName}`;
            const initials = name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

            return (
              <div key={s.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Rank badge */}
                    <div className={`h-8 w-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${idx === 0 ? "bg-amber-100 text-amber-700" : idx === 1 ? "bg-slate-200 text-slate-700" : idx === 2 ? "bg-orange-100 text-orange-700" : "bg-slate-100 text-slate-600"}`}>
                      #{idx + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-sm font-bold text-slate-900">{name}</span>
                        <ScoreBadge score={r.overallScore} />
                        {r.alreadyApplied && (
                          <span className="text-[10px] bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full px-2 py-0.5 font-semibold flex items-center gap-0.5">
                            <CheckCircle2 size={9} /> Applied
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-500">
                        {s.degree} · CGPA: <span className={s.cgpa >= 7.5 ? "text-emerald-600 font-semibold" : "text-amber-600 font-semibold"}>{s.cgpa}</span>
                        {s.institution && <> · {s.institution.name}</>}
                      </div>

                      {/* Match breakdown */}
                      <div className="flex flex-wrap gap-3 mt-2">
                        {[
                          { label: "Skills", value: r.skillScore },
                          { label: "Academic", value: r.qualificationScore },
                          { label: "Department", value: r.branchScore },
                        ].map(({ label, value }) => (
                          <div key={label} className="flex items-center gap-1.5">
                            <span className="text-[10px] text-slate-400">{label}</span>
                            <div className="w-20 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                              <div className={`h-full rounded-full ${value >= 80 ? "bg-emerald-400" : value >= 50 ? "bg-blue-400" : "bg-amber-400"}`} style={{ width: `${value}%` }} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-600">{value}%</span>
                          </div>
                        ))}
                      </div>

                      {/* Matched / Missing skills */}
                      {r.matchedSkills.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {r.matchedSkills.map((sk: string) => (
                            <span key={sk} className="text-[10px] bg-emerald-50 border border-emerald-200 text-emerald-700 rounded px-1.5 py-0.5">✓ {sk}</span>
                          ))}
                          {r.missingSkills.map((sk: string) => (
                            <span key={sk} className="text-[10px] bg-red-50 border border-red-200 text-red-600 rounded px-1.5 py-0.5">✗ {sk}</span>
                          ))}
                        </div>
                      )}

                      {/* Links */}
                      <div className="flex items-center gap-3 mt-2">
                        {s.linkedinUrl && <a href={s.linkedinUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-0.5"><Linkedin size={11} />LinkedIn</a>}
                        {s.githubUrl && <a href={s.githubUrl} target="_blank" rel="noreferrer" className="text-xs text-slate-600 hover:underline flex items-center gap-0.5"><Github size={11} />GitHub</a>}
                        {s.resumeUrl && <a href={s.resumeUrl} target="_blank" rel="noreferrer" className="text-xs text-purple-600 hover:underline flex items-center gap-0.5"><FileText size={11} />Resume</a>}
                        {s.portfolioUrl && <a href={s.portfolioUrl} target="_blank" rel="noreferrer" className="text-xs text-amber-600 hover:underline flex items-center gap-0.5"><ExternalLink size={11} />Portfolio</a>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && results.length === 0 && selectedVacancy && !error && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Users size={40} className="text-slate-200 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">No matching candidates found yet.</p>
          <p className="text-xs text-slate-400 mt-1">This could mean no students have added the required skills yet, or your vacancy has no skill requirements.</p>
        </div>
      )}
    </div>
  );
}
