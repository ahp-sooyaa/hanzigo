"use client";

import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteEnrollment } from "@/features/enrollments/server/actions";

interface UnenrollButtonProps {
  studentId: string;
  classId: string;
}

export function UnenrollButton({ studentId, classId }: UnenrollButtonProps) {
  const router = useRouter();

  const { execute, isExecuting } = useAction(deleteEnrollment, {
    onSuccess: () => {
      toast.success("Student unenrolled successfully");
      router.refresh();
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Failed to unenroll student");
    },
  });

  function handleUnenroll() {
    execute({ studentId, classId });
  }

  return (
    <Button variant="ghost" size="sm" disabled={isExecuting} onClick={handleUnenroll}>
      Unenroll
    </Button>
  );
}
