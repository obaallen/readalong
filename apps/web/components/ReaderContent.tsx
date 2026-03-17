"use client";

import { forwardRef } from "react";
import type { Chunk } from "@readalong/reader-core";

type Theme = "light" | "dark";

interface ReaderContentProps {
  chunks: Chunk[];
  currentIndex: number;
  onSeek: (index: number) => void;
  theme: Theme;
  currentChunkRef: (el: HTMLElement | null) => void;
}

function ChunkSpan({
  chunk,
  isCurrent,
  isNext,
  theme,
  onSeek,
  index,
  isLast,
  setRef,
}: {
  chunk: Chunk;
  isCurrent: boolean;
  isNext: boolean;
  theme: Theme;
  onSeek: (index: number) => void;
  index: number;
  isLast: boolean;
  setRef: (el: HTMLElement | null) => void;
}) {
  const base =
    "cursor-pointer rounded px-0.5 transition-colors duration-150 scroll-mt-16 scroll-mb-8";
  const current =
    theme === "dark"
      ? "bg-accent-muted-dark text-content-primary-dark ring-1 ring-accent/20"
      : "bg-accent-muted text-content-primary ring-1 ring-accent/15";
  const next =
    theme === "dark"
      ? "bg-accent-muted-dark/35 text-content-primary-dark"
      : "bg-accent-muted/35 text-content-primary";
  const default_ =
    theme === "dark"
      ? "hover:bg-zinc-800 text-content-primary-dark"
      : "hover:bg-zinc-100 text-content-primary";

  const className = isCurrent ? `${base} ${current}` : isNext ? `${base} ${next}` : `${base} ${default_}`;

  return (
    <span
      ref={isCurrent ? setRef : undefined}
      data-chunk-id={chunk.id}
      role="button"
      tabIndex={0}
      className={className}
      onClick={() => onSeek(index)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSeek(index);
        }
      }}
    >
      {chunk.text}
      {isLast ? "" : " "}
    </span>
  );
}

export const ReaderContent = forwardRef<HTMLDivElement, ReaderContentProps>(
  function ReaderContent(
    { chunks, currentIndex, onSeek, theme, currentChunkRef },
    ref
  ) {
    return (
      <div
        ref={ref}
        className="flex-1 overflow-auto px-6 sm:px-10 pt-14 pb-28 w-full max-w-reader mx-auto font-reading text-reader-base"
      >
        {chunks.map((chunk, i) => (
          <ChunkSpan
            key={chunk.id}
            chunk={chunk}
            isCurrent={i === currentIndex}
            isNext={i === currentIndex + 1}
            theme={theme}
            onSeek={onSeek}
            index={i}
            isLast={i === chunks.length - 1}
            setRef={i === currentIndex ? currentChunkRef : () => {}}
          />
        ))}
      </div>
    );
  }
);
