## 1. Server Layer

- [x] 1.1 Create `src/features/students/server/dto.ts` — define `StudentDTO` type (id, userId, name, email, banned, createdAt) and `mapToStudentDTO` function
- [x] 1.2 Create `src/features/students/server/dal.ts` — implement `getStudents()` and `getStudentById(id)` with admin auth check and DTO mapping
- [x] 1.3 Create `src/features/students/server/actions.ts` — implement `createStudent`, `updateStudent`, and `deleteStudent` server actions using `adminActionClient` and Zod `.inputSchema()`

## 2. UI Components

- [x] 2.1 Create `src/features/students/components/student-form.tsx` — native HTML form (no react-hook-form) for create/edit, using `useAction` hook from `next-safe-action/hooks`
- [x] 2.2 Create `src/features/students/components/create-student-dialog.tsx` — dialog that wraps `StudentForm` for creation
- [x] 2.3 Create `src/features/students/components/edit-student-dialog.tsx` — dialog that wraps `StudentForm` for editing (include ban/unban toggle)
- [x] 2.4 Create `src/features/students/components/delete-student-alert.tsx` — confirmation alert dialog using `useAction` on `deleteStudent`
- [x] 2.5 Create `src/features/students/components/student-table.tsx` — RSC-compatible table component displaying name, email, banned status badge, joined date, and action buttons

## 3. Admin Page

- [x] 3.1 Create `src/app/admin/students/page.tsx` — server component that calls `getStudents()` from the DAL and renders `StudentTable` with `CreateStudentDialog`
- [x] 3.2 Add a "Students" navigation link to the admin sidebar/nav (if one exists)

## 4. Verification

- [x] 4.1 Run `bun run verify` and confirm zero TypeScript, Oxlint, or build errors
- [x] 4.2 Manually verify: create a student, confirm they appear in the table and can log in with the provided credentials
- [x] 4.3 Manually verify: edit a student name and ban/unban — confirm changes reflect in the table immediately
- [x] 4.4 Manually verify: delete a student — confirm the row is removed and their user account no longer exists

