import { BookOpen, CalendarDays, FileText } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { TeacherClassTabs } from "@/components/layout/teacher-class-tabs";
import { IfPermitted } from "@/features/auth/components/if-permitted";
import { hasPermission, requireRole } from "@/features/auth/server/utils";
import { getTeacherOwnedClassById } from "@/features/classes/server/dal";
import { MaterialList } from "@/features/materials/components/material-list";
import { UploadMaterialDialog } from "@/features/materials/components/upload-material-dialog";
import { getTeacherClassMaterials } from "@/features/materials/server/dal";

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
  const session = await requireRole("teacher");
  const { classId } = await props.params;

  const classRecord = await getTeacherOwnedClassById(classId, session.user.id);
  if (!classRecord) notFound();

  const [materials, canUpdate, canDelete] = await Promise.all([
    getTeacherClassMaterials(classId, session.user.id),
    hasPermission("material", "update"),
    hasPermission("material", "delete"),
  ]);

  return (
    <DashboardShell
      portalLabel="Teacher Portal"
      breadcrumb={`Class Management / ${classRecord.name}`}
      title={`${classRecord.name} Materials`}
      stats={[
        { icon: BookOpen, label: "Materials Library" },
        { icon: FileText, label: `${materials.length} Resources` },
        { icon: CalendarDays, label: "Teacher Workspace" },
      ]}
      tabs={<TeacherClassTabs classId={classRecord.id} activeTab="materials" />}
      action={
        <IfPermitted resource="material" action="create">
          <UploadMaterialDialog classId={classId} />
        </IfPermitted>
      }
    >
      <MaterialList materials={materials} canUpdate={canUpdate} canDelete={canDelete} />
    </DashboardShell>
  );
}
