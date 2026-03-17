"use client";

import { format } from "date-fns";
import { ExternalLink, FileText, Filter, Link2, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { DeleteMaterialAlert } from "./delete-material-alert";
import { EditMaterialDialog } from "./edit-material-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClassMaterialDTO } from "@/features/materials/server/dto";

interface MaterialListProps {
  materials: ClassMaterialDTO[];
  canUpdate?: boolean;
  canDelete?: boolean;
}

function formatFileSize(fileSize: number | null) {
  if (!fileSize) return null;
  if (fileSize < 1024) return `${fileSize} B`;
  if (fileSize < 1024 * 1024) return `${(fileSize / 1024).toFixed(1)} KB`;
  return `${(fileSize / (1024 * 1024)).toFixed(1)} MB`;
}

export function MaterialList({ materials, canUpdate, canDelete }: MaterialListProps) {
  const [query, setQuery] = useState("");
  const [selectedPdfMaterial, setSelectedPdfMaterial] = useState<ClassMaterialDTO | null>(null);

  const filteredMaterials = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return materials;

    return materials.filter((material) => {
      const searchableText = [
        material.title,
        material.originalFileName ?? "",
        material.externalUrl ?? "",
        material.materialType,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [materials, query]);

  const selectedPdfOpenUrl = useMemo(() => {
    if (!selectedPdfMaterial) return "";
    return `/api/teacher/classes/${selectedPdfMaterial.classId}/materials/${selectedPdfMaterial.id}/open`;
  }, [selectedPdfMaterial]);

  if (materials.length === 0) {
    return (
      <div className="rounded-3xl border border-[var(--admin-border)] bg-white p-10 text-center shadow-sm">
        <h3 className="mt-4 text-lg font-semibold text-[var(--admin-title)]">No materials yet</h3>
        <p className="mt-2 text-sm text-[var(--admin-text-muted)]">
          Upload your first PDF or add a link to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold text-[var(--admin-title)]">
          Class Materials
          <span className="ml-2 rounded-md bg-[#f3f4f6] px-2 py-0.5 text-sm text-[var(--admin-text-muted)]">
            {filteredMaterials.length}
          </span>
        </h2>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--admin-text-muted)]" />
            <input
              type="text"
              placeholder="Search materials..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-10 w-full rounded-xl border border-[var(--admin-border)] bg-white pr-3 pl-9 text-sm text-[var(--admin-text-main)] transition outline-none focus:border-[var(--admin-primary)] focus:ring-2 focus:ring-[var(--admin-primary)]/15"
            />
          </div>
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-[var(--admin-border)] bg-white px-4 text-sm font-semibold text-[var(--admin-text-main)]"
            aria-label="Filter materials"
          >
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-[var(--admin-border)] bg-white shadow-sm">
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
            {filteredMaterials.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="px-6 py-8 text-center text-sm text-[var(--admin-text-muted)]"
                >
                  No materials match your search.
                </TableCell>
              </TableRow>
            ) : null}

            {filteredMaterials.map((material) => {
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
                      {fileSizeLabel ? (
                        <span className="text-xs text-[var(--admin-text-muted)]">
                          {fileSizeLabel}
                        </span>
                      ) : null}
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
                      {targetUrl ? (
                        material.materialType === "pdf" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedPdfMaterial(material)}
                          >
                            <FileText className="h-4 w-4" />
                            Open
                          </Button>
                        ) : (
                          <Button asChild variant="outline" size="sm">
                            <a href={targetUrl} target="_blank" rel="noopener noreferrer">
                              <Link2 className="h-4 w-4" />
                              Open
                            </a>
                          </Button>
                        )
                      ) : null}

                      {canUpdate ? <EditMaterialDialog material={material} /> : null}
                      {canDelete ? <DeleteMaterialAlert material={material} /> : null}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={Boolean(selectedPdfMaterial)}
        onOpenChange={(open) => !open && setSelectedPdfMaterial(null)}
      >
        <DialogContent className="h-[85vh] max-w-5xl p-0">
          <div className="flex h-full flex-col">
            <DialogHeader className="border-b border-[var(--admin-border)] px-6 py-4">
              <DialogTitle className="truncate pr-10">
                {selectedPdfMaterial?.title || "Material Preview"}
              </DialogTitle>
            </DialogHeader>

            {selectedPdfOpenUrl ? (
              <iframe
                src={selectedPdfOpenUrl}
                title={selectedPdfMaterial?.title || "PDF preview"}
                className="h-full w-full border-0"
              />
            ) : null}

            {selectedPdfOpenUrl ? (
              <div className="border-t border-[var(--admin-border)] px-6 py-3">
                <Button asChild variant="outline" size="sm">
                  <a href={selectedPdfOpenUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Open in new tab
                  </a>
                </Button>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
