"use client";

import { Upload } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClassMaterial } from "@/features/materials/server/actions";

interface UploadMaterialDialogProps {
  classId: string;
}

type MaterialType = "pdf" | "link";

export function UploadMaterialDialog({ classId }: UploadMaterialDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [materialType, setMaterialType] = useState<MaterialType>("pdf");
  const [isUploading, setIsUploading] = useState(false);

  const createMaterialAction = useAction(createClassMaterial, {
    onSuccess: () => {
      toast.success("Material uploaded successfully");
      setOpen(false);
      router.refresh();
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Failed to upload material");
    },
  });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = (formData.get("title") as string | null)?.trim() || "";

    if (!title) {
      toast.error("Title is required");
      return;
    }

    if (materialType === "link") {
      const externalUrl = (formData.get("externalUrl") as string | null)?.trim() || "";
      if (!externalUrl) {
        toast.error("Link URL is required");
        return;
      }

      createMaterialAction.execute({
        classId,
        title,
        materialType: "link",
        externalUrl,
      });
      return;
    }

    const file = formData.get("pdfFile");
    if (!(file instanceof File) || file.size <= 0) {
      toast.error("Please choose a PDF file");
      return;
    }

    setIsUploading(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const uploadResponse = await fetch(`/api/teacher/classes/${classId}/materials/upload`, {
        method: "POST",
        body: uploadFormData,
      });

      const uploadData = await uploadResponse.json();
      if (!uploadResponse.ok) {
        throw new Error(uploadData.error || "Failed to upload PDF");
      }

      createMaterialAction.execute({
        classId,
        title,
        materialType: "pdf",
        blobUrl: uploadData.url,
        originalFileName: uploadData.originalFileName,
        mimeType: uploadData.mimeType,
        fileSize: uploadData.fileSize,
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to upload PDF");
    } finally {
      setIsUploading(false);
    }
  }

  const isSubmitting = isUploading || createMaterialAction.isExecuting;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="h-4 w-4" />
          Upload Material
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Class Material</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" placeholder="Week 1 handout" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="materialType">Type</Label>
            <Select
              value={materialType}
              onValueChange={(value) => setMaterialType(value as MaterialType)}
            >
              <SelectTrigger id="materialType">
                <SelectValue placeholder="Select a material type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="link">Link</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {materialType === "pdf" ? (
            <div className="space-y-2">
              <Label htmlFor="pdfFile">PDF File</Label>
              <Input
                id="pdfFile"
                name="pdfFile"
                type="file"
                accept="application/pdf,.pdf"
                required
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="externalUrl">Link URL</Label>
              <Input
                id="externalUrl"
                name="externalUrl"
                type="url"
                placeholder="https://example.com/material"
                required
              />
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Material"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
