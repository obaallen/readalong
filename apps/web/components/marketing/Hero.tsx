"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "../ui/Button";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[480px] w-[900px] rounded-full blur-3xl opacity-40"
        aria-hidden
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(13,148,136,0.45), rgba(13,148,136,0.12) 35%, rgba(0,0,0,0) 70%)",
        }}
      />

      <div className="mx-auto max-w-[1200px] px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/80 dark:border-border-dark/80 bg-white/70 dark:bg-zinc-950/30 backdrop-blur px-3 py-1.5 text-xs text-content-secondary dark:text-content-secondary-dark">
              <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden />
              Local playback. Private by default.
            </div>

            <h1 className="mt-5 font-display text-5xl sm:text-6xl font-semibold tracking-[-0.03em] leading-[0.98]">
              Read anything, beautifully.
            </h1>
            <p className="mt-5 text-lg text-content-secondary dark:text-content-secondary-dark leading-relaxed max-w-[48ch]">
              Turn text, PDFs, and web pages into a smooth listening experience
              with natural voices and real‑time highlighting.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/signup">
                <Button size="lg">
                  Get started <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
              </Link>
              <Link href="/app">
                <Button size="lg" variant="secondary">
                  Try demo
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl border border-border dark:border-border-dark bg-white dark:bg-zinc-950/40 shadow-[0_25px_90px_rgba(0,0,0,0.10)] overflow-hidden">
              <div className="px-5 py-4 border-b border-border dark:border-border-dark bg-white/60 dark:bg-zinc-950/30">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">Reader</div>
                  <div className="text-xs text-content-secondary dark:text-content-secondary-dark">
                    Heart • 1.25×
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="font-reading text-[18px] leading-[1.85] text-content-primary dark:text-content-primary-dark">
                  <span className="rounded px-1 bg-accent-muted dark:bg-accent-muted-dark ring-1 ring-accent/15">
                    You should be able to click anywhere
                  </span>{" "}
                  and start listening instantly. The interface stays calm, the
                  highlight stays accurate, and the experience feels like a
                  daily tool—never a demo.
                  <span className="rounded px-1 ml-1 bg-accent-muted/35 dark:bg-accent-muted-dark/35">
                    Next comes the gentle preview.
                  </span>
                </div>
              </div>

              <div className="border-t border-border dark:border-border-dark bg-white/80 dark:bg-zinc-950/50">
                <div
                  className="ra-scrubShimmer h-10 bg-zinc-100/70 dark:bg-zinc-900/45"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(90deg, rgba(13,148,136,0.18), rgba(13,148,136,0.18) 2px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 7px)",
                  }}
                />
                <div className="px-5 py-4 flex items-center justify-between">
                  <div className="text-xs text-content-secondary dark:text-content-secondary-dark">
                    0:42 / 3:10
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-2xl bg-white dark:bg-zinc-950/40 border border-border dark:border-border-dark grid place-items-center">
                      ‹
                    </div>
                    <div className="h-10 w-10 rounded-2xl bg-accent text-white dark:text-surface-dark grid place-items-center shadow-sm">
                      ❚❚
                    </div>
                    <div className="h-9 w-9 rounded-2xl bg-white dark:bg-zinc-950/40 border border-border dark:border-border-dark grid place-items-center">
                      ›
                    </div>
                  </div>
                  <div className="text-xs text-content-secondary dark:text-content-secondary-dark">
                    Voice • Speed
                  </div>
                </div>
              </div>
            </div>

            <div
              className="pointer-events-none absolute -inset-6 rounded-[2.5rem] opacity-40"
              aria-hidden
              style={{
                background:
                  "radial-gradient(circle at 70% 30%, rgba(13,148,136,0.35), rgba(0,0,0,0) 55%)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

