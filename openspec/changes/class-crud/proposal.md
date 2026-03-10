## Why

The system currently supports teacher management, but we need the ability to manage classes to facilitate student enrollment and course organization. Furthermore, linking teachers to classes is essential so that teachers can upload course materials and manage the students in their assigned classes.

## What Changes

- Create a comprehensive Class CRUD interface for administrators to create, read, update, and delete class records.
- Implement the backend logic (Database schema, DAL, DTOs, and Server Actions) for Class entities.
- Introduce the ability to assign one or multiple teachers to a specific class.
- Provide a UI for administrators to easily select existing teachers when creating or editing a class.

## Capabilities

### New Capabilities
- `class-management`: Covers the backend and frontend requirements for creating, viewing, updating, and deleting class records, including the assignment of teachers to classes.

### Modified Capabilities


## Impact

- **Database**: Will introduce new tables for `classes` and a junction table for `class_teachers` (or similar relationship depending on schema specifics like many-to-many or one-to-many).
- **Backend**: New Server Actions (`next-safe-action`), Data Access Layer (DAL), and Data Transfer Objects (DTOs) for classes.
- **Frontend**: New administrative UI pages and components (forms, tables, dialogs) for managing classes within the Next.js App Router `src/features/classes`. All mutations will use native HTML forms.
- **Auth/Roles**: Only admins will have permission to perform Class CRUD and assign teachers.
