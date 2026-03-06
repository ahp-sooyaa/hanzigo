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
import { deleteTeacher } from "@/features/teachers/server/actions";
import { TeacherDTO } from "@/features/teachers/server/dto";

interface DeleteTeacherAlertProps {
  teacher: TeacherDTO;
}

export function DeleteTeacherAlert({ teacher }: DeleteTeacherAlertProps) {
  const [open, setOpen] = useState(false);

  const { execute, isExecuting } = useAction(deleteTeacher, {
    onSuccess: () => {
      toast.success("Teacher deleted successfully");
      setOpen(false);
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Failed to delete teacher");
      setOpen(false);
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-destructive">
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete teacher</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the teacher account for {teacher.name} ({teacher.email})
            and remove their data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isExecuting}>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={isExecuting}
            onClick={(e) => {
              e.preventDefault();
              execute({ id: teacher.id });
            }}
          >
            {isExecuting ? "Deleting..." : "Delete Teacher"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
