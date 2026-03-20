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

import type { ReactNode } from "react";

interface CreateClassDialogProps {
  teacherOptions: ReactNode;
}

export function CreateClassDialog({ teacherOptions }: CreateClassDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl bg-[var(--admin-primary)] px-5 font-semibold text-white hover:bg-[var(--admin-primary-strong)]">
          <Plus className="mr-2 h-4 w-4" />
          Create New Class
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Class</DialogTitle>
        </DialogHeader>
        <ClassForm teacherOptions={teacherOptions} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
