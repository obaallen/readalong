import { describe, it, expect } from "vitest";
import type { Chunk } from "./document-model.js";
import { offsetToChunkIndex, chunkIndexToElementId, elementIdToChunkIndex } from "./mapping.js";

describe("mapping", () => {
  const chunks: Chunk[] = [
    { id: "c1", text: "One", startOffset: 0, endOffset: 3, sentenceIndex: 0, paragraphIndex: 0, blockIndex: 0 },
    { id: "c2", text: "Two", startOffset: 4, endOffset: 7, sentenceIndex: 1, paragraphIndex: 0, blockIndex: 0 },
    { id: "c3", text: "Three", startOffset: 8, endOffset: 13, sentenceIndex: 2, paragraphIndex: 0, blockIndex: 0 },
  ];

  it("maps offset to chunk index", () => {
    expect(offsetToChunkIndex(0, chunks)).toBe(0);
    expect(offsetToChunkIndex(2, chunks)).toBe(0);
    expect(offsetToChunkIndex(4, chunks)).toBe(1);
    expect(offsetToChunkIndex(10, chunks)).toBe(2);
    expect(offsetToChunkIndex(100, chunks)).toBe(2);
  });

  it("returns 0 for empty chunks", () => {
    expect(offsetToChunkIndex(5, [])).toBe(0);
  });

  it("maps chunk index to element id", () => {
    expect(chunkIndexToElementId(0, chunks)).toBe("chunk-c1");
    expect(chunkIndexToElementId(2, chunks)).toBe("chunk-c3");
    expect(chunkIndexToElementId(5, chunks)).toBeNull();
  });

  it("maps element id to chunk index", () => {
    expect(elementIdToChunkIndex("chunk-c1", chunks)).toBe(0);
    expect(elementIdToChunkIndex("chunk-c3", chunks)).toBe(2);
    expect(elementIdToChunkIndex("chunk-unknown", chunks)).toBe(0);
    expect(elementIdToChunkIndex("other", chunks)).toBe(0);
  });
});
