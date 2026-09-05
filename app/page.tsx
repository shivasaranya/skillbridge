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
                  href="/internships"
                  className="flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-500/25 hover:bg-brand-700 transition"
                >
                  <Briefcase className="h-4 w-4" />
                  Explore Opportunities
                </Link>

                <Link
                  href="/register"
                  className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-800 shadow-sm hover:bg-slate-50 transition"
                >
                  Get Started Free
                  <ArrowRight className="h-4 w-4 text-slate-500" />
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

      {/* 2. CHOOSE YOUR DOMAIN ONBOARDING SECTION */}
      <section id="choose-domain" className="py-16 bg-white border-y border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1 text-xs font-semibold text-brand-700 shadow-xs mb-3">
              <Sparkles className="h-3.5 w-3.5 text-brand-600" />
              <span>SkillBridge Stakeholder Onboarding</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Welcome to SkillBridge
            </h2>
            <p className="mt-2 text-xl font-bold text-brand-600">
              Choose how you are joining SkillBridge
            </p>
            <p className="mt-2 text-sm text-slate-500 max-w-2xl mx-auto">
              Select your domain to access tailored verification workflows, smart internship matching, corporate MoUs, and specialized dashboards.
            </p>
          </div>

          {/* FOUR DOMAIN CARDS IN A SINGLE HORIZONTAL ROW ON DESKTOP */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Student Card */}
            <Link
              href="/register?role=student"
              className="group relative flex flex-col justify-between rounded-2xl border-2 border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-xl hover:border-brand-500 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
              <div>
                <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                  <GraduationCap className="h-7 w-7" />
                </div>
                <div className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700 mb-2">
                  Academic Learner
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                  Student
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  Take verified skill assessments, bridge clinical and technical gaps, apply for curated internships, and generate digital college NOCs.
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-sm font-bold text-brand-600">
                <span>Student Registration</span>
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1.5 transition-transform" />
              </div>
            </Link>

            {/* Faculty / Guide Card */}
            <Link
              href="/register?role=faculty"
              className="group relative flex flex-col justify-between rounded-2xl border-2 border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-xl hover:border-emerald-500 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
              <div>
                <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                  <Users className="h-7 w-7" />
                </div>
                <div className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 mb-2">
                  Faculty & Mentors
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  Faculty / Guide
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  Access corporate FDPs, industrial training sabbaticals, collaborative research grants, and mentor student internship approvals.
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-sm font-bold text-emerald-600">
                <span>Faculty Registration</span>
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1.5 transition-transform" />
              </div>
            </Link>

            {/* Industry Partner Card */}
            <Link
              href="/register?role=industry"
              className="group relative flex flex-col justify-between rounded-2xl border-2 border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-xl hover:border-purple-500 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
              <div>
                <div className="h-14 w-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-5 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                  <Building2 className="h-7 w-7" />
                </div>
                <div className="inline-flex items-center rounded-md bg-purple-50 px-2 py-0.5 text-[11px] font-semibold text-purple-700 mb-2">
                  Corporate & R&D
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                  Industry Partner
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  Post openings, discover candidates pre-ranked by mathematical compatibility %, coordinate interviews, and sign institutional MoUs.
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-sm font-bold text-purple-600">
                <span>Industry Registration</span>
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1.5 transition-transform" />
              </div>
            </Link>

            {/* Institution Admin Card */}
            <Link
              href="/register?role=institution"
              className="group relative flex flex-col justify-between rounded-2xl border-2 border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-xl hover:border-amber-500 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
              <div>
                <div className="h-14 w-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5 group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                  <BarChart3 className="h-7 w-7" />
                </div>
                <div className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 mb-2">
                  Deans & Placement Cells
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                  Institution Admin
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  Gain real-time campus skill readiness telemetry, monitor placement performance, and track active MoU quota compliance.
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-sm font-bold text-amber-600">
                <span>Institution Admin Registration</span>
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1.5 transition-transform" />
              </div>
            </Link>

          </div>

        </div>
      </section>

      {/* 3. STATS BANNER */}
      <section className="border-b border-slate-200 bg-slate-50/50 py-8">
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

      {/* 4. FOUR AUDIENCE PILLARS (Entire cards clickable) */}
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
            <Link 
              href="/register?role=student"
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg hover:border-brand-500 hover:-translate-y-1 transition-all cursor-pointer"
            >
              <div>
                <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">For Students</h3>
                <p className="text-sm text-slate-600 mt-2 mb-4 leading-relaxed">
                  Verify skills via assessments, detect gaps, get recommended bridge courses, apply for internships, and showcase a digital portfolio.
                </p>
              </div>
              <div className="text-sm font-semibold text-brand-600 group-hover:text-brand-700 flex items-center gap-1 pt-2 border-t border-slate-100">
                Register as Student <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Faculty */}
            <Link 
              href="/register?role=faculty"
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg hover:border-emerald-500 hover:-translate-y-1 transition-all cursor-pointer"
            >
              <div>
                <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">For Faculty & TPOs</h3>
                <p className="text-sm text-slate-600 mt-2 mb-4 leading-relaxed">
                  Access corporate FDPs, industrial training sabbaticals, joint research grants, and endorse student internship NOCs.
                </p>
              </div>
              <div className="text-sm font-semibold text-emerald-600 group-hover:text-emerald-700 flex items-center gap-1 pt-2 border-t border-slate-100">
                Register as Faculty <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Industry */}
            <Link 
              href="/register?role=industry"
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg hover:border-purple-500 hover:-translate-y-1 transition-all cursor-pointer"
            >
              <div>
                <div className="h-12 w-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Building2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-600 transition-colors">For Industry</h3>
                <p className="text-sm text-slate-600 mt-2 mb-4 leading-relaxed">
                  Publish openings, specify mandatory skills, discover candidates pre-ranked by compatibility %, and manage interviews seamlessly.
                </p>
              </div>
              <div className="text-sm font-semibold text-purple-600 group-hover:text-purple-700 flex items-center gap-1 pt-2 border-t border-slate-100">
                Register as Partner <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Institution */}
            <Link 
              href="/register?role=institution"
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg hover:border-amber-500 hover:-translate-y-1 transition-all cursor-pointer"
            >
              <div>
                <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">For Institutions</h3>
                <p className="text-sm text-slate-600 mt-2 mb-4 leading-relaxed">
                  Gain real-time telemetry on student skill readiness, monitor placement performance, and track active MoU quota compliance.
                </p>
              </div>
              <div className="text-sm font-semibold text-amber-600 group-hover:text-amber-700 flex items-center gap-1 pt-2 border-t border-slate-100">
                Register Institution <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
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
