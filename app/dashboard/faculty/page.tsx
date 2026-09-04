"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Users, 
  BookOpen, 
  Award, 
  FileCheck, 
  Building2, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  ExternalLink,
  ShieldCheck,
  Loader2,
  Send
} from "lucide-react";

export default function FacultyDashboard() {
  const [facultyOpportunities, setFacultyOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [appliedFdp, setAppliedFdp] = useState(false);

  useEffect(() => {
    fetch("/api/opportunities?type=FACULTY_FDP")
      .then((res) => res.json())
      .then((data) => setFacultyOpportunities(data.opportunities || []))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const handleApplyFdp = async (oppId: string) => {
    try {
      await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opportunityId: oppId,
          coverLetter: "Faculty sabbatical application for phytochemical laboratory immersion.",
        }),
      });
      setAppliedFdp(true);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. FACULTY PROFILE HEADER */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                🔬 Academician / Faculty Portal
              </span>
              <span className="inline-flex rounded-md bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-800">
                TPO Coordinator
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Dr. Arvind Tripathi
            </h1>
            <p className="text-xs text-slate-500">
              Associate Professor • Department of Dravyaguna Vigyana • National Institute of Ayurveda (Deemed to be University)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
              <div className="text-lg font-bold text-slate-900">12 Years</div>
              <div className="text-[10px] text-slate-500 uppercase">Research Exp.</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
              <div className="text-lg font-bold text-emerald-600">24</div>
              <div className="text-[10px] text-slate-500 uppercase">Mentees Placed</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. DUAL ROLE TABS: MENTOR NOC APPROVAL & FACULTY IMMERSION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Student NOC Approvals (TPO / Faculty Guide responsibility) */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-brand-600" />
              <h2 className="text-base font-bold text-slate-900">Student Internship NOC Requests</h2>
            </div>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Active Workflow
            </span>
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-slate-200 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-slate-900">Priya Nair (NIA-MPH-24-015)</div>
                  <div className="text-xs text-slate-500">M.Pharm (Ayurveda) • 9.30 CGPA</div>
                </div>
                <span className="rounded bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5">
                  Pending Sign-off
                </span>
              </div>

              <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg">
                <strong>Company:</strong> Himalaya Wellness Company • R&D Labs, Bengaluru <br />
                <strong>Role:</strong> Phytochemical Quality Analyst (6 Months)
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-slate-500">Academic Credits: <strong>4 Credits</strong></span>
                <div className="flex gap-2">
                  <button className="rounded-lg bg-emerald-600 text-white font-semibold px-3 py-1 hover:bg-emerald-700 transition">
                    Endorse NOC
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 space-y-2 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-slate-800">Aarav Sharma (NIA-BAMS-23-042)</div>
                  <div className="text-xs text-slate-500">BAMS Final Year • 8.85 CGPA</div>
                </div>
                <span className="rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Approved
                </span>
              </div>
              <div className="text-xs text-slate-500">
                Endorsed for Dabur Clinical Research Internship on 02 Sep 2026.
              </div>
            </div>
          </div>
        </div>

        {/* Corporate Research MoUs & Projects */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-purple-600" />
              <h2 className="text-base font-bold text-slate-900">Corporate MoUs & Research Grants</h2>
            </div>
            <Link href="/collaborations" className="text-xs font-semibold text-brand-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-purple-200 bg-purple-50/40 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-900">Standardization of Polyherbal Extracts</span>
                <span className="text-[11px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                  Active Grant
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Funded by Dabur India R&D. Lead Faculty Investigator: Dr. Arvind Tripathi.
              </p>
              <div className="pt-2 border-t border-purple-200/60 flex items-center justify-between text-xs text-slate-600">
                <span>Sanctioned Budget: <strong>₹15,00,000</strong></span>
                <span>Student Fellows: <strong>3 Active</strong></span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 space-y-1">
              <div className="text-xs font-bold text-slate-900">Upcoming Guest Lecture by Himalaya R&D</div>
              <p className="text-xs text-slate-500">
                "Modern Regulatory Pathways for Botanical Drugs in USA & EU" by Dr. Pralhad Patki.
              </p>
              <div className="text-[11px] text-brand-600 font-semibold pt-1">
                Target Audience: Postgraduates & Faculty • 145 Registered
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 3. FACULTY FDPs & INDUSTRIAL TRAINING SABBATICALS */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">Faculty Development Programs (FDPs) & Industrial Immersion</h2>
          </div>
          <span className="text-xs text-slate-500">Sponsored by Industry Partners</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {facultyOpportunities.map((opp) => (
            <div key={opp.id} className="rounded-xl border border-slate-200 p-4 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{opp.title}</h3>
                    <p className="text-xs font-semibold text-emerald-700">{opp.company?.companyName}</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-800 shrink-0">
                    Faculty FDP
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 mt-2">
                  {opp.description}
                </p>

                <div className="mt-3 text-xs text-slate-500 space-y-1">
                  <div><strong>Duration:</strong> {opp.durationMonths || 1} Month Immersion</div>
                  <div><strong>Package:</strong> {opp.stipendOrSalary}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">{opp.location}</span>
                {appliedFdp ? (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" /> Applied
                  </span>
                ) : (
                  <button
                    onClick={() => handleApplyFdp(opp.id)}
                    className="rounded-lg bg-emerald-600 text-white font-semibold px-3.5 py-1.5 hover:bg-emerald-700 transition"
                  >
                    Apply for Immersion
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
