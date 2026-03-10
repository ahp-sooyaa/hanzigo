import { createSafeActionClient } from "next-safe-action";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export const actionClient = createSafeActionClient();

export const adminActionClient = actionClient.use(async ({ next }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized: Only admins can perform this action");
  }

  // Pass session to context so subsequent actions can use it if needed
  return next({ ctx: { session } });
});

export const permissionAction = (resource: string, action: string) => {
  return actionClient.use(async ({ next }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized: Authentication required");
    }

    const hasPermission = await auth.api.userHasPermission({
      body: {
        userId: session.user.id,
        permissions: {
          [resource]: [action],
        },
      },
    });

    if (!hasPermission) {
      throw new Error(`Unauthorized: Missing permission ${resource}:${action}`);
    }

    return next({ ctx: { session } });
  });
};
