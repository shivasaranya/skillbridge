import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/student/skills
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const student = await prisma.studentProfile.findUnique({
      where: { userId: session.id },
      select: { id: true },
    });
    if (!student) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    const skills = await prisma.studentSkill.findMany({
      where: { studentId: student.id },
      include: { skill: { include: { category: true } } },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ skills });
  } catch (err) {
    console.error("[skills GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/student/skills — add or update a skill
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { skillId, skillName, categoryId, proficiencyLevel, verificationLevel } = body;

    if (!proficiencyLevel) {
      return NextResponse.json({ error: "proficiencyLevel is required" }, { status: 400 });
    }

    const student = await prisma.studentProfile.findUnique({
      where: { userId: session.id },
      select: { id: true },
    });
    if (!student) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    // Score mapping
    const scoreMap: Record<string, number> = {
      BEGINNER: 40,
      INTERMEDIATE: 65,
      ADVANCED: 82,
      EXPERT: 95,
    };

    let resolvedSkillId = skillId;

    // If no skillId, try to find or create by name
    if (!resolvedSkillId && skillName) {
      let existingSkill = await prisma.skill.findFirst({
        where: { name: { equals: skillName } },
      });
      if (!existingSkill) {
        // Use provided categoryId or default to 1
        const catId = categoryId || 1;
        existingSkill = await prisma.skill.create({
          data: {
            name: skillName,
            code: skillName.toUpperCase().replace(/\s+/g, "_").slice(0, 30),
            categoryId: catId,
          },
        });
      }
      resolvedSkillId = existingSkill.id;
    }

    if (!resolvedSkillId) {
      return NextResponse.json({ error: "skillId or skillName required" }, { status: 400 });
    }

    const skill = await prisma.studentSkill.upsert({
      where: { studentId_skillId: { studentId: student.id, skillId: resolvedSkillId } },
      create: {
        studentId: student.id,
        skillId: resolvedSkillId,
        proficiencyLevel,
        proficiencyScore: scoreMap[proficiencyLevel] || 60,
        verificationLevel: verificationLevel || "SELF_DECLARED",
        verificationSource: "SELF_REPORTED",
      },
      update: {
        proficiencyLevel,
        proficiencyScore: scoreMap[proficiencyLevel] || 60,
        ...(verificationLevel && { verificationLevel }),
      },
      include: { skill: { include: { category: true } } },
    });

    return NextResponse.json({ skill }, { status: 201 });
  } catch (err) {
    console.error("[skills POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/student/skills?skillId=xxx
export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const skillId = searchParams.get("skillId");
    if (!skillId) return NextResponse.json({ error: "skillId required" }, { status: 400 });

    const student = await prisma.studentProfile.findUnique({
      where: { userId: session.id },
      select: { id: true },
    });
    if (!student) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    await prisma.studentSkill.deleteMany({
      where: { studentId: student.id, skillId },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[skills DELETE]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
