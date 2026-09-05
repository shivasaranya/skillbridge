"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2, Search, MapPin, Clock, Briefcase, Filter,
  CheckCircle2, ExternalLink, Loader2, ChevronRight, Star,
  DollarSign, Users, TrendingUp, Award
} from "lucide-react";

// Rich static job data so the page always has content
const STATIC_JOBS = [
  {
    id: "j1", title: "Software Development Engineer", type: "JOB", workMode: "HYBRID",
    company: { companyName: "Microsoft India", logoUrl: "", domain: "TECHNOLOGY" },
    location: "Hyderabad, Telangana", stipendOrSalary: "₹18–28 LPA",
    deadline: "2026-11-30", skills: [{ skill: { name: "React" } }, { skill: { name: "TypeScript" } }, { skill: { name: "Node.js" } }, { skill: { name: "Azure" } }],
    minCgpa: 7.5, vacancies: 12, matchScore: 88,
    description: "Join Microsoft's India Development Center to build next-generation cloud solutions powering millions of users globally.",
    badge: "Top Recruiter", badgeColor: "bg-blue-100 text-blue-700"
  },
  {
    id: "j2", title: "Data Scientist — Analytics", type: "JOB", workMode: "REMOTE",
    company: { companyName: "Google India", logoUrl: "", domain: "TECHNOLOGY" },
    location: "Bengaluru, Karnataka", stipendOrSalary: "₹22–35 LPA",
    deadline: "2026-10-15", skills: [{ skill: { name: "Python" } }, { skill: { name: "TensorFlow" } }, { skill: { name: "SQL" } }, { skill: { name: "BigQuery" } }],
    minCgpa: 8.0, vacancies: 5, matchScore: 74,
    description: "Work on machine learning models that power Search, Ads, and YouTube recommendations at global scale.",
    badge: "High Package", badgeColor: "bg-emerald-100 text-emerald-700"
  },
  {
    id: "j3", title: "Full Stack Engineer", type: "JOB", workMode: "ONSITE",
    company: { companyName: "Flipkart", logoUrl: "", domain: "E_COMMERCE" },
    location: "Bengaluru, Karnataka", stipendOrSalary: "₹14–22 LPA",
    deadline: "2026-10-31", skills: [{ skill: { name: "React" } }, { skill: { name: "Java" } }, { skill: { name: "Spring Boot" } }, { skill: { name: "MySQL" } }],
    minCgpa: 7.0, vacancies: 20, matchScore: 82,
    description: "Build scalable e-commerce infrastructure that handles India's largest shopping events like Big Billion Days.",
    badge: "Mass Hiring", badgeColor: "bg-purple-100 text-purple-700"
  },
  {
    id: "j4", title: "DevOps / Cloud Engineer", type: "JOB", workMode: "HYBRID",
    company: { companyName: "Amazon Web Services", logoUrl: "", domain: "CLOUD" },
    location: "Chennai, Tamil Nadu", stipendOrSalary: "₹16–26 LPA",
    deadline: "2026-11-15", skills: [{ skill: { name: "AWS" } }, { skill: { name: "Docker" } }, { skill: { name: "Kubernetes" } }, { skill: { name: "Terraform" } }],
    minCgpa: 7.5, vacancies: 8, matchScore: 65,
    description: "Maintain and scale AWS global infrastructure used by millions of customers and enterprises worldwide.",
    badge: "", badgeColor: ""
  },
  {
    id: "j5", title: "Product Manager — Platform", type: "JOB", workMode: "ONSITE",
    company: { companyName: "Razorpay", logoUrl: "", domain: "FINTECH" },
    location: "Bengaluru, Karnataka", stipendOrSalary: "₹20–32 LPA",
    deadline: "2026-10-20", skills: [{ skill: { name: "Product Strategy" } }, { skill: { name: "SQL" } }, { skill: { name: "Agile" } }],
    minCgpa: 7.0, vacancies: 3, matchScore: 55,
    description: "Drive the strategy and roadmap for Razorpay's core payment platform products used by 8M+ businesses.",
    badge: "Startup Unicorn", badgeColor: "bg-amber-100 text-amber-700"
  },
  {
    id: "j6", title: "Machine Learning Engineer", type: "JOB", workMode: "REMOTE",
    company: { companyName: "Infosys", logoUrl: "", domain: "IT_SERVICES" },
    location: "Remote (India)", stipendOrSalary: "₹12–18 LPA",
    deadline: "2026-12-31", skills: [{ skill: { name: "Python" } }, { skill: { name: "PyTorch" } }, { skill: { name: "MLOps" } }],
    minCgpa: 6.5, vacancies: 50, matchScore: 71,
    description: "Build and deploy ML models for enterprise clients across healthcare, banking, and retail sectors.",
    badge: "Work from Home", badgeColor: "bg-cyan-100 text-cyan-700"
  },
];

