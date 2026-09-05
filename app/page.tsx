import Link from "next/link";
import { 
  GraduationCap, 
  Briefcase, 
  CheckCircle2, 
  BarChart3, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  BookOpen, 
  Building2, 
  Users, 
  Target,
  FileCheck,
  TrendingUp,
  Award
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/70 via-white to-slate-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1.5 text-xs font-semibold text-brand-700 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-brand-600" />
                <span>Smart India Hackathon 2026 • Problem Statement SIH26044</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                Connect Skills. <br />
                <span className="text-brand-600">Discover Opportunities.</span> <br />
                Build Careers.
              </h1>

              <p className="text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0">
                One unified platform connecting students, academicians, institutions, and industries for verified skill assessment, intelligent skill-gap mapping, internships, placements, and collaborative MoUs.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/get-started"
                  className="flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-500/25 hover:bg-brand-700 transition"
                >
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/internships"
                  className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-800 shadow-sm hover:bg-slate-50 transition"
                >
                  <Briefcase className="h-4 w-4 text-slate-500" />
                  Explore Opportunities
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Verified Skill Assessments</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FileCheck className="h-4 w-4 text-brand-600" />
                  <span>Digital College NOC Workflow</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-amber-600" />
                  <span>NEP-2020 Credit Aligned</span>
                </div>
              </div>

            </div>

            {/* Live Interactive Matching Preview Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xl shadow-slate-200/50">
                
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                      SB
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">Skill Compatibility Engine</div>
                      <div className="text-xs text-slate-500">Live Mathematical Match Scoring</div>
                    </div>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                    92% Match
                  </span>
                </div>

                {/* Candidate & Job info */}
                <div className="py-4 space-y-3">
                  <div>
                    <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Candidate Profile</div>
                    <div className="text-sm font-bold text-slate-900">Aarav Sharma • NIA Jaipur (BAMS)</div>
                  </div>

                  <div>
                    <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Target Opportunity</div>
                    <div className="text-sm font-semibold text-slate-800">Clinical Research Intern • Dabur India R&D</div>
                  </div>

                  {/* Skills breakdown */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-medium">Good Clinical Practice (GCP)</span>
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Matched (Mandatory)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[95%] rounded-full"></div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-slate-600 font-medium">Panchakarma Protocol</span>
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Matched (Mandatory)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[90%] rounded-full"></div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-slate-600 font-medium">Scientific Manuscript Writing</span>
                      <span className="text-amber-600 font-bold flex items-center gap-1">
                        ⚠️ Skill Gap (Bridge Course Ready)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full w-[40%] rounded-full"></div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    Identified 1 Bridge Course on <span className="font-semibold text-slate-700">Swayam/NPTEL</span>
                  </div>
                  <Link
                    href="/assessments"
                    className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                  >
                    Take Assessment <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2. STATS BANNER */}
      <section className="border-y border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-extrabold text-brand-600">50+</div>
              <div className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">Curated Skill Taxonomies</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900">4-Tier</div>
              <div className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">Verified Assessment Model</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-emerald-600">100%</div>
              <div className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">Digital NOC & MoU Workflows</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-purple-600">Real-Time</div>
              <div className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">Skill-Gap Remediation</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOUR AUDIENCE PILLARS */}
      <section className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-brand-600 uppercase tracking-widest">Built For Every Stakeholder</h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              An Integrated Ecosystem Connecting All 4 Pillars
            </p>
            <p className="mt-4 text-base text-slate-600">
              Unlike ordinary job boards, SkillBridge manages the entire academia-industry lifecycle with role-tailored dashboards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Student */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">For Students</h3>
              <p className="text-sm text-slate-600 mt-2 mb-4">
                Verify skills via assessments, detect gaps, get recommended bridge courses, apply for internships, and showcase a digital portfolio.
              </p>
              <Link href="/get-started" className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
                Join as Student <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Faculty */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
              <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">For Faculty & TPOs</h3>
              <p className="text-sm text-slate-600 mt-2 mb-4">
                Access corporate FDPs, industrial training sabbaticals, joint research grants, and endorse student internship NOCs.
              </p>
              <Link href="/get-started" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                Join as Faculty <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Industry */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
              <div className="h-12 w-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">For Industry</h3>
              <p className="text-sm text-slate-600 mt-2 mb-4">
                Publish openings, specify mandatory skills, discover candidates pre-ranked by compatibility %, and manage interviews seamlessly.
              </p>
              <Link href="/get-started" className="text-sm font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1">
                Join as Recruiter <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Institution */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
              <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">For Institutions</h3>
              <p className="text-sm text-slate-600 mt-2 mb-4">
                Gain real-time telemetry on student skill readiness, monitor placement performance, and track active MoU quota compliance.
              </p>
              <Link href="/get-started" className="text-sm font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1">
                Join as Institution <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

          </div>

          {/* Role selection CTA */}
          <div className="mt-14 rounded-2xl bg-gradient-to-r from-brand-600 to-cyan-600 p-8 text-center text-white shadow-xl">
            <h3 className="text-2xl font-extrabold mb-2">Ready to get started?</h3>
            <p className="text-brand-100 text-sm mb-6 max-w-xl mx-auto">
              Choose your role and join thousands of students, institutions, and companies already using SkillBridge.
            </p>
            <Link
              href="/get-started"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-bold text-brand-700 hover:bg-brand-50 transition shadow-lg"
            >
              Choose Your Role
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-brand-600 uppercase tracking-widest">End-To-End Journey</h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900">
              How SkillBridge Works
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="h-14 w-14 rounded-2xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center text-xl font-bold">
                1
              </div>
              <h4 className="text-base font-bold text-slate-900">Assess Skills</h4>
              <p className="text-sm text-slate-500">
                Complete standardized category quizzes to validate core theoretical and clinical competencies.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3">
              <div className="h-14 w-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center text-xl font-bold">
                2
              </div>
              <h4 className="text-base font-bold text-slate-900">Analyze Gaps</h4>
              <p className="text-sm text-slate-500">
                Instantly discover missing skills for target industry roles and enroll in curated bridge courses.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3">
              <div className="h-14 w-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center text-xl font-bold">
                3
              </div>
              <h4 className="text-base font-bold text-slate-900">Match & Apply</h4>
              <p className="text-sm text-slate-500">
                View opportunities ranked with weighted compatibility scores and submit 1-click applications.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3">
              <div className="h-14 w-14 rounded-2xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center text-xl font-bold">
                4
              </div>
              <h4 className="text-base font-bold text-slate-900">Placement & NOC</h4>
              <p className="text-sm text-slate-500">
                Clear interviews, secure verified digital NOCs, complete internships, and earn academic credits.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="bg-brand-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Bridge Academia & Industry?
          </h2>
          <p className="text-brand-200 max-w-xl mx-auto text-base">
            Join leading universities and premier healthcare and enterprise recruiters on India's smart collaboration portal.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/register"
              className="rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-brand-900 shadow-md hover:bg-brand-50 transition"
            >
              Create Account
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-brand-600 bg-brand-800/60 px-7 py-3.5 text-sm font-semibold text-white hover:bg-brand-800 transition"
            >
              Sign In (Quick Evaluator Demo)
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
