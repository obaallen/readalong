/**
 * Ordered list of chunks; current index; play/pause/seek/skip sentence/paragraph.
 * Emits "current chunk" and "next N for preload". On seek, bump generation ID so
 * in-flight synthesis and playback can be invalidated (no overlapping audio).
 */

import type { Chunk } from "./document-model.js";

export const PRELOAD_CHUNK_COUNT = 3;

export interface PlaybackQueueState {
  chunks: Chunk[];
  currentIndex: number;
  generationId: number;
}

export function createPlaybackQueue(chunks: Chunk[]): PlaybackQueueState {
  return { chunks, currentIndex: 0, generationId: 0 };
}

export function getCurrentChunk(state: PlaybackQueueState): Chunk | null {
  const c = state.chunks[state.currentIndex];
  return c ?? null;
}

export function getNextChunksForPreload(
  state: PlaybackQueueState,
  n: number = PRELOAD_CHUNK_COUNT
): Chunk[] {
  const start = state.currentIndex + 1;
  return state.chunks.slice(start, start + n);
}

export function seekToChunk(state: PlaybackQueueState, index: number): PlaybackQueueState {
  const clamped = Math.max(0, Math.min(index, state.chunks.length - 1));
  return {
    ...state,
    currentIndex: clamped,
    generationId: state.generationId + 1,
  };
}

export function advanceToNextChunk(state: PlaybackQueueState): PlaybackQueueState {
  if (state.currentIndex >= state.chunks.length - 1) return state;
  return { ...state, currentIndex: state.currentIndex + 1 };
}

function findNextSentenceBoundary(chunks: Chunk[], fromIndex: number): number {
  if (fromIndex >= chunks.length - 1) return chunks.length - 1;
  const current = chunks[fromIndex]!;
  for (let i = fromIndex + 1; i < chunks.length; i++) {
    const c = chunks[i]!;
    if (c.sentenceIndex !== current.sentenceIndex || c.paragraphIndex !== current.paragraphIndex) return i;
  }
  return chunks.length - 1;
}

function findPrevSentenceBoundary(chunks: Chunk[], fromIndex: number): number {
  if (fromIndex <= 0) return 0;
  const current = chunks[fromIndex]!;
  for (let i = fromIndex - 1; i >= 0; i--) {
    const c = chunks[i]!;
    if (c.sentenceIndex !== current.sentenceIndex || c.paragraphIndex !== current.paragraphIndex) return i;
  }
  return 0;
}

function findNextParagraphBoundary(chunks: Chunk[], fromIndex: number): number {
  if (fromIndex >= chunks.length - 1) return chunks.length - 1;
  const current = chunks[fromIndex]!;
  for (let i = fromIndex + 1; i < chunks.length; i++) {
    if (chunks[i]!.paragraphIndex !== current.paragraphIndex) return i;
  }
  return chunks.length - 1;
}

function findPrevParagraphBoundary(chunks: Chunk[], fromIndex: number): number {
  if (fromIndex <= 0) return 0;
  const current = chunks[fromIndex]!;
  for (let i = fromIndex - 1; i >= 0; i--) {
    if (chunks[i]!.paragraphIndex !== current.paragraphIndex) return i;
  }
  return 0;
}

export function skipToNextSentence(state: PlaybackQueueState): PlaybackQueueState {
  const next = findNextSentenceBoundary(state.chunks, state.currentIndex);
  return seekToChunk(state, next);
}

export function skipToPrevSentence(state: PlaybackQueueState): PlaybackQueueState {
  const prev = findPrevSentenceBoundary(state.chunks, state.currentIndex);
  return seekToChunk(state, prev);
}

export function skipToNextParagraph(state: PlaybackQueueState): PlaybackQueueState {
  const next = findNextParagraphBoundary(state.chunks, state.currentIndex);
  return seekToChunk(state, next);
}

export function skipToPrevParagraph(state: PlaybackQueueState): PlaybackQueueState {
  const prev = findPrevParagraphBoundary(state.chunks, state.currentIndex);
  return seekToChunk(state, prev);
}
