import "server-only";
import { eq, desc } from "drizzle-orm";
import { mapToTeacherDTO, TeacherDTO } from "./dto";
import { db } from "@/db";
import { user } from "@/db/schema/auth";
import { teachers } from "@/db/schema/teachers";
import { requirePermission } from "@/features/auth/server/utils";

export async function getTeachers(): Promise<TeacherDTO[]> {
  await requirePermission("teacher", "read");

  const result = await db
    .select({
      id: teachers.id,
      userId: teachers.userId,
      bio: teachers.bio,
      createdAt: teachers.createdAt,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        banned: user.banned,
      },
    })
    .from(teachers)
    .innerJoin(user, eq(teachers.userId, user.id))
    .orderBy(desc(teachers.createdAt));

  return result.map(mapToTeacherDTO);
}

export async function getTeacherById(id: string): Promise<TeacherDTO | null> {
  await requirePermission("teacher", "read");

  const result = await db
    .select({
      id: teachers.id,
      userId: teachers.userId,
      bio: teachers.bio,
      createdAt: teachers.createdAt,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        banned: user.banned,
      },
    })
    .from(teachers)
    .innerJoin(user, eq(teachers.userId, user.id))
    .where(eq(teachers.id, id))
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  return mapToTeacherDTO(result[0]);
}
