import { CalendarDays, FileText, Video } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { StudentClassTabs } from "@/components/layout/student-class-tabs";
import { Button } from "@/components/ui/button";
import { getSession } from "@/features/auth/server/utils";
import { getStudentEnrolledClassById } from "@/features/enrollments/server/dal";
import { StudentMaterialList } from "@/features/materials/components/student-material-list";
import { getStudentClassMaterials } from "@/features/materials/server/dal";
import { parseStudentMaterialsQueryParams } from "@/features/materials/types";

interface StudentClassMaterialsPageProps {
  params: Promise<{ classId: string }>;
  searchParams: Promise<{ q?: string; filter?: string; type?: string; sort?: string }>;
}

export default function StudentClassMaterialsPage(props: StudentClassMaterialsPageProps) {
  return (
    <Suspense
      fallback={<div className="mx-auto max-w-7xl px-4 pt-28 pb-16">Loading materials...</div>}
    >
      <StudentClassMaterialsContent params={props.params} searchParams={props.searchParams} />
    </Suspense>
  );
}

async function StudentClassMaterialsContent(props: StudentClassMaterialsPageProps) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthenticated: sign in to view your classes");
  }

  const [{ classId }, resolvedSearchParams] = await Promise.all([props.params, props.searchParams]);

  const classRecord = await getStudentEnrolledClassById(session.user.id, classId);
  if (!classRecord) notFound();

  const query = parseStudentMaterialsQueryParams(resolvedSearchParams);
  const materials = await getStudentClassMaterials(classId, session.user.id, query);

  return (
    <PageShell
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
        <StudentMaterialList materials={materials} query={query} />
      </Suspense>
    </PageShell>
  );
}
