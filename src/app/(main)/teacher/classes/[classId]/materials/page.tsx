import { BookOpen, CalendarDays, FileText } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { TeacherClassTabs } from "@/components/layout/teacher-class-tabs";
import { IfPermitted } from "@/features/auth/components/if-permitted";
import { getSession } from "@/features/auth/server/utils";
import { getTeacherOwnedClassById } from "@/features/classes/server/dal";
import { TeacherClassMaterialsFetched } from "@/features/materials/components/teacher-class-materials-fetched";
import { UploadMaterialDialog } from "@/features/materials/components/upload-material-dialog";

export default function TeacherClassMaterialsPage(props: { params: Promise<{ classId: string }> }) {
  return (
    <Suspense
      fallback={<div className="mx-auto max-w-7xl px-4 pt-28 pb-16">Loading materials...</div>}
    >
      <TeacherClassMaterialsContent params={props.params} />
    </Suspense>
  );
}

async function TeacherClassMaterialsContent(props: { params: Promise<{ classId: string }> }) {
  const session = await getSession();
  if (!session) notFound();

  const { classId } = await props.params;
  const classRecord = await getTeacherOwnedClassById(classId, session.user.id);
  if (!classRecord) notFound();

  return (
    <DashboardShell
      portalLabel="Teacher Portal"
      breadcrumb="Class Materials"
      title="Class Materials"
      stats={[
        { icon: BookOpen, label: "Materials Library" },
        { icon: FileText, label: "Teaching Resources" },
        { icon: CalendarDays, label: "Teacher Workspace" },
      ]}
      tabs={<TeacherClassTabs classId={classId} activeTab="materials" />}
      action={
        <IfPermitted resource="material" action="create">
          <UploadMaterialDialog classId={classId} />
        </IfPermitted>
      }
    >
      <Suspense fallback={<div>Loading materials...</div>}>
        <TeacherClassMaterialsFetched classId={classId} userId={session.user.id} />
      </Suspense>
    </DashboardShell>
  );
}
