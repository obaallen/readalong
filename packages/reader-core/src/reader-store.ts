/**
 * Zustand store: document, chunks, currentChunkIndex, playing, speed, voiceId.
 * Actions: loadDocument, seekToChunk, play, pause, skip next/prev sentence/paragraph, setSpeed, setVoice.
 * Persists preferences and last position to IndexedDB.
 */

import { createStore } from "zustand/vanilla";
import type { Document, Chunk } from "./document-model.js";
import { createDocumentFromText } from "./document-model.js";
import { segmentDocument } from "./segmenter.js";
import { chunkDocument } from "./chunker.js";
import {
  createPlaybackQueue,
  seekToChunk as queueSeekToChunk,
  advanceToNextChunk as queueAdvanceToNextChunk,
  skipToNextSentence,
  skipToPrevSentence,
  skipToNextParagraph,
  skipToPrevParagraph,
  getCurrentChunk,
  getNextChunksForPreload,
  type PlaybackQueueState,
} from "./playback-queue.js";
import * as persistence from "./persistence.js";

export interface ReaderState {
  document: Document | null;
  chunks: Chunk[];
  queue: PlaybackQueueState | null;
  playing: boolean;
  speed: number;
  voiceId: string;
  theme: "light" | "dark";
}

export type ReaderActions = {
  loadDocument: (text: string) => Promise<void>;
  loadDocumentFromDocument: (doc: Document) => Promise<void>;
  clearDocument: () => void;
  seekToChunk: (index: number) => void;
  advanceToNextChunk: () => void;
  play: () => void;
  pause: () => void;
  skipNextSentence: () => void;
  skipPrevSentence: () => void;
  skipNextParagraph: () => void;
  skipPrevParagraph: () => void;
  setSpeed: (speed: number) => void;
  setVoice: (voiceId: string) => void;
  setTheme: (theme: "light" | "dark") => void;
  getCurrentChunk: () => Chunk | null;
  getNextChunksForPreload: (n?: number) => Chunk[];
  getGenerationId: () => number;
};

export type ReaderStore = ReaderState & ReaderActions;

const defaultState: ReaderState = {
  document: null,
  chunks: [],
  queue: null,
  playing: false,
  speed: 1,
  voiceId: "af_heart",
  theme: "light",
};

export function createReaderStore() {
  return createStore<ReaderStore>((set, get) => ({
    ...defaultState,

    loadDocument: async (text: string) => {
      const doc = createDocumentFromText(text);
      const segmented = segmentDocument(doc);
      const chunks = chunkDocument(segmented);
      const queue = createPlaybackQueue(chunks);
      let restoredIndex = 0;
      try {
        const saved = await persistence.loadPosition(doc.id);
        if (saved != null && saved >= 0 && saved < chunks.length) restoredIndex = saved;
      } catch {
        // ignore
      }
      const queueWithPosition = queueSeekToChunk(queue, restoredIndex);
      const prefs = await persistence.loadPrefs();
      set({
        document: segmented,
        chunks,
        queue: queueWithPosition,
        playing: false,
        speed: prefs.speed ?? get().speed,
        voiceId: prefs.voiceId ?? get().voiceId,
        theme: (prefs.theme as "light" | "dark") ?? get().theme,
      });
    },

    loadDocumentFromDocument: async (doc: Document) => {
      const chunks = chunkDocument(doc);
      const queue = createPlaybackQueue(chunks);
      let restoredIndex = 0;
      try {
        const saved = await persistence.loadPosition(doc.id);
        if (saved != null && saved >= 0 && saved < chunks.length) restoredIndex = saved;
      } catch {
        // ignore
      }
      const queueWithPosition = queueSeekToChunk(queue, restoredIndex);
      const prefs = await persistence.loadPrefs();
      set({
        document: doc,
        chunks,
        queue: queueWithPosition,
        playing: false,
        speed: prefs.speed ?? get().speed,
        voiceId: prefs.voiceId ?? get().voiceId,
        theme: (prefs.theme as "light" | "dark") ?? get().theme,
      });
    },

    clearDocument: () => {
      set({
        document: null,
        chunks: [],
        queue: null,
        playing: false,
      });
    },

    seekToChunk: (index: number) => {
      const { queue } = get();
      if (!queue) return;
      set({ queue: queueSeekToChunk(queue, index), playing: false });
      const doc = get().document;
      if (doc) void persistence.savePosition(doc.id, index);
    },

    advanceToNextChunk: () => {
      const { queue } = get();
      if (!queue) return;
      const next = queueAdvanceToNextChunk(queue);
      set({ queue: next });
      const doc = get().document;
      if (doc) void persistence.savePosition(doc.id, next.currentIndex);
    },

    play: () => set({ playing: true }),
    pause: () => set({ playing: false }),

    skipNextSentence: () => {
      const { queue } = get();
      if (!queue) return;
      set({ queue: skipToNextSentence(queue) });
      const q = get().queue!;
      const doc = get().document;
      if (doc) void persistence.savePosition(doc.id, q.currentIndex);
    },
    skipPrevSentence: () => {
      const { queue } = get();
      if (!queue) return;
      set({ queue: skipToPrevSentence(queue) });
      const q = get().queue!;
      const doc = get().document;
      if (doc) void persistence.savePosition(doc.id, q.currentIndex);
    },
    skipNextParagraph: () => {
      const { queue } = get();
      if (!queue) return;
      set({ queue: skipToNextParagraph(queue) });
      const q = get().queue!;
      const doc = get().document;
      if (doc) void persistence.savePosition(doc.id, q.currentIndex);
    },
    skipPrevParagraph: () => {
      const { queue } = get();
      if (!queue) return;
      set({ queue: skipToPrevParagraph(queue) });
      const q = get().queue!;
      const doc = get().document;
      if (doc) void persistence.savePosition(doc.id, q.currentIndex);
    },

    setSpeed: (speed: number) => {
      set({ speed });
      void persistence.savePrefs({
        speed,
        voiceId: get().voiceId,
        theme: get().theme,
      });
    },
    setVoice: (voiceId: string) => {
      set({ voiceId });
      void persistence.savePrefs({
        speed: get().speed,
        voiceId,
        theme: get().theme,
      });
    },
    setTheme: (theme: "light" | "dark") => {
      set({ theme });
      void persistence.savePrefs({
        speed: get().speed,
        voiceId: get().voiceId,
        theme,
      });
    },

    getCurrentChunk: () => {
      const q = get().queue;
      return q ? getCurrentChunk(q) : null;
    },
    getNextChunksForPreload: (n?: number) => {
      const q = get().queue;
      return q ? getNextChunksForPreload(q, n) : [];
    },
    getGenerationId: () => get().queue?.generationId ?? 0,
  }));
}

export type { PlaybackQueueState };
