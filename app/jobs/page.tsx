"use client";

import { useEffect, useState } from "react";
import { 
  Building2, 
  Search, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink,
  Loader2
} from "lucide-react";

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/opportunities?type=JOB")
      .then((res) => res.json())
      .then((data) => setJobs(data.opportunities || []))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Graduate Placement & Career Opportunities
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl">
          Full-time career pathways across healthcare, pharmaceutical R&D, and biotechnology for graduating students and alumni.
        </p>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-flex rounded bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700 uppercase mb-1">
                      Full-Time Campus Placement
                    </span>
                    <h3 className="text-base font-bold text-slate-900">{job.title}</h3>
                    <p className="text-xs font-semibold text-brand-600">{job.company?.companyName}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-bold text-emerald-700">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                    88% Match
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3">
                  {job.description}
                </p>

                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Key Prerequisite Skills:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {job.skills?.map((os: any) => (
                      <span key={os.id} className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                        {os.skill?.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Annual Package</div>
                  <div className="text-sm font-extrabold text-slate-900">{job.stipendOrSalary}</div>
                </div>
                <button
                  onClick={() => alert(`Applied for ${job.title}! Recruiter notified.`)}
                  className="rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700 transition"
                >
                  Apply For Placement
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
