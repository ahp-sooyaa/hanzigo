"use client";

import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signInAction } from "../server/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignInForm() {
  const router = useRouter();

  const { execute, isExecuting } = useAction(signInAction, {
    onSuccess: () => {
      toast.success("Signed in successfully!");
      router.push("/admin");
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Invalid credentials");
    },
  });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    execute({ email, password });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="john@example.com" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" placeholder="********" required />
      </div>
      <Button type="submit" className="w-full" disabled={isExecuting}>
        {isExecuting ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
