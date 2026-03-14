import { StudentTable } from "./student-table";
import { hasPermission } from "@/features/auth/server/utils";
import {
  getClassOptionsForEnrollment,
  getEnrollmentsByStudentIds,
} from "@/features/enrollments/server/dal";
import { getStudents } from "@/features/students/server/dal";

export async function StudentListFetched() {
  const [students, canUpdate, canDelete] = await Promise.all([
    getStudents(),
    hasPermission("student", "update"),
    hasPermission("student", "delete"),
  ]);

  const studentIds = students.map((student) => student.id);
  const [classOptions, enrollmentsByStudentId] = await Promise.all([
    getClassOptionsForEnrollment(),
    getEnrollmentsByStudentIds(studentIds),
  ]);

  return (
    <StudentTable
      students={students}
      classOptions={classOptions}
      enrollmentsByStudentId={enrollmentsByStudentId}
      canUpdate={canUpdate}
      canDelete={canDelete}
    />
  );
}
