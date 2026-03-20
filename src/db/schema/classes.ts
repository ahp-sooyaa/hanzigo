import { relations } from "drizzle-orm";
import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { classMaterials } from "./class-materials";
import { enrollments } from "./enrollments";
import { teachers } from "./teachers";
export const classes = pgTable("classes", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  teacherId: uuid("teacher_id")
    .notNull()
    .references(() => teachers.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const classesRelations = relations(classes, ({ one, many }) => ({
  teacher: one(teachers, {
    fields: [classes.teacherId],
    references: [teachers.id],
  }),
  enrollments: many(enrollments),
  materials: many(classMaterials),
}));
