import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized. Student role required." }, { status: 403 });
    }

    const assessmentId = params.id;
    const { answers } = await req.json(); // { [questionId: string]: 'A' | 'B' | 'C' | 'D' }

    const assessment = await prisma.skillAssessment.findUnique({
      where: { id: assessmentId },
      include: {
        skill: {
          include: {
            bridgeCourses: true,
          },
        },
        questions: true,
      },
    });

    if (!assessment) {
      return NextResponse.json({ error: "Assessment not found." }, { status: 404 });
    }

    let correctCount = 0;
    const totalCount = assessment.questions.length;
    const questionReview: any[] = [];

    for (const q of assessment.questions) {
      const studentAnswer = answers[q.id];
      const isCorrect = studentAnswer === q.correctAnswer;
      if (isCorrect) correctCount++;

      questionReview.push({
        questionText: q.questionText,
        yourAnswer: studentAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
      });
    }

    const scorePercentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
    const isPassed = scorePercentage >= assessment.passingScore;

    const student = await prisma.studentProfile.findUnique({
      where: { userId: session.id },
    });

    if (student) {
      // Record attempt
      await prisma.assessmentAttempt.create({
        data: {
          studentId: student.id,
          assessmentId,
          scorePercentage,
          isPassed,
        },
      });

      // If passed, upgrade or add verified student skill in database!
      if (isPassed) {
        let level = "INTERMEDIATE";
        if (scorePercentage >= 90) level = "EXPERT";
        else if (scorePercentage >= 75) level = "ADVANCED";

        await prisma.studentSkill.upsert({
          where: {
            studentId_skillId: {
              studentId: student.id,
              skillId: assessment.skillId,
            },
          },
          create: {
            studentId: student.id,
            skillId: assessment.skillId,
            proficiencyLevel: level,
            proficiencyScore: scorePercentage,
            verificationSource: "ASSESSMENT_TESTED",
            verifiedAt: new Date(),
          },
          update: {
            proficiencyLevel: level,
            proficiencyScore: Math.max(scorePercentage, 70),
            verificationSource: "ASSESSMENT_TESTED",
            verifiedAt: new Date(),
          },
        });

        // Boost readiness score
        await prisma.studentProfile.update({
          where: { id: student.id },
          data: {
            readinessScore: Math.min(98, student.readinessScore + 5),
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      scorePercentage,
      correctCount,
      totalCount,
      isPassed,
      passingScore: assessment.passingScore,
      questionReview,
      skillName: assessment.skill.name,
      bridgeCourses: !isPassed ? assessment.skill.bridgeCourses : [],
    });
  } catch (err: any) {
    console.error("Assessment submit error:", err);
    return NextResponse.json({ error: "Failed to submit assessment." }, { status: 500 });
  }
}
