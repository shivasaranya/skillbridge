import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET — fetch own company profile
export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "INDUSTRY") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const company = await prisma.companyProfile.findUnique({
      where: { userId: session.id },
      include: { user: { select: { email: true, phone: true, firstName: true, lastName: true } } },
    });

    if (!company) {
      return NextResponse.json({ error: "Company profile not found." }, { status: 404 });
    }

    return NextResponse.json({ company });
  } catch (err: any) {
    console.error("Industry profile GET error:", err);
    return NextResponse.json({ error: "Failed to fetch profile." }, { status: 500 });
  }
}

// PATCH — update own company profile
export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "INDUSTRY") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      companyName, domain, website, description,
      city, state, phone, contactPerson, size,
    } = body;

    const company = await prisma.companyProfile.update({
      where: { userId: session.id },
      data: {
        ...(companyName && { companyName: String(companyName).trim() }),
        ...(domain && { domain: String(domain).trim() }),
        ...(website !== undefined && { website: website ? String(website).trim() : null }),
        ...(description !== undefined && { description: description ? String(description).trim() : null }),
        ...(city !== undefined && { city: city ? String(city).trim() : null }),
        ...(state !== undefined && { state: state ? String(state).trim() : null }),
        ...(phone !== undefined && { phone: phone ? String(phone).trim() : null }),
        ...(contactPerson !== undefined && { contactPerson: contactPerson ? String(contactPerson).trim() : null }),
        ...(size && { size: String(size) }),
      },
    });

    // Also update user phone if provided
    if (phone !== undefined) {
      await prisma.user.update({
        where: { id: session.id },
        data: { phone: phone ? String(phone).trim() : null },
      });
    }

    return NextResponse.json({ success: true, company });
  } catch (err: any) {
    console.error("Industry profile PATCH error:", err);
    return NextResponse.json({ error: "Failed to update profile." }, { status: 500 });
  }
}
