## Context

Authentication is a core requirement for Hanzigo LMS. Currently, the application lacks authentication, meaning there is no way to differentiate between admins, teachers, and students, or to protect role-specific routes. We need to implement a secure, robust, and extensible authentication system to manage these roles.

## Goals / Non-Goals

**Goals:**
- Implement email and password authentication.
- Set up secure session management.
- Provide user interfaces for sign-up and sign-in.
- Establish the structural foundation for role-based access control (RBAC).

**Non-Goals:**
- Implementing OAuth (Google, GitHub, etc.) or passwordless login in this phase.
- Implementing payment or complex student enrollment logic (this is strictly v1 scope for auth).

## Decisions

- **Authentication Library**: We will use BetterAuth with the `admin` plugin.
  - *Rationale*: BetterAuth is modern, integrates well with Next.js App Router, and the `admin` plugin provides out-of-the-box support for role management which aligns perfectly with our need for admin, teacher, and student roles.
  - *Alternatives Considered*: NextAuth (Auth.js) - rejected because BetterAuth offers better TypeScript support, a smaller footprint, and built-in role management plugins that fit our use case perfectly.
- **Database Adapter**: Drizzle ORM with PostgreSQL (Neon).
  - *Rationale*: Fits the current tech stack. We will use the Drizzle adapter provided by BetterAuth. The schema will be structured in `src/db/schema/auth.ts` following the one-file-per-table convention.
- **State Management / Mutations**: next-safe-action.
  - *Rationale*: Adheres to project conventions for all mutations. Auth actions (sign-in, sign-up forms) will be managed via standard Next.js Server Actions and validated using Zod, then passed to BetterAuth clients.

## Risks / Trade-offs

- **[Risk]** BetterAuth schema implementation might not perfectly align with the one-file-per-table structure.
  - *Mitigation*: We will carefully split the required BetterAuth tables (user, session, account, verification) into their logical structures within the `auth.ts` file or separate files if adhering strictly to one-file-per-table, while ensuring they are all exported from `schema/index.ts`.
- **[Risk]** Server/Client component mismatch for auth state.
  - *Mitigation*: Ensure auth UI components are explicitly marked `"use client"` where interactivity is needed, and use server-side `auth.api.getSession` checks for protecting routes within React Server Components.
