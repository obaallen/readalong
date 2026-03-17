"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createReaderStore, createScrollManager, type Chunk } from "@readalong/reader-core";
import { BrowserSpeechFallbackProvider } from "@readalong/tts-core";
import { ReaderContent } from "../../components/ReaderContent";
import { AppShell } from "../../components/AppShell";
import { LibraryRail } from "../../components/LibraryRail";
import { BottomPlayerBar } from "../../components/BottomPlayerBar";
import { Onboarding } from "../../components/Onboarding";

const store = createReaderStore();

const SAMPLE_TEXT = `The best reading experiences feel invisible.\n\nA premium text-to-speech product should help you focus: a calm layout, excellent typography, and controls that never get in the way.\n\nClick any sentence to jump. Use the player to adjust speed and voice.`;

const BASE_WPM = 180;

function countWords(text: string) {
  const t = text.trim();
  if (!t) return 0;
  return t.split(/\s+/).filter(Boolean).length;
}

export default function AppReaderPage() {
  const [inputText, setInputText] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfWarning, setPdfWarning] = useState<string | null>(null);
  const [ttsReady, setTtsReady] = useState(false);
  const [ttsError, setTtsError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const ttsRef = useRef<BrowserSpeechFallbackProvider | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const generationIdRef = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const currentChunkRef = useRef<HTMLElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [pasteFocusSignal, setPasteFocusSignal] = useState(0);
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
  const theme = state.theme;

  const currentIndex = queue?.currentIndex ?? 0;
  const currentChunk = queue ? store.getState().getCurrentChunk() : null;

  const { totalSeconds, elapsedSeconds } = useMemo(() => {
    if (!chunks.length) return { totalSeconds: null as number | null, elapsedSeconds: null as number | null };
    const wordCounts = chunks.map((c) => countWords(c.text));
    const totalWords = wordCounts.reduce((a, b) => a + b, 0);
    const wordsBefore = wordCounts.slice(0, Math.min(currentIndex, wordCounts.length)).reduce((a, b) => a + b, 0);
    const wpm = BASE_WPM * (speed || 1);
    const totalSec = wpm > 0 ? (totalWords / wpm) * 60 : null;
    const elapsedSec = wpm > 0 ? (wordsBefore / wpm) * 60 : null;
    return { totalSeconds: totalSec, elapsedSeconds: elapsedSec };
  }, [chunks, currentIndex, speed]);

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
      const { extractTextFromPdfFile } = await import("../../lib/pdf");
      const { document: doc, quality } = await extractTextFromPdfFile(file);
      if (quality.warning) setPdfWarning(quality.warning);
      await store.getState().loadDocumentFromDocument(doc);
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

  const onTrySample = useCallback(async () => {
    setPdfWarning(null);
    await store.getState().loadDocument(SAMPLE_TEXT);
    store.getState().play();
  }, []);

  return (
    <AppShell
      theme={theme}
      rail={
        <LibraryRail
          uploading={pdfLoading}
          onPaste={() => setPasteFocusSignal((x) => x + 1)}
          onUploadClick={() => fileInputRef.current?.click()}
          onTrySample={onTrySample}
          theme={theme}
          onThemeToggle={() => store.getState().setTheme(theme === "dark" ? "light" : "dark")}
        />
      }
      bottomBar={
        <BottomPlayerBar
          playing={playing}
          hasQueue={Boolean(queue)}
          currentIndex={currentIndex}
          total={chunks.length}
          nowPlayingText={currentChunk?.text?.trim() ? currentChunk.text.trim() : null}
          elapsedSeconds={elapsedSeconds}
          totalSeconds={totalSeconds}
          onPlayPause={() => (playing ? store.getState().pause() : store.getState().play())}
          onPrev={() => queue && store.getState().skipPrevSentence()}
          onNext={() => queue && store.getState().skipNextSentence()}
          onSeekIndex={handleSeek}
          voiceId={voiceId}
          onVoiceChange={(v) => store.getState().setVoice(v)}
          speed={speed}
          onSpeedChange={(s) => store.getState().setSpeed(s)}
          theme={theme}
          onThemeToggle={() => store.getState().setTheme(theme === "dark" ? "light" : "dark")}
        />
      }
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        className="sr-only"
        onChange={handlePdfUpload}
        disabled={pdfLoading}
        aria-label="Upload PDF"
      />

      {!document && !ttsError ? (
        <Onboarding
          ttsReady={ttsReady}
          ttsLoading={loading}
          ttsError={ttsError}
          pdfLoading={pdfLoading}
          pdfWarning={pdfWarning}
          inputText={inputText}
          onInputChange={setInputText}
          onRead={handleLoad}
          onPdfUpload={handlePdfUpload}
          onTrySample={onTrySample}
          focusPasteSignal={pasteFocusSignal}
        />
      ) : (
        <div className="mx-auto max-w-[1100px]">
          {pdfWarning && (
            <div className="mx-6 sm:mx-10 mt-8 rounded-2xl border border-border dark:border-border-dark bg-amber-100/70 dark:bg-amber-900/20 px-4 py-3 text-sm text-amber-900 dark:text-amber-200">
              {pdfWarning}
            </div>
          )}
          <ReaderContent
            ref={scrollContainerRef}
            chunks={chunks}
            currentIndex={currentIndex}
            onSeek={handleSeek}
            theme={theme}
            currentChunkRef={(el) => {
              currentChunkRef.current = el;
            }}
          />
        </div>
      )}
    </AppShell>
  );
}

