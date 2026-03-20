import { BookOpenCheck, Clock3, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ClassListReadonlyProps {
  classes: { id: string; name: string; description: string | null; teacherName: string | null }[];
  role?: "student" | "teacher";
}

export async function ClassListReadonly({ classes, role = "student" }: ClassListReadonlyProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {classes.map((classRecord) => (
        <article
          key={classRecord.id}
          className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
        >
          <div className="pointer-events-none absolute -top-12 -right-12 h-28 w-28 rounded-full bg-emerald-100/60" />
          <div className="relative z-10 mb-5 flex items-center justify-between gap-3">
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              {role === "teacher" ? "Teaching" : "In Progress"}
            </span>
            <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Class
            </span>
          </div>

          <h3 className="relative z-10 text-xl font-bold tracking-tight text-foreground">
            {classRecord.name}
          </h3>
          <p className="relative z-10 mt-2 line-clamp-2 text-sm text-muted-foreground">
            {classRecord.description || "No description provided"}
          </p>

          <div className="relative z-10 mt-6 grid gap-3 text-sm">
            <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-3">
              <Users className="mt-0.5 h-4 w-4 text-emerald-700" />
              <div>
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  {role === "teacher" ? "Teaching Track" : "Instructor"}
                </p>
                <p className="font-semibold text-foreground">
                  {classRecord.teacherName || "Unassigned"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-3">
              <Clock3 className="mt-0.5 h-4 w-4 text-emerald-700" />
              <div>
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Schedule
                </p>
                <p className="font-semibold text-foreground">Session details available in class</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-6 border-t border-gray-100 pt-4">
            {role === "teacher" ? (
              <Button asChild size="sm">
                <Link href={`/teacher/classes/${classRecord.id}/overview`}>
                  <BookOpenCheck className="h-4 w-4" />
                  Manage Class
                </Link>
              </Button>
            ) : (
              <Button asChild size="sm">
                <Link href={`/student/classes/${classRecord.id}/materials`}>
                  <BookOpenCheck className="h-4 w-4" />
                  Go Class
                </Link>
              </Button>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
