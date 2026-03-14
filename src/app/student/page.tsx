import { Suspense } from "react";
import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { StudentClassesFetched } from "@/features/enrollments/components/student-classes-fetched";

export const metadata = {
  title: "Student Dashboard - Hanzigo",
  description: "View enrolled classes",
};

export default function StudentDashboardPage() {
  return (
    <div className="space-y-6 p-8">
      <header className="flex items-center justify-between border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
          <p className="text-muted-foreground">Your enrolled classes</p>
        </div>
        <SignOutButton />
      </header>

      <Suspense fallback={<div>Loading classes...</div>}>
        <StudentClassesFetched />
      </Suspense>
    </div>
  );
}
