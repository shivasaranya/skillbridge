import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/student/profile
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const student = await prisma.studentProfile.findUnique({
      where: { userId: session.id },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            avatarUrl: true,
            phone: true,
            createdAt: true,
          },
        },
        institution: true,
        skills: { include: { skill: { include: { category: true } } }, orderBy: { updatedAt: "desc" } },
        certifications: { orderBy: { issueDate: "desc" } },
        projects: { orderBy: { createdAt: "desc" } },
        achievements: { orderBy: { date: "desc" } },
        profileVisibility: true,
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ student });
  } catch (err) {
    console.error("[profile GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/student/profile
export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Allowed fields to update
    const {
      headline, summary, careerInterests, preferredRoles, preferredIndustries,
      preferredLocations, internshipPref, employmentPref,
      linkedinUrl, githubUrl, portfolioUrl, leetcodeUrl, hackerrankUrl,
      codechefUrl, codeforcesUrl, kaggleUrl,
      cgpa, activeBacklogs, currentYear, currentSemester,
      dateOfBirth, gender,
    } = body;

    const updated = await prisma.studentProfile.update({
      where: { userId: session.id },
      data: {
        ...(headline !== undefined && { headline }),
        ...(summary !== undefined && { summary }),
        ...(careerInterests !== undefined && { careerInterests: JSON.stringify(careerInterests) }),
        ...(preferredRoles !== undefined && { preferredRoles: JSON.stringify(preferredRoles) }),
        ...(preferredIndustries !== undefined && { preferredIndustries: JSON.stringify(preferredIndustries) }),
        ...(preferredLocations !== undefined && { preferredLocations: JSON.stringify(preferredLocations) }),
        ...(internshipPref !== undefined && { internshipPref }),
        ...(employmentPref !== undefined && { employmentPref }),
        ...(linkedinUrl !== undefined && { linkedinUrl }),
        ...(githubUrl !== undefined && { githubUrl }),
        ...(portfolioUrl !== undefined && { portfolioUrl }),
        ...(leetcodeUrl !== undefined && { leetcodeUrl }),
        ...(hackerrankUrl !== undefined && { hackerrankUrl }),
        ...(codechefUrl !== undefined && { codechefUrl }),
        ...(codeforcesUrl !== undefined && { codeforcesUrl }),
        ...(kaggleUrl !== undefined && { kaggleUrl }),
        ...(cgpa !== undefined && { cgpa: parseFloat(cgpa) }),
        ...(activeBacklogs !== undefined && { activeBacklogs: parseInt(activeBacklogs) }),
        ...(currentYear !== undefined && { currentYear }),
        ...(currentSemester !== undefined && { currentSemester: parseInt(currentSemester) }),
        ...(dateOfBirth !== undefined && { dateOfBirth }),
        ...(gender !== undefined && { gender }),
      },
    });

    return NextResponse.json({ student: updated });
  } catch (err) {
    console.error("[profile PATCH]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
