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
      where: { userId: session.id },
      select: { id: true },
    });
    if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const certs = await prisma.studentCertification.findMany({
      where: { studentId: student.id },
      orderBy: { issueDate: "desc" },
    });
    return NextResponse.json({ certifications: certs });
  } catch (err) {
    console.error("[certs GET]", err);
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
      title, issuingBody, issueDate, expiryDate,
      credentialId, credentialUrl, fileUrl, relatedSkills,
    } = body;

    if (!title || !issuingBody || !issueDate) {
      return NextResponse.json({ error: "title, issuingBody, issueDate required" }, { status: 400 });
    }

    const student = await prisma.studentProfile.findUnique({
      where: { userId: session.id },
      select: { id: true },
    });
    if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const cert = await prisma.studentCertification.create({
      data: {
        studentId: student.id,
        title,
        issuingBody,
        issueDate: new Date(issueDate),
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        credentialId: credentialId || null,
        credentialUrl: credentialUrl || null,
        fileUrl: fileUrl || null,
        relatedSkills: relatedSkills ? JSON.stringify(relatedSkills) : null,
      },
    });
    return NextResponse.json({ certification: cert }, { status: 201 });
  } catch (err) {
    console.error("[certs POST]", err);
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
    const certId = searchParams.get("id");
    if (!certId) return NextResponse.json({ error: "id required" }, { status: 400 });

    const student = await prisma.studentProfile.findUnique({
      where: { userId: session.id },
      select: { id: true },
    });
    if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.studentCertification.deleteMany({
      where: { id: certId, studentId: student.id },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[certs DELETE]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
