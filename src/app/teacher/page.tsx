import { BookOpenCheck, FolderOpen, Sparkles } from "lucide-react";
import { Suspense } from "react";
import { DashboardPageIntro } from "@/components/layout/dashboard-page-intro";
import { TeacherClassesFetched } from "@/features/enrollments/components/teacher-classes-fetched";

export const metadata = {
  title: "Teacher Dashboard - Hanzigo",
  description: "View assigned classes",
};

export default function TeacherDashboardPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 pt-28 pb-16 sm:px-6 lg:px-8">
      <DashboardPageIntro
        portalLabel="Teacher Portal"
        breadcrumb="Dashboard"
        title="Teacher Dashboard"
        subtitle="Track your classes, grading workload, and weekly schedule."
      />
      <div className="space-y-8">
        <section>
          <div className="mb-6 flex items-center gap-3">
            <BookOpenCheck className="h-5 w-5" />
            <h2 className="text-xl font-bold tracking-tight text-foreground">Active Classes</h2>
          </div>
          <Suspense
            fallback={
              <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-sm text-muted-foreground">
                Loading classes...
              </div>
            }
          >
            <TeacherClassesFetched />
          </Suspense>
        </section>

        <section>
          <div className="mb-4 flex items-center gap-3">
            <FolderOpen className="h-5 w-5" />
            <h2 className="text-xl font-bold tracking-tight text-foreground">Past Classes</h2>
          </div>
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <Sparkles className="h-6 w-6" />
            </span>
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              No past attended classes yet
            </h3>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Once you complete a class, it will appear here with your result and certificate.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
