"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2, Briefcase, Users, Sparkles, Plus, ChevronRight,
  CheckCircle2, Clock, XCircle, Loader2, ExternalLink, Globe,
  Phone, Mail, MapPin, ShieldCheck,
} from "lucide-react";

export default function IndustryDashboardPage() {
  const [company, setCompany] = useState<any>(null);
  const [vacancies, setVacancies] = useState<any[]>([]);
  const [recentApps, setRecentApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [compRes, vacRes, appRes] = await Promise.all([
          fetch("/api/industry/profile"),
          fetch("/api/industry/vacancies"),
          fetch("/api/industry/applicants"),
        ]);
        const compData = await compRes.json();
        const vacData = await vacRes.json();
        const appData = await appRes.json();

        setCompany(compData.company ?? null);
        setVacancies(vacData.vacancies ?? []);
        setRecentApps((appData.applicants ?? []).slice(0, 5));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  const activeVacancies = vacancies.filter((v) => v.status === "OPEN");
  const totalApps = recentApps.length;
  const shortlisted = recentApps.filter((a) => a.status === "SHORTLISTED" || a.status === "INTERVIEW" || a.status === "SELECTED").length;
  const profileComplete = company?.companyName && company?.description && company?.contactPerson && company?.phone;

  const statusConfig: Record<string, { label: string; color: string }> = {
    APPLIED:     { label: "Applied",     color: "bg-blue-100 text-blue-700" },
    REVIEWING:   { label: "Reviewing",   color: "bg-amber-100 text-amber-700" },
    SHORTLISTED: { label: "Shortlisted", color: "bg-purple-100 text-purple-700" },
    INTERVIEW:   { label: "Interview",   color: "bg-indigo-100 text-indigo-700" },
    SELECTED:    { label: "Selected",    color: "bg-emerald-100 text-emerald-700" },
    REJECTED:    { label: "Rejected",    color: "bg-red-100 text-red-700" },
  };

  return (
    <div className="space-y-6">
      {/* Profile incomplete warning */}
      {!profileComplete && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-center justify-between gap-4">
          <div className="text-sm text-amber-800">
            <span className="font-bold">Complete your company profile</span> to attract top candidates and gain full visibility.
          </div>
          <Link href="/industry/profile" className="shrink-0 text-xs font-semibold text-amber-800 border border-amber-300 rounded-lg px-3 py-1.5 hover:bg-amber-100 transition">
            Complete Profile →
          </Link>
        </div>
      )}

      {/* Company Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white font-bold text-xl shrink-0">
              {(company?.companyName ?? "C").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-extrabold text-slate-900">{company?.companyName ?? "Your Company"}</h1>
                {company?.isVerified && (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
                    <ShieldCheck size={11} /> Verified
                  </span>
                )}
              </div>
              <div className="text-sm text-slate-500 mt-0.5">{company?.domain ?? "Industry Partner"}</div>
              <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
                {(company?.city || company?.state) && (
                  <span className="flex items-center gap-1"><MapPin size={11} />{[company.city, company.state].filter(Boolean).join(", ")}</span>
                )}
                {company?.website && (
                  <a href={company.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-purple-600 hover:underline">
                    <Globe size={11} /> {company.website.replace(/^https?:\/\//, "")}
                  </a>
                )}
                {company?.user?.email && (
                  <span className="flex items-center gap-1"><Mail size={11} />{company.user.email}</span>
                )}
                {company?.phone && (
                  <span className="flex items-center gap-1"><Phone size={11} />{company.phone}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            <Link href="/industry/vacancies/new"
              className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition shadow-sm">
              <Plus size={15} /> Post Vacancy
            </Link>
            <Link href="/industry/profile"
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
              Edit Profile
            </Link>
          </div>
        </div>

        {company?.description && (
          <p className="mt-4 text-sm text-slate-600 border-t border-slate-100 pt-4 line-clamp-2">
            {company.description}
          </p>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Vacancies", value: activeVacancies.length, icon: Briefcase, color: "text-purple-600", bg: "bg-purple-50", href: "/industry/vacancies" },
          { label: "Total Applications", value: recentApps.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50", href: "/industry/applicants" },
          { label: "Shortlisted", value: shortlisted, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", href: "/industry/applicants?status=SHORTLISTED" },
          { label: "Recommended", value: "—", icon: Sparkles, color: "text-amber-600", bg: "bg-amber-50", href: "/industry/recommended" },
        ].map(({ label, value, icon: Icon, color, bg, href }) => (
          <Link key={label} href={href} className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs hover:shadow-sm transition group">
            <div className={`h-9 w-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon size={18} className={color} />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{value}</div>
            <div className="text-xs text-slate-500 mt-0.5 group-hover:text-purple-600 transition">{label}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Vacancies */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2"><Briefcase size={15} className="text-purple-600" /> Active Vacancies</h2>
            <Link href="/industry/vacancies" className="text-xs text-purple-600 font-semibold hover:underline flex items-center gap-0.5">View all <ChevronRight size={12} /></Link>
          </div>
          {activeVacancies.length === 0 ? (
            <div className="p-8 text-center">
              <Briefcase size={32} className="text-slate-200 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No active vacancies yet.</p>
              <Link href="/industry/vacancies/new" className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-purple-600 hover:underline">
                <Plus size={12} /> Post your first vacancy
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {activeVacancies.slice(0, 4).map((v) => (
                <li key={v.id} className="px-4 py-3 hover:bg-slate-50 transition">
                  <Link href={`/industry/vacancies/${v.id}`} className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-800 truncate">{v.title}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>{v.type}</span>
                        <span>·</span>
                        <span>{v.location}</span>
                        <span>·</span>
                        <span className="text-blue-600">{v._count?.applications ?? 0} apps</span>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-slate-400 shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Applications */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2"><Users size={15} className="text-blue-600" /> Recent Applicants</h2>
            <Link href="/industry/applicants" className="text-xs text-purple-600 font-semibold hover:underline flex items-center gap-0.5">View all <ChevronRight size={12} /></Link>
          </div>
          {recentApps.length === 0 ? (
            <div className="p-8 text-center">
              <Users size={32} className="text-slate-200 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No applications received yet.</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentApps.map((app) => {
                const cfg = statusConfig[app.status] ?? { label: app.status, color: "bg-slate-100 text-slate-700" };
                return (
                  <li key={app.id} className="px-4 py-3 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-800">
                        {app.student?.user?.firstName} {app.student?.user?.lastName}
                      </div>
                      <div className="text-xs text-slate-500 truncate">{app.opportunity?.title}</div>
                    </div>
                    <span className={`shrink-0 text-[10px] font-bold rounded-md px-2 py-0.5 ${cfg.color}`}>{cfg.label}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: "/industry/vacancies/new", label: "Post Vacancy", icon: Plus, color: "border-purple-200 text-purple-700 hover:bg-purple-50" },
            { href: "/industry/applicants", label: "Review Applicants", icon: Users, color: "border-blue-200 text-blue-700 hover:bg-blue-50" },
            { href: "/industry/recommended", label: "Find Candidates", icon: Sparkles, color: "border-amber-200 text-amber-700 hover:bg-amber-50" },
            { href: "/industry/profile", label: "Edit Profile", icon: Building2, color: "border-slate-200 text-slate-700 hover:bg-slate-50" },
          ].map(({ href, label, icon: Icon, color }) => (
            <Link key={href} href={href}
              className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center text-xs font-semibold transition ${color}`}>
              <Icon size={20} />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
