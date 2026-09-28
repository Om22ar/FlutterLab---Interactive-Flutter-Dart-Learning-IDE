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

import { 
  CURRICULUM_PHASES, 
  PROJECT_TEMPLATES, 
  SKILL_TREE 
} from './services/curriculumData';
import { parseFlutterCode, ParseResult } from './services/flutterParser';
import { evaluateExercise, EvaluationResult } from './services/testEngine';
import { 
  Lesson, 
  WidgetNode, 
  SourceRange, 
  ProjectTemplate, 
  ProjectFile, 
  SkillNode,
  EducationalError
} from './types/flutter';

export default function App() {
  // Navigation & View Mode
  const [currentMode, setCurrentMode] = useState<'curriculum' | 'playground' | 'projects' | 'landing'>('curriculum');
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);

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
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

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

  // Save progress to LocalStorage
  useEffect(() => {
    localStorage.setItem('flutterlab_completed_lessons', JSON.stringify(completedLessons));
  }, [completedLessons]);

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

  // Run & Test Evaluation
  const handleRun = useCallback(() => {
    setIsRunning(true);
    const timeStr = new Date().toLocaleTimeString();
    
    // Add build started log
    setLogs(prev => [
      ...prev,
      { type: 'info', message: 'Building Flutter Web widget tree...', timestamp: timeStr }
    ]);

    setTimeout(() => {
      const result = parseFlutterCode(code);
      setParseResult(result);

      if (result.errors.length > 0) {
        setLogs(prev => [
          ...prev,
          { type: 'error', message: `Compilation failed with ${result.errors.length} error(s).`, timestamp: timeStr }
        ]);
        setIsRunning(false);
        return;
      }

      // Execute tests
      if (currentLesson && currentLesson.tests) {
        const evalResult = evaluateExercise(currentLesson.tests, result.rootWidget, code);
        setEvaluation(evalResult);

        if (evalResult.allPassed) {
          setLogs(prev => [
            ...prev,
            { type: 'test', message: `All ${evalResult.totalCount} tests passed! Challenge completed.`, timestamp: timeStr }
          ]);
          if (!completedLessons.includes(currentLesson.id)) {
            setCompletedLessons(prev => [...prev, currentLesson.id]);
          }
        } else {
          setLogs(prev => [
            ...prev,
            { type: 'warning', message: `${evalResult.passCount}/${evalResult.totalCount} tests passed. Check the Tests tab for details.`, timestamp: timeStr }
          ]);
        }
      }

      setIsRunning(false);
    }, 350);
  }, [code, currentLesson, completedLessons]);

  // Switch Lesson
  const handleSelectLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setCode(lesson.starterCode);
    setHighlightRange(null);
    setSelectedWidget(null);
    setEvaluation(null);
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

  // Reset to starter code
  const handleResetCode = () => {
    if (currentMode === 'projects') {
      setCode(activeFile.content);
    } else {
      setCode(currentLesson.starterCode);
    }
    setHighlightRange(null);
    setLogs(prev => [
      ...prev,
      { type: 'info', message: 'Reset code to starter template.', timestamp: new Date().toLocaleTimeString() }
    ]);
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

  const totalLessonsCount = phases.reduce((acc, p) => acc + p.lessons.length, 0);

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden ${theme === 'dark' ? 'bg-[#090d16] text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
      {/* Header Bar */}
      <Header
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        onRun={handleRun}
        onFormat={handleFormatCode}
        onReset={handleResetCode}
        onOpenSkillGraph={() => setIsSkillModalOpen(true)}
        isRunning={isRunning}
        language={language}
        onToggleLanguage={() => setLanguage(l => l === 'ar' ? 'en' : 'ar')}
        theme={theme}
        onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
        completedCount={completedLessons.length}
        totalLessons={totalLessonsCount}
        streakDays={3}
        savedIndicator={savedIndicator}
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
            <LessonSidebar
              phases={phases}
              currentLesson={currentLesson}
              onSelectLesson={handleSelectLesson}
              completedLessons={completedLessons}
              language={language}
            />
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

          {/* Main IDE Workspace (Desktop 3-Pane: 45% Editor, 30% Preview, 25% Inspector/Tree) */}
          <div className="flex-1 flex flex-col overflow-hidden p-2 gap-2">
            {/* Top Workspace Area */}
            <div className="flex-1 flex flex-col md:flex-row gap-2 overflow-hidden min-h-0">
              {/* Pane 1: Code Editor (45%) */}
              <div className={`h-full ${mobileTab === 'code' ? 'flex' : 'hidden md:flex'} md:w-[45%] flex-col overflow-hidden`}>
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

              {/* Pane 2: Live Flutter Preview (30%) */}
              <div className={`h-full ${mobileTab === 'preview' ? 'flex' : 'hidden md:flex'} md:w-[30%] flex-col overflow-hidden`}>
                <FlutterPreview
                  rootWidget={parseResult.rootWidget}
                  selectedWidgetId={selectedWidget?.id || null}
                  onSelectWidget={handleSelectWidget}
                  warnings={parseResult.warnings}
                  isRunning={isRunning}
                  language={language}
                />
              </div>

              {/* Pane 3: Widget Tree & Visual Property Inspector (25%) */}
              <div className={`h-full ${['tree', 'inspector'].includes(mobileTab) ? 'flex' : 'hidden md:flex'} md:w-[25%] flex-col overflow-hidden bg-slate-950 border border-slate-800/80 rounded-xl`}>
                {/* Switch between Tree and Property Inspector */}
                <div className="h-9 bg-slate-900 border-b border-slate-800 px-2 flex items-center gap-1 select-none">
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
            </div>

            {/* Bottom Workspace Area: Multi-tab Console Panel */}
            <div className={`h-56 ${mobileTab === 'console' ? 'flex' : 'hidden md:flex'} flex-col overflow-hidden shrink-0`}>
              <ConsolePanel
                logs={logs}
                errors={parseResult.errors}
                evaluation={evaluation}
                lesson={currentMode === 'curriculum' ? currentLesson : null}
                code={code}
                onGoToLine={handleGoToLine}
                onApplySolution={handleApplySolution}
                language={language}
              />
            </div>
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
    </div>
  );
}
