import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { ALL_OPPORTUNITIES, JOBS_DATA, INTERNSHIPS_DATA } from "@/lib/opportunitiesData";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type     = searchParams.get("type");
    const search   = searchParams.get("search") || searchParams.get("q") || "";
    const workMode = searchParams.get("workMode");

    // ── Try Prisma DB first ──────────────────────────────────────────────────
    let dbOpportunities: any[] = [];
    try {
      const where: any = { status: "OPEN" };
      if (type     && type !== "ALL")     where.type     = type;
      if (workMode && workMode !== "ALL") where.workMode = workMode;
      if (search) {
        where.OR = [
          { title:       { contains: search } },
          { description: { contains: search } },
          { company:     { companyName: { contains: search } } },
        ];
      }

      dbOpportunities = await prisma.opportunity.findMany({
        where,
        include: {
          company: true,
          skills: { include: { skill: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    } catch {
      // DB unavailable — fall through to curated dataset
    }

    // If DB has real entries, return them (with applyUrl from company website)
    if (dbOpportunities.length > 0) {
      const enriched = dbOpportunities.map((opp) => ({
        ...opp,
        matchScore: 70,
        applyUrl: opp.company?.website ?? `https://www.ncs.gov.in/Pages/Search.aspx`,
      }));
      return NextResponse.json({ opportunities: enriched });
    }

    // ── Fallback: curated real dataset ───────────────────────────────────────
    let curated = type === "JOB"
      ? JOBS_DATA
      : type === "INTERNSHIP"
      ? INTERNSHIPS_DATA
      : ALL_OPPORTUNITIES;

    if (workMode && workMode !== "ALL") {
      curated = curated.filter((o) => o.workMode === workMode);
    }
    if (search) {
      const q = search.toLowerCase();
      curated = curated.filter((o) =>
        o.title.toLowerCase().includes(q) ||
        o.company.companyName.toLowerCase().includes(q) ||
        o.location.toLowerCase().includes(q) ||
        o.skills.some((s) => s.skill.name.toLowerCase().includes(q))
      );
    }

    // Normalise shape to match what the UI expects
    const opportunities = curated.map((o) => ({
      id:             o.id,
      title:          o.title,
      type:           o.type,
      workMode:       o.workMode,
      location:       o.location,
      stipendOrSalary:o.stipendOrSalary,
      deadline:       o.deadline,
      postedDate:     o.postedDate,
      description:    o.description,
      eligibility:    o.eligibility,
      minCgpa:        o.minCgpa,
      vacancies:      o.vacancies,
      durationMonths: o.durationMonths,
      matchScore:     o.matchScore,
      applyUrl:       o.applyUrl,
      badge:          o.badge,
      badgeColor:     o.badgeColor,
      company:        { companyName: o.company.companyName, domain: o.company.domain },
      skills:         o.skills,
    }));

    return NextResponse.json({ opportunities });
  } catch (err: any) {
    console.error("Opportunities fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch opportunities." }, { status: 500 });
  }
}

// POST — industry/admin only, unchanged
export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "INDUSTRY" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized. Industry role required." }, { status: 403 });
    }

    const body = await req.json();
    const {
      title, type, workMode, description, responsibilities,
      eligibility, minCgpa, stipendOrSalary, vacancies,
      durationMonths, location, deadline, skills,
    } = body;

    let company = await prisma.companyProfile.findUnique({ where: { userId: session.id } });
    if (!company) {
      company = await prisma.companyProfile.findFirst();
      if (!company) {
        return NextResponse.json({ error: "Company profile not found." }, { status: 404 });
      }
    }

    const opp = await prisma.opportunity.create({
      data: {
        companyId:       company.id,
        title,
        type:            type || "INTERNSHIP",
        workMode:        workMode || "ONSITE",
        description,
        responsibilities,
        eligibility,
        minCgpa:         parseFloat(minCgpa) || 6.5,
        stipendOrSalary: stipendOrSalary || "₹25,000 / month",
        vacancies:       parseInt(vacancies) || 1,
        durationMonths:  durationMonths ? parseInt(durationMonths) : null,
        location:        location || "Remote / Hybrid",
        deadline:        deadline ? new Date(deadline) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    if (skills && Array.isArray(skills)) {
      for (const s of skills) {
        if (s.skillId) {
          await prisma.opportunitySkill.create({
            data: {
              opportunityId: opp.id,
              skillId:       s.skillId,
              criticality:   s.criticality || "MANDATORY",
              weightage:     s.weightage || 25,
            },
          });
        }
      }
    }

    return NextResponse.json({ success: true, opportunity: opp });
  } catch (err: any) {
    console.error("Opportunity create error:", err);
    return NextResponse.json({ error: "Failed to create opportunity." }, { status: 500 });
  }
}
