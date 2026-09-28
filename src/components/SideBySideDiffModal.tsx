import React, { useState } from 'react';
import { 
  X, 
  Code2, 
  ArrowRight, 
  Check, 
  RotateCcw, 
  Sparkles, 
  FileCode,
  Copy,
  CheckCheck
} from 'lucide-react';
import { computeSideBySideDiff } from '../services/diffService';

interface SideBySideDiffModalProps {
  title: string;
  subtitle: string;
  leftTitle: string;
  rightTitle: string;
  leftCode: string;
  rightCode: string;
  actionButtonLabel: string;
  onApplyRight: (code: string) => void;
  onClose: () => void;
  language: 'ar' | 'en';
}

export const SideBySideDiffModal: React.FC<SideBySideDiffModalProps> = ({
  title,
  subtitle,
  leftTitle,
  rightTitle,
  leftCode,
  rightCode,
  actionButtonLabel,
  onApplyRight,
  onClose,
  language,
}) => {
  const isAr = language === 'ar';
  const { leftLines, rightLines } = computeSideBySideDiff(leftCode, rightCode);
  const [copied, setCopied] = useState(false);

  const handleCopyRight = () => {
    navigator.clipboard.writeText(rightCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 md:p-6">
      <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between select-none">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <span>{title}</span>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
                  Side-by-Side Diff
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">{subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyRight}
              className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isAr ? 'نسخ الكود' : 'Copy Code'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="px-4 py-2 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-rose-500/40 border border-rose-500/60 inline-block" />
              <span>{isAr ? 'حذف / كودك السابق' : 'Deletions (Old)'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500/40 border border-emerald-500/60 inline-block" />
              <span>{isAr ? 'إضافات / الكود المقترح' : 'Additions (New)'}</span>
            </div>
          </div>
          <span className="font-mono text-slate-500 text-[10px]">Dart 3.5 • LTR formatting</span>
        </div>

        {/* Side-by-Side Viewport */}
        <div className="flex-1 overflow-auto grid grid-cols-2 divide-x divide-slate-800 font-mono text-xs leading-5 bg-[#090d16]">
          {/* Left Column (Deletions / Old) */}
          <div className="flex flex-col overflow-auto">
            <div className="sticky top-0 bg-slate-900/90 backdrop-blur border-b border-slate-800 px-3 py-1.5 text-[11px] font-sans font-bold text-rose-300 flex items-center justify-between z-10">
              <span>{leftTitle}</span>
              <span className="text-[10px] text-slate-500 font-mono">{leftLines.length} lines</span>
            </div>
            <div className="p-2 space-y-0.5">
              {leftLines.map((line, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2 px-1.5 py-0.5 rounded text-[11px] ${
                    line.type === 'removed'
                      ? 'bg-rose-950/40 text-rose-200 border-l-2 border-rose-500 font-medium'
                      : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <span className="w-6 text-right select-none text-slate-600 shrink-0 text-[10px]">
                    {line.lineNumber}
                  </span>
                  <span className="select-none font-bold shrink-0 text-slate-500">
                    {line.type === 'removed' ? '-' : ' '}
                  </span>
                  <pre className="whitespace-pre overflow-x-auto flex-1 font-mono">
                    {line.text || ' '}
                  </pre>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (Additions / New) */}
          <div className="flex flex-col overflow-auto">
            <div className="sticky top-0 bg-slate-900/90 backdrop-blur border-b border-slate-800 px-3 py-1.5 text-[11px] font-sans font-bold text-emerald-300 flex items-center justify-between z-10">
              <span>{rightTitle}</span>
              <span className="text-[10px] text-slate-500 font-mono">{rightLines.length} lines</span>
            </div>
            <div className="p-2 space-y-0.5">
              {rightLines.map((line, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2 px-1.5 py-0.5 rounded text-[11px] ${
                    line.type === 'added'
                      ? 'bg-emerald-950/40 text-emerald-200 border-l-2 border-emerald-500 font-medium'
                      : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <span className="w-6 text-right select-none text-slate-600 shrink-0 text-[10px]">
                    {line.lineNumber}
                  </span>
                  <span className="select-none font-bold shrink-0 text-slate-500">
                    {line.type === 'added' ? '+' : ' '}
                  </span>
                  <pre className="whitespace-pre overflow-x-auto flex-1 font-mono">
                    {line.text || ' '}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            {isAr ? 'إلغاء' : 'Cancel'}
          </button>

          <button
            onClick={() => {
              onApplyRight(rightCode);
              onClose();
            }}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white rounded-lg text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{actionButtonLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
