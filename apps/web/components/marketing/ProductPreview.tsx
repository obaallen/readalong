"use client";

import Link from "next/link";
import { Button } from "../ui/Button";

export function ProductPreview() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-16">
      <div className="rounded-[2.5rem] border border-border dark:border-border-dark bg-white/70 dark:bg-zinc-950/25 backdrop-blur shadow-[0_35px_120px_rgba(0,0,0,0.12)] overflow-hidden">
        <div className="px-7 py-6 border-b border-border dark:border-border-dark flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">Product preview</div>
            <div className="mt-1 text-sm text-content-secondary dark:text-content-secondary-dark">
              A centered canvas, crisp highlight, persistent player.
            </div>
          </div>
          <Link href="/app" className="hidden sm:block">
            <Button variant="secondary">Open demo</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px]">
          <div className="p-8 sm:p-10">
            <div className="max-w-reader mx-auto font-reading text-reader-base leading-[1.85]">
              <span className="rounded px-1 bg-accent-muted dark:bg-accent-muted-dark ring-1 ring-accent/15">
                The highlight anchors your attention
              </span>{" "}
              while the page stays calm. As you listen, the reader gently scrolls, keeping the current sentence centered without
              snapping.
              <span className="rounded px-1 ml-1 bg-accent-muted/35 dark:bg-accent-muted-dark/35">
                Up next: a subtle preview.
              </span>
            </div>
          </div>

          <div className="border-l border-border dark:border-border-dark bg-zinc-50/60 dark:bg-zinc-950/30 p-8 sm:p-10">
            <div className="text-xs font-semibold tracking-wide uppercase text-content-secondary dark:text-content-secondary-dark">
              How it feels
            </div>
            <div className="mt-4 space-y-3 text-sm text-content-secondary dark:text-content-secondary-dark leading-relaxed">
              <div>• No clutter. Controls are always there, never loud.</div>
              <div>• Tap a sentence to jump. Keep listening immediately.</div>
              <div>• Adjust voice and speed without breaking rhythm.</div>
            </div>
          </div>
        </div>

        <div className="border-t border-border dark:border-border-dark">
          <div className="h-10 bg-zinc-100/70 dark:bg-zinc-900/45" />
          <div className="px-7 py-5 flex items-center justify-between">
            <div className="text-xs text-content-secondary dark:text-content-secondary-dark">
              1:12 / 4:08
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
              Voice • 1.25×
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

