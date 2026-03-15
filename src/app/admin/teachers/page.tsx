import { CheckCircle2, PauseCircle, Users } from "lucide-react";
import { Suspense } from "react";
import { AdminListShell } from "@/app/admin/_components/admin-list-shell";
import { IfPermitted } from "@/features/auth/components/if-permitted";
import { CreateTeacherDialog } from "@/features/teachers/components/create-teacher-dialog";
import { TeacherListFetched } from "@/features/teachers/components/teacher-list-fetched";

export const metadata = {
  title: "Admin | Teachers - Hanzigo",
  description: "Manage teachers in Hanzigo",
};

export default async function AdminTeachersPage() {
  return (
    <AdminListShell
      breadcrumb="Teachers"
      title="Teacher Management"
      activeTab="teachers"
      stats={[
        { icon: Users, label: "32 Instructors" },
        { icon: CheckCircle2, label: "28 Active" },
        { icon: PauseCircle, label: "4 On Leave", tone: "warning" },
      ]}
      action={
        <Suspense fallback={<div className="h-11 w-36 animate-pulse rounded-xl bg-muted" />}>
          <IfPermitted resource="teacher" action="create">
            <CreateTeacherDialog />
          </IfPermitted>
        </Suspense>
      }
    >
      <Suspense fallback={<div>Loading teachers...</div>}>
        <TeacherListFetched />
      </Suspense>
    </AdminListShell>
  );
}
