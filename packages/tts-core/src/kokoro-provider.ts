/**
 * Primary TTS provider: Kokoro.js, local only. No server.
 * Pass a loader from the app so the app can alias "kokoro-js" to the browser build (e.g. kokoro.web.js).
 */

import type { ITTSProvider, Voice, SynthesizeOptions } from "./types.js";

const MODEL_ID = "onnx-community/Kokoro-82M-v1.0-ONNX";

export type KokoroLoader = () => Promise<{ KokoroTTS: { from_pretrained: (model: string, opts?: object) => Promise<unknown> } }>;

type KokoroInstance = {
  generate(text: string, opts: { voice: string }): Promise<{ toBlob?: () => Blob; arrayBuffer?: () => Promise<ArrayBuffer> }>;
  voices?: Record<string, { name?: string }>;
};

export class KokoroLocalTTSProvider implements ITTSProvider {
  private instance: KokoroInstance | null = null;
  private initializing = false;
  private cancelled = false;
  private loader: KokoroLoader;

  constructor(loader: KokoroLoader) {
    this.loader = loader;
  }

  async initialize(): Promise<void> {
    if (this.instance) return;
    if (this.initializing) {
      while (this.initializing) await new Promise((r) => setTimeout(r, 50));
      return;
    }
    this.initializing = true;
    this.cancelled = false;
    try {
      const { KokoroTTS: Kokoro } = await this.loader();
      this.instance = (await Kokoro.from_pretrained(MODEL_ID, {
        dtype: "q8",
        device: "wasm",
      })) as unknown as KokoroInstance;
    } finally {
      this.initializing = false;
    }
  }

  async getVoices(): Promise<Voice[]> {
    if (!this.instance) {
      try {
        await this.initialize();
      } catch {
        // e.g. Node or load failure
      }
    }
    const voicesObj = this.instance?.voices;
    if (voicesObj && typeof voicesObj === "object") {
      return Object.entries(voicesObj).map(([id, v]) => ({ id, name: v?.name ?? id }));
    }
    return [
      { id: "af_heart", name: "Heart" },
      { id: "af_bella", name: "Bella" },
      { id: "am_michael", name: "Michael" },
    ];
  }

  async synthesizeChunk(text: string, options?: SynthesizeOptions): Promise<ArrayBuffer | Blob> {
    if (!text.trim()) return new ArrayBuffer(0);
    this.cancelled = false;
    if (!this.instance) await this.initialize();
    if (this.cancelled) return new ArrayBuffer(0);
    const voice = options?.voice ?? "af_heart";
    const audio = await this.instance!.generate(text.trim(), { voice });
    if (this.cancelled) return new ArrayBuffer(0);
    if (audio.toBlob) return audio.toBlob();
    if (audio.arrayBuffer) return audio.arrayBuffer();
    return new ArrayBuffer(0);
  }

  cancel(): void {
    this.cancelled = true;
  }

  dispose(): void {
    this.cancel();
    this.instance = null;
  }
}
