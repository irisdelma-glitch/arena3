import React from 'react';
import {
  Shield,
  Volume2,
  VolumeX,
  Sliders,
  Flame,
  Clock,
  Radio,
  Award,
  ArrowLeft,
  RotateCcw,
} from 'lucide-react';
import { AccessibilitySettings, Player } from '../types';

interface TacticalHudProps {
  currentLevelTitle: string;
  currentSector: string;
  activePlayer: Player;
  roundNumber: number;
  timeLeft: number | null;
  settings: AccessibilitySettings;
  onOpenAccessibility: () => void;
  onToggleSound: () => void;
  onOpenAchievements: () => void;
  unlockedBadgesCount: number;
  onBackToLobby: () => void;
  onOpenHelpNetwork?: () => void;
  helpNetworkCount?: number;
}

export const TacticalHud: React.FC<TacticalHudProps> = ({
  currentLevelTitle,
  currentSector,
  activePlayer,
  roundNumber,
  timeLeft,
  settings,
  onOpenAccessibility,
  onToggleSound,
  onOpenAchievements,
  unlockedBadgesCount,
  onBackToLobby,
  onOpenHelpNetwork,
  helpNetworkCount = 0,
}) => {
  const isHighContrast = settings.highContrast;

  return (
    <header
      role="banner"
      aria-label="Painel Tático Superior"
      className={`w-full px-4 py-3 rounded-xl border transition-all ${
        isHighContrast
          ? 'bg-black border-yellow-400 text-yellow-100'
          : 'bg-slate-900/90 border-slate-800 text-slate-100 backdrop-blur-md shadow-lg shadow-black/40'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Back Button and Level Info */}
        <div className="flex items-center gap-3">
          {/* Botão Voltar */}
          <button
            onClick={onBackToLobby}
            aria-label="Voltar ao Lobby da Partida"
            title="Voltar ao Lobby"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all ${
              isHighContrast
                ? 'bg-black border-yellow-400 text-yellow-300 hover:bg-yellow-950/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 hover:border-slate-600'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
            <span>Voltar</span>
          </button>

          <div
            className={`w-2.5 h-2.5 rounded-full animate-pulse ${
              isHighContrast ? 'bg-yellow-400' : 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
            }`}
            aria-hidden="true"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs font-mono tracking-widest text-slate-400 uppercase">
                {currentSector}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                R{roundNumber}
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-bold font-['Chakra_Petch'] tracking-wide">
              {currentLevelTitle}
            </h1>
          </div>
        </div>

        {/* Turn, Combo, Timer, Help Network & Actions */}
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          {/* Rede de Ajuda Button (visible when anyone is in help network or always accessible) */}
          {helpNetworkCount > 0 && onOpenHelpNetwork && (
            <button
              onClick={onOpenHelpNetwork}
              aria-label={`Abrir Rede de Ajuda: ${helpNetworkCount} operadores em modo suporte/recuperação`}
              title="Rede de Ajuda & Desafios de Recuperação"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/50 text-xs font-bold transition-all shadow-[0_0_12px_rgba(6,182,212,0.25)] animate-pulse"
            >
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              <span>Rede de Ajuda ({helpNetworkCount})</span>
            </button>
          )}
          {/* Timer if active */}
          {timeLeft !== null && (
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border font-mono font-bold text-xs ${
                timeLeft <= 5
                  ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse'
                  : 'bg-slate-800/80 border-slate-700 text-slate-200'
              }`}
              aria-label={`Tempo restante: ${timeLeft} segundos`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{timeLeft}s</span>
            </div>
          )}

          {/* Active Operator Pill */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
              isHighContrast
                ? 'bg-black border-yellow-400 text-yellow-300'
                : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
            }`}
          >
            <Radio className="w-4 h-4 animate-spin-slow text-emerald-400" aria-hidden="true" />
            <div className="text-left">
              <span className="text-[9px] uppercase tracking-wider block text-slate-400">
                Vez de Disparo
              </span>
              <span className="text-xs sm:text-sm font-bold truncate max-w-[120px] block">
                {activePlayer.name}
              </span>
            </div>

            {/* Streak Multiplier */}
            {activePlayer.streak >= 2 && (
              <div
                className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-mono font-bold animate-bounce"
                title={`Combo atual: ${activePlayer.streak} acertos seguidos! Multiplicador ativo`}
              >
                <Flame className="w-3 h-3 text-amber-400" />
                <span>x{(1 + activePlayer.streak * 0.2).toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Player Score */}
          <div className="hidden sm:flex flex-col items-end text-right">
            <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono">
              XP do Operador
            </span>
            <span className="text-sm font-bold font-mono text-amber-400">
              {activePlayer.score} pts
            </span>
          </div>

          {/* Quick Utility Actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenAchievements}
              aria-label={`Abrir Conquistas Militares. ${unlockedBadgesCount} desbloqueadas`}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-amber-400 hover:text-amber-300 border border-slate-700 transition-colors relative"
            >
              <Award className="w-4 h-4" />
              {unlockedBadgesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-black font-bold text-[9px] flex items-center justify-center">
                  {unlockedBadgesCount}
                </span>
              )}
            </button>

            <button
              onClick={onToggleSound}
              aria-label={settings.soundEnabled ? 'Silenciar áudio' : 'Ativar efeitos sonoros'}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            >
              {settings.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-rose-400" />
              )}
            </button>

            <button
              onClick={onOpenAccessibility}
              aria-label="Abrir Painel de Acessibilidade (Atalho: Alt+A)"
              title="Acessibilidade (Alt+A)"
              className={`p-2 rounded-lg border transition-colors flex items-center gap-1 ${
                isHighContrast
                  ? 'bg-yellow-400 text-black border-yellow-400 font-bold'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-emerald-400 border-slate-700'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span className="hidden md:inline text-xs font-semibold">Acessibilidade</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
