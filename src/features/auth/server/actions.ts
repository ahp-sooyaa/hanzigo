"use server";

import { headers } from "next/headers";
import { signUpSchema, signInSchema } from "./dto";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/safe-action";

export const signUpAction = actionClient
  .inputSchema(signUpSchema)
  .action(async ({ parsedInput: { email, password, name } }) => {
    try {
      await auth.api.signUpEmail({
        headers: await headers(),
        body: {
          email,
          password,
          name,
        },
      });
      return { success: true };
    } catch (error: any) {
      throw new Error(error.message || "Failed to sign up");
    }
  });

export const signInAction = actionClient
  .inputSchema(signInSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    try {
      const result = await auth.api.signInEmail({
        headers: await headers(),
        body: {
          email,
          password,
        },
      });
      return {
        success: true,
        role: result.user.role,
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to sign in");
    }
  });
