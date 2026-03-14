"use client";

import { BookOpen } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createEnrollment, deleteEnrollment } from "@/features/enrollments/server/actions";

interface ManageEnrollmentDialogProps {
  student: { id: string; name: string; email: string };
  classOptions: { id: string; name: string; teacherName: string | null }[];
  enrolledClasses: { classId: string; className: string; teacherName: string | null }[];
}

export function ManageEnrollmentDialog({
  student,
  classOptions,
  enrolledClasses,
}: ManageEnrollmentDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const router = useRouter();

  const createAction = useAction(createEnrollment, {
    onSuccess: () => {
      toast.success("Student enrolled successfully");
      setSelectedClassId("");
      router.refresh();
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Failed to enroll student");
    },
  });

  const deleteAction = useAction(deleteEnrollment, {
    onSuccess: () => {
      toast.success("Student unenrolled successfully");
      router.refresh();
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Failed to unenroll student");
    },
  });

  const enrolledIds = new Set(enrolledClasses.map((item) => item.classId));
  const availableOptions = classOptions.filter((option) => !enrolledIds.has(option.id));

  function handleEnroll() {
    if (!selectedClassId) {
      toast.error("Please select a class");
      return;
    }

    createAction.execute({
      studentId: student.id,
      classId: selectedClassId,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <BookOpen className="mr-2 h-4 w-4" />
          Enroll
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage Enrollment</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <div className="text-sm font-medium">{student.name}</div>
          <div className="text-xs text-muted-foreground">{student.email}</div>
        </div>

        <div className="space-y-3 pt-4">
          <Label>Current Classes</Label>
          {enrolledClasses.length === 0 ? (
            <div className="rounded-md border bg-muted/30 p-3 text-sm text-muted-foreground">
              No classes enrolled yet.
            </div>
          ) : (
            <div className="space-y-2">
              {enrolledClasses.map((item) => (
                <div
                  key={item.classId}
                  className="flex items-center justify-between rounded-md border px-3 py-2"
                >
                  <div>
                    <div className="text-sm font-medium">{item.className}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.teacherName ? `Teacher: ${item.teacherName}` : "Teacher: Unassigned"}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={deleteAction.isExecuting}
                    onClick={() =>
                      deleteAction.execute({
                        studentId: student.id,
                        classId: item.classId,
                      })
                    }
                  >
                    Unenroll
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3 pt-4">
          <Label htmlFor={`enroll-${student.id}`}>Add to Class</Label>
          <Select value={selectedClassId} onValueChange={setSelectedClassId}>
            <SelectTrigger id={`enroll-${student.id}`}>
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent position="popper">
              {availableOptions.length === 0 ? (
                <div className="p-2 text-center text-sm text-muted-foreground">
                  No available classes
                </div>
              ) : (
                availableOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.teacherName ? `${option.name} — ${option.teacherName}` : option.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <div className="flex justify-end">
            <Button onClick={handleEnroll} disabled={createAction.isExecuting}>
              {createAction.isExecuting ? "Enrolling..." : "Enroll Student"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
