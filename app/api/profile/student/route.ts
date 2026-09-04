import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let student = null;
    if (session.role === "STUDENT") {
      student = await prisma.studentProfile.findUnique({
        where: { userId: session.id },
        include: {
          user: true,
          institution: true,
          skills: {
            include: {
              skill: {
                include: {
                  category: true,
                  bridgeCourses: true,
                },
              },
            },
          },
          certifications: true,
          projects: true,
        },
      });
    } else {
      // Fallback for demo preview
      student = await prisma.studentProfile.findFirst({
        include: {
          user: true,
          institution: true,
          skills: {
            include: {
              skill: {
                include: {
                  category: true,
                  bridgeCourses: true,
                },
              },
            },
          },
          certifications: true,
          projects: true,
        },
      });
    }

    return NextResponse.json({ student });
  } catch (err: any) {
    console.error("Student profile fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch student profile." }, { status: 500 });
  }
}
