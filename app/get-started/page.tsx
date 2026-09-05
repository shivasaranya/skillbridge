"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap, Building2, BookOpen, ShieldCheck,
  ArrowRight, CheckCircle2, ChevronRight, Sparkles,
} from "lucide-react";

const ROLES = [
  {
    id: "STUDENT",
    icon: GraduationCap,
    label: "Student",
    tagline: "Build your career",
    desc: "Create your skill passport, discover internships & jobs matched to your profile, analyze skill gaps, and track your career readiness.",
    features: ["Skill Gap Analysis", "Internship Matching", "Learning Roadmap", "Application Tracker"],
    gradient: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50",
    border: "border-blue-200",
    activeBg: "bg-blue-600",
    activeText: "text-white",
    badgeBg: "bg-blue-100 text-blue-700",
    href: "/register",
    cta: "Register as Student",
    accent: "text-blue-600",
  },
  {
    id: "FACULTY",
    icon: BookOpen,
    label: "Faculty / TPO",
    tagline: "Mentor the next generation",
    desc: "Map your institution's skills, manage student placements, create bridge courses, and collaborate with industry partners.",
    features: ["Batch Skill Overview", "Placement Management", "Industry MoUs", "Bridge Courses"],
    gradient: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    activeBg: "bg-emerald-600",
    activeText: "text-white",
    badgeBg: "bg-emerald-100 text-emerald-700",
    href: "/register?role=FACULTY",
    cta: "Register as Faculty",
    accent: "text-emerald-600",
  },
  {
    id: "INDUSTRY",
    icon: Building2,
    label: "Industry / Recruiter",
    tagline: "Hire verified talent",
    desc: "Post internships and jobs, browse skill-verified candidates, run skill assessments, and build university partnerships.",
    features: ["Post Opportunities", "Skill-Verified Candidates", "Assessment Tools", "University Connect"],
    gradient: "from-purple-500 to-violet-500",
    bg: "bg-purple-50",
    border: "border-purple-200",
    activeBg: "bg-purple-600",
    activeText: "text-white",
    badgeBg: "bg-purple-100 text-purple-700",
    href: "/register?role=INDUSTRY",
    cta: "Register as Recruiter",
    accent: "text-purple-600",
  },
  {
    id: "INSTITUTION",
    icon: ShieldCheck,
    label: "Institution / Admin",
    tagline: "Lead placement excellence",
    desc: "Get a bird's-eye view of your institution's skill health, placement statistics, and industry collaboration pipeline.",
    features: ["Placement Analytics", "NAAC Skill Reports", "MoU Management", "TPO Coordination"],
    gradient: "from-amber-500 to-orange-500",
    bg: "bg-amber-50",
    border: "border-amber-200",
    activeBg: "bg-amber-600",
    activeText: "text-white",
    badgeBg: "bg-amber-100 text-amber-700",
    href: "/register?role=INSTITUTION",
    cta: "Register Institution",
    accent: "text-amber-600",
  },
];

export default function GetStartedPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();

  const selectedRole = ROLES.find(r => r.id === selected);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 py-14 sm:py-20">

        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="h-10 w-10 rounded-2xl bg-blue-500 flex items-center justify-center shadow-lg">
              <GraduationCap size={22} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white">SkillBridge</span>
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-300 mb-5">
            <Sparkles size={12} /> Academia–Industry Collaboration Platform
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            Who are you joining as?
          </h1>
          <p className="text-blue-200/70 mt-3 text-base max-w-xl mx-auto">
            Select your role to get a personalized experience tailored to your goals.
          </p>
        </div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {ROLES.map((role) => {
            const Icon = role.icon;
            const isSelected = selected === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setSelected(role.id)}
                className={`text-left p-6 rounded-2xl border-2 transition-all duration-200 group ${
                  isSelected
                    ? `${role.border} bg-white/10 shadow-2xl ring-2 ring-white/20 scale-[1.01]`
                    : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                {/* Icon + label */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${role.gradient} flex items-center justify-center shadow-lg`}>
                    <Icon size={22} className="text-white" />
                  </div>
                  {isSelected && (
                    <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center shrink-0">
                      <CheckCircle2 size={16} className={role.accent} />
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <h2 className="text-lg font-extrabold text-white">{role.label}</h2>
                  <p className={`text-sm font-semibold ${isSelected ? "text-blue-300" : "text-slate-400"}`}>{role.tagline}</p>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed mb-4">{role.desc}</p>

                {/* Feature pills */}
                <div className="flex flex-wrap gap-1.5">
                  {role.features.map(f => (
                    <span key={f} className="text-[10px] font-semibold bg-white/10 text-slate-300 rounded-full px-2.5 py-1">
                      {f}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-4">
          {selectedRole ? (
            <>
              <Link
                href={selectedRole.href}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r ${selectedRole.gradient} px-8 py-4 text-base font-bold text-white shadow-2xl hover:opacity-90 transition`}
              >
                {selectedRole.cta}
                <ArrowRight size={18} />
              </Link>
              <p className="text-xs text-slate-400">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-400 font-semibold hover:underline">Sign In →</Link>
              </p>
            </>
          ) : (
            <>
              <p className="text-slate-400 text-sm font-medium">← Select a role above to continue</p>
              <p className="text-xs text-slate-500">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-400 font-semibold hover:underline">Sign In →</Link>
              </p>
            </>
          )}
        </div>

        {/* Bottom note */}
        <p className="text-center text-xs text-slate-500 mt-10">
          🔒 Free to join · No credit card required · SIH26044 — Smart India Hackathon 2026
        </p>
      </div>
    </div>
  );
}
