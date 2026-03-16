"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createReaderStore, createScrollManager, type Chunk } from "@readalong/reader-core";
import { BrowserSpeechFallbackProvider } from "@readalong/tts-core";

const store = createReaderStore();

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfWarning, setPdfWarning] = useState<string | null>(null);
  const [ttsReady, setTtsReady] = useState(false);
  const [ttsError, setTtsError] = useState<string | null>(null);
  const ttsRef = useRef<BrowserSpeechFallbackProvider | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const generationIdRef = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const currentChunkRef = useRef<HTMLElement | null>(null);
  const scrollManagerRef = useRef(
    createScrollManager(() => currentChunkRef.current && { scrollIntoView: (opts) => currentChunkRef.current!.scrollIntoView(opts) })
  );

  const state = useSyncExternalStore(store.subscribe, () => store.getState(), () => store.getState());
  const document = state.document;
  const chunks = state.chunks;
  const queue = state.queue;
  const playing = state.playing;
  const speed = state.speed;
  const voiceId = state.voiceId;

  const currentIndex = queue?.currentIndex ?? 0;
  const currentChunk = queue ? store.getState().getCurrentChunk() : null;
  const theme = state.theme;

  useEffect(() => {
    scrollManagerRef.current.scrollToCurrent();
  }, [currentIndex]);

  useEffect(() => {
    const provider = new BrowserSpeechFallbackProvider();
    ttsRef.current = provider;
    setLoading(true);
    provider
      .initialize()
      .then(() => {
        setTtsReady(true);
        setTtsError(null);
      })
      .catch((e) => {
        setTtsError(e?.message ?? "Failed to load TTS");
      })
      .finally(() => setLoading(false));
    return () => {
      provider.dispose();
      ttsRef.current = null;
    };
  }, []);

  const playChunk = useCallback(
    async (chunk: Chunk, genId: number) => {
      const tts = ttsRef.current;
      if (!tts || !chunk.text.trim()) return;
      try {
        const audioBlob = await tts.synthesizeChunk(chunk.text, { voice: voiceId, speed });
        if (genId !== generationIdRef.current) return;
        if (!audioBlob || (audioBlob instanceof ArrayBuffer && audioBlob.byteLength === 0)) {
          store.getState().advanceToNextChunk();
          const next = store.getState().getCurrentChunk();
          if (next && store.getState().playing) playChunk(next, genId);
          return;
        }
        const url = URL.createObjectURL(audioBlob instanceof Blob ? audioBlob : new Blob([audioBlob]));
        const audio = audioRef.current || new Audio();
        if (!audioRef.current) audioRef.current = audio;
        audio.src = url;
        audio.playbackRate = speed;
        audio.onended = () => {
          URL.revokeObjectURL(url);
          if (genId !== generationIdRef.current) return;
          store.getState().advanceToNextChunk();
          const next = store.getState().getCurrentChunk();
          if (next && store.getState().playing) playChunk(next, genId);
        };
        audio.onerror = () => {
          URL.revokeObjectURL(url);
          if (genId === generationIdRef.current) store.getState().advanceToNextChunk();
        };
        await audio.play();
      } catch {
        if (genId === generationIdRef.current) store.getState().advanceToNextChunk();
      }
    },
    [voiceId, speed]
  );

  useEffect(() => {
    if (!playing || !currentChunk) return;
    generationIdRef.current = store.getState().getGenerationId();
    playChunk(currentChunk, generationIdRef.current);
  }, [playing, currentIndex]);

  const handleLoad = useCallback(async () => {
    if (!inputText.trim()) return;
    setPdfWarning(null);
    await store.getState().loadDocument(inputText.trim());
  }, [inputText]);

  const handlePdfUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file?.name.toLowerCase().endsWith(".pdf")) return;
    setPdfLoading(true);
    setPdfWarning(null);
    try {
      const { extractTextFromPdfFile } = await import("../lib/pdf");
      const { document, quality } = await extractTextFromPdfFile(file);
      if (quality.warning) setPdfWarning(quality.warning);
      await store.getState().loadDocumentFromDocument(document);
    } catch (err) {
      setPdfWarning(err instanceof Error ? err.message : "Failed to load PDF.");
    } finally {
      setPdfLoading(false);
      e.target.value = "";
    }
  }, []);

  const handleSeek = useCallback((index: number) => {
    ttsRef.current?.cancel();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    store.getState().seekToChunk(index);
    generationIdRef.current = store.getState().getGenerationId();
    store.getState().play();
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const target = e.target as HTMLElement;
      const chunkEl = target.closest("[data-chunk-id]") as HTMLElement | null;
      if (!chunkEl || chunks.length === 0) return;
      const id = chunkEl.getAttribute("data-chunk-id");
      const idx = chunks.findIndex((c) => c.id === id);
      if (idx >= 0) handleSeek(idx);
    },
    [chunks, handleSeek]
  );

  if (!document && !ttsError) {
    return (
      <div className={theme === "dark" ? "dark bg-gray-900 text-gray-100 min-h-screen" : "min-h-screen bg-stone-50"}>
        <aside className="w-56 border-r border-gray-200 dark:border-gray-700 p-4 fixed left-0 top-0 h-full">
          <h2 className="font-semibold text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Library</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">Paste text to start reading.</p>
        </aside>
        <main className="ml-56 p-8 font-sans max-w-xl">
          <h1 className="text-2xl font-semibold mb-2">ReadAlong</h1>
          {loading && <p className="text-amber-600 dark:text-amber-400 mb-2">Loading TTS…</p>}
{ttsReady && (
          <>
            <p className="mb-3 text-gray-600 dark:text-gray-300">Paste text or upload a PDF.</p>
              <textarea
                className="w-full h-40 border border-gray-300 dark:border-gray-600 rounded-lg p-3 mb-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="Paste your text here…"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <div className="flex gap-3 items-center flex-wrap">
                <button
                  type="button"
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  onClick={handleLoad}
                >
                  Read
                </button>
                <label className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
                  <span className="text-sm">Upload PDF</span>
                  <input type="file" accept=".pdf" className="hidden" onChange={handlePdfUpload} disabled={pdfLoading} />
                </label>
                {pdfLoading && <span className="text-sm text-amber-600">Loading PDF…</span>}
              </div>
            </>
          )}
          {ttsError && <p className="text-red-600 dark:text-red-400">TTS: {ttsError}</p>}
        </main>
      </div>
    );
  }

  return (
    <div className={theme === "dark" ? "dark bg-gray-900 text-gray-100 min-h-screen flex" : "min-h-screen bg-stone-50 flex"}>
      <aside className="w-52 shrink-0 border-r border-gray-200 dark:border-gray-700 p-4 flex flex-col">
        <h2 className="font-semibold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Library</h2>
        <button
          type="button"
          className="text-left text-sm text-amber-600 dark:text-amber-400 hover:underline focus:outline-none focus:ring-2 focus:ring-amber-500 rounded"
          onClick={() => store.getState().clearDocument()}
        >
          New document
        </button>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="border-b border-gray-200 dark:border-gray-700 p-3 flex items-center gap-3 flex-wrap bg-white dark:bg-gray-800">
          <button
            type="button"
            className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-800/50 focus:outline-none focus:ring-2 focus:ring-amber-500"
            onClick={() => (playing ? store.getState().pause() : store.getState().play())}
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? "Pause" : "Play"}
          </button>
          <button type="button" className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-sm" onClick={() => queue && store.getState().skipPrevSentence()} aria-label="Previous sentence">Prev</button>
          <button type="button" className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-sm" onClick={() => queue && store.getState().skipNextSentence()} aria-label="Next sentence">Next</button>
          <span className="text-sm text-gray-500 dark:text-gray-400">Voice</span>
          <select
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={voiceId}
            onChange={(e) => store.getState().setVoice(e.target.value)}
            aria-label="Voice"
          >
            <option value="af_heart">Heart</option>
            <option value="af_bella">Bella</option>
            <option value="am_michael">Michael</option>
          </select>
          <span className="text-sm text-gray-500 dark:text-gray-400">Speed</span>
          <select
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800"
            value={String(speed)}
            onChange={(e) => store.getState().setSpeed(Number(e.target.value))}
            aria-label="Speed"
          >
            <option value="0.75">0.75×</option>
            <option value="1">1×</option>
            <option value="1.25">1.25×</option>
            <option value="1.5">1.5×</option>
            <option value="2">2×</option>
          </select>
          <button
            type="button"
            className="ml-auto text-sm p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => store.getState().setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </header>
        {pdfWarning && (
          <div className="px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 text-sm border-b border-amber-200 dark:border-amber-800">
            {pdfWarning}
          </div>
        )}
        <div ref={scrollContainerRef} className="flex-1 overflow-auto p-6 max-w-2xl mx-auto w-full">
          {chunks.map((chunk, i) => {
            const isCurrent = i === currentIndex;
            const isNext = i === currentIndex + 1;
            return (
              <span
                key={chunk.id}
                ref={(el) => {
                  if (i === currentIndex && el) currentChunkRef.current = el;
                }}
                data-chunk-id={chunk.id}
                role="button"
                tabIndex={0}
                onClick={handleClick}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSeek(i);
                  }
                }}
                className={
                  isCurrent
                    ? "bg-amber-200 dark:bg-amber-600/40 rounded px-0.5 cursor-pointer transition-colors"
                    : isNext
                      ? "bg-amber-50 dark:bg-amber-900/20 rounded px-0.5 cursor-pointer transition-colors"
                      : "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-0.5 transition-colors"
                }
              >
                {chunk.text}
                {i < chunks.length - 1 ? " " : ""}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
