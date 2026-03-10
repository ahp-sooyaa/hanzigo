import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

export async function requireAuth() {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  return session;
}

export async function requireRole(role: "admin" | "teacher" | "student") {
  const session = await requireAuth();

  if (session.user.role !== role) {
    // Or redirect to an unauthorized page
    redirect("/");
  }

  return session;
}

export async function requirePermission(resource: string, action: string) {
  const session = await requireAuth();

  const hasPermission = await auth.api.userHasPermission({
    body: {
      userId: session.user.id,
      permissions: {
        [resource]: [action],
      },
    },
  });

  if (!hasPermission) {
    redirect("/");
  }

  return session;
}
