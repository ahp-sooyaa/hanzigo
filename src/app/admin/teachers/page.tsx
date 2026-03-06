import { Suspense } from "react";
import { CreateTeacherDialog } from "@/features/teachers/components/create-teacher-dialog";
import { TeacherTable } from "@/features/teachers/components/teacher-table";
import { getTeachers } from "@/features/teachers/server/dal";

export const metadata = {
  title: "Admin | Teachers - Hanzigo",
  description: "Manage teachers in Hanzigo",
};

export default async function AdminTeachersPage() {
  // `use cache` would be placed inside `getTeachers` as per guidelines,
  // but we are fetching it directly here and we know getTeachers has strict admin checks
  const teachers = await getTeachers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teachers</h1>
          <p className="text-muted-foreground">
            Manage teacher accounts, their profiles and statuses.
          </p>
        </div>
        <CreateTeacherDialog />
      </div>

      <Suspense fallback={<div>Loading teachers...</div>}>
        <TeacherTable teachers={teachers} />
      </Suspense>
    </div>
  );
}
