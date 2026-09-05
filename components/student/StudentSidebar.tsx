"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Layers,
  BarChart3,
  Briefcase,
  BookOpen,
  CalendarDays,
  FileText,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  LogOut,
  Menu,
  X,
  Target,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/student/profile", label: "My Profile", icon: User },
  { href: "/student/skills", label: "Skills", icon: Layers },
  { href: "/student/skill-gap", label: "Skill Gap", icon: Target },
  { href: "/student/opportunities", label: "Opportunities", icon: Briefcase },
  { href: "/student/learning", label: "Learning", icon: BookOpen },
  { href: "/student/events", label: "Tech Events", icon: CalendarDays },
  { href: "/student/applications", label: "Applications", icon: FileText },
  { href: "/student/notifications", label: "Notifications", icon: Bell },
  { href: "/student/settings", label: "Settings", icon: Settings },
];

interface StudentSidebarProps {
  student: any;
  unreadCount?: number;
}

export default function StudentSidebar({ student, unreadCount = 0 }: StudentSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  const profileCompletion = student?.profileCompletion ?? 0;
  const firstName = student?.user?.firstName || "Student";
  const lastName = student?.user?.lastName || "";

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo + Collapse Toggle */}
      <div className={`flex items-center justify-between p-4 border-b border-slate-800 ${collapsed ? "px-3" : ""}`}>
        {!collapsed && (
          <Link href="/student/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-blue-500 flex items-center justify-center shrink-0">
              <GraduationCap className="h-4.5 w-4.5 text-white" size={18} />
            </div>
            <div>
              <div className="text-sm font-bold text-white leading-tight">SkillBridge</div>
              <div className="text-[10px] text-slate-400 font-medium">Student Portal</div>
            </div>
          </Link>
        )}
        {collapsed && (
          <div className="h-8 w-8 rounded-xl bg-blue-500 flex items-center justify-center mx-auto">
            <GraduationCap size={18} className="text-white" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex h-6 w-6 rounded-full bg-slate-700 hover:bg-slate-600 items-center justify-center text-slate-300 transition ml-auto"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </div>

      {/* Student Mini Profile */}
      {!collapsed && (
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {firstName[0]}{lastName[0]}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-white truncate">{firstName} {lastName}</div>
              <div className="text-[11px] text-slate-400 truncate">{student?.degree || "Student"}</div>
            </div>
          </div>
          {/* Profile completion bar */}
          <div>
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-slate-400">Profile Completion</span>
              <span className="text-blue-400 font-semibold">{profileCompletion}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-700 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          const isNotif = href === "/student/notifications";
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              } ${collapsed ? "justify-center px-2" : ""}`}
            >
              <div className="relative shrink-0">
                <Icon size={18} />
                {isNotif && unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
              {!collapsed && <span>{label}</span>}
              {!collapsed && isActive && (
                <CheckCircle2 size={14} className="ml-auto text-blue-200" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-slate-800 space-y-1">
        <Link
          href="/assessments"
          className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-amber-400 hover:bg-amber-900/20 transition ${collapsed ? "justify-center" : ""}`}
        >
          <Sparkles size={16} />
          {!collapsed && "Take Assessment"}
        </Link>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut size={16} />
          {!collapsed && "Sign Out"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 h-10 w-10 rounded-xl bg-slate-900 text-white shadow-lg flex items-center justify-center"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X size={20} />
        </button>
        <SidebarContent />
      </div>

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-slate-900 border-r border-slate-800 transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        } shrink-0 h-screen sticky top-0`}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
