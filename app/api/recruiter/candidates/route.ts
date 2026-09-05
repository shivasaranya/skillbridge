import { NextResponse } from "next/server";
import { getRankedCandidatesForJob, CandidateFilterOptions } from "@/data/recruiterMatching";
import { RECRUITER_DUMMY_JOBS } from "@/data/recruiterJobs";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("jobId") || RECRUITER_DUMMY_JOBS[0].jobId;
    const minMatch = searchParams.get("minMatch");
    const branch = searchParams.get("branch");
    const verificationStatus = searchParams.get("verificationStatus") as any;
    const graduationYear = searchParams.get("graduationYear");
    const selectedSkill = searchParams.get("selectedSkill");
    const searchQuery = searchParams.get("searchQuery");
    const experienceLevel = searchParams.get("experienceLevel");

    const filterOptions: CandidateFilterOptions = {};
    if (minMatch && Number(minMatch) > 0) {
      filterOptions.minMatchPercentage = Number(minMatch);
    }
    if (branch && branch !== "ALL") {
      filterOptions.branch = branch;
    }
    if (verificationStatus && verificationStatus !== "ALL") {
      filterOptions.verificationStatus = verificationStatus;
    }
    if (graduationYear && graduationYear !== "ALL") {
      filterOptions.graduationYear = Number(graduationYear);
    }
    if (selectedSkill && selectedSkill !== "ALL") {
      filterOptions.selectedSkill = selectedSkill;
    }
    if (searchQuery) {
      filterOptions.searchQuery = searchQuery;
    }
    if (experienceLevel && experienceLevel !== "ALL") {
      filterOptions.experienceLevel = experienceLevel;
    }

    const matches = getRankedCandidatesForJob(jobId, filterOptions);
    const activeJob =
      RECRUITER_DUMMY_JOBS.find((j) => j.jobId === jobId) || RECRUITER_DUMMY_JOBS[0];

    return NextResponse.json({
      job: activeJob,
      totalCandidates: matches.length,
      candidates: matches,
    });
  } catch (err) {
    console.error("Recruiter candidates error:", err);
    return NextResponse.json({ error: "Failed to evaluate candidate matches." }, { status: 500 });
  }
}
