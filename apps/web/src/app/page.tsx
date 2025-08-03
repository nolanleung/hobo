"use client";

import { useAuth } from "@/components/auth-provider";
import Link from "next/link";

export default function Home() {
  const { session, loading, signOut, refreshSession } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    refreshSession();
  };

  return (
    <div className="bg-background text-foreground flex h-screen w-screen items-center justify-center">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-bold">Hello World</h1>

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : session ? (
          <div className="space-y-2">
            <p className="text-lg">Welcome, {session.user.name}!</p>
            <p className="text-muted-foreground text-sm">
              {session.user.email}
            </p>
            <button
              onClick={handleSignOut}
              className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 rounded-md px-4 py-2 text-sm font-medium"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="space-x-4">
            <Link
              href="/login"
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-block rounded-md px-4 py-2 text-sm font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="hover:bg-accent inline-block rounded-md border px-4 py-2 text-sm font-medium"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
