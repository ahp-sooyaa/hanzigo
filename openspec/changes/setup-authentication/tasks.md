## 1. Database Schema Setup

- [x] 1.1 Create `src/db/schema/auth.ts` with BetterAuth required tables (user, session, account, verification) using Drizzle ORM
- [x] 1.2 Export the new auth schema from `src/db/schema/index.ts`
- [x] 1.3 Generate and apply Drizzle database migrations

## 2. Authentication Core Configuration

- [x] 2.1 Install `better-auth` and any required sub-dependencies
- [x] 2.2 Configure the BetterAuth instance in `src/lib/auth.ts` with the Drizzle adapter and admin plugin
- [x] 2.3 Implement the BetterAuth catch-all API route at `src/app/api/auth/[...all]/route.ts`

## 3. UI and Actions Implementation

- [x] 3.1 Create Next Safe Actions for Sign Up and Sign In in a new `src/features/auth` directory
- [x] 3.2 Build reusable Sign Up and Sign In form components
- [x] 3.3 Create corresponding authentication pages (`app/(auth)/sign-in/page.tsx`, `app/(auth)/sign-up/page.tsx`)

## 4. Route Protection and Session Management

- [x] 4.1 Implement utility functions to check active sessions on the server
- [x] 4.2 Add basic route protection or middleware to restrict access to authenticated users based on their roles
