import { NextRequest, NextResponse } from "next/server";
import { CourseService } from "@/services/courseService";
import { initializeDatabase } from "@/lib/database/orm-config";
import { verifyAuth } from "@/lib/middleware/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await initializeDatabase();

    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const courseId = params.id;

    const course = await CourseService.getCourseWithMaterials(
      courseId,
      user.id,
    );

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({ course, success: true });
  } catch (error) {
    console.error("Course fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await initializeDatabase();

    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const courseId = params.id;

    await CourseService.deleteCourse(courseId, user.id);

    return NextResponse.json({ success: true, message: "Course deleted" });
  } catch (error) {
    console.error("Course deletion error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete course";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
