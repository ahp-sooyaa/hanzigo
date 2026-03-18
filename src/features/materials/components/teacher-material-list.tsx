import { format } from "date-fns";
import { Link2 } from "lucide-react";
import { DeleteMaterialAlert } from "./delete-material-alert";
import { EditMaterialDialog } from "./edit-material-dialog";
import { PreviewMaterialDialog } from "./preview-material-dialog";
import { DataEmptyState, DataListShell, DataTableCard } from "@/components/layout/data-list";
import { TableSearchFilterSortBar } from "@/components/layout/table-search-filter-sort-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClassMaterialDTO } from "@/features/materials/server/dto";
import { TeacherMaterialsQueryParams } from "@/features/materials/types";

interface MaterialListProps {
  materials: ClassMaterialDTO[];
  query: Required<TeacherMaterialsQueryParams>;
  canUpdate?: boolean;
  canDelete?: boolean;
}

function formatFileSize(fileSize: number | null) {
  if (!fileSize) return null;
  if (fileSize < 1024) return `${fileSize} B`;
  if (fileSize < 1024 * 1024) return `${(fileSize / 1024).toFixed(1)} KB`;
  return `${(fileSize / (1024 * 1024)).toFixed(1)} MB`;
}

const MATERIAL_FILTER_OPTIONS = [
  { value: "all", label: "All materials" },
  { value: "documents", label: "Documents" },
  { value: "links", label: "Links" },
] as const;

export function TeacherMaterialList({ materials, query, canUpdate, canDelete }: MaterialListProps) {
  const hasActiveFilters = query.q.length > 0 || query.type !== "all" || query.sort !== "newest";

  if (materials.length === 0 && !hasActiveFilters) {
    return (
      <DataEmptyState
        title="No materials yet"
        description="Upload your first PDF or add a link to get started."
      />
    );
  }

  return (
    <DataListShell
      title="Class Materials"
      count={materials.length}
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
      <DataTableCard>
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f9fafb] hover:bg-[#f9fafb]">
              <TableHead className="h-auto px-6 py-4 text-xs font-bold tracking-wide text-[var(--admin-text-muted)] uppercase">
                Material Name
              </TableHead>
              <TableHead className="h-auto px-6 py-4 text-xs font-bold tracking-wide text-[var(--admin-text-muted)] uppercase">
                Description
              </TableHead>
              <TableHead className="h-auto px-6 py-4 text-xs font-bold tracking-wide text-[var(--admin-text-muted)] uppercase">
                Date Uploaded
              </TableHead>
              <TableHead className="h-auto px-6 py-4 text-right text-xs font-bold tracking-wide text-[var(--admin-text-muted)] uppercase">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {materials.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="px-6 py-8 text-center text-sm text-[var(--admin-text-muted)]"
                >
                  No materials match your search or filters.
                </TableCell>
              </TableRow>
            )}

            {materials.map((material) => {
              const targetUrl =
                material.materialType === "pdf"
                  ? `/api/teacher/classes/${material.classId}/materials/${material.id}/open`
                  : material.externalUrl;

              const fileSizeLabel = formatFileSize(material.fileSize);

              return (
                <TableRow key={material.id} className="hover:bg-[#f9fafb]">
                  <TableCell className="px-6 py-4">
                    <div className="font-semibold text-[var(--admin-text-main)]">
                      {material.title}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge className="rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-100">
                        {material.materialType.toUpperCase()}
                      </Badge>
                      {fileSizeLabel && (
                        <span className="text-xs text-[var(--admin-text-muted)]">
                          {fileSizeLabel}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="max-w-[420px] px-6 py-4 whitespace-normal text-[var(--admin-text-main)]">
                    {material.materialType === "pdf" ? (
                      <div className="line-clamp-2 text-sm text-[var(--admin-text-muted)]">
                        {material.originalFileName || "PDF class material"}
                      </div>
                    ) : (
                      <div className="line-clamp-2 text-sm text-[var(--admin-text-muted)]">
                        {material.externalUrl || "External link"}
                      </div>
                    )}
                  </TableCell>

                  <TableCell className="px-6 py-4 text-[var(--admin-text-main)]">
                    {format(new Date(material.createdAt), "MMM d, yyyy")}
                  </TableCell>

                  <TableCell className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {targetUrl &&
                        (material.materialType === "pdf" ? (
                          <PreviewMaterialDialog
                            materialId={material.id}
                            classId={material.classId}
                            title={material.title}
                            portal="teacher"
                            triggerLabel="Open"
                            triggerVariant="outline"
                          />
                        ) : (
                          <Button asChild variant="outline" size="sm">
                            <a href={targetUrl} target="_blank" rel="noopener noreferrer">
                              <Link2 className="h-4 w-4" />
                              Open
                            </a>
                          </Button>
                        ))}

                      {canUpdate && <EditMaterialDialog material={material} />}
                      {canDelete && <DeleteMaterialAlert material={material} />}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </DataTableCard>
    </DataListShell>
  );
}
