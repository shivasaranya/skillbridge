// ============================================================
// SkillBridge — Dynamic Candidate Matching Engine
// Weights: Skills 60%, Qualification 15%, Branch 10%,
//          Location 5%, WorkMode 5%, Experience 5%
// ============================================================

import { RecruiterStudent } from "@/data/recruiterStudents";

export interface JobRequirements {
  requiredSkills: string[];
  preferredBranch?: string[];
  workMode?: string;
  experienceRequired?: string;
  location?: string;
  jobType?: string;
}

export interface MatchResult {
  student: RecruiterStudent;
  overallScore: number;
  skillScore: number;
  qualificationScore: number;
  branchScore: number;
  locationScore: number;
  workModeScore: number;
  experienceScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  skillMatchPercent: number;
}

const norm = (s: string) => s.toLowerCase().trim();

function calcSkillScore(studentSkills: string[], requiredSkills: string[]) {
  if (!requiredSkills.length) return { score: 100, matched: [] as string[], missing: [] as string[], percent: 100 };
  const normStudent = studentSkills.map(norm);
  const matched: string[] = [];
  const missing: string[] = [];
  for (const rs of requiredSkills) {
    const nrs = norm(rs);
    const found = normStudent.some(ss => ss.includes(nrs) || nrs.includes(ss));
    found ? matched.push(rs) : missing.push(rs);
  }
  const percent = Math.round((matched.length / requiredSkills.length) * 100);
  return { score: percent, matched, missing, percent };
}

function calcQualificationScore(student: RecruiterStudent): number {
  const c = student.cgpa;
  if (c >= 9.0) return 100; if (c >= 8.5) return 90; if (c >= 8.0) return 80;
  if (c >= 7.5) return 68;  if (c >= 7.0) return 55;  if (c >= 6.5) return 40;
  return 25;
}

function calcBranchScore(student: RecruiterStudent, preferred?: string[]): number {
  if (!preferred?.length) return 80;
  const nb = preferred.map(norm);
  const ns = norm(student.branch);
  const match = nb.some(b =>
    ns.includes(b) || b.includes(ns) ||
    (ns.includes("computer") && b.includes("computer")) ||
    (ns.includes("information") && b.includes("information")) ||
    (ns.includes("artificial") && b.includes("artificial")) ||
    (ns.includes("electronic") && b.includes("electronic")) ||
    (ns.includes("electrical") && b.includes("electrical")) ||
    (ns.includes("mechanical") && b.includes("mechanical"))
  );
  return match ? 100 : 30;
}

function calcLocationScore(student: RecruiterStudent, jobLocation?: string): number {
  if (!jobLocation) return 80;
  const nj = norm(jobLocation); const np = norm(student.preferredLocation);
  if (np === "any") return 90;
  if (np.includes(nj) || nj.includes(np)) return 100;
  if (nj.includes("remote")) return 95;
  return 40;
}

function calcWorkModeScore(student: RecruiterStudent, jobWorkMode?: string): number {
  if (!jobWorkMode) return 80;
  const ns = norm(student.preferredWorkMode); const nj = norm(jobWorkMode);
  if (ns === "any") return 90; if (ns === nj) return 100;
  if (nj === "hybrid" && (ns === "remote" || ns === "onsite")) return 70;
  if (ns === "hybrid") return 70;
  return 30;
}

function calcExperienceScore(student: RecruiterStudent, expReq?: string): number {
  if (!expReq) return 80;
  const nr = norm(expReq); const ns = norm(student.experienceLevel);
  if (nr.includes("fresher") || nr.includes("no experience")) return 100;
  if (nr.includes("0-1") && (ns === "fresher" || ns === "0-1 yr")) return 100;
  return 60;
}

export function matchCandidates(
  job: JobRequirements,
  candidates: RecruiterStudent[],
  minScore = 0
): MatchResult[] {
  return candidates
    .map(student => {
      const { score: skillScore, matched, missing, percent } =
        calcSkillScore(student.skills, job.requiredSkills);
      const qualScore   = calcQualificationScore(student);
      const branchScore = calcBranchScore(student, job.preferredBranch);
      const locScore    = calcLocationScore(student, job.location);
      const modeScore   = calcWorkModeScore(student, job.workMode);
      const expScore    = calcExperienceScore(student, job.experienceRequired);
      const overall     = Math.min(100, Math.round(
        skillScore * 0.60 + qualScore * 0.15 + branchScore * 0.10 +
        locScore * 0.05 + modeScore * 0.05 + expScore * 0.05
      ));
      return {
        student, overallScore: overall,
        skillScore, qualificationScore: qualScore,
        branchScore, locationScore: locScore,
        workModeScore: modeScore, experienceScore: expScore,
        matchedSkills: matched, missingSkills: missing,
        skillMatchPercent: percent,
      };
    })
    .filter(r => r.overallScore >= minScore)
    .sort((a, b) => b.overallScore - a.overallScore);
}

export function getScoreBadgeColor(score: number): string {
  if (score >= 80) return "bg-emerald-100 text-emerald-700 border-emerald-200";
  if (score >= 60) return "bg-blue-100 text-blue-700 border-blue-200";
  if (score >= 40) return "bg-amber-100 text-amber-700 border-amber-200";
  return "bg-slate-100 text-slate-500 border-slate-200";
}
