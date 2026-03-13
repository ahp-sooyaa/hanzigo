"use client";

import { format } from "date-fns";
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
import { StudentDTO } from "@/features/students/server/dto";

interface StudentTableProps {
  students: StudentDTO[];
  canUpdate?: boolean;
  canDelete?: boolean;
}

export function StudentTable({ students, canUpdate, canDelete }: StudentTableProps) {
  if (students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border bg-muted/20 p-8 text-center">
        <h3 className="mt-4 text-lg font-semibold">No students found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          You haven't added any students yet. Create one to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>
                <div className="font-medium">{student.name}</div>
                <div className="text-sm text-muted-foreground">{student.email}</div>
              </TableCell>
              <TableCell>
                {student.banned ? (
                  <Badge variant="destructive">Banned</Badge>
                ) : (
                  <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                    Active
                  </Badge>
                )}
              </TableCell>
              <TableCell>{format(new Date(student.createdAt), "MMM d, yyyy")}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {canUpdate && <EditStudentDialog student={student} />}
                  {canDelete && <DeleteStudentAlert student={student} />}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
