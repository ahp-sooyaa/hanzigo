import { z } from "zod";

export const materialTypeSchema = z.enum(["pdf", "link"]);

export const classMaterialDTOSchema = z.object({
  id: z.string(),
  classId: z.string(),
  createdByTeacherId: z.string(),
  title: z.string(),
  materialType: materialTypeSchema,
  blobUrl: z.string().nullable(),
  externalUrl: z.string().nullable(),
  originalFileName: z.string().nullable(),
  mimeType: z.string().nullable(),
  fileSize: z.number().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ClassMaterialDTO = z.infer<typeof classMaterialDTOSchema>;

export function mapToClassMaterialDTO(data: any): ClassMaterialDTO {
  return {
    id: data.id,
    classId: data.classId,
    createdByTeacherId: data.createdByTeacherId,
    title: data.title,
    materialType: data.materialType,
    blobUrl: data.blobUrl ?? null,
    externalUrl: data.externalUrl ?? null,
    originalFileName: data.originalFileName ?? null,
    mimeType: data.mimeType ?? null,
    fileSize: data.fileSize ?? null,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}
