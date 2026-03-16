import { describe, it, expect } from "vitest";
import { createDocumentFromText } from "./document-model.js";
import { segmentDocument } from "./segmenter.js";

describe("segmenter", () => {
  it("splits paragraphs by double newline", () => {
    const doc = createDocumentFromText("First paragraph.\n\nSecond paragraph.");
    const out = segmentDocument(doc);
    expect(out.blocks).toHaveLength(2);
    expect(out.blocks[0]!.paragraphs[0]!.sentences[0]!.text).toBe("First paragraph.");
    expect(out.blocks[1]!.paragraphs[0]!.sentences[0]!.text).toBe("Second paragraph.");
  });

  it("splits sentences by . ! ?", () => {
    const doc = createDocumentFromText("Hello world. How are you? Fine!");
    const out = segmentDocument(doc);
    expect(out.blocks).toHaveLength(1);
    const s = out.blocks[0]!.paragraphs[0]!.sentences;
    expect(s).toHaveLength(3);
    expect(s[0]!.text.trim()).toMatch(/Hello world/);
    expect(s[1]!.text.trim()).toMatch(/How are you/);
    expect(s[2]!.text.trim()).toMatch(/Fine/);
  });

  it("preserves offsets", () => {
    const text = "One. Two.";
    const doc = createDocumentFromText(text);
    const out = segmentDocument(doc);
    const s = out.blocks[0]!.paragraphs[0]!.sentences;
    expect(s[0]!.startOffset).toBe(0);
    expect(s[0]!.endOffset).toBeGreaterThan(0);
    expect(s[1]!.startOffset).toBeGreaterThanOrEqual(s[0]!.endOffset);
    expect(s[1]!.endOffset).toBe(text.length);
  });

  it("handles empty text", () => {
    const doc = createDocumentFromText("");
    const out = segmentDocument(doc);
    expect(out.blocks).toHaveLength(1);
    expect(out.blocks[0]!.paragraphs).toHaveLength(0);
  });
});
