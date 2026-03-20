"use server";

import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/db";
import { user } from "@/db/schema/auth";
import { students } from "@/db/schema/students";
import { auth } from "@/lib/auth";
import { permissionAction } from "@/lib/safe-action";

const createStudentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const createStudent = permissionAction("student", "create")
  .inputSchema(createStudentSchema)
  .action(async ({ parsedInput }) => {
    try {
      const newUser = await auth.api.createUser({
        headers: await headers(),
        body: {
          email: parsedInput.email,
          name: parsedInput.name,
          password: parsedInput.password,
          role: "student",
        },
      });

      if (!newUser) {
        throw new Error("Failed to create user account");
      }

      await db.insert(students).values({
        userId: newUser.user.id,
      });

      revalidateTag("students", "max");

      return { success: true };
    } catch (error: any) {
      throw new Error(error.message || "Failed to create student");
    }
  });

const updateStudentSchema = z.object({
  id: z.uuid("Invalid student ID"),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  banned: z.boolean().optional(),
});

export const updateStudent = permissionAction("student", "update")
  .inputSchema(updateStudentSchema)
  .action(async ({ parsedInput }) => {
    try {
      const studentRecord = await db.query.students.findFirst({
        where: eq(students.id, parsedInput.id),
      });

      if (!studentRecord) {
        throw new Error("Student not found");
      }

      if (parsedInput.name !== undefined) {
        await db
          .update(user)
          .set({ name: parsedInput.name })
          .where(eq(user.id, studentRecord.userId));
      }

      if (parsedInput.banned !== undefined) {
        if (parsedInput.banned) {
          await auth.api.banUser({
            headers: await headers(),
            body: { userId: studentRecord.userId },
          });
        } else {
          await auth.api.unbanUser({
            headers: await headers(),
            body: { userId: studentRecord.userId },
          });
        }
      }

      revalidateTag("students", "max");

      return { success: true };
    } catch (error: any) {
      throw new Error(error.message || "Failed to update student");
    }
  });

const deleteStudentSchema = z.object({
  id: z.uuid("Invalid student ID"),
});

export const deleteStudent = permissionAction("student", "delete")
  .inputSchema(deleteStudentSchema)
  .action(async ({ parsedInput }) => {
    try {
      const studentRecord = await db.query.students.findFirst({
        where: eq(students.id, parsedInput.id),
      });

      if (!studentRecord) {
        throw new Error("Student not found");
      }

      await db.delete(user).where(eq(user.id, studentRecord.userId));

      revalidateTag("students", "max");
      revalidateTag(`enrollments:student:${studentRecord.userId}`, "max");

      return { success: true };
    } catch (error: any) {
      throw new Error(error.message || "Failed to delete student");
    }
  });
