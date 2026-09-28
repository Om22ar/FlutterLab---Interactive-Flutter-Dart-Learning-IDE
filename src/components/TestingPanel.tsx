import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Layers, 
  Code2, 
  Sliders, 
  ChevronRight, 
  Check, 
  HelpCircle,
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';
import { DetailedEvaluationResult, TestCaseResult } from '../services/detailedTestEngine';
import { Lesson } from '../types/flutter';

interface TestingPanelProps {
  detailedEvaluation: DetailedEvaluationResult | null;
  lesson: Lesson | null;
  language: 'ar' | 'en';
  onRunCode: () => void;
  onAskAiForHint: () => void;
  onOpenSolutionDiff: () => void;
}

export const TestingPanel: React.FC<TestingPanelProps> = ({
  detailedEvaluation,
  lesson,
  language,
  onRunCode,
  onAskAiForHint,
  onOpenSolutionDiff,
}) => {
  const isAr = language === 'ar';
  const [filter, setFilter] = useState<'all' | 'failed' | 'passed'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!lesson) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-500">
        <Layers className="w-8 h-8 mb-2 text-slate-700" />
        <p className="text-xs">{isAr ? 'اختر درساً من المنهج لعرض حالات الاختبار والتقييم' : 'Select a curriculum lesson to view test cases'}</p>
      </div>
    );
  }

  const results = detailedEvaluation?.results || [];
  const filteredResults = results.filter(r => {
    if (filter === 'failed') return !r.passed;
    if (filter === 'passed') return r.passed;
    return true;
  });

  const passCount = detailedEvaluation?.passCount || 0;
  const totalCount = detailedEvaluation?.totalCount || (lesson.tests?.length || 0);
  const allPassed = detailedEvaluation?.allPassed || false;
  const percentage = totalCount > 0 ? Math.round((passCount / totalCount) * 100) : 0;

  return (
    <div className="h-full flex flex-col bg-slate-950 font-sans text-xs select-none">
      {/* Testing Header Banner */}
      <div className="p-3 bg-slate-900/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">
              {isAr ? 'حالات الاختبار المعرفة:' : 'Defined Test Cases:'}
            </span>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
              {lesson.tests?.length || 0} {isAr ? 'اختبارات' : 'tests'}
            </span>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-2">
            <div className="w-28 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  allPassed ? 'bg-emerald-500' : 'bg-cyan-500'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className={`font-mono text-xs font-bold ${allPassed ? 'text-emerald-400' : 'text-cyan-400'}`}>
              {percentage}%
            </span>
          </div>
        </div>

        {/* Filter and Quick Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px]">
            <button
              onClick={() => setFilter('all')}
              className={`px-2 py-0.5 rounded cursor-pointer ${filter === 'all' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {isAr ? 'الكل' : 'All'} ({results.length})
            </button>
            <button
              onClick={() => setFilter('failed')}
              className={`px-2 py-0.5 rounded cursor-pointer ${filter === 'failed' ? 'bg-rose-500/20 text-rose-300 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {isAr ? 'المتبقي' : 'Failed'} ({results.filter(r => !r.passed).length})
            </button>
            <button
              onClick={() => setFilter('passed')}
              className={`px-2 py-0.5 rounded cursor-pointer ${filter === 'passed' ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {isAr ? 'الناجح' : 'Passed'} ({results.filter(r => r.passed).length})
            </button>
          </div>

          {/* Diff Solution button */}
          <button
            onClick={onOpenSolutionDiff}
            className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all flex items-center gap-1 cursor-pointer"
            title={isAr ? 'مقارنة الكود الحالي مع الحل النموذجي' : 'Compare current code with solution diff'}
          >
            <Code2 className="w-3.5 h-3.5 text-amber-400" />
            <span>{isAr ? 'مقارنة الحل' : 'Diff Solution'}</span>
          </button>
        </div>
      </div>

      {/* Tests Breakdown List */}
      <div className="flex-1 overflow-auto p-3 space-y-2">
        {filteredResults.length === 0 ? (
          <div className="p-6 text-center text-slate-500 space-y-2">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400" />
            <p className="text-xs text-slate-300 font-medium">
              {filter === 'failed' 
                ? (isAr ? 'رائع! لا توجد اختبارات راسبة حالياً.' : 'Great job! No failing test cases.') 
                : (isAr ? 'اضغط على زر تشغيل (Run) لتنفيذ الاختبارات.' : 'Click Run to execute test cases.')}
            </p>
          </div>
        ) : (
          filteredResults.map((r, idx) => {
            const isExpanded = expandedId === (r.test.id || String(idx));
            return (
              <div
                key={r.test.id || idx}
                className={`rounded-xl border transition-all overflow-hidden ${
                  r.passed
                    ? 'bg-emerald-950/20 border-emerald-800/40'
                    : 'bg-rose-950/25 border-rose-800/50'
                }`}
              >
                {/* Header row */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : (r.test.id || String(idx)))}
                  className="p-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-900/30"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {r.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}

                    <div className="truncate">
                      <span className={`font-semibold text-xs ${r.passed ? 'text-emerald-300' : 'text-rose-200'}`}>
                        {isAr ? r.test.descriptionAr : r.test.description}
                      </span>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span className="font-mono uppercase bg-slate-900 px-1 rounded border border-slate-800">
                          {r.assertionType}
                        </span>
                        <span className="truncate opacity-80">{r.reason}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                        r.passed
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {r.passed ? 'PASSED' : 'FAILED'}
                    </span>
                    <ChevronRight
                      className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                    />
                  </div>
                </div>

                {/* Expanded Detailed Assertion breakdown */}
                {isExpanded && (
                  <div className="px-3 pb-3 pt-1 border-t border-slate-800/60 bg-slate-950/70 space-y-2 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                      {/* Expected */}
                      <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800 space-y-1">
                        <span className="text-slate-400 text-[10px] font-sans uppercase font-bold block">
                          {isAr ? 'المخرجات المتوقعة (Expected Output):' : 'Expected Assertion:'}
                        </span>
                        <p className="text-cyan-300 font-semibold break-all">
                          {r.expectedOutput}
                        </p>
                      </div>

                      {/* Actual */}
                      <div className={`p-2 rounded-lg border space-y-1 ${
                        r.passed ? 'bg-slate-900/80 border-slate-800' : 'bg-rose-950/30 border-rose-900/60'
                      }`}>
                        <span className="text-slate-400 text-[10px] font-sans uppercase font-bold block">
                          {isAr ? 'المخرجات الفعلية (Actual Output):' : 'Actual Output in Tree:'}
                        </span>
                        <p className={`font-semibold break-all ${r.passed ? 'text-emerald-300' : 'text-rose-300'}`}>
                          {r.actualOutput}
                        </p>
                      </div>
                    </div>

                    {!r.passed && (
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-slate-400">
                          {isAr ? 'هل تحتاج إلى مساعدة في اجتياز هذا الاختبار؟' : 'Need help passing this assertion?'}
                        </span>
                        <button
                          onClick={onAskAiForHint}
                          className="px-2.5 py-1 rounded bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Sparkles className="w-3 h-3 text-cyan-400" />
                          <span>{isAr ? 'اسأل المرشد الذكي' : 'Ask AI Tutor'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
