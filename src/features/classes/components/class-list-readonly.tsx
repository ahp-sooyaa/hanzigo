"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ClassListReadonlyProps {
  classes: { id: string; name: string; description: string | null; teacherName: string | null }[];
  emptyTitle?: string;
  emptyDescription?: string;
}

export function ClassListReadonly({
  classes,
  emptyTitle = "No classes found",
  emptyDescription = "There are no classes to show yet.",
}: ClassListReadonlyProps) {
  console.log("classes", classes);
  if (classes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border bg-muted/20 p-8 text-center">
        <h3 className="mt-4 text-lg font-semibold">{emptyTitle}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Class</TableHead>
            <TableHead>Teacher</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.map((classRecord) => (
            <TableRow key={classRecord.id}>
              <TableCell>
                <div className="font-medium">{classRecord.name}</div>
                <div className="line-clamp-1 max-w-[500px] text-sm text-muted-foreground">
                  {classRecord.description || "No description provided"}
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium">{classRecord.teacherName || "Unassigned"}</div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
