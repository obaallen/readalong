/**
 * Sentences → TTS chunks. One chunk per sentence by default; split long sentences
 * (over MAX_CHUNK_CHARS) into sub-chunks. Target ~3–6 s duration; stable IDs and offsets.
 */

import type { Document, Chunk, Sentence } from "./document-model.js";

export const MAX_CHUNK_CHARS = 250;
export const MAX_CHUNK_TOKENS_APPROX = 50;

let chunkIdCounter = 0;

function nextChunkId(): string {
  return `chunk-${++chunkIdCounter}`;
}

function splitLongSentence(
  sentence: Sentence,
  blockIndex: number,
  paragraphIndex: number,
  sentenceIndex: number
): Chunk[] {
  const text = sentence.text;
  if (text.length <= MAX_CHUNK_CHARS) {
    return [
      {
        id: nextChunkId(),
        text,
        startOffset: sentence.startOffset,
        endOffset: sentence.endOffset,
        sentenceIndex,
        paragraphIndex,
        blockIndex,
      },
    ];
  }
  const chunks: Chunk[] = [];
  let start = 0;
  const base = sentence.startOffset;
  while (start < text.length) {
    let end = Math.min(start + MAX_CHUNK_CHARS, text.length);
    if (end < text.length) {
      const lastSpace = text.lastIndexOf(" ", end);
      if (lastSpace > start) end = lastSpace;
    }
    const slice = text.slice(start, end).trim();
    if (slice.length > 0) {
      const sliceStart = text.indexOf(slice, start);
      const sliceEnd = sliceStart + slice.length;
      chunks.push({
        id: nextChunkId(),
        text: slice,
        startOffset: base + sliceStart,
        endOffset: base + sliceEnd,
        sentenceIndex,
        paragraphIndex,
        blockIndex,
      });
      start = sliceEnd;
    } else {
      start = end;
    }
  }
  return chunks;
}

export function chunkDocument(doc: Document): Chunk[] {
  const chunks: Chunk[] = [];
  doc.blocks.forEach((block, blockIndex) => {
    block.paragraphs.forEach((paragraph, paragraphIndex) => {
      paragraph.sentences.forEach((sentence, sentenceIndex) => {
        chunks.push(
          ...splitLongSentence(sentence, blockIndex, paragraphIndex, sentenceIndex)
        );
      });
    });
  });
  return chunks;
}
