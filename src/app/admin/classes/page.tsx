import { Suspense } from "react";
import { IfPermitted } from "@/features/auth/components/if-permitted";
import { ClassListFetched } from "@/features/classes/components/class-list-fetched";
import { CreateClassButton } from "@/features/classes/components/create-class-button";

export const metadata = {
  title: "Admin | Classes - Hanzigo",
  description: "Manage classes in Hanzigo",
};

export default async function AdminClassesPage(props: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  return (
    <div className="space-y-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Classes</h1>
          <p className="text-muted-foreground">Manage classes and assign teachers to them.</p>
        </div>
        <Suspense fallback={<div className="h-10 w-28 animate-pulse rounded-md bg-muted" />}>
          <IfPermitted resource="class" action="create">
            <CreateClassButton />
          </IfPermitted>
        </Suspense>
      </div>

      <Suspense fallback={<div>Loading classes...</div>}>
        <ClassListFetched searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}
