"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Lock, Mail, ArrowRight, Sparkles, AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed.");
        setLoading(false);
        return;
      }

      const role: string = data.user.role;
      const destination =
        role === "STUDENT"  ? "/student/dashboard" :
        role === "INDUSTRY" ? "/industry/dashboard" :
        role === "ADMIN"    ? "/dashboard/admin" :
        role === "INSTITUTION" ? "/dashboard/institution" :
        `/dashboard/${role.toLowerCase()}`;
      router.push(destination);
      router.refresh();
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password123");
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: demoEmail, password: "password123" }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed.");
        setLoading(false);
        return;
      }

      const role: string = data.user.role;
      const destination =
        role === "STUDENT"  ? "/student/dashboard" :
        role === "INDUSTRY" ? "/industry/dashboard" :
        role === "ADMIN"    ? "/dashboard/admin" :
        role === "INSTITUTION" ? "/dashboard/institution" :
        `/dashboard/${role.toLowerCase()}`;
      router.push(destination);
      router.refresh();
    } catch (err) {
      setError("Quick login failed.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="w-full max-w-md space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-500/20">
            <GraduationCap className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
            Welcome to SkillBridge
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Sign in to access your role-based collaboration portal
          </p>
        </div>

        {/* 1-Click Quick Evaluator Demo Card */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900 mb-3">
            <Sparkles className="h-4 w-4 text-amber-600" />
            <span>SIH Evaluator: 1-Click Role Logins</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickLogin("aarav.sharma@student.nia.ac.in")}
              className="rounded-lg border border-amber-200 bg-white p-2 text-left font-medium text-slate-800 hover:bg-amber-100/60 transition shadow-xs"
            >
              🎓 <span className="font-bold">Student</span>
              <div className="text-[10px] text-slate-500">Aarav (92% Match)</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin("corporate.hr@dabur.com")}
              className="rounded-lg border border-amber-200 bg-white p-2 text-left font-medium text-slate-800 hover:bg-amber-100/60 transition shadow-xs"
            >
              🏢 <span className="font-bold">Recruiter</span>
              <div className="text-[10px] text-slate-500">Dabur India R&D</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin("director@nia.nic.in")}
              className="rounded-lg border border-amber-200 bg-white p-2 text-left font-medium text-slate-800 hover:bg-amber-100/60 transition shadow-xs"
            >
              🏛️ <span className="font-bold">Institution</span>
              <div className="text-[10px] text-slate-500">Dean / Director</div>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Email Address
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@institution.edu.in"
                  className="block w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Password
                </label>
                <span className="text-xs text-brand-600 hover:underline cursor-pointer">
                  Default: password123
                </span>
              </div>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white shadow-md shadow-brand-500/20 hover:bg-brand-700 transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account yet?{" "}
            <Link href="/register" className="font-semibold text-brand-600 hover:text-brand-700">
              Register now
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
