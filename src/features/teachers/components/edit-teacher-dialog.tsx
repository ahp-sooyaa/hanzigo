"use client";

import { Edit } from "lucide-react";
import { useState } from "react";
import { TeacherForm } from "./teacher-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TeacherDTO } from "@/features/teachers/server/dto";

interface EditTeacherDialogProps {
  teacher: TeacherDTO;
}

export function EditTeacherDialog({ teacher }: EditTeacherDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit teacher</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Teacher</DialogTitle>
        </DialogHeader>
        <TeacherForm
          defaultValues={{
            id: teacher.id,
            name: teacher.name,
            bio: teacher.bio || "",
          }}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
