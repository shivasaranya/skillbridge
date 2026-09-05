"use client";

import { useEffect, useState, useCallback } from "react";
import {
  CalendarDays, MapPin, Clock, Filter, Search, ExternalLink,
  X, Users, Tag, Globe, Bookmark, BookmarkCheck, ChevronRight,
  AlertTriangle, RefreshCw, ArrowUpRight, Zap,
} from "lucide-react";
import type { TechEvent } from "@/lib/techEvents";

// ── Constants ────────────────────────────────────────────────────────────────

const EVENT_TYPES = ["ALL", "HACKATHON", "CONFERENCE", "WORKSHOP", "WEBINAR", "COMPETITION", "SUMMIT"];
const MODES       = ["ALL", "ONLINE", "OFFLINE", "HYBRID"];
const LEVELS      = ["ALL", "BEGINNER", "INTERMEDIATE", "ADVANCED"];

const TYPE_COLORS: Record<string, string> = {
  HACKATHON:  "bg-purple-50 text-purple-700 border-purple-200",
  CONFERENCE: "bg-amber-50 text-amber-700 border-amber-200",
  WORKSHOP:   "bg-blue-50 text-blue-700 border-blue-200",
  WEBINAR:    "bg-cyan-50 text-cyan-700 border-cyan-200",
  COMPETITION:"bg-red-50 text-red-700 border-red-200",
  SUMMIT:     "bg-indigo-50 text-indigo-700 border-indigo-200",
  OTHER:      "bg-slate-50 text-slate-700 border-slate-200",
};

const MODE_COLORS: Record<string, string> = {
  ONLINE:  "bg-emerald-50 text-emerald-700 border-emerald-200",
  OFFLINE: "bg-rose-50 text-rose-700 border-rose-200",
  HYBRID:  "bg-violet-50 text-violet-700 border-violet-200",
};

const LEVEL_COLORS: Record<string, string> = {
  BEGINNER:     "bg-green-50 text-green-700 border-green-200",
  INTERMEDIATE: "bg-yellow-50 text-yellow-700 border-yellow-200",
  ADVANCED:     "bg-red-50 text-red-700 border-red-200",
  ALL:          "bg-slate-50 text-slate-600 border-slate-200",
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function daysUntilDeadline(deadline?: string) {
  if (!deadline) return null;
  const diff = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86_400_000);
  return diff;
}

// ── Event Detail Modal ───────────────────────────────────────────────────────

