"use client";

import { format } from "date-fns";
import { ExternalLink, FileText, Link2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ClassMaterialDTO } from "@/features/materials/server/dto";

type MaterialFilter = "all" | "documents" | "links";
type MaterialSort = "newest" | "oldest";

interface StudentMaterialListProps {
  materials: ClassMaterialDTO[];
}

function formatFileSize(fileSize: number | null) {
  if (!fileSize) return null;
  if (fileSize < 1024) return `${fileSize} B`;
  if (fileSize < 1024 * 1024) return `${(fileSize / 1024).toFixed(1)} KB`;
  return `${(fileSize / (1024 * 1024)).toFixed(1)} MB`;
}

export function StudentMaterialList({ materials }: StudentMaterialListProps) {
  const [filter, setFilter] = useState<MaterialFilter>("all");
  const [sort, setSort] = useState<MaterialSort>("newest");
  const [selectedPdfMaterial, setSelectedPdfMaterial] = useState<ClassMaterialDTO | null>(null);

  const displayedMaterials = useMemo(() => {
    const filtered = materials.filter((material) => {
      if (filter === "all") return true;
      if (filter === "documents") return material.materialType === "pdf";
      if (filter === "links") return material.materialType === "link";
      return true;
    });

    return [...filtered].sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return sort === "newest" ? timeB - timeA : timeA - timeB;
    });
  }, [filter, materials, sort]);

  const selectedPdfOpenUrl = useMemo(() => {
    if (!selectedPdfMaterial) return "";
    return `/api/student/classes/${selectedPdfMaterial.classId}/materials/${selectedPdfMaterial.id}/open`;
  }, [selectedPdfMaterial]);

  if (materials.length === 0) {
    return (
      <div className="rounded-3xl border border-[var(--admin-border)] bg-white p-10 text-center shadow-sm">
        <h3 className="mt-2 text-lg font-semibold text-[var(--admin-title)]">No materials yet</h3>
        <p className="mt-2 text-sm text-[var(--admin-text-muted)]">
          Your instructor has not uploaded class materials yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-[var(--admin-title)]">
          Class Materials
          <span className="ml-2 text-base font-medium text-[var(--admin-text-muted)]">
            {displayedMaterials.length}
          </span>
        </h2>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            type="button"
            size="sm"
            variant={filter === "documents" ? "default" : "outline"}
            onClick={() => setFilter("documents")}
          >
            Documents
          </Button>
          <Button
            type="button"
            size="sm"
            variant={filter === "links" ? "default" : "outline"}
            onClick={() => setFilter("links")}
          >
            Links
          </Button>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as MaterialSort)}
            className="h-9 rounded-lg border border-[var(--admin-border)] bg-white px-3 text-sm text-[var(--admin-text-main)]"
          >
            <option value="newest">Sort by: Newest</option>
            <option value="oldest">Sort by: Oldest</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {displayedMaterials.map((material) => {
          const targetUrl =
            material.materialType === "pdf"
              ? `/api/student/classes/${material.classId}/materials/${material.id}/open`
              : material.externalUrl;
          const fileSizeLabel = formatFileSize(material.fileSize);

          return (
            <article
              key={material.id}
              className="rounded-2xl border border-[var(--admin-border)] bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-semibold text-[var(--admin-title)]">
                    {material.title}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-[var(--admin-text-muted)]">
                    <Badge className="rounded-md bg-blue-100 text-blue-700 hover:bg-blue-100">
                      {material.materialType.toUpperCase()}
                    </Badge>
                    {fileSizeLabel ? <span>{fileSizeLabel}</span> : null}
                    <span>•</span>
                    <span>{format(new Date(material.createdAt), "MMM d, yyyy")}</span>
                  </div>
                </div>

                {targetUrl ? (
                  material.materialType === "pdf" ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedPdfMaterial(material)}
                    >
                      <FileText className="h-4 w-4" />
                      View
                    </Button>
                  ) : (
                    <Button asChild variant="ghost" size="sm">
                      <a href={targetUrl} target="_blank" rel="noopener noreferrer">
                        <Link2 className="h-4 w-4" />
                        Open
                      </a>
                    </Button>
                  )
                ) : null}
              </div>
            </article>
          );
        })}
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
