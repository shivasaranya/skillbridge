"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Building2,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronRight,
  ChevronLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Hash,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";

const STEPS = [
  { id: 1, label: "Identity", icon: User, desc: "Official personal information" },
  { id: 2, label: "Institution", icon: Building2, desc: "Your college details" },
  { id: 3, label: "Academics", icon: BookOpen, desc: "Degree & education info" },
  { id: 4, label: "Done!", icon: CheckCircle2, desc: "Account created" },
];

const INSTITUTION_TYPES = [
  "Central University", "State University", "Deemed University",
  "Autonomous College", "Private College", "IIT", "NIT", "IIM", "AIIMS", "Other"
];

const DEGREES = [
  "B.Tech", "B.E.", "B.Sc", "B.Com", "BCA", "B.Des", "BBA",
  "M.Tech", "M.E.", "M.Sc", "MCA", "MBA", "M.Des",
  "MBBS", "BAMS", "BDS", "MD", "MS",
  "Ph.D", "Integrated M.Tech", "Integrated M.Sc", "Other"
];

const BRANCHES = [
  "Computer Science & Engineering", "Information Technology", "Electronics & Communication",
  "Electrical Engineering", "Mechanical Engineering", "Civil Engineering",
  "Data Science", "Artificial Intelligence & ML", "Cybersecurity",
  "Chemical Engineering", "Biotechnology", "Aerospace Engineering",
  "Computer Science", "Physics", "Mathematics", "Chemistry",
  "Commerce", "Business Administration", "Design", "Other"
];

