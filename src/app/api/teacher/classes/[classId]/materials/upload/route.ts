import { put } from "@vercel/blob";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { classes } from "@/db/schema/classes";
import { teachers } from "@/db/schema/teachers";
import { auth } from "@/lib/auth";

const MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024;

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ classId: string }> },
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session || session.user.role !== "teacher") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const permissionResult = await auth.api.userHasPermission({
    body: {
      userId: session.user.id,
      permissions: {
        material: ["create"],
      },
    },
  });

  if (!permissionResult || permissionResult.success === false) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { classId } = await context.params;
  const teacherRecord = await db.query.teachers.findFirst({
    where: eq(teachers.userId, session.user.id),
  });

  if (!teacherRecord) {
    return NextResponse.json({ error: "Teacher not found" }, { status: 403 });
  }

  const classRecord = await db.query.classes.findFirst({
    where: and(eq(classes.id, classId), eq(classes.teacherId, teacherRecord.id)),
  });

  if (!classRecord) {
    return NextResponse.json({ error: "Class not found" }, { status: 404 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }

  const fileName = file.name || "material.pdf";
  const hasPdfExtension = fileName.toLowerCase().endsWith(".pdf");
  const isPdfMime = file.type === "application/pdf";

  if (!hasPdfExtension && !isPdfMime) {
    return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
  }

  if (file.size > MAX_PDF_SIZE_BYTES) {
    return NextResponse.json({ error: "PDF file size must be 10MB or less" }, { status: 400 });
  }

  const blob = await put(`class-materials/${classId}/${Date.now()}-${fileName}`, file, {
    access: "private",
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  return NextResponse.json({
    url: blob.url,
    originalFileName: fileName,
    mimeType: file.type || "application/pdf",
    fileSize: file.size,
  });
}
