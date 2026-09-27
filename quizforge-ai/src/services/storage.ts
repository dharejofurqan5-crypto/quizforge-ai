import { SavedQuiz, QuizResult } from '../types/quiz';
import { DEMO_SAVED_QUIZ } from '../data/demoData';

const STORAGE_KEY = 'quizforge_saved_quizzes_v1';

export function getSavedQuizzes(): SavedQuiz[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed with initial demo quiz so user has immediate content to explore
      const initial = [DEMO_SAVED_QUIZ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Error reading saved quizzes from storage:', e);
    return [DEMO_SAVED_QUIZ];
  }
}

export function saveQuiz(quiz: SavedQuiz): SavedQuiz[] {
  try {
    const quizzes = getSavedQuizzes();
    const existingIndex = quizzes.findIndex((q) => q.id === quiz.id);
    let updated: SavedQuiz[];

    if (existingIndex >= 0) {
      updated = [...quizzes];
      updated[existingIndex] = {
        ...quiz,
        updatedAt: new Date().toISOString(),
      };
    } else {
      updated = [quiz, ...quizzes];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error saving quiz:', e);
    return [];
  }
}

export function deleteQuiz(id: string): SavedQuiz[] {
  try {
    const quizzes = getSavedQuizzes();
    const filtered = quizzes.filter((q) => q.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (e) {
    console.error('Error deleting quiz:', e);
    return [];
  }
}

export function duplicateQuiz(id: string): SavedQuiz | null {
  try {
    const quizzes = getSavedQuizzes();
    const original = quizzes.find((q) => q.id === id);
    if (!original) return null;

    const copy: SavedQuiz = {
      ...original,
      id: `quiz-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title: `${original.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDemo: false,
      bestResult: undefined,
      lastAttemptResult: undefined,
    };

    saveQuiz(copy);
    return copy;
  } catch (e) {
    console.error('Error duplicating quiz:', e);
    return null;
  }
}

export function recordQuizAttempt(quizId: string, result: QuizResult): SavedQuiz | null {
  try {
    const quizzes = getSavedQuizzes();
    const quiz = quizzes.find((q) => q.id === quizId);
    if (!quiz) return null;

    const isBetter = !quiz.bestResult || result.score > quiz.bestResult.score;

    const updatedQuiz: SavedQuiz = {
      ...quiz,
      lastAttemptResult: result,
      bestResult: isBetter ? result : quiz.bestResult,
      updatedAt: new Date().toISOString(),
    };

    saveQuiz(updatedQuiz);
    return updatedQuiz;
  } catch (e) {
    console.error('Error recording quiz attempt:', e);
    return null;
  }
}
