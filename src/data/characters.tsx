import React from 'react';
import { CharacterPreset, CharacterType } from '../types';

export const BR_CHARACTERS: CharacterPreset[] = [
  {
    type: 'chief',
    defaultName: 'Chief Tático',
    codename: 'VANGUARDA',
    lore: 'Especialista em gramática normativa e blindagens táticas.',
    themeColor: '#10b981', // Emerald
  },
  {
    type: 'chunli',
    defaultName: 'Agente Chun',
    codename: 'PRECISÃO',
    lore: 'Mestra na velocidade de raciocínio e acentuação gráfica.',
    themeColor: '#3b82f6', // Blue
  },
  {
    type: 'kratos',
    defaultName: 'Spartano',
    codename: 'COLOSSO',
    lore: 'Força bruta e determinação inabalável na regência verbal.',
    themeColor: '#ef4444', // Red
  },
  {
    type: 'guile',
    defaultName: 'Major Guile',
    codename: 'SONIC TANK',
    lore: 'Veterano em pontuação rígida e formação sintática.',
    themeColor: '#84cc16', // Lime
  },
  {
    type: 'jinx',
    defaultName: 'Jinx Cyber',
    codename: 'CAOS LÉXICO',
    lore: 'Velocidade elétrica no domínio do Novo Acordo Ortográfico.',
    themeColor: '#06b6d4', // Cyan
  },
  {
    type: 'isaac',
    defaultName: 'Isaac Engenheiro',
    codename: 'CRAFTEX',
    lore: 'Reparador de concordâncias e operador de campo blindado.',
    themeColor: '#f59e0b', // Amber
  },
  {
    type: 'geralt',
    defaultName: 'Geralt Caçador',
    codename: 'MUTAGÊNICO',
    lore: 'Rastreador impiedoso de desvios da norma culta.',
    themeColor: '#a855f7', // Purple
  },
  {
    type: 'snake',
    defaultName: 'Agente Snake',
    codename: 'INFILTRADO',
    lore: 'Silencioso e cirúrgico em crases proibidas e facultativas.',
    themeColor: '#64748b', // Slate
  },
  {
    type: 'cyber',
    defaultName: 'Cyber Bot',
    codename: 'SINTAXE-9',
    lore: 'Androide com processamento quântico de análise semântica.',
    themeColor: '#14b8a6', // Teal
  },
  {
    type: 'johnny',
    defaultName: 'Johnny Silver',
    codename: 'REBELDE',
    lore: 'Estilo afiado contra o clichê e em defesa da coesão.',
    themeColor: '#f43f5e', // Rose
  },
];

export function getCharacterPreset(type: CharacterType): CharacterPreset {
  return BR_CHARACTERS.find((c) => c.type === type) || BR_CHARACTERS[0];
}

