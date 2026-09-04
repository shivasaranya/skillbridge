import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { calculateSkillMatch } from "@/lib/matchingEngine";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let applications: any[] = [];

    if (session.role === "STUDENT") {
      const student = await prisma.studentProfile.findUnique({
        where: { userId: session.id },
      });
      if (student) {
        applications = await prisma.application.findMany({
          where: { studentId: student.id },
          include: {
            opportunity: {
              include: {
                company: true,
              },
            },
            interviews: true,
          },
          orderBy: { appliedAt: "desc" },
        });
      }
    } else if (session.role === "INDUSTRY") {
      const company = await prisma.companyProfile.findUnique({
        where: { userId: session.id },
      });
      if (company) {
        applications = await prisma.application.findMany({
          where: {
            opportunity: {
              companyId: company.id,
            },
          },
          include: {
            opportunity: true,
            student: {
              include: {
                user: true,
                skills: {
                  include: { skill: true },
                },
              },
            },
            interviews: true,
          },
          orderBy: { matchScore: "desc" }, // Ranked by compatibility!
        });
      }
    } else if (session.role === "FACULTY") {
      const faculty = await prisma.facultyProfile.findUnique({
        where: { userId: session.id },
      });
      if (faculty) {
        applications = await prisma.application.findMany({
          where: { facultyId: faculty.id },
          include: {
            opportunity: {
              include: { company: true },
            },
          },
          orderBy: { appliedAt: "desc" },
        });
      }
    } else {
      // Admin / Institution
      applications = await prisma.application.findMany({
        include: {
          opportunity: { include: { company: true } },
          student: { include: { user: true } },
        },
        take: 50,
      });
    }

    return NextResponse.json({ applications });
  } catch (err: any) {
    console.error("Applications GET error:", err);
    return NextResponse.json({ error: "Failed to fetch applications." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Please log in to apply." }, { status: 401 });
    }

    const { opportunityId, coverLetter, resumeUrl } = await req.json();

    if (!opportunityId) {
      return NextResponse.json({ error: "Opportunity ID is required." }, { status: 400 });
    }

    const opp = await prisma.opportunity.findUnique({
      where: { id: opportunityId },
      include: {
        company: true,
        skills: {
          include: { skill: true },
        },
      },
    });

    if (!opp) {
      return NextResponse.json({ error: "Opportunity not found." }, { status: 404 });
    }

    let matchScore = 75.0;

    if (session.role === "STUDENT") {
      const student = await prisma.studentProfile.findUnique({
        where: { userId: session.id },
        include: {
          skills: { include: { skill: true } },
        },
      });

      if (!student) {
        return NextResponse.json({ error: "Student profile not found." }, { status: 404 });
      }

      // Check existing application
      const existing = await prisma.application.findFirst({
        where: {
          opportunityId,
          studentId: student.id,
        },
      });

      if (existing) {
        return NextResponse.json({ error: "You have already applied for this opportunity." }, { status: 400 });
      }

      // Calculate real-time match percentage
      const candidateSkills = student.skills.map((s) => ({
        skillId: s.skillId,
        name: s.skill.name,
        proficiencyLevel: s.proficiencyLevel,
        score: s.proficiencyScore,
      }));

      const requiredSkills = opp.skills.map((os) => ({
        skillId: os.skillId,
        name: os.skill.name,
        criticality: os.criticality,
        weightage: os.weightage,
      }));

      const analysis = calculateSkillMatch(candidateSkills, requiredSkills);
      matchScore = analysis.matchPercentage;

      const app = await prisma.application.create({
        data: {
          opportunityId,
          studentId: student.id,
          coverLetter: coverLetter || null,
          resumeUrl: resumeUrl || student.resumeUrl,
          matchScore,
          status: "APPLIED",
        },
      });

      // Notify Recruiter
      await prisma.notification.create({
        data: {
          userId: opp.company.userId,
          title: `New Candidate Applied (${matchScore}% Match)`,
          message: `${session.firstName} ${session.lastName} applied for ${opp.title}`,
          link: "/dashboard/industry",
          type: "APPLICATION",
        },
      });

      return NextResponse.json({ success: true, application: app, matchScore });
    } else if (session.role === "FACULTY") {
      const faculty = await prisma.facultyProfile.findUnique({
        where: { userId: session.id },
      });

      if (!faculty) {
        return NextResponse.json({ error: "Faculty profile not found." }, { status: 404 });
      }

      const app = await prisma.application.create({
        data: {
          opportunityId,
          facultyId: faculty.id,
          coverLetter: coverLetter || null,
          matchScore: 90.0,
          status: "APPLIED",
        },
      });

      return NextResponse.json({ success: true, application: app });
    }

    return NextResponse.json({ error: "Only students and faculty can apply." }, { status: 403 });
  } catch (err: any) {
    console.error("Apply error:", err);
    return NextResponse.json({ error: "Application failed. Please try again." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "INDUSTRY" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }

    const { applicationId, status, interviewDate, interviewTitle, meetingLink } = await req.json();

    if (!applicationId || !status) {
      return NextResponse.json({ error: "Application ID and status are required." }, { status: 400 });
    }

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: { status },
      include: {
        opportunity: true,
        student: { include: { user: true } },
      },
    });

    // Schedule interview if provided
    if (status === "INTERVIEW" && interviewDate) {
      await prisma.interview.create({
        data: {
          applicationId,
          roundTitle: interviewTitle || "Technical & Skill Assessment Round",
          scheduledAt: new Date(interviewDate),
          meetingLink: meetingLink || "https://meet.google.com/sb-interview",
          status: "SCHEDULED",
        },
      });
    }

    // Notify Student
    if (updated.student) {
      await prisma.notification.create({
        data: {
          userId: updated.student.userId,
          title: `Application Status: ${status}`,
          message: `Your application for ${updated.opportunity.title} is now ${status}.`,
          link: "/dashboard/student",
          type: "APPLICATION",
        },
      });
    }

    return NextResponse.json({ success: true, application: updated });
  } catch (err: any) {
    console.error("Update application error:", err);
    return NextResponse.json({ error: "Failed to update application." }, { status: 500 });
  }
}
