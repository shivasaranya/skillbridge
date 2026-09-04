import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { calculateSkillMatch } from "@/lib/matchingEngine";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // 'INTERNSHIP', 'JOB', 'FACULTY_FDP', 'TRAINING'
    const search = searchParams.get("search");
    const workMode = searchParams.get("workMode");

    const session = await getSession();

    // Fetch student skills if logged in as student
    let studentSkills: any[] = [];
    if (session && session.role === "STUDENT") {
      const student = await prisma.studentProfile.findUnique({
        where: { userId: session.id },
        include: {
          skills: {
            include: { skill: true },
          },
        },
      });
      if (student) {
        studentSkills = student.skills.map((s) => ({
          skillId: s.skillId,
          name: s.skill.name,
          proficiencyLevel: s.proficiencyLevel,
          score: s.proficiencyScore,
        }));
      }
    }

    const where: any = {
      status: "OPEN",
    };

    if (type) {
      where.type = type;
    }
    if (workMode) {
      where.workMode = workMode;
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { company: { companyName: { contains: search } } },
      ];
    }

    const opportunities = await prisma.opportunity.findMany({
      where,
      include: {
        company: true,
        skills: {
          include: {
            skill: {
              include: {
                bridgeCourses: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Compute dynamic match score for each opportunity
    const enriched = opportunities.map((opp) => {
      const requiredSkills = opp.skills.map((os) => ({
        skillId: os.skillId,
        name: os.skill.name,
        criticality: os.criticality,
        weightage: os.weightage,
      }));

      const matchAnalysis = calculateSkillMatch(studentSkills, requiredSkills);

      return {
        ...opp,
        matchAnalysis,
      };
    });

    return NextResponse.json({ opportunities: enriched });
  } catch (err: any) {
    console.error("Opportunities fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch opportunities." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "INDUSTRY" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized. Industry role required." }, { status: 403 });
    }

    const body = await req.json();
    const {
      title,
      type,
      workMode,
      description,
      responsibilities,
      eligibility,
      minCgpa,
      stipendOrSalary,
      vacancies,
      durationMonths,
      location,
      deadline,
      skills,
    } = body;

    let company = await prisma.companyProfile.findUnique({
      where: { userId: session.id },
    });

    if (!company) {
      // Fallback or create if not present
      company = await prisma.companyProfile.findFirst();
      if (!company) {
        return NextResponse.json({ error: "Company profile not found." }, { status: 404 });
      }
    }

    const opp = await prisma.opportunity.create({
      data: {
        companyId: company.id,
        title,
        type: type || "INTERNSHIP",
        workMode: workMode || "ONSITE",
        description,
        responsibilities,
        eligibility,
        minCgpa: parseFloat(minCgpa) || 6.5,
        stipendOrSalary: stipendOrSalary || "₹25,000 / month",
        vacancies: parseInt(vacancies) || 1,
        durationMonths: durationMonths ? parseInt(durationMonths) : null,
        location: location || "Remote / Hybrid",
        deadline: deadline ? new Date(deadline) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    // Link required skills if provided
    if (skills && Array.isArray(skills)) {
      for (const s of skills) {
        if (s.skillId) {
          await prisma.opportunitySkill.create({
            data: {
              opportunityId: opp.id,
              skillId: s.skillId,
              criticality: s.criticality || "MANDATORY",
              weightage: s.weightage || 25,
            },
          });
        }
      }
    }

    return NextResponse.json({ success: true, opportunity: opp });
  } catch (err: any) {
    console.error("Opportunity create error:", err);
    return NextResponse.json({ error: "Failed to create opportunity." }, { status: 500 });
  }
}
