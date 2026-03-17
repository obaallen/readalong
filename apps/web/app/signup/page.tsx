"use client";

import Link from "next/link";
import { useTheme } from "../../components/ThemeClient";
import { Navbar } from "../../components/marketing/Navbar";
import { AuthCard } from "../../components/auth/AuthCard";

export default function SignupPage() {
  const { theme, toggle } = useTheme();

  return (
    <div>
      <Navbar theme={theme} onThemeToggle={toggle} />
      <div className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[520px] w-[920px] rounded-full blur-3xl opacity-40"
          aria-hidden
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(13,148,136,0.35), rgba(13,148,136,0.10) 35%, rgba(0,0,0,0) 70%)",
          }}
        />
        <div className="mx-auto max-w-[1200px] px-6 py-16 flex flex-col items-center">
          <AuthCard mode="signup" />
          <Link
            href="/"
            className="mt-8 text-sm text-content-secondary dark:text-content-secondary-dark hover:text-content-primary dark:hover:text-content-primary-dark"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

