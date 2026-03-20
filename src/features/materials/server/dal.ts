import "server-only";
import { and, asc, desc, eq, ilike, or } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { mapToClassMaterialDTO } from "./dto";
import { db } from "@/db";
import { classMaterials } from "@/db/schema/class-materials";
import { classes } from "@/db/schema/classes";
import { enrollments } from "@/db/schema/enrollments";
import { students } from "@/db/schema/students";
import { teachers } from "@/db/schema/teachers";
import { MaterialFilter, MaterialSort } from "@/features/materials/types";

interface TeacherClassMaterialsOptions {
  q?: string;
  type?: MaterialFilter;
  sort?: MaterialSort;
}

export async function getTeacherClassMaterials(
  classId: string,
  userId: string,
  options?: TeacherClassMaterialsOptions,
) {
  "use cache";
  cacheLife("minutes");
  cacheTag(`class-materials:${classId}`);

  const teacherRecord = await db.query.teachers.findFirst({
    where: eq(teachers.userId, userId),
  });
  if (!teacherRecord) return [];

  const classRecord = await db.query.classes.findFirst({
    where: and(eq(classes.id, classId), eq(classes.teacherId, teacherRecord.id)),
  });
  if (!classRecord) return [];

  const query = options?.q?.trim();
  const type = options?.type ?? "all";
  const sort = options?.sort ?? "newest";

  const whereConditions = [eq(classMaterials.classId, classId)];

  if (type === "documents") {
    whereConditions.push(eq(classMaterials.materialType, "pdf"));
  } else if (type === "links") {
    whereConditions.push(eq(classMaterials.materialType, "link"));
  }

  if (query) {
    const searchCondition = or(
      ilike(classMaterials.title, `%${query}%`),
      ilike(classMaterials.originalFileName, `%${query}%`),
      ilike(classMaterials.externalUrl, `%${query}%`),
    );

    if (searchCondition) {
      whereConditions.push(searchCondition);
    }
  }

  const result = await db
    .select()
    .from(classMaterials)
    .where(and(...whereConditions))
    .orderBy(sort === "newest" ? desc(classMaterials.createdAt) : asc(classMaterials.createdAt));

  return result.map(mapToClassMaterialDTO);
}

interface StudentClassMaterialsOptions {
  q?: string;
  type?: MaterialFilter;
  sort?: MaterialSort;
}

export async function getStudentClassMaterials(
  classId: string,
  userId: string,
  options?: StudentClassMaterialsOptions,
) {
  "use cache";
  cacheLife("minutes");
  cacheTag(`class-materials:${classId}`);

  const studentRecord = await db.query.students.findFirst({
    where: eq(students.userId, userId),
  });

  if (!studentRecord) return [];

  const enrollmentRecord = await db.query.enrollments.findFirst({
    where: and(eq(enrollments.classId, classId), eq(enrollments.studentId, studentRecord.id)),
  });

  if (!enrollmentRecord) return [];

  const query = options?.q?.trim();
  const type = options?.type ?? "all";
  const sort = options?.sort ?? "newest";

  const whereConditions = [eq(classMaterials.classId, classId)];

  if (type === "documents") {
    whereConditions.push(eq(classMaterials.materialType, "pdf"));
  } else if (type === "links") {
    whereConditions.push(eq(classMaterials.materialType, "link"));
  }

  if (query) {
    const searchCondition = or(
      ilike(classMaterials.title, `%${query}%`),
      ilike(classMaterials.originalFileName, `%${query}%`),
      ilike(classMaterials.externalUrl, `%${query}%`),
    );

    if (searchCondition) {
      whereConditions.push(searchCondition);
    }
  }

  const result = await db
    .select()
    .from(classMaterials)
    .where(and(...whereConditions))
    .orderBy(sort === "newest" ? desc(classMaterials.createdAt) : asc(classMaterials.createdAt));

  return result.map(mapToClassMaterialDTO);
}
