import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import type { User } from "./User"; // Type-only import
import type { CourseMaterial } from "./CourseMaterial"; // Type-only import

@Entity("courses")
export class Course {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column({ type: "text", nullable: true })
  description!: string;

  @ManyToOne("User", "courses") // Use string reference
  user!: User;

  @Column()
  userId!: string;

  @OneToMany("CourseMaterial", "course") // Use string reference
  materials!: any[]; // Use any[] or create a type

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;
}
