export interface MCQOptionMap {
  A: string;
  B: string;
  C: string;
  D: string;
  [key: string]: string | undefined;
}

export interface Question {
  id: string;
  question: string;
  options: MCQOptionMap;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  source: string;
  type: 'mcq' | 'true_false';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic?: string;
}

export interface QuizSettings {
  numberOfQuestions: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Mixed';
  questionType: 'MCQ' | 'True/False' | 'Mixed';
  selectedTopic: string;
  language: 'English' | 'Urdu' | 'Sindhi';
  timerMinutes: number; // 0 for no timer
}

export interface DetectedChapter {
  id: string;
  title: string;
  description?: string;
  pageRange?: string;
}

export interface PDFMetadata {
  fileName: string;
  fileSize: number;
  pageCount: number;
  extractedText: string;
  pdfBase64?: string;
  title?: string;
  summary?: string;
  detectedChapters?: DetectedChapter[];
  keyTopics?: string[];
  wordCount?: number;
  isScannedOrLowText?: boolean;
}

export interface QuizResult {
  quizId: string;
  score: number;
  total: number;
  percentage: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  timeSpentSeconds: number;
  userAnswers: Record<string, 'A' | 'B' | 'C' | 'D'>;
  completedAt: string;
}

export interface SavedQuiz {
  id: string;
  title: string;
  pdfName: string;
  createdAt: string;
  updatedAt: string;
  settings: QuizSettings;
  questions: Question[];
  summary?: string;
  bestResult?: QuizResult;
  lastAttemptResult?: QuizResult;
  isDemo?: boolean;
}

export interface QuestionPaperConfig {
  schoolName: string;
  subject: string;
  gradeClass: string;
  testTitle: string;
  date: string;
  timeAllowed: string;
  maxMarks: number;
  generalInstructions: string;
  includeAnswerKey: boolean;
  includeExplanationsInKey: boolean;
  includeSourcesInKey: boolean;
  layout: 'standard' | 'compact';
}
