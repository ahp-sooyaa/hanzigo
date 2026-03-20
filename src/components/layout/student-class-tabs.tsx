import { BookOpen, ClipboardList, LayoutDashboard, Megaphone, NotebookPen } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type StudentClassTabKey =
  | "overview"
  | "announcements"
  | "materials"
  | "homework"
  | "attendance";

interface StudentClassTabsProps {
  params: Promise<{ classId: string }>;
  activeTab: StudentClassTabKey;
}

const tabs = [
  {
    key: "overview",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    key: "announcements",
    label: "Announcements",
    icon: Megaphone,
  },
  {
    key: "materials",
    label: "Materials",
    icon: BookOpen,
  },
  {
    key: "homework",
    label: "Homework",
    icon: NotebookPen,
  },
  {
    key: "attendance",
    label: "Attendance",
    icon: ClipboardList,
  },
] as const;

export async function StudentClassTabs({ params, activeTab }: StudentClassTabsProps) {
  const { classId } = await params;

  return (
    <div className="overflow-x-auto">
      <nav aria-label="Student class tabs">
        <ul className="flex min-w-max gap-8 border-b border-[var(--admin-border)]">
          {tabs.map(({ key, label, icon: Icon }) => {
            const isActive = key === activeTab;
            const isEnabled = key === "materials";
            const href = `/student/classes/${classId}/materials`;

            return (
              <li key={key}>
                {isEnabled ? (
                  <Link
                    href={href}
                    className={cn(
                      "inline-flex items-center gap-2 border-b-2 px-1 py-3 text-sm font-semibold transition-colors",
                      isActive
                        ? "border-[var(--admin-primary)] text-[var(--admin-primary)]"
                        : "border-transparent text-[var(--admin-text-muted)] hover:text-[var(--admin-text-main)]",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                ) : (
                  <span className="inline-flex cursor-not-allowed items-center gap-2 border-b-2 border-transparent px-1 py-3 text-sm font-semibold text-[var(--admin-text-muted)]/70">
                    <Icon className="h-4 w-4" />
                    {label}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
