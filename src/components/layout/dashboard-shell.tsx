import { type LucideIcon } from "lucide-react";

import type { ReactNode } from "react";

interface DashboardStat {
  icon: LucideIcon;
  label: string;
  tone?: "default" | "warning";
}

interface DashboardShellProps {
  breadcrumb: string;
  title: string;
  children: ReactNode;
  portalLabel?: string;
  stats?: DashboardStat[];
  action?: ReactNode;
  tabs?: ReactNode;
}

export function DashboardShell({
  breadcrumb,
  title,
  children,
  portalLabel = "Admin Portal",
  stats,
  action,
  tabs,
}: DashboardShellProps) {
  const hasStats = Boolean(stats?.length);

  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl px-4 pt-28 pb-16 text-[var(--admin-text-main)] sm:px-6 lg:px-8">
      <main>
        <section className="mb-8">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-2 text-sm text-[var(--admin-text-muted)]">
              <li>{portalLabel}</li>
              <li>/</li>
              <li className="font-semibold text-[var(--admin-text-main)]">{breadcrumb}</li>
            </ol>
          </nav>

          <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[var(--admin-title)] md:text-4xl">
                {title}
              </h1>
              {hasStats ? (
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  {stats?.map(({ icon: Icon, label, tone = "default" }) => (
                    <span
                      key={label}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--admin-border)] bg-white px-3 py-1 text-xs font-semibold text-[var(--admin-text-main)] md:text-sm"
                    >
                      <Icon
                        className={
                          tone === "warning"
                            ? "h-3.5 w-3.5 text-yellow-500"
                            : "h-3.5 w-3.5 text-[var(--admin-primary)]"
                        }
                      />
                      {label}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
            {action ? (
              <div className="[&_button]:h-11 [&_button]:rounded-xl [&_button]:bg-[var(--admin-primary)] [&_button]:px-5 [&_button]:font-semibold [&_button]:text-white [&_button]:hover:bg-[var(--admin-primary-strong)]">
                {action}
              </div>
            ) : null}
          </div>

          {tabs}
        </section>

        <section>{children}</section>
      </main>
    </div>
  );
}
