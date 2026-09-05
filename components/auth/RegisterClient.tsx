"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  GraduationCap, 
  Users, 
  Building2, 
  School, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Sparkles
} from "lucide-react";

export type RoleType = "STUDENT" | "FACULTY" | "INDUSTRY" | "INSTITUTION";

interface RegisterClientProps {
  initialRole?: string;
}

function RegisterClientContent({ initialRole }: RegisterClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleQuery = searchParams.get("role") || initialRole;

  const parseRole = (raw?: string | null): RoleType | null => {
    if (!raw) return null;
    const normalized = raw.trim().toUpperCase();
    if (["STUDENT", "FACULTY", "INDUSTRY", "INSTITUTION"].includes(normalized)) {
      return normalized as RoleType;
    } else if (raw.toLowerCase().includes("student")) {
      return "STUDENT";
    } else if (raw.toLowerCase().includes("faculty")) {
      return "FACULTY";
    } else if (raw.toLowerCase().includes("industry")) {
      return "INDUSTRY";
    } else if (raw.toLowerCase().includes("institution")) {
      return "INSTITUTION";
    }
    return null;
  };

  const [selectedRole, setSelectedRole] = useState<RoleType | null>(() => parseRole(initialRole || roleQuery));

  // Synchronize state with URL query parameter changes
  useEffect(() => {
    const roleFromUrl = searchParams.get("role") || initialRole;
    setSelectedRole(parseRole(roleFromUrl));
  }, [searchParams, initialRole]);

  // Common Base Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  // Student Fields
  const [studentFirstName, setStudentFirstName] = useState("");
  const [studentLastName, setStudentLastName] = useState("");
  const [studentDepartment, setStudentDepartment] = useState("");
  const [studentDegree, setStudentDegree] = useState("");
  const [studentGraduationYear, setStudentGraduationYear] = useState("2026");
  const [studentCollege, setStudentCollege] = useState("");

  // Faculty Fields
  const [facultyFullName, setFacultyFullName] = useState("");
  const [facultyDepartment, setFacultyDepartment] = useState("");
  const [facultyDesignation, setFacultyDesignation] = useState("Assistant Professor");
  const [facultyInstitution, setFacultyInstitution] = useState("");
  const [facultyExpertise, setFacultyExpertise] = useState("");

  // Industry Fields
  const [companyName, setCompanyName] = useState("");
  const [industrySector, setIndustrySector] = useState("HEALTH_TECH");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [companyLocation, setCompanyLocation] = useState("");
  const [contactPersonName, setContactPersonName] = useState("");
  const [contactPersonDesignation, setContactPersonDesignation] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");

  // Institution Admin Fields
  const [adminFullName, setAdminFullName] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [institutionType, setInstitutionType] = useState("STATE_UNIVERSITY");
  const [adminDesignation, setAdminDesignation] = useState("Dean / Director");
  const [institutionLocation, setInstitutionLocation] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSelectRole = (role: RoleType) => {
    setSelectedRole(role);
    setError("");
    router.push(`/register?role=${role.toLowerCase()}`);
  };

  const handleBackToDomainSelection = () => {
    setSelectedRole(null);
    setError("");
    router.push("/register");
  };

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    setError("");
    setLoading(true);

    try {
      const payload: any = {
        role: selectedRole,
        email,
        password,
        phone,
      };

      if (selectedRole === "STUDENT") {
        payload.firstName = studentFirstName;
        payload.lastName = studentLastName;
        payload.department = studentDepartment;
        payload.degree = studentDegree;
        payload.graduationYear = studentGraduationYear;
        payload.collegeName = studentCollege;
      } else if (selectedRole === "FACULTY") {
        payload.fullName = facultyFullName;
        payload.department = facultyDepartment;
        payload.designation = facultyDesignation;
        payload.institutionName = facultyInstitution;
        payload.areasOfExpertise = facultyExpertise;
      } else if (selectedRole === "INDUSTRY") {
        payload.companyName = companyName;
        payload.domain = industrySector;
        payload.website = companyWebsite;
        payload.location = companyLocation;
        payload.contactPersonName = contactPersonName;
        payload.contactPersonDesignation = contactPersonDesignation;
        payload.companyDescription = companyDescription;
      } else if (selectedRole === "INSTITUTION") {
        payload.fullName = adminFullName;
        payload.institutionName = institutionName;
        payload.institutionType = institutionType;
        payload.designation = adminDesignation;
        payload.location = institutionLocation;
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      // Redirect directly to the domain dashboard
      const targetDashboard = `/dashboard/${selectedRole.toLowerCase()}`;
      router.push(targetDashboard);
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const domainCards = [
    {
      id: "STUDENT" as RoleType,
      title: "Student",
      badge: "Academic Learner",
      icon: GraduationCap,
      color: "blue",
      bgClass: "bg-blue-50 text-blue-600 group-hover:bg-brand-600 group-hover:text-white",
      desc: "Take verified skill assessments, bridge clinical & technical gaps, apply for curated internships, and generate digital college NOCs.",
    },
    {
      id: "FACULTY" as RoleType,
      title: "Faculty / Guide",
      badge: "Mentors & TPOs",
      icon: Users,
      color: "emerald",
      bgClass: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
      desc: "Access corporate FDPs, industrial training sabbaticals, collaborative research grants, and mentor student internship approvals.",
    },
    {
      id: "INDUSTRY" as RoleType,
      title: "Industry Partner",
      badge: "Corporate & R&D",
      icon: Building2,
      color: "purple",
      bgClass: "bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white",
      desc: "Post openings, discover candidates pre-ranked by mathematical compatibility %, coordinate interviews, and sign institutional MoUs.",
    },
    {
      id: "INSTITUTION" as RoleType,
      title: "Institution Admin",
      badge: "Deans & Directors",
      icon: School,
      color: "amber",
      bgClass: "bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white",
      desc: "Monitor campus skill readiness telemetry, track corporate MoU quota compliance, and streamline placement workflows and digital NOCs.",
    },
  ];

  // VIEW 1: DOMAIN SELECTION SCREEN (If no role chosen yet)
  if (!selectedRole) {
    return (
      <div className="min-h-[85vh] py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 flex flex-col justify-center">
        <div className="mx-auto max-w-7xl w-full space-y-12">
          
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1 text-xs font-semibold text-brand-700 shadow-xs mb-4">
              <Sparkles className="h-3.5 w-3.5 text-brand-600" />
              <span>Step 1 of 2: Domain Selection</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              Welcome to SkillBridge
            </h1>
            <p className="mt-3 text-xl sm:text-2xl font-bold text-brand-600">
              Choose how you are joining SkillBridge
            </p>
            <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
              Select your role to open your dedicated registration form and access tailored tools, verified credentials, and institutional collaboration suites.
            </p>
          </div>

          {/* EXACTLY FOUR DOMAIN CARDS IN A SINGLE HORIZONTAL ROW ON DESKTOP */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {domainCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  onClick={() => handleSelectRole(card.id)}
                  className="group relative flex flex-col justify-between rounded-2xl border-2 border-slate-200/90 bg-white p-6 shadow-sm hover:shadow-xl hover:border-brand-500 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer overflow-hidden"
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleSelectRole(card.id);
                    }
                  }}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
                  <div>
                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-5 transition-colors duration-300 shadow-sm ${card.bgClass}`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <div className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700 mb-2">
                      {card.badge}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>

                  <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-sm font-bold text-brand-600">
                    <span>{card.title} Registration</span>
                    <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Sign-In Option */}
          <div className="text-center pt-4">
            <p className="text-sm text-slate-600">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-brand-600 hover:text-brand-700 hover:underline">
                Sign In
              </Link>
            </p>
          </div>

        </div>
      </div>
    );
  }

  // VIEW 2: DOMAIN-SPECIFIC REGISTRATION FORM
  const roleTitles: Record<RoleType, { title: string; subtitle: string; icon: any }> = {
    STUDENT: {
      title: "Student Registration",
      subtitle: "Register as an academic learner to access skill assessments, gap analysis, and verified internships.",
      icon: GraduationCap,
    },
    FACULTY: {
      title: "Faculty / Guide Registration",
      subtitle: "Join as an academic guide to access corporate FDPs, joint research sabbaticals, and mentor student credentials.",
      icon: Users,
    },
    INDUSTRY: {
      title: "Industry Partner Registration",
      subtitle: "Join as an enterprise partner to publish internship drives, access compatibility scoring, and sign institutional MoUs.",
      icon: Building2,
    },
    INSTITUTION: {
      title: "Institution Admin Registration",
      subtitle: "Register as a Dean, Director, or TPO Head to monitor campus telemetry and digital student NOC workflows.",
      icon: School,
    },
  };

  const activeRoleMeta = roleTitles[selectedRole];
  const ActiveIcon = activeRoleMeta.icon;

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 flex items-center justify-center">
      <div className="w-full max-w-3xl space-y-6">
        
        {/* Navigation & Role Switcher */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleBackToDomainSelection}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-100 hover:text-slate-900 transition"
          >
            <ArrowLeft className="h-4 w-4 text-slate-500" />
            <span>Back to Choose Domain</span>
          </button>

          <span className="text-xs font-semibold text-brand-700 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full uppercase tracking-wider">
            {selectedRole.replace("_", " ")}
          </span>
        </div>

        {/* Form Container */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-8 sm:p-10 shadow-sm">
          
          {/* Header */}
          <div className="text-center pb-6 border-b border-slate-100">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-500/20">
              <ActiveIcon className="h-8 w-8" />
            </div>
            <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {activeRoleMeta.title}
            </h2>
            <p className="mt-2 text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
              {activeRoleMeta.subtitle}
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mt-6 flex items-center gap-2.5 rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-200 shadow-xs">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmitRegistration} className="mt-6 space-y-5">
            
            {/* 1. STUDENT SPECIFIC FORM */}
            {selectedRole === "STUDENT" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={studentFirstName}
                      onChange={(e) => setStudentFirstName(e.target.value)}
                      placeholder="e.g. Aarav"
                      className="mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={studentLastName}
                      onChange={(e) => setStudentLastName(e.target.value)}
                      placeholder="e.g. Sharma"
                      className="mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Official / Student Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="aarav.sharma@student.nia.ac.in"
                      className="mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a secure password (min. 6 characters)"
                    className="mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Department / Branch *
                    </label>
                    <input
                      type="text"
                      required
                      value={studentDepartment}
                      onChange={(e) => setStudentDepartment(e.target.value)}
                      placeholder="e.g. Dravyaguna Vigyana / Biotech"
                      className="mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Degree *
                    </label>
                    <input
                      type="text"
                      required
                      value={studentDegree}
                      onChange={(e) => setStudentDegree(e.target.value)}
                      placeholder="e.g. BAMS / B.Tech / MD"
                      className="mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Graduation Year *
                    </label>
                    <input
                      type="number"
                      required
                      value={studentGraduationYear}
                      onChange={(e) => setStudentGraduationYear(e.target.value)}
                      className="mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    College / Institution *
                  </label>
                  <input
                    type="text"
                    required
                    value={studentCollege}
                    onChange={(e) => setStudentCollege(e.target.value)}
                    placeholder="e.g. National Institute of Ayurveda, Jaipur"
                    className="mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </>
            )}

            {/* 2. FACULTY / GUIDE SPECIFIC FORM */}
            {selectedRole === "FACULTY" && (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={facultyFullName}
                    onChange={(e) => setFacultyFullName(e.target.value)}
                    placeholder="e.g. Dr. Arvind Tripathi"
                    className="mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Official Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="faculty.mentor@nia.nic.in"
                      className="mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 141 2635748"
                      className="mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a secure password"
                    className="mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Department *
                    </label>
                    <input
                      type="text"
                      required
                      value={facultyDepartment}
                      onChange={(e) => setFacultyDepartment(e.target.value)}
                      placeholder="e.g. Dravyaguna Vigyana / Clinical Pharmacology"
                      className="mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Designation *
                    </label>
                    <input
                      type="text"
                      required
                      value={facultyDesignation}
                      onChange={(e) => setFacultyDesignation(e.target.value)}
                      placeholder="e.g. Associate Professor & TPO Mentor"
                      className="mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Institution *
                  </label>
                  <input
                    type="text"
                    required
                    value={facultyInstitution}
                    onChange={(e) => setFacultyInstitution(e.target.value)}
                    placeholder="e.g. National Institute of Ayurveda, Jaipur"
                    className="mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Areas of Expertise *
                  </label>
                  <input
                    type="text"
                    required
                    value={facultyExpertise}
                    onChange={(e) => setFacultyExpertise(e.target.value)}
                    placeholder="e.g. Phytochemical Analysis, GCP Protocol, Botanical Standardization"
                    className="mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </>
            )}

            {/* 3. INDUSTRY PARTNER SPECIFIC FORM */}
            {selectedRole === "INDUSTRY" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Company / Organization Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Dabur India Ltd."
                      className="mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Official Company Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="corporate.hr@dabur.com"
                      className="mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 120 3982000"
                      className="mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a secure password"
                      className="mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Industry / Sector *
                    </label>
                    <select
                      value={industrySector}
                      onChange={(e) => setIndustrySector(e.target.value)}
                      className="mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 bg-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    >
                      <option value="AYUSH_PHARMA">Ayush & Herbal Pharma</option>
                      <option value="HERBAL_RESEARCH">Herbal Research & R&D</option>
                      <option value="HEALTH_TECH">Healthcare Tech & Digital Health</option>
                      <option value="BIOTECH">Biotechnology & Genomics</option>
                      <option value="IT_SERVICES">Software & Enterprise</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Company Website *
                    </label>
                    <input
                      type="text"
                      required
                      value={companyWebsite}
                      onChange={(e) => setCompanyWebsite(e.target.value)}
                      placeholder="https://www.dabur.com"
                      className="mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Company Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={companyLocation}
                      onChange={(e) => setCompanyLocation(e.target.value)}
                      placeholder="e.g. Ghaziabad, NCR"
                      className="mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Contact Person Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactPersonName}
                      onChange={(e) => setContactPersonName(e.target.value)}
                      placeholder="e.g. Vikram Malhotra"
                      className="mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Contact Person Designation *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactPersonDesignation}
                      onChange={(e) => setContactPersonDesignation(e.target.value)}
                      placeholder="e.g. Head of University Relations & Talent"
                      className="mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Company Description *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={companyDescription}
                    onChange={(e) => setCompanyDescription(e.target.value)}
                    placeholder="Briefly describe your company, domain expertise, and student hiring/collaboration goals..."
                    className="mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </>
            )}

            {/* 4. INSTITUTION ADMIN SPECIFIC FORM */}
            {selectedRole === "INSTITUTION" && (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={adminFullName}
                    onChange={(e) => setAdminFullName(e.target.value)}
                    placeholder="e.g. Prof. Sanjeev Sharma"
                    className="mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Official Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="director@nia.nic.in"
                      className="mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 141 2635740"
                      className="mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a secure password"
                    className="mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Institution Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={institutionName}
                      onChange={(e) => setInstitutionName(e.target.value)}
                      placeholder="e.g. National Institute of Ayurveda (Deemed to be University)"
                      className="mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Institution Type *
                    </label>
                    <select
                      value={institutionType}
                      onChange={(e) => setInstitutionType(e.target.value)}
                      className="mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 bg-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    >
                      <option value="AYUSH_INSTITUTE">Apex Ayush National Institute</option>
                      <option value="CENTRAL_UNIVERSITY">Central University</option>
                      <option value="STATE_UNIVERSITY">State University</option>
                      <option value="AUTONOMOUS">Autonomous Institute</option>
                      <option value="DEEMED_UNIVERSITY">Deemed University</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Designation *
                    </label>
                    <input
                      type="text"
                      required
                      value={adminDesignation}
                      onChange={(e) => setAdminDesignation(e.target.value)}
                      placeholder="e.g. Director / Dean / TPO Cell Head"
                      className="mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Institution Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={institutionLocation}
                      onChange={(e) => setInstitutionLocation(e.target.value)}
                      placeholder="e.g. Jaipur, Rajasthan"
                      className="mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Submit Action */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3.5 text-sm font-bold text-white shadow-md shadow-brand-500/25 hover:bg-brand-700 transition disabled:opacity-50 mt-6 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Registering Account...</span>
                </>
              ) : (
                <>
                  <span>Complete {activeRoleMeta.title}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

          </form>

          {/* Footer & Sign In option */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-brand-600 hover:text-brand-700 hover:underline">
                Sign In
              </Link>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>SIH26044 Verified • Direct Dashboard Access</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default function RegisterClient(props: RegisterClientProps) {
  return (
    <Suspense fallback={
      <div className="min-h-[85vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    }>
      <RegisterClientContent {...props} />
    </Suspense>
  );
}
