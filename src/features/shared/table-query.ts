export type TableSort = "newest" | "oldest";

export interface TableQuery {
  q: string;
  filter: string;
  sort: TableSort;
  page: number;
}

interface FilterOptionLike {
  value: string;
}

export function parseFilter<T extends string>(
  value: string | undefined,
  allowed: readonly T[],
  fallback: T,
): T {
  if (!value) return fallback;
  if ((allowed as readonly string[]).includes(value)) return value as T;
  return fallback;
}

export function parseSort(value?: string): TableSort {
  return value === "oldest" ? "oldest" : "newest";
}

export function sanitizeQuery(
  params: { q?: string; filter?: string; sort?: string; page?: string | number },
  filterOptions: readonly FilterOptionLike[],
  fallbackFilter: string = "all",
): TableQuery {
  const allowed = filterOptions.map((option) => option.value);
  const parsedPage =
    typeof params.page === "number" ? params.page : Number.parseInt(params.page ?? "1", 10);

  return {
    q: params.q?.trim() ?? "",
    filter: parseFilter(params.filter, allowed, fallbackFilter),
    sort: parseSort(params.sort),
    page: Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1,
  };
}

export function buildQueryHref(
  current: TableQuery,
  updates: Partial<TableQuery>,
  fallbackFilter: string = "all",
  paramNames: { filter?: string; sort?: string; page?: string } = {},
): string {
  const merged = { ...current, ...updates };
  const filterParam = paramNames.filter ?? "filter";
  const sortParam = paramNames.sort ?? "sort";
  const pageParam = paramNames.page ?? "page";
  const params = new URLSearchParams();

  if (merged.q) params.set("q", merged.q);
  if (merged.filter !== fallbackFilter) params.set(filterParam, merged.filter);
  if (merged.sort !== "newest") params.set(sortParam, merged.sort);
  if (merged.page > 1) params.set(pageParam, String(merged.page));

  const query = params.toString();
  return query ? `?${query}` : "";
}
