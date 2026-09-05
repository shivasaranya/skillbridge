"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase, Plus, ChevronRight, Loader2, Clock, CheckCircle2,
  XCircle, MapPin, Users, CalendarDays, RefreshCw,
} from "lucide-react";

const TYPE_COLORS: Record<string, string> = {
  INTERNSHIP:  "bg-blue-100 text-blue-700",
  JOB:         "bg-purple-100 text-purple-700",
  TRAINING:    "bg-amber-100 text-amber-700",
  LIVE_PROJECT:"bg-emerald-100 text-emerald-700",
};

export default function IndustryVacanciesPage() {
  const [vacancies, setVacancies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [closing, setClosing] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/industry/vacancies");
      const data = await res.json();
      setVacancies(data.vacancies ?? []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    setClosing(id);
    const newStatus = currentStatus === "OPEN" ? "CLOSED" : "OPEN";
    try {
      await fetch(`/api/industry/vacancies/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      await load();
    } catch { } finally { setClosing(null); }
  };

  const filtered = filter === "ALL" ? vacancies : vacancies.filter((v) => v.status === filter);

  if (loading) {
    return <div className="min-h-[50vh] flex items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-purple-600" /></div>;
  }

  const openCount = vacancies.filter((v) => v.status === "OPEN").length;
  const closedCount = vacancies.filter((v) => v.status !== "OPEN").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2"><Briefcase size={20} className="text-purple-600" /> Vacancies</h1>
          <p className="text-sm text-slate-500 mt-0.5">{openCount} active · {closedCount} closed</p>
        </div>
        <Link href="/industry/vacancies/new"
          className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 transition shadow-sm">
          <Plus size={15} /> Post New Vacancy
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {[
          { key: "ALL", label: `All (${vacancies.length})` },
          { key: "OPEN", label: `Active (${openCount})` },
          { key: "CLOSED", label: `Closed (${closedCount})` },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${filter === key ? "bg-purple-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Briefcase size={40} className="text-slate-200 mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-medium">No vacancies found.</p>
          <Link href="/industry/vacancies/new" className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-purple-600 hover:underline">
            <Plus size={14} /> Post your first vacancy
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((v) => {
            const isOpen = v.status === "OPEN";
            const deadline = v.deadline ? new Date(v.deadline) : null;
            const isExpired = deadline && deadline < new Date();
            return (
              <div key={v.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${TYPE_COLORS[v.type] ?? "bg-slate-100 text-slate-600"}`}>
                        {v.type}
                      </span>
                      <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${isOpen ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                        {isOpen ? "● Active" : "● Closed"}
                      </span>
                      {isExpired && isOpen && (
                        <span className="text-[10px] font-bold rounded-full px-2 py-0.5 bg-red-100 text-red-600">Deadline Passed</span>
                      )}
                    </div>
                    <Link href={`/industry/vacancies/${v.id}`} className="text-base font-bold text-slate-900 hover:text-purple-700 transition">
                      {v.title}
                    </Link>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><MapPin size={11} />{v.location}</span>
                      <span className="flex items-center gap-1"><Users size={11} />{v._count?.applications ?? 0} applicants</span>
                      <span className="flex items-center gap-1">{v.stipendOrSalary}</span>
                      {deadline && (
                        <span className={`flex items-center gap-1 ${isExpired ? "text-red-500" : ""}`}>
                          <CalendarDays size={11} />Deadline: {deadline.toLocaleDateString("en-IN")}
                        </span>
                      )}
                    </div>
                    {v.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {v.skills.slice(0, 5).map((s: any) => (
                          <span key={s.id} className="text-[10px] bg-slate-100 text-slate-600 rounded px-1.5 py-0.5">{s.skill?.name}</span>
                        ))}
                        {v.skills.length > 5 && <span className="text-[10px] text-slate-400">+{v.skills.length - 5} more</span>}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => handleToggleStatus(v.id, v.status)} disabled={closing === v.id}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${isOpen ? "border-slate-200 text-slate-600 hover:bg-slate-50" : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"}`}>
                      {closing === v.id ? <Loader2 size={11} className="animate-spin" /> : isOpen ? <XCircle size={13} /> : <RefreshCw size={13} />}
                      {isOpen ? "Close" : "Reopen"}
                    </button>
                    <Link href={`/industry/vacancies/${v.id}`}
                      className="flex items-center gap-1 text-xs font-semibold text-purple-600 border border-purple-200 px-3 py-1.5 rounded-lg hover:bg-purple-50 transition">
                      View <ChevronRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
