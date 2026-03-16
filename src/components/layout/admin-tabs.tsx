import { BookOpen, LayoutDashboard, School, Users } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

import type { ComponentType } from "react";

export type AdminTabKey = "dashboard" | "students" | "teachers" | "classes";

const tabs: {
  key: AdminTabKey;
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}[] = [
  {
    key: "dashboard",
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    key: "students",
    href: "/admin/students",
    label: "Students",
    icon: Users,
  },
  {
    key: "teachers",
    href: "/admin/teachers",
    label: "Teachers",
    icon: School,
  },
  {
    key: "classes",
    href: "/admin/classes",
    label: "Classes",
    icon: BookOpen,
  },
];

interface AdminTabsProps {
  activeTab: AdminTabKey;
}

export function AdminTabs({ activeTab }: AdminTabsProps) {
  return (
    <div className="overflow-x-auto">
      <nav
        aria-label="Admin tabs"
        className="flex min-w-max gap-8 border-b border-[var(--admin-border)]"
      >
        {tabs.map(({ key, href, label, icon: Icon }) => {
          const isActive = key === activeTab;
          return (
            <Link
              key={key}
              href={href}
              className={cn(
                "inline-flex items-center gap-2 border-b-2 px-1 py-4 text-sm transition-colors",
                isActive
                  ? "border-[var(--admin-primary)] font-semibold text-[var(--admin-primary)]"
                  : "border-transparent text-[var(--admin-text-muted)] hover:border-[var(--admin-border)] hover:text-[var(--admin-text-main)]",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
