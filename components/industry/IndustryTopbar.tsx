"use client";

import Link from "next/link";
import { Building2, Bell, ExternalLink } from "lucide-react";

interface IndustryTopbarProps {
  company: {
    companyName: string;
    domain: string;
    website?: string | null;
  } | null;
  unreadCount?: number;
}

export default function IndustryTopbar({ company, unreadCount = 0 }: IndustryTopbarProps) {
  const companyName = company?.companyName ?? "Your Company";

  return (
    <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-4 sm:px-6 shrink-0 z-10">
      <div className="flex items-center gap-3">
        <div className="h-7 w-7 rounded-lg bg-purple-100 flex items-center justify-center">
          <Building2 size={14} className="text-purple-700" />
        </div>
        <div>
          <div className="text-sm font-bold text-slate-900 leading-tight">{companyName}</div>
          <div className="text-[10px] text-slate-500">{company?.domain ?? "Industry Partner"}</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {company?.website && (
          <a
            href={company.website}
            target="_blank"
            rel="noreferrer noopener"
            className="hidden sm:flex items-center gap-1 text-xs text-slate-500 hover:text-purple-600 transition"
          >
            <ExternalLink size={12} />
            Website
          </a>
        )}

        <Link
          href="/industry/applicants"
          className="relative flex items-center justify-center h-8 w-8 rounded-lg hover:bg-slate-100 transition"
        >
          <Bell size={16} className="text-slate-600" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full bg-purple-600 text-[8px] font-bold text-white flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
