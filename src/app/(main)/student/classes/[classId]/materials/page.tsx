import { CalendarDays, FileText, Video } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { StudentClassTabs } from "@/components/layout/student-class-tabs";
import { Button } from "@/components/ui/button";
import { getSession } from "@/features/auth/server/utils";
import { getStudentEnrolledClassById } from "@/features/enrollments/server/dal";
import { StudentClassMaterialsFetched } from "@/features/materials/components/student-class-materials-fetched";

export default function StudentClassMaterialsPage(props: { params: Promise<{ classId: string }> }) {
  return (
    <Suspense
      fallback={<div className="mx-auto max-w-7xl px-4 pt-28 pb-16">Loading materials...</div>}
    >
      <StudentClassMaterialsContent params={props.params} />
    </Suspense>
  );
}

async function StudentClassMaterialsContent(props: { params: Promise<{ classId: string }> }) {
  const session = await getSession();
  if (!session) notFound();

  const { classId } = await props.params;
  const classRecord = await getStudentEnrolledClassById(session.user.id, classId);
  if (!classRecord) notFound();

  return (
    <DashboardShell
      portalLabel="Student Portal"
      breadcrumb="Class Materials"
      title="Class Materials"
      stats={[
        { icon: FileText, label: "Learning Resources" },
        { icon: CalendarDays, label: "Class Schedule" },
        { icon: Video, label: "Instructor Workspace" },
      ]}
      tabs={<StudentClassTabs params={props.params} activeTab="materials" />}
      action={
        <Button type="button">
          <Video className="h-4 w-4" />
          Join Live Class
        </Button>
      }
    >
      <Suspense fallback={<div>Loading materials...</div>}>
        <StudentClassMaterialsFetched classId={classId} userId={session.user.id} />
      </Suspense>
    </DashboardShell>
  );
}
