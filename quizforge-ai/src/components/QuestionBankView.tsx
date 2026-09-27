import React, { useState } from 'react';
import { 
  FileText, 
  Play, 
  Copy, 
  Printer, 
  Sparkles, 
  Edit3, 
  Trash2, 
  RefreshCw, 
  Plus, 
  CheckCircle2, 
  HelpCircle, 
  BookOpen, 
  Bookmark,
  Check,
  ChevronDown,
  ChevronUp,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { Question, QuizSettings, PDFMetadata } from '../types/quiz';
import { regenerateSingleQuestionAPI } from '../services/api';

interface QuestionBankViewProps {
  questions: Question[];
  settings: QuizSettings;
  pdfMetadata: PDFMetadata | null;
  onUpdateQuestions: (updated: Question[]) => void;
  onStartQuiz: () => void;
  onOpenTeacherMode: () => void;
  onGenerateNewQuiz: () => void;
}

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({
  questions,
  settings,
  pdfMetadata,
  onUpdateQuestions,
  onStartQuiz,
  onOpenTeacherMode,
  onGenerateNewQuiz,
}) => {
  // Show answer / explanation state per question
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [revealedExplanations, setRevealedExplanations] = useState<Record<string, boolean>>({});

  // Regeneration state
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const [regenerateError, setRegenerateError] = useState<string | null>(null);

  // Edit Modal State
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);

  // Copy notification
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);

  const toggleAnswer = (id: string) => {
    setRevealedAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleExplanation = (id: string) => {
    setRevealedExplanations((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAllAnswers = () => {
    const allRevealed = questions.every((q) => revealedAnswers[q.id]);
    const newState: Record<string, boolean> = {};
    questions.forEach((q) => {
      newState[q.id] = !allRevealed;
    });
    setRevealedAnswers(newState);
  };

  const handleDelete = (id: string) => {
    if (questions.length <= 1) {
      alert('You must have at least one question in the bank.');
      return;
    }
    const updated = questions.filter((q) => q.id !== id);
    onUpdateQuestions(updated);
  };

  const handleRegenerate = async (targetQuestion: Question) => {
    if (!pdfMetadata?.extractedText && !pdfMetadata?.pdfBase64) {
      alert('Document text is required to regenerate questions.');
      return;
    }

    setRegeneratingId(targetQuestion.id);
    setRegenerateError(null);

    try {
      const response = await regenerateSingleQuestionAPI({
        extractedText: pdfMetadata.extractedText,
        pdfBase64: pdfMetadata.pdfBase64,
        settings,
        avoidQuestion: targetQuestion.question,
        allCurrentQuestions: questions.map((q) => q.question),
      });

      const updated = questions.map((q) =>
        q.id === targetQuestion.id ? response.question : q
      );
      onUpdateQuestions(updated);
    } catch (err: any) {
      console.error('Failed to regenerate single question:', err);
      setRegenerateError(err?.message || 'Failed to regenerate question. Please try again.');
    } finally {
      setRegeneratingId(null);
    }
  };

  const handleSaveEdit = (edited: Question) => {
    if (isAddingNew) {
      onUpdateQuestions([...questions, edited]);
      setIsAddingNew(false);
    } else {
      const updated = questions.map((q) => (q.id === edited.id ? edited : q));
      onUpdateQuestions(updated);
    }
    setEditingQuestion(null);
  };

  const handleCopyAll = () => {
    const formatted = questions
      .map((q, idx) => {
        return `Question ${idx + 1}: ${q.question}
A. ${q.options.A}
B. ${q.options.B}
C. ${q.options.C}
D. ${q.options.D}
Correct Answer: ${q.correctAnswer}
Explanation: ${q.explanation}
Source: ${q.source}\n`;
      })
      .join('\n');

    navigator.clipboard.writeText(formatted).then(() => {
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2500);
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Top Summary Header (Section 9) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200/50">
              <FileText className="w-3.5 h-3.5" />
              Generated MCQs Question Bank
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {pdfMetadata?.title || 'Document Questions'}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                <strong>PDF:</strong> {pdfMetadata?.fileName || 'Uploaded File'}
              </span>
              <span>•</span>
              <span><strong>Topic:</strong> {settings.selectedTopic}</span>
              <span>•</span>
              <span><strong>Difficulty:</strong> {settings.difficulty}</span>
              <span>•</span>
              <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                {questions.length} Questions
              </span>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onStartQuiz}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              Start Interactive Quiz
            </button>

            <button
              onClick={onOpenTeacherMode}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
            >
              <FileCheck className="w-4 h-4" />
              Generate Exam Paper
            </button>
          </div>
        </div>

        {/* Second Row Toolbar */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={toggleAllAnswers}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
            >
              {questions.every((q) => revealedAnswers[q.id]) ? 'Hide All Answers' : 'Reveal All Answers'}
            </button>

            <button
              onClick={handleCopyAll}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5"
            >
              {copiedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Questions</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                const newQ: Question = {
                  id: `q-custom-${Date.now()}`,
                  question: 'Enter your new custom question here...',
                  options: {
                    A: 'Option A',
                    B: 'Option B',
                    C: 'Option C',
                    D: 'Option D',
                  },
                  correctAnswer: 'A',
                  explanation: 'Explanation for why Option A is correct.',
                  source: 'Custom Assessment',
                  type: 'mcq',
                  difficulty: 'Medium',
                  topic: settings.selectedTopic,
                };
                setIsAddingNew(true);
                setEditingQuestion(newQ);
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-600" />
              Add Custom Question
            </button>
          </div>

          {/* Regenerate New Quiz Button (Section 13) */}
          <button
            onClick={onGenerateNewQuiz}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold transition-colors"
            title="Generate a completely new set of questions from this PDF"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Generate New Quiz
          </button>
        </div>
      </div>

      {regenerateError && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{regenerateError}</span>
          </div>
          <button onClick={() => setRegenerateError(null)} className="font-semibold text-rose-600">
            Dismiss
          </button>
        </div>
      )}

      {/* Questions Cards List (Section 9) */}
      <div className="space-y-4">
        {questions.map((q, index) => {
          const isAnswerRevealed = revealedAnswers[q.id];
          const isExplanationRevealed = revealedExplanations[q.id];
          const isRegeneratingThis = regeneratingId === q.id;

          return (
            <div
              key={q.id}
              className={`p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4 relative ${
                isRegeneratingThis ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              {/* Question Header & Meta */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {q.difficulty}
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {q.type === 'mcq' ? 'MCQ' : 'True/False'}
                  </span>
                  {q.topic && (
                    <span className="text-[11px] text-slate-500 hidden sm:inline-block">
                      • {q.topic}
                    </span>
                  )}
                </div>

                {/* Source Badge (Section 20) */}
                {q.source && (
                  <span className="text-[11px] font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200 shrink-0">
                    Source: <strong className="text-slate-700">{q.source}</strong>
                  </span>
                )}
              </div>

              {/* Question Body Text */}
              <p
                className={`text-slate-900 font-bold text-base leading-relaxed ${
                  settings.language === 'Urdu' || settings.language === 'Sindhi' ? 'font-urdu text-lg' : ''
                }`}
              >
                {q.question}
              </p>

              {/* Options Grid (A, B, C, D) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {(['A', 'B', 'C', 'D'] as const).map((letter) => {
                  const optionText = q.options[letter];
                  if (!optionText && q.type === 'true_false' && (letter === 'C' || letter === 'D')) {
                    return null;
                  }

                  const isCorrect = q.correctAnswer === letter;
                  const showAsCorrect = isAnswerRevealed && isCorrect;

                  return (
                    <div
                      key={letter}
                      className={`p-3 rounded-2xl border text-sm flex items-center gap-3 transition-all ${
                        showAsCorrect
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold ring-1 ring-emerald-400'
                          : 'bg-slate-50/70 border-slate-200 text-slate-800'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          showAsCorrect
                            ? 'bg-emerald-600 text-white'
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
                        {optionText}
                      </span>
                      {showAsCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Explanation Reveal Box */}
              {isExplanationRevealed && (
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs sm:text-sm text-amber-950 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    <span>Educational Explanation:</span>
                  </div>
                  <p className="leading-relaxed pl-5 text-amber-900/90">
                    {q.explanation}
                  </p>
                </div>
              )}

              {/* Question Action Buttons (Show Answer, Show Explanation, Edit, Regenerate, Delete) */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={() => toggleAnswer(q.id)}
                    className={`px-3 py-1.5 rounded-lg border transition-colors ${
                      isAnswerRevealed
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {isAnswerRevealed ? 'Hide Answer' : 'Show Answer'}
                  </button>

                  <button
                    onClick={() => toggleExplanation(q.id)}
                    className={`px-3 py-1.5 rounded-lg border transition-colors ${
                      isExplanationRevealed
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {isExplanationRevealed ? 'Hide Explanation' : 'Show Explanation'}
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setIsAddingNew(false);
                      setEditingQuestion(q);
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    title="Edit Question"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleRegenerate(q)}
                    disabled={isRegeneratingThis}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    title="Regenerate this question with AI"
                  >
                    <RefreshCw className={`w-4 h-4 ${isRegeneratingThis ? 'animate-spin text-indigo-600' : ''}`} />
                  </button>

                  <button
                    onClick={() => handleDelete(q.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Question Modal */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {isAddingNew ? 'Add Custom Question' : 'Edit Question'}
              </h3>
              <button
                onClick={() => setEditingQuestion(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            {/* Question Text Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-600">Question Text</label>
              <textarea
                value={editingQuestion.question}
                onChange={(e) =>
                  setEditingQuestion({ ...editingQuestion, question: e.target.value })
                }
                rows={3}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Options A, B, C, D */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase text-slate-600">Options & Correct Answer</label>
              {(['A', 'B', 'C', 'D'] as const).map((letter) => (
                <div key={letter} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingQuestion({ ...editingQuestion, correctAnswer: letter })}
                    className={`w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center shrink-0 transition-all ${
                      editingQuestion.correctAnswer === letter
                        ? 'bg-emerald-600 text-white ring-2 ring-emerald-300'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                    title="Click to set as correct answer"
                  >
                    {letter}
                  </button>
                  <input
                    type="text"
                    value={editingQuestion.options[letter] || ''}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        options: {
                          ...editingQuestion.options,
                          [letter]: e.target.value,
                        },
                      })
                    }
                    className="flex-1 px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  {editingQuestion.correctAnswer === letter && (
                    <span className="text-[11px] font-bold text-emerald-600 shrink-0">Correct</span>
                  )}
                </div>
              ))}
            </div>

            {/* Explanation Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-600">Explanation</label>
              <textarea
                value={editingQuestion.explanation}
                onChange={(e) =>
                  setEditingQuestion({ ...editingQuestion, explanation: e.target.value })
                }
                rows={2}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Source Reference */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-600">Source / Page Reference</label>
              <input
                type="text"
                value={editingQuestion.source}
                onChange={(e) =>
                  setEditingQuestion({ ...editingQuestion, source: e.target.value })
                }
                placeholder="e.g. Chapter 2, Page 14"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setEditingQuestion(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveEdit(editingQuestion)}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                Save Question
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
