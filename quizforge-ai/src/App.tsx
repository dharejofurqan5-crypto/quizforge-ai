/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeDashboard } from './components/HomeDashboard';
import { PDFUploadSection } from './components/PDFUploadSection';
import { PDFAnalysisSummary } from './components/PDFAnalysisSummary';
import { QuestionBankView } from './components/QuestionBankView';
import { InteractiveQuizView } from './components/InteractiveQuizView';
import { QuizResultView } from './components/QuizResultView';
import { TeacherQuestionPaperView } from './components/TeacherQuestionPaperView';
import { MyQuizzesView } from './components/MyQuizzesView';
import { AboutModal } from './components/AboutModal';

import { PDFMetadata, Question, QuizSettings, SavedQuiz, QuizResult } from './types/quiz';
import { 
  getSavedQuizzes, 
  saveQuiz, 
  deleteQuiz, 
  duplicateQuiz, 
  recordQuizAttempt 
} from './services/storage';
import { DEMO_PDF_METADATA, DEMO_QUESTIONS, DEMO_SAVED_QUIZ } from './data/demoData';
import { generateQuestionsAPI } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);

  // PDF Document State
  const [currentPdf, setCurrentPdf] = useState<PDFMetadata | null>(null);

  // Active Assessment State
  const [currentQuizId, setCurrentQuizId] = useState<string>(`quiz-${Date.now()}`);
  const [currentQuizTitle, setCurrentQuizTitle] = useState<string>('Assessment');
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [currentSettings, setCurrentSettings] = useState<QuizSettings>({
    numberOfQuestions: 10,
    difficulty: 'Mixed',
    questionType: 'MCQ',
    selectedTopic: 'Entire PDF',
    language: 'English',
    timerMinutes: 10,
  });

  // Quiz Result State
  const [currentResult, setCurrentResult] = useState<QuizResult | null>(null);

  // Persisted Quizzes State
  const [savedQuizzes, setSavedQuizzes] = useState<SavedQuiz[]>([]);

  // Load saved quizzes on mount
  useEffect(() => {
    const list = getSavedQuizzes();
    setSavedQuizzes(list);
  }, []);

  // Handler: When PDF analysis finishes
  const handleAnalysisComplete = (metadata: PDFMetadata) => {
    setCurrentPdf(metadata);
    setCurrentQuizTitle(metadata.title || metadata.fileName.replace(/\.pdf$/i, ''));
    // Stay in 'upload' tab to show the summary & settings
  };

  // Handler: When user generates questions from settings
  const handleQuestionsGenerated = (
    questions: Question[],
    settings: QuizSettings,
    targetMode: 'bank' | 'quiz' | 'both'
  ) => {
    const newQuizId = `quiz-${Date.now()}`;
    setCurrentQuizId(newQuizId);
    setCurrentQuestions(questions);
    setCurrentSettings(settings);

    // Save to local storage
    const newSavedQuiz: SavedQuiz = {
      id: newQuizId,
      title: currentPdf?.title || currentPdf?.fileName.replace(/\.pdf$/i, '') || 'Custom Assessment',
      pdfName: currentPdf?.fileName || 'Document.pdf',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      settings,
      questions,
      summary: currentPdf?.summary,
      isDemo: false,
    };

    const updatedList = saveQuiz(newSavedQuiz);
    setSavedQuizzes(updatedList);

    if (targetMode === 'quiz') {
      setActiveTab('quiz');
    } else {
      setActiveTab('bank');
    }
  };

  // Handler: Load Demo Data
  const handleLoadDemo = () => {
    setCurrentPdf(DEMO_PDF_METADATA);
    setCurrentQuizId(DEMO_SAVED_QUIZ.id);
    setCurrentQuizTitle(DEMO_SAVED_QUIZ.title);
    setCurrentQuestions(DEMO_QUESTIONS);
    setCurrentSettings(DEMO_SAVED_QUIZ.settings);
    setActiveTab('quiz');
  };

  // Handler: Open Quiz from My Quizzes or Recent Cards
  const handleOpenQuiz = (quiz: SavedQuiz, mode: 'quiz' | 'bank' | 'teacher') => {
    setCurrentQuizId(quiz.id);
    setCurrentQuizTitle(quiz.title);
    setCurrentQuestions(quiz.questions);
    setCurrentSettings(quiz.settings);

    if (!currentPdf || currentPdf.fileName !== quiz.pdfName) {
      setCurrentPdf({
        fileName: quiz.pdfName,
        fileSize: 1024 * 1024,
        pageCount: 10,
        extractedText: quiz.summary || '',
        title: quiz.title,
        summary: quiz.summary,
      });
    }

    setActiveTab(mode);
  };

  // Handler: Complete Interactive Quiz
  const handleFinishQuiz = (result: QuizResult) => {
    setCurrentResult(result);
    // Record attempt in storage
    const updated = recordQuizAttempt(currentQuizId, result);
    if (updated) {
      setSavedQuizzes(getSavedQuizzes());
    }
    setActiveTab('result');
  };

  // Handler: Update questions in bank (after edit/delete/custom question)
  const handleUpdateQuestions = (updated: Question[]) => {
    setCurrentQuestions(updated);

    // Update in savedQuizzes
    const existing = savedQuizzes.find((q) => q.id === currentQuizId);
    if (existing) {
      const updatedQuiz: SavedQuiz = {
        ...existing,
        questions: updated,
        updatedAt: new Date().toISOString(),
      };
      saveQuiz(updatedQuiz);
      setSavedQuizzes(getSavedQuizzes());
    }
  };

  // Handler: Generate New Quiz (fresh alternate questions from same PDF)
  const handleGenerateNewQuiz = async () => {
    if (!currentPdf?.extractedText && !currentPdf?.pdfBase64) {
      setActiveTab('upload');
      return;
    }

    try {
      const response = await generateQuestionsAPI({
        extractedText: currentPdf.extractedText,
        pdfBase64: currentPdf.pdfBase64,
        settings: currentSettings,
        existingQuestions: currentQuestions.map((q) => q.question),
      });

      if (response.questions && response.questions.length > 0) {
        handleQuestionsGenerated(response.questions, currentSettings, 'bank');
      }
    } catch (e: any) {
      alert(e?.message || 'Failed to generate new quiz. Please try again.');
    }
  };

  // Handler: Duplicate Quiz
  const handleDuplicateQuiz = (id: string) => {
    duplicateQuiz(id);
    setSavedQuizzes(getSavedQuizzes());
  };

  // Handler: Delete Quiz
  const handleDeleteQuiz = (id: string) => {
    deleteQuiz(id);
    setSavedQuizzes(getSavedQuizzes());
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentPdf={currentPdf}
        hasQuestions={currentQuestions.length > 0}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* View 1: Home Dashboard */}
        {activeTab === 'home' && (
          <HomeDashboard
            onStartUpload={() => setActiveTab('upload')}
            onTryDemo={handleLoadDemo}
            savedQuizzes={savedQuizzes}
            onOpenQuiz={handleOpenQuiz}
            currentPdf={currentPdf}
            onOpenAbout={() => setIsAboutOpen(true)}
          />
        )}

        {/* View 2: Upload / Generation Setup */}
        {activeTab === 'upload' && (
          <div>
            {!currentPdf ? (
              <PDFUploadSection
                onAnalysisComplete={handleAnalysisComplete}
                onLoadDemo={handleLoadDemo}
              />
            ) : (
              <PDFAnalysisSummary
                metadata={currentPdf}
                onQuestionsGenerated={handleQuestionsGenerated}
                onResetUpload={() => setCurrentPdf(null)}
              />
            )}
          </div>
        )}

        {/* View 3: MCQ Question Bank */}
        {activeTab === 'bank' && (
          <QuestionBankView
            questions={currentQuestions}
            settings={currentSettings}
            pdfMetadata={currentPdf}
            onUpdateQuestions={handleUpdateQuestions}
            onStartQuiz={() => setActiveTab('quiz')}
            onOpenTeacherMode={() => setActiveTab('teacher')}
            onGenerateNewQuiz={handleGenerateNewQuiz}
          />
        )}

        {/* View 4: Interactive Quiz Mode */}
        {activeTab === 'quiz' && (
          <InteractiveQuizView
            quizId={currentQuizId}
            questions={currentQuestions.length > 0 ? currentQuestions : DEMO_QUESTIONS}
            settings={currentSettings}
            pdfTitle={currentPdf?.title || currentQuizTitle}
            onFinishQuiz={handleFinishQuiz}
            onBackToBank={() => setActiveTab('bank')}
          />
        )}

        {/* View 5: Quiz Results */}
        {activeTab === 'result' && currentResult && (
          <QuizResultView
            result={currentResult}
            questions={currentQuestions}
            settings={currentSettings}
            pdfTitle={currentPdf?.title || currentQuizTitle}
            onTryAgain={() => setActiveTab('quiz')}
            onNewQuiz={handleGenerateNewQuiz}
            onBackToBank={() => setActiveTab('bank')}
          />
        )}

        {/* View 6: Teacher Question Paper Generator */}
        {activeTab === 'teacher' && (
          <TeacherQuestionPaperView
            questions={currentQuestions.length > 0 ? currentQuestions : DEMO_QUESTIONS}
            settings={currentSettings}
            pdfTitle={currentPdf?.title || currentQuizTitle}
            onBackToBank={() => setActiveTab('bank')}
          />
        )}

        {/* View 7: My Quizzes Saved Manager */}
        {activeTab === 'my-quizzes' && (
          <MyQuizzesView
            quizzes={savedQuizzes}
            onOpenQuiz={handleOpenQuiz}
            onDuplicateQuiz={handleDuplicateQuiz}
            onDeleteQuiz={handleDeleteQuiz}
            onCreateNewQuiz={() => {
              setCurrentPdf(null);
              setActiveTab('upload');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 no-print mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-medium text-slate-700">
            QuizForge AI • Turn Any PDF into Smart MCQs & Quizzes
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAboutOpen(true)}
              className="text-slate-500 hover:text-indigo-600 transition-colors"
            >
              Privacy & Integrity
            </button>
            <span>•</span>
            <button
              onClick={handleLoadDemo}
              className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
            >
              Demo Assessment
            </button>
          </div>
        </div>
      </footer>

      {/* About Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </div>
  );
}
