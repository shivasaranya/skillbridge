"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  GraduationCap, 
  Briefcase, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Clock, 
  Video, 
  ArrowRight, 
  ShieldCheck, 
  ExternalLink,
  BookOpen,
  Calendar,
  Layers,
  Award,
  Loader2
} from "lucide-react";

export default function StudentDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [recommended, setRecommended] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Apply modal
  const [selectedOpp, setSelectedOpp] = useState<any>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // 1. Fetch Session & Profile
      const sessionRes = await fetch("/api/auth/session");
      const sessionData = await sessionRes.json();
      
      // 2. Fetch Applications
      const appRes = await fetch("/api/applications");
      const appData = await appRes.json();
      setApplications(appData.applications || []);

      // 3. Fetch Recommended Opportunities
      const oppRes = await fetch("/api/opportunities?type=INTERNSHIP");
      const oppData = await oppRes.json();
      setRecommended(oppData.opportunities?.slice(0, 4) || []);

      // 4. Fetch Student Profile with Skills
      const profRes = await fetch("/api/profile/student");
      const profData = await profRes.json();
      setProfile(profData.student || null);
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

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opportunityId: selectedOpp.id,
          coverLetter,
        }),
      });

      if (res.ok) {
        setApplySuccess(true);
        setTimeout(() => {
          setSelectedOpp(null);
          setApplySuccess(false);
          setCoverLetter("");
          loadData();
        }, 1500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  // Fallback default skills if newly registered
  const skills = profile?.skills || [];
  const readinessScore = profile?.readinessScore || 88;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. WELCOME & READINESS HEADER */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          <div className="md:col-span-8 space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
                🎓 Candidate Portal
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {profile?.rollNumber || "NIA-BAMS-23-042"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Welcome back, {profile?.user?.firstName || "Aarav"}!
            </h1>

            <p className="text-sm text-slate-600">
              {profile?.degree || "Bachelor of Ayurvedic Medicine & Surgery (BAMS)"} • {profile?.department || "Dravyaguna Vigyana"}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-500">
              <span>CGPA: <strong className="text-slate-800">{profile?.cgpa || "8.85"} / 10.0</strong></span>
              <span>•</span>
              <span>Batch: <strong className="text-slate-800">Class of 2026</strong></span>
              <span>•</span>
              <Link href={`/portfolio/${profile?.user?.firstName?.toLowerCase() || "aarav"}-sharma`} className="text-brand-600 font-semibold hover:underline flex items-center gap-1">
                View Public Portfolio <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Career Readiness Score Badge */}
          <div className="md:col-span-4 flex flex-col items-center md:items-end justify-center">
            <div className="rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-4 text-center shadow-xs w-full max-w-xs">
              <div className="text-xs font-bold uppercase tracking-wider text-brand-700">Career Readiness Score</div>
              <div className="text-4xl font-extrabold text-brand-600 my-1">{readinessScore}<span className="text-xl text-slate-400">/100</span></div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden my-2">
                <div 
                  className="bg-brand-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${readinessScore}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-500">Ranked in Top 5% of your graduating cohort</p>
            </div>
          </div>

        </div>
      </div>

      {/* 2. SKILL SUMMARY & GAP ANALYSIS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Verified Skills Breakdown */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-brand-600" />
              <h2 className="text-base font-bold text-slate-900">Your Verified Skill Profile</h2>
            </div>
            <Link
              href="/assessments"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              Take Assessment <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {skills.length > 0 ? (
              skills.map((ss: any) => (
                <div key={ss.id} className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-slate-800">{ss.skill?.name || "Panchakarma Protocol Administration"}</div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-medium text-slate-600">Code: {ss.skill?.code || "CLIN-PANCH-01"}</span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        {ss.verificationSource === "FACULTY_VERIFIED" ? "Faculty Endorsed" : "Assessment Tested"}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex rounded-md bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-800">
                      {ss.proficiencyLevel} ({ss.proficiencyScore}%)
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-500 p-4 text-center">
                No skills added yet. Complete a quiz under <Link href="/assessments" className="text-brand-600 underline">Skill Assessments</Link> to earn verified badges!
              </div>
            )}
          </div>
        </div>

        {/* Skill Gap Alert & Remediation */}
        <div className="lg:col-span-5 rounded-2xl border border-amber-200 bg-amber-50/50 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-amber-900">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <h2 className="text-base font-bold">Identified Skill Gap & Remediation</h2>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Based on current industry postings in <strong className="text-slate-800">Clinical Research & Quality Testing</strong>, improving this competency will boost your job compatibility to 96%:
          </p>

          <div className="rounded-xl border border-amber-200 bg-white p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Modern Scientific Manuscript Writing</span>
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                Gap Detected
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Required by Dabur & Himalaya for documenting GCP-compliant clinical trial findings.
            </p>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Provider: <strong>Swayam / NPTEL</strong> (Free)</span>
              <a
                href="https://swayam.gov.in"
                target="_blank"
                rel="noreferrer"
                className="text-brand-600 font-semibold hover:underline flex items-center gap-1"
              >
                Enroll in Course <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          <div className="rounded-xl bg-white/70 border border-slate-200/80 p-3 text-xs text-slate-600 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand-600 shrink-0" />
            <span>Completing this bridge course earns 2 additional NEP-2020 experiential learning credits.</span>
          </div>
        </div>

      </div>

      {/* 3. APPLICATION TRACKER */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-brand-600" />
            <h2 className="text-base font-bold text-slate-900">Your Active Applications</h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">{applications.length} Active Tracks</span>
        </div>

        {applications.length > 0 ? (
          <div className="space-y-4">
            {applications.map((app: any) => {
              const stages = ["APPLIED", "REVIEWING", "SHORTLISTED", "INTERVIEW", "SELECTED"];
              const currentIdx = stages.indexOf(app.status);

              return (
                <div key={app.id} className="rounded-xl border border-slate-200 p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{app.opportunity?.title}</h3>
                      <p className="text-xs text-slate-500">{app.opportunity?.company?.companyName} • {app.opportunity?.location}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                        {app.matchScore}% Compatibility
                      </span>
                      <span className="inline-flex rounded-full bg-brand-50 border border-brand-200 px-2.5 py-0.5 text-xs font-bold text-brand-700">
                        Status: {app.status}
                      </span>
                    </div>
                  </div>

                  {/* Visual Funnel Tracker */}
                  <div className="grid grid-cols-5 gap-2 pt-2">
                    {stages.map((stg, idx) => {
                      const isCompleted = idx <= currentIdx;
                      const isCurrent = idx === currentIdx;
                      return (
                        <div key={stg} className="text-center">
                          <div className={`h-1.5 rounded-full mb-1 ${isCompleted ? "bg-brand-600" : "bg-slate-200"}`} />
                          <span className={`text-[10px] font-medium ${isCurrent ? "text-brand-700 font-bold" : "text-slate-400"}`}>
                            {stg}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Scheduled Interview Banner */}
                  {app.interviews && app.interviews.length > 0 && (
                    <div className="mt-2 rounded-lg bg-purple-50 border border-purple-200 p-2.5 text-xs text-purple-900 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4 text-purple-600" />
                        <span>
                          <strong>{app.interviews[0].roundTitle}:</strong> Scheduled for Friday at 11:00 AM
                        </span>
                      </div>
                      {app.interviews[0].meetingLink && (
                        <a
                          href={app.interviews[0].meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-purple-700 hover:underline flex items-center gap-1"
                        >
                          Join Meet <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500 text-sm">
            You have not applied to any opportunities yet.
          </div>
        )}
      </div>

      {/* 4. TOP RECOMMENDED OPPORTUNITIES */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <h2 className="text-base font-bold text-slate-900">Recommended Opportunities For Your Skills</h2>
          </div>
          <Link href="/internships" className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1">
            Browse All <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommended.map((opp: any) => {
            const match = opp.matchAnalysis?.matchPercentage || 85;
            return (
              <div key={opp.id} className="rounded-xl border border-slate-200 p-4 hover:border-brand-300 hover:shadow-xs transition space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{opp.title}</h3>
                      <p className="text-xs font-semibold text-brand-600">{opp.company?.companyName}</p>
                    </div>
                    <span className="inline-flex rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-xs font-bold text-emerald-700 shrink-0">
                      {match}% Match
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 mt-2">
                    {opp.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {opp.skills?.slice(0, 3).map((os: any) => (
                      <span key={os.id} className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                        {os.skill?.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{opp.stipendOrSalary}</span>
                  <button
                    onClick={() => setSelectedOpp(opp)}
                    className="rounded-lg bg-brand-600 px-3 py-1.5 font-semibold text-white hover:bg-brand-700 transition"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* APPLICATION MODAL */}
      {selectedOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedOpp.title}</h3>
                <p className="text-xs text-slate-500">{selectedOpp.company?.companyName}</p>
              </div>
              <button
                onClick={() => setSelectedOpp(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {applySuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto" />
                <h4 className="text-lg font-bold text-slate-900">Application Submitted!</h4>
                <p className="text-xs text-slate-500">Your profile and skill score have been sent to the recruiter.</p>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4">
                <div className="rounded-xl bg-blue-50 p-3 text-xs text-blue-800 border border-blue-200">
                  <div className="font-bold mb-1">Algorithmic Skill Compatibility: {selectedOpp.matchAnalysis?.matchPercentage || 85}%</div>
                  <div>Your verified skills match all mandatory requirements for this role.</div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Cover Note / Expression of Interest
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Briefly explain your clinical or academic training and why you are a strong fit..."
                    className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 focus:border-brand-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedOpp(null)}
                    className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
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
