import { AppDataSource } from "@/lib/database/orm-config";
import { Course } from "@/entities/Course";
import { CourseMaterial } from "@/entities/CourseMaterial";

export class CourseService {
  static async createCourse(courseData: any, userId: string) {
    try {
      const courseRepository = AppDataSource.getRepository(Course);

      const course = courseRepository.create({
        title: courseData.title,
        description: courseData.description,
        userId,
      });

      return await courseRepository.save(course);
    } catch (error) {
      console.error("Error creating course:", error);
      throw new Error("Failed to create course");
    }
  }

  static async getUserCourses(userId: string) {
    try {
      const courseRepository = AppDataSource.getRepository(Course);
      return await courseRepository.find({
        where: { userId },
        order: { createdAt: "DESC" },
        relations: ["materials"],
      });
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw new Error("Failed to fetch courses");
    }
  }

  static async getCourseWithMaterials(courseId: string, userId: string) {
    try {
      const courseRepository = AppDataSource.getRepository(Course);
      return await courseRepository.findOne({
        where: { id: courseId, userId },
        relations: ["materials"],
      });
    } catch (error) {
      console.error("Error fetching course:", error);
      throw new Error("Failed to fetch course");
    }
  }

  static async addMaterial(materialData: any, courseId: string) {
    try {
      const materialRepository = AppDataSource.getRepository(CourseMaterial);

      const material = materialRepository.create({
        ...materialData,
        courseId,
      });

      return await materialRepository.save(material);
    } catch (error) {
      console.error("Error adding material:", error);
      throw new Error("Failed to add material");
    }
  }

  static async getCourseMaterials(courseId: string) {
    try {
      const materialRepository = AppDataSource.getRepository(CourseMaterial);
      return await materialRepository.find({
        where: { courseId },
        order: { uploadedAt: "DESC" },
      });
    } catch (error) {
      console.error("Error fetching materials:", error);
      throw new Error("Failed to fetch materials");
    }
  }

  static async deleteMaterial(materialId: string, userId: string) {
    try {
      const materialRepository = AppDataSource.getRepository(CourseMaterial);
      const material = await materialRepository.findOne({
        where: { id: materialId },
        relations: ["course"],
      });

      if (!material) {
        throw new Error("Material not found");
      }

      // Check if user owns the course
      if (material.course.userId !== userId) {
        throw new Error("Unauthorized");
      }

      // Also delete file from filesystem
      const fs = require("fs/promises");
      try {
        await fs.unlink(material.path);
      } catch (fileError) {
        console.error("Error deleting file:", fileError);
        // Continue even if file deletion fails
      }

      return await materialRepository.remove(material);
    } catch (error) {
      console.error("Error deleting material:", error);
      throw error;
    }
  }
}
