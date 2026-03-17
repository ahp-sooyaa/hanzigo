"use server";

import { del } from "@vercel/blob";
import { and, eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { classMaterials } from "@/db/schema/class-materials";
import { classes } from "@/db/schema/classes";
import { teachers } from "@/db/schema/teachers";
import { permissionAction } from "@/lib/safe-action";

const materialTypeSchema = z.enum(["pdf", "link"]);

const createMaterialSchema = z
  .object({
    classId: z.uuid("Invalid class ID"),
    title: z.string().trim().min(1, "Title is required"),
    materialType: materialTypeSchema,
    blobUrl: z.url().optional(),
    externalUrl: z.url().optional(),
    originalFileName: z.string().optional(),
    mimeType: z.string().optional(),
    fileSize: z.number().int().positive().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.materialType === "pdf") {
      if (!value.blobUrl) {
        ctx.addIssue({
          path: ["blobUrl"],
          code: z.ZodIssueCode.custom,
          message: "PDF upload URL is required",
        });
      }
      if (value.externalUrl) {
        ctx.addIssue({
          path: ["externalUrl"],
          code: z.ZodIssueCode.custom,
          message: "External URL is not allowed for PDF material",
        });
      }
    }

    if (value.materialType === "link") {
      if (!value.externalUrl) {
        ctx.addIssue({
          path: ["externalUrl"],
          code: z.ZodIssueCode.custom,
          message: "Link URL is required",
        });
      }
      if (value.blobUrl) {
        ctx.addIssue({
          path: ["blobUrl"],
          code: z.ZodIssueCode.custom,
          message: "Blob URL is not allowed for link material",
        });
      }
    }
  });

const updateMaterialSchema = z.object({
  id: z.uuid("Invalid material ID"),
  classId: z.uuid("Invalid class ID"),
  title: z.string().trim().min(1, "Title is required"),
  externalUrl: z.url("Please provide a valid URL").optional(),
});

const deleteMaterialSchema = z.object({
  id: z.uuid("Invalid material ID"),
  classId: z.uuid("Invalid class ID"),
});

async function getOwnedClassTeacherRecord(classId: string, userId: string) {
  const teacherRecord = await db.query.teachers.findFirst({
    where: eq(teachers.userId, userId),
  });

  if (!teacherRecord) {
    throw new Error("Unauthorized: Teacher record not found");
  }

  const classRecord = await db.query.classes.findFirst({
    where: and(eq(classes.id, classId), eq(classes.teacherId, teacherRecord.id)),
  });

  if (!classRecord) {
    throw new Error("Unauthorized: You cannot manage this class");
  }

  return { teacherRecord, classRecord };
}

export const createClassMaterial = permissionAction("material", "create")
  .inputSchema(createMaterialSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { teacherRecord } = await getOwnedClassTeacherRecord(
      parsedInput.classId,
      ctx.session.user.id,
    );

    await db.insert(classMaterials).values({
      classId: parsedInput.classId,
      createdByTeacherId: teacherRecord.id,
      title: parsedInput.title,
      materialType: parsedInput.materialType,
      blobUrl: parsedInput.blobUrl ?? null,
      externalUrl: parsedInput.externalUrl ?? null,
      originalFileName: parsedInput.originalFileName ?? null,
      mimeType: parsedInput.mimeType ?? null,
      fileSize: parsedInput.fileSize ?? null,
    });

    revalidateTag(`class-materials:${parsedInput.classId}`, "minutes");
    revalidateTag(`classes:teacher-user:${ctx.session.user.id}`, "minutes");

    return { success: true };
  });

export const updateClassMaterial = permissionAction("material", "update")
  .inputSchema(updateMaterialSchema)
  .action(async ({ parsedInput, ctx }) => {
    await getOwnedClassTeacherRecord(parsedInput.classId, ctx.session.user.id);

    const materialRecord = await db.query.classMaterials.findFirst({
      where: and(
        eq(classMaterials.id, parsedInput.id),
        eq(classMaterials.classId, parsedInput.classId),
      ),
    });

    if (!materialRecord) {
      throw new Error("Material not found");
    }

    if (materialRecord.materialType === "link" && !parsedInput.externalUrl) {
      throw new Error("Link URL is required for link material");
    }

    await db
      .update(classMaterials)
      .set({
        title: parsedInput.title,
        externalUrl:
          materialRecord.materialType === "link" ? (parsedInput.externalUrl ?? null) : null,
        updatedAt: new Date(),
      })
      .where(eq(classMaterials.id, parsedInput.id));

    revalidateTag(`class-materials:${parsedInput.classId}`, "minutes");
    revalidateTag(`classes:teacher-user:${ctx.session.user.id}`, "minutes");

    return { success: true };
  });

export const deleteClassMaterial = permissionAction("material", "delete")
  .inputSchema(deleteMaterialSchema)
  .action(async ({ parsedInput, ctx }) => {
    await getOwnedClassTeacherRecord(parsedInput.classId, ctx.session.user.id);

    const materialRecord = await db.query.classMaterials.findFirst({
      where: and(
        eq(classMaterials.id, parsedInput.id),
        eq(classMaterials.classId, parsedInput.classId),
      ),
    });

    if (!materialRecord) {
      throw new Error("Material not found");
    }

    if (materialRecord.materialType === "pdf" && materialRecord.blobUrl) {
      await del(materialRecord.blobUrl, {
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
    }

    await db.delete(classMaterials).where(eq(classMaterials.id, parsedInput.id));

    revalidateTag(`class-materials:${parsedInput.classId}`, "minutes");
    revalidateTag(`classes:teacher-user:${ctx.session.user.id}`, "minutes");

    return { success: true };
  });
