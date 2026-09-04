export interface StudentSkillItem {
  skillId: string;
  name: string;
  proficiencyLevel: string; // 'BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'
  score: number; // 1-100
}

export interface RequiredSkillItem {
  skillId: string;
  name: string;
  criticality: string; // 'MANDATORY', 'PREFERRED', 'OPTIONAL'
  weightage: number;
}

export interface MatchResult {
  matchPercentage: number;
  matchedSkills: {
    skillId: string;
    name: string;
    criticality: string;
    studentProficiency: string;
  }[];
  missingSkills: {
    skillId: string;
    name: string;
    criticality: string;
    recommendation: string;
  }[];
  allMandatoryMet: boolean;
  recommendationReason: string;
}

const PROFICIENCY_RANKS: Record<string, number> = {
  BEGINNER: 1,
  INTERMEDIATE: 2,
  ADVANCED: 3,
  EXPERT: 4,
};

export function calculateSkillMatch(
  studentSkills: StudentSkillItem[],
  requiredSkills: RequiredSkillItem[]
): MatchResult {
  if (!requiredSkills || requiredSkills.length === 0) {
    return {
      matchPercentage: 100,
      matchedSkills: [],
      missingSkills: [],
      allMandatoryMet: true,
      recommendationReason: "This opportunity does not require any specific prerequisite skills.",
    };
  }

  const studentSkillMap = new Map<string, StudentSkillItem>();
  for (const s of studentSkills) {
    studentSkillMap.set(s.skillId, s);
    studentSkillMap.set(s.name.toLowerCase().trim(), s);
  }

  let totalPossibleWeight = 0;
  let earnedWeight = 0;
  let mandatoryTotal = 0;
  let mandatorySatisfied = 0;

  const matchedSkills: MatchResult["matchedSkills"] = [];
  const missingSkills: MatchResult["missingSkills"] = [];

  for (const req of requiredSkills) {
    const weight = req.weightage || 10;
    totalPossibleWeight += weight;

    const studentSkill =
      studentSkillMap.get(req.skillId) ||
      studentSkillMap.get(req.name.toLowerCase().trim());

    if (req.criticality === "MANDATORY") {
      mandatoryTotal++;
    }

    if (studentSkill) {
      // Award full weight or scaled by proficiency
      const rank = PROFICIENCY_RANKS[studentSkill.proficiencyLevel] || 1;
      const proficiencyScale = rank >= 2 ? 1.0 : 0.75;
      earnedWeight += weight * proficiencyScale;

      if (req.criticality === "MANDATORY") {
        mandatorySatisfied++;
      }

      matchedSkills.push({
        skillId: req.skillId,
        name: req.name,
        criticality: req.criticality,
        studentProficiency: studentSkill.proficiencyLevel,
      });
    } else {
      missingSkills.push({
        skillId: req.skillId,
        name: req.name,
        criticality: req.criticality,
        recommendation: `Recommended to complete bridge learning module in ${req.name}`,
      });
    }
  }

  const rawPercentage =
    totalPossibleWeight > 0 ? (earnedWeight / totalPossibleWeight) * 100 : 0;
  const matchPercentage = Math.min(100, Math.round(rawPercentage));
  const allMandatoryMet = mandatoryTotal === mandatorySatisfied;

  let recommendationReason = "";
  if (matchPercentage >= 85 && allMandatoryMet) {
    recommendationReason = `Exceptional Match! You possess ${matchedSkills.length} out of ${requiredSkills.length} required skills and meet all mandatory qualifications.`;
  } else if (matchPercentage >= 65) {
    recommendationReason = `Strong Match (${matchPercentage}%). Improving in ${missingSkills.slice(0, 2).map((s) => s.name).join(", ")} will make your application stand out.`;
  } else {
    recommendationReason = `Foundational Match (${matchPercentage}%). Review the missing mandatory competencies before applying.`;
  }

  return {
    matchPercentage,
    matchedSkills,
    missingSkills,
    allMandatoryMet,
    recommendationReason,
  };
}
