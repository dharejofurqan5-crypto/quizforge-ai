import React, { useState } from 'react';
import { 
  Sparkles, 
  FileText, 
  HelpCircle, 
  BookOpen, 
  GraduationCap, 
  Bookmark, 
  Menu, 
  X,
  FileCheck,
  CheckCircle2,
  FolderOpen
} from 'lucide-react';
import { PDFMetadata } from '../types/quiz';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentPdf: PDFMetadata | null;
  hasQuestions: boolean;
  onOpenAbout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentPdf,
  hasQuestions,
  onOpenAbout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: BookOpen },
    { id: 'upload', label: 'Create Quiz', icon: Sparkles },
    ...(hasQuestions ? [
      { id: 'bank', label: 'Question Bank', icon: FileText },
      { id: 'quiz', label: 'Interactive Quiz', icon: GraduationCap },
      { id: 'teacher', label: 'Teacher Paper', icon: FileCheck },
    ] : []),
    { id: 'my-quizzes', label: 'My Quizzes', icon: FolderOpen },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  QuizForge<span className="text-indigo-600 font-bold ml-0.5">AI</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200/60 hidden sm:inline-block">
                  Educational
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">
                Turn Any PDF into Smart MCQs & Quizzes
              </p>
            </div>
          </div>

          {/* Current Active PDF Pill Indicator */}
          {currentPdf && (
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-slate-100/80 rounded-full border border-slate-200 text-xs text-slate-700 max-w-xs truncate">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="font-medium text-slate-500">Active:</span>
              <span className="truncate font-semibold text-slate-800" title={currentPdf.fileName}>
                {currentPdf.fileName}
              </span>
              <span className="text-[10px] bg-white px-1.5 py-0.5 rounded-md font-medium text-slate-500 border border-slate-200">
                {currentPdf.pageCount}p
              </span>
            </div>
          )}

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200/50 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}

            <button
              onClick={onOpenAbout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-colors ml-1"
              title="About QuizForge AI"
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              About
            </button>
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-4 space-y-1">
          {currentPdf && (
            <div className="mb-3 p-2.5 bg-indigo-50/60 rounded-lg border border-indigo-100 flex items-center gap-2 text-xs text-indigo-900">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
              <div className="truncate">
                <p className="font-semibold truncate">{currentPdf.fileName}</p>
                <p className="text-[11px] text-indigo-600">{currentPdf.pageCount} pages loaded</p>
              </div>
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                {item.label}
              </button>
            );
          })}

          <button
            onClick={() => {
              onOpenAbout();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-slate-500" />
            About QuizForge AI
          </button>
        </div>
      )}
    </header>
  );
};
