## Context

The Hanzigo LMS needs a core data model to represent educational entities: students, teachers, classes, and their enrollments. While an authentication system (BetterAuth) is in place, the application lacks the domain-specific tables required to manage class assignments and student enrollment processes.

## Goals / Non-Goals

**Goals:**
- Define PostgreSQL database tables for `students`, `teachers`, `classes`, and `enrollments` using Drizzle ORM.
- Adhere to the project rule of one file per table within the `src/db/schema/` directory.
- Establish relationships between entities (e.g., a class has one teacher, a class has many enrollments, a student has many enrollments).

**Non-Goals:**
- Implementing payment processing or tracking for enrollments (explicitly excluded for v1).
- Expanding role-based access control logic beyond the existing BetterAuth admin plugin limits.

## Decisions

**Decision 1: Separate domain tables from core `user` auth table**
- *Rationale*: BetterAuth manages the `user` table. To avoid cluttering the auth schema and support domain-specific fields (e.g., teacher bios, student levels), we will create dedicated `students` and `teachers` tables. These will reference the auth `user.id` for identity, ensuring clean separation of concerns.

**Decision 2: One Table Per File Architecture**
- *Rationale*: Enforced by project rules. We will structure the schema into `students.ts`, `teachers.ts`, `classes.ts`, and `enrollments.ts`, relying on Drizzle's `relations` API to map joins, and export everything from `src/db/schema/index.ts`.

**Decision 3: UUID Primary Keys**
- *Rationale*: Standardizing on UUIDs for primary keys in new domain tables prevents ID enumeration and aligns with Postgres best practices for primary identifiers.

## Risks / Trade-offs

- **[Risk] Syncing Teacher/Student profiles with Auth Users** → *Mitigation*: Ensure robust foreign key constraints (`userId` linking to `user.id` with `onDelete: 'cascade'`) so that deleting a user account properly cleans up associated domain profiles.
- **[Risk] N+1 Query Performance** → *Mitigation*: We will define Drizzle relations for all tables so the application can utilize `db.query.classes.findMany({ with: { teacher: true, enrollments: true } })` for efficient data loading.
