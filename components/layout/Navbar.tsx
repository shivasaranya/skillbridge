"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  GraduationCap,
  Briefcase,
  BookOpen,
  CheckCircle2,
  LogOut,
  Menu,
  X,
  Building2,
  User,
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

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => { if (data.user) setUser(data.user); })
      .catch(() => {});
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { name: "Internships",       href: "/internships",  icon: Briefcase },
    { name: "Jobs",              href: "/jobs",          icon: Building2 },
    { name: "Skill Assessments", href: "/assessments",  icon: CheckCircle2 },
    { name: "Learning Programs", href: "/learning",     icon: BookOpen },
  ];

  const dashboardHref =
    user?.role === "STUDENT"      ? "/student/dashboard"
    : user?.role === "FACULTY"    ? "/faculty/dashboard"
    : user?.role === "INDUSTRY"   ? "/industry/dashboard"
    : user?.role === "ADMIN"      ? "/admin/dashboard"
    : "/student/dashboard";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
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

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                href={dashboardHref}
                className="flex items-center gap-2 rounded-xl bg-brand-50 border border-brand-200 px-4 py-1.5 text-sm font-semibold text-brand-700 hover:bg-brand-100 transition"
              >
                <User className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{user.firstName}</span>
                <span className="hidden sm:inline text-brand-400">·</span>
                <span className="hidden sm:inline text-xs capitalize">{user.role.toLowerCase()}</span>
              </Link>
              <button
                onClick={handleLogout}
                title="Sign out"
                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-xl px-4 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                Sign In
              </Link>
              <Link
                href="/get-started"
                className="rounded-xl bg-brand-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile toggle */}
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
          {!user ? (
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center rounded-lg border border-slate-200 py-2 text-sm font-semibold text-slate-700">
                Sign In
              </Link>
              <Link href="/get-started" onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center rounded-lg bg-brand-600 py-2 text-sm font-semibold text-white">
                Get Started
              </Link>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <Link href={dashboardHref} onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center rounded-lg bg-brand-50 border border-brand-200 py-2 text-sm font-semibold text-brand-700">
                Go to Dashboard
              </Link>
              <button onClick={handleLogout}
                className="w-full text-center rounded-lg border border-slate-200 py-2 text-sm font-semibold text-red-600">
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
