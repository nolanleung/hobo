"use client";

import { useAuth } from "@/components/auth-provider";
import Link from "next/link";

export default function Home() {
  const { session, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="bg-background text-foreground flex h-screen w-screen items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Hello World</h1>
        
        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : session ? (
          <div className="space-y-2">
            <p className="text-lg">Welcome, {session.user.name}!</p>
            <p className="text-sm text-muted-foreground">{session.user.email}</p>
            <button
              onClick={handleSignOut}
              className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="space-x-4">
            <Link
              href="/login"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 inline-block"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent inline-block"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
