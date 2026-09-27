import { PDFMetadata, Question, QuizSettings } from '../types/quiz';

export interface AnalyzePDFResponse {
  title: string;
  summary: string;
  detectedChapters: Array<{
    id: string;
    title: string;
    description?: string;
    pageRange?: string;
  }>;
  keyTopics: string[];
  estimatedQuestionsCapacity: number;
  wordCount: number;
  pageCount: number;
  isScannedOrLowText: boolean;
}

export async function analyzePDFAPI(params: {
  fileName: string;
  extractedText: string;
  pageCount: number;
  pdfBase64?: string;
}): Promise<AnalyzePDFResponse> {
  const response = await fetch('/api/analyze-pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to analyze PDF (${response.status})`);
  }

  return response.json();
}

export async function generateQuestionsAPI(params: {
  extractedText: string;
  pdfBase64?: string;
  settings: QuizSettings;
  existingQuestions?: string[];
}): Promise<{ questions: Question[]; notes?: string; generatedCount: number }> {
  const response = await fetch('/api/generate-questions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Question generation failed (${response.status})`);
  }

  return response.json();
}

export async function regenerateSingleQuestionAPI(params: {
  extractedText: string;
  pdfBase64?: string;
  settings: QuizSettings;
  avoidQuestion: string;
  allCurrentQuestions: string[];
}): Promise<{ question: Question }> {
  const response = await fetch('/api/regenerate-single-question', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to regenerate question (${response.status})`);
  }

  return response.json();
}

export async function checkServerHealth(): Promise<{ status: string; hasApiKey: boolean }> {
  try {
    const response = await fetch('/api/health');
    if (!response.ok) return { status: 'error', hasApiKey: false };
    return response.json();
  } catch {
    return { status: 'offline', hasApiKey: false };
  }
}
