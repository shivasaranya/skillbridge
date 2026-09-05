import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET — fetch all applications to own vacancies
export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "INDUSTRY") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const company = await prisma.companyProfile.findUnique({
      where: { userId: session.id },
    });
    if (!company) return NextResponse.json({ applicants: [] });

    const { searchParams } = new URL(req.url);
    const vacancyId = searchParams.get("vacancyId");
    const status = searchParams.get("status");

    const where: any = {
      opportunity: { companyId: company.id },
      studentId: { not: null }, // Only student applications
    };
    if (vacancyId && vacancyId !== "ALL") where.opportunityId = vacancyId;
    if (status && status !== "ALL") where.status = status;

    const applicants = await prisma.application.findMany({
      where,
      include: {
        opportunity: { select: { id: true, title: true, type: true, location: true } },
        student: {
          include: {
            user: { select: { firstName: true, lastName: true, email: true } },
            skills: { include: { skill: true } },
            certifications: { select: { title: true, issuingBody: true } },
            institution: { select: { name: true, city: true } },
          },
        },
        interviews: true,
      },
      orderBy: { matchScore: "desc" },
    });

    return NextResponse.json({ applicants });
  } catch (err: any) {
    console.error("Industry applicants GET error:", err);
    return NextResponse.json({ error: "Failed to fetch applicants." }, { status: 500 });
  }
}

// PATCH — update application status (shortlist/reject) — own company only
export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "INDUSTRY") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const company = await prisma.companyProfile.findUnique({
      where: { userId: session.id },
    });
    if (!company) return NextResponse.json({ error: "Company not found." }, { status: 404 });

    const { applicationId, status } = await req.json();
    if (!applicationId || !status) {
      return NextResponse.json({ error: "Application ID and status required." }, { status: 400 });
    }

    const allowedStatuses = ["APPLIED", "REVIEWING", "SHORTLISTED", "INTERVIEW", "SELECTED", "REJECTED"];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }

    // Verify ownership: ensure application belongs to this company's opportunity
    const app = await prisma.application.findFirst({
      where: {
        id: applicationId,
        opportunity: { companyId: company.id },
      },
      include: {
        opportunity: true,
        student: { include: { user: true } },
      },
    });

    if (!app) {
      return NextResponse.json({ error: "Application not found or unauthorized." }, { status: 404 });
    }

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: { status },
    });

    // Notify student
    if (app.student?.userId) {
      await prisma.notification.create({
        data: {
          userId: app.student.userId,
          title: `Application Update: ${status}`,
          message: `Your application for "${app.opportunity.title}" has been ${status.toLowerCase()}.`,
          link: "/student/applications",
          type: "APPLICATION",
        },
      });
    }

    return NextResponse.json({ success: true, application: updated });
  } catch (err: any) {
    console.error("Industry applicant PATCH error:", err);
    return NextResponse.json({ error: "Failed to update application." }, { status: 500 });
  }
}
