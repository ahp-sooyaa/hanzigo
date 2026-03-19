import { format } from "date-fns";
import { Suspense } from "react";
import { DeleteClassAlert } from "./delete-class-alert";
import { EditClassDialog } from "./edit-class-dialog";
import { TeacherSelectOptions } from "./teacher-select-options";
import { DataEmptyState, DataListShell, DataTableCard } from "@/components/layout/data-list";
import { TableSearchFilterSortBar } from "@/components/layout/table-search-filter-sort-bar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IfPermitted } from "@/features/auth/components/if-permitted";
import { getClasses } from "@/features/classes/server/dal";
import { sanitizeQuery } from "@/features/shared/table-query";

interface ClassTableProps {
  searchParams: Promise<{ q?: string; filter?: string; sort?: string; page?: string }>;
}

const CLASS_FILTER_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "scheduled", label: "Scheduled" },
] as const;

export async function ClassTable({ searchParams }: ClassTableProps) {
  const resolvedSearchParams = await searchParams;
  const query = sanitizeQuery(resolvedSearchParams, CLASS_FILTER_OPTIONS, "all");

  const classesResponse = await getClasses(query.page, 10, query.q);

  const filtered = classesResponse.data
    .filter((classRecord) => {
      if (query.filter === "all") return true;
      const isActive = Boolean(classRecord.teacherName);
      return query.filter === "active" ? isActive : !isActive;
    })
    .sort((a, b) => {
      if (query.sort === "oldest") return +new Date(a.createdAt) - +new Date(b.createdAt);
      return +new Date(b.createdAt) - +new Date(a.createdAt);
    });

  const hasActiveFilters = query.q.length > 0 || query.filter !== "all" || query.sort !== "newest";

  if (filtered.length === 0 && !hasActiveFilters) {
    return (
      <DataEmptyState
        title="No classes found"
        description="You haven't created any classes yet. Add one to get started."
      />
    );
  }

  return (
    <DataListShell
      title="All Classes"
      count={filtered.length}
      toolbar={
        <TableSearchFilterSortBar
          query={query}
          searchPlaceholder="Search classes or instructors..."
          filterLabel="Class status"
          filterOptions={[...CLASS_FILTER_OPTIONS]}
        />
      }
    >
      {filtered.length === 0 ? (
        <DataTableCard className="p-8 text-center text-sm text-[var(--admin-text-muted)]">
          No classes match your search or filters.
        </DataTableCard>
      ) : (
        <DataTableCard>
          <Table>
            <TableHeader>
              <TableRow className="bg-[#f9fafb] hover:bg-[#f9fafb]">
                <TableHead className="h-auto px-6 py-4 text-xs font-bold tracking-wide text-[var(--admin-text-muted)] uppercase">
                  Class Name
                </TableHead>
                <TableHead className="h-auto px-6 py-4 text-xs font-bold tracking-wide text-[var(--admin-text-muted)] uppercase">
                  Assigned Teacher
                </TableHead>
                <TableHead className="h-auto px-6 py-4 text-xs font-bold tracking-wide text-[var(--admin-text-muted)] uppercase">
                  Created
                </TableHead>
                <TableHead className="h-auto px-6 py-4 text-xs font-bold tracking-wide text-[var(--admin-text-muted)] uppercase">
                  Status
                </TableHead>
                <TableHead className="h-auto px-6 py-4 text-right text-xs font-bold tracking-wide text-[var(--admin-text-muted)] uppercase">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((classRecord) => (
                <TableRow key={classRecord.id} className="hover:bg-[#f9fafb]">
                  <TableCell className="px-6 py-4">
                    <div className="font-semibold text-[var(--admin-text-main)]">
                      {classRecord.name}
                    </div>
                    <div className="line-clamp-1 max-w-[300px] text-sm text-[var(--admin-text-muted)]">
                      {classRecord.description || "No description provided"}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="font-medium text-[var(--admin-text-main)]">
                      {classRecord.teacherName || "Unassigned"}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-[var(--admin-text-main)]">
                    {format(new Date(classRecord.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {classRecord.teacherName ? (
                      <Badge className="rounded-lg bg-green-100 text-green-700 hover:bg-green-100">
                        Active
                      </Badge>
                    ) : (
                      <Badge className="rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-100">
                        Scheduled
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Suspense fallback={<div>Loading...</div>}>
                        <IfPermitted resource="class" action="update">
                          <EditClassDialog
                            classRecord={classRecord}
                            teacherOptions={<TeacherSelectOptions />}
                          />
                        </IfPermitted>
                      </Suspense>
                      <Suspense fallback={<div>Loading...</div>}>
                        <IfPermitted resource="class" action="delete">
                          <DeleteClassAlert classRecord={classRecord} />
                        </IfPermitted>
                      </Suspense>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DataTableCard>
      )}
    </DataListShell>
  );
}
