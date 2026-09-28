import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Sparkles, 
  Palette, 
  Maximize2, 
  AlignJustify, 
  Check, 
  ArrowRight,
  Info,
  Type,
  CornerDownRight,
  RefreshCw
} from 'lucide-react';
import { WidgetNode } from '../types/flutter';
import { FLUTTER_COLORS } from '../services/flutterParser';

interface VisualPropertyInspectorProps {
  selectedWidget: WidgetNode | null;
  code: string;
  onApplyCodeChange: (newCode: string, changeSummary: string) => void;
  language: 'ar' | 'en';
}

export const VisualPropertyInspector: React.FC<VisualPropertyInspectorProps> = ({
  selectedWidget,
  code,
  onApplyCodeChange,
  language,
}) => {
  const isAr = language === 'ar';

  // Local draft properties for the selected widget
  const [draftWidth, setDraftWidth] = useState<number | ''>('');
  const [draftHeight, setDraftHeight] = useState<number | ''>('');
  const [draftColor, setDraftColor] = useState<string>('Colors.blue');
  const [draftPadding, setDraftPadding] = useState<number>(16);
  const [draftRadius, setDraftRadius] = useState<number>(8);
  const [draftAlignment, setDraftAlignment] = useState<string>('center');
  const [draftText, setDraftText] = useState<string>('');

  // What Changed diff preview state
  const [diffExplanation, setDiffExplanation] = useState<{
    prop: string;
    before: string;
    after: string;
    explanation: string;
  } | null>(null);

  // Sync state when selected widget changes
  useEffect(() => {
    if (selectedWidget) {
      const p = selectedWidget.properties || {};
      setDraftWidth(p.width !== undefined ? p.width : '');
      setDraftHeight(p.height !== undefined ? p.height : '');
      setDraftColor(p.color || p.textColor || 'Colors.blue');
      setDraftPadding(p.padding || 16);
      setDraftRadius(p.borderRadius || 8);
      setDraftAlignment(p.mainAxisAlignment || 'center');
      setDraftText(p.text || '');
      setDiffExplanation(null);
    }
  }, [selectedWidget]);

  if (!selectedWidget) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-500 bg-slate-950 border border-slate-800/80 rounded-xl">
        <Sliders className="w-10 h-10 mb-2 text-slate-700" />
        <p className="text-xs font-medium text-slate-400">
          {isAr ? 'حدد أي Widget لتعديل خصائصها بصرياً' : 'Select any Widget in Preview or Tree to inspect'}
        </p>
        <span className="text-[11px] text-slate-600 mt-1">
          {isAr ? 'يمكنك تغيير اللون، الأبعاد، والمحاذاة فورياً' : 'Edit color, dimensions, padding, and alignments'}
        </span>
      </div>
    );
  }

  const handlePropertyChange = (property: string, newValue: any) => {
    if (!selectedWidget) return;

    let updatedCode = code;
    let oldVal = '';
    let newValStr = String(newValue);

    if (property === 'color') {
      oldVal = selectedWidget.properties.color || 'Colors.blue';
      setDraftColor(newValue);
      newValStr = newValue;
      // Replace Colors.xxx in code for this widget
      if (updatedCode.includes(oldVal)) {
        updatedCode = updatedCode.replace(oldVal, newValue);
      } else {
        // inject color: newValue
        updatedCode = updatedCode.replace(
          new RegExp(`\\b${selectedWidget.type}\\s*\\(`, 'g'),
          `${selectedWidget.type}(\n  color: ${newValue},`
        );
      }
      setDiffExplanation({
        prop: `${selectedWidget.type}.color`,
        before: `${selectedWidget.type}(color: ${oldVal})`,
        after: `${selectedWidget.type}(color: ${newValue})`,
        explanation: isAr 
          ? `قمت بتغيير لون خلفية الـ ${selectedWidget.type} من ${oldVal} إلى ${newValue}.`
          : `You changed the background color of ${selectedWidget.type} from ${oldVal} to ${newValue}.`
      });
    }

    if (property === 'width') {
      oldVal = String(selectedWidget.properties.width || 150);
      setDraftWidth(newValue);
      if (updatedCode.includes(`width: ${oldVal}`)) {
        updatedCode = updatedCode.replace(`width: ${oldVal}`, `width: ${newValue}`);
      } else if (updatedCode.match(/width:\s*[0-9.]+/)) {
        updatedCode = updatedCode.replace(/width:\s*[0-9.]+/, `width: ${newValue}`);
      }
      setDiffExplanation({
        prop: `${selectedWidget.type}.width`,
        before: `width: ${oldVal}`,
        after: `width: ${newValue}`,
        explanation: isAr 
          ? `قمت بتعديل عرض الـ ${selectedWidget.type} إلى ${newValue} بكسل.`
          : `You updated the width constraint of ${selectedWidget.type} to ${newValue} px.`
      });
    }

    if (property === 'height') {
      oldVal = String(selectedWidget.properties.height || 100);
      setDraftHeight(newValue);
      if (updatedCode.includes(`height: ${oldVal}`)) {
        updatedCode = updatedCode.replace(`height: ${oldVal}`, `height: ${newValue}`);
      } else if (updatedCode.match(/height:\s*[0-9.]+/)) {
        updatedCode = updatedCode.replace(/height:\s*[0-9.]+/, `height: ${newValue}`);
      }
      setDiffExplanation({
        prop: `${selectedWidget.type}.height`,
        before: `height: ${oldVal}`,
        after: `height: ${newValue}`,
        explanation: isAr 
          ? `قمت بتعديل ارتفاع الـ ${selectedWidget.type} إلى ${newValue} بكسل.`
          : `You updated the height of ${selectedWidget.type} to ${newValue} px.`
      });
    }

    if (property === 'mainAxisAlignment') {
      oldVal = selectedWidget.properties.mainAxisAlignment || 'center';
      setDraftAlignment(newValue);
      const oldAlignStr = `MainAxisAlignment.${oldVal}`;
      const newAlignStr = `MainAxisAlignment.${newValue}`;
      if (updatedCode.includes(oldAlignStr)) {
        updatedCode = updatedCode.replace(oldAlignStr, newAlignStr);
      }
      setDiffExplanation({
        prop: `${selectedWidget.type}.mainAxisAlignment`,
        before: `mainAxisAlignment: ${oldAlignStr}`,
        after: `mainAxisAlignment: ${newAlignStr}`,
        explanation: isAr 
          ? `قمت بتغيير محاذاة المحور الرئيسي إلى ${newValue}.`
          : `You adjusted the primary axis distribution to ${newValue}.`
      });
    }

    if (property === 'text') {
      oldVal = selectedWidget.properties.text || '';
      setDraftText(newValue);
      if (oldVal && updatedCode.includes(oldVal)) {
        updatedCode = updatedCode.replace(`'${oldVal}'`, `'${newValue}'`).replace(`"${oldVal}"`, `"${newValue}"`);
      }
      setDiffExplanation({
        prop: `Text.data`,
        before: `'${oldVal}'`,
        after: `'${newValue}'`,
        explanation: isAr 
          ? `قمت بتغيير القيمة النصية المعروضة إلى "${newValue}".`
          : `You altered the displayed text string to "${newValue}".`
      });
    }

    onApplyCodeChange(updatedCode, `${selectedWidget.type}.${property} = ${newValStr}`);
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 border border-slate-800/80 rounded-xl overflow-hidden shadow-2xl">
      {/* Inspector Header */}
      <div className="h-10 bg-slate-900/90 border-b border-slate-800/80 px-3 flex items-center justify-between select-none">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          <span>{isAr ? 'فاحص الخصائص البصري' : 'Visual Property Inspector'}</span>
        </div>

        <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/80 border border-cyan-800/80 px-2 py-0.5 rounded">
          {selectedWidget.type}
        </span>
      </div>

      {/* Inspector Form Controls */}
      <div className="flex-1 overflow-auto p-3.5 space-y-4 text-xs">
        {/* Widget Meta info */}
        <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 text-[11px] space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span>{isAr ? 'النوع:' : 'Type:'}</span>
            <span className="font-mono text-cyan-300 font-semibold">{selectedWidget.type}</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>{isAr ? 'العناصر التابعة:' : 'Children:'}</span>
            <span className="font-mono text-slate-300">{selectedWidget.children.length}</span>
          </div>
          {selectedWidget.sourceRange && (
            <div className="flex items-center justify-between text-slate-400">
              <span>{isAr ? 'أسطر الكود:' : 'Source:'}</span>
              <span className="font-mono text-slate-300">Line {selectedWidget.sourceRange.startLine}-{selectedWidget.sourceRange.endLine}</span>
            </div>
          )}
        </div>

        {/* Text property editor (if Text widget) */}
        {selectedWidget.type === 'Text' && (
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <Type className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isAr ? 'النص (text):' : 'Text Content:'}</span>
            </label>
            <input
              type="text"
              value={draftText}
              onChange={(e) => handlePropertyChange('text', e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
        )}

        {/* Color Palette Picker */}
        {['Container', 'AppBar', 'Text', 'Icon'].includes(selectedWidget.type) && (
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-cyan-400" />
                <span>{isAr ? 'اللون (color):' : 'Color:'}</span>
              </span>
              <span className="font-mono text-[10px] text-cyan-400">{draftColor}</span>
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {[
                'Colors.blue',
                'Colors.red',
                'Colors.green',
                'Colors.amber',
                'Colors.teal',
                'Colors.purple',
                'Colors.orange',
                'Colors.indigo',
                'Colors.grey',
                'Colors.white'
              ].map((c) => (
                <button
                  key={c}
                  onClick={() => handlePropertyChange('color', c)}
                  style={{ backgroundColor: FLUTTER_COLORS[c] }}
                  className={`h-6 rounded border transition-all cursor-pointer flex items-center justify-center ${
                    draftColor === c ? 'border-white scale-110 shadow-md ring-2 ring-cyan-500/50' : 'border-slate-700/50 opacity-80 hover:opacity-100'
                  }`}
                  title={c}
                >
                  {draftColor === c && <Check className="w-3 h-3 text-white drop-shadow" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Width & Height Dimensions */}
        {['Container', 'SizedBox'].includes(selectedWidget.type) && (
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                <Maximize2 className="w-3 h-3 text-cyan-400" />
                <span>Width</span>
              </label>
              <input
                type="number"
                value={draftWidth}
                placeholder="auto"
                onChange={(e) => handlePropertyChange('width', e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                <Maximize2 className="w-3 h-3 text-cyan-400" />
                <span>Height</span>
              </label>
              <input
                type="number"
                value={draftHeight}
                placeholder="auto"
                onChange={(e) => handlePropertyChange('height', e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>
        )}

        {/* Alignment Selector for Row / Column */}
        {['Row', 'Column'].includes(selectedWidget.type) && (
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <AlignJustify className="w-3.5 h-3.5 text-cyan-400" />
              <span>MainAxisAlignment</span>
            </label>
            <div className="grid grid-cols-3 gap-1">
              {['center', 'start', 'end', 'spaceBetween', 'spaceAround', 'spaceEvenly'].map((align) => (
                <button
                  key={align}
                  onClick={() => handlePropertyChange('mainAxisAlignment', align)}
                  className={`py-1 px-1.5 rounded text-[10px] font-mono border transition-all cursor-pointer ${
                    draftAlignment === align
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {align}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* "What Changed?" Interactive Educational Diff Panel (Section 59) */}
        {diffExplanation && (
          <div className="p-3 bg-cyan-950/40 border border-cyan-800/60 rounded-xl space-y-2">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-cyan-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isAr ? 'ما الذي تغيّر في الكود؟' : 'What Changed in Code?'}</span>
            </div>

            <div className="font-mono text-[10px] space-y-1 bg-slate-950 p-2 rounded border border-cyan-900/50">
              <div className="text-rose-400 line-through">
                - {diffExplanation.before}
              </div>
              <div className="text-emerald-400">
                + {diffExplanation.after}
              </div>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed">
              {diffExplanation.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-2.5 bg-slate-900/70 border-t border-slate-800/70 text-[10px] text-slate-400 flex items-center gap-1.5 select-none">
        <CornerDownRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        <span>{isAr ? 'Visual → Code: التعديلات تنعكس برمجياً فوراً.' : 'Visual → Code: Visual edits reflect in Dart code.'}</span>
      </div>
    </div>
  );
};
