import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/student/learning?role=Full+Stack+Developer
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const targetRole = searchParams.get("role");

    const student = await prisma.studentProfile.findUnique({
      where: { userId: session.id },
      include: {
        skills: { select: { skillId: true } },
        learningProgress: { include: { resource: true } },
      },
    });
    if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const studentSkillIds = new Set(student.skills.map((s) => s.skillId));

    // Recommended resources: for skills the student doesn't have
    const recommended = await prisma.learningResource.findMany({
      where: {
        OR: [
          { skillId: { notIn: Array.from(studentSkillIds) as string[] } },
          { skillId: null },
        ],
      },
      include: { skill: true },
      orderBy: { rating: "desc" },
      take: 9,
    });

    // Roadmap resources for target role
    let roadmap: any[] = [];
    if (targetRole) {
      roadmap = await prisma.learningResource.findMany({
        where: { targetRole, isRoadmapItem: true },
        include: {
          skill: true,
          learningProgress: {
            where: { studentId: student.id },
            select: { status: true },
          },
        },
        orderBy: { roadmapOrder: "asc" },
      });
    }

    return NextResponse.json({
      recommended,
      roadmap,
      progress: student.learningProgress,
    });
  } catch (err) {
    console.error("[learning GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/student/learning — update progress on a resource
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { resourceId, status } = body;

    if (!resourceId || !status) {
      return NextResponse.json({ error: "resourceId and status required" }, { status: 400 });
    }

    const validStatuses = ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const student = await prisma.studentProfile.findUnique({
      where: { userId: session.id }, select: { id: true },
    });
    if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const progress = await prisma.learningProgress.upsert({
      where: { studentId_resourceId: { studentId: student.id, resourceId } },
      create: {
        studentId: student.id,
        resourceId,
        status,
        startedAt: status === "IN_PROGRESS" ? new Date() : null,
        completedAt: status === "COMPLETED" ? new Date() : null,
      },
      update: {
        status,
        ...(status === "IN_PROGRESS" && { startedAt: new Date() }),
        ...(status === "COMPLETED" && { completedAt: new Date() }),
      },
    });

    return NextResponse.json({ progress });
  } catch (err) {
    console.error("[learning POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
