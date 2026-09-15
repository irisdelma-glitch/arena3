import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Award,
  RotateCcw,
  Volume2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowLeft,
} from 'lucide-react';
import {
  Player,
  SectorStat,
  Achievement,
  MatchHistoryEntry,
  AccessibilitySettings,
} from '../types';
import { renderCharacterSvg } from '../data/characters';
import { playVictoryFanfare, speakTacticalVoice } from '../utils/audio';

interface PodiumScreenProps {
  finalRanking: Player[];
  sectorStats: SectorStat[];
  achievements: Achievement[];
  matchHistory: MatchHistoryEntry[];
  settings: AccessibilitySettings;
  onRestartGame: () => void;
}

export const PodiumScreen: React.FC<PodiumScreenProps> = ({
  finalRanking,
  sectorStats,
  achievements,
  matchHistory,
  settings,
  onRestartGame,
}) => {
  const [showMistakesModal, setShowMistakesModal] = useState(false);
  const isHighContrast = settings.highContrast;

  // Trigger celebration effects
  useEffect(() => {
    if (settings.soundEnabled) {
      playVictoryFanfare(settings.soundVolume);
    }

    if (!settings.reducedMotion) {
      // Fire celebratory confetti bursts
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#f59e0b', '#06b6d4', '#ef4444', '#a855f7'],
      });

      const timer = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [settings.soundEnabled, settings.soundVolume, settings.reducedMotion]);

  // Determine weakest sector for tactical report
  let lowestAcc = 101;
  let weakestSector: SectorStat | null = null;
  sectorStats.forEach((stat) => {
    const acc = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
    if (acc < lowestAcc) {
      lowestAcc = acc;
      weakestSector = stat;
    }
  });

  const handleSpeakReport = () => {
    if (!weakestSector) return;
    const text = `Atenção esquadrão! O diagnóstico de pós-combate indica que o setor mais vulnerável foi ${(weakestSector as SectorStat).sector} com ${lowestAcc}% de precisão. Reforcem o treino tático nesta área para as próximas operações!`;
    speakTacticalVoice(text, {
      pitch: settings.voicePitch,
      rate: settings.voiceRate,
    });
  };

  const top3 = [
    { rank: 2, label: '2º LUGAR', player: finalRanking[1], heightClass: 'h-36 sm:h-44', color: 'from-slate-400 to-slate-600' },
    { rank: 1, label: 'CAMPEÃO 🏆', player: finalRanking[0], heightClass: 'h-48 sm:h-56', color: 'from-amber-400 to-amber-600' },
    { rank: 3, label: '3º LUGAR', player: finalRanking[2], heightClass: 'h-28 sm:h-36', color: 'from-amber-700 to-amber-900' },
  ];

  const incorrectEntries = matchHistory.filter((h) => !h.isCorrect);

  return (
    <div
      role="region"
      aria-label="Pódio de Vitória Real e Relatório Pós-Combate"
      className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in pb-8"
    >
      {/* Title Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold uppercase tracking-wider mb-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Vitória Real Conquistada</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-['Chakra_Petch'] tracking-wide uppercase text-slate-100">
          Arena de Língua Portuguesa
        </h1>
        <p className="text-sm text-slate-400">
          Sobreviventes Supremos do Círculo Final
        </p>
      </div>

      {/* Podium Display */}
      <div
        className={`rounded-2xl border p-6 flex items-end justify-center gap-3 sm:gap-6 ${
          isHighContrast
            ? 'bg-black border-yellow-400'
            : 'bg-slate-900/90 border-slate-800 shadow-2xl shadow-emerald-500/10'
        }`}
      >
        {top3.map((podium) => {
          if (!podium.player) return null;
          const isWinner = podium.rank === 1;

          return (
            <div
              key={podium.rank}
              className="flex flex-col items-center flex-1 max-w-[180px]"
            >
              {/* Avatar on Top */}
              <div
                className={`mb-2 w-16 sm:w-24 h-24 sm:h-32 flex items-center justify-center relative transition-transform ${
                  isWinner && !settings.reducedMotion ? 'animate-bounce' : ''
                }`}
              >
                {renderCharacterSvg(podium.player.type, 'w-full h-full drop-shadow-lg')}
                {isWinner && (
                  <span className="absolute -top-3 text-2xl" aria-hidden="true">
                    👑
                  </span>
                )}
              </div>

              {/* Player Name and Score */}
              <div className="text-center mb-2">
                <span className="font-bold text-xs sm:text-sm block truncate max-w-[140px] text-white">
                  {podium.player.name}
                </span>
                <span className="text-[10px] sm:text-xs font-mono text-amber-400 font-semibold">
                  {podium.player.score} XP
                </span>
              </div>

              {/* Podium Block */}
              <div
                className={`w-full ${podium.heightClass} rounded-t-xl flex flex-col justify-end items-center pb-4 text-center font-bold text-xs sm:text-sm shadow-lg ${
                  isHighContrast
                    ? isWinner
                      ? 'bg-yellow-400 text-black border-2 border-yellow-300'
                      : 'bg-slate-800 text-yellow-200 border border-slate-700'
                    : `bg-gradient-to-b ${podium.color} text-slate-900 font-black`
                }`}
              >
                <span className="text-xl sm:text-2xl font-black">#{podium.rank}</span>
                <span className="text-[10px] sm:text-xs uppercase tracking-wider">
                  {podium.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tactical Diagnostic Report */}
      <div
        className={`rounded-2xl border p-5 sm:p-6 ${
          isHighContrast
            ? 'bg-black border-yellow-400 text-yellow-100'
            : 'bg-slate-900/80 border-slate-800 text-slate-200'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider font-['Chakra_Petch']">
                Diagnóstico Tático do Esquadrão (Pós-Combate)
              </h2>
              <p className="text-xs text-slate-400">
                Análise de precisão por setor de aprendizagem
              </p>
            </div>
          </div>

          <button
            onClick={handleSpeakReport}
            aria-label="Ouvir diagnóstico tático falado"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold border border-slate-700"
          >
            <Volume2 className="w-4 h-4" />
            <span>Ouvir Diagnóstico</span>
          </button>
        </div>

        {/* Sector Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {sectorStats.map((stat, idx) => {
            const acc = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
            const isWeakest = stat === weakestSector;

            return (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border text-center transition-all ${
                  isWeakest
                    ? 'border-rose-500/60 bg-rose-950/30 text-rose-200'
                    : 'border-slate-800 bg-slate-950/60 text-slate-300'
                }`}
              >
                <span className="text-[11px] uppercase tracking-wider font-mono text-slate-400 block mb-1">
                  {stat.sector}
                </span>
                <div className="text-2xl font-black font-mono">
                  {acc}%
                </div>
                <span className="text-[10px] text-slate-400">
                  {stat.correct} de {stat.total} alvos acertados
                </span>
                {isWeakest && (
                  <span className="mt-1.5 inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40">
                    Setor mais vulnerável
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Tactical Recommendation */}
        {weakestSector && (
          <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs sm:text-sm text-amber-200 leading-relaxed">
            <strong className="text-amber-400 block mb-1">
              🎯 RECOMENDAÇÃO TÁTICA DO COMANDO:
            </strong>
            O esquadrão registrou a menor precisão em{' '}
            <span className="font-bold underline text-amber-300">
              {(weakestSector as SectorStat).sector}
            </span>{' '}
            ({lowestAcc}% de acertos). Recomendamos que os operadores realizem sessões extras de treino focado nas regras desse setor antes do próximo desembarque!
          </div>
        )}
      </div>

      {/* Unlocked Badges & Achievements */}
      <div
        className={`rounded-2xl border p-5 sm:p-6 ${
          isHighContrast
            ? 'bg-black border-yellow-400 text-yellow-100'
            : 'bg-slate-900/80 border-slate-800 text-slate-200'
        }`}
      >
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-5 h-5 text-amber-400" />
          <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider font-['Chakra_Petch']">
            Conquistas & Medalhas Militares
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
                ach.isUnlocked
                  ? 'border-amber-500/40 bg-amber-950/20 text-amber-200'
                  : 'border-slate-800/60 bg-slate-950/40 opacity-40 text-slate-500'
              }`}
            >
              <span className="text-2xl" aria-hidden="true">
                {ach.icon}
              </span>
              <div>
                <span className="text-xs font-bold block text-white">
                  {ach.title}
                </span>
                <span className="text-[10px] leading-tight block text-slate-400">
                  {ach.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions and Review Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onRestartGame}
            className="px-5 py-3 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            <span>Voltar ao Lobby</span>
          </button>

          {incorrectEntries.length > 0 && (
            <button
              onClick={() => setShowMistakesModal(true)}
              className="px-5 py-3 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>Revisar Erros ({incorrectEntries.length})</span>
            </button>
          )}
        </div>

        <button
          onClick={onRestartGame}
          className={`px-8 py-3.5 rounded-xl font-black uppercase tracking-widest text-sm flex items-center gap-2 transition-transform active:scale-95 shadow-xl ml-auto ${
            isHighContrast
              ? 'bg-yellow-400 text-black border-2 border-yellow-300 font-extrabold'
              : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/30'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Nova Aterrissagem na Arena</span>
        </button>
      </div>

      {/* Mistakes Modal */}
      {showMistakesModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="mistakes-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
        >
          <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 id="mistakes-title" className="text-base font-bold font-['Chakra_Petch'] uppercase">
                Debriefing de Respostas Incorretas
              </h3>
              <button
                onClick={() => setShowMistakesModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold uppercase"
              >
                Fechar
              </button>
            </div>

            <div className="space-y-3">
              {incorrectEntries.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm space-y-1.5"
                >
                  <p className="font-semibold text-slate-200">{item.question}</p>
                  <div className="flex items-center gap-2 text-xs text-rose-400">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Opção marcada ({item.playerName}): {item.chosen}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Resposta correta: {item.correct}</span>
                  </div>
                  <p className="text-xs text-slate-400 pt-1 border-t border-slate-800/80">
                    <strong>Explicação: </strong>
                    {item.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
