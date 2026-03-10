import { Suspense } from "react";
import { CreateStudentDialog } from "@/features/students/components/create-student-dialog";
import { StudentTable } from "@/features/students/components/student-table";
import { getStudents } from "@/features/students/server/dal";

export const metadata = {
  title: "Admin | Students - Hanzigo",
  description: "Manage students in Hanzigo",
};

export default async function AdminStudentsPage() {
  const students = await getStudents();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">Manage student accounts and their statuses.</p>
        </div>
        <CreateStudentDialog />
      </div>

      <Suspense fallback={<div>Loading students...</div>}>
        <StudentTable students={students} />
      </Suspense>
    </div>
  );
}
