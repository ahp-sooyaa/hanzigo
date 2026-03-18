import {
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  FolderOpen,
  Megaphone,
  School,
  Users,
} from "lucide-react";
import Link from "next/link";
import { AdminTabs } from "@/components/layout/admin-tabs";
import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardPage() {
  return (
    <PageShell
      portalLabel="Admin Portal"
      breadcrumb="Dashboard"
      title="Admin Dashboard"
      stats={[
        { icon: School, label: "42 Active Classes" },
        { icon: Users, label: "1,205 Enrolled Students" },
        { icon: BarChart3, label: "System Health: Stable" },
      ]}
      tabs={<AdminTabs activeTab="dashboard" />}
      action={
        <Button className="rounded-xl bg-[var(--admin-primary)] px-5 font-semibold text-white hover:bg-[var(--admin-primary-strong)]">
          <Megaphone className="mr-2 h-4 w-4" />
          Broadcast Notice
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-3xl border border-[var(--admin-border)] bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="flex items-center gap-3 text-xl font-bold text-[var(--admin-title)]">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 text-yellow-700">
                  <BarChart3 className="h-5 w-5" />
                </span>
                Platform Snapshot
              </h2>
              <Badge className="rounded-lg bg-[var(--admin-primary)]/10 text-[var(--admin-primary)] hover:bg-[var(--admin-primary)]/10">
                Live
              </Badge>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                href="/admin/students"
                className="rounded-2xl border border-orange-100 bg-orange-50 p-5 transition hover:shadow-sm"
              >
                <p className="text-2xl font-bold text-[var(--admin-title)]">1,248</p>
                <p className="text-xs font-semibold tracking-wide text-[var(--admin-text-muted)] uppercase">
                  Total Students
                </p>
              </Link>
              <Link
                href="/admin/teachers"
                className="rounded-2xl border border-green-100 bg-green-50 p-5 transition hover:shadow-sm"
              >
                <p className="text-2xl font-bold text-[var(--admin-title)]">32</p>
                <p className="text-xs font-semibold tracking-wide text-[var(--admin-text-muted)] uppercase">
                  Active Instructors
                </p>
              </Link>
              <Link
                href="/admin/classes"
                className="rounded-2xl border border-blue-100 bg-blue-50 p-5 transition hover:shadow-sm"
              >
                <p className="text-2xl font-bold text-[var(--admin-title)]">42</p>
                <p className="text-xs font-semibold tracking-wide text-[var(--admin-text-muted)] uppercase">
                  Active Classes
                </p>
              </Link>
              <div className="rounded-2xl border border-purple-100 bg-purple-50 p-5">
                <p className="text-2xl font-bold text-[var(--admin-title)]">95%</p>
                <p className="text-xs font-semibold tracking-wide text-[var(--admin-text-muted)] uppercase">
                  Monthly Attendance
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-[var(--admin-border)] bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="flex items-center gap-3 text-xl font-bold text-[var(--admin-title)]">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                  <FolderOpen className="h-5 w-5" />
                </span>
                Management Shortcuts
              </h2>
              <Link
                href="/admin/classes"
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--admin-primary)] px-3 py-2 text-xs font-semibold text-white"
              >
                <FileText className="h-3.5 w-3.5" />
                Create Report
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href="/admin/students"
                className="flex items-center justify-between rounded-xl border border-[var(--admin-border)] px-4 py-3 transition hover:border-[var(--admin-primary)]/30 hover:bg-[var(--admin-primary)]/5"
              >
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-[var(--admin-primary)]" />
                  <span className="text-sm font-semibold">Review Students</span>
                </div>
                <span className="text-xs text-[var(--admin-text-muted)]">Open</span>
              </Link>
              <Link
                href="/admin/teachers"
                className="flex items-center justify-between rounded-xl border border-[var(--admin-border)] px-4 py-3 transition hover:border-[var(--admin-primary)]/30 hover:bg-[var(--admin-primary)]/5"
              >
                <div className="flex items-center gap-3">
                  <School className="h-4 w-4 text-[var(--admin-primary)]" />
                  <span className="text-sm font-semibold">Manage Teachers</span>
                </div>
                <span className="text-xs text-[var(--admin-text-muted)]">Open</span>
              </Link>
              <Link
                href="/admin/classes"
                className="flex items-center justify-between rounded-xl border border-[var(--admin-border)] px-4 py-3 transition hover:border-[var(--admin-primary)]/30 hover:bg-[var(--admin-primary)]/5"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="h-4 w-4 text-[var(--admin-primary)]" />
                  <span className="text-sm font-semibold">Class Catalog</span>
                </div>
                <span className="text-xs text-[var(--admin-text-muted)]">Open</span>
              </Link>
              <div className="flex items-center justify-between rounded-xl border border-[var(--admin-border)] px-4 py-3">
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-4 w-4 text-[var(--admin-primary)]" />
                  <span className="text-sm font-semibold">Term Calendar</span>
                </div>
                <span className="text-xs text-[var(--admin-text-muted)]">Upcoming</span>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-3xl border border-[var(--admin-border)] bg-white p-6 shadow-sm md:p-8">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="flex items-center gap-3 text-xl font-bold text-[var(--admin-title)]">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                  <ClipboardCheck className="h-5 w-5" />
                </span>
                Admin Queue
              </h2>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4">
                <p className="text-xs font-semibold text-orange-700 uppercase">Needs Attention</p>
                <p className="mt-1 text-base font-bold">8 pending approvals</p>
                <p className="text-xs text-[var(--admin-text-muted)]">
                  Teacher onboarding and edits
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--admin-border)] bg-white p-4">
                <p className="text-xs font-semibold text-[var(--admin-text-muted)] uppercase">
                  Upcoming
                </p>
                <p className="mt-1 text-base font-bold">3 classes start this week</p>
                <p className="text-xs text-[var(--admin-text-muted)]">
                  Review schedules and staffing
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-[var(--admin-border)] bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-5 flex items-center gap-3 text-xl font-bold text-[var(--admin-title)]">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700">
                <CheckCircle2 className="h-5 w-5" />
              </span>
              System Status
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-[#f9fafb] p-3">
                <span className="text-sm font-medium">Database</span>
                <Badge className="rounded-lg bg-green-100 text-green-700 hover:bg-green-100">
                  Healthy
                </Badge>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-[#f9fafb] p-3">
                <span className="text-sm font-medium">Auth Service</span>
                <Badge className="rounded-lg bg-green-100 text-green-700 hover:bg-green-100">
                  Online
                </Badge>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-[#f9fafb] p-3">
                <span className="text-sm font-medium">Background Jobs</span>
                <Badge className="rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                  Monitoring
                </Badge>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PageShell>
  );
}
