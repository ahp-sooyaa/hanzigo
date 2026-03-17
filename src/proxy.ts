import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const routeRoles: Record<string, string[]> = {
  "/admin": ["admin"],
  "/teacher": ["teacher"],
  "/student": ["student"],
};

// Define the permissions required for each route
const routePermissions: Record<string, { resource: string; action: string }[]> = {
  "/admin/classes": [{ resource: "class", action: "read" }],
  "/admin/students": [{ resource: "student", action: "read" }],
  "/admin/teachers": [{ resource: "teacher", action: "read" }],
  "/teacher/classes": [
    { resource: "class", action: "read" },
    { resource: "material", action: "read" },
  ],
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Single session fetch
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const sortedRouteRoles = Object.entries(routeRoles).sort(([a], [b]) => b.length - a.length);

  // Layer 1: role-based area protection
  for (const [route, allowedRoles] of sortedRouteRoles) {
    if (pathname.startsWith(route)) {
      const userRole = session.user.role;
      if (!userRole || !allowedRoles.includes(userRole)) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      break;
    }
  }

  // Layer 2: fine-grained permission check
  for (const [route, permissions] of Object.entries(routePermissions)) {
    if (pathname.startsWith(route)) {
      const result = await auth.api.userHasPermission({
        body: {
          userId: session.user.id,
          permissions: permissions.reduce<Record<string, string[]>>((acc, permission) => {
            const actions = acc[permission.resource] ?? [];
            acc[permission.resource] = [...actions, permission.action];
            return acc;
          }, {}),
        },
      });
      if (!result || result.success === false) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      break;
    }
  }

  return NextResponse.next();
}

export const config = {
  // Match all admin routes so we can protect them centrally
  matcher: ["/admin/:path*", "/teacher/:path*", "/student/:path*"],
};
