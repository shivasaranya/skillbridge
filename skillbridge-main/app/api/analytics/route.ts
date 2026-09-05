import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const totalStudents = await prisma.studentProfile.count();
    const totalFaculty = await prisma.facultyProfile.count();
    const totalCompanies = await prisma.companyProfile.count();
    const totalOpportunities = await prisma.opportunity.count();
    const totalApplications = await prisma.application.count();

    const placedStudents = await prisma.studentProfile.count({
      where: { placementStatus: "PLACED" },
    });
    const interningStudents = await prisma.studentProfile.count({
      where: { placementStatus: "INTERNING" },
    });
    const seekingStudents = await prisma.studentProfile.count({
      where: { placementStatus: "SEEKING" },
    });

    const students = await prisma.studentProfile.findMany({
      select: { readinessScore: true },
    });

    let excellentReadiness = 0;
    let goodReadiness = 0;
    let needsImprovementReadiness = 0;

    for (const s of students) {
      if (s.readinessScore >= 85) excellentReadiness++;
      else if (s.readinessScore >= 70) goodReadiness++;
      else needsImprovementReadiness++;
    }

    // Top In-Demand Skills vs Acquired
    const skills = await prisma.skill.findMany({
      include: {
        _count: {
          select: {
            opportunitySkills: true,
            studentSkills: true,
          },
        },
      },
      orderBy: {
        demandWeight: "desc",
      },
      take: 6,
    });

    const skillAnalytics = skills.map((s) => ({
      name: s.name.length > 25 ? s.name.substring(0, 22) + "..." : s.name,
      industryDemand: s._count.opportunitySkills * 25 + Math.round(s.demandWeight * 15),
      studentCompetency: s._count.studentSkills * 35 + 20,
    }));

    // Active MoUs
    const collaborations = await prisma.collaboration.findMany({
      include: {
        institution: true,
        company: true,
      },
      take: 5,
    });

    // Recent applications for recruiter funnel
    const appsByStatus = await prisma.application.groupBy({
      by: ["status"],
      _count: { _all: true },
    });

    const funnelData = [
      { stage: "Applied", count: totalApplications },
      { stage: "Shortlisted", count: appsByStatus.find((a) => a.status === "SHORTLISTED")?._count._all || 0 },
      { stage: "Interview", count: appsByStatus.find((a) => a.status === "INTERVIEW")?._count._all || 0 },
      { stage: "Selected", count: appsByStatus.find((a) => a.status === "SELECTED")?._count._all || 0 },
    ];

    return NextResponse.json({
      metrics: {
        totalStudents,
        totalFaculty,
        totalCompanies,
        totalOpportunities,
        totalApplications,
        placedStudents,
        interningStudents,
        seekingStudents,
        placementRate: totalStudents > 0 ? Math.round(((placedStudents + interningStudents) / totalStudents) * 100) : 0,
      },
      readinessDistribution: [
        { name: "Excellent (85-100)", value: excellentReadiness, color: "#10b981" },
        { name: "Good (70-84)", value: goodReadiness, color: "#3b82f6" },
        { name: "Needs Improvement (<70)", value: needsImprovementReadiness, color: "#f59e0b" },
      ],
      skillAnalytics,
      collaborations,
      funnelData,
    });
  } catch (err: any) {
    console.error("Analytics API error:", err);
    return NextResponse.json({ error: "Failed to generate analytics." }, { status: 500 });
  }
}
