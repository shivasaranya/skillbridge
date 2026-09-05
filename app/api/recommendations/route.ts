import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { calculateSkillMatch } from "@/lib/matchingEngine";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "INDUSTRY" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized. Industry role required." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    let opportunityId = searchParams.get("opportunityId");

    // Find company profile
    let company = await prisma.companyProfile.findUnique({
      where: { userId: session.id },
    });

    if (!company) {
      company = await prisma.companyProfile.findFirst();
      if (!company) {
        return NextResponse.json({ error: "Company profile not found." }, { status: 404 });
      }
    }

    // If opportunityId not provided, default to the latest active opportunity for this company
    let opportunity = null;
    if (opportunityId) {
      opportunity = await prisma.opportunity.findUnique({
        where: { id: opportunityId },
        include: {
          skills: {
            include: { skill: true },
          },
          company: true,
        },
      });
    } else {
      opportunity = await prisma.opportunity.findFirst({
        where: { companyId: company.id, status: "OPEN" },
        include: {
          skills: {
            include: { skill: true },
          },
          company: true,
        },
        orderBy: { createdAt: "desc" },
      });
    }

    if (!opportunity) {
      return NextResponse.json({
        recommendations: [],
        opportunity: null,
        message: "No active vacancy found to generate recommendations. Please post a vacancy first.",
      });
    }

    // 1. Fetch all existing applications for this opportunity to know who applied
    const existingApplications = await prisma.application.findMany({
      where: { opportunityId: opportunity.id },
      select: {
        id: true,
        studentId: true,
        status: true,
        appliedAt: true,
        matchScore: true,
      },
    });

    const applicationMap = new Map<string, any>();
    for (const app of existingApplications) {
      if (app.studentId) {
        applicationMap.set(app.studentId, app);
      }
    }

    // 2. Fetch all real students from the database
    const students = await prisma.studentProfile.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            avatarUrl: true,
          },
        },
        institution: {
          select: {
            name: true,
            city: true,
            state: true,
          },
        },
        skills: {
          include: {
            skill: true,
          },
        },
        certifications: true,
        projects: true,
      },
    });

    const requiredSkills = opportunity.skills.map((os) => ({
      skillId: os.skillId,
      name: os.skill.name,
      criticality: os.criticality,
      weightage: os.weightage,
    }));

    // 3. Compute matching metrics for each real student
    const recommendations = students.map((student) => {
      const candidateSkills = student.skills.map((s) => ({
        skillId: s.skillId,
        name: s.skill.name,
        proficiencyLevel: s.proficiencyLevel,
        score: s.proficiencyScore,
      }));

      // Skill-based matching from matchingEngine
      const skillMatch = calculateSkillMatch(candidateSkills, requiredSkills);

      // Qualification & Department matching
      let qualScore = 75;
      let qualMatchDetails = "Degree and profile evaluated.";
      const studentDeg = (student.degree || "").toLowerCase();
      const studentDept = (student.department || "").toLowerCase();
      const oppQual = (opportunity.qualification || "").toLowerCase();
      const oppDept = (opportunity.department || "").toLowerCase();

      let qualMatches = false;
      if (oppQual && (studentDeg.includes(oppQual) || oppQual.includes(studentDeg))) {
        qualMatches = true;
      }
      if (oppDept && (studentDept.includes(oppDept) || oppDept.includes(studentDept))) {
        qualMatches = true;
      }

      if (qualMatches) {
        qualScore = 100;
        qualMatchDetails = `Direct academic alignment: ${student.degree} (${student.department}) matches vacancy qualifications.`;
      } else if (oppQual || oppDept) {
        qualScore = 70;
        qualMatchDetails = `Related domain: ${student.degree} in ${student.department}.`;
      } else {
        qualScore = 85;
        qualMatchDetails = `Academic qualification: ${student.degree} (${student.department}).`;
      }

      // CGPA Check
      const cgpaSatisfied = student.cgpa >= opportunity.minCgpa;
      const cgpaScore = cgpaSatisfied ? 100 : Math.max(50, Math.round((student.cgpa / opportunity.minCgpa) * 100));

      // Composite Match Percentage (Skills 70%, Academics 15%, CGPA & Readiness 15%)
      const compositeScore = Math.min(
        100,
        Math.round(skillMatch.matchPercentage * 0.7 + qualScore * 0.15 + cgpaScore * 0.15)
      );

      // Detailed explanation
      const reasons: string[] = [];
      if (skillMatch.matchedSkills.length > 0) {
        reasons.push(
          `Matches ${skillMatch.matchedSkills.length} of ${requiredSkills.length} prerequisite skills (${skillMatch.matchedSkills.map((s) => s.name).slice(0, 3).join(", ")})`
        );
      } else if (requiredSkills.length > 0) {
        reasons.push(`Does not yet hold prerequisite skills (${requiredSkills.map((s) => s.name).slice(0, 2).join(", ")})`);
      }
      if (cgpaSatisfied) {
        reasons.push(`CGPA ${student.cgpa.toFixed(2)} meets threshold (>= ${opportunity.minCgpa})`);
      } else {
        reasons.push(`CGPA ${student.cgpa.toFixed(2)} is below threshold (${opportunity.minCgpa})`);
      }
      reasons.push(qualMatchDetails);

      const existingApp = applicationMap.get(student.id);

      return {
        studentId: student.id,
        student: {
          id: student.id,
          name: `${student.user.firstName} ${student.user.lastName}`.trim(),
          email: student.user.email,
          phone: student.user.phone,
          avatarUrl: student.user.avatarUrl,
          collegeName: student.collegeName || student.institution?.name || "Affiliated Institute",
          department: student.department,
          degree: student.degree,
          graduationYear: student.graduationYear,
          cgpa: student.cgpa,
          readinessScore: student.readinessScore,
          resumeUrl: student.resumeUrl,
          portfolioUrl: student.portfolioUrl,
          githubUrl: student.githubUrl,
          linkedinUrl: student.linkedinUrl,
          skills: student.skills.map((ss) => ({
            id: ss.id,
            name: ss.skill.name,
            proficiencyLevel: ss.proficiencyLevel,
            score: ss.proficiencyScore,
          })),
          projectsCount: student.projects.length,
          certificationsCount: student.certifications.length,
        },
        matchPercentage: compositeScore,
        skillMatchScore: skillMatch.matchPercentage,
        matchedSkills: skillMatch.matchedSkills,
        missingSkills: skillMatch.missingSkills,
        allMandatorySkillsMet: skillMatch.allMandatoryMet,
        cgpaSatisfied,
        explanation: reasons.join(". "),
        // Crucial requirement: Clearly distinguish Applicants vs Recommended non-applied candidates
        hasApplied: !!existingApp,
        applicationStatus: existingApp ? existingApp.status : null,
        applicationId: existingApp ? existingApp.id : null,
        appliedAt: existingApp ? existingApp.appliedAt : null,
      };
    });

    // Rank candidates by compatibility match score descending
    recommendations.sort((a, b) => b.matchPercentage - a.matchPercentage);

    return NextResponse.json({
      opportunity: {
        id: opportunity.id,
        title: opportunity.title,
        department: opportunity.department,
        type: opportunity.type,
        location: opportunity.location,
        qualification: opportunity.qualification,
        requiredSkills: opportunity.skills.map((os) => os.skill.name),
      },
      recommendations,
    });
  } catch (err: any) {
    console.error("Recommendations error:", err);
    return NextResponse.json({ error: "Failed to generate recommendations." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "INDUSTRY" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized. Industry role required." }, { status: 403 });
    }

    const { studentId, opportunityId } = await req.json();

    if (!studentId || !opportunityId) {
      return NextResponse.json({ error: "Student ID and Opportunity ID are required." }, { status: 400 });
    }

    const student = await prisma.studentProfile.findUnique({
      where: { id: studentId },
      include: { user: true },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found." }, { status: 404 });
    }

    const opp = await prisma.opportunity.findUnique({
      where: { id: opportunityId },
      include: { company: true },
    });

    if (!opp) {
      return NextResponse.json({ error: "Opportunity not found." }, { status: 404 });
    }

    // Send invitation notification to student
    await prisma.notification.create({
      data: {
        userId: student.userId,
        title: `Opportunity Invitation: ${opp.company.companyName}`,
        message: `${opp.company.companyName} reviewed your verified skill profile and invites you to apply for "${opp.title}".`,
        link: opp.type === "INTERNSHIP" ? "/internships" : "/jobs",
        type: "MATCH",
      },
    });

    return NextResponse.json({
      success: true,
      message: `Invitation successfully sent to ${student.user.firstName} ${student.user.lastName}.`,
    });
  } catch (err: any) {
    console.error("Invite candidate error:", err);
    return NextResponse.json({ error: "Failed to send invitation." }, { status: 500 });
  }
}
