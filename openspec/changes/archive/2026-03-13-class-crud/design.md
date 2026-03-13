## Context

The Hanzigo LMS needs a way for administrators to manage `classes` and assign teachers to them. The database schema for `classes` already exists (`src/db/schema/classes.ts`) with a one-to-many relationship where each class has one assigned `teacherId`. 
We need to implement the full CRUD flow (Create, Read, Update, Delete) for these classes while adhering to the project's strict architecture: React Server Components for the UI, Data Access Layer (DAL) for database queries, Data Transfer Objects (DTO) to sanitize data, and Server Actions (`next-safe-action`) for all mutations.

## Goals / Non-Goals

**Goals:**
- Implement the DAL and DTO for `classes`.
- Implement `next-safe-action` Server Actions for creating, updating, and deleting classes.
- Implement the admin UI for listing classes with pagination/search.
- Implement a form to create/edit classes, featuring a way to select an existing teacher to assign to the class.
- Sanitize all database returns using DTOs so raw teacher or class records don't leak unneeded database info to the client.

**Non-Goals:**
- Changing the existing `classes` schema to support many-to-many teachers (currently it's one class to one teacher, which is sufficient for v1).
- Student enrollment management (that will be handled in a separate feature).

## Decisions

- **Routing & Structure**: Following the Feature-Sliced design, everything will reside in `src/features/classes`. We will have `src/features/classes/server/actions.ts` for mutations, `src/features/classes/server/dal.ts` for fetching, and `src/features/classes/components/` for the UI.
- **Form Handling**: We will not use `react-hook-form` or `shadcn/ui` Form components, as per project rules. We will use native HTML forms (`<form action={execute}>`) integrated directly with `useAction` from `next-safe-action`.
- **Teacher Selection**: The Create/Edit Class form needs a list of teachers to populate a `<select>` dropdown. The form will be a Client Component (`"use client"`) using the "Donut Pattern", while the teacher list will be fetched server-side and passed as a prop, or the entire form will just be a client component receiving the list.
- **Caching**: We will use the `"use cache"` directive for fetching the list of classes, combined with `cacheLife("minutes")` and `cacheTag("classes")`. Mutations will call `revalidateTag("classes")`.

## Risks / Trade-offs

- **[Risk] Foreign Key constraint failures** → Mitigation: Ensure the teacher selected actually exists and is active. Handle database cascade deletes properly (schema already uses `onDelete: "cascade"` for `teacherId`).
- **[Risk] Security/Authorization** → Mitigation: All Server Actions must verify the user's session and check for the `admin` role via BetterAuth before proceeding with any DB mutation.
