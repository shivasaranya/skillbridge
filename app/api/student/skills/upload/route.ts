import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const student = await prisma.studentProfile.findUnique({
      where: { userId: session.id },
      select: { id: true },
    });
    if (!student) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    const formData = await req.formData();
    const file = formData.get("certificate") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: "File too large. Maximum size is 5 MB." }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Only PDF, JPG, and PNG files are allowed." }, { status: 400 });
    }

    // Create directory if needed
    const uploadDir = path.join(process.cwd(), "public", "uploads", "certificates", student.id);
    await mkdir(uploadDir, { recursive: true });

    // Unique safe filename
    const ext = file.name.split(".").pop()?.toLowerCase() || "pdf";
    const safeName = `cert_${Date.now()}.${ext}`;
    const filePath = path.join(uploadDir, safeName);

    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    const fileUrl = `/uploads/certificates/${student.id}/${safeName}`;
    return NextResponse.json({ fileUrl }, { status: 201 });
  } catch (err) {
    console.error("[skills/upload POST]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
