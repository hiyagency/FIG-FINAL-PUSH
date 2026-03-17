"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function LocalUploadForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const files = fileInputRef.current?.files;

    if (!files || files.length === 0) {
      toast.error("Select at least one file to upload.");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append("files", file));

      const response = await fetch("/api/local/uploads", {
        method: "POST",
        body: formData
      });

      const payload = (await response.json()) as { error?: string; uploaded?: number };

      if (!response.ok) {
        throw new Error(payload.error || "Upload failed.");
      }

      toast.success(`${payload.uploaded ?? files.length} file(s) uploaded.`);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-[22px] border border-dashed border-slate-300 bg-slate-50 p-6">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-brand-500 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-brand-400"
        />
        <p className="mt-3 text-sm text-slate-500">
          Files are stored locally in the `uploads/private-studio` folder on this machine.
        </p>
      </div>
      <Button type="submit" disabled={isUploading}>
        {isUploading ? "Uploading..." : "Upload to local library"}
      </Button>
    </form>
  );
}
