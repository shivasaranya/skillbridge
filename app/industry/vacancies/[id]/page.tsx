"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Briefcase, Users, MapPin, CalendarDays, CheckCircle2,
  XCircle, Clock, Loader2, ExternalLink, Github, Linkedin,
  Star, FileText, ChevronDown,
} from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  APPLIED:     { label: "Applied",     color: "bg-blue-100 text-blue-700 border-blue-200" },
  REVIEWING:   { label: "Reviewing",   color: "bg-amber-100 text-amber-700 border-amber-200" },
  SHORTLISTED: { label: "Shortlisted", color: "bg-purple-100 text-purple-700 border-purple-200" },
  INTERVIEW:   { label: "Interview",   color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  SELECTED:    { label: "Selected",    color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  REJECTED:    { label: "Rejected",    color: "bg-red-100 text-red-700 border-red-200" },
};

export default function VacancyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [vacancy, setVacancy] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updatingApp, setUpdatingApp] = useState<string | null>(null);
  const [closingVacancy, setClosingVacancy] = useState(false);

  const load = async () => {
    try {
      const res = await fetch(`/api/industry/vacancies/${id}`);
      const data = await res.json();
      if (res.ok) setVacancy(data.vacancy);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [id]);

  const handleStatusChange = async (appId: string, status: string) => {
    setUpdatingApp(appId);
    try {
      await fetch("/api/industry/applicants", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: appId, status }),
      });
      await load();
    } catch {} finally { setUpdatingApp(null); }
  };

  const handleToggleVacancy = async () => {
    setClosingVacancy(true);
    const newStatus = vacancy.status === "OPEN" ? "CLOSED" : "OPEN";
    try {
      await fetch(`/api/industry/vacancies/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      await load();
    } catch {} finally { setClosingVacancy(false); }
  };

  if (loading) return <div className="min-h-[50vh] flex items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-purple-600" /></div>;
  if (!vacancy) return <div className="text-center py-16 text-slate-500">Vacancy not found.</div>;

  const deadline = vacancy.deadline ? new Date(vacancy.deadline) : null;
  const isExpired = deadline && deadline < new Date();
  const isOpen = vacancy.status === "OPEN";
  const apps = vacancy.applications ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Link href="/industry/vacancies" className="h-8 w-8 mt-0.5 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition shrink-0">
            <ArrowLeft size={15} className="text-slate-600" />
          </Link>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">{vacancy.title}</h1>
            <div className="flex flex-wrap gap-2 mt-1 text-xs text-slate-500">
              <span className="flex items-center gap-1"><MapPin size={11} />{vacancy.location}</span>
              <span>·</span>
              <span>{vacancy.type}</span>
              <span>·</span>
              <span>{vacancy.workMode}</span>
              {deadline && <span className={`flex items-center gap-1 ${isExpired ? "text-red-500" : ""}`}><CalendarDays size={11} />Deadline: {deadline.toLocaleDateString("en-IN")}</span>}
            </div>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <span className={`self-start text-[10px] font-bold rounded-full px-2.5 py-1 border ${isOpen ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
            {isOpen ? "● Active" : "● Closed"}
          </span>
          <button onClick={handleToggleVacancy} disabled={closingVacancy}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition">
            {closingVacancy ? <Loader2 size={11} className="animate-spin" /> : isOpen ? <XCircle size={13} /> : null}
            {isOpen ? "Close Vacancy" : "Reopen Vacancy"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vacancy Details */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 text-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Vacancy Details</h2>
            <div className="space-y-2 text-slate-700">
              <div className="flex justify-between"><span className="text-slate-500">Stipend/Salary</span><span className="font-semibold">{vacancy.stipendOrSalary}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Openings</span><span className="font-semibold">{vacancy.vacancies}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Min CGPA</span><span className="font-semibold">{vacancy.minCgpa}</span></div>
              {vacancy.durationMonths && <div className="flex justify-between"><span className="text-slate-500">Duration</span><span className="font-semibold">{vacancy.durationMonths} months</span></div>}
            </div>

            {vacancy.skills?.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-slate-500 mb-2">Required Skills</div>
                <div className="flex flex-wrap gap-1.5">
                  {vacancy.skills.map((s: any) => (
                    <span key={s.id} className="text-[10px] bg-purple-50 border border-purple-200 text-purple-700 rounded-lg px-2 py-0.5 font-semibold">{s.skill?.name}</span>
                  ))}
                </div>
              </div>
            )}

            <Link href="/industry/recommended" className="flex items-center justify-center gap-1.5 w-full rounded-xl bg-purple-600 text-white text-xs font-semibold py-2 hover:bg-purple-700 transition">
              <Star size={13} /> Find Recommended Candidates
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm text-sm text-slate-700">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Description</h2>
            <p className="text-sm leading-relaxed text-slate-600">{vacancy.description}</p>
            {vacancy.responsibilities && (
              <><div className="text-xs font-bold text-slate-500 mt-3 mb-1">Responsibilities</div><p className="text-sm text-slate-600">{vacancy.responsibilities}</p></>
            )}
            {vacancy.eligibility && (
              <><div className="text-xs font-bold text-slate-500 mt-3 mb-1">Eligibility</div><p className="text-sm text-slate-600">{vacancy.eligibility}</p></>
            )}
          </div>
        </div>

        {/* Applications */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2"><Users size={15} className="text-blue-600" /> Applicants ({apps.length})</h2>
              <Link href="/industry/applicants" className="text-xs text-purple-600 font-semibold hover:underline">View all →</Link>
            </div>

            {apps.length === 0 ? (
              <div className="p-10 text-center">
                <Users size={36} className="text-slate-200 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No applications yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {apps.map((app: any) => {
                  const cfg = STATUS_CONFIG[app.status] ?? { label: app.status, color: "bg-slate-100 text-slate-600 border-slate-200" };
                  const student = app.student;
                  const name = `${student?.user?.firstName ?? ""} ${student?.user?.lastName ?? ""}`.trim() || "Unknown";
                  return (
                    <div key={app.id} className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                              {name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-slate-900">{name}</div>
                              <div className="text-xs text-slate-500">{student?.degree} · CGPA: {student?.cgpa}</div>
                            </div>
                            <span className={`text-[10px] font-bold border rounded-md px-2 py-0.5 ${cfg.color}`}>{cfg.label}</span>
                            <span className="text-[10px] bg-slate-100 text-slate-600 rounded px-1.5 py-0.5">{app.matchScore?.toFixed(0)}% match</span>
                          </div>

                          {student?.institution && (
                            <div className="text-xs text-slate-500 mt-1 ml-10">{student.institution.name}</div>
                          )}

                          {student?.skills?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2 ml-10">
                              {student.skills.slice(0, 5).map((ss: any) => (
                                <span key={ss.skillId} className="text-[10px] bg-slate-100 text-slate-600 rounded px-1.5 py-0.5">{ss.skill?.name}</span>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center gap-3 mt-2 ml-10">
                            {student?.linkedinUrl && <a href={student.linkedinUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-xs flex items-center gap-0.5"><Linkedin size={11} />LinkedIn</a>}
                            {student?.githubUrl && <a href={student.githubUrl} target="_blank" rel="noreferrer" className="text-slate-600 hover:underline text-xs flex items-center gap-0.5"><Github size={11} />GitHub</a>}
                            {student?.resumeUrl && <a href={student.resumeUrl} target="_blank" rel="noreferrer" className="text-purple-600 hover:underline text-xs flex items-center gap-0.5"><FileText size={11} />Resume</a>}
                            {student?.portfolioUrl && <a href={student.portfolioUrl} target="_blank" rel="noreferrer" className="text-amber-600 hover:underline text-xs flex items-center gap-0.5"><ExternalLink size={11} />Portfolio</a>}
                          </div>
                        </div>

                        <div className="flex gap-2 shrink-0">
                          {app.status === "APPLIED" && (
                            <>
                              <button onClick={() => handleStatusChange(app.id, "SHORTLISTED")} disabled={updatingApp === app.id}
                                className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 transition">
                                {updatingApp === app.id ? <Loader2 size={11} className="animate-spin" /> : "Shortlist"}
                              </button>
                              <button onClick={() => handleStatusChange(app.id, "REJECTED")} disabled={updatingApp === app.id}
                                className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 transition">
                                Reject
                              </button>
                            </>
                          )}
                          {app.status === "SHORTLISTED" && (
                            <button onClick={() => handleStatusChange(app.id, "INTERVIEW")} disabled={updatingApp === app.id}
                              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition">
                              Call for Interview
                            </button>
                          )}
                          {app.status === "INTERVIEW" && (
                            <button onClick={() => handleStatusChange(app.id, "SELECTED")} disabled={updatingApp === app.id}
                              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition">
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
        </div>
      </div>
    </div>
  );
}
