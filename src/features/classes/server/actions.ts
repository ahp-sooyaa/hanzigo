"use server";

import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { classes } from "@/db/schema/classes";
import { teachers } from "@/db/schema/teachers";
import { permissionAction } from "@/lib/safe-action";

// 1.3 Validation Schemas
const createClassSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  teacherId: z.uuid("Please select a valid teacher").min(1, "Teacher is required"),
});

const updateClassSchema = z.object({
  id: z.uuid("Invalid class ID"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().nullable().optional(),
  teacherId: z.uuid("Please select a valid teacher").min(1, "Teacher is required"),
});

const deleteClassSchema = z.object({
  id: z.uuid("Invalid class ID"),
});

// 1.4 Server Actions

export const createClass = permissionAction("class", "create")
  .inputSchema(createClassSchema)
  .action(async ({ parsedInput }) => {
    try {
      // Verify the teacher exists
      const teacherRecord = await db.query.teachers.findFirst({
        where: eq(teachers.id, parsedInput.teacherId),
      });

      if (!teacherRecord) {
        throw new Error("Selected teacher does not exist");
      }

      await db.insert(classes).values({
        name: parsedInput.name,
        description: parsedInput.description || null,
        teacherId: parsedInput.teacherId,
      });

      revalidateTag("classes", "minutes");
      revalidateTag(`classes:teacher-user:${teacherRecord.userId}`, "minutes");

      return { success: true };
    } catch (error: any) {
      throw new Error(error.message || "Failed to create class");
    }
  });

export const updateClass = permissionAction("class", "update")
  .inputSchema(updateClassSchema)
  .action(async ({ parsedInput }) => {
    try {
      // Verify the class exists
      const classRecord = await db.query.classes.findFirst({
        where: eq(classes.id, parsedInput.id),
      });

      if (!classRecord) {
        throw new Error("Class not found");
      }

      // Verify the teacher exists
      const teacherRecord = await db.query.teachers.findFirst({
        where: eq(teachers.id, parsedInput.teacherId),
      });

      if (!teacherRecord) {
        throw new Error("Selected teacher does not exist");
      }

      await db
        .update(classes)
        .set({
          name: parsedInput.name,
          description:
            parsedInput.description !== undefined
              ? parsedInput.description
              : classRecord.description,
          teacherId: parsedInput.teacherId,
        })
        .where(eq(classes.id, parsedInput.id));

      revalidateTag("classes", "minutes");
      revalidateTag(`classes:teacher-user:${teacherRecord.userId}`, "minutes");

      return { success: true };
    } catch (error: any) {
      throw new Error(error.message || "Failed to update class");
    }
  });

export const deleteClass = permissionAction("class", "delete")
  .inputSchema(deleteClassSchema)
  .action(async ({ parsedInput }) => {
    try {
      const classRecord = await db.query.classes.findFirst({
        where: eq(classes.id, parsedInput.id),
      });

      if (!classRecord) {
        throw new Error("Class not found");
      }

      const teacherRecord = await db.query.teachers.findFirst({
        where: eq(teachers.id, classRecord.teacherId),
      });

      if (!teacherRecord) {
        throw new Error("Teacher not found");
      }

      await db.delete(classes).where(eq(classes.id, parsedInput.id));

      revalidateTag("classes", "minutes");
      revalidateTag(`classes:teacher-user:${teacherRecord.userId}`, "minutes");

      return { success: true };
    } catch (error: any) {
      throw new Error(error.message || "Failed to delete class");
    }
  });
