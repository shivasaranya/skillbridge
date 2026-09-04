"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Building2, 
  Briefcase, 
  Users, 
  Calendar, 
  CheckCircle2, 
  Plus, 
  ExternalLink, 
  Search, 
  Sparkles, 
  Clock, 
  Video, 
  FileText,
  ShieldCheck,
  Loader2,
  ChevronRight
} from "lucide-react";

export default function IndustryDashboard() {
  const [company, setCompany] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [skillsList, setSkillsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Post Opportunity Modal
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("INTERNSHIP");
  const [newWorkMode, setNewWorkMode] = useState("HYBRID");
  const [newLocation, setNewLocation] = useState("");
  const [newStipend, setNewStipend] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newSkillId, setNewSkillId] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<any[]>([]);
  const [posting, setPosting] = useState(false);

  // Schedule Interview Modal
  const [interviewModalApp, setInterviewModalApp] = useState<any>(null);
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTitle, setInterviewTitle] = useState("Technical Chromatography Viva");
  const [meetingLink, setMeetingLink] = useState("https://meet.google.com/sb-eval");
  const [updatingApp, setUpdatingApp] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const appRes = await fetch("/api/applications");
      const appData = await appRes.json();
      setApplications(appData.applications || []);

      const oppRes = await fetch("/api/opportunities");
      const oppData = await oppRes.json();
      setOpportunities(oppData.opportunities || []);

      // Fetch all skills for tagging
      const skillRes = await fetch("/api/assessments");
      const skillData = await skillRes.json();
      const extracted = (skillData.assessments || []).map((a: any) => a.skill);
      setSkillsList(extracted);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId: string, status: string) => {
    try {
      await fetch("/api/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: appId, status }),
      });
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleScheduleInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewModalApp) return;
    setUpdatingApp(true);

    try {
      await fetch("/api/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: interviewModalApp.id,
          status: "INTERVIEW",
          interviewDate,
          interviewTitle,
          meetingLink,
        }),
      });
      setInterviewModalApp(null);
      loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingApp(false);
    }
  };

  const handleAddSkillToPost = () => {
    if (!newSkillId) return;
    const found = skillsList.find((s) => s.id === newSkillId);
    if (found && !selectedSkills.some((s) => s.skillId === found.id)) {
      setSelectedSkills([...selectedSkills, { skillId: found.id, name: found.name, criticality: "MANDATORY" }]);
    }
  };

  const handleCreateOpportunity = async (e: React.FormEvent) => {
    e.preventDefault();
    setPosting(true);

    try {
      const res = await fetch("/api/opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          type: newType,
          workMode: newWorkMode,
          location: newLocation,
          stipendOrSalary: newStipend,
          description: newDescription,
          skills: selectedSkills,
        }),
      });

      if (res.ok) {
        setPostModalOpen(false);
        setNewTitle("");
        setNewDescription("");
        setSelectedSkills([]);
        loadData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  const shortlistedCount = applications.filter((a) => a.status === "SHORTLISTED").length;
  const interviewCount = applications.filter((a) => a.status === "INTERVIEW").length;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. CORPORATE HEADER */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700 border border-purple-200">
                🏢 Corporate Partner Suite
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Verified Ayush & Pharma Enterprise
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Dabur India Limited • R&D Operations
            </h1>
            <p className="text-xs text-slate-500">
              CIN: L24230DL1975PLC007908 • Kaushambi R&D Centre, NCR
            </p>
          </div>

          <button
            onClick={() => setPostModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-500/20 hover:bg-brand-700 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Post New Opportunity</span>
          </button>

        </div>
      </div>

      {/* 2. RECRUITMENT METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Postings</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{opportunities.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Internships & Campus Roles</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Applications Received</div>
          <div className="text-2xl font-extrabold text-brand-600 mt-1">{applications.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Ranked by Compatibility</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Shortlisted</div>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">{shortlistedCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Ready for Interview Round</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Interviews Scheduled</div>
          <div className="text-2xl font-extrabold text-purple-600 mt-1">{interviewCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Live Google Meet Tracks</div>
        </div>
      </div>

      {/* 3. CANDIDATE COMPATIBILITY SHORTLISTING TABLE */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-brand-600" />
              <h2 className="text-base font-bold text-slate-900">Candidate Compatibility Ranking</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Candidates ordered mathematically by skill alignment against opportunity mandatory prerequisites
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Sorted by: <strong>Compatibility Match %</strong></span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Candidate</th>
                <th className="px-6 py-3.5">Applied For</th>
                <th className="px-6 py-3.5">Compatibility</th>
                <th className="px-6 py-3.5">Verified Skills</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {applications.length > 0 ? (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition">
                    
                    {/* Candidate */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">
                        {app.student?.user?.firstName || "Candidate"} {app.student?.user?.lastName || ""}
                      </div>
                      <div className="text-xs text-slate-500">
                        {app.student?.degree || "BAMS"} • CGPA: {app.student?.cgpa || "8.85"}
                      </div>
                      {app.student?.portfolioUrl && (
                        <Link
                          href={app.student.portfolioUrl}
                          className="text-[11px] text-brand-600 hover:underline flex items-center gap-0.5 mt-0.5"
                        >
                          View Portfolio <ExternalLink className="h-2.5 w-2.5" />
                        </Link>
                      )}
                    </td>

                    {/* Applied For */}
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800 text-xs">{app.opportunity?.title}</div>
                      <div className="text-[11px] text-slate-400">{app.opportunity?.location}</div>
                    </td>

                    {/* Compatibility */}
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-bold text-emerald-800">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        {app.matchScore}% Match
                      </div>
                    </td>

                    {/* Skills */}
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {app.student?.skills?.map((ss: any) => (
                          <span key={ss.id} className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                            {ss.skill?.name?.substring(0, 18)}...
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold ${
                        app.status === "SELECTED"
                          ? "bg-emerald-100 text-emerald-800"
                          : app.status === "INTERVIEW"
                          ? "bg-purple-100 text-purple-800"
                          : app.status === "SHORTLISTED"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-100 text-slate-700"
                      }`}>
                        {app.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right space-x-2">
                      {app.status === "APPLIED" && (
                        <button
                          onClick={() => handleStatusChange(app.id, "SHORTLISTED")}
                          className="rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-bold text-amber-800 hover:bg-amber-100 transition"
                        >
                          Shortlist
                        </button>
                      )}

                      {(app.status === "APPLIED" || app.status === "SHORTLISTED") && (
                        <button
                          onClick={() => setInterviewModalApp(app)}
                          className="rounded-lg bg-purple-50 border border-purple-200 px-2.5 py-1 text-xs font-bold text-purple-800 hover:bg-purple-100 transition"
                        >
                          Schedule Interview
                        </button>
                      )}

                      {app.status === "INTERVIEW" && (
                        <button
                          onClick={() => handleStatusChange(app.id, "SELECTED")}
                          className="rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-emerald-700 transition"
                        >
                          Release Offer
                        </button>
                      )}
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400 text-xs">
                    No applications received yet. Postings will appear in student feeds automatically.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* SCHEDULE INTERVIEW MODAL */}
      {interviewModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Schedule Candidate Interview</h3>
              <button onClick={() => setInterviewModalApp(null)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleScheduleInterview} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">Candidate</label>
                <div className="text-sm font-bold text-slate-900 mt-0.5">
                  {interviewModalApp.student?.user?.firstName} {interviewModalApp.student?.user?.lastName}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">Interview Round Title</label>
                <input
                  type="text"
                  required
                  value={interviewTitle}
                  onChange={(e) => setInterviewTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">Meeting Link</label>
                <input
                  type="url"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setInterviewModalApp(null)}
                  className="rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingApp}
                  className="rounded-xl bg-purple-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-purple-700"
                >
                  {updatingApp ? "Scheduling..." : "Confirm Schedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POST OPPORTUNITY MODAL */}
      {postModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Post New Opportunity</h3>
              <button onClick={() => setPostModalOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateOpportunity} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">Opportunity Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Clinical Pharmacovigilance Associate Intern"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-sm bg-white"
                  >
                    <option value="INTERNSHIP">Internship</option>
                    <option value="JOB">Full-Time Placement</option>
                    <option value="FACULTY_FDP">Faculty FDP / Immersion</option>
                    <option value="TRAINING">Corporate Training</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase">Work Mode</label>
                  <select
                    value={newWorkMode}
                    onChange={(e) => setNewWorkMode(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-sm bg-white"
                  >
                    <option value="ONSITE">Onsite</option>
                    <option value="HYBRID">Hybrid</option>
                    <option value="REMOTE">Remote</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase">Location</label>
                  <input
                    type="text"
                    required
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Kaushambi, Ghaziabad"
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase">Stipend / Salary</label>
                  <input
                    type="text"
                    required
                    value={newStipend}
                    onChange={(e) => setNewStipend(e.target.value)}
                    placeholder="e.g. ₹35,000 / month"
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">Description</label>
                <textarea
                  rows={3}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe the opportunity and candidate requirements..."
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm"
                />
              </div>

              {/* Required Skills Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Tag Required Skills</label>
                <div className="flex gap-2">
                  <select
                    value={newSkillId}
                    onChange={(e) => setNewSkillId(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs bg-white"
                  >
                    <option value="">Select a skill from ontology...</option>
                    {skillsList.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddSkillToPost}
                    className="rounded-xl bg-slate-800 text-white px-3 py-2 text-xs font-semibold shrink-0"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selectedSkills.map((s, idx) => (
                    <span key={idx} className="rounded-lg bg-brand-50 border border-brand-200 px-2.5 py-1 text-xs font-semibold text-brand-700 flex items-center gap-1">
                      {s.name}
                      <button
                        type="button"
                        onClick={() => setSelectedSkills(selectedSkills.filter((_, i) => i !== idx))}
                        className="text-brand-500 hover:text-red-500 font-bold ml-1"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPostModalOpen(false)}
                  className="rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={posting}
                  className="rounded-xl bg-brand-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-700"
                >
                  {posting ? "Publishing..." : "Publish Opportunity"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
