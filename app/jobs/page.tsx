"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2, Search, MapPin, Clock, Briefcase, Filter,
  ExternalLink, ChevronRight, DollarSign, Users,
  TrendingUp, Award, ArrowUpRight, AlertTriangle, RefreshCw
} from "lucide-react";

const WORK_MODES = ["ALL", "REMOTE", "ONSITE", "HYBRID"];

export default function JobsPage() {
  const [jobs, setJobs]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch]   = useState("");
  const [workMode, setWorkMode] = useState("ALL");

  const fetchJobs = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ type: "JOB" });
      if (workMode && workMode !== "ALL") params.set("workMode", workMode);
      if (search) params.set("search", search);
      const res  = await fetch(`/api/opportunities?${params.toString()}`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setJobs(data.opportunities || []);
    } catch {
      setError("Could not load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, [workMode]);

  // Client-side search filter (search triggers on input)
  const filtered = jobs.filter((j) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      j.title?.toLowerCase().includes(q) ||
      j.company?.companyName?.toLowerCase().includes(q) ||
      j.location?.toLowerCase().includes(q) ||
      j.skills?.some((s: any) => s.skill?.name?.toLowerCase().includes(q))
    );
  });

  const handleApply = (applyUrl: string) => {
    if (!applyUrl || applyUrl === "#") return;
    window.open(applyUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Graduate Placement &amp; Career Opportunities
        </h1>
        <p className="text-slate-600 max-w-2xl text-sm">
          Full-time roles from India&apos;s top companies. Click <strong>Apply Now</strong> to visit the company&apos;s official careers page directly.
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: Briefcase,  label: "Active Roles",     value: "1,240+",  color: "text-blue-600",    bg: "bg-blue-50" },
          { icon: Building2,  label: "Hiring Companies", value: "380+",    color: "text-emerald-600", bg: "bg-emerald-50" },
          { icon: TrendingUp, label: "Avg. CTC Offered", value: "₹12 LPA", color: "text-purple-600",  bg: "bg-purple-50" },
          { icon: Users,      label: "Students Placed",  value: "8,500+",  color: "text-amber-600",   bg: "bg-amber-50" },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl ${s.bg} border border-slate-100 p-4 flex items-center gap-3`}>
            <s.icon size={20} className={s.color} />
            <div>
              <div className={`text-lg font-extrabold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-500 font-medium">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchJobs()}
            placeholder="Search by role, company, skill, location…"
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Filter size={11} /> Work Mode:
          </span>
          {WORK_MODES.map((m) => (
            <button
              key={m}
              onClick={() => setWorkMode(m)}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition ${
                workMode === m
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
              }`}
            >
              {m === "ALL" ? "All Modes" : m}
            </button>
          ))}
        </div>
      </div>

      {/* Result count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 font-medium">
          {loading ? "Loading…" : `${filtered.length} job${filtered.length !== 1 ? "s" : ""} found`}
        </p>
        <Link
          href="/student/opportunities"
          className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
        >
          View in my dashboard <ChevronRight size={13} />
        </Link>
      </div>

      {/* States */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6 animate-pulse space-y-3">
              <div className="flex gap-3">
                <div className="h-12 w-12 bg-slate-200 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-2/3" />
                  <div className="h-3 bg-slate-100 rounded w-1/3" />
                </div>
              </div>
              <div className="h-10 bg-slate-100 rounded" />
              <div className="h-8 bg-slate-200 rounded-xl" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
          <AlertTriangle size={36} className="text-red-400 mx-auto mb-3" />
          <p className="text-sm font-semibold text-red-700">{error}</p>
          <button onClick={fetchJobs} className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-red-700 hover:underline">
            <RefreshCw size={13} /> Try Again
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Briefcase size={40} className="text-slate-300 mx-auto mb-3" />
          <p className="text-base font-semibold text-slate-500">No jobs found</p>
          <p className="text-sm text-slate-400 mt-1">Try different filters or search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((job) => {
            const daysLeft = Math.ceil(
              (new Date(job.deadline).getTime() - Date.now()) / 86_400_000
            );
            const hasApplyUrl = !!job.applyUrl && job.applyUrl !== "#";

            return (
              <div
                key={job.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition flex flex-col"
              >
                {/* Company header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-100 flex items-center justify-center shrink-0">
                    <Building2 size={22} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{job.title}</h3>
                        <p className="text-xs font-semibold text-blue-600 mt-0.5">
                          {job.company?.companyName}
                        </p>
                      </div>
                      {job.matchScore !== undefined && (
                        <span
                          className={`shrink-0 text-xs font-bold px-2 py-1 rounded-full ${
                            job.matchScore >= 75
                              ? "bg-emerald-50 text-emerald-700"
                              : job.matchScore >= 55
                              ? "bg-amber-50 text-amber-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {job.matchScore}% Match
                        </span>
                      )}
                    </div>
                    {job.badge && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${job.badgeColor} mt-1 inline-block`}>
                        {job.badge}
                      </span>
                    )}
                  </div>
                </div>

                {job.description && (
                  <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                    {job.workMode}
                  </span>
                  <span className="text-[10px] flex items-center gap-1 text-slate-500">
                    <MapPin size={9} /> {job.location}
                  </span>
                  <span className="text-[10px] flex items-center gap-1 font-semibold text-emerald-700">
                    <DollarSign size={9} /> {job.stipendOrSalary}
                  </span>
                  {job.vacancies && (
                    <span className="text-[10px] flex items-center gap-1 text-slate-500">
                      <Users size={9} /> {job.vacancies} seats
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {job.skills?.slice(0, 4).map((os: any) => (
                    <span
                      key={os.skill?.name}
                      className="text-[10px] font-medium bg-slate-100 text-slate-600 rounded-md px-2 py-0.5"
                    >
                      {os.skill?.name}
                    </span>
                  ))}
                </div>

                <div
                  className={`text-[11px] font-semibold mb-3 ${
                    daysLeft <= 10 ? "text-red-500" : "text-slate-400"
                  }`}
                >
                  ⏱{" "}
                  {daysLeft > 0
                    ? `${daysLeft} days left to apply`
                    : "Deadline passed"}
                </div>

                <div className="flex gap-2 mt-auto pt-3 border-t border-slate-100">
                  {hasApplyUrl ? (
                    <button
                      onClick={() => handleApply(job.applyUrl)}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                      Apply Now <ArrowUpRight size={12} />
                    </button>
                  ) : (
                    <button
                      disabled
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold bg-slate-100 text-slate-400 cursor-not-allowed"
                    >
                      No Apply Link
                    </button>
                  )}
                  <Link
                    href="/student/skill-gap"
                    className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                  >
                    Skill Gap <ChevronRight size={12} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom CTA */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-blue-900 p-8 text-center text-white">
        <Award size={32} className="mx-auto mb-3 text-amber-400" />
        <h3 className="text-xl font-extrabold mb-2">Boost your job match score</h3>
        <p className="text-slate-300 text-sm mb-5 max-w-md mx-auto">
          Students with verified skills get 4× more recruiter callbacks. Complete your Skill Passport today.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/student/skills"
            className="rounded-xl bg-white text-slate-900 px-6 py-2.5 text-sm font-bold hover:bg-slate-100 transition"
          >
            Add Skills
          </Link>
          <Link
            href="/student/dashboard"
            className="rounded-xl border border-white/30 text-white px-6 py-2.5 text-sm font-semibold hover:bg-white/10 transition"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
