import { CalendarDays, School, Users } from "lucide-react";
import { Suspense } from "react";
import { AdminListShell } from "@/app/admin/_components/admin-list-shell";
import { IfPermitted } from "@/features/auth/components/if-permitted";
import { ClassListFetched } from "@/features/classes/components/class-list-fetched";
import { CreateClassButton } from "@/features/classes/components/create-class-button";

export const metadata = {
  title: "Admin | Classes - Hanzigo",
  description: "Manage classes in Hanzigo",
};

export default async function AdminClassesPage(props: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  return (
    <AdminListShell
      breadcrumb="Class Management"
      title="Class Management"
      activeTab="classes"
      stats={[
        { icon: School, label: "42 Active Classes" },
        { icon: Users, label: "1,205 Enrolled Students" },
        { icon: CalendarDays, label: "Spring Term 2024" },
      ]}
      action={
        <Suspense fallback={<div className="h-11 w-36 animate-pulse rounded-xl bg-muted" />}>
          <IfPermitted resource="class" action="create">
            <CreateClassButton />
          </IfPermitted>
        </Suspense>
      }
    >
      <Suspense fallback={<div>Loading classes...</div>}>
        <ClassListFetched searchParams={props.searchParams} />
      </Suspense>
    </AdminListShell>
  );
}
