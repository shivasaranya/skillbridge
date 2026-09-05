"use client";

import { useEffect, useState, useMemo } from "react";
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
  ChevronRight,
  Filter,
  GraduationCap,
  Mail,
  Phone,
  Globe,
  MapPin,
  Edit3,
  XCircle,
  AlertCircle,
  Send,
  UserCheck,
  X,
  Award,
  BookOpen,
  SlidersHorizontal,
  BookmarkCheck,
  Code,
  Check,
  BriefcaseBusiness
} from "lucide-react";
import { RECRUITER_DUMMY_JOBS, RecruiterJob } from "@/data/recruiterJobs";
import { 
  getRankedCandidatesForJob, 
  CandidateMatchResult 
} from "@/data/recruiterMatching";
import { RecruiterStudent } from "@/data/recruiterStudents";

type TabType = "OVERVIEW" | "PROFILE" | "VACANCIES" | "APPLICANTS" | "RECOMMENDATIONS";

export default function IndustryDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("RECOMMENDATIONS");
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Recruiter Jobs
  const [allJobs, setAllJobs] = useState<RecruiterJob[]>(RECRUITER_DUMMY_JOBS);
  const [selectedJobId, setSelectedJobId] = useState<string>(RECRUITER_DUMMY_JOBS[0].jobId);

  // Recommended Candidates Filters
  const [filterMinMatch, setFilterMinMatch] = useState<number>(0);
  const [filterBranch, setFilterBranch] = useState<string>("ALL");
  const [filterVerification, setFilterVerification] = useState<"ALL" | "VERIFIED" | "PENDING">("ALL");
  const [filterGradYear, setFilterGradYear] = useState<string>("ALL");
  const [filterSkill, setFilterSkill] = useState<string>("ALL");
  const [filterExperience, setFilterExperience] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Recruiter Actions Tracking State
  const [shortlistedCandidateIds, setShortlistedCandidateIds] = useState<Set<string>>(new Set());
  const [invitedCandidateIds, setInvitedCandidateIds] = useState<Set<string>>(new Set());

  // Modals state
  const [selectedCandidateDetail, setSelectedCandidateDetail] = useState<CandidateMatchResult | null>(null);
  const [resumeModalStudent, setResumeModalStudent] = useState<RecruiterStudent | null>(null);

  // Edit Company Profile Modal
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [editCompanyName, setEditCompanyName] = useState("");
  const [editDomain, setEditDomain] = useState("");
  const [editWebsite, setEditWebsite] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editState, setEditState] = useState("");
  const [editContactPerson, setEditContactPerson] = useState("");
  const [editContactDesignation, setEditContactDesignation] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Post Vacancy Modal
  const [vacancyModalOpen, setVacancyModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<"Full-time" | "Internship" | "Part-time">("Full-time");
  const [newWorkMode, setNewWorkMode] = useState<"Onsite" | "Hybrid" | "Remote">("Hybrid");
  const [newLocation, setNewLocation] = useState("Hyderabad, Telangana");
  const [newDepartment, setNewDepartment] = useState("Computer Science / Engineering");
  const [newSalary, setNewSalary] = useState("₹8.0 LPA - ₹11.0 LPA");
  const [newOpenings, setNewOpenings] = useState(3);
  const [newSkillsStr, setNewSkillsStr] = useState("Java, Spring Boot, SQL, Git, REST API");
  const [newDescription, setNewDescription] = useState("");
  const [savingVacancy, setSavingVacancy] = useState(false);

  useEffect(() => {
    loadCompanyData();
  }, []);

  const loadCompanyData = async () => {
    try {
      setLoading(true);
      const profRes = await fetch("/api/profile/industry");
      const profData = await profRes.json();
      if (profData.company) {
        setCompany(profData.company);
      }
    } catch (e) {
      console.error("Dashboard load error:", e);
    } finally {
      setLoading(false);
    }
  };

  const selectedJob = useMemo(() => {
    return allJobs.find((j) => j.jobId === selectedJobId) || allJobs[0];
  }, [allJobs, selectedJobId]);

  // Dynamically compute ranked candidates for the selected job with filters applied
  const rankedCandidates = useMemo(() => {
    return getRankedCandidatesForJob(selectedJob.jobId, {
      minMatchPercentage: filterMinMatch,
      branch: filterBranch,
      verificationStatus: filterVerification,
      graduationYear: filterGradYear !== "ALL" ? Number(filterGradYear) : "ALL",
      selectedSkill: filterSkill,
      searchQuery,
      experienceLevel: filterExperience,
    });
  }, [selectedJob.jobId, filterMinMatch, filterBranch, filterVerification, filterGradYear, filterSkill, searchQuery, filterExperience]);

  // Extract all unique skills across candidates for filter dropdown
  const allUniqueSkills = useMemo(() => {
    const set = new Set<string>();
    for (const job of allJobs) {
      job.requiredSkills.forEach((s) => set.add(s));
    }
    return Array.from(set).sort();
  }, [allJobs]);

  const handleToggleShortlist = (studentId: string) => {
    setShortlistedCandidateIds((prev) => {
      const next = new Set(prev);
      if (next.has(studentId)) {
        next.delete(studentId);
      } else {
        next.add(studentId);
      }
      return next;
    });
  };

  const handleToggleInvite = (studentId: string) => {
    setInvitedCandidateIds((prev) => {
      const next = new Set(prev);
      if (next.has(studentId)) {
        next.delete(studentId);
      } else {
        next.add(studentId);
      }
      return next;
    });
  };

  const handleOpenEditProfile = () => {
    if (!company) return;
    setEditCompanyName(company.companyName || "Apex Innovations");
    setEditDomain(company.domain || "HEALTH_TECH");
    setEditWebsite(company.website || "https://company.com");
    setEditCity(company.city || "Hyderabad");
    setEditState(company.state || "Telangana");
    setEditContactPerson(company.contactPerson || "Vikram Malhotra");
    setEditContactDesignation(company.contactDesignation || "Head of Talent Acquisition");
    setEditPhone(company.user?.phone || "+91 98480 11223");
    setEditDescription(company.description || "Leading technology & engineering enterprise driving campus recruitment.");
    setProfileModalOpen(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await fetch("/api/profile/industry", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: editCompanyName,
          domain: editDomain,
          website: editWebsite,
          city: editCity,
          state: editState,
          contactPerson: editContactPerson,
          contactDesignation: editContactDesignation,
          phone: editPhone,
          description: editDescription,
        }),
      });
      const data = await res.json();
      if (res.ok && data.company) {
        setCompany(data.company);
        setProfileModalOpen(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleCreateNewVacancy = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingVacancy(true);

    const skillsArray = newSkillsStr
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const created: RecruiterJob = {
      jobId: `JOB-CUSTOM-${Date.now()}`,
      company: company?.companyName || "Enterprise Partner",
      jobTitle: newTitle,
      jobType: newType,
      requiredSkills: skillsArray.length > 0 ? skillsArray : ["Java", "SQL", "Git"],
      preferredQualification: "B.Tech in CSE / IT / Allied Branches",
      branch: ["Computer Science and Engineering (CSE)", "Information Technology (IT)", "Artificial Intelligence & Data Science (AI&DS)"],
      location: newLocation,
      workMode: newWorkMode,
      experienceRequired: "Fresher / 0-1 Years",
      salaryOrStipend: newSalary,
      openings: Number(newOpenings) || 2,
      description: newDescription || "Exciting engineering role working on mission-critical applications.",
      deadline: "2026-11-30",
    };

    setAllJobs([created, ...allJobs]);
    setSelectedJobId(created.jobId);
    setVacancyModalOpen(false);
    setSavingVacancy(false);
    setActiveTab("RECOMMENDATIONS");
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-9 w-9 animate-spin text-brand-600" />
        <p className="text-sm font-semibold text-slate-500">Loading Recruiter Candidate Matching Suite...</p>
      </div>
    );
  }

  const verifiedCandidatesCount = rankedCandidates.filter((c) => c.student.verificationStatus === "VERIFIED").length;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. CORPORATE PARTNER HEADER */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700 border border-purple-200">
                <Building2 className="h-3.5 w-3.5" />
                Recruiter Portal
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Verified Recruiter Suite
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-200">
                <GraduationCap className="h-3.5 w-3.5 text-blue-600" />
                Talent Pool: SRKR Engineering College
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {company?.companyName || "Dabur India Limited • Campus Hiring"}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                <span>{[company?.city || "Hyderabad", company?.state || "Telangana"].filter(Boolean).join(", ")}</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <span>{company?.user?.email || "corporate.hr@dabur.com"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-slate-400" />
                <span>
                  Recruiter Contact: {company?.contactPerson || "Vikram Malhotra"} ({company?.contactDesignation || "Head of University Relations"})
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleOpenEditProfile}
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs transition"
            >
              <Edit3 className="h-4 w-4" />
              <span>Edit Profile</span>
            </button>
            <button
              onClick={() => setVacancyModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-brand-500/20 hover:bg-brand-700 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Post New Role</span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. RECRUITER NAVIGATION TABS */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto pb-px" aria-label="Tabs">
          {[
            { id: "RECOMMENDATIONS" as TabType, label: "Recommended Candidates", icon: Sparkles },
            { id: "VACANCIES" as TabType, label: `Job Postings (${allJobs.length})`, icon: Briefcase },
            { id: "OVERVIEW" as TabType, label: "Overview & Analytics", icon: Building2 },
            { id: "PROFILE" as TabType, label: "Company Profile", icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 border-b-2 px-3 sm:px-4 py-3 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors ${
                  active
                    ? "border-brand-600 text-brand-600 bg-brand-50/50 rounded-t-lg"
                    : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-brand-600" : "text-slate-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* 3. TAB 1: RECOMMENDED CANDIDATES (THE CORE MATCHING SUITE) */}
      {activeTab === "RECOMMENDATIONS" && (
        <div className="space-y-6">
          
          {/* JOB SELECTOR & BANNER */}
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-900 to-brand-900 text-white p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-brand-200">Dynamic Multi-Factor Matching Engine</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black">
                {selectedJob.jobTitle}
              </h2>
              <p className="text-xs text-slate-300 flex items-center gap-3 flex-wrap pt-1">
                <span>{selectedJob.company}</span>
                <span>•</span>
                <span>{selectedJob.jobType}</span>
                <span>•</span>
                <span>{selectedJob.location} ({selectedJob.workMode})</span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">{selectedJob.salaryOrStipend}</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0">
              <label className="text-xs font-semibold text-slate-300">Select Job Offer:</label>
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="rounded-xl border border-slate-700 bg-white/10 backdrop-blur-md px-3 py-2 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-brand-400"
              >
                {allJobs.map((j) => (
                  <option key={j.jobId} value={j.jobId} className="text-slate-900 bg-white">
                    {j.jobTitle} ({j.jobType})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* REQUIRED SKILLS CHIPS FOR SELECTED JOB */}
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 shrink-0">
                Prerequisite Job Competencies:
              </span>
              {selectedJob.requiredSkills.map((sk) => (
                <span key={sk} className="rounded-lg bg-white border border-slate-300 px-2.5 py-1 text-xs font-bold text-slate-800 shadow-2xs">
                  {sk}
                </span>
              ))}
            </div>
            <div className="text-xs text-slate-500 shrink-0">
              Target College: <strong className="text-slate-800">SRKR Engineering College, Bhimavaram</strong>
            </div>
          </div>

          {/* RECRUITER FILTERS TOOLBAR */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-brand-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Candidate Filters & Search</h3>
              </div>
              <span className="text-xs font-semibold text-brand-600">
                Found {rankedCandidates.length} Matching SRKR Students
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Match % Filter */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Minimum Match %</label>
                <select
                  value={filterMinMatch}
                  onChange={(e) => setFilterMinMatch(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 bg-white"
                >
                  <option value={0}>All Match Scores</option>
                  <option value={90}>90%+ Match (Top Tier)</option>
                  <option value={80}>80%+ Match (High Fit)</option>
                  <option value={70}>70%+ Match (Good Fit)</option>
                  <option value={60}>60%+ Match (Moderate)</option>
                </select>
              </div>

              {/* Branch Filter */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Engineering Branch</label>
                <select
                  value={filterBranch}
                  onChange={(e) => setFilterBranch(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 bg-white"
                >
                  <option value="ALL">All Branches</option>
                  <option value="Computer Science and Engineering (CSE)">CSE</option>
                  <option value="Information Technology (IT)">IT</option>
                  <option value="Artificial Intelligence & Data Science (AI&DS)">AI&DS</option>
                  <option value="Electronics and Communication Engineering (ECE)">ECE</option>
                  <option value="Electrical and Electronics Engineering (EEE)">EEE</option>
                  <option value="Mechanical Engineering">Mechanical</option>
                </select>
              </div>

              {/* Verification Filter */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Verification Status</label>
                <select
                  value={filterVerification}
                  onChange={(e) => setFilterVerification(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 bg-white"
                >
                  <option value="ALL">All Candidates</option>
                  <option value="VERIFIED">✓ Verified Only</option>
                  <option value="PENDING">Pending Verification</option>
                </select>
              </div>

              {/* Specific Skill Filter */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Filter By Skill</label>
                <select
                  value={filterSkill}
                  onChange={(e) => setFilterSkill(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 bg-white"
                >
                  <option value="ALL">All Skills</option>
                  {allUniqueSkills.map((sk) => (
                    <option key={sk} value={sk}>{sk}</option>
                  ))}
                </select>
              </div>

              {/* Search by Name */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Search Candidate</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search name, skill..."
                    className="w-full rounded-xl border border-slate-300 pl-8 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                  <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>
            </div>
          </div>

          {/* CANDIDATES RANKED LIST */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                Candidates Ranked by Match Percentage ({rankedCandidates.length})
              </h3>
              <span className="text-xs text-slate-500">
                Scoring: Skills (60%) • Qual (15%) • Branch (10%) • Location (5%) • Mode (5%) • Exp (5%)
              </span>
            </div>

            {rankedCandidates.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {rankedCandidates.map((match, idx) => {
                  const s = match.student;
                  const isShortlisted = shortlistedCandidateIds.has(s.studentId);
                  const isInvited = invitedCandidateIds.has(s.studentId);

                  return (
                    <div
                      key={s.studentId}
                      className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                    >
                      {/* Left Block: Rank & Info */}
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 font-extrabold text-slate-700 text-sm">
                          #{idx + 1}
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-base font-extrabold text-slate-900">{s.name}</h4>
                            
                            {s.verificationStatus === "VERIFIED" ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                                ✓ VERIFIED
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
                                PENDING VERIFICATION
                              </span>
                            )}

                            <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                              Batch {s.graduationYear}
                            </span>
                          </div>

                          <div className="text-xs text-slate-600">
                            <strong className="text-slate-800">{s.branch}</strong> • {s.college}, {s.location}
                          </div>

                          {/* Skills Chips */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {s.skills.map((skill) => {
                              const isPrerequisite = selectedJob.requiredSkills.includes(skill);
                              return (
                                <span
                                  key={skill}
                                  className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                                    isPrerequisite
                                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold"
                                      : "bg-slate-100 text-slate-700"
                                  }`}
                                >
                                  {isPrerequisite && "✓ "}
                                  {skill}
                                </span>
                              );
                            })}
                          </div>

                          <div className="text-[11px] text-slate-500 pt-0.5">
                            Proctored Assessment Score: <strong className="text-slate-800">{s.assessmentScore}%</strong> • Experience: {s.experienceLevel} • Mode: {s.preferredWorkMode}
                          </div>
                        </div>
                      </div>

                      {/* Right Block: Match Score & Action Buttons */}
                      <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                        {/* Dynamic Match Score Badge */}
                        <div className="text-left md:text-right">
                          <div className={`inline-flex items-center gap-1.5 rounded-2xl px-4 py-1.5 text-sm font-black shadow-xs ${
                            match.matchPercentage >= 85
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : match.matchPercentage >= 70
                              ? "bg-blue-50 text-blue-800 border border-blue-200"
                              : "bg-amber-50 text-amber-800 border border-amber-200"
                          }`}>
                            <Sparkles className="h-4 w-4" />
                            <span>{match.matchPercentage}% Match</span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1 hidden md:block">
                            {match.matchedSkills.length}/{selectedJob.requiredSkills.length} Required Skills
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedCandidateDetail(match)}
                            className="rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs transition"
                          >
                            View Profile
                          </button>

                          <button
                            onClick={() => handleToggleShortlist(s.studentId)}
                            className={`rounded-xl px-3.5 py-2 text-xs font-bold transition flex items-center gap-1 ${
                              isShortlisted
                                ? "bg-amber-100 text-amber-800 border border-amber-300"
                                : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 shadow-2xs"
                            }`}
                          >
                            <BookmarkCheck className="h-3.5 w-3.5" />
                            <span>{isShortlisted ? "Shortlisted" : "Shortlist"}</span>
                          </button>

                          <button
                            onClick={() => handleToggleInvite(s.studentId)}
                            className={`rounded-xl px-3.5 py-2 text-xs font-bold transition flex items-center gap-1 ${
                              isInvited
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                : "bg-brand-600 text-white hover:bg-brand-700 shadow-sm"
                            }`}
                          >
                            {isInvited ? (
                              <>
                                <Check className="h-3.5 w-3.5" />
                                <span>Invited</span>
                              </>
                            ) : (
                              <>
                                <Send className="h-3.5 w-3.5" />
                                <span>Invite to Apply</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
                <Users className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-base font-bold text-slate-800">No Candidates Match The Selected Filters</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Try broadening the match percentage filter or clearing branch/skill constraints to see more SRKR students.
                </p>
                <button
                  onClick={() => {
                    setFilterMinMatch(0);
                    setFilterBranch("ALL");
                    setFilterVerification("ALL");
                    setFilterSkill("ALL");
                    setSearchQuery("");
                  }}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: VACANCIES LIST */}
      {activeTab === "VACANCIES" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Active Recruiter Job Postings</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage your campus hiring openings. Select any role to instantly compute live student compatibility.
              </p>
            </div>
            <button
              onClick={() => setVacancyModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-brand-700 shadow-xs"
            >
              <Plus className="h-4 w-4" />
              <span>Post New Role</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allJobs.map((job) => (
              <div
                key={job.jobId}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="rounded bg-purple-50 text-purple-700 text-[10px] font-bold px-2 py-0.5 uppercase">
                          {job.jobType}
                        </span>
                        <span className="rounded bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 uppercase">
                          {job.workMode}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{job.jobTitle}</h3>
                      <p className="text-xs font-semibold text-brand-600">{job.company}</p>
                    </div>

                    <span className="rounded-full bg-slate-50 border border-slate-200 px-2.5 py-1 text-xs font-bold text-slate-700 shrink-0">
                      {job.openings} Openings
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {job.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-1">
                    <div><strong>Location:</strong> {job.location}</div>
                    <div><strong>Package:</strong> {job.salaryOrStipend}</div>
                    <div><strong>Experience:</strong> {job.experienceRequired}</div>
                    <div><strong>Deadline:</strong> {job.deadline}</div>
                  </div>

                  <div className="space-y-1 pt-1">
                    <div className="text-[10px] font-bold uppercase text-slate-400">Required Competencies:</div>
                    <div className="flex flex-wrap gap-1">
                      {job.requiredSkills.map((sk) => (
                        <span key={sk} className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Targeting SRKR Engineering College</span>
                  <button
                    onClick={() => {
                      setSelectedJobId(job.jobId);
                      setActiveTab("RECOMMENDATIONS");
                    }}
                    className="flex items-center gap-1 rounded-xl bg-brand-50 border border-brand-200 px-3.5 py-1.5 text-xs font-bold text-brand-700 hover:bg-brand-100 transition"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Evaluate SRKR Candidates</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: OVERVIEW & ANALYTICS */}
      {activeTab === "OVERVIEW" && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Job Offers</div>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">{allJobs.length}</div>
              <div className="text-xs text-slate-500 mt-1">Across Core Engineering Domains</div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">SRKR Talent Pool</div>
              <div className="text-3xl font-extrabold text-brand-600 mt-1">34</div>
              <div className="text-xs text-slate-500 mt-1">SRKR Engineering College, Bhimavaram</div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Shortlisted Talent</div>
              <div className="text-3xl font-extrabold text-amber-600 mt-1">{shortlistedCandidateIds.size}</div>
              <div className="text-xs text-slate-500 mt-1">Ready for Interview Round</div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Invited Candidates</div>
              <div className="text-3xl font-extrabold text-purple-600 mt-1">{invitedCandidateIds.size}</div>
              <div className="text-xs text-slate-500 mt-1">Application Invites Sent</div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Campus Partnership Verification</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your recruitment suite is directly linked to verified academic and proctored assessment data from <strong>SRKR Engineering College (Bhimavaram, Andhra Pradesh)</strong>. Student degree progress, verified competencies, and project portfolios are validated by institutional training officers.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => setActiveTab("RECOMMENDATIONS")}
                className="rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-700"
              >
                Start Candidate Discovery
              </button>
              <button
                onClick={() => setActiveTab("VACANCIES")}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Manage Openings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: COMPANY PROFILE */}
      {activeTab === "PROFILE" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Official Recruiter Profile</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Official enterprise profile details displayed to verified colleges and students.
              </p>
            </div>
            <button
              onClick={handleOpenEditProfile}
              className="flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-700 transition"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Company Name</span>
                <span className="text-base font-extrabold text-slate-900">{company?.companyName || "Dabur India Limited"}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Sector</span>
                <span className="font-semibold text-slate-800">{company?.domain || "Enterprise & Consumer Tech"}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Official Email</span>
                <span className="font-semibold text-slate-800">{company?.user?.email || "corporate.hr@dabur.com"}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Location</span>
                <span className="font-semibold text-slate-800">{[company?.city || "Hyderabad", company?.state || "Telangana"].join(", ")}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Recruitment Lead</span>
                <span className="font-semibold text-slate-800">{company?.contactPerson || "Vikram Malhotra"} ({company?.contactDesignation || "Head of University Relations"})</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Verification Badge</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-800 font-bold px-2.5 py-0.5 mt-0.5">
                  <ShieldCheck className="h-3 w-3 text-emerald-600" />
                  Verified Corporate Recruiter
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VIEW FULL STUDENT PROFILE */}
      {selectedCandidateDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-slate-900">{selectedCandidateDetail.student.name}</h3>
                  {selectedCandidateDetail.student.verificationStatus === "VERIFIED" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      ✓ Verified Student
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-xs font-bold text-amber-700">
                      Pending Verification
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold text-slate-700">
                  {selectedCandidateDetail.student.branch}
                </p>
                <p className="text-xs text-slate-500">
                  {selectedCandidateDetail.student.college} • {selectedCandidateDetail.student.location}
                </p>
              </div>

              <button
                onClick={() => setSelectedCandidateDetail(null)}
                className="text-slate-400 hover:text-slate-600 p-1 font-bold"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Match Overview for Selected Job */}
            <div className="rounded-xl bg-gradient-to-r from-brand-50 to-purple-50 border border-brand-100 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700">Compatibility For:</span>
                  <div className="text-sm font-extrabold text-slate-900">{selectedJob.jobTitle}</div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-brand-700">{selectedCandidateDetail.matchPercentage}%</span>
                  <span className="text-[10px] text-slate-500 block">Overall Match</span>
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-2 border-t border-brand-200/50 text-[10px]">
                <div className="bg-white/80 rounded-lg p-2 text-center">
                  <span className="text-slate-400 block font-semibold">Skills (60)</span>
                  <strong className="text-slate-800 text-xs">{selectedCandidateDetail.breakdown.skillScore}</strong>
                </div>
                <div className="bg-white/80 rounded-lg p-2 text-center">
                  <span className="text-slate-400 block font-semibold">Qual (15)</span>
                  <strong className="text-slate-800 text-xs">{selectedCandidateDetail.breakdown.qualificationScore}</strong>
                </div>
                <div className="bg-white/80 rounded-lg p-2 text-center">
                  <span className="text-slate-400 block font-semibold">Branch (10)</span>
                  <strong className="text-slate-800 text-xs">{selectedCandidateDetail.breakdown.branchScore}</strong>
                </div>
                <div className="bg-white/80 rounded-lg p-2 text-center">
                  <span className="text-slate-400 block font-semibold">Location (5)</span>
                  <strong className="text-slate-800 text-xs">{selectedCandidateDetail.breakdown.locationScore}</strong>
                </div>
                <div className="bg-white/80 rounded-lg p-2 text-center">
                  <span className="text-slate-400 block font-semibold">Mode (5)</span>
                  <strong className="text-slate-800 text-xs">{selectedCandidateDetail.breakdown.workModeScore}</strong>
                </div>
                <div className="bg-white/80 rounded-lg p-2 text-center">
                  <span className="text-slate-400 block font-semibold">Exp (5)</span>
                  <strong className="text-slate-800 text-xs">{selectedCandidateDetail.breakdown.experienceScore}</strong>
                </div>
              </div>
            </div>

            {/* Academic & Assessment Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="rounded-xl bg-slate-50 p-3">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Assessment Score</span>
                <span className="text-base font-extrabold text-emerald-700">{selectedCandidateDetail.student.assessmentScore}%</span>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Graduation Year</span>
                <span className="text-base font-extrabold text-slate-800">{selectedCandidateDetail.student.graduationYear}</span>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Experience</span>
                <span className="text-xs font-bold text-slate-800">{selectedCandidateDetail.student.experienceLevel}</span>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Preferred Mode</span>
                <span className="text-xs font-bold text-slate-800">{selectedCandidateDetail.student.preferredWorkMode}</span>
              </div>
            </div>

            {/* Skills Breakdown */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                Technical & Verified Skills
              </label>
              <div className="flex flex-wrap gap-1.5">
                {selectedCandidateDetail.student.skills.map((skill) => {
                  const isMatch = selectedJob.requiredSkills.includes(skill);
                  return (
                    <span
                      key={skill}
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                        isMatch
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {isMatch && "✓ "}
                      {skill}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Projects */}
            {selectedCandidateDetail.student.projects.length > 0 && (
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                  Highlighted Engineering Projects
                </label>
                <div className="space-y-2.5">
                  {selectedCandidateDetail.student.projects.map((proj, pIdx) => (
                    <div key={pIdx} className="rounded-xl border border-slate-200 p-3.5 space-y-1">
                      <div className="font-bold text-slate-900 text-xs">{proj.title}</div>
                      <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {proj.technologies.map((t) => (
                          <span key={t} className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {selectedCandidateDetail.student.certifications.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                  Verified Industry Certifications
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCandidateDetail.student.certifications.map((c, cIdx) => (
                    <span key={cIdx} className="rounded-lg bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 text-xs font-medium flex items-center gap-1">
                      <Award className="h-3 w-3 text-blue-600" />
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setResumeModalStudent(selectedCandidateDetail.student)}
                className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline"
              >
                <FileText className="h-3.5 w-3.5" />
                View Verified Resume
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleShortlist(selectedCandidateDetail.student.studentId)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition flex items-center gap-1 ${
                    shortlistedCandidateIds.has(selectedCandidateDetail.student.studentId)
                      ? "bg-amber-100 text-amber-800 border border-amber-300"
                      : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <BookmarkCheck className="h-3.5 w-3.5" />
                  {shortlistedCandidateIds.has(selectedCandidateDetail.student.studentId) ? "Shortlisted" : "Shortlist"}
                </button>

                <button
                  onClick={() => handleToggleInvite(selectedCandidateDetail.student.studentId)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition flex items-center gap-1 ${
                    invitedCandidateIds.has(selectedCandidateDetail.student.studentId)
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-brand-600 text-white hover:bg-brand-700 shadow-sm"
                  }`}
                >
                  {invitedCandidateIds.has(selectedCandidateDetail.student.studentId) ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Invited to Apply
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      Invite to Apply
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MODAL: RESUME PREVIEW */}
      {resumeModalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 sm:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Verified Academic Transcript & Resume</span>
                <h4 className="text-lg font-bold text-slate-900">{resumeModalStudent.name}</h4>
              </div>
              <button onClick={() => setResumeModalStudent(null)} className="text-slate-400 font-bold p-1">✕</button>
            </div>

            <div className="border border-slate-200 rounded-xl p-6 bg-slate-50 space-y-4 text-xs font-mono">
              <div className="border-b border-slate-200 pb-3">
                <div className="text-sm font-bold text-slate-900">{resumeModalStudent.name}</div>
                <div className="text-slate-600">{resumeModalStudent.email} • {resumeModalStudent.phone}</div>
                <div className="text-slate-600">{resumeModalStudent.college}, {resumeModalStudent.location}</div>
              </div>

              <div>
                <div className="font-bold text-slate-800 uppercase mb-1">Education</div>
                <div>Bachelor of Technology in {resumeModalStudent.branch}</div>
                <div>{resumeModalStudent.college} (Graduating {resumeModalStudent.graduationYear})</div>
                <div>Proctored Assessment Score: <strong>{resumeModalStudent.assessmentScore}%</strong></div>
              </div>

              <div>
                <div className="font-bold text-slate-800 uppercase mb-1">Technical Competencies</div>
                <div>{resumeModalStudent.skills.join(", ")}</div>
              </div>

              <div>
                <div className="font-bold text-slate-800 uppercase mb-1">Experience</div>
                <div>{resumeModalStudent.internshipExperience}</div>
              </div>

              <div>
                <div className="font-bold text-slate-800 uppercase mb-1">Projects</div>
                {resumeModalStudent.projects.map((p, idx) => (
                  <div key={idx} className="mb-2">
                    <div className="font-semibold">• {p.title}</div>
                    <div className="text-slate-500 pl-2">{p.description}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setResumeModalStudent(null)}
                className="rounded-xl bg-slate-900 text-white px-4 py-2 text-xs font-bold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: POST NEW JOB */}
      {vacancyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Post New Hiring Role</h3>
              <button onClick={() => setVacancyModalOpen(false)} className="text-slate-400 font-bold p-1">✕</button>
            </div>

            <form onSubmit={handleCreateNewVacancy} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700">Role Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Associate Full Stack Engineer"
                  className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700">Type *</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 bg-white"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Part-time">Part-time</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700">Work Mode *</label>
                  <select
                    value={newWorkMode}
                    onChange={(e) => setNewWorkMode(e.target.value as any)}
                    className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 bg-white"
                  >
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                    <option value="Onsite">Onsite</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700">Location *</label>
                  <input
                    type="text"
                    required
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Hyderabad / Visakhapatnam"
                    className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700">Remuneration *</label>
                  <input
                    type="text"
                    required
                    value={newSalary}
                    onChange={(e) => setNewSalary(e.target.value)}
                    placeholder="e.g. ₹8.5 LPA"
                    className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700">Prerequisite Skills (comma separated) *</label>
                <input
                  type="text"
                  required
                  value={newSkillsStr}
                  onChange={(e) => setNewSkillsStr(e.target.value)}
                  placeholder="e.g. Python, SQL, Git, Machine Learning"
                  className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700">Job Description *</label>
                <textarea
                  rows={3}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe the opportunity and candidate expectations..."
                  className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setVacancyModalOpen(false)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingVacancy}
                  className="rounded-xl bg-brand-600 px-5 py-2 text-xs font-bold text-white hover:bg-brand-700"
                >
                  {savingVacancy ? "Publishing..." : "Publish & Evaluate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT COMPANY PROFILE */}
      {profileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Edit Recruiter Profile</h3>
              <button onClick={() => setProfileModalOpen(false)} className="text-slate-400 font-bold p-1">✕</button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700">Company Name *</label>
                <input
                  type="text"
                  required
                  value={editCompanyName}
                  onChange={(e) => setEditCompanyName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700">Sector</label>
                  <input
                    type="text"
                    value={editDomain}
                    onChange={(e) => setEditDomain(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700">Website</label>
                  <input
                    type="text"
                    value={editWebsite}
                    onChange={(e) => setEditWebsite(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700">Recruiter Name</label>
                  <input
                    type="text"
                    value={editContactPerson}
                    onChange={(e) => setEditContactPerson(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700">Designation</label>
                  <input
                    type="text"
                    value={editContactDesignation}
                    onChange={(e) => setEditContactDesignation(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setProfileModalOpen(false)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-700"
                >
                  {savingProfile ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
