import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import type { Course } from "./Course"; // Type-only import
import type { Session } from "./Session"; // Type-only import

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  name!: string;

  @Column({ unique: true })
  firebaseUid!: string;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @OneToMany("Course", "user") // Use string reference instead of arrow function
  courses!: any[]; // Use any[] or create a type

  @OneToMany("Session", "user") // Use string reference instead of arrow function
  sessions!: any[]; // Use any[] or create a type
}
