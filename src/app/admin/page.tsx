import Link from "next/link";
import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { requireAuth } from "@/features/auth/server/utils";

export default async function AdminDashboardPage() {
  const session = await requireAuth();

  return (
    <div className="space-y-6 p-8">
      <header className="flex items-center justify-between border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-500">Welcome back, {session.user.name}</p>
        </div>

        <SignOutButton />
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder Cards */}
        <Link
          href="/admin/students"
          className="rounded-xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <h3 className="font-semibold">Total Students</h3>
          <p className="mt-2 text-3xl font-bold">0</p>
        </Link>
        <Link
          href="/admin/teachers"
          className="rounded-xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <h3 className="font-semibold">Total Teachers</h3>
          <p className="mt-2 text-3xl font-bold">0</p>
        </Link>
        <Link
          href="/admin/classes"
          className="rounded-xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <h3 className="font-semibold">Active Classes</h3>
          <p className="mt-2 text-3xl font-bold">0</p>
        </Link>
      </div>
    </div>
  );
}
