import "server-only";
import { eq, desc, ilike, or, count } from "drizzle-orm";
import { headers } from "next/headers";
import { mapToClassDTO, ClassDTO } from "./dto";
import { db } from "@/db";
import { user } from "@/db/schema/auth";
import { classes } from "@/db/schema/classes";
import { teachers } from "@/db/schema/teachers";
import { requirePermission } from "@/features/auth/server/utils";
import { auth } from "@/lib/auth";

export async function getClasses(
  page: number = 1,
  pageSize: number = 10,
  searchQuery?: string,
): Promise<{ data: ClassDTO[]; total: number; pageCount: number }> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized: Only admins can perform this action");
  }

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
  await requirePermission("class", "read");

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
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized: Only admins can perform this action");
  }

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
