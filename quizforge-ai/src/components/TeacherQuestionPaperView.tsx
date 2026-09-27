import React, { useState } from 'react';
import { 
  Printer, 
  Copy, 
  Check, 
  Settings, 
  School, 
  FileCheck, 
  Download, 
  Eye, 
  BookOpen, 
  ArrowLeft,
  GraduationCap
} from 'lucide-react';
import { Question, QuestionPaperConfig, QuizSettings } from '../types/quiz';

interface TeacherQuestionPaperViewProps {
  questions: Question[];
  settings: QuizSettings;
  pdfTitle?: string;
  onBackToBank: () => void;
}

export const TeacherQuestionPaperView: React.FC<TeacherQuestionPaperViewProps> = ({
  questions,
  settings,
  pdfTitle,
  onBackToBank,
}) => {
  // Active view: 'student' | 'answer-key' | 'settings'
  const [activeView, setActiveView] = useState<'student' | 'answer-key'>('student');
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);

  // Configurable Exam Header Fields (Section 17 & 18)
  const [config, setConfig] = useState<QuestionPaperConfig>({
    schoolName: 'Oxford Academic Institute & High School',
    subject: pdfTitle || 'General Sciences & Assessment',
    gradeClass: 'Grade 10 / Senior Class',
    testTitle: 'Unit Assessment Examination',
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    timeAllowed: '45 Minutes',
    maxMarks: questions.length * 2,
    generalInstructions: '1. All questions are compulsory.\n2. Choose the correct option and mark the corresponding bubble.\n3. Each question carries equal marks.',
    includeAnswerKey: true,
    includeExplanationsInKey: true,
    includeSourcesInKey: true,
    layout: 'standard',
  });

  const [isEditingConfig, setIsEditingConfig] = useState<boolean>(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyPaper = () => {
    let content = `==========================================================
${config.schoolName.toUpperCase()}
SUBJECT: ${config.subject} | CLASS: ${config.gradeClass}
EXAMINATION: ${config.testTitle}
Date: ${config.date} | Time: ${config.timeAllowed} | Max Marks: ${config.maxMarks}
==========================================================
Name: _______________________________ Roll No: ______________

INSTRUCTIONS:
${config.generalInstructions}

----------------------------------------------------------
`;

    questions.forEach((q, idx) => {
      content += `\nQ${idx + 1}. ${q.question}  [Marks: 2]
   [  ] A. ${q.options.A}
   [  ] B. ${q.options.B}
   [  ] C. ${q.options.C}
   [  ] D. ${q.options.D}\n`;
    });

    if (activeView === 'answer-key') {
      content += `\n\n==========================================================
TEACHER ANSWER KEY & PEDAGOGICAL BREAKDOWN
==========================================================\n`;
      questions.forEach((q, idx) => {
        content += `\nQ${idx + 1}: Correct Answer: [${q.correctAnswer}]
Explanation: ${q.explanation}
Source: ${q.source}\n`;
      });
    }

    navigator.clipboard.writeText(content).then(() => {
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2500);
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Non-print Top Controls Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200">
              <School className="w-3.5 h-3.5" />
              Teacher Examination Mode
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Printable Question Paper Generator
            </h2>
            <p className="text-xs text-slate-500">
              Format, edit school header, and export high-resolution A4 student test papers and teacher answer keys.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsEditingConfig(!isEditingConfig)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              <Settings className="w-4 h-4 text-slate-500" />
              {isEditingConfig ? 'Close Header Editor' : 'Edit Exam Details'}
            </button>

            <button
              onClick={handleCopyPaper}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              {copiedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>Copy Paper</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print Question Paper (PDF)
            </button>
          </div>
        </div>

        {/* Tab switch between Student Version and Teacher Answer Key */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView('student')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeView === 'student'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Student Exam Paper ({questions.length} Questions)
            </button>

            <button
              onClick={() => setActiveView('answer-key')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeView === 'answer-key'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Teacher Answer Key & Explanations
            </button>
          </div>

          <button
            onClick={onBackToBank}
            className="text-xs text-slate-500 hover:text-indigo-600 font-semibold inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Question Bank
          </button>
        </div>

        {/* Collapsible Header Edit Form (Section 17) */}
        {isEditingConfig && (
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Customize Header & Exam Meta
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-600">School / Institute Name</label>
                <input
                  type="text"
                  value={config.schoolName}
                  onChange={(e) => setConfig({ ...config, schoolName: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-600">Subject</label>
                <input
                  type="text"
                  value={config.subject}
                  onChange={(e) => setConfig({ ...config, subject: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-600">Class / Grade</label>
                <input
                  type="text"
                  value={config.gradeClass}
                  onChange={(e) => setConfig({ ...config, gradeClass: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-600">Test Title</label>
                <input
                  type="text"
                  value={config.testTitle}
                  onChange={(e) => setConfig({ ...config, testTitle: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-600">Date</label>
                <input
                  type="text"
                  value={config.date}
                  onChange={(e) => setConfig({ ...config, date: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-600">Time Allowed</label>
                <input
                  type="text"
                  value={config.timeAllowed}
                  onChange={(e) => setConfig({ ...config, timeAllowed: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-600">Maximum Marks</label>
                <input
                  type="number"
                  value={config.maxMarks}
                  onChange={(e) => setConfig({ ...config, maxMarks: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-semibold text-slate-600">General Instructions</label>
                <textarea
                  rows={2}
                  value={config.generalInstructions}
                  onChange={(e) => setConfig({ ...config, generalInstructions: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Printable Sheet (Formatted A4 layout as required by Section 18) */}
      <div className="print-container bg-white border border-slate-200 shadow-xl rounded-2xl p-8 sm:p-12 text-slate-900 space-y-6">
        {/* A4 Paper Header */}
        <div className="text-center space-y-1 pb-4 border-b-2 border-slate-900">
          <h1 className="text-2xl font-black tracking-wide uppercase">
            {config.schoolName}
          </h1>
          <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-semibold text-slate-700">
            <span>Subject: <strong>{config.subject}</strong></span>
            <span>•</span>
            <span>Class: <strong>{config.gradeClass}</strong></span>
            <span>•</span>
            <span>Test: <strong>{config.testTitle}</strong></span>
          </div>

          {/* Student Fill-in Fields */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-left text-xs font-medium border-t border-slate-200 mt-3">
            <div>
              <span>Name: </span>
              <span className="inline-block border-b border-slate-400 w-32 sm:w-36">&nbsp;</span>
            </div>
            <div>
              <span>Roll No: </span>
              <span className="inline-block border-b border-slate-400 w-20 sm:w-24">&nbsp;</span>
            </div>
            <div>
              <span>Date: </span>
              <strong>{config.date}</strong>
            </div>
            <div>
              <span>Time: </span>
              <strong>{config.timeAllowed}</strong>
              <span className="ml-3">Marks: </span>
              <strong>{config.maxMarks}</strong>
            </div>
          </div>

          {/* Instructions */}
          {config.generalInstructions && (
            <div className="pt-2 text-left text-[11px] text-slate-600 italic">
              <strong>Instructions:</strong> {config.generalInstructions}
            </div>
          )}
        </div>

        {/* View 1: Student Exam Paper (Questions & Options Only) */}
        {activeView === 'student' ? (
          <div className="space-y-6 pt-2">
            {questions.map((q, idx) => (
              <div key={q.id} className="question-item space-y-2 text-sm">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold text-slate-900 leading-snug">
                    <span className="mr-1.5 font-extrabold">{idx + 1}.</span>
                    {q.question}
                  </p>
                  <span className="text-[11px] text-slate-400 shrink-0 font-mono no-print">
                    [2 Marks]
                  </span>
                </div>

                {/* 4 Options with checkboxes / bubble circles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4 pt-0.5">
                  {(['A', 'B', 'C', 'D'] as const).map((letter) => {
                    const opt = q.options[letter];
                    if (!opt && q.type === 'true_false' && (letter === 'C' || letter === 'D')) {
                      return null;
                    }

                    return (
                      <div key={letter} className="flex items-center gap-2 text-xs text-slate-800">
                        <div className="w-4 h-4 rounded-full border border-slate-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                          {letter}
                        </div>
                        <span>{opt}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* View 2: Teacher Answer Key (Questions + Correct Answer + Explanation + Citation) */
          <div className="space-y-6 pt-2">
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900 font-semibold flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-purple-600 shrink-0" />
              <span>
                Confidential Teacher Answer Key & Textual Verification References
              </span>
            </div>

            {questions.map((q, idx) => (
              <div key={q.id} className="question-item p-4 rounded-xl border border-slate-200 text-xs space-y-2 bg-slate-50/50">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold text-slate-900 text-sm">
                    {idx + 1}. {q.question}
                  </p>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-xs shrink-0">
                    Key: {q.correctAnswer}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-600 pl-2">
                  {(['A', 'B', 'C', 'D'] as const).map((letter) => (
                    <span
                      key={letter}
                      className={letter === q.correctAnswer ? 'font-bold text-emerald-700' : ''}
                    >
                      {letter}. {q.options[letter]}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-200 text-slate-700 space-y-1">
                  <p>
                    <strong className="text-slate-900">Pedagogical Explanation:</strong> {q.explanation}
                  </p>
                  {q.source && (
                    <p className="text-slate-500 font-medium">
                      <strong>Textbook Source:</strong> {q.source}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paper Footer */}
        <div className="pt-8 border-t border-slate-300 flex justify-between items-center text-[10px] text-slate-400">
          <span>Generated by QuizForge AI • Based on verified textbook content</span>
          <span>Page 1 of 1</span>
        </div>
      </div>
    </div>
  );
};
