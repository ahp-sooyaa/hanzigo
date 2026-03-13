import { ClassTable } from "./class-table";
import { hasPermission } from "@/features/auth/server/utils";
import { getClasses, getAllTeachersForDropdown } from "@/features/classes/server/dal";

interface ClassListFetchedProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export async function ClassListFetched({ searchParams }: ClassListFetchedProps) {
  const resolvedParams = await searchParams;
  const currentPage = resolvedParams.page ? parseInt(resolvedParams.page) : 1;
  const searchQuery = resolvedParams.search || undefined;

  const [classesResponse, teachers, canUpdate, canDelete] = await Promise.all([
    getClasses(currentPage, 10, searchQuery),
    getAllTeachersForDropdown(),
    hasPermission("class", "update"),
    hasPermission("class", "delete"),
  ]);

  return (
    <ClassTable
      classes={classesResponse.data}
      teachers={teachers}
      canUpdate={canUpdate}
      canDelete={canDelete}
    />
  );
}
