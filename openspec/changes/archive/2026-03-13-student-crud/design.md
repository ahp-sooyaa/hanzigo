## Context

The Hanzigo LMS has a complete admin interface for managing teachers and classes. Students are a core entity in the system — already defined in the database schema (`src/db/schema/students.ts`) and linked to the `user` table via `userId`. However, there is currently no admin UI or server-side logic to create, view, update, or delete student accounts. This change fills that gap by following the same established patterns used for teachers.

## Goals / Non-Goals

**Goals:**
- Implement admin-only Student CRUD following the same DAL → DTO → Server Action → UI component layering used in `src/features/teachers`.
- Create `src/features/students/server/dal.ts`, `dto.ts`, and `actions.ts`.
- Create UI components: `StudentTable`, `StudentForm`, `CreateStudentDialog`, `EditStudentDialog`, `DeleteStudentAlert`.
- Add an admin page at `src/app/admin/students/page.tsx`.
- Use `next-safe-action` with `adminActionClient` and Zod `.inputSchema()` for all mutations.
- Use `better-auth` `auth.api.createUser` with role `"student"` when creating a new student account.
- Follow the ban/unban pattern from teachers for toggling student account status.
- Tag all cached data with `"students"` and invalidate via `revalidateTag`.

**Non-Goals:**
- Student self-registration or self-management flows.
- Enrollment management (tracked separately in `enrollments`).
- Payment or billing features.
- Any student-facing course browsing UI changes.

## Decisions

### 1. Mirror the Teacher Feature Structure Exactly
**Decision**: `src/features/students/` mirrors `src/features/teachers/` with identical file layout and patterns.
**Rationale**: Consistency reduces cognitive load. Any developer familiar with the teacher feature can immediately navigate the student feature. Diverging patterns (e.g., putting auth calls in the DAL) would create confusing inconsistencies.
**Alternative considered**: Sharing a generic `user-crud` abstraction. Rejected because teachers have a `bio` field and specific role logic; a shared abstraction would add complexity for marginal gain.

### 2. Student Profile Fields
**Decision**: The `StudentDTO` exposes `id`, `userId`, `name`, `email`, `banned`, and `createdAt`. No extra profile fields are added (the schema has none).
**Rationale**: The `students` table only has `id`, `userId`, `createdAt`, and `updatedAt`. There is no `bio` or equivalent. Adding fields would require a schema migration out of scope for this change.

### 3. Account Creation via BetterAuth Admin API
**Decision**: Use `auth.api.createUser` with `role: "student"` to create the user account, then insert a corresponding row in `students`.
**Rationale**: Keeps auth (password hashing, session management) in BetterAuth's domain. Mirrors the exact approach used for teachers.

### 4. Deletion Cascades via DB
**Decision**: Delete the `user` record and rely on the `onDelete: "cascade"` constraint on `students.userId` to automatically remove the `students` row.
**Rationale**: The schema already defines this cascade. Preserves data integrity without needing an explicit second delete call, consistent with the teacher deletion pattern.

## Risks / Trade-offs

- **Accidental teacher/student confusion**: A student user has role `"student"`. If an admin accidentally creates a student with the wrong role, they would have incorrect permissions. → *Mitigation*: The `createStudent` server action hardcodes `role: "student"` — it is never taken from user input.
- **No email uniqueness validation at the action layer**: BetterAuth will throw if the email is already taken, which is surfaced as a `serverError` toast. → *Mitigation*: Already handled by the `onError` handler in the form component (same as teacher flow).
