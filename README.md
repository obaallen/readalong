# ReadAlong

Browser-first text-to-speech reading app. Paste text, upload PDFs, or read the current page with the Chrome extension. One shared reading engine; local TTS (Kokoro.js primary, Web Speech fallback).

## Setup

```bash
pnpm install
pnpm build
```

## Run

- **Web app**: `pnpm --filter web dev` — then open http://localhost:3000  
  - Paste text or upload a PDF. Use Play/Pause, Prev/Next sentence, speed, voice. Click any phrase to start from there. Dark mode toggle in the toolbar.
- **Extension**: Load the extension in Chrome: open `chrome://extensions`, enable “Developer mode”, click “Load unpacked”, select the `apps/extension` folder. Click the ReadAlong icon and “Read this page” to open the overlay reader on the current tab.

The web app uses the browser’s Speech Synthesis as the TTS provider so the bundle builds without Node-only dependencies. Kokoro can be wired once the app uses the browser build (`kokoro.web.js`) via a dynamic loader.

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for document model, chunking, highlight sync, TTS provider abstraction, and extension design.

## Monorepo

- `apps/web` — Next.js 15 App Router (paste, PDF upload, reader with highlight and auto-scroll)
- `apps/extension` — Chrome MV3 (popup + injectable content script, overlay reader)
- `packages/reader-core` — document model, segmentation, chunking, queue, scroll, store, persistence, OCR stub
- `packages/tts-core` — TTS provider interface, Kokoro (loader-based), browser fallback
- `packages/ui` — shared UI (Tailwind, React)

## Tests

- `pnpm --filter @readalong/reader-core test` — segmenter, chunker, mapping, playback-queue, reader-store
- `pnpm --filter @readalong/tts-core test` — provider interface and implementations
# readalong
