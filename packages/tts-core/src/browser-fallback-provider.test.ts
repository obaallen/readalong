import { describe, it, expect } from "vitest";
import { BrowserSpeechFallbackProvider } from "./browser-fallback-provider.js";

describe("BrowserSpeechFallbackProvider", () => {
  it("implements ITTSProvider", () => {
    const p = new BrowserSpeechFallbackProvider();
    expect(typeof p.initialize).toBe("function");
    expect(typeof p.getVoices).toBe("function");
    expect(typeof p.synthesizeChunk).toBe("function");
    expect(typeof p.cancel).toBe("function");
    expect(typeof p.dispose).toBe("function");
  });

  it("getVoices returns array in node", async () => {
    const p = new BrowserSpeechFallbackProvider();
    const voices = await p.getVoices();
    expect(Array.isArray(voices)).toBe(true);
  });
});
