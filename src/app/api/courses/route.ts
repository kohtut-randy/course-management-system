import { NextRequest, NextResponse } from "next/server";
import { CourseService } from "@/services/courseService";
import { initializeDatabase } from "@/lib/database/orm-config";
import { verifyAuth } from "@/lib/middleware/auth";

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();

    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description } = await request.json();

    if (!title) {
      return NextResponse.json(
        { error: "Course title is required" },
        { status: 400 },
      );
    }

    const course = await CourseService.createCourse(
      { title, description },
      user.id,
    );

    return NextResponse.json({ course, success: true });
  } catch (error) {
    console.error("Course creation error:", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();

    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const courses = await CourseService.getUserCourses(user.id);

    return NextResponse.json({ courses, success: true });
  } catch (error) {
    console.error("Course fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 },
    );
  }
}
