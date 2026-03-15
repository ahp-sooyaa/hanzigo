"use client";

import { format } from "date-fns";
import { Download, Filter, Search } from "lucide-react";
import { DeleteStudentAlert } from "./delete-student-alert";
import { EditStudentDialog } from "./edit-student-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ManageEnrollmentDialog } from "@/features/enrollments/components/manage-enrollment-dialog";
import { StudentDTO } from "@/features/students/server/dto";

interface StudentTableProps {
  students: StudentDTO[];
  classOptions: { id: string; name: string; teacherName: string | null }[];
  enrollmentsByStudentId: Record<
    string,
    { classId: string; className: string; teacherName: string | null }[]
  >;
  canUpdate?: boolean;
  canDelete?: boolean;
}

export function StudentTable({
  students,
  classOptions,
  enrollmentsByStudentId,
  canUpdate,
  canDelete,
}: StudentTableProps) {
  if (students.length === 0) {
    return (
      <div className="rounded-3xl border border-[var(--admin-border)] bg-white p-10 text-center shadow-sm">
        <h3 className="mt-4 text-lg font-semibold">No students found</h3>
        <p className="mt-2 text-sm text-[var(--admin-text-muted)]">
          You haven't added any students yet. Create one to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold text-[var(--admin-title)]">Student Directory</h2>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--admin-text-muted)]" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="h-10 w-full rounded-xl border border-[var(--admin-border)] bg-white pr-3 pl-9 text-sm text-[var(--admin-text-main)] transition outline-none focus:border-[var(--admin-primary)] focus:ring-2 focus:ring-[var(--admin-primary)]/15"
            />
          </div>
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-[var(--admin-border)] bg-white px-4 text-sm font-semibold text-[var(--admin-text-main)]"
          >
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-[var(--admin-border)] bg-white px-4 text-sm font-semibold text-[var(--admin-text-main)]"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-[var(--admin-border)] bg-white shadow-sm">
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
            {students.map((student) => (
              <TableRow key={student.id} className="hover:bg-[#f9fafb]">
                <TableCell className="px-6 py-4">
                  <div className="font-semibold text-[var(--admin-text-main)]">{student.name}</div>
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
                    <ManageEnrollmentDialog
                      student={student}
                      classOptions={classOptions}
                      enrolledClasses={enrollmentsByStudentId[student.id] || []}
                    />
                    {canUpdate && <EditStudentDialog student={student} />}
                    {canDelete && <DeleteStudentAlert student={student} />}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
