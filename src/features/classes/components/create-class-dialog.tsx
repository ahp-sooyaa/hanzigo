"use client";

import { Plus } from "lucide-react";
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

interface CreateClassDialogProps {
  teachers: { id: string; name: string }[];
}

export function CreateClassDialog({ teachers }: CreateClassDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Class
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Class</DialogTitle>
        </DialogHeader>
        <ClassForm teachers={teachers} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
