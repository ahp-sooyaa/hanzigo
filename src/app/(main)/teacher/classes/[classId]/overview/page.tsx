import { BookOpen, CalendarDays, FileText, School } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { TeacherClassTabs } from "@/components/layout/teacher-class-tabs";
import { Button } from "@/components/ui/button";
import { getSession } from "@/features/auth/server/utils";
import { TeacherClassOverviewFetched } from "@/features/classes/components/teacher-class-overview-fetched";
import { getTeacherOwnedClassById } from "@/features/classes/server/dal";

export default function TeacherClassOverviewPage(props: { params: Promise<{ classId: string }> }) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 pt-28 pb-16">Loading class...</div>}>
      <TeacherClassOverviewContent params={props.params} />
    </Suspense>
  );
}

async function TeacherClassOverviewContent(props: { params: Promise<{ classId: string }> }) {
  const session = await getSession();
  if (!session) notFound();

  const { classId } = await props.params;

  const classRecord = await getTeacherOwnedClassById(classId, session.user.id);
  if (!classRecord) notFound();

  return (
    <DashboardShell
      portalLabel="Teacher Portal"
      breadcrumb="Class Overview"
      title="Class Overview"
      stats={[
        { icon: School, label: "Class Summary" },
        { icon: FileText, label: "Materials Snapshot" },
        { icon: CalendarDays, label: "Teacher Workspace" },
      ]}
      tabs={<TeacherClassTabs classId={classId} activeTab="overview" />}
      action={
        <Button asChild>
          <Link href={`/teacher/classes/${classId}/materials`}>
            <BookOpen className="h-4 w-4" />
            Go to Materials
          </Link>
        </Button>
      }
    >
      <Suspense fallback={<div>Loading class details...</div>}>
        <TeacherClassOverviewFetched classId={classId} userId={session.user.id} />
      </Suspense>
    </DashboardShell>
  );
}
