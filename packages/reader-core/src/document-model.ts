/**
 * Canonical text model: used by playback, offsets, and chunking only.
 * No rendering; each surface builds its own render mapping from this.
 */

export interface Document {
  id: string;
  blocks: Block[];
  fullText: string;
}

export interface Block {
  id: string;
  paragraphs: Paragraph[];
  startOffset: number;
  endOffset: number;
}

export interface Paragraph {
  id: string;
  sentences: Sentence[];
  startOffset: number;
  endOffset: number;
}

export interface Sentence {
  id: string;
  text: string;
  startOffset: number;
  endOffset: number;
}

export interface Chunk {
  id: string;
  text: string;
  startOffset: number;
  endOffset: number;
  sentenceIndex: number;
  paragraphIndex: number;
  blockIndex: number;
}

let docIdCounter = 0;
let blockIdCounter = 0;
let paragraphIdCounter = 0;
let sentenceIdCounter = 0;

export function createDocumentFromText(text: string, existingId?: string): Document {
  const id = existingId ?? `doc-${++docIdCounter}`;
  const blockId = `block-${++blockIdCounter}`;
  const block: Block = {
    id: blockId,
    paragraphs: [],
    startOffset: 0,
    endOffset: text.length,
  };
  return {
    id,
    fullText: text,
    blocks: [block],
  };
}

export function createBlock(): Block {
  return {
    id: `block-${++blockIdCounter}`,
    paragraphs: [],
    startOffset: 0,
    endOffset: 0,
  };
}

export function createParagraph(start: number, end: number): Paragraph {
  return {
    id: `p-${++paragraphIdCounter}`,
    sentences: [],
    startOffset: start,
    endOffset: end,
  };
}

export function createSentence(text: string, start: number, end: number): Sentence {
  return {
    id: `s-${++sentenceIdCounter}`,
    text,
    startOffset: start,
    endOffset: end,
  };
}

/**
 * Build a document from per-page text (e.g. from PDF). One block per page; paragraphs/sentences
 * segmented within each page. Used for page-faithful and reflow views.
 */
export function buildDocumentFromPageTexts(
  pageTexts: string[],
  docId?: string
): Document {
  const id = docId ?? `doc-${++docIdCounter}`;
  const fullText = pageTexts.join("\n\n");
  const blocks: Block[] = [];
  let offset = 0;
  for (let p = 0; p < pageTexts.length; p++) {
    const pageText = pageTexts[p]!;
    const block: Block = {
      id: `block-${p}`,
      paragraphs: [],
      startOffset: offset,
      endOffset: offset + pageText.length,
    };
    const para = createParagraph(offset, offset + pageText.length);
    const SENTENCE_END = /[.!?]+(\s+|$)/g;
    let lastEnd = 0;
    let m: RegExpExecArray | null;
    while ((m = SENTENCE_END.exec(pageText)) !== null) {
      const end = m.index + m[0].length;
      const text = pageText.slice(lastEnd, end).trim();
      if (text.length > 0) {
        para.sentences.push(createSentence(text, offset + lastEnd, offset + end));
      }
      lastEnd = end;
    }
    const remainder = pageText.slice(lastEnd).trim();
    if (remainder.length > 0) {
      para.sentences.push(createSentence(remainder, offset + lastEnd, offset + pageText.length));
    }
    if (para.sentences.length === 0 && pageText.trim().length > 0) {
      para.sentences.push(createSentence(pageText.trim(), offset, offset + pageText.length));
    }
    block.paragraphs.push(para);
    blocks.push(block);
    offset += pageText.length + 2;
  }
  return { id, fullText, blocks };
}
