import { getSession } from "@/features/auth/server/utils";
import { ClassListReadonly } from "@/features/classes/components/class-list-readonly";
import { getClassesForTeacherUser } from "@/features/enrollments/server/dal";

export async function TeacherClassesFetched() {
  const session = await getSession();

  if (!session) {
    return (
      <div className="rounded-md border bg-muted/20 p-6 text-sm text-muted-foreground">
        Please sign in to view your classes.
      </div>
    );
  }

  const classes = await getClassesForTeacherUser(session.user.id);

  return (
    <ClassListReadonly
      classes={classes}
      emptyTitle="No assigned classes"
      emptyDescription="You don't have any assigned classes yet."
      role="teacher"
    />
  );
}
