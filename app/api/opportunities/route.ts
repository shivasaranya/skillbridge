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
    const mine = searchParams.get("mine") === "true";
    const statusParam = searchParams.get("status");

    const session = await getSession();

    // If Industry user wants to view their own vacancies
    if (mine) {
      if (!session || (session.role !== "INDUSTRY" && session.role !== "ADMIN")) {
        return NextResponse.json({ error: "Unauthorized. Industry role required." }, { status: 401 });
      }

      let company = await prisma.companyProfile.findUnique({
        where: { userId: session.id },
      });

      if (!company) {
        company = await prisma.companyProfile.findFirst();
        if (!company) {
          return NextResponse.json({ error: "Company profile not found." }, { status: 404 });
        }
      }

      const whereMine: any = {
        companyId: company.id,
      };
      if (statusParam && statusParam !== "ALL") {
        whereMine.status = statusParam;
      }

      const opportunities = await prisma.opportunity.findMany({
        where: whereMine,
        include: {
          company: true,
          skills: {
            include: {
              skill: true,
            },
          },
          applications: {
            include: {
              student: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({ opportunities });
    }

    // Default flow: public / student opportunity feed
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
      status: statusParam || "OPEN",
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
        { department: { contains: search } },
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
      department,
      description,
      responsibilities,
      eligibility,
      qualification,
      experience,
      minCgpa,
      stipendOrSalary,
      vacancies,
      durationMonths,
      location,
      deadline,
      skills,
    } = body;

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required." }, { status: 400 });
    }

    let company = await prisma.companyProfile.findUnique({
      where: { userId: session.id },
    });

    if (!company) {
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
        department: department || null,
        description,
        responsibilities: responsibilities || null,
        eligibility: eligibility || null,
        qualification: qualification || null,
        experience: experience || null,
        minCgpa: minCgpa ? parseFloat(minCgpa) : 6.5,
        stipendOrSalary: stipendOrSalary || "₹25,000 / month",
        vacancies: vacancies ? parseInt(vacancies) : 1,
        durationMonths: durationMonths ? parseInt(durationMonths) : null,
        location: location || "Remote / Hybrid",
        deadline: deadline ? new Date(deadline) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: "OPEN",
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

    const fullOpp = await prisma.opportunity.findUnique({
      where: { id: opp.id },
      include: {
        company: true,
        skills: {
          include: { skill: true },
        },
      },
    });

    return NextResponse.json({ success: true, opportunity: fullOpp });
  } catch (err: any) {
    console.error("Opportunity create error:", err);
    return NextResponse.json({ error: "Failed to create opportunity." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "INDUSTRY" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized. Industry role required." }, { status: 403 });
    }

    const body = await req.json();
    const {
      id,
      title,
      type,
      workMode,
      department,
      description,
      responsibilities,
      eligibility,
      qualification,
      experience,
      minCgpa,
      stipendOrSalary,
      vacancies,
      durationMonths,
      location,
      deadline,
      status,
      skills,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "Vacancy ID is required." }, { status: 400 });
    }

    let company = await prisma.companyProfile.findUnique({
      where: { userId: session.id },
    });

    const existing = await prisma.opportunity.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Vacancy not found." }, { status: 404 });
    }

    if (company && existing.companyId !== company.id && session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized to edit this vacancy." }, { status: 403 });
    }

    const updated = await prisma.opportunity.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existing.title,
        type: type !== undefined ? type : existing.type,
        workMode: workMode !== undefined ? workMode : existing.workMode,
        department: department !== undefined ? department : existing.department,
        description: description !== undefined ? description : existing.description,
        responsibilities: responsibilities !== undefined ? responsibilities : existing.responsibilities,
        eligibility: eligibility !== undefined ? eligibility : existing.eligibility,
        qualification: qualification !== undefined ? qualification : existing.qualification,
        experience: experience !== undefined ? experience : existing.experience,
        minCgpa: minCgpa !== undefined ? parseFloat(minCgpa) : existing.minCgpa,
        stipendOrSalary: stipendOrSalary !== undefined ? stipendOrSalary : existing.stipendOrSalary,
        vacancies: vacancies !== undefined ? parseInt(vacancies) : existing.vacancies,
        durationMonths: durationMonths !== undefined ? (durationMonths ? parseInt(durationMonths) : null) : existing.durationMonths,
        location: location !== undefined ? location : existing.location,
        deadline: deadline !== undefined ? new Date(deadline) : existing.deadline,
        status: status !== undefined ? status : existing.status,
      },
    });

    // Update skills if provided
    if (skills && Array.isArray(skills)) {
      await prisma.opportunitySkill.deleteMany({
        where: { opportunityId: id },
      });

      for (const s of skills) {
        if (s.skillId) {
          await prisma.opportunitySkill.create({
            data: {
              opportunityId: id,
              skillId: s.skillId,
              criticality: s.criticality || "MANDATORY",
              weightage: s.weightage || 25,
            },
          });
        }
      }
    }

    const fullOpp = await prisma.opportunity.findUnique({
      where: { id },
      include: {
        company: true,
        skills: {
          include: { skill: true },
        },
      },
    });

    return NextResponse.json({ success: true, opportunity: fullOpp });
  } catch (err: any) {
    console.error("Opportunity update error:", err);
    return NextResponse.json({ error: "Failed to update opportunity." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "INDUSTRY" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized. Industry role required." }, { status: 403 });
    }

    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: "Vacancy ID and status are required." }, { status: 400 });
    }

    let company = await prisma.companyProfile.findUnique({
      where: { userId: session.id },
    });

    const existing = await prisma.opportunity.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Vacancy not found." }, { status: 404 });
    }

    if (company && existing.companyId !== company.id && session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized to modify this vacancy." }, { status: 403 });
    }

    const updated = await prisma.opportunity.update({
      where: { id },
      data: { status },
      include: {
        company: true,
        skills: {
          include: { skill: true },
        },
      },
    });

    return NextResponse.json({ success: true, opportunity: updated });
  } catch (err: any) {
    console.error("Opportunity status update error:", err);
    return NextResponse.json({ error: "Failed to update status." }, { status: 500 });
  }
}
