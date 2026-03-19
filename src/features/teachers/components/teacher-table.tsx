import { format } from "date-fns";
import { Suspense } from "react";
import { DeleteTeacherAlert } from "./delete-teacher-alert";
import { EditTeacherDialog } from "./edit-teacher-dialog";
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
import { sanitizeQuery } from "@/features/shared/table-query";
import { getTeachers } from "@/features/teachers/server/dal";

interface TeacherTableProps {
  searchParams: Promise<{ q?: string; filter?: string; sort?: string; page?: string }>;
}

const TEACHER_FILTER_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
] as const;

export async function TeacherTable({ searchParams }: TeacherTableProps) {
  const resolvedSearchParams = await searchParams;
  const query = sanitizeQuery(resolvedSearchParams, TEACHER_FILTER_OPTIONS, "all");

  const teachers = await getTeachers();

  const filtered = teachers
    .filter((teacher) => {
      if (!query.q) return true;
      const needle = query.q.toLowerCase();
      return (
        teacher.name.toLowerCase().includes(needle) || teacher.email.toLowerCase().includes(needle)
      );
    })
    .filter((teacher) => {
      if (query.filter === "all") return true;
      return query.filter === "active" ? !teacher.banned : teacher.banned;
    })
    .sort((a, b) => {
      if (query.sort === "oldest") return +new Date(a.createdAt) - +new Date(b.createdAt);
      return +new Date(b.createdAt) - +new Date(a.createdAt);
    });

  const hasActiveFilters = query.q.length > 0 || query.filter !== "all" || query.sort !== "newest";

  if (filtered.length === 0 && !hasActiveFilters) {
    return (
      <DataEmptyState
        title="No teachers found"
        description="You haven't added any teachers yet. Create one to get started."
      />
    );
  }

  return (
    <DataListShell
      title="Registered Instructors"
      count={filtered.length}
      toolbar={
        <TableSearchFilterSortBar
          query={query}
          searchPlaceholder="Search teachers..."
          filterLabel="Teacher status"
          filterOptions={[...TEACHER_FILTER_OPTIONS]}
        />
      }
    >
      {filtered.length === 0 ? (
        <DataTableCard className="p-8 text-center text-sm text-[var(--admin-text-muted)]">
          No teachers match your search or filters.
        </DataTableCard>
      ) : (
        <DataTableCard>
          <Table>
            <TableHeader>
              <TableRow className="bg-[#f9fafb] hover:bg-[#f9fafb]">
                <TableHead className="h-auto px-6 py-4 text-xs font-bold tracking-wide text-[var(--admin-text-muted)] uppercase">
                  Teacher
                </TableHead>
                <TableHead className="h-auto px-6 py-4 text-xs font-bold tracking-wide text-[var(--admin-text-muted)] uppercase">
                  Status
                </TableHead>
                <TableHead className="h-auto px-6 py-4 text-xs font-bold tracking-wide text-[var(--admin-text-muted)] uppercase">
                  Joined
                </TableHead>
                <TableHead className="h-auto px-6 py-4 text-right text-xs font-bold tracking-wide text-[var(--admin-text-muted)] uppercase">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((teacher) => (
                <TableRow key={teacher.id} className="hover:bg-[#f9fafb]">
                  <TableCell className="px-6 py-4">
                    <div className="font-semibold text-[var(--admin-text-main)]">
                      {teacher.name}
                    </div>
                    <div className="text-sm text-[var(--admin-text-muted)]">{teacher.email}</div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {teacher.banned ? (
                      <Badge className="rounded-lg bg-red-100 text-red-700 hover:bg-red-100">
                        Inactive
                      </Badge>
                    ) : (
                      <Badge className="rounded-lg bg-green-100 text-green-700 hover:bg-green-100">
                        Active
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-[var(--admin-text-main)]">
                    {format(new Date(teacher.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Suspense fallback={<div>Loading...</div>}>
                        <IfPermitted resource="teacher" action="update">
                          <EditTeacherDialog teacher={teacher} />
                        </IfPermitted>
                      </Suspense>
                      <Suspense fallback={<div>Loading...</div>}>
                        <IfPermitted resource="teacher" action="delete">
                          <DeleteTeacherAlert teacher={teacher} />
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
