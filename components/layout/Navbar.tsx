"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  GraduationCap, 
  Briefcase, 
  BookOpen, 
  Users, 
  CheckCircle2, 
  LogOut, 
  Bell, 
  ChevronDown, 
  Menu, 
  X,
  Sparkles,
  ShieldCheck,
  Building2
} from "lucide-react";

interface UserSession {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  };

  const handleQuickSwitch = async (email: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: "password123" }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        setRoleDropdownOpen(false);
        const role = data.user.role.toLowerCase();
        router.push(`/dashboard/${role}`);
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const navLinks = [
    { name: "Internships", href: "/internships", icon: Briefcase },
    { name: "Jobs", href: "/jobs", icon: Building2 },
    { name: "Skill Assessments", href: "/assessments", icon: CheckCircle2 },
    { name: "Learning Programs", href: "/learning", icon: BookOpen },
    { name: "Collaborations", href: "/collaborations", icon: Users },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-md shadow-brand-500/20">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Skill<span className="text-brand-600">Bridge</span>
            </span>
            <span className="hidden sm:block text-[10px] font-medium tracking-wide text-slate-500 uppercase">
              SIH26044 • Academia-Industry Portal
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand-50 text-brand-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Items */}
        <div className="flex items-center gap-3">

          {/* Quick Demo Switcher (Instant evaluator role testing) */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-800 shadow-sm hover:bg-amber-100 transition"
              title="Switch demo role instantly"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              <span className="hidden lg:inline">Test Role:</span>
              <span className="capitalize">{user ? user.role.toLowerCase() : "Select"}</span>
              <ChevronDown className="h-3 w-3" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl ring-1 ring-black/5 z-50">
                <div className="px-2 py-1.5 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                  1-Click Evaluator Roles
                </div>
                <div className="space-y-1">
                  <button
                    onClick={() => handleQuickSwitch("aarav.sharma@student.nia.ac.in")}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 font-medium"
                  >
                    <span>🎓 Student (Aarav Sharma)</span>
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">92% Match</span>
                  </button>
                  <button
                    onClick={() => handleQuickSwitch("faculty.mentor@nia.nic.in")}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 font-medium"
                  >
                    <span>🔬 Faculty Mentor / TPO</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">TPO</span>
                  </button>
                  <button
                    onClick={() => handleQuickSwitch("corporate.hr@dabur.com")}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 font-medium"
                  >
                    <span>🏢 Industry Recruiter (Dabur)</span>
                    <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">HR Lead</span>
                  </button>
                  <button
                    onClick={() => handleQuickSwitch("director@nia.nic.in")}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 font-medium"
                  >
                    <span>🏛️ Institution Admin (Dean)</span>
                    <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">NAAC A++</span>
                  </button>
                  <button
                    onClick={() => handleQuickSwitch("admin@skillbridge.gov.in")}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 font-medium"
                  >
                    <span>🛡️ Super Admin</span>
                    <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded">System</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile or Login Buttons */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href={`/dashboard/${user.role.toLowerCase()}`}
                className="flex items-center gap-2 rounded-lg bg-brand-50 border border-brand-200 px-3 py-1.5 text-sm font-semibold text-brand-700 hover:bg-brand-100 transition"
              >
                <span>Dashboard</span>
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
                title="Log out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-brand-600 px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1 pb-3">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  <Icon className="h-4 w-4 text-brand-600" />
                  {link.name}
                </Link>
              );
            })}
          </div>
          {!user && (
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center rounded-lg border border-slate-200 py-2 text-sm font-semibold text-slate-700"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center rounded-lg bg-brand-600 py-2 text-sm font-semibold text-white"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
