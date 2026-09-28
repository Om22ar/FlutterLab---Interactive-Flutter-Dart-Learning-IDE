import React, { useState } from 'react';
import { 
  Play, 
  Sparkles, 
  BookOpen, 
  Code2, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Terminal, 
  Crosshair,
  Sliders,
  FolderTree
} from 'lucide-react';
import { FLUTTER_COLORS } from '../services/flutterParser';

interface LandingHeroProps {
  onStartLearning: () => void;
  onExplorePlayground: () => void;
  onViewCurriculum: () => void;
  language: 'ar' | 'en';
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartLearning,
  onExplorePlayground,
  onViewCurriculum,
  language,
}) => {
  const isAr = language === 'ar';

  // Interactive Mini Demo State on the landing hero
  const [demoColor, setDemoColor] = useState('Colors.blue');
  const [demoWidth, setDemoWidth] = useState(160);
  const [demoRadius, setDemoRadius] = useState(16);

  return (
    <div className="flex-1 overflow-auto bg-[#070a12] text-slate-100 flex flex-col justify-between">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-20 flex flex-col items-center text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>{isAr ? 'منصة ويب تفاعلية لتعليم فلاتر ودارت' : 'Interactive Flutter & Dart Web IDE'}</span>
        </div>

        {/* Heading */}
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            {isAr ? (
              <>
                اكتب كود فلاتر. <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">شاهده فوراً.</span> افهم المعمارية.
              </>
            ) : (
              <>
                Write Flutter code. <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">See it live.</span> Master it.
              </>
            )}
          </h1>
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {isAr 
              ? 'دورة تعليمية فورية: Code → Execute → Render → Inspect → Explain → Practice → Evaluate. لا نعلّمك حفظ الويدجتس، بل نبني نموذجك الذهني لمعمارية فلاتر.'
              : 'Immediate learning loop: Code → Execute → Render → Inspect → Explain → Practice → Evaluate. Build a deep mental model for Dart, Widgets, Constraints, and State.'}
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onStartLearning}
            className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>{isAr ? 'ابدأ التعلم الآن' : 'Start Learning'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onExplorePlayground}
            className="px-5 py-3 rounded-xl font-semibold text-sm text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{isAr ? 'استكشف المختبر الفوري' : 'Explore Playground'}</span>
          </button>

          <button
            onClick={onViewCurriculum}
            className="px-5 py-3 rounded-xl font-semibold text-sm text-slate-400 hover:text-white bg-transparent hover:bg-slate-900/50 border border-transparent hover:border-slate-800 transition-all flex items-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>{isAr ? 'عرض المنهج الكامل' : 'View Curriculum'}</span>
          </button>
        </div>

        {/* Interactive Mini Demo Preview */}
        <div className="w-full max-w-4xl pt-6">
          <div className="bg-slate-950/90 border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {/* Live Code Box */}
            <div className="bg-[#0c1017] p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 space-y-2 flex flex-col justify-between">
              <div className="space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">{isAr ? '// كود فلاتر المباشر' : '// Live Dart Code'}</span>
                <div><span className="text-indigo-400">Container</span>(</div>
                <div className="pl-4">
                  <span className="text-cyan-400">width:</span> <span className="text-amber-400">{demoWidth}</span>,
                </div>
                <div className="pl-4">
                  <span className="text-cyan-400">height:</span> <span className="text-amber-400">120</span>,
                </div>
                <div className="pl-4">
                  <span className="text-cyan-400">color:</span> <span className="text-emerald-400">{demoColor}</span>,
                </div>
                <div className="pl-4">
                  <span className="text-cyan-400">borderRadius:</span> <span className="text-indigo-300">BorderRadius.circular</span>(<span className="text-amber-400">{demoRadius}</span>),
                </div>
                <div className="pl-4">
                  <span className="text-cyan-400">child:</span> <span className="text-indigo-400">Center</span>(
                </div>
                <div className="pl-8">
                  <span className="text-cyan-400">child:</span> <span className="text-indigo-400">Text</span>(<span className="text-teal-300">'FlutterLab'</span>),
                </div>
                <div className="pl-4">),</div>
                <div>)</div>
              </div>

              {/* Interactive Color Controls in Mini Demo */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-sans">{isAr ? 'جرّب تغيير اللون:' : 'Try Color:'}</span>
                <div className="flex items-center gap-1.5">
                  {['Colors.blue', 'Colors.red', 'Colors.green', 'Colors.amber', 'Colors.purple'].map(c => (
                    <button
                      key={c}
                      onClick={() => setDemoColor(c)}
                      style={{ backgroundColor: FLUTTER_COLORS[c] }}
                      className={`w-5 h-5 rounded-full border transition-transform cursor-pointer ${
                        demoColor === c ? 'scale-125 border-white shadow' : 'border-slate-700'
                      }`}
                      title={c}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Live Visual Canvas */}
            <div className="bg-slate-900/50 rounded-xl border border-slate-800 flex flex-col items-center justify-center p-6 relative overflow-hidden flutter-canvas-grid min-h-[220px]">
              <div
                style={{
                  backgroundColor: FLUTTER_COLORS[demoColor] || '#2196F3',
                  width: `${demoWidth}px`,
                  height: '120px',
                  borderRadius: `${demoRadius}px`,
                }}
                className="shadow-xl flex items-center justify-center transition-all duration-300 text-white font-bold text-sm tracking-wide"
              >
                FlutterLab
              </div>

              {/* Visual property slider */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-slate-400 bg-slate-950/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-800">
                <span>{isAr ? 'العرض:' : 'Width:'} {demoWidth}px</span>
                <input
                  type="range"
                  min="120"
                  max="220"
                  value={demoWidth}
                  onChange={(e) => setDemoWidth(Number(e.target.value))}
                  className="w-28 accent-cyan-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl text-left pt-10">
          <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-xl space-y-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Crosshair className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-200">
              {isAr ? 'فاحص شجرة الـ Widgets' : 'Bi-directional Inspector'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isAr 
                ? 'انقر على أي ويدجت في المعاينة لمعرفة موقعه في الكود وتعديل خصائصه بصرياً مع تفسير ما الذي تغير.' 
                : 'Click any widget in the live preview to locate its exact lines in code and inspect properties.'}
            </p>
          </div>

          <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-xl space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Terminal className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-200">
              {isAr ? 'طبقة الأخطاء التعليمية' : 'Educational Error Layer'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isAr 
                ? 'بدل رسائل المترجم المعقدة، يشرح لك النظام: ما الذي حدث؟ لماذا حدث؟ وأين؟ وما هو الحل المقترح.' 
                : 'Transforms cryptic stack traces into actionable explanations: What happened? Why? Where? Try this...'}
            </p>
          </div>

          <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-xl space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-200">
              {isAr ? 'مرشد ذكي بتفكير عميق' : 'AI Coach with High Thinking'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isAr 
                ? 'مرشد سُقراطي يقدم تلميحات تدريجية بدون حرق الحل المباشر، ويشرح معماريات فلاتر المتقدمة.' 
                : 'Socratic AI tutor providing progressive hints without spoiling answers, powered by high reasoning.'}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500">
        FlutterLab • Flutter & Dart Interactive Learning Platform • Sandboxed Runner Simulation
      </footer>
    </div>
  );
};
