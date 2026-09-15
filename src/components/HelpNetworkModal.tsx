import React, { useState } from 'react';
import {
  Radio,
  Heart,
  Shield,
  Lightbulb,
  CheckCircle2,
  XCircle,
  Volume2,
  Sparkles,
  ArrowLeft,
  Share2,
  RotateCcw,
} from 'lucide-react';
import { Player, Question, AccessibilitySettings } from '../types';
import { renderCharacterSvg } from '../data/characters';
import { RECOVERY_QUESTIONS } from '../data/questions';
import { speakTacticalVoice, cancelVoice } from '../utils/audio';

interface HelpNetworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  eliminatedPlayers: Player[];
  activePlayer: Player;
  currentQuestion: Question | null;
  settings: AccessibilitySettings;
  onRespawnPlayer: (playerId: number) => void;
  onSupportEliminateOptions: (helperName: string) => void;
  onSupportGiveShield: (helperName: string) => void;
  onSupportGiveTip: (helperName: string) => void;
}

export const HelpNetworkModal: React.FC<HelpNetworkModalProps> = ({
  isOpen,
  onClose,
  eliminatedPlayers,
  activePlayer,
  currentQuestion,
  settings,
  onRespawnPlayer,
  onSupportEliminateOptions,
  onSupportGiveShield,
  onSupportGiveTip,
}) => {
  const [selectedPlayerId, setSelectedPlayerId] = useState<number>(
    eliminatedPlayers[0]?.id ?? -1
  );
  const [activeTab, setActiveTab] = useState<'recovery' | 'support'>('recovery');

  // Recovery challenge state
  const [currentRecIndex, setCurrentRecIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showTip, setShowTip] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [supportMessage, setSupportMessage] = useState<string | null>(null);

  if (!isOpen || eliminatedPlayers.length === 0) return null;

  const currentHelper =
    eliminatedPlayers.find((p) => p.id === selectedPlayerId) || eliminatedPlayers[0];
  const recQuestion =
    RECOVERY_QUESTIONS[currentRecIndex % RECOVERY_QUESTIONS.length] || RECOVERY_QUESTIONS[0];
  const isHighContrast = settings.highContrast;

  const handleNextChallenge = () => {
    cancelVoice();
    setCurrentRecIndex((prev) => prev + 1);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(null);
    setShowTip(false);
  };

  const handleSelectOption = (opt: string) => {
    if (isAnswered) return;
    const correct = opt === recQuestion.answer;
    setSelectedOption(opt);
    setIsAnswered(true);
    setIsCorrect(correct);

    if (correct) {
      speakTacticalVoice('Alvo atingido!', {
        pitch: settings.voicePitch,
        rate: settings.voiceRate,
      });
    } else {
      speakTacticalVoice('Dano sofrido!', {
        pitch: settings.voicePitch,
        rate: settings.voiceRate,
      });
    }
  };

  const handleCompleteRespawn = () => {
    if (currentHelper && isCorrect) {
      onRespawnPlayer(currentHelper.id);
      onClose();
    }
  };

  const handleSpeakRecovery = () => {
    setIsSpeaking(true);
    const letters = ['A', 'B', 'C', 'D'];
    const optionsText = recQuestion.options
      .map((opt, i) => `Alternativa ${letters[i]}: ${opt}`)
      .join('. ');
    const textToSpeak = `Desafio de Recuperação: ${recQuestion.text}. ${optionsText}`;

    speakTacticalVoice(textToSpeak, {
      pitch: settings.voicePitch,
      rate: settings.voiceRate,
      onEnd: () => setIsSpeaking(false),
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-network-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in"
    >
      <div
        className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border p-4 sm:p-6 transition-all ${
          isHighContrast
            ? 'bg-black border-yellow-400 text-yellow-100 shadow-[0_0_40px_#facc15]'
            : 'bg-slate-900 border-cyan-500/50 text-slate-100 shadow-[0_0_50px_rgba(6,182,212,0.2)]'
        }`}
      >
        {/* Header with Back Button */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
          <button
            onClick={onClose}
            aria-label="Voltar à visão da arena"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold uppercase transition-colors ${
              isHighContrast
                ? 'bg-black border-yellow-400 text-yellow-300 hover:bg-yellow-950/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span>Voltar à Arena</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h2
              id="help-network-title"
              className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-cyan-300"
            >
              Rede de Ajuda • Modo Espectador Ativo
            </h2>
          </div>
        </div>

        {/* Student Selection (if multiple students eliminated) */}
        <div className="mb-4">
          <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1.5 font-semibold">
            Operador em Frequência de Suporte / Recuperação:
          </label>
          <div className="flex flex-wrap gap-2">
            {eliminatedPlayers.map((p) => {
              const isSelected = p.id === currentHelper.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedPlayerId(p.id);
                    setIsAnswered(false);
                    setSelectedOption(null);
                    setIsCorrect(null);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                    isSelected
                      ? isHighContrast
                        ? 'bg-yellow-400 text-black border-yellow-300 ring-2 ring-yellow-400'
                        : 'bg-cyan-950 border-cyan-400 text-cyan-200 ring-2 ring-cyan-500/50'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    {renderCharacterSvg(p.type, 'w-full h-full')}
                  </div>
                  <span>{p.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Tabs: Recovery Challenge vs Team Support */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          <button
            onClick={() => setActiveTab('recovery')}
            className={`py-2.5 px-3 rounded-xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              activeTab === 'recovery'
                ? isHighContrast
                  ? 'bg-yellow-400 text-black border-yellow-300 shadow-md'
                  : 'bg-emerald-500 text-black border-emerald-400 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Desafio de Recuperação</span>
          </button>

          <button
            onClick={() => setActiveTab('support')}
            className={`py-2.5 px-3 rounded-xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              activeTab === 'support'
                ? isHighContrast
                  ? 'bg-yellow-400 text-black border-yellow-300 shadow-md'
                  : 'bg-cyan-500 text-black border-cyan-400 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Apoiar Colega Ativo</span>
          </button>
        </div>

        {/* TAB 1: DESAFIO DE RECUPERAÇÃO (RESPAWN GRAMATICAL) */}
        {activeTab === 'recovery' && (
          <div className="space-y-4">
            <div
              className={`p-3 rounded-xl border text-xs sm:text-sm flex items-center gap-2.5 ${
                isHighContrast
                  ? 'bg-black border-yellow-400 text-yellow-200'
                  : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Missão de Resgate: </strong> Responda à questão gramatical abaixo. Ao acertar,
                você conquista <strong>1 Vida de Retorno</strong> e reingressa imediatamente na Arena!
              </span>
            </div>

            {/* Question Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-mono text-xs border border-emerald-500/30">
                {recQuestion.ruleCategory}
              </span>

              <div className="flex items-center gap-2">
                {recQuestion.tip && (
                  <button
                    onClick={() => setShowTip(!showTip)}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs border border-slate-700"
                  >
                    <Lightbulb className="w-3 h-3 text-amber-400" />
                    <span>Dica</span>
                  </button>
                )}

                <button
                  onClick={handleSpeakRecovery}
                  aria-label="Ouvir desafio de recuperação"
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs border border-slate-700"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isSpeaking ? 'Ouvindo...' : 'Ouvir'}</span>
                </button>
              </div>
            </div>

            {/* Tip Banner */}
            {showTip && recQuestion.tip && (
              <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs">
                <strong>Dica Pedagógica: </strong> {recQuestion.tip}
              </div>
            )}

            {/* Question Text */}
            <h3 className="font-semibold text-sm sm:text-base leading-relaxed text-slate-100">
              {recQuestion.text}
            </h3>

            {/* Options Grid (A, B, C, D) */}
            <div className="grid grid-cols-1 gap-2">
              {recQuestion.options.map((opt, i) => {
                const letters = ['A', 'B', 'C', 'D'];
                const letter = letters[i] || String.fromCharCode(65 + i);
                const isSelected = selectedOption === opt;
                const isThisCorrect = opt === recQuestion.answer;

                let optStyle = 'bg-slate-950/70 border-slate-800 hover:border-emerald-500/50 text-slate-200';
                if (isAnswered) {
                  if (isThisCorrect) {
                    optStyle = 'bg-emerald-950 border-emerald-400 text-emerald-200 ring-2 ring-emerald-500/50';
                  } else if (isSelected && !isThisCorrect) {
                    optStyle = 'bg-rose-950 border-rose-500 text-rose-200';
                  } else {
                    optStyle = 'opacity-40 bg-slate-950 border-slate-800 text-slate-500';
                  }
                }

                return (
                  <button
                    key={i}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(opt)}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between text-xs sm:text-sm font-medium transition-all ${optStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-md bg-slate-900 border border-slate-700 text-slate-300 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        {letter}
                      </span>
                      <span>{opt}</span>
                    </div>

                    {isAnswered && isThisCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    {isAnswered && isSelected && !isThisCorrect && (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Feedback & Actions */}
            {isAnswered && (
              <div
                className={`p-3.5 rounded-xl border animate-fade-in ${
                  isCorrect
                    ? 'bg-emerald-950/50 border-emerald-400 text-emerald-200'
                    : 'bg-rose-950/50 border-rose-500 text-rose-200'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400 mt-0.5 shrink-0" />
                  )}
                  <div className="flex-1 text-xs sm:text-sm">
                    <strong className="block mb-1">
                      {isCorrect
                        ? '🎯 ALVO ATINGIDO — RESPAWN AUTORIZADO!'
                        : '💥 DANO SOFRIDO — Análise da Regra:'}
                    </strong>
                    <p className="leading-relaxed">{recQuestion.explanation}</p>
                  </div>
                </div>

                <div className="mt-3 flex justify-end gap-2">
                  {!isCorrect && (
                    <button
                      onClick={handleNextChallenge}
                      className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold uppercase border border-slate-700 transition-colors"
                    >
                      Tentar Outro Desafio
                    </button>
                  )}

                  {isCorrect && (
                    <button
                      onClick={handleCompleteRespawn}
                      className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg shadow-emerald-500/30 flex items-center gap-1.5 transition-transform active:scale-95"
                    >
                      <Heart className="w-4 h-4 fill-black" />
                      <span>Retornar ao Combate (+1 Vida)</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: APOIAR COLEGA ATIVO (ASSISTÊNCIA DE SUPORTE) */}
        {activeTab === 'support' && (
          <div className="space-y-4">
            <div
              className={`p-3 rounded-xl border text-xs sm:text-sm flex items-center gap-2.5 ${
                isHighContrast
                  ? 'bg-black border-yellow-400 text-yellow-200'
                  : 'bg-cyan-950/30 border-cyan-500/30 text-cyan-300'
              }`}
            >
              <Radio className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                <strong>Frequência de Apoio Tático: </strong> Como operador de suporte, você pode
                ajudar <strong>{activePlayer.name}</strong> a superar a questão da rodada e ganhar XP
                de cooperação!
              </span>
            </div>

            {/* Support Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Aid 1: 50/50 Holographic Radar */}
              <button
                onClick={() => {
                  onSupportEliminateOptions(currentHelper.name);
                  setSupportMessage(`📡 ${currentHelper.name} enviou a Mira 50/50 para ${activePlayer.name}!`);
                }}
                className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-cyan-400 hover:bg-cyan-950/20 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Radio className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs sm:text-sm text-slate-200 mb-1">
                  Mira Holográfica 50/50
                </div>
                <div className="text-[11px] text-slate-400 leading-snug">
                  Descarta 2 alternativas incorretas para facilitar a resposta do colega.
                </div>
              </button>

              {/* Aid 2: Protective Shield */}
              <button
                onClick={() => {
                  onSupportGiveShield(currentHelper.name);
                  setSupportMessage(`🛡️ ${currentHelper.name} equipou um Colete Protetor em ${activePlayer.name}!`);
                }}
                className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-cyan-400 hover:bg-cyan-950/20 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs sm:text-sm text-slate-200 mb-1">
                  Escudo Solidário
                </div>
                <div className="text-[11px] text-slate-400 leading-snug">
                  Doa 1 blindagem para absorver eventual erro gramatical do colega.
                </div>
              </button>

              {/* Aid 3: Pedagogical Hint */}
              <button
                onClick={() => {
                  onSupportGiveTip(currentHelper.name);
                  setSupportMessage(`💡 ${currentHelper.name} liberou a Dica Tática para ${activePlayer.name}!`);
                }}
                className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-cyan-400 hover:bg-cyan-950/20 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs sm:text-sm text-slate-200 mb-1">
                  Dica de Campo
                </div>
                <div className="text-[11px] text-slate-400 leading-snug">
                  Transmite a dica explicativa da questão para orientar o esquadrão.
                </div>
              </button>
            </div>

            {/* Support Feedback Message */}
            {supportMessage && (
              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-200 text-xs sm:text-sm font-semibold flex items-center justify-between animate-fade-in">
                <span>{supportMessage}</span>
                <button
                  onClick={onClose}
                  className="px-3 py-1 rounded bg-cyan-500 text-black text-xs font-bold uppercase hover:bg-cyan-400 transition-colors"
                >
                  Ver na Arena
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
