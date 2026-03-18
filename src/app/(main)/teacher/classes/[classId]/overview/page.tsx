import { BookOpen, CalendarDays, FileText, School } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { TeacherClassTabs } from "@/components/layout/teacher-class-tabs";
import { Button } from "@/components/ui/button";
import { TeacherClassOverviewFetched } from "@/features/classes/components/teacher-class-overview-fetched";

export default function TeacherClassOverviewPage(props: { params: Promise<{ classId: string }> }) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 pt-28 pb-16">Loading class...</div>}>
      <TeacherClassOverviewContent params={props.params} />
    </Suspense>
  );
}

async function TeacherClassOverviewContent(props: { params: Promise<{ classId: string }> }) {
  const { classId } = await props.params;

  return (
    <PageShell
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
        <TeacherClassOverviewFetched classId={classId} />
      </Suspense>
    </PageShell>
  );
}
