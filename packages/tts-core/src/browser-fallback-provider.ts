/**
 * Fallback TTS provider: browser Speech Synthesis. Use only when Kokoro fails.
 */

import type { ITTSProvider, Voice, SynthesizeOptions } from "./types.js";

export class BrowserSpeechFallbackProvider implements ITTSProvider {
  private cancelled = false;

  async initialize(): Promise<void> {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    this.cancelled = false;
  }

  async getVoices(): Promise<Voice[]> {
    if (typeof window === "undefined" || !window.speechSynthesis) return [];
    const list = window.speechSynthesis.getVoices();
    if (list.length === 0) {
      await new Promise<void>((resolve) => {
        window.speechSynthesis.onvoiceschanged = () => resolve();
      });
    }
    const voices = (window.speechSynthesis.getVoices?.() ?? []) as { voiceURI: string; name: string }[];
    return voices.map((v) => ({ id: v.voiceURI, name: v.name || v.voiceURI }));
  }

  async synthesizeChunk(text: string, _options?: SynthesizeOptions): Promise<ArrayBuffer | Blob> {
    if (typeof window === "undefined" || !window.speechSynthesis || !text.trim()) {
      return new ArrayBuffer(0);
    }
    this.cancelled = false;
    return new Promise((resolve) => {
      const u = new SpeechSynthesisUtterance(text.trim());
      u.rate = _options?.speed ?? 1;
      u.voice = _options?.voice
        ? (window.speechSynthesis.getVoices().find((v) => v.voiceURI === _options!.voice) ?? null)
        : null;
      const onEnd = () => {
        if (!this.cancelled) resolve(new ArrayBuffer(0));
      };
      u.onend = onEnd;
      u.onerror = onEnd;
      if (this.cancelled) {
        resolve(new ArrayBuffer(0));
        return;
      }
      window.speechSynthesis.speak(u);
      if (this.cancelled) {
        window.speechSynthesis.cancel();
        resolve(new ArrayBuffer(0));
      }
    });
  }

  cancel(): void {
    this.cancelled = true;
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }

  dispose(): void {
    this.cancel();
  }
}
