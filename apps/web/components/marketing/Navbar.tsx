"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BookOpenText, Menu, Moon, Sun, X } from "lucide-react";
import { Button } from "../ui/Button";

export function Navbar({
  theme,
  onThemeToggle,
}: {
  theme: "light" | "dark";
  onThemeToggle: () => void;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 dark:border-border-dark/70 bg-white/70 dark:bg-zinc-950/40 backdrop-blur supports-[backdrop-filter]:bg-white/55 supports-[backdrop-filter]:dark:bg-zinc-950/30">
      <div className="mx-auto max-w-[1200px] px-6 h-16 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-2xl bg-accent-muted dark:bg-accent-muted-dark grid place-items-center">
            <BookOpenText className="h-5 w-5 text-accent" aria-hidden />
          </div>
          <div className="font-semibold tracking-tight">ReadAlong</div>
        </Link>

        <nav className="ml-auto hidden md:flex items-center gap-1 text-sm text-content-secondary dark:text-content-secondary-dark">
          <a href="#features" className="px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900/50">
            Features
          </a>
          <a href="#pricing" className="px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900/50">
            Pricing
          </a>
          <Link href="/login" className="px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900/50">
            Login
          </Link>
        </nav>

        <div className="ml-auto md:ml-0 flex items-center gap-2">
          <button
            type="button"
            onClick={onThemeToggle}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            className="rounded-2xl border border-border dark:border-border-dark bg-white/70 dark:bg-zinc-950/40 px-3 py-2 hover:shadow-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" aria-hidden /> : <Moon className="h-4 w-4" aria-hidden />}
          </button>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="md:hidden rounded-2xl border border-border dark:border-border-dark bg-white/70 dark:bg-zinc-950/40 px-3 py-2 hover:shadow-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <Menu className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <Link href="/signup">
            <Button size="sm" variant="secondary">
              Get started
            </Button>
          </Link>
          <Link href="/app">
            <Button size="sm">Try demo</Button>
          </Link>
        </div>
      </div>

      {open && (
        <div className="md:hidden fixed inset-0 z-40">
          <button
            type="button"
            className="absolute inset-0 bg-black/30"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-[360px] max-w-[88vw] border-l border-border dark:border-border-dark bg-white/90 dark:bg-zinc-950/80 backdrop-blur shadow-[0_30px_120px_rgba(0,0,0,0.25)] p-5">
            <div className="flex items-center justify-between">
              <div className="font-semibold">Menu</div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="rounded-2xl border border-border dark:border-border-dark bg-white/70 dark:bg-zinc-950/40 px-3 py-2"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>

            <div className="mt-6 grid gap-2 text-sm">
              <a
                href="#features"
                onClick={() => setOpen(false)}
                className="rounded-2xl border border-border dark:border-border-dark bg-white/70 dark:bg-zinc-950/35 px-4 py-3"
              >
                Features
              </a>
              <a
                href="#pricing"
                onClick={() => setOpen(false)}
                className="rounded-2xl border border-border dark:border-border-dark bg-white/70 dark:bg-zinc-950/35 px-4 py-3"
              >
                Pricing
              </a>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="rounded-2xl border border-border dark:border-border-dark bg-white/70 dark:bg-zinc-950/35 px-4 py-3"
              >
                Login
              </Link>

              <div className="mt-3 grid gap-2">
                <Link href="/signup" onClick={() => setOpen(false)}>
                  <Button className="w-full justify-center" size="lg">
                    Get started
                  </Button>
                </Link>
                <Link href="/app" onClick={() => setOpen(false)}>
                  <Button className="w-full justify-center" size="lg" variant="secondary">
                    Try demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

