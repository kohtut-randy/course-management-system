import { AppDataSource } from "@/lib/database/orm-config";
import { User } from "@/entities/User";
import { Session } from "@/entities/Session";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export class AuthService {
  static async loginOrRegister(firebaseUser: any, deviceInfo: string) {
    const userRepository = AppDataSource.getRepository(User);
    const sessionRepository = AppDataSource.getRepository(Session);

    // Find or create user
    let user = await userRepository.findOne({
      where: { firebaseUid: firebaseUser.uid },
    });

    if (!user) {
      user = userRepository.create({
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        firebaseUid: firebaseUser.uid,
      });
      await userRepository.save(user);
    }

    // Invalidate all previous sessions
    await sessionRepository.update(
      { userId: user.id, isValid: true },
      { isValid: false },
    );

    // Create new session
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    const session = sessionRepository.create({
      token,
      userId: user.id,
      deviceInfo,
      isValid: true,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    await sessionRepository.save(session);

    return { user, token };
  }

  static async logout(token: string) {
    const sessionRepository = AppDataSource.getRepository(Session);
    await sessionRepository.update({ token }, { isValid: false });
  }
}
