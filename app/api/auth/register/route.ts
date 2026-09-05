import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword, signSessionToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: Request) {
  let step = "parsing body";
  try {
    const body = await req.json();
    const {
      email, password, firstName, lastName, phone, role,
      department, degree, graduationYear, rollNumber, cgpa, activeBacklogs,
      dateOfBirth, gender, admissionYear, currentYear, currentSemester,
      institutionName, institutionType, institutionCity, institutionState,
      affiliatedUniversity, collegeEmail,
      designation, companyName, domainField,
    } = body;

    if (!email || !password || !firstName || !lastName || !role) {
      return NextResponse.json({ error: "Please fill in all mandatory fields." }, { status: 400 });
    }

    step = "checking existing user";
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 400 });
    }

    step = "hashing password";
    const passwordHash = await hashPassword(password);

    step = "creating user";
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        passwordHash,
        firstName: String(firstName).trim(),
        lastName: String(lastName).trim(),
        phone: phone ? String(phone).trim() : null,
        role: String(role),
      },
    });

    if (role === "STUDENT") {
      step = "finding institution";
      let institutionId: string | null = null;
      if (institutionName) {
        try {
          const inst = await prisma.institutionProfile.findFirst({
            where: { name: { contains: String(institutionName).trim() } },
            select: { id: true },
          });
          institutionId = inst?.id ?? null;
        } catch {
          // institution lookup failure is non-fatal
          institutionId = null;
        }
      }

      step = "creating student profile";
      const gradYearParsed = graduationYear ? parseInt(String(graduationYear)) : 2027;
      await prisma.studentProfile.create({
        data: {
          userId: user.id,
          institutionId,
          department: department ? String(department).trim() : "General",
          degree: degree ? String(degree).trim() : "Undergraduate",
          graduationYear: isNaN(gradYearParsed) ? 2027 : gradYearParsed,
          rollNumber: rollNumber ? String(rollNumber).trim() : null,
          cgpa: cgpa ? parseFloat(String(cgpa)) : 8.0,
          activeBacklogs: activeBacklogs ? parseInt(String(activeBacklogs)) : 0,
          dateOfBirth: dateOfBirth ? String(dateOfBirth) : null,
          gender: gender ? String(gender) : null,
          admissionYear: admissionYear ? parseInt(String(admissionYear)) : null,
          currentYear: currentYear ? String(currentYear) : null,
          currentSemester: currentSemester ? parseInt(String(currentSemester)) : null,
          readinessScore: 30,
          profileCompletion: 25,
          placementStatus: "SEEKING",
        },
      });

      step = "creating notifications";
      // Use individual creates to avoid issues with createMany
      await prisma.notification.create({
        data: {
          userId: user.id,
          title: "Welcome to SkillBridge! 🎉",
          message: "Your account is set up. Start by adding your skills and completing your profile.",
          type: "INFO",
          link: "/student/profile",
        },
      });
      await prisma.notification.create({
        data: {
          userId: user.id,
          title: "Complete your profile",
          message: "A complete profile gets 5x more visibility from recruiters. Add your skills and projects.",
          type: "INFO",
          link: "/student/profile",
        },
      });

    } else if (role === "FACULTY") {
      step = "creating faculty profile";
      await prisma.facultyProfile.create({
        data: {
          userId: user.id,
          department: department ? String(department) : "Academic Department",
          designation: designation ? String(designation) : "Assistant Professor",
        },
      });
    } else if (role === "INDUSTRY") {
      step = "creating company profile";
      await prisma.companyProfile.create({
        data: {
          userId: user.id,
          companyName: companyName ? String(companyName) : `${firstName}'s Company`,
          domain: domainField ? String(domainField) : "IT_SERVICES",
          isVerified: false,
        },
      });
    }

    step = "signing session token";
    const sessionPayload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role as any,
    };

    const token = signSessionToken(sessionPayload);

    step = "building response";
    const response = NextResponse.json({ success: true, user: sessionPayload }, { status: 201 });
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
      sameSite: "lax",
    });

    return response;
  } catch (err: any) {
    console.error(`[REGISTER] Failed at step="${step}":`, err?.message || err);
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
