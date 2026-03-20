import { z } from "zod";

export const enrollmentClassDTOSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  teacherName: z.string().nullable(),
});

export type EnrollmentClassDTO = z.infer<typeof enrollmentClassDTOSchema>;

export function mapToEnrollmentClassDTO(data: any): EnrollmentClassDTO {
  return {
    id: data.id,
    name: data.name,
    description: data.description ?? null,
    teacherName: data.teacherName ?? null,
  };
}
