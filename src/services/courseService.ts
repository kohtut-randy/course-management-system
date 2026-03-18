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
      console.log(
        "CourseService.getCourseWithMaterials - courseId:",
        courseId,
        "userId:",
        userId,
      );
      const courseRepository = AppDataSource.getRepository(Course);
      const course = await courseRepository.findOne({
        where: { id: courseId, userId },
        relations: ["materials"],
      });
      console.log(
        "CourseService.getCourseWithMaterials - Found course:",
        course,
      );
      return course;
    } catch (error) {
      console.error("Error fetching course:", error);
      throw new Error("Failed to fetch course");
    }
  }

  static async createMaterial(
    materialData: any,
    courseId: string,
    userId: string,
  ) {
    try {
      // First verify the course belongs to the user
      const course = await this.getCourseWithMaterials(courseId, userId);
      if (!course) {
        throw new Error("Course not found or access denied");
      }

      // Validate required fields
      if (!materialData.title || materialData.title.trim() === "") {
        throw new Error("Material title is required");
      }

      const materialRepository = AppDataSource.getRepository(CourseMaterial);

      const material = materialRepository.create({
        title: materialData.title.trim(),
        description: materialData.description?.trim() || null,
        filename: materialData.filename,
        originalName: materialData.originalName,
        mimeType: materialData.mimeType,
        path: materialData.path,
        size: materialData.size,
        courseId,
      });

      return await materialRepository.save(material);
    } catch (error) {
      console.error("Error creating material:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to create material",
      );
    }
  }

  static async deleteMaterialById(materialId: string, userId: string) {
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
        throw new Error("Unauthorized to delete this material");
      }

      // Delete file from filesystem if it exists
      if (material.path) {
        const fs = require("fs/promises");
        try {
          await fs.unlink(material.path);
        } catch (fileError) {
          console.error("Error deleting file:", fileError);
          // Continue even if file deletion fails
        }
      }

      await materialRepository.remove(material);
      return { success: true, message: "Material deleted successfully" };
    } catch (error) {
      console.error("Error deleting material:", error);
      throw error;
    }
  }

  static async updateMaterial(
    materialId: string,
    updateData: any,
    userId: string,
  ) {
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
        throw new Error("Unauthorized to update this material");
      }

      // Update allowed fields
      if (updateData.title !== undefined) {
        material.title = updateData.title.trim();
      }
      if (updateData.description !== undefined) {
        material.description = updateData.description?.trim() || null;
      }

      return await materialRepository.save(material);
    } catch (error) {
      console.error("Error updating material:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to update material",
      );
    }
  }

  static async getMaterialById(materialId: string, userId: string) {
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
        throw new Error("Unauthorized to access this material");
      }

      return material;
    } catch (error) {
      console.error("Error fetching material:", error);
      throw error;
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

  static async deleteCourse(courseId: string, userId: string) {
    try {
      const courseRepository = AppDataSource.getRepository(Course);
      const materialRepository = AppDataSource.getRepository(CourseMaterial);

      const course = await courseRepository.findOne({
        where: { id: courseId, userId },
        relations: ["materials"],
      });

      if (!course) {
        throw new Error("Course not found");
      }

      // Delete all associated materials and their files
      const fs = require("fs/promises");
      for (const material of course.materials || []) {
        try {
          if (material.path) {
            await fs.unlink(material.path);
          }
        } catch (fileError) {
          console.error("Error deleting file:", fileError);
          // Continue even if file deletion fails
        }
      }

      // Delete all materials from database
      if (course.materials && course.materials.length > 0) {
        await materialRepository.remove(course.materials);
      }

      // Delete the course
      return await courseRepository.remove(course);
    } catch (error) {
      console.error("Error deleting course:", error);
      throw error;
    }
  }
}
