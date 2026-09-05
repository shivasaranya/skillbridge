import { NextResponse } from "next/server";
import { RECRUITER_DUMMY_JOBS } from "@/data/recruiterJobs";

export async function GET() {
  try {
    return NextResponse.json({
      jobs: RECRUITER_DUMMY_JOBS,
      total: RECRUITER_DUMMY_JOBS.length,
    });
  } catch (err) {
    console.error("Fetch recruiter jobs error:", err);
    return NextResponse.json({ error: "Failed to fetch recruiter jobs." }, { status: 500 });
  }
}
