"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ALLOWED_EXTENSIONS, MAX_FILE_SIZE } from "@/utils/fileValidation";

interface CourseCreateMaterialProps {
  courseId: string;
  onMaterialCreated: () => void;
}

export default function CourseCreateMaterial({
  courseId,
  onMaterialCreated,
}: CourseCreateMaterialProps) {
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate title
    if (!formData.title || formData.title.trim() === "") {
      setError("Material title is required");
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title.trim());
      formDataToSend.append("description", formData.description.trim());

      if (file) {
        formDataToSend.append("file", file);
      }

      const response = await fetch(`/api/courses/${courseId}/materials`, {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        setFormData({ title: "", description: "" });
        setFile(null);
        setFileError("");
        setShowForm(false);
        onMaterialCreated();
      } else {
        setError(data.error || data.details || "Failed to create material");
        console.error("Material creation failed:", data);
      }
    } catch (error) {
      setError("Failed to create material");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file extension
    const extension = "." + selectedFile.name.split(".").pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      setFileError("File type not allowed");
      setFile(null);
      return;
    }

    // Validate file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      setFileError("File size exceeds 10MB limit");
      setFile(null);
      return;
    }

    setFileError("");
    setFile(selectedFile);
  };

  if (!showForm) {
    return (
      <Button onClick={() => setShowForm(true)} className="w-full mb-4">
        + Add New Material
      </Button>
    );
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Create New Material</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">
              Material Title *
            </label>
            <Input
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g., Lecture 1 Slides, Chapter 2 Notes"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description (Optional)
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Add a brief description for this material"
              rows={3}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Upload File (Optional)
            </label>
            <Input
              type="file"
              onChange={handleFileChange}
              disabled={loading}
              accept={ALLOWED_EXTENSIONS.join(",")}
            />
            {file && (
              <p className="text-sm text-green-600 mt-2">
                ✓ {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </p>
            )}
            {fileError && (
              <p className="text-sm text-red-500 mt-2">{fileError}</p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowForm(false);
                setFormData({ title: "", description: "" });
                setError("");
              }}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Creating..." : "Create Material"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
