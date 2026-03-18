"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import CourseLineGraph from "@/components/CourseLineGraph";

interface Course {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export default function CoursesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchCourses();
    }
  }, [user]);

  const fetchCourses = async () => {
    try {
      const response = await fetch("/api/courses");
      const data = await response.json();
      setCourses(data.courses || []);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading...</p>
      </div>
    );
  }

  const totalCourses = courses.length;
  const recentCourse = [...courses]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .at(0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8 md:gap-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-gray-500">
              Quick overview of your courses and recent activity.
            </p>
          </div>

          <Link href="/courses/create">
            <Button>Create New Course</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{totalCourses}</p>
              <p className="text-sm text-gray-500">Courses you have created</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Most Recent</CardTitle>
            </CardHeader>
            <CardContent>
              {recentCourse ? (
                <>
                  <p className="font-semibold">{recentCourse.title}</p>
                  <p className="text-sm text-gray-500">
                    Created{" "}
                    {new Date(recentCourse.createdAt).toLocaleDateString()}
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-500">No courses yet</p>
              )}
            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Link href="/courses">
                  <Button variant="ghost" className="justify-start">
                    View All Courses
                  </Button>
                </Link>
                <Link href="/courses/create">
                  <Button variant="ghost" className="justify-start">
                    Create New Course
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card> */}
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <CourseLineGraph
                createdAtDates={courses.map((course) => course.createdAt)}
              />
            </CardContent>
          </Card>
        </div>

        {courses.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-gray-500">
                You haven't created any courses yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link href={`/courses/${course.id}`} key={course.id}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle>{course.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {course.description || "No description"}
                    </p>
                    <p className="text-sm text-gray-400">
                      Created: {new Date(course.createdAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
