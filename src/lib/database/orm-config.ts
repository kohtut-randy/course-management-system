import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "@/entities/User";
import { Course } from "@/entities/Course";
import { CourseMaterial } from "@/entities/CourseMaterial";
import { Session } from "@/entities/Session";
import path from "path";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: path.join(process.cwd(), "database.sqlite"),
  entities: [User, Course, CourseMaterial, Session],
  synchronize: true, // Set to false in production
  logging: process.env.NODE_ENV === "development",
  migrations: [path.join(process.cwd(), "src/migrations/*.ts")],
  migrationsTableName: "migrations",
});

export const initializeDatabase = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("📦 Database connected successfully");

      // Run any pending migrations in production
      if (process.env.NODE_ENV === "production") {
        await AppDataSource.runMigrations();
        console.log("✅ Migrations completed");
      }
    }
    return AppDataSource;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error;
  }
};

export const getRepository = (entity: any) => {
  if (!AppDataSource.isInitialized) {
    throw new Error(
      "Database not initialized. Call initializeDatabase() first.",
    );
  }
  return AppDataSource.getRepository(entity);
};
