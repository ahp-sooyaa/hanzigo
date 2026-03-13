## Context

The Hanzigo LMS requires a functional administrative dashboard to manage school operations. A core entity in the system is the `Teacher`. Currently, we have the PostgreSQL database schema for `teachers` implemented via Drizzle ORM, but no user interface or server-side API to interact with this data securely. The Admin persona needs a way to create, read, update, and delete (CRUD) teacher records.

## Goals / Non-Goals

**Goals:**
- Implement a secure, performant CRUD interface for Admins to manage teachers.
- Ensure all data mutations are handled by strictly typed Server Actions using `next-safe-action` and Zod for validation.
- Implement the Data Access Layer (DAL) and Data Transfer Object (DTO) pattern to prevent leaking raw database objects to the client.
- Use strictly typed Next.js App Router features (Server Components with `use cache` for queries, Client Components only for forms/interactivity).

**Non-Goals:**
- Building the Teacher's own dashboard or login flow (this is for Admins to manage teacher *records* only, not the teacher-facing app).
- Complex bulk import/export functionalities (out of scope for initial CRUD).

## Decisions

1.  **Architecture:** Follow the Feature-Sliced structure. All teacher-related code will reside in `src/features/teachers/`. We will have:
    - `src/features/teachers/components/` for UI (e.g., `TeacherForm`, `TeacherList`).
    - `src/features/teachers/server/actions.ts` for Server Actions (mutations).
    - `src/features/teachers/server/dal.ts` for data access.
2.  **Mutations:** Use `next-safe-action` with `.inputSchema()` for all actions (`createTeacher`, `updateTeacher`, `deleteTeacher`).
3.  **Authorization:** Every server action and private API route will explicitly check `session.user.role === 'admin'` using BetterAuth.
4.  **UI Components:** Use standard or specific shadcn/ui components (Table, Dialog, Input, Button) but NEVER use `react-hook-form` or `shadcn/ui` Form components. Use native HTML forms, standard React state, or simple controlled/uncontrolled inputs integrated directly with Server Actions.

## Risks / Trade-offs

-   [Risk] **Insecure Direct Object Reference (IDOR) or Unauthorized Access:** Malicious users might try to access or mutate teacher records without admin privileges.
    -   *Mitigation:* Strict role authorization checks using BetterAuth at the very beginning of *every* server action and data fetching function.
-   [Risk] **Data Leaks via Server Components:** Accidentally passing raw database objects with sensitive fields to the UI.
    -   *Mitigation:* Implement explicit DTO mapping functions (e.g., `mapToTeacherDTO(dbTeacher)`) and only pass DTOs to UI components.
