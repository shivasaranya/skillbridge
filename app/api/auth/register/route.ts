import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword, signSessionToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, firstName, lastName, phone, role, ...roleData } = body;

    if (!email || !password || !firstName || !lastName || !role) {
      return NextResponse.json(
        { error: "Please fill in all mandatory fields." },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email address already exists." },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    // Create User
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        passwordHash,
        firstName,
        lastName,
        phone,
        role,
      },
    });

    // Create Role Profile
    if (role === "STUDENT") {
      await prisma.studentProfile.create({
        data: {
          userId: user.id,
          department: roleData.department || "Allied Sciences",
          degree: roleData.degree || "Undergraduate Degree",
          graduationYear: parseInt(roleData.graduationYear) || 2026,
          rollNumber: roleData.rollNumber || null,
          cgpa: parseFloat(roleData.cgpa) || 8.0,
          readinessScore: 70,
        },
      });
    } else if (role === "FACULTY") {
      await prisma.facultyProfile.create({
        data: {
          userId: user.id,
          department: roleData.department || "Academic Department",
          designation: roleData.designation || "Assistant Professor",
          experienceYears: parseInt(roleData.experienceYears) || 3,
          specialization: roleData.specialization || "Higher Education & Research",
        },
      });
    } else if (role === "INDUSTRY") {
      await prisma.companyProfile.create({
        data: {
          userId: user.id,
          companyName: roleData.companyName || `${firstName}'s Enterprise`,
          domain: roleData.domain || "HEALTH_TECH",
          website: roleData.website || null,
          size: roleData.size || "ENTERPRISE",
          isVerified: false,
        },
      });
    } else if (role === "INSTITUTION") {
      await prisma.institutionProfile.create({
        data: {
          userId: user.id,
          name: roleData.institutionName || `${firstName} University`,
          aisheCode: roleData.aisheCode || `U-${Math.floor(1000 + Math.random() * 9000)}`,
          type: roleData.type || "STATE_UNIVERSITY",
          city: roleData.city || "New Delhi",
          state: roleData.state || "Delhi",
          isVerified: true,
        },
      });
    }

    const sessionPayload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role as any,
    };

    const token = signSessionToken(sessionPayload);
    const response = NextResponse.json({ success: true, user: sessionPayload });

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
    console.error("Registration error:", err);
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