export function renderCharacterSvg(type: CharacterType, className = 'w-full h-full'): React.ReactElement {
  switch (type) {
    case 'chief':
      return (
        <svg className={className} viewBox="0 0 100 180" role="img" aria-label="Operador Chief Tático">
          <rect x="32" y="110" width="15" height="65" rx="4" fill="#1b5e20" stroke="#000" strokeWidth="2" />
          <rect x="53" y="110" width="15" height="65" rx="4" fill="#1b5e20" stroke="#000" strokeWidth="2" />
          <rect x="22" y="48" width="56" height="65" rx="8" fill="#2e7d32" stroke="#4ade80" strokeWidth="2" />
          <rect x="28" y="56" width="44" height="24" rx="4" fill="#1b5e20" />
          <circle cx="50" cy="28" r="19" fill="#166534" stroke="#4ade80" strokeWidth="2" />
          <path d="M 36 22 L 64 22 L 60 34 L 40 34 Z" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1" />
          <circle cx="50" cy="28" r="4" fill="#fef08a" />
        </svg>
      );
    case 'chunli':
      return (
        <svg className={className} viewBox="0 0 100 180" role="img" aria-label="Operadora Agente Chun">
          <rect x="35" y="105" width="12" height="70" fill="#e0a96d" stroke="#000" strokeWidth="1.5" />
          <rect x="53" y="105" width="12" height="70" fill="#e0a96d" stroke="#000" strokeWidth="1.5" />
          <path d="M 28 48 L 72 48 L 65 110 L 35 110 Z" fill="#1d4ed8" stroke="#60a5fa" strokeWidth="2" />
          <path d="M 38 48 L 62 48 L 50 80 Z" fill="#fbbf24" />
          <circle cx="50" cy="28" r="16" fill="#e0a96d" stroke="#000" strokeWidth="1.5" />
          <circle cx="34" cy="20" r="9" fill="#ffffff" stroke="#93c5fd" strokeWidth="2" />
          <circle cx="66" cy="20" r="9" fill="#ffffff" stroke="#93c5fd" strokeWidth="2" />
          <circle cx="45" cy="28" r="2" fill="#1e293b" />
          <circle cx="55" cy="28" r="2" fill="#1e293b" />
        </svg>
      );
    case 'kratos':
      return (
        <svg className={className} viewBox="0 0 100 180" role="img" aria-label="Operador Spartano">
          <rect x="32" y="115" width="14" height="60" rx="3" fill="#3e2723" stroke="#000" strokeWidth="2" />
          <rect x="54" y="115" width="14" height="60" rx="3" fill="#3e2723" stroke="#000" strokeWidth="2" />
          <path d="M 22 50 L 78 50 L 70 118 L 30 118 Z" fill="#8d6e63" stroke="#000" strokeWidth="2" />
          <path d="M 25 50 L 55 118 L 40 118 L 22 50 Z" fill="#dc2626" />
          <circle cx="50" cy="30" r="18" fill="#e5e5e5" stroke="#737373" strokeWidth="2" />
          <path d="M 46 14 L 52 14 L 50 36 L 44 33 Z" fill="#dc2626" />
          <path d="M 36 34 C 36 48, 64 48, 64 34 Z" fill="#27272a" />
        </svg>
      );
    case 'guile':
      return (
        <svg className={className} viewBox="0 0 100 180" role="img" aria-label="Operador Major Guile">
          <rect x="33" y="110" width="14" height="65" fill="#365314" stroke="#000" strokeWidth="2" />
          <rect x="53" y="110" width="14" height="65" fill="#365314" stroke="#000" strokeWidth="2" />
          <rect x="25" y="48" width="50" height="65" rx="4" fill="#4d7c0f" stroke="#a3e635" strokeWidth="2" />
          <circle cx="50" cy="30" r="17" fill="#fed7aa" stroke="#000" strokeWidth="1.5" />
          <path d="M 24 18 L 76 18 L 66 5 L 34 5 Z" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
        </svg>
      );
    case 'jinx':
      return (
        <svg className={className} viewBox="0 0 100 180" role="img" aria-label="Operadora Jinx Cyber">
          <rect x="36" y="110" width="10" height="65" fill="#fde68a" stroke="#000" strokeWidth="1.5" />
          <rect x="54" y="110" width="10" height="65" fill="#fde68a" stroke="#000" strokeWidth="1.5" />
          <rect x="30" y="50" width="40" height="60" rx="3" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
          <circle cx="50" cy="28" r="16" fill="#fde68a" stroke="#000" strokeWidth="1.5" />
          <path d="M 22 25 L 12 120" stroke="#06b6d4" strokeWidth="6" strokeLinecap="round" />
          <path d="M 78 25 L 88 120" stroke="#06b6d4" strokeWidth="6" strokeLinecap="round" />
        </svg>
      );
    case 'isaac':
      return (
        <svg className={className} viewBox="0 0 100 180" role="img" aria-label="Operador Isaac Engenheiro">
          <rect x="33" y="110" width="14" height="65" fill="#451a03" stroke="#000" strokeWidth="2" />
          <rect x="53" y="110" width="14" height="65" fill="#451a03" stroke="#000" strokeWidth="2" />
          <rect x="24" y="48" width="52" height="65" rx="5" fill="#78350f" stroke="#fbbf24" strokeWidth="2" />
          <circle cx="50" cy="28" r="18" fill="#292524" stroke="#000" strokeWidth="2" />
          <path d="M 36 22 L 64 22 M 36 27 L 64 27" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 'geralt':
      return (
        <svg className={className} viewBox="0 0 100 180" role="img" aria-label="Operador Geralt Caçador">
          <rect x="34" y="110" width="13" height="65" fill="#18181b" stroke="#000" strokeWidth="2" />
          <rect x="53" y="110" width="13" height="65" fill="#18181b" stroke="#000" strokeWidth="2" />
          <rect x="26" y="48" width="48" height="65" rx="5" fill="#3f3f46" stroke="#a1a1aa" strokeWidth="2" />
          <circle cx="50" cy="30" r="17" fill="#fecdd3" stroke="#000" strokeWidth="1.5" />
          <path d="M 32 18 C 32 6, 68 6, 68 18 Z" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="72" y1="40" x2="84" y2="10" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 'snake':
      return (
        <svg className={className} viewBox="0 0 100 180" role="img" aria-label="Operador Agente Snake">
          <rect x="33" y="110" width="14" height="65" fill="#1e293b" stroke="#000" strokeWidth="2" />
          <rect x="53" y="110" width="14" height="65" fill="#1e293b" stroke="#000" strokeWidth="2" />
          <rect x="25" y="48" width="50" height="65" rx="5" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
          <circle cx="50" cy="30" r="17" fill="#fed7aa" stroke="#000" strokeWidth="1.5" />
          <rect x="32" y="20" width="36" height="8" rx="2" fill="#0f172a" stroke="#000" strokeWidth="1" />
        </svg>
      );
    case 'cyber':
      return (
        <svg className={className} viewBox="0 0 100 180" role="img" aria-label="Operador Cyber Bot">
          <rect x="33" y="110" width="14" height="65" fill="#0f766e" stroke="#000" strokeWidth="2" />
          <rect x="53" y="110" width="14" height="65" fill="#0f766e" stroke="#000" strokeWidth="2" />
          <rect x="22" y="48" width="56" height="65" rx="6" fill="#115e59" stroke="#2dd4bf" strokeWidth="2" />
          <circle cx="50" cy="28" r="18" fill="#042f2e" stroke="#14b8a6" strokeWidth="2" />
          <polygon points="50,15 65,30 35,30" fill="#2dd4bf" />
          <circle cx="50" cy="28" r="3" fill="#ffffff" />
        </svg>
      );
    case 'johnny':
      return (
        <svg className={className} viewBox="0 0 100 180" role="img" aria-label="Operador Johnny Silver">
          <rect x="34" y="110" width="13" height="65" fill="#09090b" stroke="#000" strokeWidth="2" />
          <rect x="53" y="110" width="13" height="65" fill="#09090b" stroke="#000" strokeWidth="2" />
          <rect x="26" y="48" width="48" height="65" rx="4" fill="#991b1b" stroke="#f87171" strokeWidth="2" />
          <circle cx="50" cy="30" r="17" fill="#fed7aa" stroke="#000" strokeWidth="1.5" />
          <rect x="38" y="26" width="24" height="6" rx="2" fill="#09090b" />
          <path d="M 30 18 L 70 18 L 60 10 L 40 10 Z" fill="#18181b" />
        </svg>
      );
  }
}
