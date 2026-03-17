"use client";

import { Loader2 } from "lucide-react";

export function Onboarding({
  ttsReady,
  ttsLoading,
  ttsError,
  pdfLoading,
  pdfWarning,
  inputText,
  onInputChange,
  onRead,
  onPdfUpload,
  onTrySample,
  focusPasteSignal,
}: {
  ttsReady: boolean;
  ttsLoading: boolean;
  ttsError: string | null;
  pdfLoading: boolean;
  pdfWarning: string | null;
  inputText: string;
  onInputChange: (v: string) => void;
  onRead: () => void;
  onPdfUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTrySample: () => void;
  focusPasteSignal: number;
}) {
  return (
    <div className="relative min-h-screen pb-20">
      <div className="mx-auto max-w-[1100px] px-10 py-14">
        <div className="max-w-[720px]">
          <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-[-0.03em] leading-[1.02]">
            Listening-first reading.
          </h1>
          <p className="mt-4 text-lg text-content-secondary dark:text-content-secondary-dark leading-relaxed">
            ReadAlong turns anything into a calm, guided listening experience — with a centered reader,
            smart highlighting, and simple controls.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 items-start">
          <div className="rounded-3xl border border-border dark:border-border-dark bg-white dark:bg-zinc-900/60 shadow-[0_10px_40px_rgba(0,0,0,0.06)] p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold">Paste text</div>
                <div className="mt-1 text-sm text-content-secondary dark:text-content-secondary-dark">
                  Drop any text here to start listening with highlight.
                </div>
              </div>
              {ttsLoading && (
                <div className="flex items-center gap-2 text-sm text-content-secondary dark:text-content-secondary-dark">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Loading voices…
                </div>
              )}
            </div>

            {ttsError && (
              <div className="mt-4 rounded-2xl bg-red-100 dark:bg-red-900/30 px-4 py-3 text-sm text-red-800 dark:text-red-200">
                TTS: {ttsError}
              </div>
            )}

            {pdfWarning && (
              <div className="mt-4 rounded-2xl bg-amber-100/80 dark:bg-amber-900/25 px-4 py-3 text-sm text-amber-900 dark:text-amber-200">
                {pdfWarning}
              </div>
            )}

            <textarea
              key={focusPasteSignal}
              autoFocus
              className="mt-5 w-full min-h-[220px] resize-y rounded-2xl border border-border dark:border-border-dark bg-zinc-50 dark:bg-zinc-950/50 px-4 py-4 text-base leading-relaxed placeholder:text-content-secondary dark:placeholder:text-content-secondary-dark focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="Paste your text here…"
              value={inputText}
              onChange={(e) => onInputChange(e.target.value)}
              disabled={!ttsReady}
            />

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onRead}
                disabled={!ttsReady || !inputText.trim()}
                className="px-5 py-3 rounded-2xl bg-accent text-white dark:text-surface-dark hover:bg-accent-hover disabled:opacity-50 shadow-sm font-semibold"
              >
                Start reading
              </button>

              <label className="px-5 py-3 rounded-2xl border border-border dark:border-border-dark bg-white dark:bg-zinc-950/30 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 cursor-pointer shadow-sm font-semibold">
                {pdfLoading ? "Loading PDF…" : "Upload PDF"}
                <input
                  type="file"
                  accept=".pdf"
                  className="sr-only"
                  onChange={onPdfUpload}
                  disabled={!ttsReady || pdfLoading}
                />
              </label>

              <button
                type="button"
                onClick={onTrySample}
                disabled={!ttsReady}
                className="px-5 py-3 rounded-2xl border border-border dark:border-border-dark bg-gradient-to-br from-accent/15 to-transparent hover:from-accent/20 shadow-sm font-semibold disabled:opacity-50"
              >
                Try sample
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-border dark:border-border-dark bg-white dark:bg-zinc-900/50 shadow-sm p-6 sm:p-8">
            <div className="text-sm font-semibold">What you get</div>
            <ul className="mt-4 space-y-3 text-sm text-content-secondary dark:text-content-secondary-dark leading-relaxed">
              <li>Centered reader canvas with premium spacing.</li>
              <li>Visible “now reading” highlight + subtle upcoming preview.</li>
              <li>Persistent bottom player with speed, voice, and progress.</li>
              <li>Click-to-seek anywhere in the text.</li>
            </ul>
            <div className="mt-6 rounded-2xl border border-border dark:border-border-dark bg-zinc-50 dark:bg-zinc-950/40 p-4 text-xs text-content-secondary dark:text-content-secondary-dark">
              Designed for daily use: calm palette, low friction, and focus on listening.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

