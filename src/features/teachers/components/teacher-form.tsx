"use client";

import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createTeacher, updateTeacher } from "@/features/teachers/server/actions";

interface TeacherFormProps {
  defaultValues?: {
    id?: string;
    name?: string;
    email?: string;
    bio?: string;
  };
  onSuccess?: () => void;
}

export function TeacherForm({ defaultValues, onSuccess }: TeacherFormProps) {
  const isEditing = !!defaultValues?.id;

  const createAction = useAction(createTeacher, {
    onSuccess: () => {
      toast.success("Teacher created successfully!");
      onSuccess?.();
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Failed to create teacher");
    },
  });

  const updateAction = useAction(updateTeacher, {
    onSuccess: () => {
      toast.success("Teacher updated successfully!");
      onSuccess?.();
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Failed to update teacher");
    },
  });

  const isExecuting = isEditing ? updateAction.isExecuting : createAction.isExecuting;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const bio = formData.get("bio") as string;

    if (isEditing) {
      updateAction.execute({
        id: defaultValues.id!,
        name,
        bio: bio || null,
      });
    } else {
      createAction.execute({
        name,
        email,
        password,
        bio: bio || undefined,
      });
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
          placeholder="Teacher Name"
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
              placeholder="teacher@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" placeholder="********" required />
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="bio">Bio (Optional)</Label>
        <Textarea
          id="bio"
          name="bio"
          defaultValue={defaultValues?.bio}
          placeholder="Brief biography..."
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isExecuting}>
          {isExecuting
            ? isEditing
              ? "Updating..."
              : "Creating..."
            : isEditing
              ? "Update Teacher"
              : "Create Teacher"}
        </Button>
      </div>
    </form>
  );
}
