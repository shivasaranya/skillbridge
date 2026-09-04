"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Building2, 
  Users, 
  GraduationCap, 
  TrendingUp, 
  Award, 
  Briefcase, 
  BarChart3, 
  PieChart as PieIcon, 
  FileText, 
  CheckCircle2, 
  AlertTriangle,
  Loader2,
  ExternalLink
} from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";

export default function InstitutionDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => res.json())
      .then((resData) => setData(resData))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  const { metrics, readinessDistribution, skillAnalytics, collaborations, funnelData } = data;

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b"];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. INSTITUTION HEADER */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
                🏛️ Institutional Governance & TPO Suite
              </span>
              <span className="rounded-md bg-emerald-100 text-emerald-800 px-2 py-0.5 text-xs font-bold">
                NAAC A++ Accredited
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              National Institute of Ayurveda (Deemed University)
            </h1>
            <p className="text-xs text-slate-500">
              AISHE Code: U-0465 • Jaipur, Rajasthan • Ministry of Ayush
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button className="rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 shadow-xs">
              <FileText className="h-4 w-4 text-slate-500" />
              <span>Export NAAC/NIRF Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. STATS OVERVIEW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Enrolled Candidates</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{metrics.totalStudents || 3}</div>
          <div className="text-[11px] text-slate-400 mt-1">Undergraduate & Postgraduates</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Placement / Internship Rate</div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">67%</div>
          <div className="text-[11px] text-slate-400 mt-1">Class of 2026 Graduating Cohort</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Corporate Partners</div>
          <div className="text-2xl font-extrabold text-brand-600 mt-1">{metrics.totalCompanies || 2}</div>
          <div className="text-[11px] text-slate-400 mt-1">Active MoUs & Research Grants</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Faculty Guides</div>
          <div className="text-2xl font-extrabold text-purple-600 mt-1">{metrics.totalFaculty || 1}</div>
          <div className="text-[11px] text-slate-400 mt-1">Mentoring & NOC Sign-offs</div>
        </div>
      </div>

      {/* 3. INTERACTIVE RECHARTS: SKILL READINESS & DEMAND COMPARISON */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Readiness Distribution Pie */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <PieIcon className="h-5 w-5 text-brand-600" />
              <h2 className="text-base font-bold text-slate-900">Student Skill Readiness Index</h2>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={readinessDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {readinessDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <p className="text-xs text-slate-500 text-center">
            Evaluated from proctored skill assessments, CGPA transcripts, and clinical logbooks.
          </p>
        </div>

        {/* Industry Skill Demand vs Student Competency Bar Chart */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-brand-600" />
              <h2 className="text-base font-bold text-slate-900">Market Demand vs Campus Competency</h2>
            </div>
            <span className="text-[11px] text-slate-400">Board of Studies Telemetry</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillAnalytics} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="industryDemand" name="Industry Openings Weight" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="studentCompetency" name="Campus Proficiency Index" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl bg-amber-50 p-2.5 text-xs text-amber-800 border border-amber-200 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
            <span>Curriculum Action: Industry demand for <strong>HPLC & Biostatistics</strong> exceeds campus training. Recommended to add bridge electives.</span>
          </div>
        </div>

      </div>

      {/* 4. ACTIVE MoUs & COLLABORATION QUOTAS */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-purple-600" />
            <h2 className="text-base font-bold text-slate-900">Active Industry MoUs & Annual Placement Quotas</h2>
          </div>
          <Link href="/collaborations" className="text-xs font-semibold text-brand-600 hover:underline">
            Manage MoUs
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {collaborations.map((collab: any) => (
            <div key={collab.id} className="rounded-xl border border-slate-200 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{collab.company?.companyName}</span>
                <span className="rounded bg-purple-100 text-purple-800 text-[11px] font-bold px-2 py-0.5">
                  {collab.type}
                </span>
              </div>
              <p className="text-xs text-slate-600">{collab.title}</p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Annual Internship Quota: <strong className="text-slate-800">{collab.quota} Students</strong></span>
                <span>R&D Grant: <strong className="text-emerald-700">₹{(collab.budget / 100000).toFixed(1)} Lakhs</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
