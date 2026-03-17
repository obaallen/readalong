"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";

export function CTASection() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-16">
      <div className="relative overflow-hidden rounded-[2.75rem] border border-border dark:border-border-dark bg-gradient-to-br from-accent/12 via-white/70 to-transparent dark:from-accent/14 dark:via-zinc-950/30 dark:to-transparent shadow-[0_30px_100px_rgba(0,0,0,0.10)] p-10 sm:p-14">
        <div className="max-w-[62ch]">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.02em]">
            Start reading smarter today.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-content-secondary dark:text-content-secondary-dark leading-relaxed">
            Create an account to keep your reading flow consistent across sessions.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href="/signup">
              <Button size="lg">
                Create your account <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="secondary">
                Login
              </Button>
            </Link>
          </div>
        </div>

        <div
          className="pointer-events-none absolute -right-24 -top-24 h-[320px] w-[320px] rounded-full blur-3xl opacity-50"
          aria-hidden
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(13,148,136,0.55), rgba(0,0,0,0) 65%)",
          }}
        />
      </div>
    </section>
  );
}

