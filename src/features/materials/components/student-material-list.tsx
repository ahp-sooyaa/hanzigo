import Link from "next/link";
import { StudentMaterialCard } from "./student-material-card";
import { DataEmptyState, DataListShell } from "@/components/layout/data-list";
import { TableSearchFilterSortBar } from "@/components/layout/table-search-filter-sort-bar";
import { Button } from "@/components/ui/button";
import { ClassMaterialDTO } from "@/features/materials/server/dto";
import { StudentMaterialsQueryParams } from "@/features/materials/types";

interface StudentMaterialListProps {
  materials: ClassMaterialDTO[];
  query: Required<StudentMaterialsQueryParams>;
}

const MATERIAL_FILTER_OPTIONS = [
  { value: "all", label: "All materials" },
  { value: "documents", label: "Documents" },
  { value: "links", label: "Links" },
] as const;

export function StudentMaterialList({ materials, query }: StudentMaterialListProps) {
  const hasActiveFilters = query.q.length > 0 || query.type !== "all" || query.sort !== "newest";

  if (materials.length === 0 && !hasActiveFilters) {
    return (
      <DataEmptyState
        title="No materials yet"
        description="Your instructor has not uploaded class materials yet."
      />
    );
  }

  return (
    <DataListShell
      title="Class Materials"
      count={materials.length}
      countVariant="inline"
      className="space-y-5"
      titleClassName="text-2xl font-bold tracking-tight text-[var(--admin-title)]"
      toolbar={
        <TableSearchFilterSortBar
          query={{ q: query.q, filter: query.type, sort: query.sort, page: 1 }}
          searchPlaceholder="Search materials..."
          filterLabel="Material type"
          filterOptions={[...MATERIAL_FILTER_OPTIONS]}
          filterParamName="type"
        />
      }
    >
      {materials.length === 0 ? (
        <div className="rounded-2xl border border-[var(--admin-border)] bg-white p-8 text-center shadow-sm">
          <h3 className="text-lg font-semibold text-[var(--admin-title)]">No matching materials</h3>
          <p className="mt-2 text-sm text-[var(--admin-text-muted)]">
            Try adjusting your search or filters.
          </p>
          <div className="mt-4">
            <Button asChild variant="outline" size="sm">
              <Link href="?">Clear filters</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {materials.map((material: ClassMaterialDTO) => (
            <StudentMaterialCard key={material.id} material={material} />
          ))}
        </div>
      )}
    </DataListShell>
  );
}
