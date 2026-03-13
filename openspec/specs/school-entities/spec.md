# school-entities Specification

## Purpose
TBD - created by archiving change schema-school. Update Purpose after archive.
## Requirements
### Requirement: Database Schema for Core Entities
The system MUST define a database schema using Drizzle ORM to support students, teachers, classes, and school enrollments, following the one-file-per-table structure.

#### Scenario: Schema provisioning
- **WHEN** the Drizzle migration or push command is executed
- **THEN** PostgreSQL tables for students, teachers, classes, and enrollments must be created with appropriate foreign keys and constraints

### Requirement: Independent Entity Files
The schema definitions MUST be structured as independent files (e.g., `students.ts`, `teachers.ts`, `classes.ts`, `enrollments.ts`) and exported from a central `index.ts`.

#### Scenario: Central schema export
- **WHEN** a feature imports from `src/db/schema`
- **THEN** it must have access to all table definitions and relational configurations

### Requirement: Relational Integrity
The database MUST enforce relational integrity between entities, such as classes requiring a valid teacher ID, and enrollments linking valid student and class IDs.

#### Scenario: Enrolling a student
- **WHEN** an enrollment record is created for a student in a class
- **THEN** the database enforces referential integrity for both the student ID and the class ID