const WORK_MODES = ["ALL", "REMOTE", "ONSITE", "HYBRID"];
const DOMAINS = ["ALL", "Technology", "Fintech", "E-Commerce", "Cloud", "IT Services"];

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>(STATIC_JOBS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [workMode, setWorkMode] = useState("ALL");
  const [applying, setApplying] = useState<string | null>(null);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/opportunities?type=JOB")
      .then(r => r.json())
      .then(data => { if (data.opportunities?.length > 0) setJobs(data.opportunities); })
      .catch(() => {});
  }, []);

  const handleApply = async (jobId: string) => {
    setApplying(jobId);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opportunityId: jobId, coverLetter: "I am very interested in this role and believe my skills are an excellent match." }),
      });
      if (res.ok || res.status === 401) {
        setAppliedIds(prev => new Set<string>(Array.from(prev).concat(jobId)));
      }
    } finally {
      setApplying(null);
    }
  };

  const filtered = jobs.filter(j => {
    const matchSearch = !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.company?.companyName?.toLowerCase().includes(search.toLowerCase());
    const matchMode = workMode === "ALL" || j.workMode === workMode;
    return matchSearch && matchMode;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Graduate Placement & Career Opportunities
        </h1>
        <p className="text-slate-600 max-w-2xl">
          Full-time roles from India's top companies — filtered by your skills, location, and preferences.
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: Briefcase,   label: "Active Roles",       value: "1,240+",  color: "text-blue-600",   bg: "bg-blue-50" },
          { icon: Building2,   label: "Hiring Companies",   value: "380+",    color: "text-emerald-600", bg: "bg-emerald-50" },
          { icon: TrendingUp,  label: "Avg. CTC Offered",   value: "₹12 LPA", color: "text-purple-600", bg: "bg-purple-50" },
          { icon: Users,       label: "Students Placed",    value: "8,500+",  color: "text-amber-600",  bg: "bg-amber-50" },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl ${s.bg} border border-slate-100 p-4 flex items-center gap-3`}>
            <s.icon size={20} className={s.color} />
            <div>
              <div className={`text-lg font-extrabold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-500 font-medium">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by role, company, skill…"
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1"><Filter size={11} /> Work Mode:</span>
          {WORK_MODES.map(m => (
            <button key={m} onClick={() => setWorkMode(m)}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition ${workMode === m ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"}`}>
              {m === "ALL" ? "All Modes" : m}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 font-medium">{filtered.length} job{filtered.length !== 1 ? "s" : ""} found</p>
        <Link href="/student/opportunities" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
          View in my dashboard <ChevronRight size={13} />
        </Link>
      </div>

      {/* Job Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map(job => {
          const isApplied = appliedIds.has(job.id);
          const daysLeft = Math.ceil((new Date(job.deadline).getTime() - Date.now()) / 86400000);
          return (
            <div key={job.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition flex flex-col">
              <div className="flex items-start gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-100 flex items-center justify-center shrink-0">
                  <Building2 size={22} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{job.title}</h3>
                      <p className="text-xs font-semibold text-blue-600 mt-0.5">{job.company?.companyName}</p>
                    </div>
                    {job.matchScore !== undefined && (
                      <span className={`shrink-0 text-xs font-bold px-2 py-1 rounded-full ${job.matchScore >= 75 ? "bg-emerald-50 text-emerald-700" : job.matchScore >= 55 ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-500"}`}>
                        {job.matchScore}% Match
                      </span>
                    )}
                  </div>
                  {job.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${job.badgeColor} mt-1 inline-block`}>{job.badge}</span>
                  )}
                </div>
              </div>

              {job.description && (
                <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed">{job.description}</p>
              )}

              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">{job.workMode}</span>
                <span className="text-[10px] flex items-center gap-1 text-slate-500"><MapPin size={9} />{job.location}</span>
                <span className="text-[10px] flex items-center gap-1 font-semibold text-emerald-700"><DollarSign size={9} />{job.stipendOrSalary}</span>
                {job.vacancies && <span className="text-[10px] flex items-center gap-1 text-slate-500"><Users size={9} />{job.vacancies} seats</span>}
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {job.skills?.slice(0, 4).map((os: any) => (
                  <span key={os.skill?.name} className="text-[10px] font-medium bg-slate-100 text-slate-600 rounded-md px-2 py-0.5">{os.skill?.name}</span>
                ))}
              </div>

              <div className={`text-[11px] font-semibold mb-3 ${daysLeft <= 10 ? "text-red-500" : "text-slate-400"}`}>
                ⏱ {daysLeft > 0 ? `${daysLeft} days left to apply` : "Deadline passed"}
              </div>

              <div className="flex gap-2 mt-auto pt-3 border-t border-slate-100">
                <button onClick={() => !isApplied && handleApply(job.id)}
                  disabled={applying === job.id || isApplied}
                  className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition ${isApplied ? "bg-emerald-100 text-emerald-700 cursor-default" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
                  {applying === job.id ? <Loader2 size={12} className="animate-spin" /> : null}
                  {isApplied ? <><CheckCircle2 size={12} /> Applied</> : "Apply Now"}
                </button>
                <Link href="/student/skill-gap"
                  className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition">
                  Skill Gap <ChevronRight size={12} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-blue-900 p-8 text-center text-white">
        <Award size={32} className="mx-auto mb-3 text-amber-400" />
        <h3 className="text-xl font-extrabold mb-2">Boost your job match score</h3>
        <p className="text-slate-300 text-sm mb-5 max-w-md mx-auto">Students with verified skills get 4x more recruiter callbacks. Complete your Skill Passport today.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/student/skills" className="rounded-xl bg-white text-slate-900 px-6 py-2.5 text-sm font-bold hover:bg-slate-100 transition">Add Skills</Link>
          <Link href="/student/dashboard" className="rounded-xl border border-white/30 text-white px-6 py-2.5 text-sm font-semibold hover:bg-white/10 transition">Go to Dashboard</Link>
        </div>
      </div>
    </div>
  );
}
