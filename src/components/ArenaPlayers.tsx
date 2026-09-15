import React from 'react';
import { Shield, Heart, Skull, Bot, Flame, Radio, RotateCcw } from 'lucide-react';
import { Player, AccessibilitySettings } from '../types';
import { renderCharacterSvg } from '../data/characters';

interface ArenaPlayersProps {
  players: Player[];
  currentPlayerIndex: number;
  settings: AccessibilitySettings;
  onOpenHelpNetwork?: () => void;
}

export const ArenaPlayers: React.FC<ArenaPlayersProps> = ({
  players,
  currentPlayerIndex,
  settings,
  onOpenHelpNetwork,
}) => {
  const isHighContrast = settings.highContrast;

  // Determine colorblind safe indicators
  const getHeartColor = (active: boolean) => {
    if (!active) return 'text-slate-700';
    if (settings.colorblindMode === 'protanopia' || settings.colorblindMode === 'deuteranopia') {
      return 'text-amber-500 fill-amber-500';
    }
    if (settings.colorblindMode === 'tritanopia') {
      return 'text-rose-500 fill-rose-500';
    }
    return 'text-red-500 fill-red-500';
  };

  return (
    <section
      aria-label="Grade de Operadores da Arena"
      className="w-full"
    >
      <div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3.5"
        role="list"
      >
        {players.map((p, idx) => {
          const isTurn = idx === currentPlayerIndex && !p.eliminated;
          const isEliminated = p.eliminated;

          return (
            <div
              key={p.id}
              role="listitem"
              aria-current={isTurn ? 'true' : 'false'}
              aria-label={`Operador ${p.name}, ${
                isEliminated ? 'Eliminado' : `${p.lives} vidas restantes, ${p.shields} escudos`
              }`}
              className={`relative rounded-xl p-2.5 flex flex-col justify-between border transition-all duration-300 ${
                isEliminated
                  ? 'opacity-35 bg-slate-950/80 border-slate-800 grayscale'
                  : isTurn
                  ? isHighContrast
                    ? 'bg-black border-yellow-400 ring-4 ring-yellow-400 scale-[1.02] shadow-[0_0_20px_#facc15]'
                    : 'bg-gradient-to-b from-emerald-950/60 to-slate-900 border-emerald-400 ring-2 ring-emerald-400/80 scale-[1.02] shadow-[0_0_25px_rgba(16,185,129,0.35)]'
                  : isHighContrast
                  ? 'bg-black border-slate-700'
                  : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Turn Banner / Status */}
              <div className="flex items-center justify-between gap-1 mb-1.5 min-h-[22px]">
                <div className="flex items-center gap-1">
                  {p.isBot && (
                    <span
                      title="Operador Bot de IA"
                      className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-0.5"
                    >
                      <Bot className="w-2.5 h-2.5" />
                      BOT
                    </span>
                  )}
                  {p.streak >= 2 && !isEliminated && (
                    <span
                      title={`Combo de ${p.streak} acertos`}
                      className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-0.5"
                    >
                      <Flame className="w-2.5 h-2.5" />
                      {p.streak}x
                    </span>
                  )}
                </div>

                {isTurn && (
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      isHighContrast
                        ? 'bg-yellow-400 text-black font-extrabold'
                        : 'bg-emerald-500 text-black animate-pulse'
                    }`}
                  >
                    ATIVO
                  </span>
                )}

                {isEliminated && (
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700 flex items-center gap-1">
                    <Radio className="w-2.5 h-2.5 animate-pulse text-cyan-400" /> REDE AJUDA
                  </span>
                )}
              </div>

              {/* Character Avatar */}
              <div className="h-20 sm:h-24 w-full flex items-center justify-center relative py-1">
                {renderCharacterSvg(p.type, 'h-full max-h-20 w-auto drop-shadow-md')}

                {/* Shield Overlay if Equipped */}
                {p.shields > 0 && !isEliminated && (
                  <div
                    title={`Blindagem Kevlar Ativa: ${p.shields} carga(s)`}
                    className="absolute top-1 right-1 p-1 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 shadow-[0_0_10px_#06b6d4] animate-pulse"
                  >
                    <Shield className="w-3.5 h-3.5 fill-cyan-400/40" />
                  </div>
                )}
              </div>

              {/* Player Name and Score */}
              <div className="text-center mt-1 border-t border-slate-800/60 pt-1.5">
                <div
                  className="font-bold text-xs sm:text-sm truncate text-slate-100"
                  title={p.name}
                >
                  {p.name}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {p.score} XP
                </div>
              </div>

              {/* Health Hearts or Help Network Action */}
              {!isEliminated ? (
                <div className="mt-2 flex items-center justify-center gap-1">
                  {Array.from({ length: p.maxLives }).map((_, i) => (
                    <Heart
                      key={i}
                      className={`w-3.5 h-3.5 transition-colors ${getHeartColor(i < p.lives)}`}
                      aria-hidden="true"
                    />
                  ))}
                  <span className="sr-only">
                    {p.lives} de {p.maxLives} vidas
                  </span>
                </div>
              ) : (
                <div className="mt-2 flex flex-col items-center">
                  {onOpenHelpNetwork && (
                    <button
                      onClick={onOpenHelpNetwork}
                      title={`Abrir Desafio de Recuperação ou Enviar Suporte como ${p.name}`}
                      className="w-full py-1 px-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-colors"
                    >
                      <RotateCcw className="w-3 h-3 text-cyan-400" />
                      <span>Recuperar</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
