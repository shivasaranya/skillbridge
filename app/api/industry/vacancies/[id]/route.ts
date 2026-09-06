import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

async function getOwnVacancy(session: any, vacancyId: string) {
  const company = await prisma.companyProfile.findUnique({
    where: { userId: session.id },
  });
  if (!company) return null;

  const vacancy = await prisma.opportunity.findFirst({
    where: { id: vacancyId, companyId: company.id },
    include: {
      skills: { include: { skill: true } },
      applications: {
        include: {
          student: {
            include: {
              user: { select: { firstName: true, lastName: true, email: true } },
              skills: { include: { skill: true } },
              institution: { select: { name: true } },
            },
          },
        },
        orderBy: { matchScore: "desc" },
      },
    },
  });
  return vacancy;
}

// GET — fetch single vacancy (own only)
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "INDUSTRY") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const vacancy = await getOwnVacancy(session, params.id);
    if (!vacancy) {
      return NextResponse.json({ error: "Vacancy not found." }, { status: 404 });
    }

    return NextResponse.json({ vacancy });
  } catch (err: any) {
    console.error("Vacancy GET error:", err);
    return NextResponse.json({ error: "Failed to fetch vacancy." }, { status: 500 });
  }
}

// PATCH — update or close vacancy (own only)
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "INDUSTRY") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const company = await prisma.companyProfile.findUnique({
      where: { userId: session.id },
    });
    if (!company) {
      return NextResponse.json({ error: "Company not found." }, { status: 404 });
    }

    // Verify ownership
    const existing = await prisma.opportunity.findFirst({
      where: { id: params.id, companyId: company.id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Vacancy not found or unauthorized." }, { status: 404 });
    }

    const body = await req.json();
    const {
      title, type, workMode, description, responsibilities,
      eligibility, minCgpa, stipendOrSalary, vacancies,
      durationMonths, location, deadline, status, skills,
    } = body;

    const updated = await prisma.opportunity.update({
      where: { id: params.id },
      data: {
        ...(title && { title: String(title).trim() }),
        ...(type && { type }),
        ...(workMode && { workMode }),
        ...(description && { description: String(description).trim() }),
        ...(responsibilities !== undefined && { responsibilities: responsibilities || null }),
        ...(eligibility !== undefined && { eligibility: eligibility || null }),
        ...(minCgpa && { minCgpa: parseFloat(String(minCgpa)) }),
        ...(stipendOrSalary && { stipendOrSalary: String(stipendOrSalary).trim() }),
        ...(vacancies && { vacancies: parseInt(String(vacancies)) }),
        ...(durationMonths !== undefined && { durationMonths: durationMonths ? parseInt(String(durationMonths)) : null }),
        ...(location && { location: String(location).trim() }),
        ...(deadline && { deadline: new Date(deadline) }),
        ...(status && { status }),
      },
    });

    // Update skill associations if provided
    if (skills && Array.isArray(skills)) {
      await prisma.opportunitySkill.deleteMany({ where: { opportunityId: params.id } });
      for (const s of skills) {
        if (s.skillId) {
          await prisma.opportunitySkill.create({
            data: {
              opportunityId: params.id,
              skillId: s.skillId,
              criticality: s.criticality || "MANDATORY",
              weightage: s.weightage || 25,
            },
          });
        }
      }
    }

    return NextResponse.json({ success: true, vacancy: updated });
  } catch (err: any) {
    console.error("Vacancy PATCH error:", err);
    return NextResponse.json({ error: "Failed to update vacancy." }, { status: 500 });
  }
}

// DELETE — delete vacancy if no applications (own only)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "INDUSTRY") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const company = await prisma.companyProfile.findUnique({
      where: { userId: session.id },
    });
    if (!company) return NextResponse.json({ error: "Company not found." }, { status: 404 });

    const existing = await prisma.opportunity.findFirst({
      where: { id: params.id, companyId: company.id },
      include: { _count: { select: { applications: true } } },
    });

    if (!existing) return NextResponse.json({ error: "Vacancy not found." }, { status: 404 });
    if (existing._count.applications > 0) {
      return NextResponse.json(
        { error: "Cannot delete a vacancy that has received applications. Close it instead." },
        { status: 400 }
      );
    }

    await prisma.opportunity.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Vacancy DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete vacancy." }, { status: 500 });
  }
}
