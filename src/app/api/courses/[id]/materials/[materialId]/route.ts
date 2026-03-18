import { NextRequest, NextResponse } from "next/server";
import { CourseService } from "@/services/courseService";
import { initializeDatabase } from "@/lib/database/orm-config";
import { verifyAuth } from "@/lib/middleware/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; materialId: string }> },
) {
  try {
    await initializeDatabase();

    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { materialId } = await params;

    const material = await CourseService.getMaterialById(materialId, user.id);

    return NextResponse.json({ material, success: true });
  } catch (error) {
    console.error("Material fetch error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch material";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; materialId: string }> },
) {
  try {
    await initializeDatabase();

    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { materialId } = await params;
    const updateData = await request.json();

    const material = await CourseService.updateMaterial(
      materialId,
      updateData,
      user.id,
    );

    return NextResponse.json({ material, success: true });
  } catch (error) {
    console.error("Material update error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update material";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; materialId: string }> },
) {
  try {
    await initializeDatabase();

    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { materialId } = await params;

    const result = await CourseService.deleteMaterialById(materialId, user.id);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Material deletion error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete material";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
