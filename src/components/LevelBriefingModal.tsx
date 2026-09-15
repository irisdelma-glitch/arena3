import React, { useEffect } from 'react';
import { Shield, ArrowRight, ArrowLeft, Radio, Volume2 } from 'lucide-react';
import { LevelData, AccessibilitySettings } from '../types';

interface LevelBriefingModalProps {
  level: LevelData;
  isOpen: boolean;
  settings: AccessibilitySettings;
  onStartLevel: () => void;
  onSpeakBriefing: () => void;
  isSpeaking: boolean;
  onBackToLobby?: () => void;
}

export const LevelBriefingModal: React.FC<LevelBriefingModalProps> = ({
  level,
  isOpen,
  settings,
  onStartLevel,
  onSpeakBriefing,
  isSpeaking,
  onBackToLobby,
}) => {
  useEffect(() => {
    if (isOpen && settings.autoSpeakQuestions) {
      onSpeakBriefing();
    }
  }, [isOpen, settings.autoSpeakQuestions, onSpeakBriefing]);

  if (!isOpen) return null;

  const isHighContrast = settings.highContrast;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="briefing-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
    >
      <div
        className={`w-full max-w-xl rounded-2xl border p-6 sm:p-8 text-center transition-all ${
          isHighContrast
            ? 'bg-black border-yellow-400 text-yellow-100 shadow-[0_0_40px_#facc15]'
            : 'bg-slate-900 border-emerald-500/50 text-slate-100 shadow-[0_0_50px_rgba(16,185,129,0.25)]'
        }`}
      >
        {/* Status Chip */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold uppercase tracking-wider mb-4">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>Briefing da Operação</span>
        </div>

        {/* Level Title */}
        <h2
          id="briefing-title"
          className="text-xl sm:text-2xl font-black font-['Chakra_Petch'] tracking-wide uppercase mb-1"
        >
          {level.title}
        </h2>
        <p className="text-xs sm:text-sm text-amber-400 font-semibold mb-4">
          {level.congrats}
        </p>

        {/* Narrative Box */}
        <div
          className={`p-4 rounded-xl border text-left my-5 leading-relaxed text-xs sm:text-sm ${
            isHighContrast
              ? 'bg-black border-slate-700 text-yellow-200'
              : 'bg-slate-950/80 border-slate-800 text-slate-300'
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-emerald-400 uppercase text-xs tracking-wider mb-2">
            <Shield className="w-4 h-4" />
            <span>Instrução Tática do Comando Geral</span>
          </div>
          <p>{level.description}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {onBackToLobby && (
            <button
              onClick={onBackToLobby}
              aria-label="Voltar para a tela de Lobby e configurações"
              className={`w-full sm:w-auto px-4 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                isHighContrast
                  ? 'bg-black text-yellow-300 border-yellow-400 hover:bg-yellow-950/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              <ArrowLeft className="w-4 h-4 text-emerald-400" />
              <span>Voltar ao Lobby</span>
            </button>
          )}

          <button
            onClick={onSpeakBriefing}
            aria-label="Ouvir instrução de voz do briefing"
            className={`w-full sm:w-auto px-4 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              isSpeaking
                ? 'bg-emerald-500 text-black border-emerald-400 font-extrabold animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border-slate-700'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{isSpeaking ? 'Narrando Briefing...' : 'Ouvir Instrução (L)'}</span>
          </button>

          <button
            onClick={onStartLevel}
            autoFocus
            className={`w-full sm:w-auto px-8 py-3 rounded-xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg ${
              isHighContrast
                ? 'bg-yellow-400 text-black border-2 border-yellow-300 font-extrabold'
                : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/30'
            }`}
          >
            <span>Dropar na Arena</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
