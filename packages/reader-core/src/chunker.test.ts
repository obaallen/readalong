import { describe, it, expect } from "vitest";
import { createDocumentFromText } from "./document-model.js";
import { segmentDocument } from "./segmenter.js";
import { chunkDocument, MAX_CHUNK_CHARS } from "./chunker.js";

describe("chunker", () => {
  it("produces one chunk per short sentence", () => {
    const doc = createDocumentFromText("Hello. World.");
    const segmented = segmentDocument(doc);
    const chunks = chunkDocument(segmented);
    expect(chunks.length).toBe(2);
    expect(chunks[0]!.text).toMatch(/Hello/);
    expect(chunks[1]!.text).toMatch(/World/);
  });

  it("assigns stable IDs and offsets", () => {
    const doc = createDocumentFromText("A. B.");
    const segmented = segmentDocument(doc);
    const chunks = chunkDocument(segmented);
    expect(chunks[0]!.id).toBeDefined();
    expect(chunks[0]!.startOffset).toBe(0);
    expect(chunks[0]!.endOffset).toBeGreaterThan(0);
    expect(chunks[1]!.startOffset).toBeGreaterThanOrEqual(chunks[0]!.endOffset);
  });

  it("splits sentences over MAX_CHUNK_CHARS", () => {
    const long = "a".repeat(MAX_CHUNK_CHARS + 50);
    const doc = createDocumentFromText(long);
    const segmented = segmentDocument(doc);
    const chunks = chunkDocument(segmented);
    expect(chunks.length).toBeGreaterThanOrEqual(1);
    chunks.forEach((c) => {
      expect(c.text.length).toBeLessThanOrEqual(MAX_CHUNK_CHARS + 20);
    });
  });

  it("respects max length for long sentence", () => {
    const sentence = "word ".repeat(60).trim();
    const doc = createDocumentFromText(sentence);
    const segmented = segmentDocument(doc);
    const chunks = chunkDocument(segmented);
    expect(chunks.length).toBeGreaterThanOrEqual(1);
    for (const c of chunks) {
      expect(c.text.length).toBeLessThanOrEqual(MAX_CHUNK_CHARS + 50);
    }
  });
});
