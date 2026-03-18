import { NextRequest, NextResponse } from "next/server";
import { CourseService } from "@/services/courseService";
import { initializeDatabase } from "@/lib/database/orm-config";
import { verifyAuth } from "@/lib/middleware/auth";
import { validateFile } from "@/utils/fileValidation";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await initializeDatabase();

    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: courseId } = await params;
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const file = formData.get("file") as File | null;

    // Validate title is present and not empty
    if (!title || title.trim() === "") {
      return NextResponse.json(
        { error: "Material title is required" },
        { status: 400 },
      );
    }

    // Verify that the course belongs to the user
    const course = await CourseService.getCourseWithMaterials(
      courseId,
      user.id,
    );
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    let materialData: any = {
      title: title.trim(),
      description: description?.trim() || null,
      filename: title.trim(),
      originalName: title.trim(),
      mimeType: "text/plain",
      path: "",
      size: 0,
    };

    // If file is provided, save it
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Validate file
      const fileValidation = {
        mimetype: file.type,
        size: buffer.length,
      } as any;

      const validation = validateFile(fileValidation);
      if (!validation.valid) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }

      // Create uploads directory if it doesn't exist
      const uploadDir = path.join(process.cwd(), "uploads", courseId);
      await mkdir(uploadDir, { recursive: true });

      // Generate unique filename
      const fileExtension = path.extname(file.name);
      const fileName = `${uuidv4()}${fileExtension}`;
      const filePath = path.join(uploadDir, fileName);

      // Save file
      await writeFile(filePath, buffer);

      materialData = {
        title: title.trim(),
        description: description?.trim() || null,
        filename: fileName,
        originalName: file.name,
        mimeType: file.type,
        size: buffer.length,
        path: filePath,
      };
    }

    const material = await CourseService.addMaterial(materialData, courseId);

    return NextResponse.json({ material, success: true });
  } catch (error) {
    console.error("Material creation error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create material",
        details:
          process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await initializeDatabase();

    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: courseId } = await params;
    const { materialId } = await request.json();

    if (!materialId) {
      return NextResponse.json(
        { error: "Material ID is required" },
        { status: 400 },
      );
    }

    await CourseService.deleteMaterial(materialId, user.id);

    return NextResponse.json({ success: true, message: "Material deleted" });
  } catch (error) {
    console.error("Material deletion error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete material";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
