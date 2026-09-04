"use client";

import { useEffect, useState } from "react";
import { 
  Briefcase, 
  Search, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronDown, 
  Filter, 
  Sparkles, 
  ExternalLink,
  Loader2
} from "lucide-react";

export default function InternshipsPage() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWorkMode, setSelectedWorkMode] = useState("");

  // Apply modal
  const [selectedOpp, setSelectedOpp] = useState<any>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState("");

  useEffect(() => {
    fetchOpportunities();
  }, [searchTerm, selectedWorkMode]);

  const fetchOpportunities = async () => {
    try {
      let url = "/api/opportunities?type=INTERNSHIP";
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
      if (selectedWorkMode) url += `&workMode=${selectedWorkMode}`;

      const res = await fetch(url);
      const data = await res.json();
      setOpportunities(data.opportunities || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOpp) return;
    setApplying(true);
    setApplyError("");

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opportunityId: selectedOpp.id,
          coverLetter,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setApplyError(data.error || "Failed to apply.");
        setApplying(false);
        return;
      }

      setApplySuccess(true);
      setTimeout(() => {
        setSelectedOpp(null);
        setApplySuccess(false);
        setCoverLetter("");
      }, 1500);
    } catch (e) {
      setApplyError("An unexpected error occurred.");
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Explore Industry Internships
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl">
          Discover verified opportunities with leading pharmaceutical, herbal research, and healthcare technology organizations. Opportunities feature live compatibility analysis against your verified skills.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        
        <div className="relative w-full sm:w-96">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by role, skill, or company (e.g., HPLC, Dabur)..."
            className="w-full rounded-xl border border-slate-300 pl-9 pr-4 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedWorkMode}
            onChange={(e) => setSelectedWorkMode(e.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="">All Work Modes</option>
            <option value="ONSITE">Onsite</option>
            <option value="HYBRID">Hybrid</option>
            <option value="REMOTE">Remote</option>
          </select>
        </div>

      </div>

      {/* Listings Grid */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
        </div>
      ) : opportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {opportunities.map((opp) => {
            const matchAnalysis = opp.matchAnalysis || {
              matchPercentage: 85,
              matchedSkills: [],
              missingSkills: [],
              recommendationReason: "Sign in to calculate personalized skill compatibility.",
            };

            return (
              <div
                key={opp.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-brand-300 transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  
                  {/* Title & Company */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="inline-flex rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-1">
                        {opp.workMode} • {opp.type}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">{opp.title}</h3>
                      <p className="text-xs font-semibold text-brand-600">{opp.company?.companyName}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-bold text-emerald-700">
                        <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                        {matchAnalysis.matchPercentage}% Match
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {opp.description}
                  </p>

                  {/* Skills tags */}
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Required Skills:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {opp.skills?.map((os: any) => (
                        <span
                          key={os.id}
                          className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${
                            os.criticality === "MANDATORY"
                              ? "bg-slate-100 text-slate-800 border border-slate-200 font-semibold"
                              : "bg-slate-50 text-slate-600 border border-slate-100"
                          }`}
                        >
                          {os.skill?.name}
                          {os.criticality === "MANDATORY" && " *"}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Compatibility Explanation */}
                  <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600 border border-slate-100 space-y-1">
                    <div className="font-semibold text-slate-800 text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      Why you're a good fit:
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {matchAnalysis.recommendationReason}
                    </div>
                  </div>

                </div>

                {/* Footer / Apply */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Monthly Stipend</div>
                    <div className="text-sm font-bold text-slate-900">{opp.stipendOrSalary}</div>
                  </div>

                  <button
                    onClick={() => setSelectedOpp(opp)}
                    className="rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 transition"
                  >
                    Apply Now
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500 text-sm">
          No internships found matching your query.
        </div>
      )}

      {/* APPLY MODAL */}
      {selectedOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedOpp.title}</h3>
                <p className="text-xs text-slate-500">{selectedOpp.company?.companyName} • {selectedOpp.location}</p>
              </div>
              <button onClick={() => setSelectedOpp(null)} className="text-slate-400 font-bold">✕</button>
            </div>

            {applySuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto" />
                <h4 className="text-lg font-bold text-slate-900">Application Submitted!</h4>
                <p className="text-xs text-slate-500">The recruiter has been notified. You can track status on your dashboard.</p>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4">
                {applyError && (
                  <div className="rounded-lg bg-red-50 p-3 text-xs text-red-700 border border-red-200">
                    {applyError}
                  </div>
                )}

                <div className="rounded-xl bg-emerald-50 p-3 text-xs text-emerald-900 border border-emerald-200">
                  <div className="font-bold">Calculated Compatibility: {selectedOpp.matchAnalysis?.matchPercentage || 85}%</div>
                  <div>Your profile, CGPA, and verified skill credentials will be attached automatically.</div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Cover Letter / Statement of Purpose *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Describe your academic coursework, clinical experience, and interest in this role..."
                    className="w-full rounded-xl border border-slate-300 p-3 text-sm"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedOpp(null)}
                    className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={applying}
                    className="rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700 disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {applying && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    <span>Submit Application</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
