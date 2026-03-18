import { format } from "date-fns";
import { Link2 } from "lucide-react";
import { PreviewMaterialDialog } from "./preview-material-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClassMaterialDTO } from "@/features/materials/server/dto";

interface StudentMaterialCardProps {
  material: ClassMaterialDTO;
}

function formatFileSize(fileSize: number | null) {
  if (!fileSize) return null;
  if (fileSize < 1024) return `${fileSize} B`;
  if (fileSize < 1024 * 1024) return `${(fileSize / 1024).toFixed(1)} KB`;
  return `${(fileSize / (1024 * 1024)).toFixed(1)} MB`;
}

export function StudentMaterialCard({ material }: StudentMaterialCardProps) {
  const targetUrl =
    material.materialType === "pdf"
      ? `/api/student/classes/${material.classId}/materials/${material.id}/open`
      : material.externalUrl;
  const fileSizeLabel = formatFileSize(material.fileSize);

  return (
    <article className="rounded-2xl border border-[var(--admin-border)] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-[var(--admin-title)]">
            {material.title}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-[var(--admin-text-muted)]">
            <Badge className="rounded-md bg-blue-100 text-blue-700 hover:bg-blue-100">
              {material.materialType.toUpperCase()}
            </Badge>
            {fileSizeLabel && <span>{fileSizeLabel}</span>}
            <span>•</span>
            <span>{format(new Date(material.createdAt), "MMM d, yyyy")}</span>
          </div>
        </div>

        {targetUrl &&
          (material.materialType === "pdf" ? (
            <PreviewMaterialDialog
              materialId={material.id}
              classId={material.classId}
              title={material.title}
              portal="student"
              triggerLabel="View"
              triggerVariant="ghost"
            />
          ) : (
            <Button asChild variant="ghost" size="sm">
              <a href={targetUrl} target="_blank" rel="noopener noreferrer">
                <Link2 className="h-4 w-4" />
                Open
              </a>
            </Button>
          ))}
      </div>
    </article>
  );
}
