## Why

The school requires a robust database structure to manage core educational entities: students, teachers, classes, and class enrollments. This foundational schema enables all subsequent features for class management and student participation in the Learning Management System (LMS).

## What Changes

- Create a `students` table to store student profiles and metadata.
- Create a `teachers` table to store teacher profiles, linking them to auth records if applicable.
- Create a `classes` table to manage class details (name, description, assigned teacher).
- Create an `enrollments` table (many-to-many relationship) to track student enrollments in classes.
- Export all new definitions through the central `src/db/schema/index.ts`.

## Capabilities

### New Capabilities
- `school-entities`: Core data models for managing students, teachers, classes, and their relationships.

### Modified Capabilities

## Impact

- **Database:** New tables added to the Neon PostgreSQL database via Drizzle ORM.
- **Codebase:** New schema files in `src/db/schema/` (following the one-file-per-table rule).
