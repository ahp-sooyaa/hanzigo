import { BookOpen, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type TeacherClassTabKey = "overview" | "materials";

interface TeacherClassTabsProps {
  classId: string;
  activeTab: TeacherClassTabKey;
}

const tabs = [
  {
    key: "overview",
    label: "Overview",
    icon: LayoutDashboard,
    getHref: (classId: string) => `/teacher/classes/${classId}/overview`,
  },
  {
    key: "materials",
    label: "Materials",
    icon: BookOpen,
    getHref: (classId: string) => `/teacher/classes/${classId}/materials`,
  },
] as const;

export function TeacherClassTabs({ classId, activeTab }: TeacherClassTabsProps) {
  return (
    <div className="overflow-x-auto">
      <nav aria-label="Teacher class tabs">
        <ul className="flex min-w-max gap-8 border-b border-[var(--admin-border)]">
          {tabs.map(({ key, label, icon: Icon, getHref }) => {
            const isActive = key === activeTab;

            return (
              <li key={key}>
                <Link
                  href={getHref(classId)}
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
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
