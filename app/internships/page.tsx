"use client";

import { useEffect, useState } from "react";
import {
  Briefcase, Search, MapPin, Clock, DollarSign, Users,
  Filter, AlertTriangle, RefreshCw, ArrowUpRight, Building2, ChevronRight
} from "lucide-react";
import Link from "next/link";

const WORK_MODES = ["ALL", "REMOTE", "ONSITE", "HYBRID"];

export default function InternshipsPage() {
  const [internships, setInternships] = useState<any[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [search, setSearch]           = useState("");
  const [workMode, setWorkMode]       = useState("ALL");

  const fetchInternships = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ type: "INTERNSHIP" });
      if (workMode && workMode !== "ALL") params.set("workMode", workMode);
      if (search) params.set("search", search);
      const res  = await fetch(`/api/opportunities?${params.toString()}`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setInternships(data.opportunities || []);
    } catch {
      setError("Could not load internships. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInternships(); }, [workMode]);

  // Client-side search filter
  const filtered = internships.filter((opp) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      opp.title?.toLowerCase().includes(q) ||
      opp.company?.companyName?.toLowerCase().includes(q) ||
      opp.location?.toLowerCase().includes(q) ||
      opp.skills?.some((s: any) => s.skill?.name?.toLowerCase().includes(q))
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
          Explore Industry Internships
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl">
          Verified internship opportunities from top companies and government schemes.
          Click <strong>Apply Now</strong> to go directly to the official application page.
        </p>
      </div>

      {/* Search + Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchInternships()}
            placeholder="Search by role, company, skill, or location…"
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
      <p className="text-sm text-slate-500 font-medium">
        {loading ? "Loading…" : `${filtered.length} internship${filtered.length !== 1 ? "s" : ""} found`}
      </p>

      {/* States */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6 animate-pulse space-y-3">
              <div className="h-4 bg-slate-200 rounded w-2/3" />
              <div className="h-3 bg-slate-100 rounded w-1/2" />
              <div className="h-10 bg-slate-100 rounded" />
              <div className="h-8 bg-slate-200 rounded-xl" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
          <AlertTriangle size={36} className="text-red-400 mx-auto mb-3" />
          <p className="text-sm font-semibold text-red-700">{error}</p>
          <button
            onClick={fetchInternships}
            className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-red-700 hover:underline"
          >
            <RefreshCw size={13} /> Try Again
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Briefcase size={40} className="text-slate-300 mx-auto mb-3" />
          <p className="text-base font-semibold text-slate-500">No internships found</p>
          <p className="text-sm text-slate-400 mt-1">Try different filters or search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((opp) => {
            const daysLeft = Math.ceil(
              (new Date(opp.deadline).getTime() - Date.now()) / 86_400_000
            );
            const hasApplyUrl = !!opp.applyUrl && opp.applyUrl !== "#";

            return (
              <div
                key={opp.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition flex flex-col space-y-4"
              >
                {/* Title & Company */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="h-11 w-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                      <Building2 size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <span className="inline-flex rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-1">
                        {opp.workMode} • INTERNSHIP
                        {opp.durationMonths ? ` • ${opp.durationMonths}m` : ""}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">{opp.title}</h3>
                      <p className="text-xs font-semibold text-blue-600">{opp.company?.companyName}</p>
                    </div>
                  </div>
                  {opp.matchScore !== undefined && (
                    <span
                      className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full border ${
                        opp.matchScore >= 75
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : opp.matchScore >= 55
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-slate-50 text-slate-500 border-slate-200"
                      }`}
                    >
                      {opp.matchScore}% Match
                    </span>
                  )}
                </div>

                {/* Badge */}
                {opp.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${opp.badgeColor} inline-block`}>
                    {opp.badge}
                  </span>
                )}

                {/* Description */}
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{opp.description}</p>

                {/* Skills */}
                {opp.skills?.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Required Skills:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {opp.skills.map((os: any) => (
                        <span
                          key={os.skill?.name}
                          className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${
                            os.criticality === "MANDATORY"
                              ? "bg-slate-100 text-slate-800 border border-slate-200"
                              : "bg-slate-50 text-slate-600 border border-slate-100"
                          }`}
                        >
                          {os.skill?.name}
                          {os.criticality === "MANDATORY" && " *"}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Meta */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <MapPin size={11} className="text-slate-400 shrink-0" /> {opp.location}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                    <DollarSign size={11} className="shrink-0" /> {opp.stipendOrSalary}
                  </div>
                  {opp.vacancies && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Users size={11} className="text-slate-400 shrink-0" /> {opp.vacancies} openings
                    </div>
                  )}
                  {opp.minCgpa && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      CGPA ≥ {opp.minCgpa}
                    </div>
                  )}
                  <div
                    className={`flex items-center gap-1.5 text-xs font-medium col-span-2 ${
                      daysLeft <= 7 ? "text-red-500" : "text-amber-600"
                    }`}
                  >
                    <Clock size={11} className="shrink-0" />
                    {daysLeft > 0 ? `${daysLeft} days left to apply` : "Deadline passed"}
                  </div>
                </div>

                {/* Eligibility */}
                {opp.eligibility && (
                  <div className="rounded-xl bg-slate-50 p-2.5 text-xs text-slate-600 border border-slate-100">
                    <span className="font-semibold">Eligibility: </span>{opp.eligibility}
                  </div>
                )}

                {/* Apply button */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Monthly Stipend</div>
                    <div className="text-sm font-bold text-slate-900">{opp.stipendOrSalary}</div>
                  </div>
                  <div className="flex gap-2">
                    {hasApplyUrl ? (
                      <button
                        onClick={() => handleApply(opp.applyUrl)}
                        className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition shadow-sm"
                      >
                        Apply Now <ArrowUpRight size={12} />
                      </button>
                    ) : (
                      <button
                        disabled
                        className="flex items-center gap-1.5 rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-400 cursor-not-allowed"
                      >
                        No Apply Link
                      </button>
                    )}
                    <Link
                      href="/student/skill-gap"
                      className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                    >
                      Skill Gap <ChevronRight size={12} />
                    </Link>
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
