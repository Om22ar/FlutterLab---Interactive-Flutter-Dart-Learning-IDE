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
  CheckCircle2,
  Trophy,
  User,
  GitCompare,
  PanelLeft,
  PanelRight,
  PanelBottom,
  Focus
} from 'lucide-react';
import { CharacterConfig } from '../types/character';
import { AvatarSVG } from './AvatarSVG';

interface HeaderProps {
  currentMode: 'curriculum' | 'playground' | 'projects' | 'landing';
  onSelectMode: (mode: 'curriculum' | 'playground' | 'projects' | 'landing') => void;
  onRun: () => void;
  onFormat: () => void;
  onReset: () => void;
  onOpenSkillGraph: () => void;
  onOpenGamification: () => void;
  onOpenCharacterCreator: () => void;
  onOpenDiffModal: () => void;
  characterConfig: CharacterConfig;
  userPoints: number;
  isRunning: boolean;
  language: 'ar' | 'en';
  onToggleLanguage: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  completedCount: number;
  totalLessons: number;
  streakDays: number;
  savedIndicator: boolean;
  isSidebarVisible?: boolean;
  onToggleSidebar?: () => void;
  isRightPanelVisible?: boolean;
  onToggleRightPanel?: () => void;
  isBottomPanelVisible?: boolean;
  onToggleBottomPanel?: () => void;
  isZenMode?: boolean;
  onToggleZenMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  onRun,
  onFormat,
  onReset,
  onOpenSkillGraph,
  onOpenGamification,
  onOpenCharacterCreator,
  onOpenDiffModal,
  characterConfig,
  userPoints,
  isRunning,
  language,
  onToggleLanguage,
  theme,
  onToggleTheme,
  completedCount,
  totalLessons,
  streakDays,
  savedIndicator,
  isSidebarVisible = true,
  onToggleSidebar,
  isRightPanelVisible = true,
  onToggleRightPanel,
  isBottomPanelVisible = true,
  onToggleBottomPanel,
  isZenMode = false,
  onToggleZenMode,
}) => {
  const isAr = language === 'ar';

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-3 md:px-4 flex items-center justify-between select-none z-30 sticky top-0">
      {/* Brand & Mode Navigation */}
      <div className="flex items-center gap-4 lg:gap-6">
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
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm font-bold'
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
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm font-bold'
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
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5 text-emerald-400" />
            {isAr ? 'المشاريع الحقيقية' : 'Projects'}
          </button>
        </nav>
      </div>

      {/* Primary Actions (Run, Format, Reset, Diff) */}
      <div className="flex items-center gap-1.5 md:gap-2">
        <button
          onClick={onRun}
          disabled={isRunning}
          className="relative inline-flex items-center gap-1.5 md:gap-2 px-3.5 md:px-4 py-1.5 rounded-lg font-semibold text-xs text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/25 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
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
          title={isAr ? 'مقارنة وإعادة ضبط الكود الأصلي مع Diff' : 'Reset code to starter template with Side-by-Side Diff'}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isAr ? 'إعادة تعيين' : 'Reset'}</span>
        </button>

        <button
          onClick={onOpenDiffModal}
          className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-800/60 transition-colors hidden xl:flex items-center gap-1.5 cursor-pointer"
          title={isAr ? 'مقارنة الكود الحالي مع الحل النموذجي' : 'Compare with solution code diff'}
        >
          <GitCompare className="w-3.5 h-3.5 text-cyan-400" />
          <span>Diff</span>
        </button>

        {/* View / Focus Controls */}
        {onToggleZenMode && (
          <button
            onClick={onToggleZenMode}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
              isZenMode
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-400/20 font-bold'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
            title={isAr 
              ? (isZenMode ? 'إلغاء وضع التركيز واستعادة النوافذ' : 'وضع التركيز: إخفاء القوائم الجانبية والسفلية للتركيز الأقصى على التدريب') 
              : (isZenMode ? 'Exit Focus Mode' : 'Focus Mode: Hide sidebars & console to focus strictly on code')}
          >
            <Focus className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{isAr ? (isZenMode ? 'وضع التركيز نشط' : 'وضع التركيز') : (isZenMode ? 'Focus Active' : 'Focus Mode')}</span>
          </button>
        )}

        {/* Individual Panel Visibility Toggles */}
        <div className="hidden lg:flex items-center gap-0.5 bg-slate-900/90 p-0.5 rounded-lg border border-slate-800/80">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                isSidebarVisible ? 'bg-slate-800 text-cyan-300 shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
              title={isAr ? (isSidebarVisible ? 'إخفاء المسار التعليمي' : 'إظهار المسار التعليمي') : (isSidebarVisible ? 'Hide Curriculum Sidebar' : 'Show Curriculum Sidebar')}
            >
              <PanelLeft className="w-3.5 h-3.5" />
            </button>
          )}
          {onToggleBottomPanel && (
            <button
              onClick={onToggleBottomPanel}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                isBottomPanelVisible ? 'bg-slate-800 text-cyan-300 shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
              title={isAr ? (isBottomPanelVisible ? 'إخفاء الكونسول والاختبارات' : 'إظهار الكونسول والاختبارات') : (isBottomPanelVisible ? 'Hide Console & Tests' : 'Show Console & Tests')}
            >
              <PanelBottom className="w-3.5 h-3.5" />
            </button>
          )}
          {onToggleRightPanel && (
            <button
              onClick={onToggleRightPanel}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                isRightPanelVisible ? 'bg-slate-800 text-cyan-300 shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
              title={isAr ? (isRightPanelVisible ? 'إخفاء شجرة الويدجتس والخصائص' : 'إظهار شجرة الويدجتس والخصائص') : (isRightPanelVisible ? 'Hide Inspector & Tree' : 'Show Inspector & Tree')}
            >
              <PanelRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Autosave status indicator */}
        <div className="hidden 2xl:flex items-center gap-1 text-[11px] text-slate-400 px-2 py-1 rounded bg-slate-900/50 border border-slate-800/60">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          <span>{isAr ? 'محفوظ محلياً' : 'Autosaved'}</span>
        </div>
      </div>

      {/* Utilities: Leaderboard, Character Creator, Skill Graph, Language, Theme */}
      <div className="flex items-center gap-2">
        {/* Gamification / Leaderboard Button */}
        <button
          onClick={onOpenGamification}
          className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          title={isAr ? 'لوحة الشرف والإنجازات' : 'Leaderboard & Mastery Badges'}
        >
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-mono text-amber-300">{userPoints} pts</span>
        </button>

        {/* Character Avatar Icon Button */}
        <button
          onClick={onOpenCharacterCreator}
          className="p-1 rounded-full border border-cyan-500/40 hover:border-cyan-400 bg-slate-900 transition-all hover:scale-105 cursor-pointer shadow-sm"
          title={isAr ? 'تخصيص صورتك الرمزية (Character Creator)' : 'Customize Avatar'}
        >
          <AvatarSVG config={characterConfig} size={28} />
        </button>

        {/* Skill Graph Button */}
        <button
          onClick={onOpenSkillGraph}
          className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all hidden md:flex items-center gap-1.5 cursor-pointer"
        >
          <Award className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden lg:inline">{isAr ? 'خريطة المهارات' : 'Skills'}</span>
        </button>

        {/* Progress summary badge */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 bg-slate-900 rounded-lg border border-slate-800 text-xs">
          <span className="text-slate-400">{isAr ? 'التقدم:' : 'Progress:'}</span>
          <span className="font-bold text-cyan-400">{completedCount}/{totalLessons}</span>
          <div className="w-10 h-1.5 bg-slate-800 rounded-full overflow-hidden">
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
