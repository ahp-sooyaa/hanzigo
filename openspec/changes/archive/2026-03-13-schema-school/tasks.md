## 1. Database Schema Definitions

- [x] 1.1 Create `src/db/schema/students.ts` with `students` table and `user` relationship
- [x] 1.2 Create `src/db/schema/teachers.ts` with `teachers` table and `user` relationship
- [x] 1.3 Create `src/db/schema/classes.ts` with `classes` table and `teacher` reference
- [x] 1.4 Create `src/db/schema/enrollments.ts` with `enrollments` table (linking student and class)

## 2. Schema Export and Relations

- [x] 2.1 Define Drizzle relations in each respective file
- [x] 2.2 Export all new tables and relations from `src/db/schema/index.ts`

## 3. Database Migration

- [x] 3.1 Run `bun run db:generate` to generate migration files
- [x] 3.2 Run `bun run db:push` to apply changes to the database
