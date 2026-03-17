"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/70 dark:border-border-dark/70">
      <div className="mx-auto max-w-[1200px] px-6 py-12 flex flex-col sm:flex-row gap-6 sm:items-center sm:justify-between">
        <div className="font-semibold">ReadAlong</div>
        <div className="flex items-center gap-4 text-sm text-content-secondary dark:text-content-secondary-dark">
          <a href="#features" className="hover:text-content-primary dark:hover:text-content-primary-dark">
            Features
          </a>
          <Link href="/privacy" className="hover:text-content-primary dark:hover:text-content-primary-dark">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-content-primary dark:hover:text-content-primary-dark">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}

