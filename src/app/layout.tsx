import "reflect-metadata"; // Add this at the very top
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { initDatabase } from "@/lib/database/init";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Course Management System",
  description: "Manage your courses and materials",
};

// Initialize database on server start
if (typeof window === "undefined") {
  initDatabase();
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
