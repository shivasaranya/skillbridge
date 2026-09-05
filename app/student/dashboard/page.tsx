"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart3, Briefcase, BookOpen, CalendarDays, CheckCircle2,
  AlertTriangle, ArrowRight, Sparkles, TrendingUp, Target,
  Clock, MapPin, DollarSign, Loader2, RefreshCw, ChevronRight,
  Award, Layers, Zap, Shield
} from "lucide-react";

const SKILL_STATUS = {
  strong: { icon: "✓", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", label: "Strong" },
  moderate: { icon: "⚠", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", label: "Improve" },
  missing: { icon: "✕", color: "text-red-500", bg: "bg-red-50", border: "border-red-200", label: "Missing" },
};

function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-5 animate-pulse ${className}`}>
      <div className="h-4 bg-slate-200 rounded w-1/2 mb-3" />
      <div className="h-8 bg-slate-200 rounded w-1/4 mb-2" />
      <div className="h-3 bg-slate-100 rounded w-3/4" />
    </div>
  );
}

export default function StudentDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applying, setApplying] = useState<string | null>(null);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());

  const loadDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/student/dashboard");
      if (!res.ok) throw new Error("Failed to load");
      const json = await res.json();
      setData(json);
      // Track already-applied IDs
      const applied = new Set<string>(
        (json.student?.applications || []).map((a: any) => a.opportunityId as string)
      );
      setAppliedIds(applied);
    } catch (e) {
      setError("Couldn't load your dashboard. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDashboard(); }, []);

  const handleQuickApply = async (oppId: string) => {
    setApplying(oppId);
    try {
      await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opportunityId: oppId, coverLetter: "I am interested in this opportunity." }),
      });
      setAppliedIds(prev => new Set<string>(Array.from(prev).concat(oppId)));
    } finally {
      setApplying(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
        <SkeletonCard className="h-40" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SkeletonCard className="h-56" />
          <SkeletonCard className="h-56" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <AlertTriangle className="h-12 w-12 text-amber-400" />
        <p className="text-slate-600 text-sm">{error}</p>
        <button onClick={loadDashboard} className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline">
          <RefreshCw size={14} /> Try Again
        </button>
      </div>
    );
  }

  const student = data?.student;
  const opportunities = data?.opportunities || [];
  const events = data?.events || [];
  const resources = data?.recommendedResources || [];
  const nextDrive = data?.nextDrive;
  const applications = student?.applications || [];
  const skills = student?.skills || [];

  const readinessScore = student?.readinessScore || 0;
  const profileCompletion = student?.profileCompletion || 0;
  const verifiedSkills = student?.verifiedSkillsCount || 0;
  const matchingOpps = student?.matchingOpportunitiesCount || 0;
  const firstName = student?.user?.firstName || "Student";

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  // Readiness label
  const readinessLabel = readinessScore >= 80 ? "Excellent" : readinessScore >= 60 ? "Good progress" : readinessScore >= 40 ? "Building up" : "Just getting started";
  const readinessColor = readinessScore >= 80 ? "text-emerald-600" : readinessScore >= 60 ? "text-blue-600" : "text-amber-600";

  return (
    <div className="space-y-6 pb-10">

      {/* ── GREETING HEADER ── */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold">
              {greeting}, {firstName}! 👋
            </h1>
            <p className="text-blue-100 text-sm mt-1">
              Here is your career readiness overview.
            </p>
            {student?.headline && (
              <p className="text-blue-200 text-xs mt-1 italic">{student.headline}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-3xl font-extrabold">{readinessScore}<span className="text-blue-200 text-lg">%</span></div>
              <div className="text-xs text-blue-200">Career Readiness</div>
              <div className={`text-xs font-bold text-white bg-white/20 rounded-full px-2 py-0.5 mt-1 inline-block`}>{readinessLabel}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4 METRIC CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-xl bg-blue-50 flex items-center justify-center">
              <BarChart3 size={16} className="text-blue-600" />
            </div>
            <span className="text-xs font-medium text-slate-500">Career Readiness</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{readinessScore}%</div>
          <div className="h-1.5 rounded-full bg-slate-100 mt-2 overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${readinessScore}%` }} />
          </div>
          <div className={`text-xs font-semibold mt-1 ${readinessColor}`}>{readinessLabel}</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-xl bg-amber-50 flex items-center justify-center">
              <Target size={16} className="text-amber-600" />
            </div>
            <span className="text-xs font-medium text-slate-500">Profile Completion</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{profileCompletion}%</div>
          <div className="h-1.5 rounded-full bg-slate-100 mt-2 overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${profileCompletion}%` }} />
          </div>
          <Link href="/student/profile" className="text-xs font-semibold text-amber-600 mt-1 hover:underline block">
            {profileCompletion < 100 ? "Complete profile →" : "Profile complete ✓"}
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Shield size={16} className="text-emerald-600" />
            </div>
            <span className="text-xs font-medium text-slate-500">Verified Skills</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{verifiedSkills}</div>
          <div className="text-xs text-slate-400 mt-1">{skills.length} total skills added</div>
          <Link href="/student/skills" className="text-xs font-semibold text-emerald-600 mt-1 hover:underline block">
            {skills.length === 0 ? "Add skills →" : "Manage skills →"}
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-xl bg-purple-50 flex items-center justify-center">
              <Briefcase size={16} className="text-purple-600" />
            </div>
            <span className="text-xs font-medium text-slate-500">Matching Opportunities</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{matchingOpps}</div>
          <div className="text-xs text-slate-400 mt-1">{applications.length} applied</div>
          <Link href="/student/opportunities" className="text-xs font-semibold text-purple-600 mt-1 hover:underline block">
            Explore all →
          </Link>
        </div>
      </div>

      {/* ── NEXT DRIVE PREPARATION ── */}
      {nextDrive ? (
        <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">Prepare for Next Drive</h2>
            </div>
            <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-full border border-blue-200">
              {nextDrive.matchScore || 0}% Match
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="flex-1">
              <h3 className="text-sm font-bold text-slate-900">{nextDrive.title}</h3>
              <p className="text-xs text-blue-600 font-semibold">{nextDrive.company?.companyName}</p>
              <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
                <span className="flex items-center gap-1"><MapPin size={11} />{nextDrive.location}</span>
                <span className="flex items-center gap-1"><DollarSign size={11} />{nextDrive.stipendOrSalary}</span>
                <span className="flex items-center gap-1"><Clock size={11} />Deadline: {new Date(nextDrive.deadline).toLocaleDateString("en-IN")}</span>
              </div>
            </div>
            <Link
              href="/student/opportunities"
              className="shrink-0 flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition"
            >
              View Opportunity <ChevronRight size={12} />
            </Link>
          </div>

          {/* Required skills breakdown */}
          {nextDrive.skills && nextDrive.skills.length > 0 && (
            <div className="mt-4 pt-4 border-t border-blue-100">
              <p className="text-xs font-semibold text-slate-700 mb-3">Required Skills:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {nextDrive.skills.slice(0, 6).map((os: any) => {
                  const studentHasSkill = skills.some(
                    (ss: any) => ss.skill?.name?.toLowerCase() === os.skill?.name?.toLowerCase()
                  );
                  const status = studentHasSkill ? "strong" : "missing";
                  const s = SKILL_STATUS[status];
                  return (
                    <div key={os.id} className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border ${s.bg} ${s.border}`}>
                      <span className={`font-bold ${s.color}`}>{s.icon}</span>
                      <span className={`font-medium ${s.color}`}>{os.skill?.name}</span>
                    </div>
                  );
                })}
              </div>
              <Link href="/student/skill-gap" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline">
                <Target size={12} /> Analyze Full Skill Gap →
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <Briefcase size={32} className="text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-500">No upcoming drives found</p>
          <Link href="/student/opportunities" className="text-xs text-blue-600 font-semibold hover:underline mt-1 inline-block">
            Browse all opportunities →
          </Link>
        </div>
      )}

      {/* ── RECOMMENDED OPPORTUNITIES ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-amber-500" />
            <h2 className="text-base font-bold text-slate-900">Recommended for You</h2>
          </div>
          <Link href="/student/opportunities" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
            Browse All <ArrowRight size={12} />
          </Link>
        </div>

        {opportunities.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <Briefcase size={32} className="text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">No opportunities found yet.</p>
            <p className="text-xs text-slate-400 mt-1">Add more skills to unlock opportunity matching.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {opportunities.slice(0, 4).map((opp: any) => (
              <div key={opp.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{opp.title}</h3>
                    <p className="text-xs font-semibold text-blue-600">{opp.company?.companyName}</p>
                    <div className="flex gap-2 mt-1 text-xs text-slate-400">
                      <span className="flex items-center gap-0.5"><MapPin size={10} />{opp.location}</span>
                      <span className="flex items-center gap-0.5"><Clock size={10} />{new Date(opp.deadline).toLocaleDateString("en-IN")}</span>
                    </div>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold border ${
                    opp.matchScore >= 70 ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                    opp.matchScore >= 50 ? "bg-amber-50 text-amber-700 border-amber-200" :
                    "bg-slate-50 text-slate-500 border-slate-200"
                  }`}>
                    {opp.matchScore}% Match
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 mb-3 flex-1">
                  {opp.skills?.slice(0, 3).map((os: any) => (
                    <span key={os.id} className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                      {os.skill?.name}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-xs font-bold text-slate-800">{opp.stipendOrSalary}</span>
                  <button
                    onClick={() => !appliedIds.has(opp.id) && handleQuickApply(opp.id)}
                    disabled={applying === opp.id || appliedIds.has(opp.id)}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                      appliedIds.has(opp.id)
                        ? "bg-emerald-100 text-emerald-700 cursor-default"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {applying === opp.id ? <Loader2 size={12} className="animate-spin" /> : null}
                    {appliedIds.has(opp.id) ? "✓ Applied" : "Quick Apply"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── LEARNING + EVENTS ROW ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recommended Learning */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen size={18} className="text-purple-600" />
              <h2 className="text-base font-bold text-slate-900">Recommended Learning</h2>
            </div>
            <Link href="/student/learning" className="text-xs font-semibold text-blue-600 hover:underline">
              View All →
            </Link>
          </div>

          {resources.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
              <BookOpen size={28} className="text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">Add skills to get personalized course recommendations.</p>
              <Link href="/student/skills" className="text-xs text-blue-600 font-semibold hover:underline mt-1 inline-block">Add Skills →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {resources.slice(0, 3).map((r: any) => (
                <div key={r.id} className="rounded-xl border border-slate-200 bg-white p-4 flex gap-3">
                  <div className="h-9 w-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
                    <BookOpen size={16} className="text-purple-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-slate-900 truncate">{r.title}</div>
                    <div className="text-xs text-slate-500">{r.provider} · {r.estimatedHours}h · <span className={r.cost === "FREE" ? "text-emerald-600 font-semibold" : "text-slate-500"}>{r.cost}</span></div>
                    {r.skill && <div className="text-[11px] text-purple-600 mt-0.5 font-medium">→ {r.skill.name}</div>}
                  </div>
                  <a href={r.url} target="_blank" rel="noreferrer"
                    className="shrink-0 text-xs font-semibold text-blue-600 hover:underline self-center">
                    Start →
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Tech Events */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CalendarDays size={18} className="text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">Active Tech Events</h2>
            </div>
            <Link href="/student/events" className="text-xs font-semibold text-blue-600 hover:underline">
              View All →
            </Link>
          </div>

          {events.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
              <CalendarDays size={28} className="text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No upcoming events right now.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {events.slice(0, 3).map((ev: any) => (
                <div key={ev.id} className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 text-center bg-emerald-50 border border-emerald-100 rounded-xl p-2 min-w-[48px]">
                      <div className="text-xs font-bold text-emerald-700">
                        {new Date(ev.date).toLocaleString("en-IN", { month: "short" }).toUpperCase()}
                      </div>
                      <div className="text-lg font-extrabold text-slate-900 leading-none">
                        {new Date(ev.date).getDate()}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold text-slate-900 truncate">{ev.name}</div>
                      <div className="text-xs text-slate-500">{ev.organizer}</div>
                      <div className="flex gap-2 mt-1">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${ev.mode === "ONLINE" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"}`}>
                          {ev.mode}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{ev.type}</span>
                      </div>
                    </div>
                    <Link href="/student/events" className="shrink-0 text-xs font-semibold text-blue-600 hover:underline">
                      Register →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── APPLICATION STATUS ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">Application Status</h2>
          </div>
          <Link href="/student/applications" className="text-xs font-semibold text-blue-600 hover:underline">
            View All →
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <Briefcase size={32} className="text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-500">No applications yet.</p>
            <Link href="/student/opportunities" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline">
              Explore Opportunities <ArrowRight size={12} />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.slice(0, 3).map((app: any) => {
              const stages = ["APPLIED", "REVIEWING", "SHORTLISTED", "INTERVIEW", "SELECTED"];
              const idx = stages.indexOf(app.status);
              return (
                <div key={app.id} className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-sm font-bold text-slate-900">{app.opportunity?.title}</div>
                      <div className="text-xs text-slate-500">{app.opportunity?.company?.companyName}</div>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2 py-0.5">{app.matchScore}%</span>
                      <span className={`text-xs font-bold rounded-full px-2 py-0.5 ${app.status === "SELECTED" ? "bg-emerald-100 text-emerald-700" : app.status === "REJECTED" ? "bg-red-100 text-red-600" : "bg-blue-50 text-blue-700"}`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-1">
                    {stages.map((s, i) => (
                      <div key={s} className="text-center">
                        <div className={`h-1.5 rounded-full mb-1 ${i <= idx ? "bg-blue-500" : "bg-slate-200"}`} />
                        <span className={`text-[9px] font-medium ${i === idx ? "text-blue-700 font-bold" : "text-slate-400"}`}>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── AI CAREER ASSISTANT TEASER ── */}
      <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-2xl bg-purple-600 flex items-center justify-center shrink-0 shadow-lg">
            <Sparkles size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-slate-900">AI Career Assistant</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ask me anything about your career, skill gaps, or which opportunities suit you best.
            </p>
            <div className="mt-3 space-y-2">
              {[
                "What skills should I learn to become a Full Stack Developer?",
                `Why is my readiness score ${readinessScore}%?`,
                "Which upcoming internship suits me best?",
              ].map((q) => (
                <Link key={q} href={`/student/learning?q=${encodeURIComponent(q)}`}
                  className="block text-xs text-purple-700 bg-white border border-purple-200 rounded-xl px-3 py-2 hover:bg-purple-50 transition font-medium truncate">
                  💬 {q}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
