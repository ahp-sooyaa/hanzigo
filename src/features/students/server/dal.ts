import "server-only";
import { eq, desc } from "drizzle-orm";
import { mapToStudentDTO, StudentDTO } from "./dto";
import { db } from "@/db";
import { user } from "@/db/schema/auth";
import { students } from "@/db/schema/students";
import { requirePermission } from "@/features/auth/server/utils";

export async function getStudents(): Promise<StudentDTO[]> {
  await requirePermission("student", "read");

  const result = await db
    .select({
      id: students.id,
      userId: students.userId,
      createdAt: students.createdAt,
      user: {
        name: user.name,
        email: user.email,
        banned: user.banned,
      },
    })
    .from(students)
    .innerJoin(user, eq(students.userId, user.id))
    .orderBy(desc(students.createdAt));

  return result.map(mapToStudentDTO);
}

export async function getStudentById(id: string): Promise<StudentDTO | null> {
  await requirePermission("student", "read");

  const result = await db
    .select({
      id: students.id,
      userId: students.userId,
      createdAt: students.createdAt,
      user: {
        name: user.name,
        email: user.email,
        banned: user.banned,
      },
    })
    .from(students)
    .innerJoin(user, eq(students.userId, user.id))
    .where(eq(students.id, id))
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  return mapToStudentDTO(result[0]);
}
