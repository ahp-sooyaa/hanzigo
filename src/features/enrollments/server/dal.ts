import "server-only";
import { and, desc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { EnrollmentClassDTO, mapToEnrollmentClassDTO } from "./dto";
import { db } from "@/db";
import { user } from "@/db/schema/auth";
import { classes } from "@/db/schema/classes";
import { enrollments } from "@/db/schema/enrollments";
import { students } from "@/db/schema/students";
import { teachers } from "@/db/schema/teachers";

export async function getEnrollmentsByStudentUserId(userId: string): Promise<EnrollmentClassDTO[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(`enrollments:student:${userId}`);

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

  return result.map(mapToEnrollmentClassDTO);
}

export async function getClassOptionsForEnrollment(): Promise<EnrollmentClassDTO[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("classes");

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
    .orderBy(classes.name);

  return result.map(mapToEnrollmentClassDTO);
}

export async function getClassesForTeacherUserId(userId: string): Promise<EnrollmentClassDTO[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(`classes:teacher:${userId}`);

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

  return result.map(mapToEnrollmentClassDTO);
}

export async function getStudentEnrolledClassById(
  userId: string,
  classId: string,
): Promise<EnrollmentClassDTO | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag(`classes:${classId}`, `enrollments:student:${userId}`);

  const studentRecord = await db.query.students.findFirst({
    where: eq(students.userId, userId),
  });

  if (!studentRecord) return null;

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
    .where(and(eq(enrollments.studentId, studentRecord.id), eq(classes.id, classId)))
    .limit(1);

  if (result.length === 0) return null;

  return mapToEnrollmentClassDTO(result[0]);
}
