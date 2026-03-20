"use server";

import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/db";
import { user } from "@/db/schema/auth";
import { teachers } from "@/db/schema/teachers";
import { auth } from "@/lib/auth";
import { permissionAction } from "@/lib/safe-action";

// 2.2 Implement `createTeacher` action
const createTeacherSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  bio: z.string().optional(),
});

export const createTeacher = permissionAction("teacher", "create")
  .inputSchema(createTeacherSchema)
  .action(async ({ parsedInput }) => {
    try {
      // 1. Create User via BetterAuth Admin API
      // Use createUser if adminCreateUser is missing from types, but admin plugin might export adminCreateUser
      const newUser = await auth.api.createUser({
        headers: await headers(),
        body: {
          email: parsedInput.email,
          name: parsedInput.name,
          password: parsedInput.password,
          role: "teacher",
        },
      });

      if (!newUser) {
        throw new Error("Failed to create user account");
      }

      // 2. Create Teacher record
      await db.insert(teachers).values({
        userId: newUser.user.id,
        bio: parsedInput.bio || null,
      });

      revalidateTag("teachers", "max");

      return { success: true };
    } catch (error: any) {
      throw new Error(error.message || "Failed to create teacher");
    }
  });

// 2.3 Implement `updateTeacher` action
const updateTeacherSchema = z.object({
  id: z.uuid("Invalid teacher ID"),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  bio: z.string().nullable().optional(),
  banned: z.boolean().optional(),
});

export const updateTeacher = permissionAction("teacher", "update")
  .inputSchema(updateTeacherSchema)
  .action(async ({ parsedInput }) => {
    try {
      // Get teacher to find the userId
      const teacherRecord = await db.query.teachers.findFirst({
        where: eq(teachers.id, parsedInput.id),
      });

      if (!teacherRecord) {
        throw new Error("Teacher not found");
      }

      // Update User if needed
      if (parsedInput.name !== undefined || parsedInput.banned !== undefined) {
        if (parsedInput.name !== undefined) {
          await db
            .update(user)
            .set({
              name: parsedInput.name,
            })
            .where(eq(user.id, teacherRecord.userId));
        }

        if (parsedInput.banned !== undefined) {
          if (parsedInput.banned) {
            await auth.api.banUser({
              headers: await headers(),
              body: { userId: teacherRecord.userId },
            });
          } else {
            await auth.api.unbanUser({
              headers: await headers(),
              body: { userId: teacherRecord.userId },
            });
          }
        }
      }

      // Update Teacher specific info
      if (parsedInput.bio !== undefined) {
        await db
          .update(teachers)
          .set({
            bio: parsedInput.bio,
          })
          .where(eq(teachers.id, parsedInput.id));
      }

      revalidateTag("teachers", "max");

      return { success: true };
    } catch (error: any) {
      throw new Error(error.message || "Failed to update teacher");
    }
  });

// 2.4 Implement `deleteTeacher` action
const deleteTeacherSchema = z.object({
  id: z.uuid("Invalid teacher ID"),
});

export const deleteTeacher = permissionAction("teacher", "delete")
  .inputSchema(deleteTeacherSchema)
  .action(async ({ parsedInput }) => {
    try {
      const teacherRecord = await db.query.teachers.findFirst({
        where: eq(teachers.id, parsedInput.id),
      });

      if (!teacherRecord) {
        throw new Error("Teacher not found");
      }

      // Delete the user account.
      // Drizzle cascades should delete the teacher record from `teachers` table.
      await db.delete(user).where(eq(user.id, teacherRecord.userId));

      revalidateTag("teachers", "max");
      revalidateTag(`classes:teacher:${teacherRecord.userId}`, "max");

      return { success: true };
    } catch (error: any) {
      throw new Error(error.message || "Failed to delete teacher");
    }
  });
