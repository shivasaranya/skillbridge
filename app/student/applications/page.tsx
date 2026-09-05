"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText, Clock, CheckCircle2, XCircle, AlertTriangle,
  Video, MapPin, ArrowRight, Briefcase
} from "lucide-react";

const STAGES = ["APPLIED", "REVIEWING", "SHORTLISTED", "INTERVIEW", "SELECTED"];
const ALL_STATUSES = ["ALL", "APPLIED", "REVIEWING", "SHORTLISTED", "INTERVIEW", "SELECTED", "REJECTED", "WITHDRAWN"];

const STATUS_STYLES: Record<string, string> = {
  APPLIED: "bg-blue-50 text-blue-700 border-blue-200",
  REVIEWING: "bg-amber-50 text-amber-700 border-amber-200",
  SHORTLISTED: "bg-purple-50 text-purple-700 border-purple-200",
  INTERVIEW: "bg-indigo-50 text-indigo-700 border-indigo-200",
  SELECTED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  REJECTED: "bg-red-50 text-red-600 border-red-200",
  WITHDRAWN: "bg-slate-50 text-slate-500 border-slate-200",
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await fetch("/api/applications");
        const data = await res.json();
        setApplications(data.applications || []);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const filtered = filter === "ALL"
    ? applications
    : applications.filter(a => a.status === filter);

  const counts = ALL_STATUSES.reduce((acc, s) => {
    acc[s] = s === "ALL" ? applications.length : applications.filter(a => a.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <FileText className="text-blue-600" size={26} /> Application Tracker
        </h1>
        <p className="text-sm text-slate-500 mt-1">Track all your internship and job applications in one place.</p>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {ALL_STATUSES.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border font-semibold transition ${
              filter === s ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
            }`}
          >
            {s === "ALL" ? "All" : s}
            <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${filter === s ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-500"}`}>
              {counts[s]}
            </span>
          </button>
        ))}
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 animate-pulse space-y-3">
              <div className="h-4 bg-slate-200 rounded w-1/2" />
              <div className="h-3 bg-slate-100 rounded w-1/3" />
              <div className="h-2 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Briefcase size={40} className="text-slate-300 mx-auto mb-3" />
          <p className="text-base font-semibold text-slate-500">
            {filter === "ALL" ? "No applications yet." : `No ${filter.toLowerCase()} applications.`}
          </p>
          {filter === "ALL" && (
            <Link href="/student/opportunities" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline">
              Explore Opportunities <ArrowRight size={14} />
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((app: any) => {
            const stageIdx = STAGES.indexOf(app.status);
            const isTerminal = ["SELECTED", "REJECTED", "WITHDRAWN"].includes(app.status);

            return (
              <div key={app.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{app.opportunity?.title}</h3>
                    <p className="text-xs font-semibold text-blue-600">{app.opportunity?.company?.companyName}</p>
                    <div className="flex gap-3 mt-1 text-xs text-slate-400">
                      <span className="flex items-center gap-0.5"><MapPin size={10} />{app.opportunity?.location}</span>
                      <span className="flex items-center gap-0.5"><Clock size={10} />Applied {new Date(app.appliedAt).toLocaleDateString("en-IN")}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <span className="text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2.5 py-1">
                      {app.matchScore}% Match
                    </span>
                    <span className={`text-xs font-bold rounded-full px-2.5 py-1 border ${STATUS_STYLES[app.status] || "bg-slate-50 text-slate-600 border-slate-200"}`}>
                      {app.status}
                    </span>
                  </div>
                </div>

                {/* Timeline Progress */}
                {!isTerminal && (
                  <div className="mb-4">
                    <div className="flex items-center gap-0">
                      {STAGES.map((stage, i) => {
                        const done = i <= stageIdx;
                        const current = i === stageIdx;
                        return (
                          <div key={stage} className="flex items-center flex-1">
                            <div className={`flex flex-col items-center gap-1 flex-1`}>
                              <div className={`h-2 w-full rounded-full transition-colors ${done ? "bg-blue-500" : "bg-slate-200"}`} />
                              <span className={`text-[9px] font-medium text-center leading-tight ${current ? "text-blue-700 font-bold" : done ? "text-slate-500" : "text-slate-300"}`}>
                                {stage}
                              </span>
                            </div>
                            {i < STAGES.length - 1 && <div className="w-2 shrink-0" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Terminal Status */}
                {app.status === "SELECTED" && (
                  <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 flex items-center gap-2 text-sm text-emerald-800 mb-3">
                    <CheckCircle2 size={16} className="text-emerald-600" /> Congratulations! You've been selected. 🎉
                  </div>
                )}
                {app.status === "REJECTED" && (
                  <div className="rounded-xl bg-red-50 border border-red-200 p-3 flex items-center gap-2 text-sm text-red-700 mb-3">
                    <XCircle size={16} className="text-red-500" /> Application was not shortlisted this time.
                  </div>
                )}

                {/* Scheduled Interview */}
                {app.interviews && app.interviews.length > 0 && (
                  <div className="rounded-xl bg-purple-50 border border-purple-200 p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-purple-900">
                      <Video size={14} className="text-purple-600" />
                      <span>
                        <strong>{app.interviews[0].roundTitle}</strong> · {new Date(app.interviews[0].scheduledAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    {app.interviews[0].meetingLink && (
                      <a href={app.interviews[0].meetingLink} target="_blank" rel="noreferrer"
                        className="font-bold text-purple-700 hover:underline">
                        Join →
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
