"use client";

import { useMemo, useRef, useState } from "react";
import { Menu, Moon, Pause, Play, SkipBack, SkipForward, Sun } from "lucide-react";

const VOICE_OPTIONS = [
  { value: "af_heart", label: "Heart" },
  { value: "af_bella", label: "Bella" },
  { value: "am_michael", label: "Michael" },
];

const SPEED_OPTIONS = [0.75, 1, 1.25, 1.5, 2];

export function BottomPlayerBar({
  playing,
  hasQueue,
  currentIndex,
  total,
  nowPlayingText,
  elapsedSeconds,
  totalSeconds,
  onPlayPause,
  onPrev,
  onNext,
  onSeekIndex,
  voiceId,
  onVoiceChange,
  speed,
  onSpeedChange,
  theme,
  onThemeToggle,
}: {
  playing: boolean;
  hasQueue: boolean;
  currentIndex: number;
  total: number;
  nowPlayingText: string | null;
  elapsedSeconds: number | null;
  totalSeconds: number | null;
  onPlayPause: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeekIndex: (index: number) => void;
  voiceId: string;
  onVoiceChange: (value: string) => void;
  speed: number;
  onSpeedChange: (value: number) => void;
  theme: "light" | "dark";
  onThemeToggle: () => void;
}) {
  const pct = total > 0 ? Math.min(1, Math.max(0, currentIndex / Math.max(1, total - 1))) : 0;
  const disabled = !hasQueue || total === 0;
  const scrubRef = useRef<HTMLDivElement | null>(null);
  const [hover, setHover] = useState<{ x: number; index: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  const formatTime = (seconds: number | null) => {
    if (seconds == null || !Number.isFinite(seconds)) return "—";
    const s = Math.max(0, Math.round(seconds));
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}:${String(r).padStart(2, "0")}`;
  };

  const hoverTime = useMemo(() => {
    if (!hover || totalSeconds == null || total <= 1) return null;
    const t = (hover.index / (total - 1)) * totalSeconds;
    return t;
  }, [hover, totalSeconds, total]);

  const updateHover = (clientX: number) => {
    const el = scrubRef.current;
    if (!el || total <= 1) return;
    const r = el.getBoundingClientRect();
    const x = Math.min(r.right, Math.max(r.left, clientX));
    const p = (x - r.left) / Math.max(1, r.width);
    const idx = Math.round(p * (total - 1));
    setHover({ x: x - r.left, index: idx });
  };

  return (
    <div className="border-t border-border dark:border-border-dark bg-white/85 dark:bg-zinc-950/70 backdrop-blur supports-[backdrop-filter]:bg-white/70 supports-[backdrop-filter]:dark:bg-zinc-950/55">
      <div
        ref={scrubRef}
        className="relative select-none"
        onPointerMove={(e) => updateHover(e.clientX)}
        onPointerEnter={(e) => updateHover(e.clientX)}
        onPointerLeave={() => {
          if (!dragging) setHover(null);
        }}
        onPointerDown={(e) => {
          if (disabled) return;
          setDragging(true);
          (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
          updateHover(e.clientX);
        }}
        onPointerUp={() => {
          if (disabled) return;
          if (hover) onSeekIndex(hover.index);
          setDragging(false);
          setHover(null);
        }}
      >
        <div
          className="h-10 w-full bg-zinc-100/70 dark:bg-zinc-900/50"
          aria-hidden
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(13,148,136,0.18), rgba(13,148,136,0.18) 2px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 7px)",
          }}
        />
        <div className="absolute inset-x-0 top-0 h-10 pointer-events-none">
          <div
            className="h-full bg-accent/10 dark:bg-accent/15"
            style={{ width: `${pct * 100}%` }}
          />
        </div>

        {hover && !disabled && (
          <div
            className="pointer-events-none absolute top-1.5 -translate-x-1/2"
            style={{ left: hover.x }}
          >
            <div className="rounded-xl border border-border dark:border-border-dark bg-white/90 dark:bg-zinc-950/80 backdrop-blur px-2.5 py-1 text-[11px] text-content-secondary dark:text-content-secondary-dark shadow-sm">
              {formatTime(hoverTime)} • {hover.index + 1}/{total}
            </div>
          </div>
        )}

        <div
          className="pointer-events-none absolute top-0 h-10 w-[2px] bg-accent/60"
          style={{ left: `${pct * 100}%` }}
          aria-hidden
        />

        {/* Keyboard-accessible range input (styled thumb). */}
        <input
          type="range"
          min={0}
          max={Math.max(0, total - 1)}
          value={Math.min(Math.max(0, currentIndex), Math.max(0, total - 1))}
          onChange={(e) => onSeekIndex(Number(e.target.value))}
          disabled={disabled}
          aria-label="Progress"
          className="ra-scrub absolute inset-x-0 top-0 w-full cursor-pointer disabled:cursor-default"
        />

        <div className="absolute inset-x-0 top-0 h-[2px] bg-zinc-200/80 dark:bg-zinc-800/80" aria-hidden />
        <div
          className="absolute left-0 top-0 h-[2px] bg-accent"
          style={{ width: `${pct * 100}%` }}
          aria-hidden
        />
      </div>

      <div className="max-w-[1100px] mx-auto px-4 py-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="lg:hidden p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-surface-dark"
            aria-label="Open library"
            onClick={() => {
              // Mobile rail is toggled via AppShell button; this is just a visual affordance.
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <Menu className="h-5 w-5" aria-hidden />
          </button>

          <button
            type="button"
            onClick={onPrev}
            disabled={disabled}
            aria-label="Previous sentence"
            className="p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-surface-dark disabled:opacity-50"
          >
            <SkipBack className="h-5 w-5" aria-hidden />
          </button>

          <button
            type="button"
            onClick={onPlayPause}
            disabled={disabled}
            aria-label={playing ? "Pause" : "Play"}
            className="p-3 rounded-2xl bg-accent text-white dark:text-surface-dark hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-surface-dark disabled:opacity-50 shadow-sm"
          >
            {playing ? <Pause className="h-5 w-5" aria-hidden /> : <Play className="h-5 w-5" aria-hidden />}
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={disabled}
            aria-label="Next sentence"
            className="p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-surface-dark disabled:opacity-50"
          >
            <SkipForward className="h-5 w-5" aria-hidden />
          </button>

          <div className="ml-1 text-xs text-content-secondary dark:text-content-secondary-dark tabular-nums flex items-center gap-2">
            <span>
              {total > 0 ? (
                <>
                  {Math.min(total, currentIndex + 1)} / {total}
                </>
              ) : (
                "—"
              )}
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">{formatTime(elapsedSeconds)} / {formatTime(totalSeconds)}</span>
          </div>

          <div className="hidden md:block ml-3 min-w-0 flex-1">
            <div className="truncate text-sm text-content-secondary dark:text-content-secondary-dark">
              {nowPlayingText ? nowPlayingText : "Ready when you are."}
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <select
              className="hidden sm:block border border-border dark:border-border-dark rounded-xl px-3 py-2 bg-white dark:bg-zinc-900/70 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              value={voiceId}
              onChange={(e) => onVoiceChange(e.target.value)}
              aria-label="Voice"
              disabled={disabled}
            >
              {VOICE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <select
              className="border border-border dark:border-border-dark rounded-xl px-2.5 sm:px-3 py-2 bg-white dark:bg-zinc-900/70 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              value={String(speed)}
              onChange={(e) => onSpeedChange(Number(e.target.value))}
              aria-label="Speed"
              disabled={disabled}
            >
              {SPEED_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}×
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={onThemeToggle}
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              className="p-2.5 rounded-xl border border-border dark:border-border-dark bg-white/60 dark:bg-zinc-950/40 hover:shadow-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" aria-hidden />
              ) : (
                <Moon className="h-4 w-4" aria-hidden />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

