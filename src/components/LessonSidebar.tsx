import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  ChevronDown, 
  ChevronRight, 
  Sparkles, 
  Lock,
  Layers,
  Terminal,
  Grid,
  Zap,
  Globe,
  Award,
  Search
} from 'lucide-react';
import { Phase, Lesson } from '../types/flutter';

interface LessonSidebarProps {
  phases: Phase[];
  currentLesson: Lesson | null;
  onSelectLesson: (lesson: Lesson) => void;
  completedLessons: string[];
  language: 'ar' | 'en';
}

export const LessonSidebar: React.FC<LessonSidebarProps> = ({
  phases,
  currentLesson,
  onSelectLesson,
  completedLessons,
  language,
}) => {
  const isAr = language === 'ar';
  const [openPhases, setOpenPhases] = useState<Record<string, boolean>>({
    phase_dart: true,
    phase_fundamentals: true,
    phase_layout: true,
    phase_state: true,
    phase_networking: true
  });
  const [searchQuery, setSearchQuery] = useState('');

  const togglePhase = (phaseId: string) => {
    setOpenPhases(prev => ({ ...prev, [phaseId]: !prev[phaseId] }));
  };

  const getPhaseIcon = (id: string) => {
    if (id.includes('dart')) return <Terminal className="w-4 h-4 text-cyan-400" />;
    if (id.includes('fundamentals')) return <Layers className="w-4 h-4 text-blue-400" />;
    if (id.includes('layout')) return <Grid className="w-4 h-4 text-amber-400" />;
    if (id.includes('state')) return <Zap className="w-4 h-4 text-pink-400" />;
    if (id.includes('networking')) return <Globe className="w-4 h-4 text-emerald-400" />;
    return <BookOpen className="w-4 h-4 text-slate-400" />;
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 border-r border-slate-800/80 w-72 select-none shrink-0">
      {/* Sidebar Header & Search */}
      <div className="p-3 border-b border-slate-800/80 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isAr ? 'المسار التعليمي' : 'Curriculum'}</span>
          </span>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 border border-cyan-800/80 px-1.5 py-0.5 rounded">
            {completedLessons.length} {isAr ? 'مكتمل' : 'done'}
          </span>
        </div>

        {/* Filter Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'ابحث عن درس أو ويدجت...' : 'Search lessons or widgets...'}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-2.5 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
      </div>

      {/* Accordion List of Phases & Lessons */}
      <div className="flex-1 overflow-auto p-2 space-y-2">
        {phases.map(phase => {
          const isOpen = openPhases[phase.id] !== false;
          const filteredLessons = phase.lessons.filter(l => 
            !searchQuery || 
            l.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            l.titleAr.includes(searchQuery)
          );

          if (searchQuery && filteredLessons.length === 0) return null;

          const phaseCompletedCount = phase.lessons.filter(l => completedLessons.includes(l.id)).length;

          return (
            <div key={phase.id} className="rounded-xl border border-slate-800/60 overflow-hidden bg-slate-900/30">
              {/* Phase Header */}
              <button
                onClick={() => togglePhase(phase.id)}
                className="w-full px-3 py-2 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  {getPhaseIcon(phase.id)}
                  <span className="text-xs font-semibold text-slate-200">
                    {isAr ? phase.titleAr : phase.title}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-500 font-mono">
                    {phaseCompletedCount}/{phase.lessons.length}
                  </span>
                  {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                </div>
              </button>

              {/* Lesson Items */}
              {isOpen && (
                <div className="px-1.5 pb-1.5 space-y-0.5">
                  {filteredLessons.map(lesson => {
                    const isSelected = currentLesson?.id === lesson.id;
                    const isCompleted = completedLessons.includes(lesson.id);

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => onSelectLesson(lesson)}
                        className={`w-full px-2.5 py-1.5 rounded-lg text-left flex items-center justify-between text-xs transition-all cursor-pointer group ${
                          isSelected
                            ? 'bg-cyan-500/20 text-cyan-200 font-semibold border border-cyan-500/30 shadow-sm'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {isCompleted ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : (
                            <Circle className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-600'}`} />
                          )}
                          <span className="truncate">
                            {isAr ? lesson.titleAr : lesson.title}
                          </span>
                        </div>

                        <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded border ${
                          lesson.difficulty === 'beginner' 
                            ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10'
                            : lesson.difficulty === 'intermediate'
                              ? 'text-amber-400 border-amber-500/20 bg-amber-500/10'
                              : 'text-rose-400 border-rose-500/20 bg-rose-500/10'
                        }`}>
                          {lesson.difficulty}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Lesson Objectives preview card */}
      {currentLesson && (
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/60 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-300">
              {isAr ? 'أهداف هذا الدرس' : 'Lesson Goals'}
            </span>
            <span className="text-[10px] text-cyan-400 font-mono">
              {currentLesson.exerciseType}
            </span>
          </div>
          <ul className="space-y-1 text-[11px] text-slate-400 list-disc pl-4">
            {(isAr ? currentLesson.objectivesAr : currentLesson.objectives).map((obj, i) => (
              <li key={i}>{obj}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
