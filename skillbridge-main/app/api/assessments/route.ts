import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const assessments = await prisma.skillAssessment.findMany({
      include: {
        skill: {
          include: {
            category: true,
            bridgeCourses: true,
          },
        },
        questions: true,
      },
    });

    return NextResponse.json({ assessments });
  } catch (err: any) {
    console.error("Assessments GET error:", err);
    return NextResponse.json({ error: "Failed to fetch assessments." }, { status: 500 });
  }
}
