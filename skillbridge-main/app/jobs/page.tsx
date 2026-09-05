"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Building2, 
  Search, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink,
  Loader2,
  Briefcase,
  GraduationCap,
  Calendar,
  Clock,
  AlertCircle,
  X
} from "lucide-react";

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWorkMode, setSelectedWorkMode] = useState("");

  // Apply Modal state
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState("");

  useEffect(() => {
    fetchJobs();
  }, [searchTerm, selectedWorkMode]);

  const fetchJobs = async () => {
    try {
      let url = "/api/opportunities?type=JOB";
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
      if (selectedWorkMode) url += `&workMode=${selectedWorkMode}`;

      const res = await fetch(url);
      const data = await res.json();
      setJobs(data.opportunities || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;
    setApplying(true);
    setApplyError("");

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opportunityId: selectedJob.id,
          coverLetter,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setApplyError(data.error || "Failed to submit application.");
        setApplying(false);
        return;
      }

      setApplySuccess(true);
      setTimeout(() => {
        setSelectedJob(null);
        setApplySuccess(false);
        setCoverLetter("");
      }, 1600);
    } catch (e) {
      setApplyError("An unexpected error occurred. Please try again.");
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Graduate Placement & Career Opportunities
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl">
          Verified career vacancies posted directly by industry leaders across pharmaceuticals, healthcare technology, biotechnology, and enterprise domains.
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by role, skill, or company (e.g. Dabur, HPLC)..."
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

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
        </div>
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => {
            const matchScore = job.matchAnalysis?.matchPercentage || 85;
            return (
              <div
                key={job.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="inline-flex rounded bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700 uppercase">
                          {job.type === "JOB" ? "Full-Time Placement" : job.type}
                        </span>
                        <span className="inline-flex rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 uppercase">
                          {job.workMode}
                        </span>
                        {job.department && (
                          <span className="inline-flex rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                            {job.department}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{job.title}</h3>
                      <p className="text-xs font-semibold text-brand-600 flex items-center gap-1 mt-0.5">
                        <Building2 className="h-3.5 w-3.5" />
                        {job.company?.companyName}
                      </p>
                    </div>

                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-bold text-emerald-700 shrink-0">
                      <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                      {matchScore}% Match
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3">
                    {job.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-1">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span>{job.location}</span>
                    </div>
                    {job.qualification && (
                      <div className="flex items-center gap-1">
                        <GraduationCap className="h-3.5 w-3.5 text-slate-400" />
                        <span>{job.qualification}</span>
                      </div>
                    )}
                    {job.experience && (
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                        <span>Exp: {job.experience}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {job.skills && job.skills.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <div className="text-[11px] font-bold text-slate-400 uppercase">Key Prerequisite Skills:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {job.skills.map((os: any) => (
                          <span key={os.id} className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                            {os.skill?.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Annual Package / Salary</div>
                    <div className="text-sm font-extrabold text-slate-900">{job.stipendOrSalary}</div>
                  </div>
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700 shadow-sm transition"
                  >
                    View & Apply
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No Career Vacancies Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            There are currently no active job vacancies matching your criteria. Check back soon or browse active internships.
          </p>
        </div>
      )}

      {/* APPLICATION MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="inline-flex rounded bg-brand-50 text-brand-700 text-[10px] font-bold px-2 py-0.5 uppercase mb-1">
                  Vacancy Application
                </span>
                <h3 className="text-lg font-bold text-slate-900">{selectedJob.title}</h3>
                <p className="text-xs font-semibold text-brand-600">{selectedJob.company?.companyName}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedJob(null);
                  setApplyError("");
                }}
                className="text-slate-400 hover:text-slate-600 font-bold p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {applySuccess ? (
              <div className="py-8 text-center space-y-2">
                <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Application Submitted!</h4>
                <p className="text-xs text-slate-500">
                  Your profile and verified credentials have been transmitted to {selectedJob.company?.companyName}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4">
                {applyError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{applyError}</span>
                  </div>
                )}

                {/* Job Overview Grid */}
                <div className="rounded-xl bg-slate-50 p-3.5 grid grid-cols-2 gap-2 text-xs text-slate-700">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Package / Salary</span>
                    <span className="font-bold text-slate-900">{selectedJob.stipendOrSalary}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Location & Mode</span>
                    <span className="font-semibold text-slate-900">{selectedJob.location} ({selectedJob.workMode})</span>
                  </div>
                  {selectedJob.department && (
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Department</span>
                      <span className="font-semibold text-slate-900">{selectedJob.department}</span>
                    </div>
                  )}
                  {selectedJob.qualification && (
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Required Qualification</span>
                      <span className="font-semibold text-slate-900">{selectedJob.qualification}</span>
                    </div>
                  )}
                </div>

                {/* Required Skills Checklist */}
                {selectedJob.skills && selectedJob.skills.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Required Prerequisite Competencies
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedJob.skills.map((os: any) => (
                        <span
                          key={os.id}
                          className="inline-flex items-center gap-1 rounded-lg border border-brand-200 bg-brand-50/60 px-2.5 py-1 text-xs font-medium text-brand-800"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 text-brand-600" />
                          {os.skill?.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Candidate Statement / Cover Note
                  </label>
                  <textarea
                    rows={4}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Briefly state your relevant clinical/lab background, key technical strengths, and motivation for this role..."
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-brand-500 focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Your verified skills and academic record from SkillBridge will automatically be attached to this submission.
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedJob(null)}
                    className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={applying}
                    className="flex items-center gap-1.5 rounded-xl bg-brand-600 px-5 py-2 text-xs font-bold text-white hover:bg-brand-700 shadow-sm transition disabled:opacity-50"
                  >
                    {applying ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
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
