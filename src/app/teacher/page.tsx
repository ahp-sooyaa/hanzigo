import { Suspense } from "react";
import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { TeacherClassesFetched } from "@/features/enrollments/components/teacher-classes-fetched";

export const metadata = {
  title: "Teacher Dashboard - Hanzigo",
  description: "View assigned classes",
};

export default function TeacherDashboardPage() {
  return (
    <div className="space-y-6 p-8">
      <header className="flex items-center justify-between border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
          <p className="text-muted-foreground">Your assigned classes</p>
        </div>
        <SignOutButton />
      </header>

      <Suspense fallback={<div>Loading classes...</div>}>
        <TeacherClassesFetched />
      </Suspense>
    </div>
  );
}
