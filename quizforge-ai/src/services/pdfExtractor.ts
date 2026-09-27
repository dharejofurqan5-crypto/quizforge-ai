import * as pdfjsLib from 'pdfjs-dist';

// Use standard CDN worker to guarantee compatibility without complex worker build configurations
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs`;
}

export interface ExtractedPDFData {
  fileName: string;
  fileSize: number;
  pageCount: number;
  extractedText: string;
  pdfBase64?: string;
  isScannedOrLowText: boolean;
}

export async function extractTextFromPDF(
  file: File,
  onProgress?: (stage: string, percent: number) => void
): Promise<ExtractedPDFData> {
  onProgress?.('Reading PDF file...', 15);

  const arrayBuffer = await file.arrayBuffer();

  // Convert to base64 for backup / multimodal vision support in case text is sparse
  let pdfBase64: string | undefined = undefined;
  if (file.size <= 25 * 1024 * 1024) {
    // Up to 25MB can be base64 encoded safely
    const bytes = new Uint8Array(arrayBuffer);
    let binary = '';
    const chunk = 8192;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
    }
    pdfBase64 = btoa(binary);
  }

  onProgress?.('Loading PDF structure...', 30);

  let extractedPagesText: string[] = [];
  let pageCount = 1;

  try {
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true,
    });

    const pdfDocument = await loadingTask.promise;
    pageCount = pdfDocument.numPages;

    onProgress?.(`Extracting content from ${pageCount} pages...`, 45);

    // Extract text page by page with page markers
    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      const pageStrings = textContent.items
        .map((item: any) => item.str || '')
        .filter((str: string) => str.trim().length > 0);
      
      const pageFullText = pageStrings.join(' ');
      if (pageFullText.trim().length > 0) {
        extractedPagesText.push(`=== Page ${pageNum} ===\n${pageFullText.trim()}`);
      }

      if (pageNum % 3 === 0 || pageNum === pageCount) {
        const pct = Math.min(85, Math.round(45 + (pageNum / pageCount) * 40));
        onProgress?.(`Extracting content (Page ${pageNum} of ${pageCount})...`, pct);
      }
    }
  } catch (err: any) {
    console.warn('PDF.js text extraction error or fallback needed:', err);
    // If PDF.js fails (e.g. password or webworker issue), we can rely on pdfBase64
  }

  const fullText = extractedPagesText.join('\n\n');
  const isScannedOrLowText = fullText.trim().length < 150;

  onProgress?.('Extracting content completed', 90);

  return {
    fileName: file.name,
    fileSize: file.size,
    pageCount: Math.max(1, pageCount),
    extractedText: fullText,
    pdfBase64,
    isScannedOrLowText,
  };
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
