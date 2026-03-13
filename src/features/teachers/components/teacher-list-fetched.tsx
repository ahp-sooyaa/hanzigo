import { TeacherTable } from "./teacher-table";
import { hasPermission } from "@/features/auth/server/utils";
import { getTeachers } from "@/features/teachers/server/dal";

export async function TeacherListFetched() {
  const [teachers, canUpdate, canDelete] = await Promise.all([
    getTeachers(),
    hasPermission("teacher", "update"),
    hasPermission("teacher", "delete"),
  ]);
  return <TeacherTable teachers={teachers} canUpdate={canUpdate} canDelete={canDelete} />;
}
