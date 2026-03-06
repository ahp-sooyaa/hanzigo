import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { ac, roles } from "./auth-permissions";
import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  plugins: [
    admin({
      ac: ac,
      roles: roles,
    }),
    nextCookies(),
  ],
  // Add standard email/password or OAuth providers here as needed
  emailAndPassword: {
    enabled: true,
  },
});
