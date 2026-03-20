import { GraduationCap } from "lucide-react";
import { getSession } from "@/features/auth/server/utils";
import { ClassListReadonly } from "@/features/classes/components/class-list-readonly";
import { getClassesForTeacherUserId } from "@/features/enrollments/server/dal";

export async function TeacherClassesFetched() {
  const session = await getSession();

  if (!session) {
    throw new Error("Unauthenticated: sign in to view your classes");
  }

  const classes = await getClassesForTeacherUserId(session.user.id);

  if (classes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <GraduationCap className="h-6 w-6" />
        </span>
        <h3 className="mt-4 text-lg font-semibold text-foreground">No assigned classes</h3>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          You haven't been assigned to any classes yet.
        </p>
      </div>
    );
  }

  return <ClassListReadonly classes={classes} role="teacher" />;
}
