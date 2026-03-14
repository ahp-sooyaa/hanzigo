import "server-only";
import { desc, eq, inArray } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db";
import { user } from "@/db/schema/auth";
import { classes } from "@/db/schema/classes";
import { enrollments } from "@/db/schema/enrollments";
import { students } from "@/db/schema/students";
import { teachers } from "@/db/schema/teachers";

export interface EnrollmentClassInfo {
  classId: string;
  className: string;
  teacherName: string | null;
}

export interface ClassSummary {
  id: string;
  name: string;
  description: string | null;
  teacherName: string | null;
}

export async function getEnrollmentsByStudentIds(
  studentIds: string[],
): Promise<Record<string, EnrollmentClassInfo[]>> {
  "use cache";
  cacheLife("minutes");
  for (const studentId of studentIds) {
    cacheTag(`enrollments:student:${studentId}`);
  }

  if (studentIds.length === 0) return {};

  const result = await db
    .select({
      studentId: enrollments.studentId,
      classId: classes.id,
      className: classes.name,
      teacherName: user.name,
    })
    .from(enrollments)
    .innerJoin(classes, eq(enrollments.classId, classes.id))
    .innerJoin(teachers, eq(classes.teacherId, teachers.id))
    .innerJoin(user, eq(teachers.userId, user.id))
    .where(inArray(enrollments.studentId, studentIds))
    .orderBy(desc(classes.createdAt));

  const map: Record<string, EnrollmentClassInfo[]> = {};
  for (const row of result) {
    if (!map[row.studentId]) map[row.studentId] = [];
    map[row.studentId].push({
      classId: row.classId,
      className: row.className,
      teacherName: row.teacherName ?? null,
    });
  }
  return map;
}

export async function getClassOptionsForEnrollment(): Promise<
  { id: string; name: string; teacherName: string | null }[]
> {
  "use cache";
  cacheLife("minutes");
  cacheTag("classes");

  const result = await db
    .select({
      id: classes.id,
      name: classes.name,
      teacherName: user.name,
    })
    .from(classes)
    .innerJoin(teachers, eq(classes.teacherId, teachers.id))
    .innerJoin(user, eq(teachers.userId, user.id))
    .orderBy(classes.name);

  return result.map((row) => ({
    id: row.id,
    name: row.name,
    teacherName: row.teacherName ?? null,
  }));
}

export async function getClassesForStudentUser(userId: string): Promise<ClassSummary[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(`enrollments:user:${userId}`);

  const studentRecord = await db.query.students.findFirst({
    where: eq(students.userId, userId),
  });

  if (!studentRecord) return [];

  const result = await db
    .select({
      id: classes.id,
      name: classes.name,
      description: classes.description,
      teacherName: user.name,
    })
    .from(enrollments)
    .innerJoin(classes, eq(enrollments.classId, classes.id))
    .innerJoin(teachers, eq(classes.teacherId, teachers.id))
    .innerJoin(user, eq(teachers.userId, user.id))
    .where(eq(enrollments.studentId, studentRecord.id))
    .orderBy(desc(classes.createdAt));

  return result.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description ?? null,
    teacherName: row.teacherName ?? null,
  }));
}

export async function getClassesForTeacherUser(userId: string): Promise<ClassSummary[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(`classes:teacher-user:${userId}`);

  const teacherRecord = await db.query.teachers.findFirst({
    where: eq(teachers.userId, userId),
  });

  if (!teacherRecord) return [];

  const result = await db
    .select({
      id: classes.id,
      name: classes.name,
      description: classes.description,
      teacherName: user.name,
    })
    .from(classes)
    .innerJoin(teachers, eq(classes.teacherId, teachers.id))
    .innerJoin(user, eq(teachers.userId, user.id))
    .where(eq(classes.teacherId, teacherRecord.id))
    .orderBy(desc(classes.createdAt));

  console.log("classes for teacher user", result);

  return result.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description ?? null,
    teacherName: row.teacherName ?? null,
  }));
}
