import { Suspense } from "react";
import { ClassTable } from "@/features/classes/components/class-table";
import { CreateClassDialog } from "@/features/classes/components/create-class-dialog";
import { getClasses, getAllTeachersForDropdown } from "@/features/classes/server/dal";

export const metadata = {
  title: "Admin | Classes - Hanzigo",
  description: "Manage classes in Hanzigo",
};

export default async function AdminClassesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const { page, search } = await searchParams;
  const currentPage = page ? parseInt(page) : 1;
  const searchQuery = search || undefined;

  // `use cache` would be placed inside `getClasses` as per guidelines,
  // but we fetch directly here and rely on Next.js 15 Partial Prerendering / Cache setup.
  const [classesResponse, teachers] = await Promise.all([
    getClasses(currentPage, 10, searchQuery),
    getAllTeachersForDropdown(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Classes</h1>
          <p className="text-muted-foreground">Manage classes and assign teachers to them.</p>
        </div>
        <CreateClassDialog teachers={teachers} />
      </div>

      <Suspense fallback={<div>Loading classes...</div>}>
        <ClassTable classes={classesResponse.data} teachers={teachers} />
      </Suspense>
    </div>
  );
}
