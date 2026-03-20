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

export async function UserMenuIdentity() {
  const session = await getSession();
  const userName = session?.user?.name ?? session?.user?.email ?? "User";
  const userRole = getRoleLabel(session?.user?.role);
  const userInitials = getUserInitials(userName);

  return (
    <>
      <div className="hidden text-right lg:block">
        <p className="text-sm font-semibold text-[var(--admin-text-main)]">{userName}</p>
        <p className="text-xs text-[var(--admin-text-muted)]">{userRole}</p>
      </div>
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--admin-primary)] text-xs font-bold text-white">
        {userInitials}
      </div>
    </>
  );
}
