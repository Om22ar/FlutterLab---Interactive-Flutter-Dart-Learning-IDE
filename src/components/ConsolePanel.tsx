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
  ExternalLink,
  Send,
  Loader2,
  Lightbulb,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { EducationalError, ExerciseTest, Lesson } from '../types/flutter';
import { EvaluationResult } from '../services/testEngine';
import { askAiTutor, AiTutorMode, AiTutorResponse } from '../services/aiTutorService';

interface ConsolePanelProps {
  logs: { type: 'info' | 'warning' | 'error' | 'test' | 'change'; message: string; timestamp: string }[];
  errors: EducationalError[];
  evaluation: EvaluationResult | null;
  lesson: Lesson | null;
  code: string;
  onGoToLine: (line: number) => void;
  onApplySolution: (solutionCode: string) => void;
  language: 'ar' | 'en';
}

export const ConsolePanel: React.FC<ConsolePanelProps> = ({
  logs,
  errors,
  evaluation,
  lesson,
  code,
  onGoToLine,
  onApplySolution,
  language,
}) => {
  const isAr = language === 'ar';
  const [activeTab, setActiveTab] = useState<'console' | 'errors' | 'tests' | 'ai'>('tests');

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

  // Switch to errors tab automatically if syntax/compiler error occurs
  React.useEffect(() => {
    if (errors.length > 0) {
      setActiveTab('errors');
    }
  }, [errors]);

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
        errorMessage: errors.length > 0 ? errors[0].message : undefined,
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
          {/* Test Results Tab */}
          <button
            onClick={() => setActiveTab('tests')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'tests'
                ? 'bg-slate-800 text-cyan-300 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {evaluation?.allPassed ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>{isAr ? 'نتائج التقييم (Tests)' : 'Tests'}</span>
            {evaluation && (
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                evaluation.allPassed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-300'
              }`}>
                {evaluation.passCount}/{evaluation.totalCount}
              </span>
            )}
          </button>

          {/* Educational Error Layer Tab */}
          <button
            onClick={() => setActiveTab('errors')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'errors'
                ? 'bg-slate-800 text-rose-300 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>{isAr ? 'تحليل الأخطاء التعليمي' : 'Error Layer'}</span>
            {errors.length > 0 && (
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300">
                {errors.length}
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
                ? 'bg-indigo-950/60 text-indigo-300 border border-indigo-700/60'
                : 'text-indigo-400/80 hover:text-indigo-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{isAr ? 'المرشد الذكي (AI Coach)' : 'AI Coach'}</span>
          </button>
        </div>

        {/* Quick Help / Hint Action */}
        <div className="flex items-center gap-2">
          {lesson && (
            <button
              onClick={() => handleAskAI('hint', isAr ? 'أعطني تلميحاً للخطوة التالية' : 'Give me a hint for the next step')}
              className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAr ? `تلميح ${hintAttempt}` : `Hint ${hintAttempt}`}</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab Panels Content */}
      <div className="flex-1 overflow-auto p-4">
        {/* Tab 1: Test Results */}
        {activeTab === 'tests' && (
          <div className="space-y-3">
            {evaluation ? (
              <>
                {evaluation.allPassed ? (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-emerald-300">
                          {isAr ? 'اكتمل التمرين بنجاح!' : 'Challenge Completed Successfully!'}
                        </h4>
                        <p className="text-[11px] text-emerald-400/80">
                          {isAr ? 'تم استيفاء جميع المتطلبات البصرية والهيكلية.' : 'All widget structure and property assertions passed.'}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      {isAr 
                        ? `اجتاز الكود ${evaluation.passCount} من أصل ${evaluation.totalCount} اختبارات.` 
                        : `Code passed ${evaluation.passCount} of ${evaluation.totalCount} tests.`}
                    </span>
                    <button
                      onClick={() => handleAskAI('hint')}
                      className="text-xs text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Lightbulb className="w-3 h-3" />
                      <span>{isAr ? 'أحتاج مساعدة' : 'Need guidance?'}</span>
                    </button>
                  </div>
                )}

                {/* Individual test assertions list */}
                <div className="space-y-2">
                  {evaluation.testResults.map((tr, index) => (
                    <div 
                      key={tr.test.id || index}
                      className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 transition-all ${
                        tr.passed 
                          ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-200' 
                          : 'bg-rose-950/20 border-rose-900/40 text-rose-200'
                      }`}
                    >
                      {tr.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      )}

                      <div className="flex-1 space-y-0.5">
                        <div className="font-semibold text-xs flex items-center justify-between">
                          <span>{isAr ? tr.test.descriptionAr : tr.test.description}</span>
                          <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                            tr.passed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                          }`}>
                            {tr.passed ? 'PASS' : 'FAIL'}
                          </span>
                        </div>
                        <p className="text-[11px] opacity-80">{tr.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Show Solution Accordion */}
                {lesson && !evaluation.allPassed && (
                  <div className="pt-2">
                    {!showSolutionConfirm ? (
                      <button
                        onClick={() => setShowSolutionConfirm(true)}
                        className="text-xs text-slate-500 hover:text-slate-400 underline cursor-pointer"
                      >
                        {isAr ? 'كشف كود الحل النموذجي' : 'Reveal Solution Code'}
                      </button>
                    ) : (
                      <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-xl space-y-2 text-xs">
                        <p className="text-amber-300">
                          {isAr 
                            ? 'هل أنت متأكد؟ محاولة حل التمرين بنفسك تعزز نموذجك الذهني لفلاتر!' 
                            : 'Are you sure? Solving it yourself strengthens your Flutter mental model!'}
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              onApplySolution(lesson.solutionCode);
                              setShowSolutionConfirm(false);
                            }}
                            className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-semibold cursor-pointer"
                          >
                            {isAr ? 'تطبيق الحل في المحرر' : 'Apply Solution to Editor'}
                          </button>
                          <button
                            onClick={() => setShowSolutionConfirm(false)}
                            className="px-2 py-1 text-slate-400 hover:text-white text-xs cursor-pointer"
                          >
                            {isAr ? 'إلغاء' : 'Cancel'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <p className="text-xs text-slate-500">{isAr ? 'اضغط على زر تشغيل (Run) لاختبار الكود.' : 'Run your code to run tests.'}</p>
            )}
          </div>
        )}

        {/* Tab 2: Educational Error Layer (Section 47) */}
        {activeTab === 'errors' && (
          <div className="space-y-4">
            {errors.length === 0 ? (
              <div className="p-6 text-center text-slate-500 space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500" />
                <p className="text-xs text-emerald-400 font-semibold">{isAr ? 'لا توجد أخطاء في الكود!' : 'No compilation or syntax errors found!'}</p>
                <p className="text-[11px] text-slate-400">{isAr ? 'الكود سليم وقابل للتنفيذ على Flutter Web.' : 'Code syntax is valid and runnable.'}</p>
              </div>
            ) : (
              errors.map((err, idx) => (
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

                  {/* What Happened */}
                  <div className="space-y-1 text-xs">
                    <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px] block">
                      {isAr ? 'ما الذي حدث؟ (What happened)' : 'What happened:'}
                    </span>
                    <p className="text-slate-200">{isAr ? err.explanationAr : err.explanation}</p>
                  </div>

                  {/* How to think / Try this */}
                  <div className="space-y-1 text-xs bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="font-semibold text-cyan-400 uppercase tracking-wider text-[10px] block">
                      {isAr ? 'جرب هذا الحل (Try this):' : 'Try this:'}
                    </span>
                    <p className="text-slate-300">{isAr ? err.suggestionAr : err.suggestion}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Console Logs */}
        {activeTab === 'console' && (
          <div className="font-mono text-xs space-y-1 text-slate-300">
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
          <div className="flex flex-col h-full space-y-3">
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
