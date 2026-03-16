/**
 * OCR interface stub for future use. No implementation in MVP.
 * See docs/ARCHITECTURE.md.
 */

export interface IOCRProvider {
  extractTextFromImage(image: ImageBitmap | HTMLImageElement | Blob): Promise<string>;
}
