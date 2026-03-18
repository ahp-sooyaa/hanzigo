import { CalendarDays, School, Users } from "lucide-react";
import { Suspense } from "react";
import { AdminTabs } from "@/components/layout/admin-tabs";
import { PageShell } from "@/components/layout/page-shell";
import { IfPermitted } from "@/features/auth/components/if-permitted";
import { ClassTable } from "@/features/classes/components/class-table";
import { CreateClassDialog } from "@/features/classes/components/create-class-dialog";
import { TeacherSelectOptions } from "@/features/classes/components/teacher-select-options";

export const metadata = {
  title: "Admin | Classes - Hanzigo",
  description: "Manage classes in Hanzigo",
};

export default async function AdminClassesPage(props: {
  searchParams: Promise<{ q?: string; filter?: string; sort?: string; page?: string }>;
}) {
  return (
    <PageShell
      portalLabel="Admin Portal"
      breadcrumb="Class Management"
      title="Class Management"
      stats={[
        { icon: School, label: "42 Active Classes" },
        { icon: Users, label: "1,205 Enrolled Students" },
        { icon: CalendarDays, label: "Spring Term 2024" },
      ]}
      tabs={<AdminTabs activeTab="classes" />}
      action={
        <Suspense fallback={<div className="h-11 w-36 animate-pulse rounded-xl bg-muted" />}>
          <IfPermitted resource="class" action="create">
            <CreateClassDialog teacherOptions={<TeacherSelectOptions />} />
          </IfPermitted>
        </Suspense>
      }
    >
      <Suspense fallback={<div>Loading classes...</div>}>
        <ClassTable searchParams={props.searchParams} />
      </Suspense>
    </PageShell>
  );
}
