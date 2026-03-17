"use client";

import { FileUp, Moon, Sparkles, Sun, Type } from "lucide-react";

export function LibraryRail({
  onPaste,
  onUploadClick,
  onTrySample,
  uploading,
  theme,
  onThemeToggle,
}: {
  onPaste: () => void;
  onUploadClick: () => void;
  onTrySample: () => void;
  uploading: boolean;
  theme: "light" | "dark";
  onThemeToggle: () => void;
}) {
  return (
    <div className="h-full px-5 py-6 flex flex-col gap-6">
      <div>
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs font-semibold tracking-wide text-content-secondary dark:text-content-secondary-dark uppercase">
            Library
          </div>
          <button
            type="button"
            onClick={onThemeToggle}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            className="rounded-xl border border-border dark:border-border-dark bg-white/70 dark:bg-zinc-950/40 px-2.5 py-2 hover:shadow-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" aria-hidden />
            ) : (
              <Moon className="h-4 w-4" aria-hidden />
            )}
          </button>
        </div>
        <div className="mt-2 text-sm text-content-secondary dark:text-content-secondary-dark leading-relaxed">
          Bring in text, upload a PDF, or try a sample to experience the reader.
        </div>
      </div>

      <div className="grid gap-3">
        <button
          type="button"
          onClick={onPaste}
          className="group rounded-2xl border border-border dark:border-border-dark bg-white dark:bg-zinc-900/60 p-4 text-left shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-xl bg-accent-muted dark:bg-accent-muted-dark p-2">
              <Type className="h-5 w-5 text-accent dark:text-accent" aria-hidden />
            </div>
            <div>
              <div className="font-semibold">Paste text</div>
              <div className="mt-1 text-sm text-content-secondary dark:text-content-secondary-dark">
                Start instantly with anything you have copied.
              </div>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={onUploadClick}
          disabled={uploading}
          className="group rounded-2xl border border-border dark:border-border-dark bg-white dark:bg-zinc-900/60 p-4 text-left shadow-sm hover:shadow-md transition-shadow disabled:opacity-60"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-xl bg-accent-muted dark:bg-accent-muted-dark p-2">
              <FileUp className="h-5 w-5 text-accent dark:text-accent" aria-hidden />
            </div>
            <div>
              <div className="font-semibold">Upload PDF</div>
              <div className="mt-1 text-sm text-content-secondary dark:text-content-secondary-dark">
                Extract text and read with highlight.
              </div>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={onTrySample}
          className="group rounded-2xl border border-border dark:border-border-dark bg-gradient-to-br from-accent/10 to-transparent dark:from-accent/15 dark:to-transparent p-4 text-left shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-xl bg-accent text-white dark:text-surface-dark p-2">
              <Sparkles className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <div className="font-semibold">Try sample</div>
              <div className="mt-1 text-sm text-content-secondary dark:text-content-secondary-dark">
                See the full experience in 10 seconds.
              </div>
            </div>
          </div>
        </button>
      </div>

      <div className="mt-auto text-xs text-content-secondary dark:text-content-secondary-dark">
        Tip: click any highlighted sentence to jump playback.
      </div>
    </div>
  );
}

