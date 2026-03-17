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
import { deleteClassMaterial } from "@/features/materials/server/actions";
import { ClassMaterialDTO } from "@/features/materials/server/dto";

interface DeleteMaterialAlertProps {
  material: ClassMaterialDTO;
}

export function DeleteMaterialAlert({ material }: DeleteMaterialAlertProps) {
  const [open, setOpen] = useState(false);

  const { execute, isExecuting } = useAction(deleteClassMaterial, {
    onSuccess: () => {
      toast.success("Material deleted successfully");
      setOpen(false);
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Failed to delete material");
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete material?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete <strong>{material.title}</strong>. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isExecuting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault();
              execute({ id: material.id, classId: material.classId });
            }}
            variant="destructive"
            disabled={isExecuting}
          >
            {isExecuting ? "Deleting..." : "Delete material"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
