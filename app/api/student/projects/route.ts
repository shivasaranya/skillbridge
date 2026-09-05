import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const student = await prisma.studentProfile.findUnique({
      where: { userId: session.id }, select: { id: true },
    });
    if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const projects = await prisma.studentProject.findMany({
      where: { studentId: student.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ projects });
  } catch (err) {
    console.error("[projects GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const {
      title, description, category, technologies, skillsDemonstrated,
      githubUrl, liveUrl, imageUrl, teamSize, role, durationMonths,
    } = body;

    if (!title || !description) {
      return NextResponse.json({ error: "title and description required" }, { status: 400 });
    }

    const student = await prisma.studentProfile.findUnique({
      where: { userId: session.id }, select: { id: true },
    });
    if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const project = await prisma.studentProject.create({
      data: {
        studentId: student.id,
        title,
        description,
        category: category || null,
        technologies: Array.isArray(technologies) ? technologies.join(", ") : (technologies || ""),
        skillsDemonstrated: skillsDemonstrated ? JSON.stringify(skillsDemonstrated) : null,
        githubUrl: githubUrl || null,
        liveUrl: liveUrl || null,
        imageUrl: imageUrl || null,
        teamSize: teamSize ? parseInt(teamSize) : 1,
        role: role || null,
        durationMonths: durationMonths ? parseInt(durationMonths) : null,
      },
    });
    return NextResponse.json({ project }, { status: 201 });
  } catch (err) {
    console.error("[projects POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const student = await prisma.studentProfile.findUnique({
      where: { userId: session.id }, select: { id: true },
    });
    if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.studentProject.deleteMany({ where: { id, studentId: student.id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[projects DELETE]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
