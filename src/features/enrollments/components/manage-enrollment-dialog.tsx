"use client";

import { BookOpen } from "lucide-react";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import type { ReactNode } from "react";

interface ManageEnrollmentDialogProps {
  children: ReactNode;
}

export function ManageEnrollmentDialog({ children }: ManageEnrollmentDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <BookOpen className="mr-2 h-4 w-4" />
          Enroll
        </Button>
      </DialogTrigger>
      {open && (
        <Suspense fallback={<div className="p-4 text-sm text-muted-foreground">Loading...</div>}>
          {children}
        </Suspense>
      )}
    </Dialog>
  );
}
