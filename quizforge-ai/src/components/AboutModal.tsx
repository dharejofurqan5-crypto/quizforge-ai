import React from 'react';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  BookOpen, 
  CheckCircle2, 
  Cpu, 
  School, 
  Award,
  Layers
} from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">About QuizForge AI</h3>
              <p className="text-xs text-slate-500">Turn Any PDF into Smart MCQs & Quizzes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mission & Purpose */}
        <div className="space-y-2">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            Empowering Educational Assessment
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            QuizForge AI is an educational platform designed for school teachers, university professors, tuition centers, competitive exam aspirants, and independent learners. By analyzing textbooks and study notes, QuizForge AI generates pedagogically sound multiple-choice questions, interactive practice tests, and formatted exam papers.
          </p>
        </div>

        {/* Strict Source Grounding */}
        <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-2 text-xs text-indigo-950">
          <div className="flex items-center gap-1.5 font-bold text-indigo-900">
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
            <span>Strict Academic Grounding Policy</span>
          </div>
          <p className="leading-relaxed">
            QuizForge AI does not invent or hallucinate facts. Every question, correct answer, and explanation is directly supported by the uploaded PDF. Each question is tagged with its source chapter, module, or section reference to enable direct verification.
          </p>
        </div>

        {/* Privacy Notice (Section 22) */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Privacy & Document Handling</span>
          </div>
          <p className="leading-relaxed">
            Your uploaded document is used exclusively to generate educational content. Documents are processed in temporary session memory and your question banks and quiz results are stored locally in your browser.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
            <span className="font-bold text-slate-800">Interactive Quiz Mode</span>
            <p className="text-slate-500">Timed sessions, single-question focus, and real-time score analytics.</p>
          </div>
          <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
            <span className="font-bold text-slate-800">Teacher Exam Papers</span>
            <p className="text-slate-500">Standard A4 printable test sheets with separate teacher answer keys.</p>
          </div>
          <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
            <span className="font-bold text-slate-800">Multi-Language</span>
            <p className="text-slate-500">Full native typography support for English, Urdu, and Sindhi.</p>
          </div>
          <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
            <span className="font-bold text-slate-800">Regeneration Engine</span>
            <p className="text-slate-500">Instantly replace individual questions or generate alternate quizzes.</p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
