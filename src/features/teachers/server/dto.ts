import { z } from "zod";

export const teacherDTOSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  email: z.string(),
  bio: z.string().nullable(),
  role: z.string().nullable(),
  banned: z.boolean(),
  createdAt: z.date(),
});

export type TeacherDTO = z.infer<typeof teacherDTOSchema>;

export function mapToTeacherDTO(data: any): TeacherDTO {
  return {
    id: data.id,
    userId: data.userId,
    name: data.user.name,
    email: data.user.email,
    bio: data.bio,
    role: data.user.role,
    banned: data.user.banned ?? false,
    createdAt: data.createdAt,
  };
}
