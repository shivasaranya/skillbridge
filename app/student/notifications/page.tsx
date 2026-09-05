"use client";

import { useEffect, useState } from "react";
import { Bell, CheckCheck, Briefcase, Target, BookOpen, CalendarDays, Info, Award, Loader2 } from "lucide-react";

const TYPE_ICONS: Record<string, any> = {
  APPLICATION: Briefcase,
  INTERVIEW: Briefcase,
  MATCH: Target,
  SKILL_GAP: Target,
  LEARNING: BookOpen,
  EVENT: CalendarDays,
  CERTIFICATION: Award,
  INFO: Info,
};

const TYPE_COLORS: Record<string, string> = {
  APPLICATION: "bg-blue-50 text-blue-600",
  INTERVIEW: "bg-purple-50 text-purple-600",
  MATCH: "bg-emerald-50 text-emerald-600",
  SKILL_GAP: "bg-amber-50 text-amber-600",
  LEARNING: "bg-indigo-50 text-indigo-600",
  EVENT: "bg-cyan-50 text-cyan-600",
  CERTIFICATION: "bg-rose-50 text-rose-600",
  INFO: "bg-slate-50 text-slate-600",
};

function timeAgo(dateStr: string) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  const fetchNotifs = async () => {
    try {
      const res = await fetch("/api/student/notifications");
      const data = await res.json();
      setNotifications(data.notifications || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifs(); }, []);

  const markRead = async (id: string) => {
    await fetch("/api/student/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notificationId: id }),
    });
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllRead = async () => {
    setMarkingAll(true);
    await fetch("/api/student/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAll: true }),
    });
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setMarkingAll(false);
  };

  const unread = notifications.filter(n => !n.isRead).length;

  // Group by date
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const groups: Record<string, any[]> = { Today: [], Yesterday: [], Earlier: [] };
  for (const n of notifications) {
    const d = new Date(n.createdAt).toDateString();
    if (d === today) groups.Today.push(n);
    else if (d === yesterday) groups.Yesterday.push(n);
    else groups.Earlier.push(n);
  }

  return (
    <div className="space-y-6 pb-10 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Bell className="text-blue-600" size={26} /> Notifications
          </h1>
          <p className="text-sm text-slate-500 mt-1">{unread > 0 ? `${unread} unread` : "All caught up!"}</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} disabled={markingAll}
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline disabled:opacity-50">
            {markingAll ? <Loader2 size={13} className="animate-spin" /> : <CheckCheck size={13} />}
            Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4 animate-pulse flex gap-3">
              <div className="h-9 w-9 rounded-xl bg-slate-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-slate-200 rounded w-3/4" />
                <div className="h-2.5 bg-slate-100 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Bell size={40} className="text-slate-300 mx-auto mb-3" />
          <p className="text-base font-semibold text-slate-500">No notifications yet.</p>
          <p className="text-sm text-slate-400 mt-1">We'll notify you about opportunities, updates, and more.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groups).map(([group, notifs]) => {
            if (notifs.length === 0) return null;
            return (
              <div key={group}>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{group}</div>
                <div className="space-y-2">
                  {notifs.map((n) => {
                    const Icon = TYPE_ICONS[n.type] || Info;
                    const colorClass = TYPE_COLORS[n.type] || TYPE_COLORS.INFO;
                    return (
                      <div
                        key={n.id}
                        onClick={() => !n.isRead && markRead(n.id)}
                        className={`rounded-xl border p-4 flex gap-3 cursor-pointer transition ${
                          n.isRead ? "border-slate-200 bg-white" : "border-blue-200 bg-blue-50/40 hover:bg-blue-50"
                        }`}
                      >
                        <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                          <Icon size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-sm font-semibold ${n.isRead ? "text-slate-700" : "text-slate-900"}`}>{n.title}</p>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {!n.isRead && <div className="h-2 w-2 rounded-full bg-blue-500" />}
                              <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">{timeAgo(n.createdAt)}</span>
                            </div>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                          {n.link && (
                            <a href={n.link} className="text-xs text-blue-600 font-semibold hover:underline mt-1 inline-block">
                              View →
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
