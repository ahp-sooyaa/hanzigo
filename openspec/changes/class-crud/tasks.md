## 1. Data Access Layer & Server Actions Setup

- [x] 1.1 Implement classes DAL (`src/features/classes/server/dal.ts`) with functions to list (paginated, with teacher data included), get by ID, check existence.
- [x] 1.2 Implement classes DTO (`src/features/classes/server/dto.ts`) to sanitize DB objects before returning to UI.
- [x] 1.3 Implement class validation schemas (Zod) directly within `src/features/classes/server/actions.ts` for create, update, and delete inputs.
- [x] 1.4 Create Create, Update, and Delete Server Actions in `src/features/classes/server/actions.ts` using `next-safe-action` with admin role checks.

## 2. Admin UI Components Setup

- [x] 2.1 Create the main Classes page (`src/app/(admin)/admin/classes/page.tsx`) that fetches paginated data and renders the data table.
- [x] 2.2 Build the `ClassTable` component (`src/features/classes/components/class-table.tsx`) to display classes and handle pagination/search.
- [x] 2.3 Build the `ClassForm` component (`src/features/classes/components/class-form.tsx`) as a Client Component using native HTML forms for Create/Edit operations. It needs teacher list lookup passed from server component.
- [x] 2.4 Build the `CreateClassDialog` and `UpdateClassDialog` components (or route pages) to wrap the `ClassForm` and handle the UI for creation/updating.
- [x] 2.5 Build the `DeleteClassDialog` component (`src/features/classes/components/delete-class-dialog.tsx`) to confirm and execute the delete Server Action.

## 3. Integration & Verification

- [x] 3.1 Link the new Classes page to the Admin navigation sidebar/header.
- [x] 3.2 Ensure "use cache" and `revalidateTag('classes')` are implemented correctly for listing and mutating classes.
- [x] 3.3 Verify all operations function correctly handling actual data and that error messages from forms/actions show appropriately.
- [x] 3.4 Execute `bun run verify` to ensure tests, oxlint and typescript build all pass.
