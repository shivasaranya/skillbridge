"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Briefcase,
  GraduationCap,
  X,
} from "lucide-react";

interface StudentTopbarProps {
  student: any;
  unreadCount?: number;
}

export default function StudentTopbar({ student, unreadCount = 0 }: StudentTopbarProps) {
  const router = useRouter();
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const firstName = student?.user?.firstName || "Student";
  const lastName = student?.user?.lastName || "";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/student/opportunities?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  // Greeting based on time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <header className="sticky top-0 z-30 h-14 bg-white border-b border-slate-200 flex items-center gap-4 px-4 lg:px-6 shadow-sm">
      {/* Greeting (hidden on mobile) */}
      <div className="hidden md:block flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-700 truncate">
          {greeting}, {firstName}! 👋
        </p>
        <p className="text-xs text-slate-400 hidden lg:block">
          {student?.degree} · {student?.institution?.name || "SkillBridge"}
        </p>
      </div>

      {/* Search bar (desktop) */}
      <div className="hidden md:flex flex-1 max-w-sm">
        <form onSubmit={handleSearch} className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search jobs, skills, companies…"
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
          />
        </form>
      </div>

      {/* Mobile search toggle */}
      <button
        className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition"
        onClick={() => setShowSearch(!showSearch)}
      >
        {showSearch ? <X size={18} /> : <Search size={18} />}
      </button>

      <div className="flex items-center gap-2 ml-auto">
        {/* Notifications bell */}
        <Link
          href="/student/notifications"
          className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>

        {/* Profile dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-slate-100 transition"
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs">
              {firstName[0]}{lastName[0]}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-slate-800">{firstName} {lastName}</div>
              <div className="text-[10px] text-slate-500">{student?.degree?.split(" ")[0] || "Student"}</div>
            </div>
            <ChevronDown size={14} className="text-slate-400 hidden lg:block" />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50">
              <div className="px-4 py-3 border-b border-slate-100">
                <div className="text-sm font-bold text-slate-900">{firstName} {lastName}</div>
                <div className="text-xs text-slate-500 truncate">{student?.user?.email}</div>
              </div>
              <div className="py-1">
                <Link href="/student/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition" onClick={() => setShowProfile(false)}>
                  <User size={15} className="text-slate-400" /> My Profile
                </Link>
                <Link href="/student/opportunities" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition" onClick={() => setShowProfile(false)}>
                  <Briefcase size={15} className="text-slate-400" /> Opportunities
                </Link>
                <Link href="/student/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition" onClick={() => setShowProfile(false)}>
                  <Settings size={15} className="text-slate-400" /> Settings
                </Link>
              </div>
              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut size={15} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile search bar */}
      {showSearch && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 p-3 md:hidden shadow-md z-40">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jobs, skills, events…"
              autoFocus
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </form>
        </div>
      )}
    </header>
  );
}
