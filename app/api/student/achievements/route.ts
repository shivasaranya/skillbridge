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

    const achievements = await prisma.achievement.findMany({
      where: { studentId: student.id },
      orderBy: { date: "desc" },
    });
    return NextResponse.json({ achievements });
  } catch (err) {
    console.error("[achievements GET]", err);
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
    const { title, type, organization, date, description, fileUrl, relatedSkills } = body;

    if (!title || !type || !date) {
      return NextResponse.json({ error: "title, type, date required" }, { status: 400 });
    }

    const student = await prisma.studentProfile.findUnique({
      where: { userId: session.id }, select: { id: true },
    });
    if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const achievement = await prisma.achievement.create({
      data: {
        studentId: student.id,
        title,
        type,
        organization: organization || null,
        date: new Date(date),
        description: description || null,
        fileUrl: fileUrl || null,
        relatedSkills: relatedSkills ? JSON.stringify(relatedSkills) : null,
      },
    });
    return NextResponse.json({ achievement }, { status: 201 });
  } catch (err) {
    console.error("[achievements POST]", err);
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

    await prisma.achievement.deleteMany({ where: { id, studentId: student.id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[achievements DELETE]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
