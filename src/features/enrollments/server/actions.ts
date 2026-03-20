"use server";

import { and, eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { classes } from "@/db/schema/classes";
import { enrollments } from "@/db/schema/enrollments";
import { students } from "@/db/schema/students";
import { permissionAction } from "@/lib/safe-action";

const enrollmentSchema = z.object({
  studentId: z.uuid("Invalid student ID"),
  classId: z.uuid("Invalid class ID"),
});

export const createEnrollment = permissionAction("enrollment", "create")
  .inputSchema(enrollmentSchema)
  .action(async ({ parsedInput }) => {
    try {
      const studentRecord = await db.query.students.findFirst({
        where: eq(students.id, parsedInput.studentId),
      });
      if (!studentRecord) {
        throw new Error("Student not found");
      }

      const classRecord = await db.query.classes.findFirst({
        where: eq(classes.id, parsedInput.classId),
      });
      if (!classRecord) {
        throw new Error("Class not found");
      }

      const existing = await db.query.enrollments.findFirst({
        where: and(
          eq(enrollments.studentId, parsedInput.studentId),
          eq(enrollments.classId, parsedInput.classId),
        ),
      });
      if (existing) {
        throw new Error("Student is already enrolled in this class");
      }

      await db.insert(enrollments).values({
        studentId: parsedInput.studentId,
        classId: parsedInput.classId,
      });

      revalidateTag(`enrollments:student:${studentRecord.userId}`, "max");

      return { success: true };
    } catch (error: any) {
      throw new Error(error.message || "Failed to enroll student");
    }
  });

export const deleteEnrollment = permissionAction("enrollment", "delete")
  .inputSchema(enrollmentSchema)
  .action(async ({ parsedInput }) => {
    try {
      const studentRecord = await db.query.students.findFirst({
        where: eq(students.id, parsedInput.studentId),
      });

      if (!studentRecord) {
        throw new Error("Student not found");
      }

      await db
        .delete(enrollments)
        .where(
          and(
            eq(enrollments.studentId, parsedInput.studentId),
            eq(enrollments.classId, parsedInput.classId),
          ),
        );

      revalidateTag(`enrollments:student:${studentRecord.userId}`, "max");

      return { success: true };
    } catch (error: any) {
      throw new Error(error.message || "Failed to unenroll student");
    }
  });
