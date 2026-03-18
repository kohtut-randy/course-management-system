"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ALLOWED_EXTENSIONS, MAX_FILE_SIZE } from "@/utils/fileValidation";

interface FileUploadProps {
  courseId: string;
  onUploadComplete: () => void;
}

export default function FileUpload({
  courseId,
  onUploadComplete,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file extension
    const extension = "." + file.name.split(".").pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      setError("File type not allowed");
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError("File size exceeds 10MB limit");
      return;
    }

    setError("");
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("courseId", courseId);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        onUploadComplete();
        e.target.value = "";
      } else {
        const data = await response.json();
        setError(data.error || "Upload failed");
      }
    } catch (error) {
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Input
        type="file"
        onChange={handleFileChange}
        disabled={uploading}
        accept={ALLOWED_EXTENSIONS.join(",")}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      {uploading && <p className="text-sm text-blue-500">Uploading...</p>}
    </div>
  );
}
