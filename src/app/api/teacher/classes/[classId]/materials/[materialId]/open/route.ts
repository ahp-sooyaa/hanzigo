import { get } from "@vercel/blob";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { classMaterials } from "@/db/schema/class-materials";
import { classes } from "@/db/schema/classes";
import { teachers } from "@/db/schema/teachers";
import { auth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ classId: string; materialId: string }> },
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session || session.user.role !== "teacher") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const permissionResult = await auth.api.userHasPermission({
    body: {
      userId: session.user.id,
      permissions: {
        material: ["read"],
      },
    },
  });

  if (!permissionResult || permissionResult.success === false) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { classId, materialId } = await context.params;

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

  const material = await db.query.classMaterials.findFirst({
    where: and(
      eq(classMaterials.id, materialId),
      eq(classMaterials.classId, classId),
      eq(classMaterials.materialType, "pdf"),
    ),
  });

  if (!material || !material.blobUrl) {
    return NextResponse.json({ error: "Material not found" }, { status: 404 });
  }

  const blobResponse = await get(material.blobUrl, {
    access: "private",
    token: process.env.BLOB_READ_WRITE_TOKEN,
    useCache: false,
  });

  if (!blobResponse || blobResponse.statusCode !== 200 || !blobResponse.stream) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const fileName = material.originalFileName || `${material.title}.pdf`;

  return new NextResponse(blobResponse.stream, {
    headers: {
      "Content-Type": blobResponse.blob.contentType || material.mimeType || "application/pdf",
      "Content-Disposition": `inline; filename="${fileName}"`,
      "Cache-Control": "private, no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
