import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/services/authService";
import { initializeDatabase } from "@/lib/database/orm-config";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();

    const { firebaseUser, deviceInfo } = await request.json();

    const { user, token } = await AuthService.loginOrRegister(
      firebaseUser,
      deviceInfo,
    );

    // Await the cookies() function
    const cookieStore = await cookies();

    // Then set the cookie
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/", // Add path for better security
    });

    return NextResponse.json({ user, success: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 },
    );
  }
}
