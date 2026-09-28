import React, { useState } from 'react';
import { 
  Terminal, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Bot, 
  Sparkles, 
  HelpCircle, 
  ArrowRight, 
  Send, 
  Loader2, 
  Lightbulb, 
  ShieldAlert,
  ChevronRight,
  Code2,
  Check,
  RotateCcw,
  PanelBottomClose
} from 'lucide-react';
import { EducationalError, Lesson } from '../types/flutter';
import { DetailedEvaluationResult } from '../services/detailedTestEngine';
import { askAiTutor, AiTutorMode } from '../services/aiTutorService';
import { TestingPanel } from './TestingPanel';
import { categorizeError } from '../services/errorCategorizer';

interface ConsolePanelProps {
  logs: { type: 'info' | 'warning' | 'error' | 'test' | 'change'; message: string; timestamp: string }[];
  errors: EducationalError[];
  rawCompilerErrors?: string[];
  detailedEvaluation: DetailedEvaluationResult | null;
  lesson: Lesson | null;
  code: string;
  onGoToLine: (line: number) => void;
  onApplySolution: (solutionCode: string) => void;
  onRunCode: () => void;
  onOpenSolutionDiff: () => void;
  language: 'ar' | 'en';
  onToggleCollapse?: () => void;
}

export const ConsolePanel: React.FC<ConsolePanelProps> = ({
  logs,
  errors,
  rawCompilerErrors = [],
  detailedEvaluation,
  lesson,
  code,
  onGoToLine,
  onApplySolution,
  onRunCode,
  onOpenSolutionDiff,
  language,
  onToggleCollapse,
}) => {
  const isAr = language === 'ar';
  const [activeTab, setActiveTab] = useState<'tests' | 'errors' | 'console' | 'ai'>('tests');

  // AI Tutor State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'tutor'; text: string; thinking?: string }[]>([
    {
      role: 'tutor',
      text: isAr 
        ? 'مرحباً بك! أنا مرشدك الذكي في FlutterLab. كيف يمكنني مساعدتك في فهم هذا المفهوم أو تصحيح كودك اليوم؟'
        : 'Welcome! I am your FlutterLab AI Coach. How can I assist you with concepts, debugging, or hints today?'
    }
  ]);

  // Progressive hint counter
  const [hintAttempt, setHintAttempt] = useState<number>(1);
  const [showSolutionConfirm, setShowSolutionConfirm] = useState(false);

  // Map any raw compiler errors to EducationalError using categorizeError
  const combinedErrors: EducationalError[] = [
    ...errors,
    ...rawCompilerErrors.map(raw => categorizeError(raw, code)),
  ];

  // Switch to errors tab automatically if syntax/compiler error occurs
  React.useEffect(() => {
    if (combinedErrors.length > 0) {
      setActiveTab('errors');
    }
  }, [combinedErrors.length]);

  const handleAskAI = async (mode: AiTutorMode, customPrompt?: string) => {
    setAiLoading(true);
    setActiveTab('ai');

    const promptText = customPrompt || aiPrompt || (isAr ? 'اشرح لي الخطأ الحالي وكيفية حله.' : 'Please guide me through the current issue.');

    if (customPrompt || aiPrompt) {
      setAiMessages(prev => [...prev, { role: 'user', text: promptText }]);
    }

    try {
      const response = await askAiTutor({
        mode,
        code,
        lessonTitle: lesson?.title || 'Flutter Playground',
        lessonConcept: lesson?.concept || 'Core Flutter Widgets',
        errorMessage: combinedErrors.length > 0 ? combinedErrors[0].message : undefined,
        attemptNumber: hintAttempt,
        userPrompt: promptText,
        language
      });

      setAiMessages(prev => [
        ...prev,
        {
          role: 'tutor',
          text: response.markdown,
          thinking: response.thinkingProcess
        }
      ]);

      if (mode === 'hint') {
        setHintAttempt(prev => prev + 1);
      }
    } catch (err: any) {
      setAiMessages(prev => [
        ...prev,
        {
          role: 'tutor',
          text: isAr ? 'حدث خطأ في الاتصال بالمرشد الذكي.' : 'Failed to reach AI Tutor.'
        }
      ]);
    } finally {
      setAiLoading(false);
      setAiPrompt('');
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 border border-slate-800/80 rounded-xl overflow-hidden shadow-2xl">
      {/* Panel Tab Navigation Bar */}
      <div className="h-10 bg-slate-900/90 border-b border-slate-800/80 px-3 flex items-center justify-between select-none">
        <div className="flex items-center gap-1">
          {/* Detailed Test Results Tab (Testing Panel) */}
          <button
            onClick={() => setActiveTab('tests')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'tests'
                ? 'bg-slate-800 text-cyan-300 border border-slate-700 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {detailedEvaluation?.allPassed ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>{isAr ? 'لوحة الاختبارات (Testing Panel)' : 'Testing Panel'}</span>
            {detailedEvaluation && (
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                detailedEvaluation.allPassed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-300'
              }`}>
                {detailedEvaluation.passCount}/{detailedEvaluation.totalCount}
              </span>
            )}
          </button>

          {/* Educational Error Layer Tab */}
          <button
            onClick={() => setActiveTab('errors')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'errors'
                ? 'bg-slate-800 text-rose-300 border border-slate-700 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>{isAr ? 'تحليل الأخطاء التعليمي' : 'Error Layer'}</span>
            {combinedErrors.length > 0 && (
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300">
                {combinedErrors.length}
              </span>
            )}
          </button>

          {/* Console Tab */}
          <button
            onClick={() => setActiveTab('console')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'console'
                ? 'bg-slate-800 text-slate-200 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-slate-400" />
            <span>{isAr ? 'وحدة التحكم (Console)' : 'Console'}</span>
          </button>

          {/* AI Coach Tab */}
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'ai'
                ? 'bg-indigo-950/60 text-indigo-300 border border-indigo-700/60 font-bold'
                : 'text-indigo-400/80 hover:text-indigo-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{isAr ? 'المرشد الذكي (AI Coach)' : 'AI Coach'}</span>
          </button>
        </div>

        {/* Quick Actions (Hint & Solution Diff) */}
        <div className="flex items-center gap-2">
          {lesson && (
            <>
              <button
                onClick={onOpenSolutionDiff}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                title={isAr ? 'مقارنة الكود بالحل النموذجي' : 'Compare with solution code'}
              >
                <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">{isAr ? 'مقارنة الحل' : 'Diff'}</span>
              </button>

              <button
                onClick={() => handleAskAI('hint', isAr ? 'أعطني تلميحاً للخطوة التالية' : 'Give me a hint for the next step')}
                className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>{isAr ? `تلميح ${hintAttempt}` : `Hint ${hintAttempt}`}</span>
              </button>
            </>
          )}

          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded transition-colors cursor-pointer ml-1"
              title={isAr ? 'تصغير / إخفاء لوحة التحكم للاختبارات (لتوسيع المحرر)' : 'Minimize panel for more editor space'}
            >
              <PanelBottomClose className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Tab Panels Content */}
      <div className="flex-1 overflow-auto">
        {/* Tab 1: Detailed Testing Panel */}
        {activeTab === 'tests' && (
          <TestingPanel
            detailedEvaluation={detailedEvaluation}
            lesson={lesson}
            language={language}
            onRunCode={onRunCode}
            onAskAiForHint={() => handleAskAI('hint')}
            onOpenSolutionDiff={onOpenSolutionDiff}
          />
        )}

        {/* Tab 2: Educational Error Layer (categorizeError) */}
        {activeTab === 'errors' && (
          <div className="p-4 space-y-4">
            {combinedErrors.length === 0 ? (
              <div className="p-6 text-center text-slate-500 space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500" />
                <p className="text-xs text-emerald-400 font-semibold">{isAr ? 'لا توجد أخطاء في الكود!' : 'No compilation or syntax errors found!'}</p>
                <p className="text-[11px] text-slate-400">{isAr ? 'الكود سليم وقابل للتنفيذ على Flutter Web.' : 'Code syntax is valid and runnable.'}</p>
              </div>
            ) : (
              combinedErrors.map((err, idx) => (
                <div key={idx} className="p-4 bg-rose-950/30 border border-rose-800/60 rounded-xl space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <h4 className="font-bold text-xs text-rose-300">
                        {isAr ? err.titleAr : err.title}
                      </h4>
                    </div>
                    {err.line && (
                      <button
                        onClick={() => onGoToLine(err.line!)}
                        className="px-2 py-0.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 text-[10px] font-mono rounded flex items-center gap-1 cursor-pointer"
                      >
                        <span>Line {err.line}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Raw message */}
                  <div className="bg-slate-950/60 p-2 rounded border border-rose-900/40 font-mono text-[11px] text-rose-300">
                    {err.message}
                  </div>

                  {/* What This Means */}
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">
                      {isAr ? 'ما الذي يعنيه هذا الخطأ؟ (What this means):' : 'What this means:'}
                    </span>
                    <p className="text-slate-200 leading-relaxed">{isAr ? err.explanationAr : err.explanation}</p>
                  </div>

                  {/* Actionable Try This */}
                  <div className="space-y-1 text-xs bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="font-bold text-cyan-400 uppercase tracking-wider text-[10px] block">
                      {isAr ? 'خطوات تصحيح الخطأ (Try this):' : 'Try this:'}
                    </span>
                    <p className="text-slate-300 leading-relaxed">{isAr ? err.suggestionAr : err.suggestion}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Console Logs */}
        {activeTab === 'console' && (
          <div className="p-4 font-mono text-xs space-y-1 text-slate-300">
            {logs.map((log, index) => (
              <div key={index} className="flex items-start gap-2 py-0.5">
                <span className="text-slate-500 text-[10px]">{log.timestamp}</span>
                <span className={`px-1 rounded text-[10px] font-bold ${
                  log.type === 'error' ? 'bg-rose-500/20 text-rose-300' :
                  log.type === 'warning' ? 'bg-amber-500/20 text-amber-300' :
                  log.type === 'test' ? 'bg-emerald-500/20 text-emerald-300' :
                  'bg-slate-800 text-slate-400'
                }`}>
                  [{log.type.toUpperCase()}]
                </span>
                <span className="flex-1 break-all">{log.message}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: AI Coach & Tutor */}
        {activeTab === 'ai' && (
          <div className="flex flex-col h-full space-y-3 p-4">
            {/* Quick Action Pills for AI Modes */}
            <div className="flex flex-wrap gap-1.5 pb-2 border-b border-slate-800/80">
              <button
                onClick={() => handleAskAI('explain', isAr ? 'اشرح لي المفهوم الأساسي لهذا الدرس' : 'Explain the core concept')}
                className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium cursor-pointer"
              >
                {isAr ? '💡 شرح المفهوم' : '💡 Explain Concept'}
              </button>
              <button
                onClick={() => handleAskAI('debug', isAr ? 'حلل الكود وساعدني في اكتشاف سبب المشكلة' : 'Debug my current code')}
                className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium cursor-pointer"
              >
                {isAr ? '🔍 فحص الأخطاء' : '🔍 Debug Code'}
              </button>
              <button
                onClick={() => handleAskAI('review', isAr ? 'راجع الكود من ناحية المعايير القياسية لفلاتر' : 'Review code best practices')}
                className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium cursor-pointer"
              >
                {isAr ? '✨ مراجعة الكود' : '✨ Code Review'}
              </button>
              <button
                onClick={() => handleAskAI('quiz', isAr ? 'اختبر معلوماتي بسؤال سريع حول هذا الـ Widget' : 'Quiz me about this widget')}
                className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium cursor-pointer"
              >
                {isAr ? '🎯 اختبرني' : '🎯 Quiz Me'}
              </button>
            </div>

            {/* Conversation Flow */}
            <div className="flex-1 overflow-auto space-y-3 pr-1">
              {aiMessages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`p-3 rounded-xl text-xs space-y-1.5 ${
                    msg.role === 'user' 
                      ? 'bg-cyan-950/40 border border-cyan-800/50 text-cyan-100 ml-8' 
                      : 'bg-slate-900/90 border border-slate-800 text-slate-200 mr-8'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-semibold text-[11px] text-slate-400">
                    {msg.role === 'user' ? (
                      <span>{isAr ? 'أنت' : 'You'}</span>
                    ) : (
                      <>
                        <Bot className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-cyan-400">FlutterLab AI</span>
                      </>
                    )}
                  </div>
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {msg.text}
                  </div>
                </div>
              ))}
              {aiLoading && (
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>{isAr ? 'المرشد يفكر ويحلل شجرة فلاتر...' : 'AI Tutor is analyzing the widget tree...'}</span>
                </div>
              )}
            </div>

            {/* Chat Input Field */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (aiPrompt.trim()) handleAskAI('explain', aiPrompt);
              }}
              className="flex items-center gap-2 pt-2 border-t border-slate-800/80"
            >
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder={isAr ? 'اطرح سؤالاً على المرشد الذكي...' : 'Ask the Flutter AI Tutor...'}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                disabled={aiLoading || !aiPrompt.trim()}
                className="p-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white rounded-lg cursor-pointer transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
