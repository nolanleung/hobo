"use client";

import { useAuth } from "@/providers/auth-provider";
import { Button } from "@repo/ui/components/button";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    signIn,
    refreshSession,
    loading: sessionLoading,
    session,
  } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn.email({
        email,
        password,
      });
      await refreshSession();
      router.push("/");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignin = (provider: string) => async () => {
    setLoading(true);
    try {
      await signIn.social({
        provider,
        callbackURL: `${window.location.origin}/`,
      });
      refreshSession();
      router.push("/");
    } catch {
      setError("Failed to sign in with " + provider);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionLoading) return;
    if (!session) return;

    redirect("/");
  }, []);

  if (!sessionLoading && session) return null;

  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg border p-8 shadow-sm">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Sign In</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Welcome back! Please sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="ring-offset-background focus:ring-ring w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-offset-2"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="ring-offset-background focus:ring-ring w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-offset-2"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-md px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <Button
            type="button"
            onClick={handleSocialSignin("google")}
            className="w-full"
            variant="outline"
          >
            Continue with Google
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              {"Don't have an account?"}{" "}
            </span>
            <Link
              href="/signup"
              className="text-primary font-medium hover:underline"
            >
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
