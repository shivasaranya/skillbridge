"use client";

import { useEffect, useState } from "react";
import {
  Users, Loader2, CheckCircle2, XCircle, Github, Linkedin,
  FileText, ExternalLink, Search, ChevronDown, Star,
} from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  APPLIED:     { label: "Applied",     color: "bg-blue-100 text-blue-700 border-blue-200" },
  REVIEWING:   { label: "Reviewing",   color: "bg-amber-100 text-amber-700 border-amber-200" },
  SHORTLISTED: { label: "Shortlisted", color: "bg-purple-100 text-purple-700 border-purple-200" },
  INTERVIEW:   { label: "Interview",   color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  SELECTED:    { label: "Selected",    color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  REJECTED:    { label: "Rejected",    color: "bg-red-100 text-red-700 border-red-200" },
};

export default function IndustryApplicantsPage() {
  const [applicants, setApplicants] = useState<any[]>([]);
  const [vacancies, setVacancies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingApp, setUpdatingApp] = useState<string | null>(null);
  const [vacancyFilter, setVacancyFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const load = async () => {
    try {
      const [appRes, vacRes] = await Promise.all([
        fetch("/api/industry/applicants"),
        fetch("/api/industry/vacancies"),
      ]);
      const appData = await appRes.json();
      const vacData = await vacRes.json();
      setApplicants(appData.applicants ?? []);
      setVacancies(vacData.vacancies ?? []);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleStatus = async (appId: string, status: string) => {
    setUpdatingApp(appId);
    try {
      await fetch("/api/industry/applicants", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: appId, status }),
      });
      setApplicants((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status } : a))
      );
    } catch {}
    finally { setUpdatingApp(null); }
  };

  const filtered = applicants.filter((app) => {
    if (vacancyFilter !== "ALL" && app.opportunityId !== vacancyFilter) return false;
    if (statusFilter !== "ALL" && app.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const name = `${app.student?.user?.firstName ?? ""} ${app.student?.user?.lastName ?? ""}`.toLowerCase();
      if (!name.includes(q) && !app.opportunity?.title?.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  if (loading) {
    return <div className="min-h-[50vh] flex items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-purple-600" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2"><Users size={20} className="text-blue-600" /> Applicants</h1>
        <p className="text-sm text-slate-500 mt-0.5">{applicants.length} total applications across all your vacancies</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or vacancy..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 bg-white" />
        </div>
        <select value={vacancyFilter} onChange={(e) => setVacancyFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-purple-400">
          <option value="ALL">All Vacancies</option>
          {vacancies.map((v) => <option key={v.id} value={v.id}>{v.title}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-purple-400">
          <option value="ALL">All Statuses</option>
          {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Users size={40} className="text-slate-200 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">
            {applicants.length === 0
              ? "No applications received yet. Post vacancies to start receiving applications."
              : "No applicants match your filters."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => {
            const cfg = STATUS_CONFIG[app.status] ?? { label: app.status, color: "bg-slate-100 text-slate-600 border-slate-200" };
            const s = app.student;
            const name = `${s?.user?.firstName ?? ""} ${s?.user?.lastName ?? ""}`.trim() || "Unknown";
            const initials = name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
            return (
              <div key={app.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Avatar + Name */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-slate-900">{name}</span>
                        <span className={`text-[10px] font-bold border rounded-md px-2 py-0.5 ${cfg.color}`}>{cfg.label}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 rounded px-1.5 py-0.5">{app.matchScore?.toFixed(0)}% match</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {s?.degree ?? "—"} · CGPA: {s?.cgpa ?? "—"}
                        {s?.institution?.name && <> · {s.institution.name}</>}
                      </div>
                      <div className="text-xs text-purple-700 font-medium mt-0.5">Applied: {app.opportunity?.title}</div>

                      {/* Skills */}
                      {s?.skills?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {s.skills.slice(0, 6).map((ss: any) => (
                            <span key={ss.skillId} className="text-[10px] bg-slate-100 text-slate-600 rounded px-1.5 py-0.5">{ss.skill?.name}</span>
                          ))}
                          {s.skills.length > 6 && <span className="text-[10px] text-slate-400">+{s.skills.length - 6}</span>}
                        </div>
                      )}

                      {/* Links */}
                      <div className="flex items-center gap-3 mt-2">
                        {s?.linkedinUrl && <a href={s.linkedinUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-0.5"><Linkedin size={11} />LinkedIn</a>}
                        {s?.githubUrl && <a href={s.githubUrl} target="_blank" rel="noreferrer" className="text-xs text-slate-600 hover:underline flex items-center gap-0.5"><Github size={11} />GitHub</a>}
                        {s?.resumeUrl && <a href={s.resumeUrl} target="_blank" rel="noreferrer" className="text-xs text-purple-600 hover:underline flex items-center gap-0.5"><FileText size={11} />Resume</a>}
                        {s?.portfolioUrl && <a href={s.portfolioUrl} target="_blank" rel="noreferrer" className="text-xs text-amber-600 hover:underline flex items-center gap-0.5"><ExternalLink size={11} />Portfolio</a>}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 shrink-0">
                    {app.status === "APPLIED" && (
                      <>
                        <button onClick={() => handleStatus(app.id, "SHORTLISTED")} disabled={updatingApp === app.id}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 transition">
                          {updatingApp === app.id ? <Loader2 size={11} className="animate-spin" /> : "Shortlist"}
                        </button>
                        <button onClick={() => handleStatus(app.id, "REJECTED")} disabled={updatingApp === app.id}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 transition">
                          Reject
                        </button>
                      </>
                    )}
                    {app.status === "SHORTLISTED" && (
                      <button onClick={() => handleStatus(app.id, "INTERVIEW")} disabled={updatingApp === app.id}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition">
                        Call Interview
                      </button>
                    )}
                    {app.status === "INTERVIEW" && (
                      <button onClick={() => handleStatus(app.id, "SELECTED")} disabled={updatingApp === app.id}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition">
                        Select
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
