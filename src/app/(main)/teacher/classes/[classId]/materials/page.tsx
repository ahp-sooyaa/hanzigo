import { BookOpen, CalendarDays, FileText } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { TeacherClassTabs } from "@/components/layout/teacher-class-tabs";
import { IfPermitted } from "@/features/auth/components/if-permitted";
import { getSession, hasPermission } from "@/features/auth/server/utils";
import { getTeacherOwnedClassById } from "@/features/classes/server/dal";
import { TeacherMaterialList } from "@/features/materials/components/teacher-material-list";
import { UploadMaterialDialog } from "@/features/materials/components/upload-material-dialog";
import { getTeacherClassMaterials } from "@/features/materials/server/dal";
import { parseTeacherMaterialsQueryParams } from "@/features/materials/types";

interface TeacherClassMaterialsPageProps {
  params: Promise<{ classId: string }>;
  searchParams: Promise<{ q?: string; filter?: string; type?: string; sort?: string }>;
}

export default function TeacherClassMaterialsPage(props: TeacherClassMaterialsPageProps) {
  return (
    <Suspense
      fallback={<div className="mx-auto max-w-7xl px-4 pt-28 pb-16">Loading materials...</div>}
    >
      <TeacherClassMaterialsContent params={props.params} searchParams={props.searchParams} />
    </Suspense>
  );
}

async function TeacherClassMaterialsContent(props: TeacherClassMaterialsPageProps) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthenticated: sign in to view your classes");
  }

  const [{ classId }, resolvedSearchParams] = await Promise.all([props.params, props.searchParams]);

  const classRecord = await getTeacherOwnedClassById(classId, session.user.id);
  if (!classRecord) notFound();

  const query = parseTeacherMaterialsQueryParams(resolvedSearchParams);

  const [materials, canUpdate, canDelete] = await Promise.all([
    getTeacherClassMaterials(classId, session.user.id, query),
    hasPermission("material", "update"),
    hasPermission("material", "delete"),
  ]);

  return (
    <PageShell
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
        <TeacherMaterialList
          materials={materials}
          query={query}
          canUpdate={canUpdate}
          canDelete={canDelete}
        />
      </Suspense>
    </PageShell>
  );
}
