"use client";

import { Edit } from "lucide-react";
import { useState } from "react";
import { ClassForm } from "./class-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ClassDTO } from "@/features/classes/server/dto";

interface EditClassDialogProps {
  classRecord: ClassDTO;
  teachers: { id: string; name: string }[];
}

export function EditClassDialog({ classRecord, teachers }: EditClassDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Class</DialogTitle>
        </DialogHeader>
        <ClassForm
          defaultValues={{
            id: classRecord.id,
            name: classRecord.name,
            description: classRecord.description,
            teacherId: classRecord.teacherId,
          }}
          teachers={teachers}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
