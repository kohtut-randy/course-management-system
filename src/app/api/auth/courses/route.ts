import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/middleware/auth";
import { CourseService } from "@/services/courseService";
import { initializeDatabase } from "@/lib/database/orm-config";

export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();

    const user = await verifyAuth(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const courses = await CourseService.getUserCourses(user.id);

    return NextResponse.json({ courses });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();

    const user = await verifyAuth(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const course = await CourseService.createCourse(body, user.id);

    return NextResponse.json({ course });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 },
    );
  }
}
