/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { CodeEditor } from './components/CodeEditor';
import { FlutterPreview } from './components/FlutterPreview';
import { WidgetTreePanel } from './components/WidgetTreePanel';
import { VisualPropertyInspector } from './components/VisualPropertyInspector';
import { ConsolePanel } from './components/ConsolePanel';
import { LessonSidebar } from './components/LessonSidebar';
import { ProjectExplorer } from './components/ProjectExplorer';
import { SkillGraphModal } from './components/SkillGraphModal';
import { LandingHero } from './components/LandingHero';
import { SideBySideDiffModal } from './components/SideBySideDiffModal';
import { CharacterCreatorModal } from './components/CharacterCreatorModal';
import { GamificationModal } from './components/GamificationModal';

import { 
  CURRICULUM_PHASES, 
  PROJECT_TEMPLATES, 
  SKILL_TREE 
} from './services/curriculumData';
import { parseFlutterCode, ParseResult } from './services/flutterParser';
import { evaluateExerciseDetailed, DetailedEvaluationResult } from './services/detailedTestEngine';
import { 
  Lesson, 
  WidgetNode, 
  SourceRange, 
  ProjectTemplate, 
  ProjectFile, 
  SkillNode,
  EducationalError
} from './types/flutter';
import { CharacterConfig, DEFAULT_CHARACTER } from './types/character';
import { Badge, LeaderboardUser, INITIAL_BADGES, INITIAL_LEADERBOARD } from './types/gamification';
import { PanelLeftOpen, PanelRightClose, PanelBottomOpen, ChevronUp, Terminal, Focus } from 'lucide-react';

