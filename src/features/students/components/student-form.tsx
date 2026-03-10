"use client";

import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createStudent, updateStudent } from "@/features/students/server/actions";
import { StudentDTO } from "@/features/students/server/dto";

interface StudentFormProps {
  defaultValues?: Pick<StudentDTO, "id" | "name">;
  onSuccess?: () => void;
}

export function StudentForm({ defaultValues, onSuccess }: StudentFormProps) {
  const isEditing = !!defaultValues?.id;

  const createAction = useAction(createStudent, {
    onSuccess: () => {
      toast.success("Student created successfully!");
      onSuccess?.();
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Failed to create student");
    },
  });

  const updateAction = useAction(updateStudent, {
    onSuccess: () => {
      toast.success("Student updated successfully!");
      onSuccess?.();
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Failed to update student");
    },
  });

  const isExecuting = isEditing ? updateAction.isExecuting : createAction.isExecuting;

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (isEditing) {
      updateAction.execute({
        id: defaultValues.id!,
        name,
      });
    } else {
      createAction.execute({ name, email, password });
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          defaultValue={defaultValues?.name}
          placeholder="Student Name"
          required
        />
      </div>

      {!isEditing && (
        <>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="student@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" placeholder="********" required />
          </div>
        </>
      )}

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isExecuting}>
          {isExecuting
            ? isEditing
              ? "Updating..."
              : "Creating..."
            : isEditing
              ? "Update Student"
              : "Create Student"}
        </Button>
      </div>
    </form>
  );
}
