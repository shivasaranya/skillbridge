import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { REAL_TECH_EVENTS } from "@/lib/techEvents";

// GET /api/student/events — returns curated real tech events with filtering
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type    = searchParams.get("type");
    const mode    = searchParams.get("mode");
    const level   = searchParams.get("level");
    const search  = searchParams.get("q") || "";

    const now = new Date();

    let events = REAL_TECH_EVENTS.filter((ev) => {
      // Only show active, upcoming events
      if (!ev.isActive) return false;
      const eventEnd = ev.endDate ? new Date(ev.endDate) : new Date(ev.date);
      if (eventEnd < now) return false;

      // Type filter
      if (type && type !== "ALL" && ev.type !== type) return false;
      // Mode filter
      if (mode && mode !== "ALL" && ev.mode !== mode) return false;
      // Level filter
      if (level && level !== "ALL" && ev.level !== level && ev.level !== "ALL") return false;

      // Search filter
      if (search) {
        const q = search.toLowerCase();
        const searchable = [
          ev.name,
          ev.organizer,
          ev.location ?? "",
          ...(ev.topics ?? []),
        ].join(" ").toLowerCase();
        if (!searchable.includes(q)) return false;
      }

      return true;
    });

    // Sort by date ascending
    events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return NextResponse.json({ events, total: events.length });
  } catch (err) {
    console.error("[events GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST is intentionally removed — SkillBridge does NOT register students for external events.
// Registration happens on the official event website via the registrationUrl.
// The "Save Event" (interested) feature is handled client-side only.
