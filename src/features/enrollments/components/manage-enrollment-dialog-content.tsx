import { EnrollSelect } from "./enroll-select";
import { UnenrollButton } from "./unenroll-button";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  getClassOptionsForEnrollment,
  getEnrollmentsByStudentUserId,
} from "@/features/enrollments/server/dal";

interface ManageEnrollmentDialogContentProps {
  student: { id: string; name: string; email: string; userId: string };
}

export async function ManageEnrollmentDialogContent({
  student,
}: ManageEnrollmentDialogContentProps) {
  const [enrolledClasses, classOptions] = await Promise.all([
    getEnrollmentsByStudentUserId(student.userId),
    getClassOptionsForEnrollment(),
  ]);

  const enrolledIds = new Set(enrolledClasses.map((item) => item.id));
  const availableOptions = classOptions.filter((option) => !enrolledIds.has(option.id));

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>Manage Enrollment</DialogTitle>
      </DialogHeader>

      <div className="space-y-2">
        <div className="text-sm font-medium">{student.name}</div>
        <div className="text-xs text-muted-foreground">{student.email}</div>
      </div>

      <div className="space-y-3 pt-4">
        <Label>Current Classes</Label>
        {enrolledClasses.length === 0 ? (
          <div className="rounded-md border bg-muted/30 p-3 text-sm text-muted-foreground">
            No classes enrolled yet.
          </div>
        ) : (
          <div className="space-y-2">
            {enrolledClasses.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-md border px-3 py-2"
              >
                <div>
                  <div className="text-sm font-medium">{item.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.teacherName ? `Teacher: ${item.teacherName}` : "Teacher: Unassigned"}
                  </div>
                </div>
                <UnenrollButton studentId={student.id} classId={item.id} />
              </div>
            ))}
          </div>
        )}
      </div>

      <EnrollSelect studentId={student.id} availableOptions={availableOptions} />
    </DialogContent>
  );
}
