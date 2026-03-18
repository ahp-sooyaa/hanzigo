import { notFound } from "next/navigation";
import { getTeacherOwnedClassById } from "@/features/classes/server/dal";
import { getTeacherClassMaterials } from "@/features/materials/server/dal";

interface TeacherClassOverviewFetchedProps {
  classId: string;
  userId: string;
}

export async function TeacherClassOverviewFetched({
  classId,
  userId,
}: TeacherClassOverviewFetchedProps) {
  const [classRecord, materials] = await Promise.all([
    getTeacherOwnedClassById(classId, userId),
    getTeacherClassMaterials(classId, userId),
  ]);

  if (!classRecord) notFound();

  return (
    <div className="grid gap-5 md:grid-cols-3">
      <article className="rounded-2xl border border-[var(--admin-border)] bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold tracking-wide text-[var(--admin-text-muted)] uppercase">
          Description
        </p>
        <p className="mt-2 text-sm text-[var(--admin-text-main)]">
          {classRecord.description || "No class description provided yet."}
        </p>
      </article>
      <article className="rounded-2xl border border-[var(--admin-border)] bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold tracking-wide text-[var(--admin-text-muted)] uppercase">
          Assigned Teacher
        </p>
        <p className="mt-2 text-sm font-semibold text-[var(--admin-title)]">
          {classRecord.teacherName || "Unassigned"}
        </p>
      </article>
      <article className="rounded-2xl border border-[var(--admin-border)] bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold tracking-wide text-[var(--admin-text-muted)] uppercase">
          Materials
        </p>
        <p className="mt-2 text-sm font-semibold text-[var(--admin-title)]">
          {materials.length} uploaded resources
        </p>
      </article>
    </div>
  );
}
