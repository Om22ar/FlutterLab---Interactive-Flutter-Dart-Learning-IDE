export interface CharacterConfig {
  gender: 'developer' | 'designer';
  skinTone: string;
  hairStyle: 'short' | 'curly' | 'ponytail' | 'spiky' | 'dreads';
  hairColor: string;
  outfit: 'flutter_hoodie' | 'dart_tshirt' | 'cyber_jacket' | 'casual_sweater';
  outfitColor: string;
  accessory: 'glasses' | 'headphones' | 'badge' | 'coffee' | 'none';
  expression: 'happy' | 'focused' | 'proud' | 'cool';
}

export const DEFAULT_CHARACTER: CharacterConfig = {
  gender: 'developer',
  skinTone: '#fcd34d',
  hairStyle: 'curly',
  hairColor: '#38bdf8',
  outfit: 'flutter_hoodie',
  outfitColor: '#0284c7',
  accessory: 'headphones',
  expression: 'happy',
};

export const HAIR_STYLES = [
  { id: 'short', name: 'Short Crop', nameAr: 'قصير كلاسيكي' },
  { id: 'curly', name: 'Curly Afro', nameAr: 'كيرلي مموج' },
  { id: 'ponytail', name: 'Ponytail', nameAr: 'ذيل حصان' },
  { id: 'spiky', name: 'Cyber Spiky', nameAr: 'سبايكي عصري' },
  { id: 'dreads', name: 'Dreads', nameAr: 'جدائل فلاتر' },
];

export const OUTFITS = [
  { id: 'flutter_hoodie', name: 'Flutter Dev Hoodie', nameAr: 'هودي مطور فلاتر' },
  { id: 'dart_tshirt', name: 'Dart 3.5 T-Shirt', nameAr: 'تيشيرت دارت' },
  { id: 'cyber_jacket', name: 'Cyberpunk Jacket', nameAr: 'جاكيت برمجي' },
  { id: 'casual_sweater', name: 'Casual Geek Sweater', nameAr: 'سويتر كاجوال' },
];

export const ACCESSORIES = [
  { id: 'glasses', name: 'Tech Glasses', nameAr: 'نظارات ذكية' },
  { id: 'headphones', name: 'Noise-Cancelling Headphones', nameAr: 'سماعات عازلة' },
  { id: 'badge', name: 'Flutter Lead Badge', nameAr: 'شارة قيادي فلاتر' },
  { id: 'coffee', name: 'Espresso Mug', nameAr: 'كوب قهوة برمجية' },
  { id: 'none', name: 'No Accessories', nameAr: 'بدون إكسسوارات' },
];

export const SKIN_TONES = [
  '#fde047', '#fcd34d', '#fbbf24', '#f59e0b', '#d97706', '#b45309', '#78350f'
];

export const HAIR_COLORS = [
  '#38bdf8', '#0284c7', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#6366f1', '#1e293b'
];

export const OUTFIT_COLORS = [
  '#0284c7', '#2563eb', '#4f46e5', '#7c3aed', '#059669', '#dc2626', '#0f172a'
];
