"use client";

import { useAuth } from "@/providers/auth-provider";
import { Button } from "@repo/ui/components/button";

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
            <Button onClick={handleSignOut} className="inline-block">
              Sign out
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Button asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
