"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Briefcase, Search, Filter, MapPin, Clock, DollarSign,
  ChevronRight, Building2, Users, ArrowUpRight, AlertTriangle, RefreshCw
} from "lucide-react";

const TYPES = ["ALL", "INTERNSHIP", "JOB", "LIVE_PROJECT", "TRAINING"];
const MODES = ["ALL", "REMOTE", "ONSITE", "HYBRID"];

export default function OpportunitiesPage() {
  const searchParams = useSearchParams();
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [search, setSearch]   = useState(searchParams.get("q") || "");
  const [type, setType]       = useState("ALL");
  const [mode, setMode]       = useState("ALL");

  const fetchOpps = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (type !== "ALL") params.set("type", type);
      if (mode !== "ALL") params.set("workMode", mode);
      if (search)         params.set("search", search);
      const res  = await fetch(`/api/opportunities?${params.toString()}`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setOpportunities(data.opportunities || []);
    } catch {
      setError("Could not load opportunities. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOpps(); }, [type, mode]);

  const handleApply = (applyUrl: string) => {
    if (!applyUrl || applyUrl === "#") return;
    window.open(applyUrl, "_blank", "noopener,noreferrer");
  };

  // Client-side search filter
  const filtered = opportunities.filter((opp) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      opp.title?.toLowerCase().includes(q) ||
      opp.company?.companyName?.toLowerCase().includes(q) ||
      opp.location?.toLowerCase().includes(q) ||
      opp.skills?.some((s: any) => s.skill?.name?.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <Briefcase className="text-blue-600" size={26} /> Opportunities
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Internships and jobs matched to your skill profile. Apply directly on the official company website.
        </p>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchOpps()}
            placeholder="Search by role, company, skill, location…"
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
            <Filter size={12} /> Type:
          </span>
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition ${
                type === t
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
              }`}
            >
              {t === "ALL" ? "All" : t.replace("_", " ")}
            </button>
          ))}
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1 ml-2">Mode:</span>
          {MODES.map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition ${
                mode === m
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
              }`}
            >
              {m === "ALL" ? "All" : m}
            </button>
          ))}
        </div>
      </div>

      {/* States */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 animate-pulse space-y-3">
              <div className="h-4 bg-slate-200 rounded w-1/2" />
              <div className="h-3 bg-slate-100 rounded w-1/3" />
              <div className="h-12 bg-slate-100 rounded" />
              <div className="h-8 bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
          <AlertTriangle size={36} className="text-red-400 mx-auto mb-3" />
          <p className="text-sm font-semibold text-red-700">{error}</p>
          <button
            onClick={fetchOpps}
            className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-red-700 hover:underline"
          >
            <RefreshCw size={13} /> Try Again
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Briefcase size={40} className="text-slate-300 mx-auto mb-3" />
          <p className="text-base font-semibold text-slate-500">No opportunities found.</p>
          <p className="text-sm text-slate-400 mt-1">Try different filters or search terms.</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-slate-500 font-medium">{filtered.length} opportunities found</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((opp: any) => {
              const daysLeft = Math.ceil(
                (new Date(opp.deadline).getTime() - Date.now()) / 86_400_000
              );
              const hasApplyUrl = !!opp.applyUrl && opp.applyUrl !== "#";

              return (
                <div
                  key={opp.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition flex flex-col"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="h-11 w-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                      <Building2 size={20} className="text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-slate-900 truncate">{opp.title}</h3>
                      <p className="text-xs font-semibold text-blue-600">{opp.company?.companyName}</p>
                    </div>
                    {opp.matchScore !== undefined && (
                      <span
                        className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full border ${
                          opp.matchScore >= 70
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : opp.matchScore >= 50
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-slate-50 text-slate-500 border-slate-200"
                        }`}
                      >
                        {opp.matchScore}% Match
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                        opp.type === "INTERNSHIP"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-purple-50 text-purple-700 border-purple-200"
                      }`}
                    >
                      {opp.type}
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border bg-slate-50 text-slate-600 border-slate-200">
                      {opp.workMode}
                    </span>
                    {opp.minCgpa && (
                      <span className="text-[10px] text-slate-500 px-2.5 py-1">
                        CGPA ≥ {opp.minCgpa}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 mb-3 flex-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <MapPin size={11} className="text-slate-400" /> {opp.location}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <DollarSign size={11} className="text-slate-400" /> {opp.stipendOrSalary}
                    </div>
                    <div
                      className={`flex items-center gap-1.5 text-xs font-medium ${
                        daysLeft <= 7 ? "text-red-500" : "text-amber-600"
                      }`}
                    >
                      <Clock size={11} />
                      {daysLeft > 0 ? `${daysLeft} days left` : "Deadline passed"}
                    </div>
                    {opp.vacancies && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Users size={11} /> {opp.vacancies} vacancies
                      </div>
                    )}
                  </div>

                  {/* Required skills */}
                  {opp.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {opp.skills.slice(0, 4).map((os: any) => (
                        <span
                          key={os.skill?.name}
                          className="text-[10px] font-medium bg-slate-100 text-slate-600 rounded-md px-2 py-0.5"
                        >
                          {os.skill?.name}
                        </span>
                      ))}
                      {opp.skills.length > 4 && (
                        <span className="text-[10px] text-slate-400">+{opp.skills.length - 4}</span>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2 border-t border-slate-100 pt-3 mt-auto">
                    {hasApplyUrl ? (
                      <button
                        onClick={() => handleApply(opp.applyUrl)}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition"
                      >
                        Apply Now <ArrowUpRight size={12} />
                      </button>
                    ) : (
                      <button
                        disabled
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold bg-slate-100 text-slate-400 cursor-not-allowed"
                      >
                        No Apply Link
                      </button>
                    )}
                    <Link
                      href="/student/skill-gap"
                      className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                    >
                      Gap <ChevronRight size={12} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
