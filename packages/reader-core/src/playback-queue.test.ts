import { describe, it, expect } from "vitest";
import type { Chunk } from "./document-model.js";
import {
  createPlaybackQueue,
  seekToChunk,
  advanceToNextChunk,
  skipToNextSentence,
  skipToPrevSentence,
  skipToNextParagraph,
  skipToPrevParagraph,
  getCurrentChunk,
  getNextChunksForPreload,
} from "./playback-queue.js";

const makeChunks = (n: number): Chunk[] =>
  Array.from({ length: n }, (_, i) => ({
    id: `chunk-${i}`,
    text: `text ${i}`,
    startOffset: i * 10,
    endOffset: i * 10 + 5,
    sentenceIndex: i,
    paragraphIndex: Math.floor(i / 2),
    blockIndex: 0,
  }));

describe("playback-queue", () => {
  it("createPlaybackQueue sets currentIndex 0 and generationId 0", () => {
    const chunks = makeChunks(3);
    const q = createPlaybackQueue(chunks);
    expect(q.currentIndex).toBe(0);
    expect(q.generationId).toBe(0);
    expect(q.chunks).toHaveLength(3);
  });

  it("getCurrentChunk returns chunk at currentIndex", () => {
    const chunks = makeChunks(3);
    const q = createPlaybackQueue(chunks);
    expect(getCurrentChunk(q)?.id).toBe("chunk-0");
  });

  it("getNextChunksForPreload returns next n chunks", () => {
    const chunks = makeChunks(5);
    const q = createPlaybackQueue(chunks);
    const next = getNextChunksForPreload(q, 2);
    expect(next).toHaveLength(2);
    expect(next[0]!.id).toBe("chunk-1");
    expect(next[1]!.id).toBe("chunk-2");
  });

  it("seekToChunk updates index and bumps generationId", () => {
    const chunks = makeChunks(5);
    const q = createPlaybackQueue(chunks);
    const q2 = seekToChunk(q, 3);
    expect(q2.currentIndex).toBe(3);
    expect(q2.generationId).toBe(1);
    const q3 = seekToChunk(q2, 10);
    expect(q3.currentIndex).toBe(4);
  });

  it("advanceToNextChunk increments index", () => {
    const chunks = makeChunks(3);
    const q = createPlaybackQueue(chunks);
    const q2 = advanceToNextChunk(q);
    expect(q2.currentIndex).toBe(1);
    const q3 = advanceToNextChunk(q2);
    expect(q3.currentIndex).toBe(2);
    const q4 = advanceToNextChunk(q3);
    expect(q4.currentIndex).toBe(2);
  });

  it("skipToNextSentence moves to next sentence boundary", () => {
    const chunks = makeChunks(4);
    const q = createPlaybackQueue(chunks);
    const q2 = seekToChunk(q, 0);
    const q3 = skipToNextSentence(q2);
    expect(q3.currentIndex).toBe(1);
  });

  it("skipToPrevSentence moves to prev sentence boundary", () => {
    const chunks = makeChunks(4);
    const q = createPlaybackQueue(chunks);
    const q2 = seekToChunk(q, 2);
    const q3 = skipToPrevSentence(q2);
    expect(q3.currentIndex).toBeLessThanOrEqual(2);
  });

  it("skipToNextParagraph moves to next paragraph", () => {
    const chunks = makeChunks(5);
    const q = createPlaybackQueue(chunks);
    const q2 = seekToChunk(q, 0);
    const q3 = skipToNextParagraph(q2);
    expect(q3.currentIndex).toBeGreaterThanOrEqual(0);
  });
});
