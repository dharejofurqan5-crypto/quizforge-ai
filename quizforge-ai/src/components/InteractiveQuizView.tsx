import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Play, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw,
  Sparkles,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import { Question, QuizSettings, QuizResult } from '../types/quiz';

interface InteractiveQuizViewProps {
  quizId: string;
  questions: Question[];
  settings: QuizSettings;
  pdfTitle?: string;
  onFinishQuiz: (result: QuizResult) => void;
  onBackToBank: () => void;
}

export const InteractiveQuizView: React.FC<InteractiveQuizViewProps> = ({
  quizId,
  questions,
  settings,
  pdfTitle,
  onFinishQuiz,
  onBackToBank,
}) => {
  // Pre-quiz or active quiz state
  const [isQuizStarted, setIsQuizStarted] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  
  // Timer state
  const [selectedTimerMinutes, setSelectedTimerMinutes] = useState<number>(settings.timerMinutes || 10);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState<number>(0);

  // Submit confirmation modal
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);

  // Initialize timer on start
  const handleStartQuiz = () => {
    setIsQuizStarted(true);
    setCurrentIndex(0);
    setUserAnswers({});
    setTimeSpentSeconds(0);

    if (selectedTimerMinutes > 0) {
      setSecondsRemaining(selectedTimerMinutes * 60);
    } else {
      setSecondsRemaining(0);
    }
  };

  // Timer interval effect
  useEffect(() => {
    if (!isQuizStarted) return;

    const timer = setInterval(() => {
      setTimeSpentSeconds((prev) => prev + 1);

      if (selectedTimerMinutes > 0) {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // Auto-submit when time expires
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isQuizStarted, selectedTimerMinutes]);

  const handleSelectOption = (letter: 'A' | 'B' | 'C' | 'D') => {
    const currentQ = questions[currentIndex];
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: letter,
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowSubmitModal(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    setShowSubmitModal(false);

    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    questions.forEach((q) => {
      const ans = userAnswers[q.id];
      if (!ans) {
        unansweredCount++;
      } else if (ans === q.correctAnswer) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    });

    const total = questions.length;
    const score = correctCount;
    const percentage = Math.round((score / total) * 100);

    const result: QuizResult = {
      quizId,
      score,
      total,
      percentage,
      correctCount,
      incorrectCount,
      unansweredCount,
      timeSpentSeconds,
      userAnswers,
      completedAt: new Date().toISOString(),
    };

    onFinishQuiz(result);
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Pre-quiz "Quiz Ready!" Screen (Section 10)
  if (!isQuizStarted) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 sm:p-10 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-xs">
            <Sparkles className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" /> Assessment Ready
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Quiz Ready!
            </h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Test your knowledge strictly based on the extracted PDF content. One question at a time, with full review at the end.
            </p>
          </div>

          {/* Quiz Parameters Card */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left text-xs">
            <div>
              <span className="text-slate-400 font-medium">Questions:</span>
              <p className="text-slate-900 font-bold text-sm mt-0.5">{questions.length}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Difficulty:</span>
              <p className="text-slate-900 font-bold text-sm mt-0.5">{settings.difficulty}</p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-slate-400 font-medium">Language:</span>
              <p className="text-slate-900 font-bold text-sm mt-0.5">{settings.language}</p>
            </div>
            <div className="col-span-2 sm:col-span-3 pt-2 border-t border-slate-200/60">
              <span className="text-slate-400 font-medium">Topic Scope:</span>
              <p className="text-slate-900 font-bold text-xs truncate mt-0.5">
                {settings.selectedTopic}
              </p>
            </div>
          </div>

          {/* Timer Selection (Section 10) */}
          <div className="space-y-3 text-left">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              Select Time Limit
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                { label: 'No timer', val: 0 },
                { label: '5 min', val: 5 },
                { label: '10 min', val: 10 },
                { label: '15 min', val: 15 },
                { label: '20 min', val: 20 },
                { label: '30 min', val: 30 },
              ].map((t) => (
                <button
                  key={t.val}
                  type="button"
                  onClick={() => setSelectedTimerMinutes(t.val)}
                  className={`p-2.5 rounded-xl text-xs font-semibold text-center border transition-all ${
                    selectedTimerMinutes === t.val
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onBackToBank}
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              Back to Question Bank
            </button>
            <button
              onClick={handleStartQuiz}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Quiz Interface (Section 11: One Question at a Time)
  const currentQ = questions[currentIndex];
  const selectedOption = userAnswers[currentQ.id];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);
  const answeredCount = Object.keys(userAnswers).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Top Header Bar with Progress & Timer */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center justify-between gap-4">
        {/* Progress Text */}
        <div className="space-y-1">
          <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <p className="text-[11px] text-slate-500">
            {answeredCount} of {questions.length} answered
          </p>
        </div>

        {/* Timer Display */}
        {selectedTimerMinutes > 0 ? (
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono font-bold ${
              secondsRemaining < 60
                ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                : 'bg-slate-50 text-slate-800 border-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span>{formatTimer(secondsRemaining)}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 text-slate-700 border border-slate-200 text-xs font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatTimer(timeSpentSeconds)}</span>
          </div>
        )}

        <button
          onClick={() => setShowSubmitModal(true)}
          className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs transition-colors"
        >
          Submit Quiz
        </button>
      </div>

      {/* Progress Bar (Section 11) */}
      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-600 transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{currentQ.type === 'mcq' ? 'Multiple Choice Question' : 'True / False'}</span>
            <span>{currentQ.difficulty}</span>
          </div>

          <h3
            className={`text-xl sm:text-2xl font-bold text-slate-900 leading-relaxed ${
              settings.language === 'Urdu' || settings.language === 'Sindhi' ? 'font-urdu text-2xl' : ''
            }`}
          >
            {currentQ.question}
          </h3>
        </div>

        {/* Options (A, B, C, D) - Touch Friendly & Clean */}
        <div className="space-y-3">
          {(['A', 'B', 'C', 'D'] as const).map((letter) => {
            const optionText = currentQ.options[letter];
            if (!optionText && currentQ.type === 'true_false' && (letter === 'C' || letter === 'D')) {
              return null;
            }

            const isSelected = selectedOption === letter;

            return (
              <button
                key={letter}
                type="button"
                onClick={() => handleSelectOption(letter)}
                className={`w-full p-4 sm:p-5 rounded-2xl border text-left flex items-center gap-4 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 font-bold shadow-xs ring-2 ring-indigo-500'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {letter}
                </div>
                <span
                  className={`text-sm sm:text-base leading-snug flex-1 ${
                    settings.language === 'Urdu' || settings.language === 'Sindhi' ? 'font-urdu text-lg' : ''
                  }`}
                >
                  {optionText}
                </span>
                {isSelected && (
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-colors ${
              currentIndex === 0
                ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          <span className="text-xs text-slate-400 font-medium">
            {currentIndex + 1} / {questions.length}
          </span>

          {currentIndex === questions.length - 1 ? (
            <button
              type="button"
              onClick={() => setShowSubmitModal(true)}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Question Jumper Navigation Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Jump to question
        </span>
        <div className="flex flex-wrap gap-2">
          {questions.map((q, idx) => {
            const isAnswered = Boolean(userAnswers[q.id]);
            const isCurrent = currentIndex === idx;

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                  isCurrent
                    ? 'bg-indigo-600 text-white ring-2 ring-indigo-300 scale-105'
                    : isAnswered
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                title={`Question ${idx + 1}: ${isAnswered ? 'Answered' : 'Unanswered'}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-slate-900">
                Ready to Submit Your Quiz?
              </h3>
              <p className="text-xs text-slate-500">
                You have answered <strong className="text-slate-800">{answeredCount}</strong> out of{' '}
                <strong className="text-slate-800">{questions.length}</strong> questions.
              </p>
            </div>

            {answeredCount < questions.length && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  You have {questions.length - answeredCount} unanswered questions remaining.
                </span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                Keep Reviewing
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                Yes, Submit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
