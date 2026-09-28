import React from 'react';
import { 
  Play, 
  RotateCcw, 
  AlignLeft, 
  FolderTree, 
  BookOpen, 
  Layers, 
  Sparkles, 
  Award,
  Globe,
  Sun,
  Moon,
  Save,
  CheckCircle2
} from 'lucide-react';

interface HeaderProps {
  currentMode: 'curriculum' | 'playground' | 'projects' | 'landing';
  onSelectMode: (mode: 'curriculum' | 'playground' | 'projects' | 'landing') => void;
  onRun: () => void;
  onFormat: () => void;
  onReset: () => void;
  onOpenSkillGraph: () => void;
  isRunning: boolean;
  language: 'ar' | 'en';
  onToggleLanguage: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  completedCount: number;
  totalLessons: number;
  streakDays: number;
  savedIndicator: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  onRun,
  onFormat,
  onReset,
  onOpenSkillGraph,
  isRunning,
  language,
  onToggleLanguage,
  theme,
  onToggleTheme,
  completedCount,
  totalLessons,
  streakDays,
  savedIndicator,
}) => {
  const isAr = language === 'ar';

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-4 flex items-center justify-between select-none z-30 sticky top-0">
      {/* Brand & Mode Navigation */}
      <div className="flex items-center gap-6">
        <button 
          onClick={() => onSelectMode('landing')}
          className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-bold text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent">
              Flutter<span className="text-cyan-400">Lab</span>
            </span>
            <span className="text-[10px] text-slate-400 -mt-1 font-medium hidden sm:inline">
              {isAr ? 'بيئة فلاتر التفاعلية' : 'Interactive IDE'}
            </span>
          </div>
        </button>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800/80">
          <button
            onClick={() => onSelectMode('curriculum')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              currentMode === 'curriculum'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            {isAr ? 'المنهج التعليمي' : 'Curriculum'}
          </button>

          <button
            onClick={() => onSelectMode('playground')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              currentMode === 'playground'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            {isAr ? 'المختبر الفوري' : 'Playground'}
          </button>

          <button
            onClick={() => onSelectMode('projects')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              currentMode === 'projects'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5 text-emerald-400" />
            {isAr ? 'المشاريع الحقيقية' : 'Projects'}
          </button>
        </nav>
      </div>

      {/* Primary Actions (Run, Format, Reset) */}
      <div className="flex items-center gap-2">
        <button
          onClick={onRun}
          disabled={isRunning}
          className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-lg font-semibold text-xs text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/25 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          title="Shortcut: Ctrl+Enter / Cmd+Enter"
        >
          <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
          <span>{isAr ? (isRunning ? 'جارِ التشغيل...' : 'تشغيل (Run)') : (isRunning ? 'Running...' : 'Run')}</span>
        </button>

        <button
          onClick={onFormat}
          className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
          title={isAr ? 'تنسيق الكود (Dart Format)' : 'Format Dart Code'}
        >
          <AlignLeft className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">{isAr ? 'تنسيق' : 'Format'}</span>
        </button>

        <button
          onClick={onReset}
          className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
          title={isAr ? 'إعادة ضبط الكود الأصلي' : 'Reset to Starter Code'}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isAr ? 'إعادة تعيين' : 'Reset'}</span>
        </button>

        {/* Autosave status indicator */}
        <div className="hidden lg:flex items-center gap-1 text-[11px] text-slate-400 px-2 py-1 rounded bg-slate-900/50 border border-slate-800/60">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          <span>{isAr ? 'محفوظ محلياً' : 'Autosaved'}</span>
        </div>
      </div>

      {/* Utilities: Skill Graph, Language, Theme, Progress */}
      <div className="flex items-center gap-2">
        {/* Skill Graph Button */}
        <button
          onClick={onOpenSkillGraph}
          className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">{isAr ? 'خريطة المهارات' : 'Skills'}</span>
        </button>

        {/* Progress summary badge */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 bg-slate-900 rounded-lg border border-slate-800 text-xs">
          <span className="text-slate-400">{isAr ? 'التقدم:' : 'Progress:'}</span>
          <span className="font-bold text-cyan-400">{completedCount}/{totalLessons}</span>
          <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500" 
              style={{ width: `${Math.round((completedCount / Math.max(1, totalLessons)) * 100)}%` }}
            />
          </div>
        </div>

        {/* Language Switch */}
        <button
          onClick={onToggleLanguage}
          className="px-2 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
          title={isAr ? 'التبديل إلى الإنجليزية' : 'Switch to Arabic'}
        >
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <span>{isAr ? 'EN' : 'عربي'}</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
        </button>
      </div>
    </header>
  );
};
