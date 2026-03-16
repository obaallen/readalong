import { describe, it, expect } from "vitest";
import { KokoroLocalTTSProvider } from "./kokoro-provider.js";

describe("KokoroLocalTTSProvider", () => {
  it("implements ITTSProvider", () => {
    const p = new KokoroLocalTTSProvider(() => import("kokoro-js"));
    expect(typeof p.initialize).toBe("function");
    expect(typeof p.getVoices).toBe("function");
    expect(typeof p.synthesizeChunk).toBe("function");
    expect(typeof p.cancel).toBe("function");
    expect(typeof p.dispose).toBe("function");
  });

  it("getVoices returns fallback list when not initialized", async () => {
    const p = new KokoroLocalTTSProvider(() => import("kokoro-js"));
    const voices = await p.getVoices();
    expect(Array.isArray(voices)).toBe(true);
  });
});
