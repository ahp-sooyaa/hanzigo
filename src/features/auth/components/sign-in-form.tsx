"use client";

import { useAction } from "next-safe-action/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { signInAction } from "../server/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const roleRedirects: Record<string, string> = {
    admin: "/admin",
    teacher: "/teacher",
    student: "/student",
  };

  useEffect(() => {
    formRef.current?.reset();
  }, [searchParams]);

  const { execute, isExecuting } = useAction(signInAction, {
    onSuccess: ({ data }) => {
      formRef.current?.reset();
      toast.success("Signed in successfully!");
      router.push(roleRedirects[data.role ?? ""] || "/");
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Invalid credentials");
    },
  });

  async function onSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    execute({ email, password });
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-4" autoComplete="off">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="john@example.com"
          autoComplete="off"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="********"
          autoComplete="off"
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isExecuting}>
        {isExecuting ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
