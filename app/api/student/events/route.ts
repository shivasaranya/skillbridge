import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/student/events
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const mode = searchParams.get("mode");
    const level = searchParams.get("level");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    const where: any = {
      isActive: true,
      date: { gte: new Date() },
    };
    if (type && type !== "ALL") where.type = type;
    if (mode && mode !== "ALL") where.mode = mode;
    if (level && level !== "ALL") where.level = level;

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy: { date: "asc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          registrations: session.role === "STUDENT" ? {
            where: { student: { userId: session.id } },
            select: { id: true },
          } : false,
        },
      }),
      prisma.event.count({ where }),
    ]);

    return NextResponse.json({ events, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("[events GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/student/events — register for event
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { eventId } = body;
    if (!eventId) return NextResponse.json({ error: "eventId required" }, { status: 400 });

    const student = await prisma.studentProfile.findUnique({
      where: { userId: session.id }, select: { id: true },
    });
    if (!student) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    const registration = await prisma.eventRegistration.upsert({
      where: { eventId_studentId: { eventId, studentId: student.id } },
      create: { eventId, studentId: student.id },
      update: {},
    });

    return NextResponse.json({ registration }, { status: 201 });
  } catch (err) {
    console.error("[events POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