const GENDERS = ["Male", "Female", "Non-binary", "Prefer not to say"];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdUser, setCreatedUser] = useState<any>(null);

  // Step 1 — Official Identity
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [rollNumber, setRollNumber] = useState("");

  // Step 2 — Institution
  const [institutionName, setInstitutionName] = useState("");
  const [institutionType, setInstitutionType] = useState("");
  const [affiliatedUniversity, setAffiliatedUniversity] = useState("");
  const [institutionCity, setInstitutionCity] = useState("");
  const [institutionState, setInstitutionState] = useState("");
  const [department, setDepartment] = useState("");
  const [collegeEmail, setCollegeEmail] = useState("");

  // Step 3 — Academics
  const [degree, setDegree] = useState("");
  const [branch, setBranch] = useState("");
  const [admissionYear, setAdmissionYear] = useState("2023");
  const [graduationYear, setGraduationYear] = useState("2027");
  const [currentYear, setCurrentYear] = useState("2nd Year");
  const [currentSemester, setCurrentSemester] = useState("3");
  const [cgpa, setCgpa] = useState("");
  const [backlogs, setBacklogs] = useState("0");

  const validateStep1 = () => {
    if (!firstName.trim()) return "First name is required";
    if (!lastName.trim()) return "Last name is required";
    if (!email.trim() || !email.includes("@")) return "Valid email is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!phone.trim() || phone.length < 10) return "Valid phone number is required";
    return null;
  };

  const validateStep2 = () => {
    if (!institutionName.trim()) return "Institution name is required";
    if (!department.trim()) return "Department is required";
    return null;
  };

  const validateStep3 = () => {
    if (!degree) return "Degree is required";
    if (!branch) return "Branch/Specialization is required";
    return null;
  };

  const handleNext = () => {
    setError("");
    if (step === 1) {
      const err = validateStep1();
      if (err) { setError(err); return; }
    }
    if (step === 2) {
      const err = validateStep2();
      if (err) { setError(err); return; }
    }
    if (step === 3) {
      handleSubmit();
      return;
    }
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    const err = validateStep3();
    if (err) { setError(err); return; }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim().toLowerCase(),
          password,
          phone: phone.trim(),
          role: "STUDENT",
          // Academic info
          department: department.trim() || branch,
          degree,
          graduationYear: parseInt(graduationYear),
          rollNumber: rollNumber.trim() || undefined,
          cgpa: cgpa ? parseFloat(cgpa) : undefined,
          activeBacklogs: parseInt(backlogs) || 0,
          // Extended fields (will be stored in profile)
          dateOfBirth: dob || undefined,
          gender: gender || undefined,
          admissionYear: parseInt(admissionYear),
          currentYear,
          currentSemester: parseInt(currentSemester),
          // Institution
          institutionName: institutionName.trim(),
          institutionType: institutionType || "Other",
          institutionCity: institutionCity.trim(),
          institutionState: institutionState.trim(),
          affiliatedUniversity: affiliatedUniversity.trim(),
          collegeEmail: collegeEmail.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      setCreatedUser(data.user || { firstName, lastName, email });
      setStep(4);
    } catch (e) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const progressPercent = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-2xl bg-blue-500 flex items-center justify-center">
              <GraduationCap size={22} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white">SkillBridge</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-white">Create your Student Account</h1>
          <p className="text-blue-200/70 text-sm mt-1">Register once. Build your career forever.</p>
        </div>

        {/* Step Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            {STEPS.map((s) => {
              const Icon = s.icon;
              const isDone = step > s.id;
              const isCurrent = step === s.id;
              return (
                <div key={s.id} className="flex flex-col items-center gap-1">
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isDone ? "bg-green-500 text-white" :
                    isCurrent ? "bg-blue-500 text-white ring-4 ring-blue-500/30" :
                    "bg-slate-700 text-slate-400"
                  }`}>
                    <Icon size={16} />
                  </div>
                  <div className="hidden sm:block">
                    <div className={`text-xs font-semibold ${isCurrent ? "text-blue-300" : isDone ? "text-green-400" : "text-slate-500"}`}>
                      {s.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Progress bar */}
          <div className="h-1.5 rounded-full bg-slate-700 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>Step {step} of {STEPS.length}</span>
            <span>{Math.round(progressPercent)}% complete</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-6 sm:p-8">
            {/* Error */}
            {error && (
              <div className="flex items-center gap-2.5 rounded-xl bg-red-50 border border-red-200 p-3 mb-5 text-sm text-red-700">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* ── STEP 1: Official Identity ── */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Official Identity</h2>
                  <p className="text-sm text-slate-500">This information forms your permanent academic identity.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">First Name *</label>
                    <div className="relative">
                      <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
                        placeholder="Aarav" required
                        className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Last Name *</label>
                    <div className="relative">
                      <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="text" value={lastName} onChange={e => setLastName(e.target.value)}
                        placeholder="Sharma" required
                        className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address *</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="aarav@example.com" required
                      className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password *</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="Min. 8 characters" required
                      className="w-full pl-4 pr-10 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  <div className="mt-1.5 flex gap-1">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                        password.length > i * 3 ? (password.length >= 12 ? "bg-green-400" : "bg-amber-400") : "bg-slate-200"
                      }`} />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Mobile Number *</label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                        placeholder="+91 9876543210" required
                        className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Student ID / Roll No.</label>
                    <div className="relative">
                      <Hash size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="text" value={rollNumber} onChange={e => setRollNumber(e.target.value)}
                        placeholder="CSE-21-042"
                        className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Date of Birth</label>
                    <div className="relative">
                      <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="date" value={dob} onChange={e => setDob(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Gender <span className="text-slate-400">(optional)</span></label>
                    <select value={gender} onChange={e => setGender(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 bg-white">
                      <option value="">Select gender</option>
                      {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 2: Institution ── */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Institution Details</h2>
                  <p className="text-sm text-slate-500">Tell us about your college or university.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Institution / College Name *</label>
                  <input type="text" value={institutionName} onChange={e => setInstitutionName(e.target.value)}
                    placeholder="e.g. Indian Institute of Technology Delhi"
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Can't find your institution?{" "}
                    <button className="text-blue-500 hover:underline">Request to add it →</button>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Institution Type</label>
                    <select value={institutionType} onChange={e => setInstitutionType(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 bg-white">
                      <option value="">Select type</option>
                      {INSTITUTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Affiliated University</label>
                    <input type="text" value={affiliatedUniversity} onChange={e => setAffiliatedUniversity(e.target.value)}
                      placeholder="e.g. University of Delhi"
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Department *</label>
                  <input type="text" value={department} onChange={e => setDepartment(e.target.value)}
                    placeholder="e.g. Computer Science & Engineering"
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">City</label>
                    <input type="text" value={institutionCity} onChange={e => setInstitutionCity(e.target.value)}
                      placeholder="e.g. New Delhi"
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">State</label>
                    <input type="text" value={institutionState} onChange={e => setInstitutionState(e.target.value)}
                      placeholder="e.g. Delhi"
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">College Email <span className="text-slate-400">(optional)</span></label>
                  <input type="email" value={collegeEmail} onChange={e => setCollegeEmail(e.target.value)}
                    placeholder="aarav@college.edu.in"
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                </div>
              </div>
            )}

            {/* ── STEP 3: Academics ── */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Academic Details</h2>
                  <p className="text-sm text-slate-500">Your degree and academic progress information.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Degree *</label>
                    <select value={degree} onChange={e => setDegree(e.target.value)} required
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 bg-white">
                      <option value="">Select degree</option>
                      {DEGREES.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Branch / Specialization *</label>
                    <select value={branch} onChange={e => setBranch(e.target.value)} required
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 bg-white">
                      <option value="">Select branch</option>
                      {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Admission Year</label>
                    <select value={admissionYear} onChange={e => setAdmissionYear(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 bg-white">
                      {[2020,2021,2022,2023,2024,2025,2026].map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Expected Graduation Year</label>
                    <select value={graduationYear} onChange={e => setGraduationYear(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 bg-white">
                      {[2024,2025,2026,2027,2028,2029,2030].map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Current Year</label>
                    <select value={currentYear} onChange={e => setCurrentYear(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 bg-white">
                      {["1st Year","2nd Year","3rd Year","4th Year","5th Year"].map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Current Semester</label>
                    <select value={currentSemester} onChange={e => setCurrentSemester(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 bg-white">
                      {[1,2,3,4,5,6,7,8,9,10].map(s => <option key={s} value={s}>Semester {s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">CGPA / Percentage</label>
                    <input type="number" step="0.01" min="0" max="10" value={cgpa} onChange={e => setCgpa(e.target.value)}
                      placeholder="e.g. 8.7"
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Active Backlogs <span className="text-slate-400">(optional)</span></label>
                    <input type="number" min="0" value={backlogs} onChange={e => setBacklogs(e.target.value)}
                      placeholder="0"
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                  </div>
                </div>

                {/* Summary preview */}
                <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 space-y-1 text-sm">
                  <div className="font-semibold text-blue-900 mb-2">Account Summary</div>
                  <div className="text-slate-700"><span className="text-slate-500">Name:</span> {firstName} {lastName}</div>
                  <div className="text-slate-700"><span className="text-slate-500">Email:</span> {email}</div>
                  <div className="text-slate-700"><span className="text-slate-500">Institution:</span> {institutionName || "Not provided"}</div>
                  <div className="text-slate-700"><span className="text-slate-500">Degree:</span> {degree} — {branch}</div>
                  <div className="text-slate-700"><span className="text-slate-500">Batch:</span> {admissionYear} – {graduationYear}</div>
                </div>
              </div>
            )}

            {/* ── STEP 4: Success ── */}
            {step === 4 && (
              <div className="text-center py-6 space-y-4">
                <div className="inline-flex h-20 w-20 rounded-full bg-green-100 items-center justify-center mx-auto">
                  <CheckCircle2 size={44} className="text-green-500" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Registration Successful! 🎉</h2>
                  <p className="text-slate-500 text-sm mt-1">Welcome to SkillBridge, {firstName}! Your account is ready.</p>
                </div>

                {/* Profile completion teaser */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <Sparkles size={15} className="text-amber-500" /> Profile Completion
                    </span>
                    <span className="font-bold text-blue-600">20%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full w-[20%] rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
                  </div>
                  <p className="text-xs text-slate-500">Complete your profile to unlock opportunity matching and career readiness scores.</p>
                  <div className="grid grid-cols-2 gap-2 pt-1 text-xs text-slate-600">
                    {["Skills", "Certifications", "Projects", "CV/Resume", "LinkedIn", "GitHub"].map((item) => (
                      <div key={item} className="flex items-center gap-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => router.push("/student/profile")}
                    className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
                  >
                    Complete My Profile →
                  </button>
                  <button
                    onClick={() => router.push("/student/dashboard")}
                    className="flex-1 rounded-xl border border-slate-300 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {step < 4 && (
              <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => step > 1 && setStep(step - 1)}
                  disabled={step === 1}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-slate-600 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft size={16} /> Back
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-60 transition shadow-lg shadow-blue-500/25"
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  {step === 3 ? "Create Account" : "Continue"}
                  {step < 3 && <ChevronRight size={16} />}
                </button>
              </div>
            )}
          </div>

          {/* Footer link */}
          {step < 4 && (
            <div className="px-6 pb-5 text-center text-sm text-slate-500 border-t border-slate-100 pt-4">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-blue-600 hover:underline">
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
