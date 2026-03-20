"use client";

import { ExternalLink, FileText } from "lucide-react";
import { useMemo, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import type { VariantProps } from "class-variance-authority";

interface MaterialPreviewDialogProps {
  materialId: string;
  classId: string;
  title: string;
  portal: "teacher" | "student";
  triggerLabel?: string;
  triggerVariant?: VariantProps<typeof buttonVariants>["variant"];
}

export function PreviewMaterialDialog({
  materialId,
  classId,
  title,
  portal,
  triggerLabel = "Open",
  triggerVariant = "outline",
}: MaterialPreviewDialogProps) {
  const [open, setOpen] = useState(false);

  const openUrl = useMemo(() => {
    return `/api/${portal}/classes/${classId}/materials/${materialId}/open`;
  }, [classId, materialId, portal]);

  return (
    <>
      <Button variant={triggerVariant} size="sm" onClick={() => setOpen(true)}>
        <FileText className="h-4 w-4" />
        {triggerLabel}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="h-[85vh] max-w-5xl p-0">
          <div className="flex h-full flex-col">
            <DialogHeader className="border-b border-[var(--admin-border)] px-6 py-4">
              <DialogTitle className="truncate pr-10">{title}</DialogTitle>
            </DialogHeader>

            <iframe src={openUrl} title={title} className="h-full w-full border-0" />

            <div className="border-t border-[var(--admin-border)] px-6 py-3">
              <Button asChild variant="outline" size="sm">
                <a href={openUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  Open in new tab
                </a>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
