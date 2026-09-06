"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Briefcase,
  Users,
  Sparkles,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  CheckCircle2,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/industry/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/industry/profile", label: "Company Profile", icon: Building2 },
  { href: "/industry/vacancies", label: "Vacancies", icon: Briefcase },
  { href: "/industry/applicants", label: "Applicants", icon: Users },
  { href: "/industry/recommended", label: "Recommended", icon: Sparkles },
];

interface IndustrySidebarProps {
  company: {
    companyName: string;
    domain: string;
    city?: string | null;
    state?: string | null;
    isVerified?: boolean;
  } | null;
}

export default function IndustrySidebar({ company }: IndustrySidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  const companyName = company?.companyName ?? "Your Company";
  const initials = companyName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo + Collapse */}
      <div className={`flex items-center justify-between p-4 border-b border-slate-800 ${collapsed ? "px-3" : ""}`}>
        {!collapsed && (
          <Link href="/industry/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-purple-600 flex items-center justify-center shrink-0">
              <Building2 size={16} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-white leading-tight">SkillBridge</div>
              <div className="text-[10px] text-slate-400 font-medium">Industry Portal</div>
            </div>
          </Link>
        )}
        {collapsed && (
          <div className="h-8 w-8 rounded-xl bg-purple-600 flex items-center justify-center mx-auto">
            <Building2 size={16} className="text-white" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex h-6 w-6 rounded-full bg-slate-700 hover:bg-slate-600 items-center justify-center text-slate-300 transition ml-auto"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </div>

      {/* Company Mini Profile */}
      {!collapsed && (
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-white truncate">{companyName}</div>
              <div className="text-[11px] text-slate-400 truncate">{company?.domain ?? "Industry"}</div>
              {company?.isVerified && (
                <div className="flex items-center gap-0.5 mt-0.5">
                  <CheckCircle2 size={9} className="text-emerald-400" />
                  <span className="text-[9px] text-emerald-400 font-medium">Verified</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-900/30"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              } ${collapsed ? "justify-center px-2" : ""}`}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span>{label}</span>}
              {!collapsed && isActive && <CheckCircle2 size={14} className="ml-auto text-purple-200" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-slate-800">
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
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 h-10 w-10 rounded-xl bg-slate-900 text-white shadow-lg flex items-center justify-center"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/60 z-40" onClick={() => setMobileOpen(false)} />
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
