import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/student/dashboard — aggregated dashboard data
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const student = await prisma.studentProfile.findUnique({
      where: { userId: session.id },
      include: {
        user: { select: { firstName: true, lastName: true, email: true, avatarUrl: true } },
        institution: { select: { name: true, city: true, state: true } },
        skills: {
          include: { skill: { include: { category: true } } },
          orderBy: { updatedAt: "desc" },
        },
        certifications: { orderBy: { issueDate: "desc" }, take: 5 },
        projects: { orderBy: { createdAt: "desc" }, take: 4 },
        achievements: { orderBy: { date: "desc" }, take: 5 },
        applications: {
          include: {
            opportunity: {
              include: { company: { select: { companyName: true, logoUrl: true } } },
            },
            interviews: { orderBy: { scheduledAt: "asc" }, take: 1 },
          },
          orderBy: { appliedAt: "desc" },
          take: 5,
        },
        profileVisibility: true,
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
    }

    // Fetch recommended opportunities with skill matching
    const opportunities = await prisma.opportunity.findMany({
      where: { status: "OPEN" },
      include: {
        company: { select: { companyName: true, logoUrl: true, domain: true } },
        skills: { include: { skill: true } },
      },
      orderBy: { deadline: "asc" },
      take: 8,
    });

    // Compute match scores
    const studentSkillNames = new Set(
      student.skills.map((ss) => ss.skill.name.toLowerCase())
    );
    const oppWithMatch = opportunities.map((opp) => {
      const totalSkills = opp.skills.length;
      if (totalSkills === 0) return { ...opp, matchScore: 95 };
      const matched = opp.skills.filter((os) =>
        studentSkillNames.has(os.skill.name.toLowerCase())
      ).length;
      const matchScore = Math.round((matched / totalSkills) * 100);
      return { ...opp, matchScore };
    });

    // Sort by match score desc
    oppWithMatch.sort((a, b) => b.matchScore - a.matchScore);

    // Fetch upcoming events
    const events = await prisma.event.findMany({
      where: { isActive: true, date: { gte: new Date() } },
      orderBy: { date: "asc" },
      take: 6,
    });

    // Fetch learning resources recommended for skill gaps
    const studentSkillIds = new Set(student.skills.map((ss) => ss.skillId));
    const recommendedResources = await prisma.learningResource.findMany({
      where: {
        skillId: { notIn: Array.from(studentSkillIds) as string[] },
      },
      include: { skill: true },
      take: 6,
    });

    // Fetch notifications
    const notifications = await prisma.notification.findMany({
      where: { userId: session.id, isRead: false },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    // Compute profile completion
    const completionItems = [
      student.headline,
      student.summary,
      student.department,
      student.degree,
      student.graduationYear,
      student.institution,
      student.skills.length > 0,
      student.certifications.length > 0,
      student.projects.length > 0,
      student.resumeUrl,
      student.linkedinUrl || student.githubUrl,
    ];
    const completed = completionItems.filter(Boolean).length;
    const profileCompletion = Math.round((completed / completionItems.length) * 100);

    // Verified skills count
    const verifiedSkills = student.skills.filter(
      (ss) => ss.verificationLevel !== "SELF_DECLARED"
    ).length;

    return NextResponse.json({
      student: {
        ...student,
        profileCompletion,
        verifiedSkillsCount: verifiedSkills,
        matchingOpportunitiesCount: oppWithMatch.filter((o) => o.matchScore >= 60).length,
      },
      opportunities: oppWithMatch.slice(0, 4),
      nextDrive: oppWithMatch[0] || null,
      events,
      recommendedResources,
      notifications,
      unreadNotifications: notifications.length,
    });
  } catch (err) {
    console.error("[dashboard]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
