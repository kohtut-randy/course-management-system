"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Course Management
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/courses">
                <Button variant="ghost">My Courses</Button>
              </Link>
              <Button onClick={signOut} variant="outline">
                Logout
              </Button>
            </>
          ) : null}
        </div>
      </nav>
    </header>
  );
}
