"use client";

import { Trash2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteStudent } from "@/features/students/server/actions";
import { StudentDTO } from "@/features/students/server/dto";

interface DeleteStudentAlertProps {
  student: StudentDTO;
}

export function DeleteStudentAlert({ student }: DeleteStudentAlertProps) {
  const [open, setOpen] = useState(false);

  const { execute, isExecuting } = useAction(deleteStudent, {
    onSuccess: () => {
      toast.success("Student deleted successfully");
      setOpen(false);
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Failed to delete student");
      setOpen(false);
    },
  });

  function handleDelete(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    execute({ id: student.id });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-destructive">
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete student</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the student account for {student.name} ({student.email})
            and remove their data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isExecuting}>Cancel</AlertDialogCancel>
          <Button variant="destructive" disabled={isExecuting} onClick={handleDelete}>
            {isExecuting ? "Deleting..." : "Delete Student"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
