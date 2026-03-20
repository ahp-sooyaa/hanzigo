import { format } from "date-fns";
import { Download } from "lucide-react";
import { Suspense } from "react";
import { DeleteStudentAlert } from "./delete-student-alert";
import { EditStudentDialog } from "./edit-student-dialog";
import { DataEmptyState, DataListShell, DataTableCard } from "@/components/layout/data-list";
import { TableSearchFilterSortBar } from "@/components/layout/table-search-filter-sort-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IfPermitted } from "@/features/auth/components/if-permitted";
import { ManageEnrollmentDialog } from "@/features/enrollments/components/manage-enrollment-dialog";
import { ManageEnrollmentDialogContent } from "@/features/enrollments/components/manage-enrollment-dialog-content";
import { sanitizeQuery } from "@/features/shared/table-query";
import { getStudents } from "@/features/students/server/dal";

interface StudentTableProps {
  searchParams: Promise<{ q?: string; filter?: string; sort?: string; page?: string }>;
}

const STUDENT_FILTER_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "withdrawn", label: "Withdrawn" },
] as const;

export async function StudentTable({ searchParams }: StudentTableProps) {
  const resolvedSearchParams = await searchParams;
  const query = sanitizeQuery(resolvedSearchParams, STUDENT_FILTER_OPTIONS, "all");

  const students = await getStudents();

  const filtered = students
    .filter((student) => {
      if (!query.q) return true;
      const needle = query.q.toLowerCase();
      return (
        student.name.toLowerCase().includes(needle) || student.email.toLowerCase().includes(needle)
      );
    })
    .filter((student) => {
      if (query.filter === "all") return true;
      return query.filter === "active" ? !student.banned : student.banned;
    })
    .sort((a, b) => {
      if (query.sort === "oldest") return +new Date(a.createdAt) - +new Date(b.createdAt);
      return +new Date(b.createdAt) - +new Date(a.createdAt);
    });

  const hasActiveFilters = query.q.length > 0 || query.filter !== "all" || query.sort !== "newest";

  if (filtered.length === 0 && !hasActiveFilters) {
    return (
      <DataEmptyState
        title="No students found"
        description="You haven't added any students yet. Create one to get started."
      />
    );
  }

  return (
    <DataListShell
      title="Student Directory"
      count={filtered.length}
      toolbar={
        <div className="flex w-full flex-row flex-wrap items-center gap-2 sm:w-auto">
          <TableSearchFilterSortBar
            query={query}
            searchPlaceholder="Search by name or email..."
            filterLabel="Student status"
            filterOptions={[...STUDENT_FILTER_OPTIONS]}
          />
          <Button type="button" variant="outline" size="sm">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      }
    >
      {filtered.length === 0 ? (
        <DataTableCard className="p-8 text-center text-sm text-[var(--admin-text-muted)]">
          No students match your search or filters.
        </DataTableCard>
      ) : (
        <DataTableCard>
          <Table>
            <TableHeader>
              <TableRow className="bg-[#f9fafb] hover:bg-[#f9fafb]">
                <TableHead className="h-auto px-6 py-4 text-xs font-bold tracking-wide text-[var(--admin-text-muted)] uppercase">
                  Student
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
              {filtered.map((student) => (
                <TableRow key={student.id} className="hover:bg-[#f9fafb]">
                  <TableCell className="px-6 py-4">
                    <div className="font-semibold text-[var(--admin-text-main)]">
                      {student.name}
                    </div>
                    <div className="text-sm text-[var(--admin-text-muted)]">{student.email}</div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {student.banned ? (
                      <Badge className="rounded-lg bg-red-100 text-red-700 hover:bg-red-100">
                        Withdrawn
                      </Badge>
                    ) : (
                      <Badge className="rounded-lg bg-green-100 text-green-700 hover:bg-green-100">
                        Active
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-[var(--admin-text-main)]">
                    {format(new Date(student.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <ManageEnrollmentDialog>
                        <ManageEnrollmentDialogContent student={student} />
                      </ManageEnrollmentDialog>
                      <Suspense fallback={<div>Loading...</div>}>
                        <IfPermitted resource="student" action="update">
                          <EditStudentDialog student={student} />
                        </IfPermitted>
                      </Suspense>
                      <Suspense fallback={<div>Loading...</div>}>
                        <IfPermitted resource="student" action="delete">
                          <DeleteStudentAlert student={student} />
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
