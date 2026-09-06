// ============================================================
// SkillBridge — Industry Recommendation Engine
// Matches real students from DB against vacancy requirements
// Weights: Skills 60%, Qualification 25%, Branch/Dept 15%
// ============================================================

export interface VacancyRequirements {
  requiredSkillIds: string[];   // Skill.id array from OpportunitySkill
  requiredSkillNames: string[]; // Skill.name array for display
  minCgpa?: number;
  eligibility?: string;
  department?: string;
  type?: string; // INTERNSHIP | JOB
}

export interface StudentForMatch {
  id: string;
  userId: string;
  degree: string;
  department: string;
  graduationYear: number;
  cgpa: number;
  headline?: string | null;
  resumeUrl?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
  placementStatus?: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  skills: {
    skillId: string;
    skill: { name: string; id: string };
    proficiencyLevel: string;
    proficiencyScore: number;
  }[];
  certifications?: { title: string; issuingBody: string }[];
  institution?: { name: string; city?: string } | null;
}

export interface RecommendationResult {
  student: StudentForMatch;
  overallScore: number;
  skillScore: number;
  qualificationScore: number;
  branchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  skillMatchPercent: number;
  qualificationMatch: boolean;
  alreadyApplied?: boolean;
}

const norm = (s: string) => s.toLowerCase().trim();

function calcSkillScore(
  studentSkills: { skillId: string; skill: { name: string } }[],
  requiredSkillIds: string[],
  requiredSkillNames: string[]
) {
  if (!requiredSkillIds.length) {
    return { score: 100, matched: [] as string[], missing: [] as string[], percent: 100 };
  }

  const studentSkillIds = new Set(studentSkills.map((s) => s.skillId));
  const studentSkillNames = studentSkills.map((s) => norm(s.skill.name));

  const matched: string[] = [];
  const missing: string[] = [];

  requiredSkillNames.forEach((name, idx) => {
    const id = requiredSkillIds[idx];
    const idMatch = studentSkillIds.has(id);
    const nameMatch = studentSkillNames.some(
      (sn) => sn.includes(norm(name)) || norm(name).includes(sn)
    );
    if (idMatch || nameMatch) {
      matched.push(name);
    } else {
      missing.push(name);
    }
  });

  const percent = Math.round((matched.length / requiredSkillNames.length) * 100);
  return { score: percent, matched, missing, percent };
}

function calcQualificationScore(cgpa: number, minCgpa?: number): number {
  const required = minCgpa ?? 6.5;
  if (cgpa < required) return Math.max(0, Math.round(((cgpa - required + 2) / 2) * 40)); // partial credit
  if (cgpa >= 9.0) return 100;
  if (cgpa >= 8.5) return 92;
  if (cgpa >= 8.0) return 83;
  if (cgpa >= 7.5) return 72;
  if (cgpa >= 7.0) return 60;
  return 50;
}

function calcBranchScore(studentDept: string, vacancyDept?: string): number {
  if (!vacancyDept) return 80; // Not specified — give reasonable score
  const ns = norm(studentDept);
  const nv = norm(vacancyDept);
  if (ns === nv) return 100;
  if (ns.includes(nv) || nv.includes(ns)) return 90;
  return 50;
}

export function matchStudentsToVacancy(
  vacancy: VacancyRequirements,
  students: StudentForMatch[],
  appliedStudentIds: Set<string>,
  minScore = 1
): RecommendationResult[] {
  return students
    .map((student) => {
      const { score: skillScore, matched, missing, percent } = calcSkillScore(
        student.skills,
        vacancy.requiredSkillIds,
        vacancy.requiredSkillNames
      );

      const qualScore = calcQualificationScore(student.cgpa, vacancy.minCgpa);
      const branchScore = calcBranchScore(student.department, vacancy.department);
      const qualMatch = !vacancy.minCgpa || student.cgpa >= vacancy.minCgpa;

      const overall = Math.min(
        100,
        Math.round(skillScore * 0.6 + qualScore * 0.25 + branchScore * 0.15)
      );

      return {
        student,
        overallScore: overall,
        skillScore,
        qualificationScore: qualScore,
        branchScore,
        matchedSkills: matched,
        missingSkills: missing,
        skillMatchPercent: percent,
        qualificationMatch: qualMatch,
        alreadyApplied: appliedStudentIds.has(student.id),
      };
    })
    .filter((r) => r.overallScore >= minScore)
    .sort((a, b) => b.overallScore - a.overallScore);
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "bg-emerald-100 text-emerald-700 border-emerald-200";
  if (score >= 60) return "bg-blue-100 text-blue-700 border-blue-200";
  if (score >= 40) return "bg-amber-100 text-amber-700 border-amber-200";
  return "bg-slate-100 text-slate-500 border-slate-200";
}
