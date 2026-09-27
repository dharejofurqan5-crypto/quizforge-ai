import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Award, 
  RotateCcw, 
  Sparkles, 
  ArrowLeft, 
  Printer, 
  CheckCircle2, 
  XCircle, 
  MinusCircle, 
  Clock, 
  BookOpen, 
  HelpCircle,
  FileText
} from 'lucide-react';
import { Question, QuizResult, QuizSettings } from '../types/quiz';

interface QuizResultViewProps {
  result: QuizResult;
  questions: Question[];
  settings: QuizSettings;
  pdfTitle?: string;
  onTryAgain: () => void;
  onNewQuiz: () => void;
  onBackToBank: () => void;
}

export const QuizResultView: React.FC<QuizResultViewProps> = ({
  result,
  questions,
  settings,
  pdfTitle,
  onTryAgain,
  onNewQuiz,
  onBackToBank,
}) => {
  useEffect(() => {
    if (result.percentage >= 70) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore if canvas-confetti is not loaded
      }
    }
  }, [result.percentage]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePrintResult = () => {
    window.print();
  };

  // Grade classification
  const getGradeInfo = (pct: number) => {
    if (pct >= 90) return { title: 'Outstanding!', color: 'text-emerald-600', badge: 'Mastery' };
    if (pct >= 80) return { title: 'Great Job!', color: 'text-indigo-600', badge: 'Proficient' };
    if (pct >= 60) return { title: 'Good Effort!', color: 'text-amber-600', badge: 'Developing' };
    return { title: 'Keep Practicing!', color: 'text-rose-600', badge: 'Needs Review' };
  };

  const grade = getGradeInfo(result.percentage);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Top Completion Header & Visual Score Meter (Section 12) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 sm:p-12 text-center space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200">
          <Award className="w-3.5 h-3.5" />
          Assessment Complete
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Quiz Completed!
        </h2>

        {/* Visual Score Ring / Dial */}
        <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#e2e8f0"
              strokeWidth="9"
            />
            {/* Value circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke={result.percentage >= 70 ? '#10b981' : result.percentage >= 50 ? '#6366f1' : '#f43f5e'}
              strokeWidth="9"
              strokeDasharray={2 * Math.PI * 40}
              strokeDashoffset={2 * Math.PI * 40 * (1 - result.percentage / 100)}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
              {result.percentage}%
            </span>
            <span className={`text-xs font-bold uppercase tracking-wider mt-0.5 ${grade.color}`}>
              {grade.badge}
            </span>
          </div>
        </div>

        <p className="text-lg font-bold text-slate-800">
          {grade.title} You scored <span className="text-indigo-600">{result.score}</span> out of{' '}
          <span className="text-slate-900">{result.total}</span>
        </p>

        {/* Detailed Metrics Grid (Section 12) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-2">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
            <div className="flex items-center justify-center gap-1 text-emerald-600 mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-semibold">Correct</span>
            </div>
            <p className="text-2xl font-extrabold text-emerald-800">{result.correctCount}</p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-center">
            <div className="flex items-center justify-center gap-1 text-rose-600 mb-1">
              <XCircle className="w-4 h-4" />
              <span className="text-xs font-semibold">Incorrect</span>
            </div>
            <p className="text-2xl font-extrabold text-rose-800">{result.incorrectCount}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-500 mb-1">
              <MinusCircle className="w-4 h-4" />
              <span className="text-xs font-semibold">Unanswered</span>
            </div>
            <p className="text-2xl font-extrabold text-slate-700">{result.unansweredCount}</p>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-center">
            <div className="flex items-center justify-center gap-1 text-indigo-600 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-semibold">Time</span>
            </div>
            <p className="text-2xl font-extrabold text-indigo-900 font-mono">
              {formatTime(result.timeSpentSeconds)}
            </p>
          </div>
        </div>

        {/* Result Action Buttons (Section 12) */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3 no-print">
          <button
            onClick={onTryAgain}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs sm:text-sm transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>

          <button
            onClick={onNewQuiz}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs sm:text-sm transition-all"
          >
            <Sparkles className="w-4 h-4" />
            New Quiz
          </button>

          <button
            onClick={onBackToBank}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs sm:text-sm transition-all"
          >
            <FileText className="w-4 h-4" />
            Back to Question Bank
          </button>

          <button
            onClick={handlePrintResult}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all"
          >
            <Printer className="w-4 h-4" />
            Print / Download Result
          </button>
        </div>
      </div>

      {/* Comprehensive Question Review (Section 12) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Question Review ({questions.length})
          </h3>
          <span className="text-xs text-slate-500">
            Check your choices against source material
          </span>
        </div>

        {questions.map((q, idx) => {
          const userAns = result.userAnswers[q.id];
          const isCorrect = userAns === q.correctAnswer;
          const isUnanswered = !userAns;

          return (
            <div
              key={q.id}
              className={`p-6 rounded-3xl bg-white border shadow-xs space-y-4 transition-all ${
                isCorrect
                  ? 'border-emerald-200 ring-1 ring-emerald-100'
                  : isUnanswered
                  ? 'border-slate-200'
                  : 'border-rose-200 ring-1 ring-rose-100'
              }`}
            >
              {/* Question Header & Correct/Incorrect Indicator */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  {isCorrect ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                    </span>
                  ) : isUnanswered ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md">
                      <MinusCircle className="w-3.5 h-3.5" /> Unanswered
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-200">
                      <XCircle className="w-3.5 h-3.5" /> Incorrect
                    </span>
                  )}
                </div>

                {q.source && (
                  <span className="text-[11px] font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200 shrink-0">
                    Source: <strong className="text-slate-700">{q.source}</strong>
                  </span>
                )}
              </div>

              {/* Question Text */}
              <p
                className={`text-slate-900 font-bold text-base leading-relaxed ${
                  settings.language === 'Urdu' || settings.language === 'Sindhi' ? 'font-urdu text-lg' : ''
                }`}
              >
                {q.question}
              </p>

              {/* Options Review List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {(['A', 'B', 'C', 'D'] as const).map((letter) => {
                  const optText = q.options[letter];
                  if (!optText && q.type === 'true_false' && (letter === 'C' || letter === 'D')) {
                    return null;
                  }

                  const isUserSelection = userAns === letter;
                  const isTheCorrectAnswer = q.correctAnswer === letter;

                  let cardStyle = 'bg-slate-50/70 border-slate-200 text-slate-700';
                  if (isTheCorrectAnswer) {
                    cardStyle = 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold ring-1 ring-emerald-400';
                  } else if (isUserSelection && !isTheCorrectAnswer) {
                    cardStyle = 'bg-rose-50 border-rose-300 text-rose-950 font-bold ring-1 ring-rose-400';
                  }

                  return (
                    <div
                      key={letter}
                      className={`p-3 rounded-2xl border text-xs sm:text-sm flex items-center gap-3 ${cardStyle}`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          isTheCorrectAnswer
                            ? 'bg-emerald-600 text-white'
                            : isUserSelection
                            ? 'bg-rose-600 text-white'
                            : 'bg-white border border-slate-300 text-slate-600'
                        }`}
                      >
                        {letter}
                      </span>
                      <span
                        className={`flex-1 ${
                          settings.language === 'Urdu' || settings.language === 'Sindhi' ? 'font-urdu' : ''
                        }`}
                      >
                        {optText}
                      </span>
                      {isTheCorrectAnswer && (
                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-100/60 px-2 py-0.5 rounded shrink-0">
                          Correct Answer
                        </span>
                      )}
                      {isUserSelection && !isTheCorrectAnswer && (
                        <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider bg-rose-100/60 px-2 py-0.5 rounded shrink-0">
                          Your Choice
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Detailed Explanation */}
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/70 text-xs text-amber-950 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Explanation:</span>
                </div>
                <p className="leading-relaxed pl-5 text-amber-900/90">{q.explanation}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
