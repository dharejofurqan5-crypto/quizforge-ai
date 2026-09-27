import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Layers, 
  Settings2, 
  Clock, 
  Languages, 
  Check, 
  RefreshCw, 
  ArrowRight,
  BookOpen,
  Award,
  AlertTriangle,
  UploadCloud
} from 'lucide-react';
import { PDFMetadata, QuizSettings, Question } from '../types/quiz';
import { generateQuestionsAPI } from '../services/api';

interface PDFAnalysisSummaryProps {
  metadata: PDFMetadata;
  onQuestionsGenerated: (
    questions: Question[],
    settings: QuizSettings,
    targetMode: 'bank' | 'quiz' | 'both'
  ) => void;
  onResetUpload: () => void;
}

export const PDFAnalysisSummary: React.FC<PDFAnalysisSummaryProps> = ({
  metadata,
  onQuestionsGenerated,
  onResetUpload,
}) => {
  // Generation Target: 'bank' | 'quiz' | 'both'
  const [targetType, setTargetType] = useState<'bank' | 'quiz' | 'both'>('both');

  // Settings
  const [numQuestions, setNumQuestions] = useState<number>(10);
  const [isCustomCount, setIsCustomCount] = useState<boolean>(false);
  const [customCountValue, setCustomCountValue] = useState<string>('12');

  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | 'Mixed'>('Mixed');
  const [questionType, setQuestionType] = useState<'MCQ' | 'True/False' | 'Mixed'>('MCQ');
  const [selectedTopic, setSelectedTopic] = useState<string>('Entire PDF');
  const [language, setLanguage] = useState<'English' | 'Urdu' | 'Sindhi'>('English');
  const [timerMinutes, setTimerMinutes] = useState<number>(10);
  const [isCustomTimer, setIsCustomTimer] = useState<boolean>(false);
  const [customTimerValue, setCustomTimerValue] = useState<string>('15');

  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const questionCountOptions = [5, 10, 15, 20, 30, 50];

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMessage(null);

    const effectiveCount = isCustomCount
      ? Math.max(1, Math.min(60, parseInt(customCountValue) || 10))
      : numQuestions;

    const effectiveTimer = isCustomTimer
      ? Math.max(1, Math.min(180, parseInt(customTimerValue) || 10))
      : timerMinutes;

    const settings: QuizSettings = {
      numberOfQuestions: effectiveCount,
      difficulty,
      questionType,
      selectedTopic,
      language,
      timerMinutes: effectiveTimer,
    };

    try {
      const response = await generateQuestionsAPI({
        extractedText: metadata.extractedText,
        pdfBase64: metadata.pdfBase64,
        settings,
      });

      if (!response.questions || response.questions.length === 0) {
        throw new Error('The uploaded PDF does not contain enough usable information to generate the requested questions.');
      }

      onQuestionsGenerated(response.questions, settings, targetType);
    } catch (err: any) {
      console.error('Error generating questions:', err);
      setErrorMessage(
        err?.message || 'Question generation failed. Please try again or reduce question count.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* PDF Information Card (Section 5) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200/60">
              <Check className="w-3.5 h-3.5" />
              Analysis Complete
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {metadata.title || 'Educational Document'}
            </h2>
            <p className="text-xs text-slate-500 flex items-center gap-2">
              <span className="font-semibold text-slate-700">{metadata.fileName}</span>
              <span>•</span>
              <span>{metadata.pageCount} Pages</span>
              {metadata.wordCount ? (
                <>
                  <span>•</span>
                  <span>~{metadata.wordCount.toLocaleString()} Words extracted</span>
                </>
              ) : null}
            </p>
          </div>

          <button
            onClick={onResetUpload}
            className="self-start sm:self-center px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5 shrink-0"
          >
            <UploadCloud className="w-4 h-4" />
            Upload Another PDF
          </button>
        </div>

        {/* AI-Generated Summary */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Document Summary
          </h4>
          <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-4 rounded-2xl border border-slate-200/60">
            {metadata.summary || 'Summary generated from the document content.'}
          </p>
        </div>

        {/* Detected Chapters / Key Topics */}
        {metadata.detectedChapters && metadata.detectedChapters.length > 0 && (
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              Detected Chapters & Modules ({metadata.detectedChapters.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {metadata.detectedChapters.map((chap) => (
                <div
                  key={chap.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between font-semibold text-slate-800">
                    <span className="truncate">{chap.title}</span>
                    {chap.pageRange && (
                      <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md font-bold shrink-0">
                        {chap.pageRange}
                      </span>
                    )}
                  </div>
                  {chap.description && (
                    <p className="text-slate-500 text-[11px] line-clamp-1">{chap.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scanned Document Alert if text was sparse */}
        {metadata.isScannedOrLowText && (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Some PDF pages may contain scanned images. AI document vision will parse visual texts.</span>
          </div>
        )}
      </div>

      {/* Generation Mode Selector (Section 5: "What would you like to generate?") */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
        <h3 className="text-lg font-bold text-slate-900">
          What would you like to generate?
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Option 1: Generate MCQs */}
          <div
            onClick={() => setTargetType('bank')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              targetType === 'bank'
                ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-600'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-900 text-sm">Generate MCQs</span>
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  targetType === 'bank' ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                }`}
              >
                {targetType === 'bank' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Generate a searchable, editable question bank with answers and explanations.
            </p>
          </div>

          {/* Option 2: Create Quiz */}
          <div
            onClick={() => setTargetType('quiz')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              targetType === 'quiz'
                ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-600'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-900 text-sm">Create Quiz</span>
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  targetType === 'quiz' ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                }`}
              >
                {targetType === 'quiz' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Jump straight into a timed, interactive test with instant scoring and review.
            </p>
          </div>

          {/* Option 3: Generate Both */}
          <div
            onClick={() => setTargetType('both')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              targetType === 'both'
                ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-600'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-900 text-sm">Generate Both</span>
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  targetType === 'both' ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                }`}
              >
                {targetType === 'both' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Create an editable question bank AND ready-to-play interactive quiz.
            </p>
          </div>
        </div>
      </div>

      {/* Question Generation Settings (Section 6) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
          <Settings2 className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-bold text-slate-900">
            Question Generation Settings
          </h3>
        </div>

        {/* 1. Number of Questions */}
        <div className="space-y-2.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            Number of Questions
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {questionCountOptions.map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => {
                  setNumQuestions(count);
                  setIsCustomCount(false);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  !isCustomCount && numQuestions === count
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {count}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setIsCustomCount(true)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                isCustomCount
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Custom
            </button>

            {isCustomCount && (
              <div className="flex items-center gap-1.5 ml-2">
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={customCountValue}
                  onChange={(e) => setCustomCountValue(e.target.value)}
                  className="w-16 px-2.5 py-1.5 text-xs rounded-lg border border-indigo-300 font-semibold text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-xs text-slate-500">questions</span>
              </div>
            )}
          </div>
        </div>

        {/* 2. Difficulty */}
        <div className="space-y-2.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            Difficulty Level
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {(['Easy', 'Medium', 'Hard', 'Mixed'] as const).map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => setDifficulty(diff)}
                className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                  difficulty === diff
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Question Type */}
        <div className="space-y-2.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            Question Type
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {(['MCQ', 'True/False', 'Mixed'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setQuestionType(type)}
                className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                  questionType === type
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-500">
            * For MCQs, every question strictly includes exactly 4 options (A, B, C, D) and 1 correct answer.
          </p>
        </div>

        {/* 4. Topic / Chapter Scope */}
        <div className="space-y-2.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            Topic / Chapter Scope
          </label>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Entire PDF">Entire PDF (All chapters and topics)</option>
            {metadata.detectedChapters &&
              metadata.detectedChapters.map((chap) => (
                <option key={chap.id} value={chap.title}>
                  {chap.title} {chap.pageRange ? `(${chap.pageRange})` : ''}
                </option>
              ))}
            {metadata.keyTopics &&
              metadata.keyTopics.map((top, idx) => (
                <option key={idx} value={top}>
                  Topic: {top}
                </option>
              ))}
          </select>
        </div>

        {/* 5. Language Selector */}
        <div className="space-y-2.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <Languages className="w-3.5 h-3.5 text-indigo-600" />
            Language
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {(['English', 'Urdu', 'Sindhi'] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                  language === lang
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {lang === 'Urdu' ? 'اردو (Urdu)' : lang === 'Sindhi' ? 'سنڌي (Sindhi)' : 'English'}
              </button>
            ))}
          </div>
        </div>

        {/* 6. Quiz Timer Setting */}
        <div className="space-y-2.5 pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            Quiz Timer Duration
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: 'No timer', val: 0 },
              { label: '5 min', val: 5 },
              { label: '10 min', val: 10 },
              { label: '15 min', val: 15 },
              { label: '20 min', val: 20 },
            ].map((t) => (
              <button
                key={t.val}
                type="button"
                onClick={() => {
                  setTimerMinutes(t.val);
                  setIsCustomTimer(false);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  !isCustomTimer && timerMinutes === t.val
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setIsCustomTimer(true)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                isCustomTimer
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Custom
            </button>

            {isCustomTimer && (
              <div className="flex items-center gap-1.5 ml-2">
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={customTimerValue}
                  onChange={(e) => setCustomTimerValue(e.target.value)}
                  className="w-16 px-2.5 py-1.5 text-xs rounded-lg border border-indigo-300 font-semibold text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-xs text-slate-500">minutes</span>
              </div>
            )}
          </div>
        </div>

        {/* Error message if generation failed */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm">
            <p className="font-bold">Error generating questions:</p>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
        )}

        {/* Action Button: Generate Questions */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            * Generation adheres strictly to facts in the uploaded PDF.
          </p>

          <button
            type="button"
            disabled={isGenerating}
            onClick={handleGenerate}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer ${
              isGenerating
                ? 'bg-indigo-400 text-white cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 hover:shadow-indigo-300'
            }`}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Generating Questions from PDF...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Questions Now
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
