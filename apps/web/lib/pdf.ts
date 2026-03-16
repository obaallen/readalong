/**
 * PDF text extraction for the web app. Builds canonical document from PDF.
 */

import * as pdfjsLib from "pdfjs-dist";
import { buildDocumentFromPageTexts } from "@readalong/reader-core";

if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

export interface PdfQualityResult {
  score: number;
  warning?: string;
}

export function scorePdfExtraction(pageTexts: string[]): PdfQualityResult {
  if (pageTexts.length === 0) return { score: 0, warning: "No text extracted." };
  const wordsPerPage = pageTexts.map((t) => t.trim().split(/\s+/).filter(Boolean).length);
  const totalWords = wordsPerPage.reduce((a, b) => a + b, 0);
  const avgWordsPerPage = totalWords / pageTexts.length;
  if (totalWords < 50) return { score: 0.3, warning: "Very little text extracted. This PDF may be scan-based or image-only." };
  if (avgWordsPerPage < 20) return { score: 0.5, warning: "Low text density. Reflow mode may read better." };
  return { score: 1, warning: undefined };
}

function itemsToText(items: { str: string }[]): string {
  return items.map((i) => i.str).join("");
}

export async function extractTextFromPdfFile(
  file: File
): Promise<{ document: ReturnType<typeof buildDocumentFromPageTexts>; pageTexts: string[]; quality: PdfQualityResult }> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  const pageTexts: string[] = [];
  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent({});
    const text = itemsToText(content.items as { str: string }[]);
    pageTexts.push(text || " ");
  }
  await pdf.destroy();
  const document = buildDocumentFromPageTexts(pageTexts);
  const quality = scorePdfExtraction(pageTexts);
  return { document, pageTexts, quality };
}
