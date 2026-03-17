"use client";

import Link from "next/link";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export function AuthCard({
  mode,
}: {
  mode: "login" | "signup";
}) {
  const isSignup = mode === "signup";

  return (
    <div className="w-full max-w-[420px] rounded-[2.25rem] border border-border dark:border-border-dark bg-white/70 dark:bg-zinc-950/35 backdrop-blur p-8 shadow-[0_30px_120px_rgba(0,0,0,0.12)]">
      <div className="text-2xl font-semibold tracking-tight">
        {isSignup ? "Create your account" : "Welcome back"}
      </div>
      <div className="mt-2 text-sm text-content-secondary dark:text-content-secondary-dark">
        {isSignup
          ? "Start reading and listening with a calm, focused experience."
          : "Sign in to continue your reading flow."}
      </div>

      <div className="mt-7 grid gap-3">
        <Button variant="secondary" type="button" className="w-full justify-center">
          Continue with Google
        </Button>

        <div className="flex items-center gap-3 text-xs text-content-secondary dark:text-content-secondary-dark">
          <div className="h-px flex-1 bg-border dark:bg-border-dark" />
          or
          <div className="h-px flex-1 bg-border dark:bg-border-dark" />
        </div>
      </div>

      <form className="mt-5 grid gap-4">
        <div className="grid gap-2">
          <label className="text-xs font-semibold text-content-secondary dark:text-content-secondary-dark">
            Email
          </label>
          <Input type="email" placeholder="you@domain.com" autoComplete="email" />
        </div>

        <div className="grid gap-2">
          <label className="text-xs font-semibold text-content-secondary dark:text-content-secondary-dark">
            Password
          </label>
          <Input type="password" placeholder="••••••••" autoComplete={isSignup ? "new-password" : "current-password"} />
        </div>

        {isSignup && (
          <div className="grid gap-2">
            <label className="text-xs font-semibold text-content-secondary dark:text-content-secondary-dark">
              Confirm password
            </label>
            <Input type="password" placeholder="••••••••" autoComplete="new-password" />
          </div>
        )}

        <Button type="button" className="w-full justify-center" size="lg">
          {isSignup ? "Create account" : "Sign in"}
        </Button>
      </form>

      <div className="mt-6 text-sm text-content-secondary dark:text-content-secondary-dark">
        {isSignup ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-accent hover:underline">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New here?{" "}
            <Link href="/signup" className="text-accent hover:underline">
              Create account
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

