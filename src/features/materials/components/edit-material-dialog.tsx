"use client";

import { Edit } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateClassMaterial } from "@/features/materials/server/actions";
import { ClassMaterialDTO } from "@/features/materials/server/dto";

interface EditMaterialDialogProps {
  material: ClassMaterialDTO;
}

export function EditMaterialDialog({ material }: EditMaterialDialogProps) {
  const [open, setOpen] = useState(false);

  const { execute, isExecuting } = useAction(updateClassMaterial, {
    onSuccess: () => {
      toast.success("Material updated successfully");
      setOpen(false);
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Failed to update material");
    },
  });

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = (formData.get("title") as string | null)?.trim() || "";
    const externalUrl = (formData.get("externalUrl") as string | null)?.trim() || undefined;

    if (!title) {
      toast.error("Title is required");
      return;
    }

    if (material.materialType === "link" && !externalUrl) {
      toast.error("Link URL is required");
      return;
    }

    execute({
      id: material.id,
      classId: material.classId,
      title,
      externalUrl,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Material</DialogTitle>
          <DialogDescription>
            Update material details. PDF file replacement is not supported from this dialog.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`title-${material.id}`}>Title</Label>
            <Input
              id={`title-${material.id}`}
              name="title"
              defaultValue={material.title}
              required
            />
          </div>

          {material.materialType === "link" && (
            <div className="space-y-2">
              <Label htmlFor={`externalUrl-${material.id}`}>Link URL</Label>
              <Input
                id={`externalUrl-${material.id}`}
                name="externalUrl"
                type="url"
                defaultValue={material.externalUrl ?? ""}
                required
              />
            </div>
          )}

          <DialogFooter>
            <Button type="submit" disabled={isExecuting}>
              {isExecuting ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
