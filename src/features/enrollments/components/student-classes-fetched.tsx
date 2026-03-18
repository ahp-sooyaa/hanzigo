import { getSession } from "@/features/auth/server/utils";
import { ClassListReadonly } from "@/features/classes/components/class-list-readonly";
import { getClassesForStudentUser } from "@/features/enrollments/server/dal";

export async function StudentClassesFetched() {
  const session = await getSession();

  if (!session) {
    throw new Error("Unauthenticated: sign in to view your classes");
  }

  const classes = await getClassesForStudentUser(session.user.id);

  return (
    <ClassListReadonly
      classes={classes}
      emptyTitle="No enrollments yet"
      emptyDescription="You haven't been enrolled in any classes yet."
      role="student"
    />
  );
}
