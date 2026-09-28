import React, { useRef, useEffect, useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Terminal, 
  Sparkles, 
  AlertCircle,
  HelpCircle,
  Undo2,
  Redo2
} from 'lucide-react';
import { SourceRange, EducationalError } from '../types/flutter';

interface CodeEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  highlightRange?: SourceRange | null;
  errors: EducationalError[];
  onRun: () => void;
  fileName?: string;
  language: 'ar' | 'en';
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  highlightRange,
  errors,
  onRun,
  fileName = 'main.dart',
  language,
}) => {
  const isAr = language === 'ar';
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<string[]>([code]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const lines = code.split('\n');

  // Sync line numbers scroll with textarea scroll
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  // Keyboard shortcuts (Ctrl+Enter to run, Tab for 2 spaces)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onRun();
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      handleCodeUpdate(newCode);

      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  const handleCodeUpdate = (newCode: string) => {
    onChange(newCode);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newCode);
    if (newHistory.length > 50) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      onChange(prev);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      onChange(next);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Insert standard snippets
  const insertSnippet = (snippet: string) => {
    const target = textareaRef.current;
    if (!target) return;
    const start = target.selectionStart;
    const end = target.selectionEnd;
    const newCode = code.substring(0, start) + snippet + code.substring(end);
    handleCodeUpdate(newCode);
  };

  // Scroll to highlighted range when source mapping activates
  useEffect(() => {
    if (highlightRange && textareaRef.current) {
      const lineIndex = highlightRange.startLine - 1;
      const lineHeight = 20; // px
      const scrollPos = Math.max(0, lineIndex * lineHeight - 60);
      textareaRef.current.scrollTop = scrollPos;
    }
  }, [highlightRange]);

  return (
    <div className="h-full flex flex-col bg-[#0d1117] border border-slate-800/80 rounded-xl overflow-hidden shadow-2xl relative">
      {/* Editor Header Bar */}
      <div className="h-10 bg-slate-900/90 border-b border-slate-800/80 px-3.5 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800/80 rounded-md border border-slate-700/60 text-xs font-mono text-cyan-300">
            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{fileName}</span>
          </div>

          {errors.length > 0 && (
            <div className="flex items-center gap-1 text-[11px] text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-md">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.length} {isAr ? 'أخطاء' : 'errors'}</span>
            </div>
          )}

          {highlightRange && (
            <span className="text-[11px] text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded">
              {isAr ? `السطر المحدد: ${highlightRange.startLine}-${highlightRange.endLine}` : `Lines ${highlightRange.startLine}-${highlightRange.endLine}`}
            </span>
          )}
        </div>

        {/* Editor Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
            title="Undo"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
            title="Redo"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleCopy}
            className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
            title={copied ? 'Copied!' : 'Copy Code'}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Snippet Insertion Quick Bar */}
      <div className="h-7 bg-slate-950/60 border-b border-slate-800/50 px-3 flex items-center gap-1.5 text-[11px] text-slate-400 overflow-x-auto">
        <span className="text-slate-500 font-mono text-[10px] uppercase tracking-wider">{isAr ? 'إدراج سريع:' : 'Quick:'}</span>
        <button
          onClick={() => insertSnippet("Container(\n  width: 150,\n  height: 150,\n  color: Colors.blue,\n)")}
          className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-mono text-[11px] cursor-pointer"
        >
          +Container
        </button>
        <button
          onClick={() => insertSnippet("Row(\n  mainAxisAlignment: MainAxisAlignment.center,\n  children: [],\n)")}
          className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-mono text-[11px] cursor-pointer"
        >
          +Row
        </button>
        <button
          onClick={() => insertSnippet("Column(\n  mainAxisAlignment: MainAxisAlignment.center,\n  children: [],\n)")}
          className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-mono text-[11px] cursor-pointer"
        >
          +Column
        </button>
        <button
          onClick={() => insertSnippet("Expanded(\n  child: Container(),\n)")}
          className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-mono text-[11px] cursor-pointer"
        >
          +Expanded
        </button>
        <button
          onClick={() => insertSnippet("ElevatedButton(\n  child: Text('Click Me'),\n)")}
          className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-mono text-[11px] cursor-pointer"
        >
          +Button
        </button>
      </div>

      {/* Editor Body with Line Numbers & Code Input */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Line Numbers with Error Markers */}
        <div 
          ref={lineNumbersRef}
          className="w-12 bg-slate-950/80 border-r border-slate-800/80 py-3 font-mono text-xs text-slate-600 select-none overflow-hidden text-right pr-2.5 flex flex-col"
        >
          {lines.map((_, index) => {
            const lineNum = index + 1;
            const isErrorLine = errors.some(err => err.line === lineNum);
            const isHighlighted = highlightRange && lineNum >= highlightRange.startLine && lineNum <= highlightRange.endLine;

            return (
              <div 
                key={index} 
                className={`h-5 leading-5 flex items-center justify-end gap-1 ${
                  isErrorLine 
                    ? 'text-rose-400 font-bold bg-rose-500/10' 
                    : isHighlighted 
                      ? 'text-cyan-400 font-bold bg-cyan-500/10' 
                      : ''
                }`}
              >
                {isErrorLine && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block animate-pulse" />}
                <span>{lineNum}</span>
              </div>
            );
          })}
        </div>

        {/* Text Area */}
        <div className="flex-1 relative h-full overflow-hidden">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => handleCodeUpdate(e.target.value)}
            onScroll={handleScroll}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            className="w-full h-full bg-transparent text-slate-100 font-mono text-xs leading-5 p-3 resize-none focus:outline-none overflow-auto whitespace-pre selection:bg-cyan-500/30 selection:text-cyan-200"
            style={{ tabSize: 2 }}
          />

          {/* Source mapping visual indicator banner inside editor */}
          {highlightRange && (
            <div 
              className="absolute left-0 right-0 pointer-events-none bg-cyan-500/10 border-y border-cyan-500/30 transition-all duration-300"
              style={{
                top: `${(highlightRange.startLine - 1) * 20 + 12}px`,
                height: `${(highlightRange.endLine - highlightRange.startLine + 1) * 20}px`
              }}
            />
          )}
        </div>
      </div>

      {/* Editor Footer / Hotkey reminder */}
      <div className="h-6 bg-slate-950 border-t border-slate-800/60 px-3 flex items-center justify-between text-[11px] text-slate-500 font-mono select-none">
        <div className="flex items-center gap-2">
          <span>Dart 3.5.0</span>
          <span>•</span>
          <span>Flutter 3.24.0 (Web)</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Ctrl + Enter: Run</span>
        </div>
      </div>
    </div>
  );
};
