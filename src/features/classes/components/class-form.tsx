"use client";

import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createClass, updateClass } from "@/features/classes/server/actions";

import type { ReactNode } from "react";

interface ClassFormProps {
  teacherOptions: ReactNode;
  defaultValues?: {
    id?: string;
    name?: string;
    description?: string | null;
    teacherId?: string;
  };
  onSuccess?: () => void;
}

export function ClassForm({ teacherOptions, defaultValues, onSuccess }: ClassFormProps) {
  const isEditing = !!defaultValues?.id;

  // Need to control the select value for native form submission
  const [teacherId, setTeacherId] = useState<string>(defaultValues?.teacherId || "");

  const createAction = useAction(createClass, {
    onSuccess: () => {
      toast.success("Class created successfully!");
      onSuccess?.();
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Failed to create class");
    },
  });

  const updateAction = useAction(updateClass, {
    onSuccess: () => {
      toast.success("Class updated successfully!");
      onSuccess?.();
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Failed to update class");
    },
  });

  const isExecuting = isEditing ? updateAction.isExecuting : createAction.isExecuting;

  async function onSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    if (!teacherId) {
      toast.error("Please select a teacher");
      return;
    }

    if (isEditing) {
      updateAction.execute({
        id: defaultValues!.id!,
        name,
        description: description || null,
        teacherId,
      });
    } else {
      createAction.execute({
        name,
        description: description || undefined,
        teacherId,
      });
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Class Name</Label>
        <Input
          id="name"
          name="name"
          defaultValue={defaultValues?.name}
          placeholder="e.g. Beginner Chinese 101"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="teacherId">Assigned Teacher</Label>
        <Select value={teacherId} onValueChange={setTeacherId} required>
          <SelectTrigger>
            <SelectValue placeholder="Select a teacher" />
          </SelectTrigger>
          <SelectContent position="popper">{teacherOptions}</SelectContent>
        </Select>
        {/* Hidden input to ensure native form data doesn't strictly need it, but semantic HTML is good */}
        <input type="hidden" name="teacherId" value={teacherId} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={defaultValues?.description || ""}
          placeholder="Class description or syllabus overview..."
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isExecuting}>
          {isExecuting
            ? isEditing
              ? "Updating..."
              : "Creating..."
            : isEditing
              ? "Update Class"
              : "Create Class"}
        </Button>
      </div>
    </form>
  );
}