function EventDetailModal({
  event,
  saved,
  onClose,
  onToggleSave,
}: {
  event: TechEvent;
  saved: boolean;
  onClose: () => void;
  onToggleSave: (id: string) => void;
}) {
  const typeClass  = TYPE_COLORS[event.type]  || TYPE_COLORS.OTHER;
  const modeClass  = MODE_COLORS[event.mode]  || MODE_COLORS.ONLINE;
  const levelClass = LEVEL_COLORS[event.level] || LEVEL_COLORS.ALL;
  const deadlineDays = daysUntilDeadline(event.registrationDeadline);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />

      {/* Panel */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-start justify-between gap-3 rounded-t-2xl">
          <div className="flex flex-wrap gap-2 mt-0.5">
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${typeClass}`}>
              {event.type.replace("_", " ")}
            </span>
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${modeClass}`}>
              {event.mode}
            </span>
            {event.level !== "ALL" && (
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${levelClass}`}>
                {event.level}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 pt-5 pb-6 space-y-5">
          {/* Title */}
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 leading-snug">{event.name}</h2>
            <p className="text-sm font-semibold text-blue-600 mt-1">{event.organizer}</p>
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-start gap-2.5 bg-slate-50 rounded-xl p-3">
              <CalendarDays size={15} className="text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Date</p>
                <p className="text-sm font-semibold text-slate-800">
                  {formatDate(event.date)}
                  {event.endDate && event.endDate !== event.date && (
                    <span className="text-slate-500 font-normal"> – {formatDate(event.endDate)}</span>
                  )}
                </p>
                {event.time && <p className="text-xs text-slate-500 mt-0.5">{event.time}</p>}
              </div>
            </div>

            <div className="flex items-start gap-2.5 bg-slate-50 rounded-xl p-3">
              <MapPin size={15} className="text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Location</p>
                <p className="text-sm font-semibold text-slate-800">
                  {event.location || (event.mode === "ONLINE" ? "Online" : "TBD")}
                </p>
              </div>
            </div>

            {event.registrationDeadline && (
              <div className={`flex items-start gap-2.5 rounded-xl p-3 ${
                deadlineDays !== null && deadlineDays <= 7
                  ? "bg-red-50 border border-red-200"
                  : "bg-amber-50 border border-amber-200"
              }`}>
                <Clock size={15} className={`mt-0.5 shrink-0 ${
                  deadlineDays !== null && deadlineDays <= 7 ? "text-red-500" : "text-amber-500"
                }`} />
                <div>
                  <p className={`text-[11px] font-semibold uppercase tracking-wide ${
                    deadlineDays !== null && deadlineDays <= 7 ? "text-red-500" : "text-amber-600"
                  }`}>Registration Deadline</p>
                  <p className={`text-sm font-bold ${
                    deadlineDays !== null && deadlineDays <= 7 ? "text-red-700" : "text-amber-800"
                  }`}>{formatDate(event.registrationDeadline)}</p>
                  {deadlineDays !== null && (
                    <p className={`text-xs mt-0.5 ${
                      deadlineDays <= 7 ? "text-red-600" : "text-amber-700"
                    }`}>
                      {deadlineDays > 0 ? `${deadlineDays} days remaining` : "Deadline passed"}
                    </p>
                  )}
                </div>
              </div>
            )}

            {event.eligibility && (
              <div className="flex items-start gap-2.5 bg-slate-50 rounded-xl p-3">
                <Users size={15} className="text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Eligibility</p>
                  <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">{event.eligibility}</p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">About This Event</p>
            <p className="text-sm text-slate-700 leading-relaxed">{event.description}</p>
          </div>

          {/* Topics */}
          {event.topics && event.topics.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                <Tag size={11} /> Topics & Technologies
              </p>
              <div className="flex flex-wrap gap-1.5">
                {event.topics.map((t) => (
                  <span key={t} className="text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded-lg px-2.5 py-1">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Official website */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Globe size={12} />
            <span>Official website:</span>
            <a
              href={event.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-semibold hover:underline truncate"
            >
              {event.websiteUrl}
            </a>
          </div>

          {/* ── IMPORTANT: External registration notice ── */}
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
            <p className="font-semibold mb-0.5">Registration is on the official event website</p>
            <p className="text-amber-700">
              SkillBridge does not process event registrations. Clicking the button below
              will open the official registration page in a new tab.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-1">
            <a
              href={event.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-3 transition shadow-sm"
            >
              Register on Official Website
              <ArrowUpRight size={15} />
            </a>
            <button
              onClick={() => onToggleSave(event.id)}
              title={saved ? "Remove from saved" : "Save event"}
              className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-xs font-semibold transition ${
                saved
                  ? "bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {saved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
              {saved ? "Saved" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Event Card ───────────────────────────────────────────────────────────────

function EventCard({
  event,
  saved,
  onViewDetails,
  onToggleSave,
}: {
  event: TechEvent;
  saved: boolean;
  onViewDetails: (ev: TechEvent) => void;
  onToggleSave: (id: string) => void;
}) {
  const typeClass  = TYPE_COLORS[event.type]  || TYPE_COLORS.OTHER;
  const modeClass  = MODE_COLORS[event.mode]  || MODE_COLORS.ONLINE;
  const deadlineDays = daysUntilDeadline(event.registrationDeadline);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition flex flex-col">
      {/* Badges */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${typeClass}`}>
          {event.type.replace("_", " ")}
        </span>
        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${modeClass}`}>
          {event.mode}
        </span>
        {event.level !== "ALL" && (
          <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${LEVEL_COLORS[event.level] || LEVEL_COLORS.ALL}`}>
            {event.level}
          </span>
        )}
      </div>

      {/* Title + organizer */}
      <h3 className="text-sm font-bold text-slate-900 mb-0.5 line-clamp-2 leading-snug">
        {event.name}
      </h3>
      <p className="text-xs font-semibold text-blue-600 mb-3 line-clamp-1">{event.organizer}</p>

      {/* Description */}
      <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed flex-1">
        {event.description}
      </p>

      {/* Meta */}
      <div className="space-y-1.5 mb-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <CalendarDays size={12} className="text-slate-400 shrink-0" />
          {formatDate(event.date)}
          {event.endDate && event.endDate !== event.date && (
            <span className="text-slate-400"> – {formatDate(event.endDate)}</span>
          )}
        </div>
        {event.location && (
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <MapPin size={12} className="text-slate-400 shrink-0" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        )}
        {event.registrationDeadline && deadlineDays !== null && (
          <div className={`flex items-center gap-1.5 text-xs font-medium ${
            deadlineDays <= 7 ? "text-red-600" : "text-amber-600"
          }`}>
            <Clock size={12} className="shrink-0" />
            {deadlineDays > 0
              ? `Reg. closes in ${deadlineDays} day${deadlineDays === 1 ? "" : "s"}`
              : "Registration closed"}
          </div>
        )}
      </div>

      {/* Topics */}
      <div className="flex flex-wrap gap-1 mb-4">
        {event.topics.slice(0, 4).map((t) => (
          <span key={t} className="text-[10px] font-medium bg-slate-100 text-slate-600 rounded-md px-2 py-0.5">
            {t}
          </span>
        ))}
        {event.topics.length > 4 && (
          <span className="text-[10px] text-slate-400">+{event.topics.length - 4}</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 border-t border-slate-100 pt-3 mt-auto">
        <button
          onClick={() => onViewDetails(event)}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 transition"
        >
          View Details <ChevronRight size={12} />
        </button>
        <button
          onClick={() => onToggleSave(event.id)}
          title={saved ? "Remove from saved" : "Save event"}
          className={`flex items-center gap-1 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
            saved
              ? "bg-emerald-50 border-emerald-300 text-emerald-700"
              : "border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          {saved ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}
        </button>
        <a
          href={event.registrationUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Register on official website"
          className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
        >
          <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function EventsPage() {
  const [events, setEvents]       = useState<TechEvent[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [type, setType]           = useState("ALL");
  const [mode, setMode]           = useState("ALL");
  const [level, setLevel]         = useState("ALL");
  const [search, setSearch]       = useState("");
  const [selectedEvent, setSelectedEvent] = useState<TechEvent | null>(null);

  // Client-side "saved" state only — not a SkillBridge DB record
  const [savedIds, setSavedIds]   = useState<Set<string>>(new Set());

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (type  !== "ALL") params.set("type",  type);
      if (mode  !== "ALL") params.set("mode",  mode);
      if (level !== "ALL") params.set("level", level);
      if (search)          params.set("q",     search);

      const res = await fetch(`/api/student/events?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load events");
      const data = await res.json();
      setEvents(data.events || []);
    } catch {
      setError("Could not load events. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [type, mode, level, search]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const toggleSave = (id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <>
      {/* ── Event Detail Modal ── */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          saved={savedIds.has(selectedEvent.id)}
          onClose={() => setSelectedEvent(null)}
          onToggleSave={toggleSave}
        />
      )}

      <div className="space-y-6 pb-10">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <CalendarDays className="text-emerald-600" size={26} /> Tech Events
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real upcoming technology events, hackathons, and conferences in India.
          </p>
        </div>

        {/* ── Filter Panel ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
          {/* Search */}
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by event name, organiser, topic, or location…"
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Type filter */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <Filter size={12} /> Type:
            </span>
            {EVENT_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`text-xs px-3 py-1 rounded-full border font-medium transition ${
                  type === t
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                }`}
              >
                {t === "ALL" ? "All Types" : t.replace("_", " ")}
              </button>
            ))}
          </div>

          {/* Mode + Level filter */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-slate-500 font-medium">Mode:</span>
            {MODES.map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`text-xs px-3 py-1 rounded-full border font-medium transition ${
                  mode === m
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                }`}
              >
                {m === "ALL" ? "All Modes" : m}
              </button>
            ))}
            <span className="text-xs text-slate-500 font-medium ml-2">Level:</span>
            {LEVELS.map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={`text-xs px-3 py-1 rounded-full border font-medium transition ${
                  level === l
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                }`}
              >
                {l === "ALL" ? "All Levels" : l}
              </button>
            ))}
          </div>
        </div>

        {/* ── Real-data notice ── */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 flex items-start gap-2.5">
          <Zap size={14} className="text-emerald-600 mt-0.5 shrink-0" />
          <p className="text-xs text-emerald-800 font-medium">
            All events below are real upcoming tech events in India with official registration links.
            SkillBridge does not process registrations — clicking "Register" takes you directly to the official event website.
          </p>
        </div>

        {/* ── Events Grid / States ── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 animate-pulse space-y-3">
                <div className="flex gap-2">
                  <div className="h-6 bg-slate-200 rounded-full w-20" />
                  <div className="h-6 bg-slate-100 rounded-full w-16" />
                </div>
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
                <div className="h-12 bg-slate-100 rounded" />
                <div className="h-8 bg-slate-200 rounded-xl" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
            <AlertTriangle size={36} className="text-red-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-red-700">{error}</p>
            <p className="text-xs text-red-500 mt-1 mb-4">
              This is not a display of dummy events — if the source fails, no events are shown.
            </p>
            <button
              onClick={fetchEvents}
              className="inline-flex items-center gap-2 text-xs font-semibold text-red-700 hover:underline"
            >
              <RefreshCw size={13} /> Try Again
            </button>
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <CalendarDays size={40} className="text-slate-300 mx-auto mb-3" />
            <p className="text-base font-semibold text-slate-500">No upcoming events found</p>
            <p className="text-sm text-slate-400 mt-1">
              {type !== "ALL" || mode !== "ALL" || level !== "ALL" || search
                ? "Try changing the filters or search term."
                : "Check back soon for new events."}
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs text-slate-500 font-medium">
              {events.length} upcoming event{events.length !== 1 ? "s" : ""} found
              {savedIds.size > 0 && (
                <span className="ml-2 text-emerald-600 font-semibold">
                  · {savedIds.size} saved
                </span>
              )}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((ev) => (
                <EventCard
                  key={ev.id}
                  event={ev}
                  saved={savedIds.has(ev.id)}
                  onViewDetails={setSelectedEvent}
                  onToggleSave={toggleSave}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
