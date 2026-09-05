import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Role → required skills mapping for skill gap analysis
const ROLE_SKILL_MAP: Record<string, { skill: string; weight: number; mandatory: boolean }[]> = {
  "Full Stack Developer": [
    { skill: "HTML", weight: 15, mandatory: true },
    { skill: "CSS", weight: 15, mandatory: true },
    { skill: "JavaScript", weight: 20, mandatory: true },
    { skill: "React", weight: 20, mandatory: true },
    { skill: "Node.js", weight: 15, mandatory: false },
    { skill: "PostgreSQL", weight: 10, mandatory: false },
    { skill: "Docker", weight: 8, mandatory: false },
    { skill: "AWS", weight: 8, mandatory: false },
    { skill: "Git", weight: 10, mandatory: true },
  ],
  "Backend Developer": [
    { skill: "Node.js", weight: 20, mandatory: true },
    { skill: "Python", weight: 15, mandatory: false },
    { skill: "PostgreSQL", weight: 20, mandatory: true },
    { skill: "REST API", weight: 20, mandatory: true },
    { skill: "Docker", weight: 10, mandatory: false },
    { skill: "AWS", weight: 10, mandatory: false },
    { skill: "Git", weight: 10, mandatory: true },
    { skill: "Redis", weight: 8, mandatory: false },
  ],
  "Frontend Developer": [
    { skill: "HTML", weight: 20, mandatory: true },
    { skill: "CSS", weight: 20, mandatory: true },
    { skill: "JavaScript", weight: 25, mandatory: true },
    { skill: "React", weight: 25, mandatory: true },
    { skill: "TypeScript", weight: 15, mandatory: false },
    { skill: "Git", weight: 10, mandatory: true },
    { skill: "Figma", weight: 10, mandatory: false },
  ],
  "Data Analyst": [
    { skill: "Python", weight: 25, mandatory: true },
    { skill: "SQL", weight: 25, mandatory: true },
    { skill: "Excel", weight: 15, mandatory: true },
    { skill: "Tableau", weight: 10, mandatory: false },
    { skill: "Power BI", weight: 10, mandatory: false },
    { skill: "Statistics", weight: 15, mandatory: true },
  ],
  "Data Scientist": [
    { skill: "Python", weight: 25, mandatory: true },
    { skill: "Machine Learning", weight: 25, mandatory: true },
    { skill: "SQL", weight: 15, mandatory: true },
    { skill: "Statistics", weight: 15, mandatory: true },
    { skill: "Deep Learning", weight: 15, mandatory: false },
    { skill: "NumPy", weight: 10, mandatory: false },
    { skill: "Pandas", weight: 10, mandatory: false },
  ],
  "AI/ML Engineer": [
    { skill: "Python", weight: 20, mandatory: true },
    { skill: "Machine Learning", weight: 25, mandatory: true },
    { skill: "Deep Learning", weight: 20, mandatory: true },
    { skill: "TensorFlow", weight: 15, mandatory: false },
    { skill: "PyTorch", weight: 15, mandatory: false },
    { skill: "Docker", weight: 10, mandatory: false },
    { skill: "AWS", weight: 10, mandatory: false },
  ],
  "Cloud Engineer": [
    { skill: "AWS", weight: 30, mandatory: true },
    { skill: "Docker", weight: 20, mandatory: true },
    { skill: "Kubernetes", weight: 20, mandatory: false },
    { skill: "Linux", weight: 15, mandatory: true },
    { skill: "Terraform", weight: 15, mandatory: false },
    { skill: "Python", weight: 10, mandatory: false },
  ],
  "DevOps Engineer": [
    { skill: "Docker", weight: 20, mandatory: true },
    { skill: "Kubernetes", weight: 20, mandatory: true },
    { skill: "Jenkins", weight: 15, mandatory: false },
    { skill: "AWS", weight: 15, mandatory: false },
    { skill: "Linux", weight: 15, mandatory: true },
    { skill: "Git", weight: 15, mandatory: true },
    { skill: "Terraform", weight: 10, mandatory: false },
  ],
  "Cybersecurity Analyst": [
    { skill: "Network Security", weight: 25, mandatory: true },
    { skill: "Linux", weight: 20, mandatory: true },
    { skill: "Python", weight: 15, mandatory: false },
    { skill: "Penetration Testing", weight: 20, mandatory: false },
    { skill: "SIEM", weight: 15, mandatory: false },
    { skill: "Cryptography", weight: 10, mandatory: false },
  ],
  "UI/UX Designer": [
    { skill: "Figma", weight: 30, mandatory: true },
    { skill: "User Research", weight: 25, mandatory: true },
    { skill: "Wireframing", weight: 20, mandatory: true },
    { skill: "HTML", weight: 10, mandatory: false },
    { skill: "CSS", weight: 10, mandatory: false },
    { skill: "Adobe XD", weight: 10, mandatory: false },
  ],
  "Product Manager": [
    { skill: "Product Strategy", weight: 25, mandatory: true },
    { skill: "Agile", weight: 20, mandatory: true },
    { skill: "Data Analysis", weight: 15, mandatory: true },
    { skill: "User Research", weight: 15, mandatory: false },
    { skill: "SQL", weight: 10, mandatory: false },
    { skill: "Roadmapping", weight: 15, mandatory: false },
  ],
};

