"use client";

import { Play, Pause, SkipBack, SkipForward, Sun, Moon } from "lucide-react";

type Theme = "light" | "dark";

interface PlayerBarProps {
  playing: boolean;
  onPlayPause: () => void;
  onPrev: () => void;
  onNext: () => void;
  voiceId: string;
  onVoiceChange: (value: string) => void;
  speed: number;
  onSpeedChange: (value: number) => void;
  theme: Theme;
  onThemeToggle: () => void;
  hasQueue: boolean;
}

const VOICE_OPTIONS = [
  { value: "af_heart", label: "Heart" },
  { value: "af_bella", label: "Bella" },
  { value: "am_michael", label: "Michael" },
];

const SPEED_OPTIONS = [0.75, 1, 1.25, 1.5, 2];

export function PlayerBar({
  playing,
  onPlayPause,
  onPrev,
  onNext,
  voiceId,
  onVoiceChange,
  speed,
  onSpeedChange,
  theme,
  onThemeToggle,
  hasQueue,
}: PlayerBarProps) {
  return (
    <header
      className="sticky top-0 z-10 border-b border-border dark:border-border-dark bg-white dark:bg-surface-dark px-4 py-3 flex items-center gap-3 flex-wrap shadow-sm"
      role="toolbar"
      aria-label="Playback controls"
    >
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="p-2.5 rounded-lg bg-accent text-white hover:bg-accent-hover dark:bg-accent dark:text-surface-dark dark:hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-surface-dark transition-colors duration-150"
          onClick={onPlayPause}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <Pause className="w-5 h-5" aria-hidden />
          ) : (
            <Play className="w-5 h-5" aria-hidden />
          )}
        </button>
        <button
          type="button"
          className="p-2.5 rounded-lg text-content-primary dark:text-content-primary-dark hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-surface-dark disabled:opacity-50 disabled:pointer-events-none transition-colors duration-150"
          onClick={onPrev}
          disabled={!hasQueue}
          aria-label="Previous sentence"
        >
          <SkipBack className="w-5 h-5" aria-hidden />
        </button>
        <button
          type="button"
          className="p-2.5 rounded-lg text-content-primary dark:text-content-primary-dark hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-surface-dark disabled:opacity-50 disabled:pointer-events-none transition-colors duration-150"
          onClick={onNext}
          disabled={!hasQueue}
          aria-label="Next sentence"
        >
          <SkipForward className="w-5 h-5" aria-hidden />
        </button>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <label className="text-sm text-content-secondary dark:text-content-secondary-dark sr-only sm:not-sr-only sm:inline">
          Voice
        </label>
        <select
          className="border border-border dark:border-border-dark rounded-lg px-3 py-2 bg-white dark:bg-zinc-800 text-content-primary dark:text-content-primary-dark text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          value={voiceId}
          onChange={(e) => onVoiceChange(e.target.value)}
          aria-label="Voice"
        >
          {VOICE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <label className="text-sm text-content-secondary dark:text-content-secondary-dark sr-only sm:not-sr-only sm:inline">
          Speed
        </label>
        <select
          className="border border-border dark:border-border-dark rounded-lg px-3 py-2 bg-white dark:bg-zinc-800 text-content-primary dark:text-content-primary-dark text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          value={String(speed)}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          aria-label="Speed"
        >
          {SPEED_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}×
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        className="ml-auto p-2.5 rounded-lg text-content-secondary dark:text-content-secondary-dark hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-surface-dark transition-colors duration-150"
        onClick={onThemeToggle}
        aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      >
        {theme === "dark" ? (
          <Sun className="w-5 h-5" aria-hidden />
        ) : (
          <Moon className="w-5 h-5" aria-hidden />
        )}
      </button>
    </header>
  );
}
