## 1. Setup & Data Access Layer

- [x] 1.1 Create `src/features/teachers/server/dal.ts` with DB queries for fetching teachers, ensuring strict role authorization checks via BetterAuth.
- [x] 1.2 Implement explicit DTO mapping functions (e.g., `mapToTeacherDTO`) to strip any sensitive fields from raw database objects before returning them.

## 2. Server Actions

- [x] 2.1 Create `src/features/teachers/server/actions.ts` utilizing `next-safe-action`.
- [x] 2.2 Implement `createTeacher` action with Zod input schema validation, BetherAuth 'admin' role check, and database insertion.
- [x] 2.3 Implement `updateTeacher` action with Zod validation, role check, and database update.
- [x] 2.4 Implement `deleteTeacher` action with validation, role check, and database deletion.
- [x] 2.5 Ensure all actions call `revalidateTag('teachers')` after successful mutation.

## 3. UI Components

- [x] 3.1 Create `TeacherForm` component (`src/features/teachers/components/teacher-form.tsx`) using native HTML forms and simple inputs, completely avoiding `react-hook-form` and `shadcn` Form components. Use Server Actions directly for submission.
- [x] 3.2 Create `CreateTeacherDialog` using `shadcn/ui` Dialog to wrap the `TeacherForm`.
- [x] 3.3 Create `EditTeacherDialog` using `shadcn/ui` Dialog to wrap the `TeacherForm` populated with existing data.
- [x] 3.4 Create `DeleteTeacherAlert` using `shadcn/ui` AlertDialog for confirmation before triggering the delete action.

## 4. UI Pages & Integration

- [x] 4.1 Create a robust Data Table for the teachers list (e.g., `src/features/teachers/components/teacher-table.tsx` with columns definition).
- [x] 4.2 Create the Admin Teachers routing file `src/app/admin/teachers/page.tsx` as a strictly typed React Server Component.
- [x] 4.3 Implement cached data fetching in `page.tsx` using `"use cache"`, `cacheLife('minutes')`, and `cacheTag('teachers')` to fetch data via the DAL.
- [x] 4.4 Assemble the Create, Edit, Delete dialogs and the Data Table within the admin teachers page.
