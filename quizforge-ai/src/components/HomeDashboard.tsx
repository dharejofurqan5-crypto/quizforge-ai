import React from 'react';
import { 
  Sparkles, 
  Upload, 
  Play, 
  FileText, 
  GraduationCap, 
  FileCheck, 
  BarChart3, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight,
  School,
  Clock,
  Award,
  Layers,
  HelpCircle,
  FolderOpen
} from 'lucide-react';
import { SavedQuiz, PDFMetadata } from '../types/quiz';

interface HomeDashboardProps {
  onStartUpload: () => void;
  onTryDemo: () => void;
  savedQuizzes: SavedQuiz[];
  onOpenQuiz: (quiz: SavedQuiz, mode: 'quiz' | 'bank' | 'teacher') => void;
  currentPdf: PDFMetadata | null;
  onOpenAbout: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onStartUpload,
  onTryDemo,
  savedQuizzes,
  onOpenQuiz,
  currentPdf,
  onOpenAbout,
}) => {
  const recentQuizzes = savedQuizzes.slice(0, 4);

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-indigo-700/30">
        {/* Subtle background glow effects */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium text-indigo-200 mb-6">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>AI-Powered Academic Assessment Generator</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 leading-[1.15]">
            QuizForge AI
          </h1>

          <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-200 via-indigo-100 to-white bg-clip-text text-transparent mb-6">
            Turn Any PDF into Smart MCQs & Quizzes
          </p>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl font-normal">
            Upload your PDF book, notes, study material, or educational document and let AI create accurate MCQs and interactive quizzes from its content.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onStartUpload}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-base shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Upload className="w-5 h-5" />
              Upload PDF & Create Quiz
            </button>

            <button
              onClick={onTryDemo}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-base backdrop-blur-md border border-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Play className="w-5 h-5 text-amber-300" />
              Try Quiz
            </button>
          </div>

          {/* Educational Target Groups */}
          <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-indigo-200">
            <span className="font-semibold text-white mr-1">Designed for:</span>
            {['School Teachers', 'Students', 'Tuition Centers', 'College & University', 'Competitive Exams', 'Self-Study'].map((tag) => (
              <span key={tag} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Quick Cards (Rule 26) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Dashboard
          </h2>
          <span className="text-xs font-medium text-slate-500">Fast Actions</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {/* Card 1: Upload PDF */}
          <div 
            onClick={onStartUpload}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-base mb-1">
                📚 Upload PDF
              </h3>
              <p className="text-xs text-slate-500">Analyze book or notes</p>
            </div>
          </div>

          {/* Card 2: Generate MCQs */}
          <div 
            onClick={onStartUpload}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-base mb-1">
                📝 Generate MCQs
              </h3>
              <p className="text-xs text-slate-500">Build question bank</p>
            </div>
          </div>

          {/* Card 3: Start Quiz */}
          <div 
            onClick={() => {
              if (savedQuizzes.length > 0) {
                onOpenQuiz(savedQuizzes[0], 'quiz');
              } else {
                onTryDemo();
              }
            }}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-base mb-1">
                🎯 Start Quiz
              </h3>
              <p className="text-xs text-slate-500">Interactive testing</p>
            </div>
          </div>

          {/* Card 4: Question Papers */}
          <div 
            onClick={() => {
              if (savedQuizzes.length > 0) {
                onOpenQuiz(savedQuizzes[0], 'teacher');
              } else {
                onTryDemo();
              }
            }}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-base mb-1">
                📄 Question Papers
              </h3>
              <p className="text-xs text-slate-500">Teacher print mode</p>
            </div>
          </div>

          {/* Card 5: My Results */}
          <div 
            onClick={() => {
              if (savedQuizzes.length > 0) {
                onOpenQuiz(savedQuizzes[0], 'bank');
              } else {
                onTryDemo();
              }
            }}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group flex flex-col justify-between col-span-2 sm:col-span-1"
          >
            <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-base mb-1">
                📊 My Results
              </h3>
              <p className="text-xs text-slate-500">Scores & review</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Quizzes & Activity */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Recent Quizzes
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Access your generated quizzes and test results
            </p>
          </div>
          {savedQuizzes.length > 0 && (
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
              {savedQuizzes.length} Total Saved
            </span>
          )}
        </div>

        {savedQuizzes.length === 0 ? (
          /* Sample Empty State (Rule 27) */
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-dashed border-slate-300 text-center max-w-xl mx-auto space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <BookOpen className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">No quizzes yet</h3>
              <p className="text-sm text-slate-500">
                Your generated quizzes will appear here. Upload a book, notes, or study material to start creating AI-generated quizzes.
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={onStartUpload}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm transition-all"
              >
                Upload PDF
              </button>
              <button
                onClick={onTryDemo}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-all"
              >
                Load Sample Quiz
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-slate-900 text-base line-clamp-1 hover:text-indigo-600 transition-colors">
                      {quiz.title}
                    </h3>
                    {quiz.isDemo && (
                      <span className="shrink-0 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md">
                        Demo Data
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 flex items-center gap-1.5 truncate">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{quiz.pdfName}</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                      {quiz.questions.length} Questions
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-medium border border-indigo-100">
                      {quiz.settings.difficulty}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                      {quiz.settings.language}
                    </span>
                  </div>

                  {quiz.bestResult ? (
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-between text-xs text-emerald-900">
                      <div className="flex items-center gap-1.5 font-semibold">
                        <Award className="w-4 h-4 text-emerald-600" />
                        <span>Best Score:</span>
                      </div>
                      <span className="font-bold text-emerald-700">
                        {quiz.bestResult.score} / {quiz.bestResult.total} ({quiz.bestResult.percentage}%)
                      </span>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                      <span>Not attempted yet</span>
                      <span className="text-[11px] text-indigo-600 font-medium">Ready to take</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onOpenQuiz(quiz, 'bank')}
                    className="text-xs font-semibold text-slate-600 hover:text-indigo-600 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    Question Bank
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenQuiz(quiz, 'teacher')}
                      className="text-xs font-semibold text-slate-600 hover:text-indigo-600 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Print or view teacher exam paper"
                    >
                      Exam Paper
                    </button>

                    <button
                      onClick={() => onOpenQuiz(quiz, 'quiz')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Start Quiz
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* How QuizForge AI Works (Academic Integrity) */}
      <section className="p-6 sm:p-8 rounded-3xl bg-slate-100/80 border border-slate-200 space-y-4">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          <h3 className="text-lg font-bold text-slate-900">
            Strict Source-Grounding Guarantee
          </h3>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
          QuizForge AI operates under strict academic generation constraints. All questions, verified correct options, distractors, and explanations are extracted directly from your supplied PDF document. The system associates every question with its source chapter and page reference.
        </p>
      </section>
    </div>
  );
};
