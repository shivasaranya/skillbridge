import Link from "next/link";
import { GraduationCap, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-12 text-slate-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Skill<span className="text-brand-600">Bridge</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 max-w-sm">
              An intelligent, data-driven platform bridging the gap between academia and industry through skill mapping, verified assessments, and corporate collaboration.
            </p>
            <div className="text-xs text-slate-400 font-medium">
              Smart India Hackathon (SIH) 2026 • Problem Statement SIH26044
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">For Students</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/internships" className="hover:text-brand-600 transition">Browse Internships</Link></li>
              <li><Link href="/jobs" className="hover:text-brand-600 transition">Placement Drives</Link></li>
              <li><Link href="/assessments" className="hover:text-brand-600 transition">Skill Assessment</Link></li>
              <li><Link href="/portfolio/aarav-sharma" className="hover:text-brand-600 transition">Digital Portfolio</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">For Industry</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/dashboard/industry" className="hover:text-brand-600 transition">Post Opportunity</Link></li>
              <li><Link href="/dashboard/industry" className="hover:text-brand-600 transition">Candidate Compatibility</Link></li>
              <li><Link href="/collaborations" className="hover:text-brand-600 transition">Institutional MoUs</Link></li>
              <li><Link href="/learning" className="hover:text-brand-600 transition">Corporate Training</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Governance</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/dashboard/institution" className="hover:text-brand-600 transition">Institution Dashboard</Link></li>
              <li><Link href="/dashboard/institution" className="hover:text-brand-600 transition">Skill Gap Telemetry</Link></li>
              <li><Link href="/dashboard/admin" className="hover:text-brand-600 transition">Compliance &amp; Audits</Link></li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © 2026 SkillBridge Platform. Developed for Smart India Hackathon.
          </div>
          <div className="flex items-center gap-1">
            Built with <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" /> for Indian Higher Education & Ministry of Ayush
          </div>
        </div>
      </div>
    </footer>
  );
}
