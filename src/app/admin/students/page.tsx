import { Suspense } from "react";
import { IfPermitted } from "@/features/auth/components/if-permitted";
import { CreateStudentDialog } from "@/features/students/components/create-student-dialog";
import { StudentListFetched } from "@/features/students/components/student-list-fetched";
export const metadata = {
  title: "Admin | Students - Hanzigo",
  description: "Manage students in Hanzigo",
};

export default async function AdminStudentsPage() {
  return (
    <div className="space-y-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">Manage student accounts and their statuses.</p>
        </div>
        <Suspense fallback={<div className="h-10 w-28 animate-pulse rounded-md bg-muted" />}>
          <IfPermitted resource="student" action="create">
            <CreateStudentDialog />
          </IfPermitted>
        </Suspense>
      </div>

      <Suspense fallback={<div>Loading students...</div>}>
        <StudentListFetched />
      </Suspense>
    </div>
  );
}