export default function App() {
  // Navigation & View Mode
  const [currentMode, setCurrentMode] = useState<'curriculum' | 'playground' | 'projects' | 'landing'>('curriculum');
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // View / Layout Panels Visibility State (Focus & Zen Practice Mode)
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('flutterlab_view_sidebar');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [isRightPanelVisible, setIsRightPanelVisible] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('flutterlab_view_right');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [isBottomPanelVisible, setIsBottomPanelVisible] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('flutterlab_view_bottom');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // Modals state
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isCharacterModalOpen, setIsCharacterModalOpen] = useState(false);
  const [isGamificationModalOpen, setIsGamificationModalOpen] = useState(false);
  const [diffModalConfig, setDiffModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    subtitle: string;
    leftTitle: string;
    rightTitle: string;
    leftCode: string;
    rightCode: string;
    actionButtonLabel: string;
    onApply: (code: string) => void;
  } | null>(null);

  // Character & Gamification state
  const [characterConfig, setCharacterConfig] = useState<CharacterConfig>(() => {
    try {
      const saved = localStorage.getItem('flutterlab_character_config');
      return saved ? JSON.parse(saved) : DEFAULT_CHARACTER;
    } catch {
      return DEFAULT_CHARACTER;
    }
  });

  const [userPoints, setUserPoints] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('flutterlab_user_points');
      return saved ? JSON.parse(saved) : 820;
    } catch {
      return 820;
    }
  });

  const [badges, setBadges] = useState<Badge[]>(() => {
    try {
      const saved = localStorage.getItem('flutterlab_user_badges');
      return saved ? JSON.parse(saved) : INITIAL_BADGES;
    } catch {
      return INITIAL_BADGES;
    }
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>(INITIAL_LEADERBOARD);

  // Mobile responsive tab selection ('code' | 'preview' | 'tree' | 'console')
  const [mobileTab, setMobileTab] = useState<'code' | 'preview' | 'tree' | 'console'>('code');

  // Right pane toggle between Widget Tree & Visual Property Inspector
  const [rightPanelTab, setRightPanelTab] = useState<'tree' | 'inspector'>('tree');

  // Curriculum & Active Lesson State
  const [phases] = useState(CURRICULUM_PHASES);
  const [currentLesson, setCurrentLesson] = useState<Lesson>(CURRICULUM_PHASES[0].lessons[0]);
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('flutterlab_completed_lessons');
      return saved ? JSON.parse(saved) : ['dart_variables'];
    } catch {
      return ['dart_variables'];
    }
  });

  // Code & Editor State
  const [code, setCode] = useState<string>(CURRICULUM_PHASES[0].lessons[0].starterCode);
  const [activeFileName, setActiveFileName] = useState<string>('main.dart');
  const [highlightRange, setHighlightRange] = useState<SourceRange | null>(null);

  // Execution & AST Parsing State
  const [isRunning, setIsRunning] = useState(false);
  const [parseResult, setParseResult] = useState<ParseResult>(() => parseFlutterCode(CURRICULUM_PHASES[0].lessons[0].starterCode));
  const [selectedWidget, setSelectedWidget] = useState<WidgetNode | null>(null);
  const [detailedEvaluation, setDetailedEvaluation] = useState<DetailedEvaluationResult | null>(() => 
    evaluateExerciseDetailed(CURRICULUM_PHASES[0].lessons[0].tests, null, CURRICULUM_PHASES[0].lessons[0].starterCode)
  );

  // Logs stream
  const [logs, setLogs] = useState<{ type: 'info' | 'warning' | 'error' | 'test' | 'change'; message: string; timestamp: string }[]>([
    { type: 'info', message: 'FlutterLab Engine ready. Flutter SDK 3.24.0 (Web)', timestamp: '00:00:01' },
    { type: 'info', message: 'Initial build complete (380ms)', timestamp: '00:00:02' }
  ]);

  // Projects State
  const [activeProject, setActiveProject] = useState<ProjectTemplate>(PROJECT_TEMPLATES[0]);
  const [activeFile, setActiveFile] = useState<ProjectFile>(PROJECT_TEMPLATES[0].files[0]);

  // Skills State
  const [skills, setSkills] = useState<SkillNode[]>(SKILL_TREE);

  // Autosave indicator
  const [savedIndicator, setSavedIndicator] = useState(true);

  // Sync RTL / LTR document direction
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Save progress & gamification to LocalStorage
  useEffect(() => {
    localStorage.setItem('flutterlab_completed_lessons', JSON.stringify(completedLessons));
    localStorage.setItem('flutterlab_character_config', JSON.stringify(characterConfig));
    localStorage.setItem('flutterlab_user_points', JSON.stringify(userPoints));
    localStorage.setItem('flutterlab_user_badges', JSON.stringify(badges));
  }, [completedLessons, characterConfig, userPoints, badges]);

  // Sync current user avatar in leaderboard
  useEffect(() => {
    setLeaderboard(prev => prev.map(u => {
      if (u.isCurrentUser) {
        return {
          ...u,
          avatarConfig: characterConfig,
          points: userPoints,
          completedLessons: completedLessons.length,
          badgesCount: badges.filter(b => b.unlocked).length,
        };
      }
      return u;
    }));
  }, [characterConfig, userPoints, completedLessons.length, badges]);

  // Debounced auto-parse & hot-update
  useEffect(() => {
    const timer = setTimeout(() => {
      const result = parseFlutterCode(code);
      setParseResult(result);
      if (result.rootWidget && !selectedWidget) {
        setSelectedWidget(result.rootWidget);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [code]);

  // Run & Test Evaluation with Detailed Testing Engine
  const handleRun = useCallback(() => {
    setIsRunning(true);
    const timeStr = new Date().toLocaleTimeString();
    
    // Add build started log
    setLogs(prev => [
      ...prev,
      { type: 'info', message: 'Building Flutter Web widget tree and running test assertions...', timestamp: timeStr }
    ]);

    setTimeout(() => {
      const result = parseFlutterCode(code);
      setParseResult(result);

      if (result.errors.length > 0) {
        setLogs(prev => [
          ...prev,
          { type: 'error', message: `Compilation failed with ${result.errors.length} error(s). Check Error Layer.`, timestamp: timeStr }
        ]);
        setIsRunning(false);
        return;
      }

      // Execute tests
      if (currentLesson && currentLesson.tests) {
        const evalResult = evaluateExerciseDetailed(currentLesson.tests, result.rootWidget, code);
        setDetailedEvaluation(evalResult);

        if (evalResult.allPassed) {
          setLogs(prev => [
            ...prev,
            { type: 'test', message: `All ${evalResult.totalCount} test assertions passed! Challenge completed (+50 XP)`, timestamp: timeStr }
          ]);

          // Award Points & Unlock Badge
          if (!completedLessons.includes(currentLesson.id)) {
            setCompletedLessons(prev => [...prev, currentLesson.id]);
            setUserPoints(prev => prev + 50);

            // Check badges unlock
            setBadges(prev => prev.map(b => {
              if (!b.unlocked && b.requiredPoints && (userPoints + 50) >= b.requiredPoints) {
                return { ...b, unlocked: true, unlockedAt: 'Just Now' };
              }
              return b;
            }));
          }
        } else {
          setLogs(prev => [
            ...prev,
            { type: 'warning', message: `${evalResult.passCount}/${evalResult.totalCount} tests passed. Check the Testing Panel for expected vs actual.`, timestamp: timeStr }
          ]);
        }
      }

      setIsRunning(false);
    }, 350);
  }, [code, currentLesson, completedLessons, userPoints]);

  // Switch Lesson
  const handleSelectLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setCode(lesson.starterCode);
    setHighlightRange(null);
    setSelectedWidget(null);
    const evalResult = evaluateExerciseDetailed(lesson.tests, null, lesson.starterCode);
    setDetailedEvaluation(evalResult);
    setLogs(prev => [
      ...prev,
      { type: 'info', message: `Switched to lesson: ${lesson.title}`, timestamp: new Date().toLocaleTimeString() }
    ]);
  };

  // Switch Project
  const handleSelectProject = (template: ProjectTemplate) => {
    setActiveProject(template);
    setActiveFile(template.files[0]);
    setCode(template.files[0].content);
    setActiveFileName(template.files[0].name);
    setHighlightRange(null);
    setSelectedWidget(null);
  };

  // Switch Project File
  const handleSelectFile = (file: ProjectFile) => {
    setActiveFile(file);
    setCode(file.content);
    setActiveFileName(file.name);
    setHighlightRange(null);
  };

  // Widget Selected in Preview or Tree
  const handleSelectWidget = (widget: WidgetNode) => {
    setSelectedWidget(widget);
    if (widget.sourceRange) {
      setHighlightRange(widget.sourceRange);
    }
    setRightPanelTab('inspector');
  };

  // Code format action (Dart formatting emulation)
  const handleFormatCode = () => {
    const formatted = code
      .split('\n')
      .map(line => line.trimEnd())
      .join('\n');
    setCode(formatted);
    setLogs(prev => [
      ...prev,
      { type: 'info', message: 'Dart format completed.', timestamp: new Date().toLocaleTimeString() }
    ]);
  };

  // Reset to starter code with Side-by-Side Diff Modal
  const handleResetWithDiff = () => {
    const starter = currentMode === 'projects' ? activeFile.content : currentLesson.starterCode;
    setDiffModalConfig({
      isOpen: true,
      title: language === 'ar' ? 'مقارنة إعادة ضبط الكود إلى القالب المبدئي' : 'Reset Code to Starter Template',
      subtitle: language === 'ar' 
        ? 'راجع الفروقات بين كودك الحالي وقالب البداية قبل التطبيق'
        : 'Review differences between your current code and the starter template',
      leftTitle: language === 'ar' ? 'كودك الحالي (الذي سيتم حذفه)' : 'Current Code (To be replaced)',
      rightTitle: language === 'ar' ? 'قالب البداية الأصلي (Starter Code)' : 'Starter Template (New)',
      leftCode: code,
      rightCode: starter,
      actionButtonLabel: language === 'ar' ? 'تأكيد إعادة التعيين' : 'Confirm Reset',
      onApply: (newCode) => {
        setCode(newCode);
        setHighlightRange(null);
        setLogs(prev => [
          ...prev,
          { type: 'info', message: 'Code reset to starter template.', timestamp: new Date().toLocaleTimeString() }
        ]);
      }
    });
  };

  // Open Solution Comparison Diff
  const handleOpenSolutionDiff = () => {
    if (!currentLesson) return;
    setDiffModalConfig({
      isOpen: true,
      title: language === 'ar' ? 'مقارنة الكود الحالي مع الحل النموذجي' : 'Compare Current Code with Solution',
      subtitle: language === 'ar' 
        ? 'شاهد ما ينقصك لاكتمال الويدجتس وتحقيق جميع الاختبارات'
        : 'Side-by-side diff comparing your implementation with the reference solution',
      leftTitle: language === 'ar' ? 'كودك الحالي' : 'Your Current Work',
      rightTitle: language === 'ar' ? 'الحل النموذجي (Reference Solution)' : 'Reference Solution',
      leftCode: code,
      rightCode: currentLesson.solutionCode,
      actionButtonLabel: language === 'ar' ? 'تطبيق الحل في المحرر' : 'Apply Solution to Editor',
      onApply: (newCode) => {
        setCode(newCode);
        handleRun();
      }
    });
  };

  // Apply change from Visual Property Inspector
  const handleApplyVisualChange = (newCode: string, changeSummary: string) => {
    setCode(newCode);
    setLogs(prev => [
      ...prev,
      { type: 'change', message: `Visual change applied: ${changeSummary}`, timestamp: new Date().toLocaleTimeString() }
    ]);
  };

  // Apply full solution code
  const handleApplySolution = (solutionCode: string) => {
    setCode(solutionCode);
    handleRun();
  };

  // Go to error line from console
  const handleGoToLine = (line: number) => {
    setHighlightRange({
      startLine: line,
      startColumn: 1,
      endLine: line,
      endColumn: 50
    });
  };

  // Focus & Layout toggle handlers
  const isZenMode = !isSidebarVisible && !isRightPanelVisible && !isBottomPanelVisible;

  const handleToggleZenMode = () => {
    if (isZenMode) {
      setIsSidebarVisible(true);
      setIsRightPanelVisible(true);
      setIsBottomPanelVisible(true);
      localStorage.setItem('flutterlab_view_sidebar', 'true');
      localStorage.setItem('flutterlab_view_right', 'true');
      localStorage.setItem('flutterlab_view_bottom', 'true');
    } else {
      setIsSidebarVisible(false);
      setIsRightPanelVisible(false);
      setIsBottomPanelVisible(false);
      localStorage.setItem('flutterlab_view_sidebar', 'false');
      localStorage.setItem('flutterlab_view_right', 'false');
      localStorage.setItem('flutterlab_view_bottom', 'false');
    }
  };

  const handleToggleSidebar = () => {
    setIsSidebarVisible(prev => {
      const next = !prev;
      localStorage.setItem('flutterlab_view_sidebar', JSON.stringify(next));
      return next;
    });
  };

  const handleToggleRightPanel = () => {
    setIsRightPanelVisible(prev => {
      const next = !prev;
      localStorage.setItem('flutterlab_view_right', JSON.stringify(next));
      return next;
    });
  };

  const handleToggleBottomPanel = () => {
    setIsBottomPanelVisible(prev => {
      const next = !prev;
      localStorage.setItem('flutterlab_view_bottom', JSON.stringify(next));
      return next;
    });
  };

  const totalLessonsCount = phases.reduce((acc, p) => acc + p.lessons.length, 0);

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden ${theme === 'dark' ? 'bg-[#090d16] text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
      {/* Header Bar */}
      <Header
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        onRun={handleRun}
        onFormat={handleFormatCode}
        onReset={handleResetWithDiff}
        onOpenSkillGraph={() => setIsSkillModalOpen(true)}
        onOpenGamification={() => setIsGamificationModalOpen(true)}
        onOpenCharacterCreator={() => setIsCharacterModalOpen(true)}
        onOpenDiffModal={handleOpenSolutionDiff}
        characterConfig={characterConfig}
        userPoints={userPoints}
        isRunning={isRunning}
        language={language}
        onToggleLanguage={() => setLanguage(l => l === 'ar' ? 'en' : 'ar')}
        theme={theme}
        onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
        completedCount={completedLessons.length}
        totalLessons={totalLessonsCount}
        streakDays={3}
        savedIndicator={savedIndicator}
        isSidebarVisible={isSidebarVisible}
        onToggleSidebar={handleToggleSidebar}
        isRightPanelVisible={isRightPanelVisible}
        onToggleRightPanel={handleToggleRightPanel}
        isBottomPanelVisible={isBottomPanelVisible}
        onToggleBottomPanel={handleToggleBottomPanel}
        isZenMode={isZenMode}
        onToggleZenMode={handleToggleZenMode}
      />

      {/* Main Content View Switcher */}
      {currentMode === 'landing' ? (
        <LandingHero
          onStartLearning={() => setCurrentMode('curriculum')}
          onExplorePlayground={() => setCurrentMode('playground')}
          onViewCurriculum={() => setCurrentMode('curriculum')}
          language={language}
        />
      ) : (
        <div className="flex-1 flex overflow-hidden relative">
          {/* Left Navigation: Lesson Sidebar OR Project Explorer */}
          {currentMode === 'curriculum' && (
            isSidebarVisible ? (
              <LessonSidebar
                phases={phases}
                currentLesson={currentLesson}
                onSelectLesson={handleSelectLesson}
                completedLessons={completedLessons}
                language={language}
                onToggleCollapse={handleToggleSidebar}
              />
            ) : (
              <button
                onClick={handleToggleSidebar}
                className="hidden md:flex h-full w-8 bg-slate-950 hover:bg-slate-900 border-r border-slate-800 flex-col items-center justify-center gap-3 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer group shrink-0 select-none z-10"
                title={language === 'ar' ? 'إظهار المسار التعليمي والدروس' : 'Show curriculum lessons'}
              >
                <PanelLeftOpen className="w-4 h-4 group-hover:scale-110 text-cyan-400 transition-transform" />
                <span className="[writing-mode:vertical-lr] rotate-180 text-[11px] font-bold tracking-wider text-slate-400 group-hover:text-cyan-300">
                  {language === 'ar' ? 'المسار التعليمي' : 'Curriculum'}
                </span>
              </button>
            )
          )}

          {currentMode === 'projects' && (
            <ProjectExplorer
              templates={PROJECT_TEMPLATES}
              activeTemplate={activeProject}
              onSelectTemplate={handleSelectProject}
              activeFile={activeFile}
              onSelectFile={handleSelectFile}
              language={language}
            />
          )}

          {/* Main IDE Workspace (Desktop Flexible Split) */}
          <div className="flex-1 flex flex-col overflow-hidden p-2 gap-2">
            {/* Top Workspace Area */}
            <div className="flex-1 flex flex-col md:flex-row gap-2 overflow-hidden min-h-0">
              {/* Pane 1: Code Editor */}
              <div className={`h-full ${mobileTab === 'code' ? 'flex' : 'hidden md:flex'} ${isRightPanelVisible ? 'md:w-[45%]' : 'md:w-[55%] flex-1'} flex-col overflow-hidden`}>
                <CodeEditor
                  code={code}
                  onChange={setCode}
                  highlightRange={highlightRange}
                  errors={parseResult.errors}
                  onRun={handleRun}
                  fileName={activeFileName}
                  language={language}
                />
              </div>

              {/* Pane 2: Live Flutter Preview */}
              <div className={`h-full ${mobileTab === 'preview' ? 'flex' : 'hidden md:flex'} ${isRightPanelVisible ? 'md:w-[30%]' : 'md:w-[45%] flex-1'} flex-col overflow-hidden`}>
                <FlutterPreview
                  rootWidget={parseResult.rootWidget}
                  selectedWidgetId={selectedWidget?.id || null}
                  onSelectWidget={handleSelectWidget}
                  warnings={parseResult.warnings}
                  isRunning={isRunning}
                  language={language}
                  onToggleRightPanel={handleToggleRightPanel}
                  isRightPanelVisible={isRightPanelVisible}
                />
              </div>

              {/* Pane 3: Widget Tree & Visual Property Inspector */}
              {isRightPanelVisible && (
                <div className={`h-full ${['tree', 'inspector'].includes(mobileTab) ? 'flex' : 'hidden md:flex'} md:w-[25%] flex-col overflow-hidden bg-slate-950 border border-slate-800/80 rounded-xl`}>
                  {/* Switch between Tree and Property Inspector */}
                  <div className="h-9 bg-slate-900 border-b border-slate-800 px-2 flex items-center justify-between select-none">
                    <div className="flex items-center gap-1 flex-1">
                      <button
                        onClick={() => setRightPanelTab('tree')}
                        className={`flex-1 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                          rightPanelTab === 'tree'
                            ? 'bg-slate-800 text-cyan-300 shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {language === 'ar' ? 'شجرة الويدجتس' : 'Widget Tree'}
                      </button>
                      <button
                        onClick={() => setRightPanelTab('inspector')}
                        className={`flex-1 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                          rightPanelTab === 'inspector'
                            ? 'bg-slate-800 text-cyan-300 shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {language === 'ar' ? 'فاحص الخصائص' : 'Properties'}
                      </button>
                    </div>
                    <button
                      onClick={handleToggleRightPanel}
                      className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded transition-colors cursor-pointer ml-1"
                      title={language === 'ar' ? 'إخفاء الشجرة والخصائص لزيادة عرض المعاينة' : 'Hide Inspector & Tree for more view'}
                    >
                      <PanelRightClose className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-hidden">
                    {rightPanelTab === 'tree' ? (
                      <WidgetTreePanel
                        rootWidget={parseResult.rootWidget}
                        selectedWidget={selectedWidget}
                        onSelectWidget={handleSelectWidget}
                        language={language}
                      />
                    ) : (
                      <VisualPropertyInspector
                        selectedWidget={selectedWidget}
                        code={code}
                        onApplyCodeChange={handleApplyVisualChange}
                        language={language}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Workspace Area: Multi-tab Console & Detailed Testing Panel */}
            {isBottomPanelVisible ? (
              <div className={`h-56 ${mobileTab === 'console' ? 'flex' : 'hidden md:flex'} flex-col overflow-hidden shrink-0`}>
                <ConsolePanel
                  logs={logs}
                  errors={parseResult.errors}
                  detailedEvaluation={detailedEvaluation}
                  lesson={currentMode === 'curriculum' ? currentLesson : null}
                  code={code}
                  onGoToLine={handleGoToLine}
                  onApplySolution={handleApplySolution}
                  onRunCode={handleRun}
                  onOpenSolutionDiff={handleOpenSolutionDiff}
                  language={language}
                  onToggleCollapse={handleToggleBottomPanel}
                />
              </div>
            ) : (
              <div 
                onClick={handleToggleBottomPanel}
                className={`h-8 ${mobileTab === 'console' ? 'flex' : 'hidden md:flex'} bg-slate-950/90 hover:bg-slate-900 border border-slate-800/80 rounded-xl px-3 items-center justify-between text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer shrink-0 select-none shadow-sm`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                    <PanelBottomOpen className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{language === 'ar' ? 'لوحة الاختبارات والكونسول (مصغّرة)' : 'Console & Testing Panel (Minimized)'}</span>
                  </div>
                  {detailedEvaluation && (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      detailedEvaluation.allPassed ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {language === 'ar' ? 'الاختبارات:' : 'Tests:'} {detailedEvaluation.passCount}/{detailedEvaluation.totalCount}
                    </span>
                  )}
                  {parseResult.errors.length > 0 && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {language === 'ar' ? 'أخطاء:' : 'Errors:'} {parseResult.errors.length}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-cyan-400 font-semibold text-[11px]">
                  <span>{language === 'ar' ? 'انقر لتوسيع لوحة الكونسول والاختبارات' : 'Click to expand Console & Tests'}</span>
                  <ChevronUp className="w-3.5 h-3.5" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Tab Switcher Bar (Visible only on small viewports) */}
      <div className="md:hidden h-12 bg-slate-950 border-t border-slate-800 flex items-center justify-around px-2 z-40 select-none">
        <button
          onClick={() => setMobileTab('code')}
          className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer ${mobileTab === 'code' ? 'text-cyan-400 font-bold bg-cyan-950/60' : 'text-slate-400'}`}
        >
          {language === 'ar' ? 'المحرر' : 'Code'}
        </button>
        <button
          onClick={() => setMobileTab('preview')}
          className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer ${mobileTab === 'preview' ? 'text-cyan-400 font-bold bg-cyan-950/60' : 'text-slate-400'}`}
        >
          {language === 'ar' ? 'المعاينة' : 'Preview'}
        </button>
        <button
          onClick={() => setMobileTab('tree')}
          className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer ${mobileTab === 'tree' ? 'text-cyan-400 font-bold bg-cyan-950/60' : 'text-slate-400'}`}
        >
          {language === 'ar' ? 'الشجرة' : 'Tree'}
        </button>
        <button
          onClick={() => setMobileTab('console')}
          className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer ${mobileTab === 'console' ? 'text-cyan-400 font-bold bg-cyan-950/60' : 'text-slate-400'}`}
        >
          {language === 'ar' ? 'الكونسول' : 'Console'}
        </button>
      </div>

      {/* Skill Graph Modal */}
      {isSkillModalOpen && (
        <SkillGraphModal
          skills={skills}
          onClose={() => setIsSkillModalOpen(false)}
          language={language}
        />
      )}

      {/* Character Creator Modal */}
      {isCharacterModalOpen && (
        <CharacterCreatorModal
          initialConfig={characterConfig}
          onSave={setCharacterConfig}
          onClose={() => setIsCharacterModalOpen(false)}
          language={language}
        />
      )}

      {/* Gamification / Leaderboard Modal */}
      {isGamificationModalOpen && (
        <GamificationModal
          userPoints={userPoints}
          streakDays={3}
          badges={badges}
          leaderboard={leaderboard}
          onOpenCharacterCreator={() => {
            setIsGamificationModalOpen(false);
            setIsCharacterModalOpen(true);
          }}
          onClose={() => setIsGamificationModalOpen(false)}
          language={language}
        />
      )}

      {/* Side-by-Side Diff Modal (Reset or Solution compare) */}
      {diffModalConfig && diffModalConfig.isOpen && (
        <SideBySideDiffModal
          title={diffModalConfig.title}
          subtitle={diffModalConfig.subtitle}
          leftTitle={diffModalConfig.leftTitle}
          rightTitle={diffModalConfig.rightTitle}
          leftCode={diffModalConfig.leftCode}
          rightCode={diffModalConfig.rightCode}
          actionButtonLabel={diffModalConfig.actionButtonLabel}
          onApplyRight={diffModalConfig.onApply}
          onClose={() => setDiffModalConfig(null)}
          language={language}
        />
      )}
    </div>
  );
}
