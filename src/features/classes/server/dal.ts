import "server-only";
import { eq, desc, ilike, or, count } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { mapToClassDTO, ClassDTO } from "./dto";
import { db } from "@/db";
import { user } from "@/db/schema/auth";
import { classes } from "@/db/schema/classes";
import { teachers } from "@/db/schema/teachers";

export async function getClasses(
  page: number = 1,
  pageSize: number = 10,
  searchQuery?: string,
): Promise<{ data: ClassDTO[]; total: number; pageCount: number }> {
  "use cache";
  cacheLife("minutes");
  cacheTag("classes");

  const offset = (page - 1) * pageSize;

  let whereClause = undefined;
  if (searchQuery) {
    whereClause = or(
      ilike(classes.name, `%${searchQuery}%`),
      ilike(classes.description, `%${searchQuery}%`),
      ilike(user.name, `%${searchQuery}%`),
    );
  }

  // Get total count for pagination
  const [{ value: totalCount }] = await db
    .select({ value: count() })
    .from(classes)
    .innerJoin(teachers, eq(classes.teacherId, teachers.id))
    .innerJoin(user, eq(teachers.userId, user.id))
    .where(whereClause);

  const result = await db
    .select({
      id: classes.id,
      name: classes.name,
      description: classes.description,
      teacherId: classes.teacherId,
      createdAt: classes.createdAt,
      updatedAt: classes.updatedAt,
      teacherName: user.name,
    })
    .from(classes)
    .innerJoin(teachers, eq(classes.teacherId, teachers.id))
    .innerJoin(user, eq(teachers.userId, user.id))
    .where(whereClause)
    .orderBy(desc(classes.createdAt))
    .limit(pageSize)
    .offset(offset);

  return {
    data: result.map(mapToClassDTO),
    total: totalCount,
    pageCount: Math.ceil(totalCount / pageSize),
  };
}

export async function getClassById(id: string): Promise<ClassDTO | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag("classes");

  const result = await db
    .select({
      id: classes.id,
      name: classes.name,
      description: classes.description,
      teacherId: classes.teacherId,
      createdAt: classes.createdAt,
      updatedAt: classes.updatedAt,
      teacherName: user.name,
    })
    .from(classes)
    .innerJoin(teachers, eq(classes.teacherId, teachers.id))
    .innerJoin(user, eq(teachers.userId, user.id))
    .where(eq(classes.id, id))
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  return mapToClassDTO(result[0]);
}

export async function getAllTeachersForDropdown() {
  "use cache";
  cacheLife("minutes");
  cacheTag("teachers");

  const result = await db
    .select({
      id: teachers.id,
      name: user.name,
    })
    .from(teachers)
    .innerJoin(user, eq(teachers.userId, user.id))
    .orderBy(user.name);

  return result;
}
