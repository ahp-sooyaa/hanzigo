"use client";

import { Trash2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteClass } from "@/features/classes/server/actions";
import { ClassDTO } from "@/features/classes/server/dto";

interface DeleteClassAlertProps {
  classRecord: ClassDTO;
}

export function DeleteClassAlert({ classRecord }: DeleteClassAlertProps) {
  const [open, setOpen] = useState(false);

  const { execute, isExecuting } = useAction(deleteClass, {
    onSuccess: () => {
      toast.success("Class deleted successfully");
      setOpen(false);
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Failed to delete class");
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the class <strong>{classRecord.name}</strong>
            and remove any associated enrollments. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isExecuting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              execute({ id: classRecord.id });
            }}
            className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
            disabled={isExecuting}
          >
            {isExecuting ? "Deleting..." : "Delete Class"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
