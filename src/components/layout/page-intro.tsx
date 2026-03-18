interface PageIntroProps {
  portalLabel: string;
  breadcrumb: string;
  title: string;
  subtitle?: string;
}

export function PageIntro({ portalLabel, breadcrumb, title, subtitle }: PageIntroProps) {
  return (
    <section className="mb-8">
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center gap-2 text-sm text-[var(--admin-text-muted)]">
          <li>{portalLabel}</li>
          <li>/</li>
          <li className="font-semibold text-[var(--admin-text-main)]">{breadcrumb}</li>
        </ol>
      </nav>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--admin-title)] md:text-4xl">
          {title}
        </h1>
        {subtitle && <p className="mt-2 text-sm text-[var(--admin-text-muted)]">{subtitle}</p>}
      </div>
    </section>
  );
}
