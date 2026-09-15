export type CharacterType =
  | 'kratos'
  | 'chief'
  | 'chunli'
  | 'guile'
  | 'jinx'
  | 'isaac'
  | 'geralt'
  | 'snake'
  | 'cyber'
  | 'johnny';

export interface CharacterPreset {
  type: CharacterType;
  defaultName: string;
  codename: string;
  lore: string;
  themeColor: string;
}

export interface PlayerInventory {
  shield: number;       // Number of shields (absorbs damage)
  radar5050: number;    // 50/50 eliminates 2 wrong answers
  medkit: number;       // Restores 1 life
  doubleXp: number;     // Doubles score this turn
}

export interface Player {
  id: number;
  name: string;
  type: CharacterType;
  lives: number;
  maxLives: number;
  shields: number;
  eliminated: boolean;
  score: number;
  streak: number;
  maxStreak: number;
  correctAnswers: number;
  totalAnswers: number;
  inventory: PlayerInventory;
  isBot?: boolean;
  inHelpNetwork?: boolean;
  assistedCount?: number;
  respawnCount?: number;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  answer: string;
  explanation: string;
  ruleCategory: string;
  tip?: string;
  difficulty: 'fácil' | 'médio' | 'difícil';
}

export interface LevelData {
  level: number;
  title: string;
  subtitle: string;
  sectorName: string;
  audioText: string;
  congrats: string;
  description: string;
  stormTimeMinutes: number;
  questions: Question[];
}

export type ColorblindMode = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
export type FontSizeScale = 'normal' | 'large' | 'extralarge';

export interface AccessibilitySettings {
  highContrast: boolean;
  fontSize: FontSizeScale;
  colorblindMode: ColorblindMode;
  autoSpeakQuestions: boolean;
  soundEnabled: boolean;
  soundVolume: number;        // 0 to 1
  voicePitch: number;         // 0.5 to 1.5
  voiceRate: number;          // 0.7 to 1.3
  reducedMotion: boolean;
  keyboardShortcutsEnabled: boolean;
  showVisualCaptions: boolean;
}

export interface GameSettings {
  turnTimeLimit: number;      // 0 = infinite, 15, 30, 45
  startingLives: number;
  enablePowerups: boolean;
  enableBots: boolean;
  difficulty: 'todas' | 'fácil' | 'médio' | 'difícil';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  isUnlocked: boolean;
}

export interface SectorStat {
  sector: string;
  total: number;
  correct: number;
  category: string;
}

export interface MatchHistoryEntry {
  question: string;
  playerName: string;
  chosen: string;
  correct: string;
  isCorrect: boolean;
  explanation: string;
  level: number;
}
