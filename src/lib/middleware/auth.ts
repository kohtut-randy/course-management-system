import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../database/orm-config";
import { Session } from "@/entities/Session";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function verifyAuth(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return null;
    }

    // Verify JWT
    const decoded: any = jwt.verify(token, JWT_SECRET);

    // Check if session exists and is valid
    const sessionRepository = AppDataSource.getRepository(Session);
    const session = await sessionRepository.findOne({
      where: { token, isValid: true },
      relations: ["user"],
    });

    if (!session) {
      return null;
    }

    return session.user;
  } catch (error) {
    return null;
  }
}
