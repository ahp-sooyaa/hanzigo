import { StudentTable } from "./student-table";
import { hasPermission } from "@/features/auth/server/utils";
import { getStudents } from "@/features/students/server/dal";

export async function StudentListFetched() {
  const [students, canUpdate, canDelete] = await Promise.all([
    getStudents(),
    hasPermission("student", "update"),
    hasPermission("student", "delete"),
  ]);
  return <StudentTable students={students} canUpdate={canUpdate} canDelete={canDelete} />;
}
