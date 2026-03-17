"use client";

import { FileUp, Type, Loader2 } from "lucide-react";

interface EmptyStateProps {
  theme: "light" | "dark";
  inputText: string;
  onInputChange: (value: string) => void;
  onLoad: () => void;
  onPdfUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
  pdfLoading: boolean;
  ttsReady: boolean;
  ttsError: string | null;
}

export function EmptyState({
  theme,
  inputText,
  onInputChange,
  onLoad,
  onPdfUpload,
  loading,
  pdfLoading,
  ttsReady,
  ttsError,
}: EmptyStateProps) {
  const isDark = theme === "dark";

  return (
    <div
      className={
        isDark
          ? "min-h-screen bg-surface-dark text-content-primary-dark"
          : "min-h-screen bg-surface text-content-primary"
      }
    >
      <aside
        className={
          "w-56 border-r border-border dark:border-border-dark p-4 fixed left-0 top-0 h-full " +
          (isDark ? "bg-surface-dark" : "bg-surface")
        }
      >
        <h2 className="font-semibold text-sm text-content-secondary dark:text-content-secondary-dark uppercase tracking-wide mb-3">
          Library
        </h2>
        <p className="text-sm text-content-secondary dark:text-content-secondary-dark">
          Paste text or upload a PDF to start reading.
        </p>
      </aside>
      <main className="ml-56 p-8 max-w-xl">
        <h1 className="text-3xl font-semibold mb-2 tracking-tight">
          Read anything aloud
        </h1>
        <p className="text-content-secondary dark:text-content-secondary-dark mb-6">
          Paste text or upload a PDF. We&apos;ll read it with natural voices and
          highlight as we go.
        </p>

        {loading && (
          <div
            className="flex items-center gap-2 text-accent dark:text-accent mb-4"
            role="status"
            aria-live="polite"
          >
            <Loader2 className="w-5 h-5 animate-spin" aria-hidden />
            <span>Loading TTS…</span>
          </div>
        )}

        {ttsError && (
          <div
            className="mb-4 px-4 py-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 text-sm"
            role="alert"
          >
            TTS: {ttsError}
          </div>
        )}

        {ttsReady && (
          <div
            className={
              "rounded-xl border border-border dark:border-border-dark p-6 " +
              (isDark ? "bg-zinc-800/50" : "bg-white")
            }
          >
            <label
              htmlFor="paste-input"
              className="block text-sm font-medium text-content-secondary dark:text-content-secondary-dark mb-2"
            >
              <Type className="w-4 h-4 inline mr-1.5 -mt-0.5" aria-hidden />
              Paste your text
            </label>
            <textarea
              id="paste-input"
              className="w-full h-40 border border-border dark:border-border-dark rounded-lg p-4 bg-white dark:bg-zinc-900 text-content-primary dark:text-content-primary-dark placeholder:text-content-secondary dark:placeholder:text-content-secondary-dark focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-y min-h-[120px]"
              placeholder="Paste your text here…"
              value={inputText}
              onChange={(e) => onInputChange(e.target.value)}
              aria-describedby="paste-hint"
            />
            <p
              id="paste-hint"
              className="text-xs text-content-secondary dark:text-content-secondary-dark mt-1.5"
            >
              Or upload a PDF below.
            </p>

            <div className="flex flex-wrap gap-3 items-center mt-4">
              <button
                type="button"
                className="px-5 py-2.5 rounded-lg bg-accent text-white hover:bg-accent-hover dark:bg-accent dark:text-surface-dark dark:hover:bg-accent-hover font-medium focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-surface-dark transition-colors duration-150 disabled:opacity-50"
                onClick={onLoad}
                disabled={!inputText.trim()}
              >
                Read
              </button>
              <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border dark:border-border-dark cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-150 focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 dark:focus-within:ring-offset-surface-dark">
                <FileUp className="w-4 h-4 text-content-secondary dark:text-content-secondary-dark" aria-hidden />
                <span className="text-sm font-medium">Upload PDF</span>
                <input
                  type="file"
                  accept=".pdf"
                  className="sr-only"
                  onChange={onPdfUpload}
                  disabled={pdfLoading}
                  aria-label="Upload PDF file"
                />
              </label>
              {pdfLoading && (
                <span className="flex items-center gap-2 text-sm text-accent dark:text-accent" role="status">
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
                  Loading PDF…
                </span>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
