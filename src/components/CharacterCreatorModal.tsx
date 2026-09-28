import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Palette, 
  Shirt, 
  Scissors, 
  Glasses, 
  Smile, 
  Check, 
  Dice5,
  RotateCcw
} from 'lucide-react';
import { 
  CharacterConfig, 
  DEFAULT_CHARACTER, 
  HAIR_STYLES, 
  OUTFITS, 
  ACCESSORIES, 
  SKIN_TONES, 
  HAIR_COLORS, 
  OUTFIT_COLORS 
} from '../types/character';
import { AvatarSVG } from './AvatarSVG';

interface CharacterCreatorModalProps {
  initialConfig: CharacterConfig;
  onSave: (config: CharacterConfig) => void;
  onClose: () => void;
  language: 'ar' | 'en';
}

export const CharacterCreatorModal: React.FC<CharacterCreatorModalProps> = ({
  initialConfig,
  onSave,
  onClose,
  language,
}) => {
  const isAr = language === 'ar';
  const [config, setConfig] = useState<CharacterConfig>(initialConfig || DEFAULT_CHARACTER);
  const [activeTab, setActiveTab] = useState<'hair' | 'outfit' | 'accessories' | 'colors'>('hair');

  const handleRandomize = () => {
    const randomHair = HAIR_STYLES[Math.floor(Math.random() * HAIR_STYLES.length)].id as any;
    const randomOutfit = OUTFITS[Math.floor(Math.random() * OUTFITS.length)].id as any;
    const randomAccessory = ACCESSORIES[Math.floor(Math.random() * ACCESSORIES.length)].id as any;
    const randomSkin = SKIN_TONES[Math.floor(Math.random() * SKIN_TONES.length)];
    const randomHairColor = HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)];
    const randomOutfitColor = OUTFIT_COLORS[Math.floor(Math.random() * OUTFIT_COLORS.length)];

    setConfig({
      ...config,
      hairStyle: randomHair,
      outfit: randomOutfit,
      accessory: randomAccessory,
      skinTone: randomSkin,
      hairColor: randomHairColor,
      outfitColor: randomOutfitColor,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 md:p-6">
      <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between select-none">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100">
                {isAr ? 'صانع الشخصية والمطور الرمزي' : 'Flutter Developer Character Creator'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {isAr ? 'خصص صورتك الرمزية في مجتمع FlutterLab' : 'Customize your avatar with hairstyles, outfits, and tech accessories'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRandomize}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Dice5 className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isAr ? 'عشوائي' : 'Randomize'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto grid grid-cols-1 md:grid-cols-12 gap-4 p-5">
          {/* Avatar Preview Column */}
          <div className="md:col-span-5 flex flex-col items-center justify-center bg-slate-950/70 p-6 rounded-2xl border border-slate-800/80 space-y-4">
            <div className="relative">
              <div className="w-36 h-36 rounded-full p-1 bg-gradient-to-tr from-cyan-500 via-blue-500 to-pink-500 shadow-xl shadow-cyan-500/10">
                <AvatarSVG config={config} size={136} className="w-full h-full" />
              </div>
              <span className="absolute bottom-1 right-1 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-[10px] font-mono text-cyan-400 font-bold shadow">
                FlutterDev
              </span>
            </div>

            <div className="text-center space-y-1">
              <h4 className="font-bold text-sm text-slate-200">
                {HAIR_STYLES.find(h => h.id === config.hairStyle)?.name}
              </h4>
              <p className="text-[11px] text-slate-400">
                {OUTFITS.find(o => o.id === config.outfit)?.name}
              </p>
            </div>
          </div>

          {/* Customization Options Column */}
          <div className="md:col-span-7 flex flex-col space-y-4">
            {/* Tab switchers */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('hair')}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 font-medium transition-all cursor-pointer ${
                  activeTab === 'hair' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>{isAr ? 'الشعر' : 'Hair'}</span>
              </button>
              <button
                onClick={() => setActiveTab('outfit')}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 font-medium transition-all cursor-pointer ${
                  activeTab === 'outfit' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Shirt className="w-3.5 h-3.5" />
                <span>{isAr ? 'الملابس' : 'Outfit'}</span>
              </button>
              <button
                onClick={() => setActiveTab('accessories')}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 font-medium transition-all cursor-pointer ${
                  activeTab === 'accessories' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Glasses className="w-3.5 h-3.5" />
                <span>{isAr ? 'الإكسسوارات' : 'Gear'}</span>
              </button>
              <button
                onClick={() => setActiveTab('colors')}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 font-medium transition-all cursor-pointer ${
                  activeTab === 'colors' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>{isAr ? 'الألوان' : 'Colors'}</span>
              </button>
            </div>

            {/* Tab: Hair Style */}
            {activeTab === 'hair' && (
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  {isAr ? 'اختر تسريحة الشعر:' : 'Choose Hair Style:'}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {HAIR_STYLES.map(h => (
                    <button
                      key={h.id}
                      onClick={() => setConfig({ ...config, hairStyle: h.id as any })}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-all cursor-pointer ${
                        config.hairStyle === h.id
                          ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-200 font-bold'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <span>{isAr ? h.nameAr : h.name}</span>
                      {config.hairStyle === h.id && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                    </button>
                  ))}
                </div>

                <div className="pt-2 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    {isAr ? 'لون الشعر:' : 'Hair Color:'}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {HAIR_COLORS.map(c => (
                      <button
                        key={c}
                        onClick={() => setConfig({ ...config, hairColor: c })}
                        style={{ backgroundColor: c }}
                        className={`w-6 h-6 rounded-full border transition-transform cursor-pointer ${
                          config.hairColor === c ? 'scale-125 border-white ring-2 ring-cyan-500' : 'border-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Outfit */}
            {activeTab === 'outfit' && (
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  {isAr ? 'اختر الزي البرمجي:' : 'Select Outfit:'}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {OUTFITS.map(o => (
                    <button
                      key={o.id}
                      onClick={() => setConfig({ ...config, outfit: o.id as any })}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-all cursor-pointer ${
                        config.outfit === o.id
                          ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-200 font-bold'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <span>{isAr ? o.nameAr : o.name}</span>
                      {config.outfit === o.id && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                    </button>
                  ))}
                </div>

                <div className="pt-2 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    {isAr ? 'لون الزي:' : 'Outfit Color:'}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {OUTFIT_COLORS.map(c => (
                      <button
                        key={c}
                        onClick={() => setConfig({ ...config, outfitColor: c })}
                        style={{ backgroundColor: c }}
                        className={`w-6 h-6 rounded-full border transition-transform cursor-pointer ${
                          config.outfitColor === c ? 'scale-125 border-white ring-2 ring-cyan-500' : 'border-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Accessories */}
            {activeTab === 'accessories' && (
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  {isAr ? 'اختر الإكسسوارات والمعدات:' : 'Tech Gear & Accessories:'}
                </span>
                <div className="space-y-2">
                  {ACCESSORIES.map(a => (
                    <button
                      key={a.id}
                      onClick={() => setConfig({ ...config, accessory: a.id as any })}
                      className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-all cursor-pointer ${
                        config.accessory === a.id
                          ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-200 font-bold'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <span>{isAr ? a.nameAr : a.name}</span>
                      {config.accessory === a.id && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Colors & Skin tone */}
            {activeTab === 'colors' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    {isAr ? 'لون البشرة:' : 'Skin Tone:'}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {SKIN_TONES.map(s => (
                      <button
                        key={s}
                        onClick={() => setConfig({ ...config, skinTone: s })}
                        style={{ backgroundColor: s }}
                        className={`w-7 h-7 rounded-full border transition-transform cursor-pointer ${
                          config.skinTone === s ? 'scale-125 border-white ring-2 ring-cyan-500' : 'border-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    {isAr ? 'تعبير الوجه:' : 'Facial Expression:'}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {(['happy', 'focused', 'proud', 'cool'] as const).map(exp => (
                      <button
                        key={exp}
                        onClick={() => setConfig({ ...config, expression: exp })}
                        className={`p-2 rounded-xl border text-center capitalize text-xs transition-all cursor-pointer ${
                          config.expression === exp
                            ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-bold'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {exp}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <button
            onClick={() => setConfig(DEFAULT_CHARACTER)}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isAr ? 'استعادة الافتراضي' : 'Reset to Default'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              onClick={() => {
                onSave(config);
                onClose();
              }}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              {isAr ? 'حفظ المظهر الجديد' : 'Save Character'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
