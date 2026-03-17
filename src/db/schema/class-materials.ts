import { relations, sql } from "drizzle-orm";
import { check, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { classes } from "./classes";
import { teachers } from "./teachers";

export const classMaterials = pgTable(
  "class_materials",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    classId: uuid("class_id")
      .notNull()
      .references(() => classes.id, { onDelete: "cascade" }),
    createdByTeacherId: uuid("created_by_teacher_id")
      .notNull()
      .references(() => teachers.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    materialType: text("material_type").notNull(),
    blobUrl: text("blob_url"),
    externalUrl: text("external_url"),
    originalFileName: text("original_file_name"),
    mimeType: text("mime_type"),
    fileSize: integer("file_size"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => [
    check("class_materials_type_check", sql`${table.materialType} IN ('pdf', 'link')`),
    check(
      "class_materials_payload_check",
      sql`(
        (${table.materialType} = 'pdf' AND ${table.blobUrl} IS NOT NULL AND ${table.externalUrl} IS NULL)
        OR
        (${table.materialType} = 'link' AND ${table.externalUrl} IS NOT NULL AND ${table.blobUrl} IS NULL)
      )`,
    ),
  ],
);

export const classMaterialsRelations = relations(classMaterials, ({ one }) => ({
  class: one(classes, {
    fields: [classMaterials.classId],
    references: [classes.id],
  }),
  teacher: one(teachers, {
    fields: [classMaterials.createdByTeacherId],
    references: [teachers.id],
  }),
}));
