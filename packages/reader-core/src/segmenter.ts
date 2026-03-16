/**
 * Paragraph and sentence segmentation. Fills document blocks with paragraphs and sentences.
 * Paragraphs: split by double newline or more.
 * Sentences: split by . ! ? followed by space or end of string.
 */

import type { Document, Block, Sentence } from "./document-model.js";
import { createParagraph, createSentence } from "./document-model.js";

const PARAGRAPH_SPLIT = /\n\s*\n/;
const SENTENCE_END = /[.!?]+(\s+|$)/g;

function segmentParagraphText(paragraphText: string, baseOffset: number): Sentence[] {
  const sentences: Sentence[] = [];
  const re = new RegExp(SENTENCE_END.source, "g");
  let lastEnd = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(paragraphText)) !== null) {
    const end = m.index + m[0].length;
    const text = paragraphText.slice(lastEnd, end).trim();
    if (text.length > 0) {
      sentences.push(createSentence(text, baseOffset + lastEnd, baseOffset + end));
    }
    lastEnd = end;
  }
  const remainder = paragraphText.slice(lastEnd).trim();
  if (remainder.length > 0) {
    sentences.push(createSentence(remainder, baseOffset + lastEnd, baseOffset + paragraphText.length));
  }
  if (sentences.length === 0 && paragraphText.trim().length > 0) {
    const t = paragraphText.trim();
    sentences.push(createSentence(t, baseOffset, baseOffset + paragraphText.length));
  }
  return sentences;
}

export function segmentDocument(doc: Document): Document {
  const fullText = doc.fullText;
  if (!fullText.trim()) return doc;

  const rawParts = fullText.split(PARAGRAPH_SPLIT);
  let searchFrom = 0;
  const blocks: Block[] = [];

  for (const part of rawParts) {
    const startOffset = fullText.indexOf(part, searchFrom);
    if (startOffset === -1) {
      searchFrom = fullText.length;
      continue;
    }
    const endOffset = startOffset + part.length;
    searchFrom = endOffset;

    const trimmed = part.trim();
    if (trimmed.length === 0) continue;

    const paragraph = createParagraph(startOffset, endOffset);
    paragraph.sentences = segmentParagraphText(part, startOffset);
    if (paragraph.sentences.length === 0) {
      paragraph.sentences.push(createSentence(trimmed, startOffset, endOffset));
    }

    blocks.push({
      id: `block-${blocks.length}`,
      paragraphs: [paragraph],
      startOffset: paragraph.startOffset,
      endOffset: paragraph.endOffset,
    });
  }

  if (blocks.length === 0) {
    const p = createParagraph(0, fullText.length);
    p.sentences = segmentParagraphText(fullText, 0);
    if (p.sentences.length === 0) {
      p.sentences.push(createSentence(fullText.trim(), 0, fullText.length));
    }
    return { ...doc, blocks: [{ id: "block-0", paragraphs: [p], startOffset: 0, endOffset: fullText.length }] };
  }

  return { ...doc, blocks };
}
