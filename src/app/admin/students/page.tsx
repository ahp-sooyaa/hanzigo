import { TrendingUp, Users } from "lucide-react";
import { Suspense } from "react";
import { AdminTabs } from "@/components/layout/admin-tabs";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { IfPermitted } from "@/features/auth/components/if-permitted";
import { CreateStudentDialog } from "@/features/students/components/create-student-dialog";
import { StudentListFetched } from "@/features/students/components/student-list-fetched";

export const metadata = {
  title: "Admin | Students - Hanzigo",
  description: "Manage students in Hanzigo",
};

export default async function AdminStudentsPage() {
  return (
    <DashboardShell
      portalLabel="Admin Portal"
      breadcrumb="User Management"
      title="Student Management"
      stats={[
        { icon: Users, label: "Total Students: 1,248" },
        { icon: TrendingUp, label: "Active This Month: 95%" },
      ]}
      tabs={<AdminTabs activeTab="students" />}
      action={
        <Suspense fallback={<div className="h-11 w-36 animate-pulse rounded-xl bg-muted" />}>
          <IfPermitted resource="student" action="create">
            <CreateStudentDialog />
          </IfPermitted>
        </Suspense>
      }
    >
      <Suspense fallback={<div>Loading students...</div>}>
        <StudentListFetched />
      </Suspense>
    </DashboardShell>
  );
}
