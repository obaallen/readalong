# ReadAlong — Technical Architecture

## Overview

ReadAlong is a browser-first text-to-speech reading app. One shared reading engine powers both a Next.js web app and a Chrome MV3 extension. TTS runs locally in the browser: Kokoro.js is the primary path (when bundling is configured to use the browser build); Web Speech API is the fallback. The design allows swapping in premium hosted providers later.

## Chunk limits (numeric guardrails)

- **MAX_CHUNK_CHARS**: 250 (see `packages/reader-core/src/chunker.ts`). Sentences longer than this are split at word boundaries.
- **Target chunk duration**: ~3–6 seconds for responsive playback and crisp highlight transitions.
- **PRELOAD_CHUNK_COUNT**: 3 (see `packages/reader-core/src/playback-queue.ts`).

## Document model

- **Canonical text model**: Normalized structure used by playback, offsets, and chunking only. No rendering. Types: `Document` → `Block` → `Paragraph` → `Sentence`; each node has stable `id`, `startOffset`, `endOffset`. Built from paste, PDF-extracted text, or extension-extracted content.
- **Render model**: Used by each surface (page view, reflow view, overlay). The engine exposes chunk/offset data; each surface builds its own mapping from chunk/offset to DOM (e.g. PDF text layer, reflow divs, overlay spans). Rendering concerns stay out of reader-core.

## Chunking strategy

- **Rules**: Default to one chunk per sentence. Split any sentence over a hard max (e.g. 250 chars or ~50 tokens) into sub-chunks. Target chunk duration ~3–6 seconds for responsive playback and crisp highlight transitions.
- **Constants**: `MAX_CHUNK_CHARS`, `MAX_CHUNK_TOKENS`; document exact values in this file and in code.
- **Mapping**: Exact bi-directional mapping chunk ↔ source offsets ↔ DOM element IDs (e.g. `data-chunk-id` or `id="chunk-{chunk.id}"`).

## Highlight synchronization

- Chunk-level only for MVP. The queue’s “current” chunk drives both highlight and scroll. No word-level timings unless a provider later exposes real timing data.

## TTS provider abstraction

- **Interface**: `initialize()`, `getVoices()`, `synthesizeChunk(text, options)`, `preloadChunks(chunks)`, `cancel()`, `dispose()`.
- **Primary**: Kokoro (local only in MVP). No server TTS in MVP.
- **Fallback**: Browser Speech Synthesis only when Kokoro fails.
- **Future**: Hosted premium provider can implement the same interface without changing reader UX.

## Audio pipeline invariants

1. Only one chunk may be “actively playing” at any time.
2. At most N next chunks (e.g. N=2–3) may be synthesizing or preloaded.
3. On seek, all pending synthesis and in-flight playback must be invalidated via generation ID. No stale audio, no overlapping.
4. Cached audio (IndexedDB) key: `textHash + voice + speed + providerVersion`.

## Queue cancellation

- Every seek bumps a generation ID. In-flight synthesis and playback checks this ID before applying results; stale work is discarded. Document cancellation semantics in code and tests.

## Click-to-seek resolution

- Click yields offset (or element id). `mapping.offsetToChunkIndex(offset, chunks)` returns chunk index. Queue seeks to that index, bumps generation ID, cancels in-flight work, starts playback from the new chunk. Highlight and scroll follow the new “current” chunk.

## Scroll strategy

- Only “current” chunk drives scroll. Given current chunk’s DOM element (or ref), scroll it into view with `block: "center"`. Use requestAnimationFrame or similar to avoid jitter; never block input.

## Extension architecture

- MV3: service worker, popup, content script. Overlay mode is default MVP; “read in place” is experimental.
- Content script: extract content (e.g. Readability), build canonical document, render overlay in Shadow DOM, reuse reader-core and tts-core.

## Performance budgets

- UI interactive before TTS model is ready.
- Model init message visible immediately.
- First chunk playback within acceptable time after play (e.g. &lt; 3–5 s when warm).
- Seek near-immediate when model is warm.
- Scrolling never blocks user input.

## Rationale for key choices

- **Chunk-level sync**: Keeps MVP simple; no fake word timings; sufficient for read-along feel.
- **Kokoro first**: Local, private, good quality for size; Web Speech only as fallback. Web app currently uses browser fallback so the bundle builds without Node-only Kokoro; Kokoro can be wired when the app uses the browser build (`kokoro.web.js`) via dynamic loader.
- **IndexedDB only**: Local-first; no auth/DB/billing in MVP.
- **OCR stub only**: Interface (`IOCRProvider`) for future; no implementation in MVP (see `packages/reader-core/src/ocr-stub.ts`).
- **Text vs render model**: Keeps reader-core free of PDF/DOM details; surfaces own render mapping.
- **Extension overlay-first**: Overlay is default; in-place highlighting is not implemented in MVP.
