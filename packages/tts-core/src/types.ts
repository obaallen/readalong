export interface Voice {
  id: string;
  name: string;
}

export interface SynthesizeOptions {
  voice?: string;
  speed?: number;
}

export interface ITTSProvider {
  initialize(): Promise<void>;
  getVoices(): Promise<Voice[]>;
  synthesizeChunk(text: string, options?: SynthesizeOptions): Promise<ArrayBuffer | Blob>;
  preloadChunks?(_chunks: { text: string }[], _options?: SynthesizeOptions): Promise<void>;
  cancel(): void;
  dispose(): void;
}
