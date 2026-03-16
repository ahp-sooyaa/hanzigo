import { CheckCircle2, PauseCircle, Users } from "lucide-react";
import { Suspense } from "react";
import { AdminTabs } from "@/components/layout/admin-tabs";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { IfPermitted } from "@/features/auth/components/if-permitted";
import { CreateTeacherDialog } from "@/features/teachers/components/create-teacher-dialog";
import { TeacherListFetched } from "@/features/teachers/components/teacher-list-fetched";

export const metadata = {
  title: "Admin | Teachers - Hanzigo",
  description: "Manage teachers in Hanzigo",
};

export default async function AdminTeachersPage() {
  return (
    <DashboardShell
      portalLabel="Admin Portal"
      breadcrumb="Teachers"
      title="Teacher Management"
      stats={[
        { icon: Users, label: "32 Instructors" },
        { icon: CheckCircle2, label: "28 Active" },
        { icon: PauseCircle, label: "4 On Leave", tone: "warning" },
      ]}
      tabs={<AdminTabs activeTab="teachers" />}
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
    </DashboardShell>
  );
}
