"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays, MapPin, Clock, Filter, Search,
  CheckCircle2, Loader2, ExternalLink, Users
} from "lucide-react";

const EVENT_TYPES = ["ALL", "HACKATHON", "WORKSHOP", "WEBINAR", "CONFERENCE", "COMPETITION", "CAREER_FAIR", "CAMPUS_DRIVE"];
const MODES = ["ALL", "ONLINE", "OFFLINE", "HYBRID"];
const LEVELS = ["ALL", "BEGINNER", "INTERMEDIATE", "ADVANCED"];

const TYPE_COLORS: Record<string, string> = {
  HACKATHON: "bg-purple-50 text-purple-700 border-purple-200",
  WORKSHOP: "bg-blue-50 text-blue-700 border-blue-200",
  WEBINAR: "bg-cyan-50 text-cyan-700 border-cyan-200",
  CONFERENCE: "bg-amber-50 text-amber-700 border-amber-200",
  COMPETITION: "bg-red-50 text-red-700 border-red-200",
  CAREER_FAIR: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CAMPUS_DRIVE: "bg-indigo-50 text-indigo-700 border-indigo-200",
  OTHER: "bg-slate-50 text-slate-700 border-slate-200",
};

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState<string | null>(null);
  const [registeredIds, setRegisteredIds] = useState<Set<string>>(new Set());
  const [type, setType] = useState("ALL");
  const [mode, setMode] = useState("ALL");
  const [level, setLevel] = useState("ALL");
  const [search, setSearch] = useState("");

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (type !== "ALL") params.set("type", type);
      if (mode !== "ALL") params.set("mode", mode);
      if (level !== "ALL") params.set("level", level);
      const res = await fetch(`/api/student/events?${params.toString()}`);
      const data = await res.json();
      setEvents(data.events || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, [type, mode, level]);

  const handleRegister = async (eventId: string) => {
    setRegistering(eventId);
    try {
      const res = await fetch("/api/student/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });
      if (res.ok) setRegisteredIds(prev => new Set<string>(Array.from(prev).concat(eventId)));
    } finally {
      setRegistering(null);
    }
  };

  const filtered = events.filter(e =>
    !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.organizer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <CalendarDays className="text-emerald-600" size={26} /> Tech Events
        </h1>
        <p className="text-sm text-slate-500 mt-1">Discover hackathons, workshops, webinars, and career fairs.</p>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search events, organizers…"
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1">
            <Filter size={13} className="text-slate-400" />
            <span className="text-xs text-slate-500 font-medium">Type:</span>
          </div>
          {EVENT_TYPES.map(t => (
            <button key={t} onClick={() => setType(t)}
              className={`text-xs px-3 py-1 rounded-full border font-medium transition ${type === t ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"}`}>
              {t === "ALL" ? "All Types" : t.replace("_", " ")}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-slate-500 font-medium">Mode:</span>
          {MODES.map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`text-xs px-3 py-1 rounded-full border font-medium transition ${mode === m ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"}`}>
              {m === "ALL" ? "All Modes" : m}
            </button>
          ))}
          <span className="text-xs text-slate-500 font-medium ml-2">Level:</span>
          {LEVELS.map(l => (
            <button key={l} onClick={() => setLevel(l)}
              className={`text-xs px-3 py-1 rounded-full border font-medium transition ${level === l ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"}`}>
              {l === "ALL" ? "All Levels" : l}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 animate-pulse space-y-2">
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-100 rounded w-1/2" />
              <div className="h-8 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <CalendarDays size={40} className="text-slate-300 mx-auto mb-3" />
          <p className="text-base font-semibold text-slate-500">No events found</p>
          <p className="text-sm text-slate-400 mt-1">Try changing the filters or check back later.</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-slate-500 font-medium">{filtered.length} events found</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((ev) => {
              const isRegistered = registeredIds.has(ev.id) || (ev.registrations?.length > 0);
              const typeClass = TYPE_COLORS[ev.type] || TYPE_COLORS.OTHER;
              return (
                <div key={ev.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition flex flex-col">
                  {/* Type + Mode badges */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${typeClass}`}>
                      {ev.type.replace("_", " ")}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${ev.mode === "ONLINE" ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-purple-50 text-purple-600 border-purple-200"}`}>
                      {ev.mode}
                    </span>
                    {ev.level !== "ALL" && (
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full border bg-slate-50 text-slate-600 border-slate-200">
                        {ev.level}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-1">{ev.name}</h3>
                  <p className="text-xs text-slate-500 mb-3">by {ev.organizer}</p>

                  {ev.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3">{ev.description}</p>
                  )}

                  <div className="space-y-1.5 mb-4 flex-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <CalendarDays size={12} className="text-slate-400" />
                      {new Date(ev.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                      {ev.time && ` · ${ev.time}`}
                    </div>
                    {ev.location && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <MapPin size={12} className="text-slate-400" /> {ev.location}
                      </div>
                    )}
                    {ev.registrationDeadline && (
                      <div className="flex items-center gap-1.5 text-xs text-amber-600 font-medium">
                        <Clock size={12} /> Deadline: {new Date(ev.registrationDeadline).toLocaleDateString("en-IN")}
                      </div>
                    )}
                    {ev.eligibility && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Users size={12} className="text-slate-400" /> {ev.eligibility}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 border-t border-slate-100 pt-3 mt-auto">
                    <button
                      onClick={() => !isRegistered && handleRegister(ev.id)}
                      disabled={registering === ev.id || isRegistered}
                      className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition ${
                        isRegistered ? "bg-emerald-100 text-emerald-700 cursor-default" : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {registering === ev.id ? <Loader2 size={12} className="animate-spin" /> : null}
                      {isRegistered ? <><CheckCircle2 size={12} /> Registered</> : "Register Now"}
                    </button>
                    {ev.registrationUrl && (
                      <a href={ev.registrationUrl} target="_blank" rel="noreferrer"
                        className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition">
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
