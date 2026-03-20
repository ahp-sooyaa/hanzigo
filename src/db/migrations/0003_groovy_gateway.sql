CREATE TABLE "class_materials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"class_id" uuid NOT NULL,
	"created_by_teacher_id" uuid NOT NULL,
	"title" text NOT NULL,
	"material_type" text NOT NULL,
	"blob_url" text,
	"external_url" text,
	"original_file_name" text,
	"mime_type" text,
	"file_size" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "class_materials_type_check" CHECK ("class_materials"."material_type" IN ('pdf', 'link')),
	CONSTRAINT "class_materials_payload_check" CHECK ((
        ("class_materials"."material_type" = 'pdf' AND "class_materials"."blob_url" IS NOT NULL AND "class_materials"."external_url" IS NULL)
        OR
        ("class_materials"."material_type" = 'link' AND "class_materials"."external_url" IS NOT NULL AND "class_materials"."blob_url" IS NULL)
      ))
);
--> statement-breakpoint
ALTER TABLE "class_materials" ADD CONSTRAINT "class_materials_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_materials" ADD CONSTRAINT "class_materials_created_by_teacher_id_teachers_id_fk" FOREIGN KEY ("created_by_teacher_id") REFERENCES "public"."teachers"("id") ON DELETE cascade ON UPDATE no action;
