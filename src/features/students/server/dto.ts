import { z } from "zod";

export const studentDTOSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  email: z.string(),
  banned: z.boolean(),
  createdAt: z.date(),
});

export type StudentDTO = z.infer<typeof studentDTOSchema>;

export function mapToStudentDTO(data: any): StudentDTO {
  return {
    id: data.id,
    userId: data.userId,
    name: data.user.name,
    email: data.user.email,
    banned: data.user.banned ?? false,
    createdAt: data.createdAt,
  };
}
