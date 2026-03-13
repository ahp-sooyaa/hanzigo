## Why

The database schema for `teachers` has been established. We now need a dedicated administrative interface to manage teacher accounts. This is essential for the school's administrators to onboard new teachers, update their information, and remove them when necessary.

## What Changes

- Add an Admin page to list all teachers with pagination and search/filtering.
- Add forms and server actions to Create, Read, Update, and Delete teacher records.
- Implement Zod validation on all inputs for teacher mutations.
- Ensure strict authorization checks so only admin users can perform these actions.

## Capabilities

### New Capabilities
- `teacher-management`: Administrative capabilities specifically for managing teacher accounts and profiles.

### Modified Capabilities

## Impact

- Adds new routes under the admin dashboard (e.g., `/admin/teachers`).
- Introduces new Next-Safe-Action mutations and queries in `src/features/teachers/server/actions.ts`.
- Adds new UI components for teacher management in `src/features/teachers/components`.
- Utilizes the existing Drizzle `teachers` schema.
