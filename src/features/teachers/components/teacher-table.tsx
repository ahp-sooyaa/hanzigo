"use client";

import { format } from "date-fns";
import { DeleteTeacherAlert } from "./delete-teacher-alert";
import { EditTeacherDialog } from "./edit-teacher-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TeacherDTO } from "@/features/teachers/server/dto";

interface TeacherTableProps {
  teachers: TeacherDTO[];
  canUpdate?: boolean;
  canDelete?: boolean;
}

export function TeacherTable({ teachers, canUpdate, canDelete }: TeacherTableProps) {
  if (teachers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border bg-muted/20 p-8 text-center">
        <h3 className="mt-4 text-lg font-semibold">No teachers found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          You haven't added any teachers yet. Create one to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Teacher</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teachers.map((teacher) => (
            <TableRow key={teacher.id}>
              <TableCell>
                <div className="font-medium">{teacher.name}</div>
                <div className="text-sm text-muted-foreground">{teacher.email}</div>
              </TableCell>
              <TableCell>
                {teacher.banned ? (
                  <Badge variant="destructive">Banned</Badge>
                ) : (
                  <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                    Active
                  </Badge>
                )}
              </TableCell>
              <TableCell>{format(new Date(teacher.createdAt), "MMM d, yyyy")}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {canUpdate && <EditTeacherDialog teacher={teacher} />}
                  {canDelete && <DeleteTeacherAlert teacher={teacher} />}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
