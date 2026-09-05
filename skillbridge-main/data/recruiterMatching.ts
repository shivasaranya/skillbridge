import { RecruiterStudent, RECRUITER_DUMMY_STUDENTS } from "./recruiterStudents";
import { RecruiterJob, RECRUITER_DUMMY_JOBS } from "./recruiterJobs";

export interface CandidateMatchResult {
  student: RecruiterStudent;
  job: RecruiterJob;
  matchPercentage: number;
  breakdown: {
    skillScore: number; // Max 60
    qualificationScore: number; // Max 15
    branchScore: number; // Max 10
    locationScore: number; // Max 5
    workModeScore: number; // Max 5
    experienceScore: number; // Max 5
  };
  matchedSkills: string[];
  missingSkills: string[];
  explanation: string;
}

export interface CandidateFilterOptions {
  jobId?: string;
  minMatchPercentage?: number;
  branch?: string;
  verificationStatus?: "ALL" | "VERIFIED" | "PENDING";
  graduationYear?: number | "ALL";
  selectedSkill?: string;
  searchQuery?: string;
  experienceLevel?: string;
}

/**
 * Calculates dynamic compatibility match between an SRKR student and a recruiter job.
 * Weighted breakdown:
 * - Skill Match: 60%
 * - Qualification: 15%
 * - Branch: 10%
 * - Location: 5%
 * - Work Mode: 5%
 * - Experience: 5%
 */
export function calculateCandidateJobMatch(
  student: RecruiterStudent,
  job: RecruiterJob
): CandidateMatchResult {
  // Normalize skills for case-insensitive lookup
  const studentSkillSet = new Set(student.skills.map((s) => s.toLowerCase().trim()));
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  for (const reqSkill of job.requiredSkills) {
    if (studentSkillSet.has(reqSkill.toLowerCase().trim())) {
      matchedSkills.push(reqSkill);
    } else {
      missingSkills.push(reqSkill);
    }
  }

  // 1. Skill Match Score (Max 60%)
  const skillRatio =
    job.requiredSkills.length > 0 ? matchedSkills.length / job.requiredSkills.length : 1.0;
  const skillScore = Math.round(skillRatio * 60 * 10) / 10;

  // 2. Qualification Score (Max 15%)
  let qualificationScore = 15;
  const prefQual = (job.preferredQualification || "").toLowerCase();
  if (prefQual && !prefQual.includes("b.tech") && !prefQual.includes("any")) {
    qualificationScore = 11;
  }

  // 3. Branch Score (Max 10%)
  let branchScore = 4;
  const studentBranch = student.branch.toLowerCase();
  const branchMatches = job.branch.some((b) => studentBranch.includes(b.toLowerCase()) || b.toLowerCase().includes(studentBranch));
  if (branchMatches) {
    branchScore = 10;
  } else if (
    studentBranch.includes("computer") ||
    studentBranch.includes("information") ||
    studentBranch.includes("artificial")
  ) {
    branchScore = 7;
  }

  // 4. Location Score (Max 5%)
  let locationScore = 3;
  const jobLoc = job.location.toLowerCase();
  const studPrefLoc = student.preferredLocation.toLowerCase();
  if (
    job.workMode === "Remote" ||
    student.preferredWorkMode === "Remote" ||
    studPrefLoc.includes("flexible") ||
    studPrefLoc.includes("remote") ||
    (jobLoc.includes("hyderabad") && studPrefLoc.includes("hyderabad")) ||
    (jobLoc.includes("visakhapatnam") && studPrefLoc.includes("visakhapatnam")) ||
    (jobLoc.includes("bengaluru") && studPrefLoc.includes("bengaluru"))
  ) {
    locationScore = 5;
  }

  // 5. Work Mode Score (Max 5%)
  let workModeScore = 3;
  if (
    student.preferredWorkMode === "Flexible" ||
    student.preferredWorkMode.toLowerCase() === job.workMode.toLowerCase()
  ) {
    workModeScore = 5;
  }

  // 6. Experience Score (Max 5%)
  let experienceScore = 5;
  if (job.experienceRequired.toLowerCase().includes("0-2") && student.experienceLevel === "Fresher") {
    experienceScore = 4;
  }

  // Composite Total Percentage
  const rawSum =
    skillScore + qualificationScore + branchScore + locationScore + workModeScore + experienceScore;
  const matchPercentage = Math.min(99, Math.max(35, Math.round(rawSum)));

  // Generate clear reason explanation
  const reasons: string[] = [];
  reasons.push(
    `Possesses ${matchedSkills.length} of ${job.requiredSkills.length} required competencies (${matchedSkills.slice(0, 3).join(", ")}${matchedSkills.length > 3 ? "..." : ""})`
  );
  if (branchScore === 10) {
    reasons.push(`Degree branch (${student.branch}) is a prime target for this role`);
  }
  if (student.verificationStatus === "VERIFIED") {
    reasons.push(`SRKR verified academic standing & ${student.assessmentScore}% proctored assessment score`);
  }

  return {
    student,
    job,
    matchPercentage,
    breakdown: {
      skillScore,
      qualificationScore,
      branchScore,
      locationScore,
      workModeScore,
      experienceScore,
    },
    matchedSkills,
    missingSkills,
    explanation: reasons.join(". ") + ".",
  };
}

/**
 * Ranks and filters SRKR students for a designated recruiter job.
 */
export function getRankedCandidatesForJob(
  jobId: string,
  options?: CandidateFilterOptions
): CandidateMatchResult[] {
  const job =
    RECRUITER_DUMMY_JOBS.find((j) => j.jobId === jobId) || RECRUITER_DUMMY_JOBS[0];

  let candidates = RECRUITER_DUMMY_STUDENTS;

  // Branch filter
  if (options?.branch && options.branch !== "ALL") {
    candidates = candidates.filter((c) => c.branch === options.branch);
  }

  // Verification filter
  if (options?.verificationStatus && options.verificationStatus !== "ALL") {
    candidates = candidates.filter((c) => c.verificationStatus === options.verificationStatus);
  }

  // Graduation year filter
  if (options?.graduationYear && options.graduationYear !== "ALL") {
    candidates = candidates.filter((c) => c.graduationYear === Number(options.graduationYear));
  }

  // Selected skill filter
  if (options?.selectedSkill && options.selectedSkill !== "ALL") {
    const filterSkill = options.selectedSkill.toLowerCase().trim();
    candidates = candidates.filter((c) =>
      c.skills.some((s) => s.toLowerCase().trim() === filterSkill)
    );
  }

  // Search query filter (name, skills, branch)
  if (options?.searchQuery) {
    const query = options.searchQuery.toLowerCase().trim();
    candidates = candidates.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.branch.toLowerCase().includes(query) ||
        c.skills.some((s) => s.toLowerCase().includes(query))
    );
  }

  // Experience level filter
  if (options?.experienceLevel && options.experienceLevel !== "ALL") {
    candidates = candidates.filter((c) =>
      c.experienceLevel.toLowerCase().includes(options.experienceLevel!.toLowerCase())
    );
  }

  // Compute matches
  let matches = candidates.map((student) => calculateCandidateJobMatch(student, job));

  // Minimum match percentage threshold filter (e.g. 80%+)
  if (options?.minMatchPercentage && options.minMatchPercentage > 0) {
    matches = matches.filter((m) => m.matchPercentage >= options.minMatchPercentage!);
  }

  // Sort by match percentage descending
  matches.sort((a, b) => b.matchPercentage - a.matchPercentage);

  return matches;
}
