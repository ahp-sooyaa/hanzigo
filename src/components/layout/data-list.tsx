import { cn } from "@/lib/utils";

import type { ReactNode } from "react";

interface DataListShellProps {
  title: string;
  children: ReactNode;
  toolbar?: ReactNode;
  count?: ReactNode;
  countVariant?: "badge" | "inline";
  className?: string;
  headerClassName?: string;
  titleClassName?: string;
  countClassName?: string;
}

export function DataListShell({
  title,
  children,
  toolbar,
  count,
  countVariant = "badge",
  className,
  headerClassName,
  titleClassName,
  countClassName,
}: DataListShellProps) {
  const hasCount = count !== undefined && count !== null;

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={cn(
          "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
          headerClassName,
        )}
      >
        <h2 className={cn("text-xl font-bold text-[var(--admin-title)]", titleClassName)}>
          {title}
          {hasCount && (
            <span
              className={cn(
                countVariant === "badge"
                  ? "ml-2 rounded-md bg-[#f3f4f6] px-2 py-0.5 text-sm text-[var(--admin-text-muted)]"
                  : "ml-2 text-base font-medium text-[var(--admin-text-muted)]",
                countClassName,
              )}
            >
              {count}
            </span>
          )}
        </h2>
        {toolbar}
      </div>
      {children}
    </div>
  );
}

interface DataTableCardProps {
  children: ReactNode;
  className?: string;
}

export function DataTableCard({ children, className }: DataTableCardProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-3xl border border-[var(--admin-border)] bg-white shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface DataEmptyStateProps {
  title: string;
  description: string;
  className?: string;
}

export function DataEmptyState({ title, description, className }: DataEmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-[var(--admin-border)] bg-white p-10 text-center shadow-sm",
        className,
      )}
    >
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-[var(--admin-text-muted)]">{description}</p>
    </div>
  );
}
