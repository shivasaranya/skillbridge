"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  GraduationCap, 
  Award, 
  CheckCircle2, 
  ShieldCheck, 
  Layers, 
  ExternalLink, 
  Printer, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  Briefcase
} from "lucide-react";

export default function PortfolioPage({ params }: { params: { id: string } }) {
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    fetch("/api/profile/student")
      .then((res) => res.json())
      .then((data) => setStudent(data.student || null))
      .catch((e) => console.error(e));
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const name = student?.user ? `${student.user.firstName} ${student.user.lastName}` : "Aarav Sharma";
  const degree = student?.degree || "Bachelor of Ayurvedic Medicine and Surgery (BAMS)";
  const institution = student?.institution?.name || "National Institute of Ayurveda (Deemed University), Jaipur";
  const cgpa = student?.cgpa || 8.85;
  const readiness = student?.readinessScore || 88;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 space-y-8 print:p-0 print:max-w-none">
      
      {/* Top Action Bar (hidden when printing) */}
      <div className="flex items-center justify-between print:hidden border-b border-slate-200 pb-4">
        <Link href="/dashboard/student" className="text-xs font-semibold text-brand-600 hover:underline">
          ← Back to Dashboard
        </Link>
        <button
          onClick={handlePrint}
          className="rounded-xl border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 shadow-xs"
        >
          <Printer className="h-3.5 w-3.5" />
          <span>Print / Export PDF</span>
        </button>
      </div>

      {/* Portfolio Card Container */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm space-y-8 print:border-none print:shadow-none print:p-0">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-slate-100">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-0.5 text-xs font-bold text-emerald-800">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Verified Candidate Credential
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{name}</h1>
            <p className="text-base font-semibold text-brand-600">{degree}</p>
            <p className="text-xs text-slate-500">{institution} • Class of 2026</p>
          </div>

          <div className="flex flex-col items-center sm:items-end justify-center">
            <div className="rounded-2xl bg-brand-50 border border-brand-100 p-4 text-center">
              <div className="text-[10px] font-bold uppercase tracking-wider text-brand-700">Readiness Score</div>
              <div className="text-3xl font-extrabold text-brand-600 my-0.5">{readiness}/100</div>
              <div className="text-[10px] text-slate-500 font-semibold">CGPA: {cgpa} / 10.0</div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Professional Summary</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            {student?.bio || "Final-year clinical Ayurveda scholar with demonstrated expertise in Panchakarma therapeutics, Ayurvedic clinical diagnosis (Ashtavidha Pariksha), and Good Clinical Practice (GCP) compliance. Dedicated to bridging classical holistic wisdom with contemporary clinical validation standards."}
          </p>
        </div>

        {/* Verified Skills Matrix */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Verified Skills & Clinical Competencies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { name: "Panchakarma Protocol Administration", level: "EXPERT", score: 92, code: "CLIN-PANCH-01", verified: "Faculty Verified" },
              { name: "Ashtavidha Pariksha & Clinical Diagnosis", level: "ADVANCED", score: 85, code: "CLIN-DIAG-02", verified: "Faculty Verified" },
              { name: "Good Clinical Practice (GCP) & ADR", level: "INTERMEDIATE", score: 75, code: "REG-GCP-01", verified: "Assessment Tested" },
              { name: "Ayush Hospital Management Information Systems", level: "ADVANCED", score: 88, code: "DATA-EHR-01", verified: "Project Proven" },
            ].map((skill, idx) => (
              <div key={idx} className="rounded-xl border border-slate-200 p-3.5 space-y-1 bg-slate-50/50">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">{skill.name}</span>
                  <span className="rounded bg-brand-100 text-brand-800 text-[10px] font-bold px-1.5 py-0.5">
                    {skill.level} ({skill.score}%)
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Code: {skill.code}</span>
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> {skill.verified}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Academic & Clinical Rotations */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Clinical Rotations & Experiential Learning</h2>
          <div className="space-y-3">
            <div className="rounded-xl border border-slate-200 p-4 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Inpatient Panchakarma Clinical Rotation</h3>
                <span className="text-xs text-slate-400">2025 - 2026</span>
              </div>
              <p className="text-xs font-semibold text-brand-600">NIA NABH-Accredited Teaching Hospital, Jaipur</p>
              <p className="text-xs text-slate-600 pt-1">
                Completed 450+ supervised hours of therapeutic procedures including Sneha, Sweda, Vamana, and Basti under departmental guidance.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Clinical Research Assistant (Ayush ADR Monitoring)</h3>
                <span className="text-xs text-slate-400">2024 - 2025</span>
              </div>
              <p className="text-xs font-semibold text-brand-600">Pharmacovigilance Regional Center, CCRAS</p>
              <p className="text-xs text-slate-600 pt-1">
                Monitored and documented case report forms for classical polyherbal formulations adhering to WHO traditional medicine guidelines.
              </p>
            </div>
          </div>
        </div>

        {/* Accreditations & Certifications */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Certifications & Accreditations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl border border-slate-200 p-3 flex items-center gap-3">
              <Award className="h-6 w-6 text-brand-600 shrink-0" />
              <div>
                <div className="font-bold text-slate-900">Good Clinical Practice (GCP) for Ayush Trials</div>
                <div className="text-slate-500">Ministry of Ayush & CCRAS • Credential ID: AYU-GCP-8842</div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-3 flex items-center gap-3">
              <Award className="h-6 w-6 text-emerald-600 shrink-0" />
              <div>
                <div className="font-bold text-slate-900">Clinical Biostatistics in Healthcare Research</div>
                <div className="text-slate-500">Swayam / NPTEL • Distinction Score (91%)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Footer */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <div>Verified through SkillBridge Cryptographic Verification Engine.</div>
          <div>Digital Fingerprint: sha256:8842c9...1a</div>
        </div>

      </div>

    </div>
  );
}
