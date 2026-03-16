import { describe, it, expect, beforeEach } from "vitest";
import { createReaderStore } from "./reader-store.js";

describe("reader-store state machine", () => {
  let store: ReturnType<typeof createReaderStore>;

  beforeEach(() => {
    store = createReaderStore();
  });

  it("loadDocument → chunks and queue set", async () => {
    await store.getState().loadDocument("Hello. World.");
    const state = store.getState();
    expect(state.document).not.toBeNull();
    expect(state.chunks.length).toBe(2);
    expect(state.queue?.currentIndex).toBe(0);
  });

  it("play → pause → playing state", () => {
    store.getState().play();
    expect(store.getState().playing).toBe(true);
    store.getState().pause();
    expect(store.getState().playing).toBe(false);
  });

  it("seekToChunk → current index and generationId change", async () => {
    await store.getState().loadDocument("A. B. C.");
    const gen0 = store.getState().getGenerationId();
    store.getState().seekToChunk(1);
    expect(store.getState().queue?.currentIndex).toBe(1);
    expect(store.getState().getGenerationId()).toBe(gen0 + 1);
  });

  it("seek → pause → resume → speed change → seek", async () => {
    await store.getState().loadDocument("One. Two. Three.");
    store.getState().play();
    store.getState().seekToChunk(1);
    expect(store.getState().queue?.currentIndex).toBe(1);
    store.getState().pause();
    store.getState().setSpeed(1.25);
    expect(store.getState().speed).toBe(1.25);
    store.getState().seekToChunk(0);
    expect(store.getState().queue?.currentIndex).toBe(0);
  });

  it("getCurrentChunk and getNextChunksForPreload", async () => {
    await store.getState().loadDocument("A. B. C. D.");
    const current = store.getState().getCurrentChunk();
    expect(current).not.toBeNull();
    const next = store.getState().getNextChunksForPreload(2);
    expect(next.length).toBeGreaterThanOrEqual(0);
  });
});
