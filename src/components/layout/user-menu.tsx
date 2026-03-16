import { UserMenuClient } from "./user-menu-client";
import { getSession } from "@/features/auth/server/utils";

function getUserInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "US";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function getRoleLabel(role: string | null | undefined) {
  if (role === "admin") return "System Administrator";
  if (role === "teacher") return "Teacher";
  if (role === "student") return "Student";
  return "Member";
}

export async function UserMenu() {
  const session = await getSession();
  const userName = session?.user?.name ?? session?.user?.email ?? "User";
  const userRole = getRoleLabel(session?.user?.role);
  const userInitials = getUserInitials(userName);

  return <UserMenuClient name={userName} role={userRole} initials={userInitials} />;
}
