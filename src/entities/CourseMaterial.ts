import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import type { Course } from "./Course"; // Type-only import

@Entity("course_materials")
export class CourseMaterial {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  filename!: string;

  @Column()
  originalName!: string;

  @Column()
  mimeType!: string;

  @Column()
  size!: number;

  @Column()
  path!: string;

  @ManyToOne("Course", "materials", {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "courseId" })
  course!: Course;

  @Column()
  courseId!: string;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  uploadedAt!: Date;
}
