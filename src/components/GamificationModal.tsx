import React, { useState } from 'react';
import { 
  Trophy, 
  Award, 
  Sparkles, 
  Flame, 
  Medal, 
  X, 
  CheckCircle2, 
  Lock, 
  TrendingUp,
  User,
  Star,
  Zap,
  Layers,
  Terminal
} from 'lucide-react';
import { Badge, LeaderboardUser } from '../types/gamification';
import { AvatarSVG } from './AvatarSVG';

interface GamificationModalProps {
  userPoints: number;
  streakDays: number;
  badges: Badge[];
  leaderboard: LeaderboardUser[];
  onOpenCharacterCreator: () => void;
  onClose: () => void;
  language: 'ar' | 'en';
}

export const GamificationModal: React.FC<GamificationModalProps> = ({
  userPoints,
  streakDays,
  badges,
  leaderboard,
  onOpenCharacterCreator,
  onClose,
  language,
}) => {
  const isAr = language === 'ar';
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'badges'>('leaderboard');

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Terminal': return <Terminal className="w-5 h-5 text-cyan-400" />;
      case 'Grid': return <Layers className="w-5 h-5 text-amber-400" />;
      case 'Zap': return <Zap className="w-5 h-5 text-pink-400" />;
      case 'Award': return <Award className="w-5 h-5 text-emerald-400" />;
      default: return <Sparkles className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 md:p-6">
      <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between select-none">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <span>{isAr ? 'لوحة الشرف والإنجازات (Leaderboard & Badges)' : 'FlutterLab Leaderboard & Achievements'}</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                {isAr ? 'اجمع النقاط مع كل تمرين ناجح وافتح شارات إتقان المفاهيم' : 'Earn XP, unlock concept mastery badges, and climb the developer ranks'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* User Stats Quick Bar */}
        <div className="px-6 py-3 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">{isAr ? 'مجموع النقاط:' : 'Total XP:'}</span>
                <span className="font-mono font-extrabold text-sm text-amber-300">{userPoints} pts</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-500/20 flex items-center justify-center">
                <Flame className="w-4 h-4 text-rose-400 fill-rose-400" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">{isAr ? 'أيام الاستمرار:' : 'Streak:'}</span>
                <span className="font-mono font-extrabold text-sm text-rose-300">{streakDays} {isAr ? 'أيام' : 'days'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Award className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">{isAr ? 'الشارات المفتوحة:' : 'Badges:'}</span>
                <span className="font-mono font-extrabold text-sm text-emerald-300">
                  {badges.filter(b => b.unlocked).length}/{badges.length}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onOpenCharacterCreator}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isAr ? 'تعديل الشخصية' : 'Edit Avatar'}</span>
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-6 pt-3 flex items-center gap-2 border-b border-slate-800 bg-slate-950">
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`pb-2 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'leaderboard'
                ? 'border-cyan-500 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>{isAr ? 'المتصدرون (Leaderboard)' : 'Top Developers'}</span>
          </button>

          <button
            onClick={() => setActiveTab('badges')}
            className={`pb-2 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'badges'
                ? 'border-cyan-500 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>{isAr ? 'الشارات والإنجازات (Badges)' : 'Mastery Badges'}</span>
          </button>
        </div>

        {/* Tab 1: Leaderboard */}
        {activeTab === 'leaderboard' && (
          <div className="flex-1 overflow-auto p-5 space-y-2.5">
            {leaderboard.map((user) => {
              const isFirst = user.rank === 1;
              const isSecond = user.rank === 2;
              const isThird = user.rank === 3;

              return (
                <div
                  key={user.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                    user.isCurrentUser
                      ? 'bg-cyan-950/30 border-cyan-500/50 shadow-md ring-1 ring-cyan-500/30'
                      : isFirst
                        ? 'bg-amber-950/20 border-amber-500/30'
                        : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Rank Number / Medal */}
                    <div className="w-8 flex items-center justify-center font-mono font-bold text-sm">
                      {isFirst ? (
                        <Medal className="w-6 h-6 text-amber-400" />
                      ) : isSecond ? (
                        <Medal className="w-6 h-6 text-slate-300" />
                      ) : isThird ? (
                        <Medal className="w-6 h-6 text-amber-600" />
                      ) : (
                        <span className="text-slate-500">#{user.rank}</span>
                      )}
                    </div>

                    {/* User Avatar */}
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-700 bg-slate-800 shrink-0">
                      <AvatarSVG config={user.avatarConfig} size={40} className="w-full h-full" />
                    </div>

                    {/* Name & Title */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-100">{user.name}</span>
                        {user.isCurrentUser && (
                          <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[9px] uppercase font-bold">
                            {isAr ? 'أنت' : 'You'}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 block">
                        {isAr ? user.titleAr : user.title}
                      </span>
                    </div>
                  </div>

                  {/* Points & Stats */}
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <span className="text-[10px] text-slate-500 uppercase block">{isAr ? 'الدروس' : 'Lessons'}</span>
                      <span className="font-mono text-xs text-slate-300 font-semibold">{user.completedLessons}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 uppercase block">{isAr ? 'النقاط' : 'XP Points'}</span>
                      <span className="font-mono text-sm font-extrabold text-amber-400">{user.points}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Badges */}
        {activeTab === 'badges' && (
          <div className="flex-1 overflow-auto p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
            {badges.map((b) => (
              <div
                key={b.id}
                className={`p-4 rounded-xl border flex items-start gap-3.5 transition-all ${
                  b.unlocked
                    ? 'bg-slate-900/80 border-slate-700/80'
                    : 'bg-slate-950/40 border-slate-900 opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                    b.unlocked
                      ? 'bg-amber-500/15 border-amber-500/30'
                      : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  {b.unlocked ? (
                    getBadgeIcon(b.icon)
                  ) : (
                    <Lock className="w-5 h-5 text-slate-600" />
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-slate-100">
                      {isAr ? b.titleAr : b.title}
                    </h4>
                    {b.unlocked ? (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{isAr ? 'مفتوح' : 'Unlocked'}</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-500">
                        {b.requiredPoints} XP
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {isAr ? b.descriptionAr : b.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
          >
            {isAr ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
