"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { buildQueryHref } from "@/features/shared/table-query";

import type { TableQuery, TableSort } from "@/features/shared/table-query";

interface TableOption {
  value: string;
  label: string;
}

interface TableSearchFilterSortBarProps {
  query: TableQuery;
  searchPlaceholder: string;
  filterLabel: string;
  filterOptions: TableOption[];
  basePath?: string;
  filterParamName?: string;
  sortParamName?: string;
  pageParamName?: string;
}

export function TableSearchFilterSortBar({
  query,
  searchPlaceholder,
  filterLabel,
  filterOptions,
  basePath,
  filterParamName = "filter",
  sortParamName = "sort",
  pageParamName = "page",
}: TableSearchFilterSortBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchText, setSearchText] = useState(query.q);

  useEffect(() => {
    setSearchText(query.q);
  }, [query.q]);

  const path = basePath ?? pathname;
  const fallbackFilter = filterOptions[0]?.value ?? "all";

  const navigate = (updates: Partial<TableQuery>) => {
    const href = buildQueryHref(query, updates, fallbackFilter, {
      filter: filterParamName,
      sort: sortParamName,
      page: pageParamName,
    });
    router.replace(`${path}${href}`);
  };

  return (
    <div className="flex w-full flex-row flex-wrap items-center gap-2 sm:w-auto">
      <form
        method="get"
        className="relative min-w-[220px] flex-1 sm:w-64 sm:flex-none"
        onSubmit={(event) => {
          event.preventDefault();
          navigate({ q: searchText.trim(), page: 1 });
        }}
      >
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--admin-text-muted)]" />
        <input
          name="q"
          type="text"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder={searchPlaceholder}
          className="h-10 w-full rounded-xl border border-[var(--admin-border)] bg-white pr-3 pl-9 text-sm text-[var(--admin-text-main)] transition outline-none focus:border-[var(--admin-primary)] focus:ring-2 focus:ring-[var(--admin-primary)]/15"
        />
      </form>

      <Select value={query.filter} onValueChange={(value) => navigate({ filter: value, page: 1 })}>
        <SelectTrigger aria-label={filterLabel} className="h-10 min-w-[140px] rounded-xl bg-white">
          <SelectValue placeholder={filterLabel} />
        </SelectTrigger>
        <SelectContent position="popper">
          {filterOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={query.sort}
        onValueChange={(value) => navigate({ sort: value as TableSort, page: 1 })}
      >
        <SelectTrigger aria-label="Sort" className="h-10 min-w-[130px] rounded-xl bg-white">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="oldest">Oldest</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
