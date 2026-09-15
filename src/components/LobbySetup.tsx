import React from 'react';
import {
  Users,
  Shield,
  Bot,
  Clock,
  Sparkles,
  Sliders,
  Play,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { CharacterPreset, CharacterType, AccessibilitySettings, GameSettings } from '../types';
import { BR_CHARACTERS, renderCharacterSvg } from '../data/characters';

interface LobbySetupProps {
  playerCount: number;
  onPlayerCountChange: (count: number) => void;
  playerNames: string[];
  onPlayerNameChange: (index: number, name: string) => void;
  playerCharacters: CharacterType[];
  onPlayerCharacterChange: (index: number, type: CharacterType) => void;
  settings: AccessibilitySettings;
  gameSettings: GameSettings;
  onUpdateGameSettings: (newSettings: Partial<GameSettings>) => void;
  onOpenAccessibility: () => void;
  onToggleSound: () => void;
  onStartGame: () => void;
}

export const LobbySetup: React.FC<LobbySetupProps> = ({
  playerCount,
  onPlayerCountChange,
  playerNames,
  onPlayerNameChange,
  playerCharacters,
  onPlayerCharacterChange,
  settings,
  gameSettings,
  onUpdateGameSettings,
  onOpenAccessibility,
  onToggleSound,
  onStartGame,
}) => {
  const isHighContrast = settings.highContrast;

  return (
    <div
      role="region"
      aria-label="Lobby de Escalação de Operadores"
      className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in pb-10"
    >
      {/* Top Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Arena de Combate Gramatical</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-['Chakra_Petch'] tracking-wide uppercase text-slate-100">
            Battle Royale: Língua Portuguesa
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Escalação de Operadores • Sobrevivência Tática de Norma Padrão
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSound}
            aria-label={settings.soundEnabled ? 'Silenciar áudio' : 'Ativar efeitos sonoros'}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            {settings.soundEnabled ? (
              <Volume2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <VolumeX className="w-5 h-5 text-rose-400" />
            )}
          </button>

          <button
            onClick={onOpenAccessibility}
            aria-label="Abrir Painel de Acessibilidade"
            className={`px-4 py-2.5 rounded-xl border flex items-center gap-2 font-bold text-xs uppercase tracking-wider transition-all ${
              isHighContrast
                ? 'bg-yellow-400 text-black border-yellow-400 font-extrabold'
                : 'bg-slate-900 border-slate-800 text-emerald-400 hover:border-emerald-500/50'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Acessibilidade (Alt+A)</span>
          </button>
        </div>
      </header>

      {/* Match Configuration Options */}
      <div
        className={`rounded-2xl border p-5 sm:p-6 transition-all ${
          isHighContrast
            ? 'bg-black border-yellow-400 text-yellow-100'
            : 'bg-slate-900/80 border-slate-800 text-slate-200 shadow-xl'
        }`}
      >
        <h2 className="text-sm font-bold uppercase tracking-wider font-['Chakra_Petch'] mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-400" />
          <span>Configuração da Partida</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Number of Players Slider */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="player-count-slider" className="text-xs font-semibold text-slate-300">
                Operadores em Campo:
              </label>
              <span className="font-mono font-bold text-emerald-400 text-base">
                {playerCount}
              </span>
            </div>
            <input
              id="player-count-slider"
              type="range"
              min="2"
              max="10"
              value={playerCount}
              onChange={(e) => onPlayerCountChange(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>2 Mín</span>
              <span>5 Médio</span>
              <span>10 Máx</span>
            </div>
          </div>

          {/* Time Limit per Turn */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <label htmlFor="turn-time-select" className="text-xs font-semibold text-slate-300">
                Tempo por Disparo:
              </label>
            </div>
            <select
              id="turn-time-select"
              value={gameSettings.turnTimeLimit}
              onChange={(e) =>
                onUpdateGameSettings({ turnTimeLimit: parseInt(e.target.value, 10) })
              }
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-semibold text-slate-100 focus:border-emerald-400 focus:outline-none"
            >
              <option value={0}>Infinito (Sem pressão de tempo)</option>
              <option value={15}>15 segundos (Ritmo Rápido)</option>
              <option value={30}>30 segundos (Equilibrado)</option>
              <option value={45}>45 segundos (Tático)</option>
            </select>
          </div>

          {/* Solo vs Bots Mode */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-semibold text-slate-300 block">
                  Completar com Bots IA
                </span>
              </div>
              <span className="text-[10px] text-slate-400">
                Ideal para jogar solo ou em dupla
              </span>
            </div>
            <button
              onClick={() =>
                onUpdateGameSettings({ enableBots: !gameSettings.enableBots })
              }
              role="switch"
              aria-checked={gameSettings.enableBots}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                gameSettings.enableBots
                  ? 'bg-purple-500 text-white shadow-[0_0_10px_#a855f7]'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {gameSettings.enableBots ? 'ATIVO' : 'DESATIVADO'}
            </button>
          </div>
        </div>
      </div>

      {/* Squad Roster Customization Cards */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider font-['Chakra_Petch'] mb-3 flex items-center gap-2 text-slate-300">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Personalização dos Operadores de Combate</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Array.from({ length: playerCount }).map((_, idx) => {
            const currentType = playerCharacters[idx] || BR_CHARACTERS[idx % BR_CHARACTERS.length].type;
            const isBot = gameSettings.enableBots && idx > 0;

            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                  isHighContrast
                    ? 'bg-black border-yellow-400'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Character Preview */}
                <div className="h-20 flex items-center justify-center py-1">
                  {renderCharacterSvg(currentType, 'h-full max-h-20 w-auto')}
                </div>

                {/* Character Selector */}
                <div className="mt-2 space-y-2">
                  <select
                    value={currentType}
                    disabled={isBot}
                    onChange={(e) =>
                      onPlayerCharacterChange(idx, e.target.value as CharacterType)
                    }
                    aria-label={`Visual do Operador ${idx + 1}`}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-[11px] font-semibold text-slate-200 focus:border-emerald-400 focus:outline-none"
                  >
                    {BR_CHARACTERS.map((char) => (
                      <option key={char.type} value={char.type}>
                        {char.defaultName} ({char.codename})
                      </option>
                    ))}
                  </select>

                  <div className="relative">
                    <input
                      type="text"
                      maxLength={16}
                      value={playerNames[idx]}
                      disabled={isBot}
                      onChange={(e) => onPlayerNameChange(idx, e.target.value)}
                      placeholder={`Nome ${idx + 1}`}
                      aria-label={`Nome do Operador ${idx + 1}`}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-center font-bold text-white focus:border-emerald-400 focus:outline-none"
                    />
                    {isBot && (
                      <span className="absolute right-2 top-2 text-[9px] font-mono px-1 rounded bg-purple-900 text-purple-300">
                        BOT
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ready Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={onStartGame}
          className={`w-full sm:w-auto px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-base flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-xl ${
            isHighContrast
              ? 'bg-yellow-400 text-black border-2 border-yellow-300 font-extrabold'
              : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_30px_rgba(16,185,129,0.3)]'
          }`}
        >
          <Play className="w-5 h-5 fill-current" />
          <span>Acessar Briefing da Missão</span>
        </button>
      </div>
    </div>
  );
};
