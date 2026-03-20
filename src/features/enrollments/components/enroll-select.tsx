"use client";

import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createEnrollment } from "@/features/enrollments/server/actions";

interface EnrollSelectProps {
  studentId: string;
  availableOptions: { id: string; name: string; teacherName: string | null }[];
}

export function EnrollSelect({ studentId, availableOptions }: EnrollSelectProps) {
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const router = useRouter();

  const { execute, isExecuting } = useAction(createEnrollment, {
    onSuccess: () => {
      toast.success("Student enrolled successfully");
      setSelectedClassId("");
      router.refresh();
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Failed to enroll student");
    },
  });

  function handleEnroll() {
    if (!selectedClassId) {
      toast.error("Please select a class");
      return;
    }
    execute({ studentId, classId: selectedClassId });
  }

  return (
    <div className="space-y-3 pt-4">
      <Label htmlFor={`enroll-${studentId}`}>Add to Class</Label>
      <Select value={selectedClassId} onValueChange={setSelectedClassId}>
        <SelectTrigger id={`enroll-${studentId}`}>
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
        <Button onClick={handleEnroll} disabled={isExecuting}>
          {isExecuting ? "Enrolling..." : "Enroll Student"}
        </Button>
      </div>
    </div>
  );
}
