import React from 'react';
import { CharacterConfig } from '../types/character';

interface AvatarSVGProps {
  config: CharacterConfig;
  size?: number;
  className?: string;
}

export const AvatarSVG: React.FC<AvatarSVGProps> = ({ config, size = 120, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`rounded-full shadow-inner select-none ${className}`}
    >
      <defs>
        <radialGradient id="avatarBg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </radialGradient>
        <linearGradient id="flutterLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>

      {/* Background Circle */}
      <circle cx="80" cy="80" r="76" fill="url(#avatarBg)" stroke="#334155" strokeWidth="4" />

      {/* Body / Outfit */}
      <path
        d="M32 152 C32 116, 52 104, 80 104 C108 104, 128 116, 128 152 Z"
        fill={config.outfitColor}
      />

      {/* Outfit Details (Collars / Logos) */}
      {config.outfit === 'flutter_hoodie' && (
        <>
          {/* Hoodie drawstrings */}
          <path d="M72 114 L70 134 M88 114 L90 134" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          {/* Flutter Dash emblem */}
          <path d="M76 122 L84 122 L80 130 Z" fill="url(#flutterLogoGrad)" />
        </>
      )}

      {config.outfit === 'dart_tshirt' && (
        <circle cx="80" cy="126" r="6" fill="#38bdf8" />
      )}

      {config.outfit === 'cyber_jacket' && (
        <path d="M80 104 L80 152" stroke="#06b6d4" strokeWidth="2.5" strokeDasharray="3 3" />
      )}

      {/* Neck */}
      <rect x="72" y="86" width="16" height="20" rx="3" fill={config.skinTone} />

      {/* Head / Face */}
      <ellipse cx="80" cy="68" rx="28" ry="30" fill={config.skinTone} />

      {/* Eyes */}
      <circle cx="70" cy="66" r="3.5" fill="#0f172a" />
      <circle cx="90" cy="66" r="3.5" fill="#0f172a" />
      <circle cx="71.5" cy="64.5" r="1.2" fill="#ffffff" />
      <circle cx="91.5" cy="64.5" r="1.2" fill="#ffffff" />

      {/* Eyebrows */}
      {config.expression === 'focused' ? (
        <>
          <path d="M64 58 L76 61" stroke={config.hairColor} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M96 58 L84 61" stroke={config.hairColor} strokeWidth="2.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M64 60 Q70 56 76 60" stroke={config.hairColor} strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M84 60 Q90 56 96 60" stroke={config.hairColor} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </>
      )}

      {/* Nose */}
      <path d="M80 67 L78 74 L82 74" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* Mouth */}
      {config.expression === 'happy' || config.expression === 'proud' ? (
        <path d="M73 78 Q80 85 87 78" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="#be123c" />
      ) : (
        <path d="M74 80 L86 80" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
      )}

      {/* Hair Styles */}
      {config.hairStyle === 'short' && (
        <path
          d="M52 64 C52 40, 64 36, 80 36 C96 36, 108 40, 108 64 C100 52, 90 48, 80 48 C70 48, 60 52, 52 64 Z"
          fill={config.hairColor}
        />
      )}

      {config.hairStyle === 'curly' && (
        <g fill={config.hairColor}>
          <circle cx="58" cy="46" r="14" />
          <circle cx="74" cy="38" r="16" />
          <circle cx="90" cy="40" r="15" />
          <circle cx="102" cy="48" r="14" />
          <circle cx="50" cy="58" r="12" />
          <circle cx="110" cy="58" r="12" />
        </g>
      )}

      {config.hairStyle === 'spiky' && (
        <path
          d="M50 62 L60 36 L70 46 L80 30 L90 46 L100 36 L110 62 C100 50, 60 50, 50 62 Z"
          fill={config.hairColor}
        />
      )}

      {config.hairStyle === 'ponytail' && (
        <g fill={config.hairColor}>
          <path d="M52 64 C52 40, 64 36, 80 36 C96 36, 108 40, 108 64 C100 52, 90 48, 80 48 C70 48, 60 52, 52 64 Z" />
          <path d="M106 50 C120 44, 126 66, 122 84 C116 84, 114 66, 106 50 Z" />
        </g>
      )}

      {config.hairStyle === 'dreads' && (
        <g fill={config.hairColor}>
          <rect x="52" y="38" width="8" height="38" rx="4" />
          <rect x="64" y="34" width="8" height="42" rx="4" />
          <rect x="76" y="32" width="8" height="44" rx="4" />
          <rect x="88" y="34" width="8" height="42" rx="4" />
          <rect x="100" y="38" width="8" height="38" rx="4" />
        </g>
      )}

      {/* Accessories */}
      {config.accessory === 'glasses' && (
        <g stroke="#06b6d4" strokeWidth="2.5" fill="rgba(6, 182, 212, 0.15)">
          <rect x="62" y="60" width="16" height="12" rx="2" />
          <rect x="82" y="60" width="16" height="12" rx="2" />
          <line x1="78" y1="65" x2="82" y2="65" />
          <line x1="56" y1="64" x2="62" y2="64" />
          <line x1="98" y1="64" x2="104" y2="64" />
        </g>
      )}

      {config.accessory === 'headphones' && (
        <g>
          {/* Headband */}
          <path d="M48 64 C48 36, 112 36, 112 64" stroke="#f43f5e" strokeWidth="5" strokeLinecap="round" fill="none" />
          {/* Earcups */}
          <rect x="44" y="60" width="8" height="18" rx="3" fill="#f43f5e" />
          <rect x="108" y="60" width="8" height="18" rx="3" fill="#f43f5e" />
        </g>
      )}

      {config.accessory === 'badge' && (
        <g>
          <polygon points="106,120 114,124 112,134 104,130" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
        </g>
      )}

      {config.accessory === 'coffee' && (
        <g transform="translate(100, 118)">
          <rect x="0" y="0" width="14" height="18" rx="2" fill="#e2e8f0" />
          <path d="M14 4 C18 4, 18 12, 14 12" stroke="#e2e8f0" strokeWidth="2" fill="none" />
          {/* Heart / flutter splash */}
          <circle cx="7" cy="8" r="3" fill="#0284c7" />
        </g>
      )}
    </svg>
  );
};
