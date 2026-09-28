import React from 'react';
import { 
  Award, 
  X, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  AlertCircle,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { SkillNode } from '../types/flutter';

interface SkillGraphModalProps {
  skills: SkillNode[];
  onClose: () => void;
  onGoToTopic?: (topic: string) => void;
  language: 'ar' | 'en';
}

export const SkillGraphModal: React.FC<SkillGraphModalProps> = ({
  skills,
  onClose,
  onGoToTopic,
  language,
}) => {
  const isAr = language === 'ar';

  const categories = Array.from(new Set(skills.map(s => s.category)));

  // Identify skill with lowest mastery that has a recommendation
  const prioritizedRecommendation = skills
    .filter(s => s.recommendation)
    .sort((a, b) => a.mastery - b.mastery)[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between select-none bg-slate-900/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100">
                {isAr ? 'خريطة المهارات والنموذج الذهني (Skill Graph)' : 'Flutter Skill Graph & Mastery'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {isAr ? 'تقييم تشخيصي تلقائي لمهاراتك في فلاتر ودارت' : 'Diagnostic tracking of your Flutter engineering competencies'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-auto p-5 space-y-5">
          {/* Smart Recommendation Alert (Section 50) */}
          {prioritizedRecommendation && (
            <div className="p-3.5 bg-cyan-950/40 border border-cyan-800/60 rounded-xl flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <span className="font-bold text-cyan-300 block">
                  {isAr ? 'توصية ذكية مخصصة لك (Smart Recommendation):' : 'Personalized Diagnostic Recommendation:'}
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {isAr ? prioritizedRecommendation.recommendationAr : prioritizedRecommendation.recommendation}
                </p>
              </div>
            </div>
          )}

          {/* Skill Categories & Mastery Bars */}
          <div className="space-y-4">
            {categories.map(cat => {
              const catSkills = skills.filter(s => s.category === cat);
              return (
                <div key={cat} className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {cat}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {catSkills.map(skill => (
                      <div 
                        key={skill.id}
                        className="p-3 bg-slate-900/70 border border-slate-800 rounded-xl space-y-2 hover:border-slate-700 transition-all"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-200">
                            {isAr ? skill.nameAr : skill.name}
                          </span>
                          <span className={`font-mono text-xs font-bold ${
                            skill.mastery >= 80 ? 'text-emerald-400' :
                            skill.mastery >= 60 ? 'text-cyan-400' : 'text-amber-400'
                          }`}>
                            {skill.mastery}%
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-700 ${
                              skill.mastery >= 80 ? 'bg-emerald-500' :
                              skill.mastery >= 60 ? 'bg-cyan-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${skill.mastery}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/60 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
          >
            {isAr ? 'متابعة التعلم' : 'Continue Learning'}
          </button>
        </div>
      </div>
    </div>
  );
};