// POST /api/student/skill-gap
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { targetRole } = body;

    if (!targetRole || !ROLE_SKILL_MAP[targetRole]) {
      return NextResponse.json({
        error: "Invalid targetRole",
        availableRoles: Object.keys(ROLE_SKILL_MAP),
      }, { status: 400 });
    }

    const student = await prisma.studentProfile.findUnique({
      where: { userId: session.id },
      include: {
        skills: {
          include: { skill: true },
        },
      },
    });
    if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const requiredSkills = ROLE_SKILL_MAP[targetRole];
    const studentSkillMap = new Map<string, { level: string; score: number; verificationLevel: string }>();

    for (const ss of student.skills) {
      studentSkillMap.set(ss.skill.name.toLowerCase(), {
        level: ss.proficiencyLevel,
        score: ss.proficiencyScore,
        verificationLevel: ss.verificationLevel,
      });
    }

    let totalWeight = 0;
    let earnedWeight = 0;

    const strongSkills: any[] = [];
    const moderateSkills: any[] = [];
    const missingSkills: any[] = [];

    for (const req of requiredSkills) {
      totalWeight += req.weight;
      const studentSkill = studentSkillMap.get(req.skill.toLowerCase());

      if (studentSkill) {
        const scoreMap: Record<string, number> = { BEGINNER: 0.5, INTERMEDIATE: 0.75, ADVANCED: 0.9, EXPERT: 1.0 };
        const scale = scoreMap[studentSkill.level] || 0.5;
        const earned = req.weight * scale;
        earnedWeight += earned;

        if (scale >= 0.75) {
          strongSkills.push({ skill: req.skill, level: studentSkill.level, verificationLevel: studentSkill.verificationLevel, score: studentSkill.score });
        } else {
          moderateSkills.push({ skill: req.skill, level: studentSkill.level, verificationLevel: studentSkill.verificationLevel, score: studentSkill.score });
        }
      } else {
        missingSkills.push({
          skill: req.skill,
          mandatory: req.mandatory,
          weight: req.weight,
          recommendation: `Learn ${req.skill} to improve your readiness for ${targetRole}`,
        });
      }
    }

    const readinessScore = Math.round((earnedWeight / totalWeight) * 100);

    // Priority skills = mandatory missing first, then by weight
    const prioritySkills = missingSkills
      .sort((a, b) => (b.mandatory ? 1 : 0) - (a.mandatory ? 1 : 0) || b.weight - a.weight)
      .slice(0, 5)
      .map((s) => s.skill);

    // Fetch learning resources for missing skills
    const missingSkillNames = missingSkills.map((s) => s.skill.toLowerCase());
    const resources = await prisma.learningResource.findMany({
      where: {
        skill: {
          name: { in: missingSkillNames.map((n) => n.charAt(0).toUpperCase() + n.slice(1)) },
        },
      },
      include: { skill: true },
      take: 6,
    });

    return NextResponse.json({
      targetRole,
      readinessScore,
      strongSkills,
      moderateSkills,
      missingSkills,
      prioritySkills,
      suggestedResources: resources,
      breakdown: {
        strong: strongSkills.length,
        moderate: moderateSkills.length,
        missing: missingSkills.length,
        total: requiredSkills.length,
      },
      availableRoles: Object.keys(ROLE_SKILL_MAP),
    });
  } catch (err) {
    console.error("[skill-gap POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET /api/student/skill-gap — available roles
export async function GET(req: NextRequest) {
  return NextResponse.json({ availableRoles: Object.keys(ROLE_SKILL_MAP) });
}
