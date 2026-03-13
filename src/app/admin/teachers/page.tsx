import { Suspense } from "react";
import { IfPermitted } from "@/features/auth/components/if-permitted";
import { CreateTeacherDialog } from "@/features/teachers/components/create-teacher-dialog";
import { TeacherListFetched } from "@/features/teachers/components/teacher-list-fetched";
export const metadata = {
  title: "Admin | Teachers - Hanzigo",
  description: "Manage teachers in Hanzigo",
};

export default async function AdminTeachersPage() {
  return (
    <div className="space-y-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teachers</h1>
          <p className="text-muted-foreground">
            Manage teacher accounts, their profiles and statuses.
          </p>
        </div>
        <Suspense fallback={<div className="h-10 w-28 animate-pulse rounded-md bg-muted" />}>
          <IfPermitted resource="teacher" action="create">
            <CreateTeacherDialog />
          </IfPermitted>
        </Suspense>
      </div>

      <Suspense fallback={<div>Loading teachers...</div>}>
        <TeacherListFetched />
      </Suspense>
    </div>
  );
}
