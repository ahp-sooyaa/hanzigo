import { z } from "zod";

export const classDTOSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  teacherId: z.string(),
  teacherName: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ClassDTO = z.infer<typeof classDTOSchema>;

export function mapToClassDTO(data: any): ClassDTO {
  return {
    id: data.id,
    name: data.name,
    description: data.description || null,
    teacherId: data.teacherId,
    teacherName: data.teacherName ?? null,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}
