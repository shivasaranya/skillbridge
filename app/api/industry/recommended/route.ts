import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { matchStudentsToVacancy } from "@/lib/industryMatchingEngine";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "INDUSTRY") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const company = await prisma.companyProfile.findUnique({
      where: { userId: session.id },
    });
    if (!company) return NextResponse.json({ recommendations: [] });

    const { searchParams } = new URL(req.url);
    const vacancyId = searchParams.get("vacancyId");

    if (!vacancyId) {
      return NextResponse.json({ error: "vacancyId is required." }, { status: 400 });
    }

    // Verify vacancy belongs to this company
    const vacancy = await prisma.opportunity.findFirst({
      where: { id: vacancyId, companyId: company.id },
      include: {
        skills: { include: { skill: true } },
      },
    });

    if (!vacancy) {
      return NextResponse.json({ error: "Vacancy not found." }, { status: 404 });
    }

    // Build vacancy requirements from DB data
    const requiredSkillIds = vacancy.skills.map((s) => s.skillId);
    const requiredSkillNames = vacancy.skills.map((s) => s.skill.name);

    // Get students who already applied (to mark them)
    const appliedApplications = await prisma.application.findMany({
      where: { opportunityId: vacancyId, studentId: { not: null } },
      select: { studentId: true },
    });
    const appliedStudentIds = new Set(
      appliedApplications.map((a) => a.studentId).filter(Boolean) as string[]
    );

    // Fetch ALL students with their skills from the real DB
    const students = await prisma.studentProfile.findMany({
      where: { placementStatus: { not: "PLACED" } }, // Only seeking/interning students
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        skills: {
          include: { skill: true },
          where: { verificationStatus: { in: ["PENDING", "VERIFIED"] } },
        },
        certifications: { select: { title: true, issuingBody: true } },
        institution: { select: { name: true, city: true } },
        profileVisibility: true,
      },
      take: 200, // Limit for performance
    });

    // Filter: only show students whose profile is public
    const visibleStudents = students.filter((s) => {
      const vis = s.profileVisibility;
      return !vis || vis.profilePublic !== false;
    });

    // Run real matching
    const results = matchStudentsToVacancy(
      {
        requiredSkillIds,
        requiredSkillNames,
        minCgpa: vacancy.minCgpa ?? undefined,
        type: vacancy.type,
      },
      visibleStudents.map((s) => ({
        id: s.id,
        userId: s.userId,
        degree: s.degree,
        department: s.department,
        graduationYear: s.graduationYear,
        cgpa: s.cgpa,
        headline: s.headline,
        resumeUrl: s.resumeUrl,
        githubUrl: s.githubUrl,
        linkedinUrl: s.linkedinUrl,
        portfolioUrl: s.portfolioUrl,
        placementStatus: s.placementStatus,
        user: s.user,
        skills: s.skills,
        certifications: s.certifications,
        institution: s.institution,
      })),
      appliedStudentIds,
      10 // min score threshold
    );

    return NextResponse.json({
      recommendations: results,
      vacancyTitle: vacancy.title,
      totalStudents: visibleStudents.length,
    });
  } catch (err: any) {
    console.error("Recommendations GET error:", err);
    return NextResponse.json({ error: "Failed to fetch recommendations." }, { status: 500 });
  }
}
