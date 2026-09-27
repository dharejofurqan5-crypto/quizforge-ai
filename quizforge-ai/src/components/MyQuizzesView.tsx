import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Play, 
  FileText, 
  FileCheck, 
  Copy, 
  Trash2, 
  Award, 
  Calendar, 
  FolderOpen,
  Plus,
  ArrowUpDown,
  Tag
} from 'lucide-react';
import { SavedQuiz } from '../types/quiz';

interface MyQuizzesViewProps {
  quizzes: SavedQuiz[];
  onOpenQuiz: (quiz: SavedQuiz, mode: 'quiz' | 'bank' | 'teacher') => void;
  onDuplicateQuiz: (id: string) => void;
  onDeleteQuiz: (id: string) => void;
  onCreateNewQuiz: () => void;
}

export const MyQuizzesView: React.FC<MyQuizzesViewProps> = ({
  quizzes,
  onOpenQuiz,
  onDuplicateQuiz,
  onDeleteQuiz,
  onCreateNewQuiz,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'score' | 'questions'>('newest');

  // Filter logic
  const filteredQuizzes = quizzes
    .filter((quiz) => {
      // Search query
      const matchSearch =
        quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quiz.pdfName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (quiz.settings.selectedTopic &&
          quiz.settings.selectedTopic.toLowerCase().includes(searchQuery.toLowerCase()));

      // Difficulty filter
      const matchDifficulty =
        difficultyFilter === 'All' || quiz.settings.difficulty === difficultyFilter;

      // Status filter
      const isAttempted = Boolean(quiz.lastAttemptResult);
      const matchStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Attempted' && isAttempted) ||
        (statusFilter === 'Unattempted' && !isAttempted);

      return matchSearch && matchDifficulty && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'score') {
        const scoreA = a.bestResult?.percentage || 0;
        const scoreB = b.bestResult?.percentage || 0;
        return scoreB - scoreA;
      }
      if (sortBy === 'questions') {
        return b.questions.length - a.questions.length;
      }
      return 0;
    });

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Quizzes & Question Banks
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Stored assessments and practice tests saved in your local workspace.
          </p>
        </div>

        <button
          onClick={onCreateNewQuiz}
          className="self-start sm:self-center inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create New Quiz
        </button>
      </div>

      {/* Search and Filters Bar (Section 15) */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by quiz title, PDF book name, or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Difficulty Filter */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
            <span className="text-slate-400 font-medium">Difficulty:</span>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="bg-transparent font-semibold text-slate-700 focus:outline-none"
            >
              <option value="All">All</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
              <option value="Mixed">Mixed</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
            <span className="text-slate-400 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent font-semibold text-slate-700 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Attempted">Attempted</option>
              <option value="Unattempted">Not Attempted</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-transparent font-semibold text-slate-700 focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="score">Highest Score</option>
              <option value="questions">Most Questions</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quizzes List or Empty State */}
      {filteredQuizzes.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300 space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <FolderOpen className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-base">No matching quizzes found</h3>
            <p className="text-xs text-slate-500">
              {quizzes.length === 0
                ? 'Upload a PDF to generate your first quiz.'
                : 'Try adjusting your search query or difficulty filters.'}
            </p>
          </div>
          {quizzes.length === 0 && (
            <button
              onClick={onCreateNewQuiz}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs shadow-xs"
            >
              Upload PDF Now
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Title & Demo Tag */}
                <div className="flex items-start justify-between gap-2">
                  <h3
                    onClick={() => onOpenQuiz(quiz, 'bank')}
                    className="font-bold text-slate-900 text-base line-clamp-1 hover:text-indigo-600 cursor-pointer transition-colors"
                  >
                    {quiz.title}
                  </h3>
                  {quiz.isDemo && (
                    <span className="shrink-0 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md">
                      Demo Data
                    </span>
                  )}
                </div>

                {/* PDF Filename & Date */}
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5 truncate max-w-[200px]" title={quiz.pdfName}>
                    <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{quiz.pdfName}</span>
                  </span>
                  <span className="flex items-center gap-1 shrink-0 text-[11px]">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {formatDate(quiz.createdAt)}
                  </span>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 text-xs pt-0.5">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                    {quiz.questions.length} Questions
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-medium border border-indigo-100">
                    {quiz.settings.difficulty}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                    {quiz.settings.language}
                  </span>
                  {quiz.settings.selectedTopic && quiz.settings.selectedTopic !== 'Entire PDF' && (
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium truncate max-w-[130px]">
                      {quiz.settings.selectedTopic}
                    </span>
                  )}
                </div>

                {/* Attempt Status & Score */}
                {quiz.bestResult ? (
                  <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-xs flex items-center justify-between text-emerald-950">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span>Best Score: {quiz.bestResult.score} / {quiz.bestResult.total}</span>
                    </div>
                    <span className="font-extrabold text-emerald-700 text-sm">
                      {quiz.bestResult.percentage}%
                    </span>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                    <span>Not attempted yet</span>
                    <span className="text-[11px] text-indigo-600 font-semibold">Ready</span>
                  </div>
                )}
              </div>

              {/* Actions Toolbar (Open, Start Quiz, Exam Paper, Duplicate, Delete) */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onOpenQuiz(quiz, 'bank')}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                  >
                    Bank
                  </button>

                  <button
                    onClick={() => onOpenQuiz(quiz, 'teacher')}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                  >
                    Paper
                  </button>

                  <button
                    onClick={() => onDuplicateQuiz(quiz.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    title="Duplicate Quiz"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Delete "${quiz.title}"?`)) {
                        onDeleteQuiz(quiz.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Quiz"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => onOpenQuiz(quiz, 'quiz')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Start Quiz
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
