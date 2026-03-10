"use client";

import { format } from "date-fns";
import { DeleteClassAlert } from "./delete-class-alert";
import { EditClassDialog } from "./edit-class-dialog";
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
}

export function ClassTable({ classes, teachers }: ClassTableProps) {
  if (classes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border bg-muted/20 p-8 text-center">
        <h3 className="mt-4 text-lg font-semibold">No classes found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          You haven't created any classes yet. Add one to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Class Name</TableHead>
            <TableHead>Assigned Teacher</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.map((classRecord) => (
            <TableRow key={classRecord.id}>
              <TableCell>
                <div className="font-medium">{classRecord.name}</div>
                <div className="line-clamp-1 max-w-[300px] text-sm text-muted-foreground">
                  {classRecord.description || "No description provided"}
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium">{classRecord.teacherName || "Unassigned"}</div>
              </TableCell>
              <TableCell>{format(new Date(classRecord.createdAt), "MMM d, yyyy")}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <EditClassDialog classRecord={classRecord} teachers={teachers} />
                  <DeleteClassAlert classRecord={classRecord} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
