## Why

The LMS currently supports class and teacher management, but administrators need a way to manage student accounts. Implementing Student CRUD completes the core entity management capabilities required for the school's operations, allowing admins to onboard, update, and remove students from the platform.

## What Changes

- Add a new "Students" section in the admin dashboard.
- Create Server Actions to handle creating, reading, updating, and deleting student records.
- Implement a Data Access Layer (DAL) and Data Transfer Objects (DTO) for secure and abstracted student data retrieval, consistent with the existing `teacher` and `class` implementations.
- Add UI components: student list table, create/edit dialogs with native HTML forms, and delete confirmation alerts.
- Enforce strict admin authorization for all student management actions.

## Capabilities

### New Capabilities
- `student-management`: CRUD operations for student records in the admin dashboard, including linking to the auth user account, securely fetching data, and managing student profiles.

### Modified Capabilities

## Impact

- **Database**: Interacts with the `students` and `user` tables defined in `src/db/schema/`.
- **UI**: Adds a new route `/admin/students` (or similar, depending on existing routing) for the student management dashboard.
- **Security**: Utilizes `next-safe-action` and `better-auth` admin session checks to ensure only authorized administrators can modify student records.
- **Consistency**: Follows the established patterns used in `src/features/teachers` and `src/features/classes`.
