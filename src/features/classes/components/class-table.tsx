"use client";

import { format } from "date-fns";
import { Filter, Search } from "lucide-react";
import { DeleteClassAlert } from "./delete-class-alert";
import { EditClassDialog } from "./edit-class-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClassDTO } from "@/features/classes/server/dto";

interface ClassTableProps {
  classes: ClassDTO[];
  teachers: { id: string; name: string }[];
  canUpdate?: boolean;
  canDelete?: boolean;
}

export function ClassTable({ classes, teachers, canUpdate, canDelete }: ClassTableProps) {
  if (classes.length === 0) {
    return (
      <div className="rounded-3xl border border-[var(--admin-border)] bg-white p-10 text-center shadow-sm">
        <h3 className="mt-4 text-lg font-semibold">No classes found</h3>
        <p className="mt-2 text-sm text-[var(--admin-text-muted)]">
          You haven't created any classes yet. Add one to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold text-[var(--admin-title)]">
          All Classes
          <span className="ml-2 rounded-md bg-[#f3f4f6] px-2 py-0.5 text-sm text-[var(--admin-text-muted)]">
            {classes.length}
          </span>
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--admin-text-muted)]" />
            <input
              type="text"
              placeholder="Search classes or instructors..."
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
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-[var(--admin-border)] bg-white shadow-sm">
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
            {classes.map((classRecord) => (
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
                    {canUpdate && <EditClassDialog classRecord={classRecord} teachers={teachers} />}
                    {canDelete && <DeleteClassAlert classRecord={classRecord} />}
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
