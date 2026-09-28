export interface Badge {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  category: 'dart' | 'widgets' | 'layout' | 'state' | 'mastery';
  unlocked: boolean;
  unlockedAt?: string;
  requiredPoints?: number;
}

export interface LeaderboardUser {
  id: string;
  rank: number;
  name: string;
  title: string;
  titleAr: string;
  points: number;
  completedLessons: number;
  avatarConfig: any;
  badgesCount: number;
  isCurrentUser?: boolean;
}

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge_first_code',
    title: 'First Widget',
    titleAr: 'الويدجت الأول',
    description: 'Executed your first Flutter Widget successfully.',
    descriptionAr: 'قمت بتشغيل أول ويدجت في فلاتر بنجاح.',
    icon: 'Sparkles',
    category: 'widgets',
    unlocked: true,
    unlockedAt: 'Today',
  },
  {
    id: 'badge_dart_master',
    title: 'Sound Null Safety',
    titleAr: 'سيد Null Safety',
    description: 'Mastered non-nullable types and fallback operators in Dart.',
    descriptionAr: 'أتقنت الأنواع غير الفارغة ومُعاملات Dart البديلة.',
    icon: 'Terminal',
    category: 'dart',
    unlocked: true,
    unlockedAt: 'Yesterday',
  },
  {
    id: 'badge_layout_hero',
    title: 'RenderFlex Champion',
    titleAr: 'قاهر أخطاء RenderFlex',
    description: 'Prevented overflow errors using Expanded and Flexible.',
    descriptionAr: 'تغلبت على تجاوزات المساحة باستخدام Expanded و Flexible.',
    icon: 'Grid',
    category: 'layout',
    unlocked: false,
    requiredPoints: 200,
  },
  {
    id: 'badge_state_ninja',
    title: 'Reactivity Ninja',
    titleAr: 'نينجا التفاعلية وsetState',
    description: 'Built dynamic reactive UIs with StatefulWidget.',
    descriptionAr: 'بنيت واجهات تفاعلية تدعم تحديث الحالة عبر setState.',
    icon: 'Zap',
    category: 'state',
    unlocked: false,
    requiredPoints: 350,
  },
  {
    id: 'badge_clean_arch',
    title: 'Flutter Architect',
    titleAr: 'معماري فلاتر المحترف',
    description: 'Organized multi-file Flutter projects with production quality.',
    descriptionAr: 'نظمت مشروعاً متعدد الملفات بجودة إنتاجية عالية.',
    icon: 'Award',
    category: 'mastery',
    unlocked: false,
    requiredPoints: 500,
  },
];

export const INITIAL_LEADERBOARD: LeaderboardUser[] = [
  {
    id: 'user_1',
    rank: 1,
    name: 'Ziyad Al-Mansoor',
    title: 'Lead Flutter Engineer',
    titleAr: 'مهندس فلاتر أول',
    points: 1250,
    completedLessons: 18,
    badgesCount: 8,
    avatarConfig: {
      skinTone: '#fcd34d',
      hairStyle: 'spiky',
      hairColor: '#0284c7',
      outfit: 'cyber_jacket',
      outfitColor: '#4f46e5',
      accessory: 'headphones',
      expression: 'cool',
    },
  },
  {
    id: 'user_2',
    rank: 2,
    name: 'Sarah Connor',
    title: 'Dart Architecture Specialist',
    titleAr: 'أخصائية معمارية دارت',
    points: 1080,
    completedLessons: 15,
    badgesCount: 7,
    avatarConfig: {
      skinTone: '#fbbf24',
      hairStyle: 'curly',
      hairColor: '#ec4899',
      outfit: 'flutter_hoodie',
      outfitColor: '#0284c7',
      accessory: 'glasses',
      expression: 'focused',
    },
  },
  {
    id: 'user_3',
    rank: 3,
    name: 'Omar Dash',
    title: 'Fullstack Flutter Dev',
    titleAr: 'مطور تطبيقات فلاتر',
    points: 820,
    completedLessons: 11,
    badgesCount: 5,
    avatarConfig: {
      skinTone: '#f59e0b',
      hairStyle: 'short',
      hairColor: '#38bdf8',
      outfit: 'dart_tshirt',
      outfitColor: '#2563eb',
      accessory: 'badge',
      expression: 'happy',
    },
    isCurrentUser: true,
  },
  {
    id: 'user_4',
    rank: 4,
    name: 'Layla Mahmoud',
    title: 'UI/UX Flutter Designer',
    titleAr: 'مصممة واجهات فلاتر',
    points: 650,
    completedLessons: 9,
    badgesCount: 4,
    avatarConfig: {
      skinTone: '#d97706',
      hairStyle: 'ponytail',
      hairColor: '#10b981',
      outfit: 'casual_sweater',
      outfitColor: '#059669',
      accessory: 'coffee',
      expression: 'happy',
    },
  },
  {
    id: 'user_5',
    rank: 5,
    name: 'Karim Mostafa',
    title: 'Mobile App Junior',
    titleAr: 'مطور تطبيقات مبتدئ',
    points: 490,
    completedLessons: 7,
    badgesCount: 3,
    avatarConfig: {
      skinTone: '#fcd34d',
      hairStyle: 'dreads',
      hairColor: '#6366f1',
      outfit: 'flutter_hoodie',
      outfitColor: '#7c3aed',
      accessory: 'none',
      expression: 'focused',
    },
  },
];
