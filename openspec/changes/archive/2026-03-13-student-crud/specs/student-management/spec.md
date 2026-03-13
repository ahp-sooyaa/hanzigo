## ADDED Requirements

### Requirement: Admin can list all students
The system SHALL provide an admin-only page that displays all student accounts in a paginated table, showing name, email, account status, and creation date.

#### Scenario: Admin views student list
- **WHEN** an authenticated admin navigates to the student management page
- **THEN** the system SHALL display a table of all students ordered by creation date descending

#### Scenario: No students exist
- **WHEN** an authenticated admin navigates to the student management page and no students have been created
- **THEN** the system SHALL display an empty state message prompting the admin to create a student

#### Scenario: Unauthorized access attempt
- **WHEN** a non-admin user or unauthenticated request attempts to access the student management page or its data
- **THEN** the system SHALL reject the request with an Unauthorized error

### Requirement: Admin can create a student account
The system SHALL allow an admin to create a new student account by providing a name, email, and password.

#### Scenario: Successful student creation
- **WHEN** an admin submits the create student form with a valid unique email, name, and password (min 8 chars)
- **THEN** the system SHALL create a user account with role "student" via BetterAuth, insert a corresponding record in the students table, and display a success toast

#### Scenario: Duplicate email on create
- **WHEN** an admin submits the create student form with an email that already exists in the system
- **THEN** the system SHALL display an error toast with an appropriate message and NOT create a duplicate account

#### Scenario: Invalid form input on create
- **WHEN** an admin submits the create student form with missing or invalid fields (e.g., invalid email format, password under 8 chars)
- **THEN** the system SHALL reject the action via Zod validation and return a validation error

### Requirement: Admin can update a student
The system SHALL allow an admin to update a student's display name and account ban status.

#### Scenario: Successful name update
- **WHEN** an admin submits the edit student form with a new valid name
- **THEN** the system SHALL update the user's name in the database and display a success toast

#### Scenario: Admin bans a student
- **WHEN** an admin sets a student's status to "banned" via the edit form
- **THEN** the system SHALL call the BetterAuth banUser API for the student's userId and reflect the banned status in the table

#### Scenario: Admin unbans a student
- **WHEN** an admin sets a banned student's status to "active" via the edit form
- **THEN** the system SHALL call the BetterAuth unbanUser API for the student's userId and reflect the active status in the table

#### Scenario: Student not found on update
- **WHEN** an admin attempts to update a student record that does not exist
- **THEN** the system SHALL return an error and display a server error toast

### Requirement: Admin can delete a student account
The system SHALL allow an admin to permanently delete a student account, which also removes the associated user account.

#### Scenario: Successful student deletion
- **WHEN** an admin confirms deletion of a student via the confirmation alert
- **THEN** the system SHALL delete the user record (cascading to the students row) and display a success toast

#### Scenario: Student not found on delete
- **WHEN** an admin attempts to delete a student record that does not exist
- **THEN** the system SHALL return an error and display a server error toast

### Requirement: Student data is never exposed raw to the UI
The system SHALL use a DTO mapping function to strip internal database fields before passing student data to any UI component or Server Action response.

#### Scenario: DAL returns DTO
- **WHEN** the DAL fetches student records from the database
- **THEN** the system SHALL map each result through `mapToStudentDTO` before returning, ensuring no raw Drizzle objects reach the UI layer
