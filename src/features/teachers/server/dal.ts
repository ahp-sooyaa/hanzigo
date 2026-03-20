import "server-only";
import { eq, desc } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { mapToTeacherDTO, TeacherDTO } from "./dto";
import { db } from "@/db";
import { user } from "@/db/schema/auth";
import { teachers } from "@/db/schema/teachers";

export async function getTeachers(): Promise<TeacherDTO[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("teachers");

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

// detail page not exist yet
// export async function getTeacherById(id: string): Promise<TeacherDTO | null> {
//   "use cache";
//   cacheLife("minutes");
//   cacheTag("teachers", `teachers:${id}`);

//   const result = await db
//     .select({
//       id: teachers.id,
//       userId: teachers.userId,
//       bio: teachers.bio,
//       createdAt: teachers.createdAt,
//       user: {
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         banned: user.banned,
//       },
//     })
//     .from(teachers)
//     .innerJoin(user, eq(teachers.userId, user.id))
//     .where(eq(teachers.id, id))
//     .limit(1);

//   if (result.length === 0) {
//     return null;
//   }

//   return mapToTeacherDTO(result[0]);
// }
