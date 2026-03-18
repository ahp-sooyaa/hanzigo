import "server-only";
import { and, desc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { mapToClassMaterialDTO } from "./dto";
import { db } from "@/db";
import { classMaterials } from "@/db/schema/class-materials";
import { classes } from "@/db/schema/classes";
import { enrollments } from "@/db/schema/enrollments";
import { students } from "@/db/schema/students";
import { teachers } from "@/db/schema/teachers";

async function getTeacherIdByUserId(userId: string) {
  const teacherRecord = await db.query.teachers.findFirst({
    where: eq(teachers.userId, userId),
  });

  return teacherRecord?.id ?? null;
}

export async function getTeacherClassMaterials(classId: string, userId: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag(`class-materials:${classId}`);
  cacheTag(`classes:teacher-user:${userId}`);

  const teacherId = await getTeacherIdByUserId(userId);
  if (!teacherId) return [];

  const classRecord = await db.query.classes.findFirst({
    where: and(eq(classes.id, classId), eq(classes.teacherId, teacherId)),
  });
  if (!classRecord) return [];

  const result = await db
    .select()
    .from(classMaterials)
    .where(eq(classMaterials.classId, classId))
    .orderBy(desc(classMaterials.createdAt));

  return result.map(mapToClassMaterialDTO);
}

export async function getTeacherIdForOwnedClass(classId: string, userId: string) {
  const teacherId = await getTeacherIdByUserId(userId);
  if (!teacherId) return null;

  const classRecord = await db.query.classes.findFirst({
    where: and(eq(classes.id, classId), eq(classes.teacherId, teacherId)),
  });

  if (!classRecord) return null;
  return teacherId;
}

export async function getStudentClassMaterials(classId: string, userId: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag(`class-materials:${classId}`);
  cacheTag(`enrollments:user:${userId}`);

  const studentRecord = await db.query.students.findFirst({
    where: eq(students.userId, userId),
  });

  if (!studentRecord) return [];

  const enrollmentRecord = await db.query.enrollments.findFirst({
    where: and(eq(enrollments.classId, classId), eq(enrollments.studentId, studentRecord.id)),
  });

  if (!enrollmentRecord) return [];

  const result = await db
    .select()
    .from(classMaterials)
    .where(eq(classMaterials.classId, classId))
    .orderBy(desc(classMaterials.createdAt));

  return result.map(mapToClassMaterialDTO);
}
