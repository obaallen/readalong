/**
 * Resolve click (offset or element id) → chunk index; chunk index → DOM element id.
 * Algorithm: binary search by offset for chunk index; element id is chunk-{chunk.id}.
 */

import type { Chunk } from "./document-model.js";

export function offsetToChunkIndex(offset: number, chunks: Chunk[]): number {
  if (chunks.length === 0) return 0;
  if (offset <= 0) return 0;
  for (let i = 0; i < chunks.length; i++) {
    if (offset >= chunks[i]!.startOffset && offset < chunks[i]!.endOffset) return i;
    if (offset < chunks[i]!.startOffset) return i > 0 ? i - 1 : 0;
  }
  return chunks.length - 1;
}

export function chunkIndexToElementId(chunkIndex: number, chunks: Chunk[]): string | null {
  const chunk = chunks[chunkIndex];
  return chunk ? `chunk-${chunk.id}` : null;
}

export function elementIdToChunkIndex(elementId: string, chunks: Chunk[]): number {
  const match = elementId.match(/^chunk-(.+)$/);
  if (!match) return 0;
  const id = match[1];
  const idx = chunks.findIndex((c) => c.id === id);
  return idx >= 0 ? idx : 0;
}
