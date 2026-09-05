import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || (session.role !== "INDUSTRY" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized. Industry role required." }, { status: 401 });
    }

    let company = await prisma.companyProfile.findUnique({
      where: { userId: session.id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            avatarUrl: true,
            role: true,
            createdAt: true,
          },
        },
        opportunities: {
          include: {
            skills: {
              include: {
                skill: true,
              },
            },
            applications: true,
          },
          orderBy: { createdAt: "desc" },
        },
        collaborations: {
          include: {
            institution: true,
          },
        },
      },
    });

    if (!company) {
      // Fallback in case of missing profile for demo / admin
      company = await prisma.companyProfile.findFirst({
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
              avatarUrl: true,
              role: true,
              createdAt: true,
            },
          },
          opportunities: {
            include: {
              skills: {
                include: {
                  skill: true,
                },
              },
              applications: true,
            },
            orderBy: { createdAt: "desc" },
          },
          collaborations: {
            include: {
              institution: true,
            },
          },
        },
      });

      if (!company) {
        return NextResponse.json({ error: "Company profile not found." }, { status: 404 });
      }
    }

    // Compute metrics
    const totalVacancies = company.opportunities.length;
    const openVacancies = company.opportunities.filter((o) => o.status === "OPEN").length;
    const allApplications = company.opportunities.flatMap((o) => o.applications);
    const totalApplicants = allApplications.length;
    const shortlistedCount = allApplications.filter((a) => a.status === "SHORTLISTED").length;
    const interviewCount = allApplications.filter((a) => a.status === "INTERVIEW").length;
    const selectedCount = allApplications.filter((a) => a.status === "SELECTED").length;

    const metrics = {
      totalVacancies,
      openVacancies,
      totalApplicants,
      shortlistedCount,
      interviewCount,
      selectedCount,
    };

    return NextResponse.json({ company, metrics });
  } catch (err: any) {
    console.error("Fetch industry profile error:", err);
    return NextResponse.json({ error: "Failed to fetch industry profile." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "INDUSTRY" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized. Industry role required." }, { status: 401 });
    }

    const body = await req.json();
    const {
      companyName,
      domain,
      website,
      city,
      state,
      contactPerson,
      contactDesignation,
      description,
      phone,
    } = body;

    let company = await prisma.companyProfile.findUnique({
      where: { userId: session.id },
    });

    if (!company) {
      return NextResponse.json({ error: "Company profile not found." }, { status: 404 });
    }

    // Update CompanyProfile
    const updatedCompany = await prisma.companyProfile.update({
      where: { id: company.id },
      data: {
        companyName: companyName !== undefined ? companyName : company.companyName,
        domain: domain !== undefined ? domain : company.domain,
        website: website !== undefined ? website : company.website,
        city: city !== undefined ? city : company.city,
        state: state !== undefined ? state : company.state,
        contactPerson: contactPerson !== undefined ? contactPerson : company.contactPerson,
        contactDesignation: contactDesignation !== undefined ? contactDesignation : company.contactDesignation,
        description: description !== undefined ? description : company.description,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            role: true,
          },
        },
      },
    });

    // Update User phone if provided
    if (phone !== undefined) {
      await prisma.user.update({
        where: { id: session.id },
        data: { phone },
      });
    }

    return NextResponse.json({ success: true, company: updatedCompany });
  } catch (err: any) {
    console.error("Update industry profile error:", err);
    return NextResponse.json({ error: "Failed to update industry profile." }, { status: 500 });
  }
}
