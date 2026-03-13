## Why

Authentication is a fundamental requirement for the Hanzigo LMS. It allows admins, teachers, and students to securely access their accounts and perform role-specific actions. By setting up email and password authentication with BetterAuth, we establish the secure foundation for all user interactions within the application.

## What Changes

- Implement email and password authentication using BetterAuth.
- Create user interfaces for Sign Up and Sign In pages.
- Set up authentication actions and state management.
- Configure the BetterAuth instance with our Drizzle ORM database adapter.
- Establish protected routes to ensure users can only access areas permitted by their roles.

## Capabilities

### New Capabilities

- `email-auth`: Email and password authentication enabling users to securely sign up and sign in to the application.

### Modified Capabilities


## Impact

- **Features**: A new `src/features/auth` directory will be created to house authentication components, DTOs, and actions.
- **Database**: The Drizzle schema in `src/db/schema/auth.ts` will manage authentication tables (users, sessions, etc.) needed by BetterAuth.
- **API**: BetterAuth core API routes will be implemented and managed at `src/app/api/auth/[...all]/route.ts`.
