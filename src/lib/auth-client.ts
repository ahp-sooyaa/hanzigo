import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { ac, roles } from "./auth-permissions";

export const authClient = createAuthClient({
  plugins: [
    adminClient({
      ac: ac,
      roles: roles,
    }),
  ],
});

export const { signIn, signUp, useSession } = authClient;
