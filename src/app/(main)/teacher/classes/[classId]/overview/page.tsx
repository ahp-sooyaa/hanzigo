import { BookOpen, CalendarDays, FileText, School } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { TeacherClassTabs } from "@/components/layout/teacher-class-tabs";
import { Button } from "@/components/ui/button";
import { requireRole } from "@/features/auth/server/utils";
import { getTeacherOwnedClassById } from "@/features/classes/server/dal";
import { getTeacherClassMaterials } from "@/features/materials/server/dal";

export default function TeacherClassOverviewPage(props: { params: Promise<{ classId: string }> }) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 pt-28 pb-16">Loading class...</div>}>
      <TeacherClassOverviewContent params={props.params} />
    </Suspense>
  );
}

async function TeacherClassOverviewContent(props: { params: Promise<{ classId: string }> }) {
  const session = await requireRole("teacher");
  const { classId } = await props.params;

  const classRecord = await getTeacherOwnedClassById(classId, session.user.id);
  if (!classRecord) notFound();

  const materials = await getTeacherClassMaterials(classId, session.user.id);

  return (
    <DashboardShell
      portalLabel="Teacher Portal"
      breadcrumb={`Class Management / ${classRecord.name}`}
      title={classRecord.name}
      stats={[
        { icon: School, label: "Class Overview" },
        { icon: FileText, label: `${materials.length} Materials` },
        { icon: CalendarDays, label: "Teacher Workspace" },
      ]}
      tabs={<TeacherClassTabs classId={classRecord.id} activeTab="overview" />}
      action={
        <Button asChild>
          <Link href={`/teacher/classes/${classRecord.id}/materials`}>
            <BookOpen className="h-4 w-4" />
            Go to Materials
          </Link>
        </Button>
      }
    >
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
    </DashboardShell>
  );
}
