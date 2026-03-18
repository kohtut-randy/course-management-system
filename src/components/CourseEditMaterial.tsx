"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Material {
  id: string;
  title: string;
  description?: string;
  originalName: string;
}

interface CourseEditMaterialProps {
  material: Material;
  onMaterialUpdated: () => void;
  onCancel: () => void;
}

export default function CourseEditMaterial({
  material,
  onMaterialUpdated,
  onCancel,
}: CourseEditMaterialProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: material.title,
    description: material.description || "",
  });

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
      const response = await fetch(
        `/api/courses/${material.id}/materials/${material.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formData.title.trim(),
            description: formData.description.trim(),
          }),
        },
      );

      if (response.ok) {
        onMaterialUpdated();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to update material");
      }
    } catch (error) {
      setError("Failed to update material");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Edit Material</CardTitle>
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

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Updating..." : "Update Material"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
