"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { StudentForm } from "./student-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function CreateStudentDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl bg-[var(--admin-primary)] px-5 font-semibold text-white hover:bg-[var(--admin-primary-strong)]">
          <Plus className="mr-2 h-4 w-4" />
          Add New Student
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Student</DialogTitle>
        </DialogHeader>
        <StudentForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
