import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET — list own vacancies (Opportunities)
export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "INDUSTRY") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const company = await prisma.companyProfile.findUnique({
      where: { userId: session.id },
    });
    if (!company) {
      return NextResponse.json({ vacancies: [] });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const where: any = { companyId: company.id };
    if (status && status !== "ALL") where.status = status;

    const vacancies = await prisma.opportunity.findMany({
      where,
      include: {
        skills: { include: { skill: true } },
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ vacancies });
  } catch (err: any) {
    console.error("Industry vacancies GET error:", err);
    return NextResponse.json({ error: "Failed to fetch vacancies." }, { status: 500 });
  }
}

// POST — create new vacancy
export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "INDUSTRY") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const company = await prisma.companyProfile.findUnique({
      where: { userId: session.id },
    });
    if (!company) {
      return NextResponse.json({ error: "Company profile not found. Complete your profile first." }, { status: 404 });
    }

    const body = await req.json();
    const {
      title, type, workMode, description, responsibilities,
      eligibility, minCgpa, stipendOrSalary, vacancies,
      durationMonths, location, deadline, skills, department,
    } = body;

    if (!title || !description || !location) {
      return NextResponse.json({ error: "Title, description, and location are required." }, { status: 400 });
    }

    const opp = await prisma.opportunity.create({
      data: {
        companyId: company.id,
        title: String(title).trim(),
        type: type || "INTERNSHIP",
        workMode: workMode || "ONSITE",
        description: String(description).trim(),
        responsibilities: responsibilities ? String(responsibilities).trim() : null,
        eligibility: eligibility ? String(eligibility).trim() : null,
        minCgpa: minCgpa ? parseFloat(String(minCgpa)) : 6.5,
        stipendOrSalary: stipendOrSalary ? String(stipendOrSalary).trim() : "Competitive",
        vacancies: vacancies ? parseInt(String(vacancies)) : 1,
        durationMonths: durationMonths ? parseInt(String(durationMonths)) : null,
        location: String(location).trim(),
        deadline: deadline ? new Date(deadline) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: "OPEN",
      },
    });

    // Create skill associations — support both { skillId } and { name } inputs
    if (skills && Array.isArray(skills)) {
      // Ensure a default "General" SkillCategory exists for free-text skills
      let defaultCategory = await prisma.skillCategory.findFirst({
        where: { name: "General" },
      });
      if (!defaultCategory) {
        defaultCategory = await prisma.skillCategory.create({
          data: { name: "General", description: "General skills added by industry partners" },
        });
      }

      for (const s of skills) {
        try {
          let skillId: string | null = s.skillId ?? null;

          // If no skillId but has a name — look up or create the Skill
          if (!skillId && s.name) {
            const skillName = String(s.name).trim();
            // Try to find existing skill by name (case-insensitive)
            let skill = await prisma.skill.findFirst({
              where: { name: { equals: skillName } },
            });
            if (!skill) {
              // Try contains match
              skill = await prisma.skill.findFirst({
                where: { name: { contains: skillName } },
              });
            }
            if (!skill) {
              // Generate a unique code from the skill name
              const code = skillName.toUpperCase().replace(/[^A-Z0-9]/g, "_").slice(0, 30)
                + "_" + Date.now().toString(36).toUpperCase();
              skill = await prisma.skill.create({
                data: {
                  name: skillName,
                  code,
                  categoryId: defaultCategory!.id,
                  description: `Industry-required skill`,
                },
              });
            }
            skillId = skill.id;
          }

          if (skillId) {
            await prisma.opportunitySkill.create({
              data: {
                opportunityId: opp.id,
                skillId,
                criticality: s.criticality || "MANDATORY",
                weightage: s.weightage || 25,
              },
            });
          }
        } catch {
          // Skip failed skill associations silently
        }
      }
    }

    return NextResponse.json({ success: true, vacancy: opp }, { status: 201 });
  } catch (err: any) {
    console.error("Industry vacancy create error:", err);
    return NextResponse.json({ error: "Failed to create vacancy." }, { status: 500 });
  }
}
