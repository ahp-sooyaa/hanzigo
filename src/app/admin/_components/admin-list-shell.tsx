import { Facebook, GraduationCap, ShieldCheck, Twitter, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { AdminTabs, type AdminTabKey } from "./admin-tabs";
import { AdminUserMenu } from "./admin-user-menu";

import type { ReactNode } from "react";

interface AdminStat {
  icon: LucideIcon;
  label: string;
  tone?: "default" | "warning";
}

interface AdminListShellProps {
  breadcrumb: string;
  title: string;
  stats: AdminStat[];
  action?: ReactNode;
  activeTab: AdminTabKey;
  children: ReactNode;
}

export function AdminListShell({
  breadcrumb,
  title,
  stats,
  action,
  activeTab,
  children,
}: AdminListShellProps) {
  return (
    <div className="min-h-screen bg-[var(--admin-surface)] text-[var(--admin-text-main)]">
      <header className="fixed inset-x-0 top-0 z-20 border-b border-[var(--admin-border)] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--admin-primary)] text-white">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <span className="text-sm font-extrabold tracking-tight text-[var(--admin-primary)] md:text-base">
              LMS ACADEMY
            </span>
          </Link>
          <AdminUserMenu />
        </div>
      </header>

      <main className="mx-auto min-h-screen w-full max-w-7xl px-4 pt-28 pb-16 sm:px-6 lg:px-8">
        <section className="mb-8">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-2 text-sm text-[var(--admin-text-muted)]">
              <li>Admin Portal</li>
              <li>/</li>
              <li className="font-semibold text-[var(--admin-text-main)]">{breadcrumb}</li>
            </ol>
          </nav>

          <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[var(--admin-title)] md:text-4xl">
                {title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                {stats.map(({ icon: Icon, label, tone = "default" }) => (
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
            </div>
            <div className="[&_button]:h-11 [&_button]:rounded-xl [&_button]:bg-[var(--admin-primary)] [&_button]:px-5 [&_button]:font-semibold [&_button]:text-white [&_button]:hover:bg-[var(--admin-primary-strong)]">
              {action}
            </div>
          </div>

          <AdminTabs activeTab={activeTab} />
        </section>

        <section>{children}</section>
      </main>

      <footer className="bg-[var(--admin-primary)] py-10 text-white">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
          <div>
            <div className="mb-3 flex items-center gap-2 text-lg font-bold">
              <GraduationCap className="h-5 w-5" />
              LMS Academy
            </div>
            <p className="max-w-xs text-sm text-white/85">
              Empowering students worldwide with structured education and expert instruction.
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-xs font-semibold tracking-wide text-white/70 uppercase">
              Academics
            </h3>
            <p className="text-sm font-semibold">Classes</p>
          </div>
          <div>
            <h3 className="mb-3 text-xs font-semibold tracking-wide text-white/70 uppercase">
              Legal
            </h3>
            <ul className="space-y-2 text-sm">
              <li>Privacy Policy</li>
              <li>Terms of Use</li>
              <li>Cookie Policy</li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-8 flex w-full max-w-7xl items-center justify-between border-t border-white/20 px-4 pt-4 text-xs text-white/80 sm:px-6 lg:px-8">
          <p>© 2024 LMS Academy. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <Facebook className="h-4 w-4" />
            <Twitter className="h-4 w-4" />
          </div>
        </div>
      </footer>
    </div>
  );
}
