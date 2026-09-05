import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword, signSessionToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, phone, role, ...roleData } = body;

    const normalizedRole = (role || "").trim().toUpperCase();

    if (!email || !password || !normalizedRole) {
      return NextResponse.json(
        { error: "Email, password, and domain role are required." },
        { status: 400 }
      );
    }

    // Determine First and Last Names with robust handling for fullName / contactPerson
    let firstName = (body.firstName || "").trim();
    let lastName = (body.lastName || "").trim();

    if (!firstName && roleData.fullName) {
      const parts = roleData.fullName.trim().split(/\s+/);
      firstName = parts[0] || "User";
      lastName = parts.slice(1).join(" ") || "";
    } else if (!firstName && roleData.contactPersonName) {
      const parts = roleData.contactPersonName.trim().split(/\s+/);
      firstName = parts[0] || "Partner";
      lastName = parts.slice(1).join(" ") || "";
    } else if (!firstName && roleData.contactPerson) {
      const parts = roleData.contactPerson.trim().split(/\s+/);
      firstName = parts[0] || "Partner";
      lastName = parts.slice(1).join(" ") || "";
    } else if (!firstName && roleData.companyName) {
      firstName = roleData.companyName.trim();
      lastName = "Representative";
    }

    if (!firstName) {
      firstName = "Member";
    }
    if (!lastName) {
      lastName = "";
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email address already exists. Please Sign In." },
        { status: 400 }
      );
    }

    // Parse location if provided as "City, State"
    let parsedCity = (roleData.city || "").trim();
    let parsedState = (roleData.state || "").trim();
    if (roleData.location && typeof roleData.location === "string") {
      const locParts = roleData.location.split(",").map((s: string) => s.trim());
      if (locParts.length > 1) {
        parsedCity = locParts[0] || parsedCity;
        parsedState = locParts.slice(1).join(", ") || parsedState;
      } else if (locParts[0]) {
        parsedCity = locParts[0];
      }
    }

    const passwordHash = await hashPassword(password);

    // Create User
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        passwordHash,
        firstName,
        lastName,
        phone: phone || null,
        role: normalizedRole,
      },
    });

    // Create Domain Specific Profile
    if (normalizedRole === "STUDENT") {
      await prisma.studentProfile.create({
        data: {
          userId: user.id,
          collegeName: roleData.college || roleData.collegeName || roleData.institution || null,
          department: roleData.department || roleData.branch || "Allied Sciences",
          degree: roleData.degree || "Undergraduate Degree",
          graduationYear: parseInt(roleData.graduationYear) || 2026,
          rollNumber: roleData.rollNumber || null,
          cgpa: parseFloat(roleData.cgpa) || 8.0,
          readinessScore: 75,
        },
      });
    } else if (normalizedRole === "FACULTY") {
      await prisma.facultyProfile.create({
        data: {
          userId: user.id,
          institutionName: roleData.institution || roleData.institutionName || null,
          department: roleData.department || "Academic Faculty",
          designation: roleData.designation || "Assistant Professor",
          experienceYears: parseInt(roleData.experienceYears) || 5,
          specialization: roleData.areasOfExpertise || roleData.specialization || "Higher Education & Research",
          researchDomains: roleData.areasOfExpertise || roleData.researchDomains || null,
        },
      });
    } else if (normalizedRole === "INDUSTRY") {
      await prisma.companyProfile.create({
        data: {
          userId: user.id,
          companyName: roleData.companyName || roleData.organizationName || `${firstName}'s Enterprise`,
          domain: roleData.domain || roleData.industry || roleData.sector || "HEALTH_TECH",
          website: roleData.companyWebsite || roleData.website || null,
          city: parsedCity || "Bengaluru",
          state: parsedState || "Karnataka",
          description: roleData.companyDescription || roleData.description || null,
          contactPerson: roleData.contactPersonName || roleData.contactPerson || `${firstName} ${lastName}`.trim(),
          contactDesignation: roleData.contactPersonDesignation || roleData.contactDesignation || null,
          size: roleData.size || "ENTERPRISE",
          isVerified: true,
        },
      });
    } else if (normalizedRole === "INSTITUTION") {
      await prisma.institutionProfile.create({
        data: {
          userId: user.id,
          name: roleData.institutionName || `${firstName} University`,
          aisheCode: roleData.aisheCode || `U-${Math.floor(1000 + Math.random() * 9000)}`,
          type: roleData.institutionType || roleData.type || "STATE_UNIVERSITY",
          designation: roleData.designation || "Dean / TPO Officer",
          city: parsedCity || "New Delhi",
          state: parsedState || "Delhi",
          isVerified: true,
        },
      });
    }

    const companyName = normalizedRole === "INDUSTRY"
      ? (roleData.companyName || roleData.organizationName || `${firstName}'s Enterprise`)
      : undefined;

    const sessionPayload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role as any,
      companyName,
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

