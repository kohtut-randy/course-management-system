"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
// import CourseCreateMaterial from "@/components/CourseCreateMaterial";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Material {
  id: string;
  title: string;
  description?: string;
  originalName: string;
  uploadedAt: string;
  size: number;
}

interface Course {
  id: string;
  title: string;
  description: string;
  materials: Material[];
}

export default function CourseDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deletingMaterialId, setDeletingMaterialId] = useState<string | null>(
    null,
  );
  const courseId = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && courseId) {
      fetchCourse();
    }
  }, [user, courseId]);

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}`);
      const data = await response.json();
      setCourse(data.course);
    } catch (error) {
      console.error("Failed to fetch course:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this course? This action cannot be undone.",
      )
    ) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/courses");
      } else {
        const data = await response.json();
        alert(`Failed to delete course: ${data.error}`);
      }
    } catch (error) {
      console.error("Failed to delete course:", error);
      alert("Failed to delete course");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteMaterial = async (materialId: string) => {
    if (!confirm("Are you sure you want to delete this material?")) {
      return;
    }

    setDeletingMaterialId(materialId);
    try {
      const response = await fetch(`/api/courses/${courseId}/materials`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ materialId }),
      });

      if (response.ok) {
        fetchCourse();
      } else {
        const data = await response.json();
        alert(`Failed to delete material: ${data.error}`);
      }
    } catch (error) {
      console.error("Failed to delete material:", error);
      alert("Failed to delete material");
    } finally {
      setDeletingMaterialId(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Course not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-6">
        <CardHeader className="flex flex-row justify-between items-start">
          <CardTitle>{course.title}</CardTitle>
          <Button
            onClick={handleDeleteCourse}
            disabled={deleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {deleting ? "Deleting..." : "Delete Course"}
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            {course.description || "No description"}
          </p>
        </CardContent>
      </Card>

      {/* <CourseCreateMaterial
        courseId={course.id}
        onMaterialCreated={fetchCourse}
      /> */}

      <Card>
        <CardHeader>
          <CardTitle>Course Materials</CardTitle>
        </CardHeader>
        <CardContent>
          {course.materials?.length === 0 ? (
            <p className="text-gray-500">No materials uploaded yet.</p>
          ) : (
            <div className="space-y-2">
              {course.materials?.map((material) => (
                <div
                  key={material.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded"
                >
                  <div>
                    <p className="font-medium">{material.title}</p>
                    {material.description && (
                      <p className="text-sm text-gray-600 mb-1">
                        {material.description}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">
                      {material.originalName} • {formatFileSize(material.size)}{" "}
                      • Uploaded{" "}
                      {new Date(material.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleDeleteMaterial(material.id)}
                    disabled={deletingMaterialId === material.id}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm"
                  >
                    {deletingMaterialId === material.id
                      ? "Deleting..."
                      : "Delete"}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
