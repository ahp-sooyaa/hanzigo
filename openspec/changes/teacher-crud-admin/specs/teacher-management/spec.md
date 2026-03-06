## ADDED Requirements

### Requirement: Admin can view teachers
The system SHALL allow administrators to view a list of all teachers in the system.

#### Scenario: Admin views teacher list
- **WHEN** an administrator navigates to the teachers management page
- **THEN** they see an organized list of teachers with their names, emails, and statuses

### Requirement: Admin can create teachers
The system SHALL allow administrators to create new teacher records with valid information.

#### Scenario: Admin successfully creates teacher
- **WHEN** an administrator submits the new teacher form with valid data
- **THEN** a new teacher record is created in the database and the list is updated

#### Scenario: Admin fails to create teacher with invalid data
- **WHEN** an administrator submits the new teacher form with missing required fields
- **THEN** the system displays validation errors and does not create the record

### Requirement: Admin can update teachers
The system SHALL allow administrators to modify existing teacher information.

#### Scenario: Admin updates teacher phone number
- **WHEN** an administrator submits an edit form with a new phone number for a teacher
- **THEN** the teacher's record is updated in the database with the new information

### Requirement: Admin can delete teachers
The system SHALL allow administrators to permanently remove a teacher and their data from the management view.

#### Scenario: Admin deletes a teacher
- **WHEN** an administrator confirms the deletion of a teacher record
- **THEN** the teacher's record is removed from the database and the list is updated

### Requirement: Strict role authorization
The system MUST restrict teacher CRUD operations strictly to users possessing the 'admin' role.

#### Scenario: Non-admin attempts to create teacher
- **WHEN** a non-admin user attempts to call the create teacher server action
- **THEN** the system rejects the operation and returns an unauthorized error
