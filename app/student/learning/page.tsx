"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen, CheckCircle2, Clock, Play, ArrowRight, Loader2,
  Star, Tag, BarChart3, Sparkles
} from "lucide-react";

const ROLES = [
  "Full Stack Developer", "Backend Developer", "Frontend Developer",
  "Data Analyst", "Data Scientist", "AI/ML Engineer",
  "Cloud Engineer", "DevOps Engineer", "Cybersecurity Analyst"
];

const DIFFICULTY_COLORS: Record<string, string> = {
  BEGINNER: "bg-emerald-50 text-emerald-700 border-emerald-200",
  INTERMEDIATE: "bg-amber-50 text-amber-700 border-amber-200",
  ADVANCED: "bg-red-50 text-red-700 border-red-200",
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  NOT_STARTED: { label: "Start", color: "bg-blue-600 text-white hover:bg-blue-700" },
  IN_PROGRESS: { label: "In Progress", color: "bg-amber-500 text-white hover:bg-amber-600" },
  COMPLETED: { label: "✓ Done", color: "bg-emerald-500 text-white cursor-default" },
};

export default function LearningPage() {
  const [recommended, setRecommended] = useState<any[]>([]);
  const [roadmap, setRoadmap] = useState<any[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState("Full Stack Developer");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchLearning = async (role = selectedRole) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/student/learning?role=${encodeURIComponent(role)}`);
      const data = await res.json();
      setRecommended(data.recommended || []);
      setRoadmap(data.roadmap || []);
      setProgress(data.progress || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLearning(); }, []);

  const updateProgress = async (resourceId: string, status: string) => {
    if (status === "COMPLETED") return;
    const nextStatus = status === "NOT_STARTED" ? "IN_PROGRESS" : "COMPLETED";
    setUpdatingId(resourceId);
    try {
      await fetch("/api/student/learning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceId, status: nextStatus }),
      });
      fetchLearning(selectedRole);
    } finally {
      setUpdatingId(null);
    }
  };

  const getResourceStatus = (resourceId: string) => {
    const p = progress.find((p: any) => p.resourceId === resourceId);
    return p?.status || "NOT_STARTED";
  };

  const completedCount = roadmap.filter((r: any) => getResourceStatus(r.id) === "COMPLETED").length;
  const roadmapProgress = roadmap.length > 0 ? Math.round((completedCount / roadmap.length) * 100) : 0;

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <BookOpen className="text-purple-600" size={26} /> Learning Center
        </h1>
        <p className="text-sm text-slate-500 mt-1">Curated courses and roadmaps based on your skill gaps and career goals.</p>
      </div>

      {/* Role Roadmap Selector */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} className="text-purple-600" />
          <h2 className="text-sm font-bold text-slate-900">Career Roadmap</h2>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {ROLES.map(role => (
            <button key={role} onClick={() => { setSelectedRole(role); fetchLearning(role); }}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition ${
                selectedRole === role ? "bg-purple-600 text-white border-purple-600" : "bg-white text-slate-600 border-slate-200 hover:border-purple-300"
              }`}>
              {role}
            </button>
          ))}
        </div>

        {/* Progress Bar */}
        {roadmap.length > 0 && (
          <div className="mb-5">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-700">{selectedRole} Roadmap</span>
              <span className="font-bold text-purple-600">{completedCount}/{roadmap.length} complete</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
                style={{ width: `${roadmapProgress}%` }} />
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 size={24} className="animate-spin text-purple-500" />
          </div>
        ) : roadmap.length === 0 ? (
          <div className="text-center py-8">
            <BarChart3 size={32} className="text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">No roadmap items for this role yet.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-5 top-4 bottom-4 w-px bg-slate-200" />
            <div className="space-y-3">
              {roadmap.map((resource: any, idx: number) => {
                const status = getResourceStatus(resource.id);
                const statusCfg = STATUS_CONFIG[status];
                const isDone = status === "COMPLETED";
                return (
                  <div key={resource.id} className={`relative flex gap-4 p-4 rounded-xl border transition ${isDone ? "border-emerald-200 bg-emerald-50/40" : "border-slate-200 bg-white"}`}>
                    {/* Step indicator */}
                    <div className={`h-10 w-10 rounded-full border-2 flex items-center justify-center shrink-0 z-10 ${isDone ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 bg-white text-slate-500"}`}>
                      {isDone ? <CheckCircle2 size={18} /> : <span className="text-xs font-bold">{idx + 1}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-sm font-bold text-slate-900">{resource.title}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{resource.provider}</div>
                          <div className="flex flex-wrap gap-2 mt-1.5">
                            <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[resource.difficulty] || ""}`}>{resource.difficulty}</span>
                            <span className="text-[10px] text-slate-500 flex items-center gap-0.5"><Clock size={9} />{resource.estimatedHours}h</span>
                            <span className={`text-[10px] font-bold ${resource.cost === "FREE" ? "text-emerald-600" : "text-slate-500"}`}>{resource.cost}</span>
                            {resource.skill && <span className="text-[10px] font-medium text-purple-600 flex items-center gap-0.5"><Tag size={9} />{resource.skill.name}</span>}
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <a href={resource.url} target="_blank" rel="noreferrer"
                            className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline">
                            <Play size={11} /> Course
                          </a>
                          <button onClick={() => updateProgress(resource.id, status)} disabled={updatingId === resource.id || isDone}
                            className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition ${statusCfg.color} disabled:opacity-60`}>
                            {updatingId === resource.id ? <Loader2 size={10} className="animate-spin" /> : null}
                            {statusCfg.label}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Recommended Courses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Star size={18} className="text-amber-500" />
            <h2 className="text-base font-bold text-slate-900">Recommended Courses</h2>
          </div>
          <p className="text-xs text-slate-400">Based on your skill gaps</p>
        </div>

        {recommended.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <BookOpen size={36} className="text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">Add skills to get personalized recommendations.</p>
            <Link href="/student/profile" className="text-xs text-blue-600 font-semibold hover:underline mt-1 inline-block">Add Skills →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommended.map((r: any) => {
              const status = getResourceStatus(r.id);
              const statusCfg = STATUS_CONFIG[status];
              return (
                <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition flex flex-col">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="h-10 w-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
                      <BookOpen size={18} className="text-purple-600" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-2">{r.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{r.provider}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[r.difficulty] || ""}`}>{r.difficulty}</span>
                    <span className="text-[10px] text-slate-500 flex items-center gap-0.5"><Clock size={9} />{r.estimatedHours}h</span>
                    <span className={`text-[10px] font-bold ${r.cost === "FREE" ? "text-emerald-600" : "text-slate-500"}`}>{r.cost}</span>
                    <span className="text-[10px] text-amber-500 font-medium">★ {r.rating}</span>
                  </div>

                  {r.skill && (
                    <div className="text-xs text-purple-600 font-medium mb-2 flex items-center gap-1">
                      <Tag size={11} /> Covers: {r.skill.name}
                    </div>
                  )}

                  {r.whyRecommended && (
                    <p className="text-[11px] text-slate-500 italic bg-slate-50 rounded-lg p-2 mb-3 line-clamp-2">💡 {r.whyRecommended}</p>
                  )}

                  <div className="flex gap-2 mt-auto pt-2 border-t border-slate-100">
                    <a href={r.url} target="_blank" rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-1 rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition">
                      <Play size={12} /> View Course
                    </a>
                    <button onClick={() => updateProgress(r.id, status)} disabled={updatingId === r.id || status === "COMPLETED"}
                      className={`flex-1 flex items-center justify-center gap-1 rounded-xl py-2 text-xs font-semibold transition ${statusCfg.color}`}>
                      {updatingId === r.id ? <Loader2 size={12} className="animate-spin" /> : null}
                      {statusCfg.label}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
