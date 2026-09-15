import React, { useState } from 'react';
import {
  Volume2,
  Lightbulb,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Question, AccessibilitySettings } from '../types';

interface QuestionCardProps {
  question: Question;
  eliminatedOptions: string[];
  selectedOption: string | null;
  isAnswered: boolean;
  isCorrect: boolean | null;
  settings: AccessibilitySettings;
  onSelectOption: (option: string) => void;
  onNextTurn: () => void;
  onSpeakQuestion: () => void;
  isSpeaking: boolean;
  activePlayerName: string;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  eliminatedOptions,
  selectedOption,
  isAnswered,
  isCorrect,
  settings,
  onSelectOption,
  onNextTurn,
  onSpeakQuestion,
  isSpeaking,
  activePlayerName,
}) => {
  const [showTip, setShowTip] = useState(false);
  const isHighContrast = settings.highContrast;

  // Font scale calculation
  const getFontSizeClass = () => {
    switch (settings.fontSize) {
      case 'large':
        return {
          question: 'text-lg sm:text-xl',
          options: 'text-base sm:text-lg py-4',
          meta: 'text-xs',
        };
      case 'extralarge':
        return {
          question: 'text-xl sm:text-2xl',
          options: 'text-lg sm:text-xl py-5',
          meta: 'text-sm',
        };
      default:
        return {
          question: 'text-base sm:text-lg',
          options: 'text-sm sm:text-base py-3.5',
          meta: 'text-[11px]',
        };
    }
  };

  const fontClasses = getFontSizeClass();

  return (
    <div
      role="region"
      aria-label="Zona de Desafio Gramatical"
      className={`w-full rounded-2xl border p-4 sm:p-6 transition-all ${
        isHighContrast
          ? 'bg-black border-yellow-400 text-yellow-100 shadow-[0_0_25px_#facc15]'
          : 'bg-slate-900/90 border-slate-800 text-slate-100 shadow-xl shadow-black/50 backdrop-blur-sm'
      }`}
    >
      {/* Question Header & Category */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-1 rounded-md font-mono uppercase tracking-wider font-bold ${
              isHighContrast
                ? 'bg-yellow-400 text-black'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            } ${fontClasses.meta}`}
          >
            {question.ruleCategory}
          </span>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-mono capitalize border ${
              question.difficulty === 'fácil'
                ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
                : question.difficulty === 'médio'
                ? 'border-amber-500/40 text-amber-400 bg-amber-500/10'
                : 'border-rose-500/40 text-rose-400 bg-rose-500/10'
            }`}
          >
            {question.difficulty}
          </span>
        </div>

        {/* Read Aloud & Tactical Hint controls */}
        <div className="flex items-center gap-2">
          {question.tip && (
            <button
              onClick={() => setShowTip(!showTip)}
              aria-label={showTip ? 'Ocultar dica tática' : 'Exibir dica tática'}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-colors ${
                showTip
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>Dica</span>
            </button>
          )}

          <button
            onClick={onSpeakQuestion}
            aria-label="Ouvir enunciado da questão (Atalho: Tecla L)"
            title="Ouvir enunciado (Tecla L)"
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-semibold transition-all ${
              isSpeaking
                ? 'bg-emerald-500 text-black font-bold animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border-slate-700'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ouvir (L)</span>
          </button>
        </div>
      </div>

      {/* Tip Banner if toggled */}
      {showTip && question.tip && (
        <div
          role="note"
          aria-label="Dica pedagógica"
          className="mb-4 p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs sm:text-sm flex items-start gap-2.5 animate-fade-in"
        >
          <Sparkles className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
          <div>
            <strong className="text-amber-400 block mb-0.5">Dica de Campo:</strong>
            {question.tip}
          </div>
        </div>
      )}

      {/* Question Text */}
      <div className="mb-6">
        <h2
          id="active-question-text"
          className={`font-semibold leading-relaxed ${fontClasses.question} ${
            isHighContrast ? 'text-yellow-100' : 'text-slate-100'
          }`}
        >
          {question.text}
        </h2>
      </div>

      {/* Options Grid */}
      <div
        role="radiogroup"
        aria-labelledby="active-question-text"
        className="grid grid-cols-1 gap-2.5 sm:gap-3"
      >
        {question.options.map((option, index) => {
          const isEliminatedBy5050 = eliminatedOptions.includes(option);
          const isSelected = selectedOption === option;
          const isThisCorrect = option === question.answer;
          const letter = ['A', 'B', 'C', 'D', 'E'][index] || String.fromCharCode(65 + index);

          // Compute button colors based on answered status and accessibility
          let btnStyle = '';
          if (isAnswered) {
            if (isThisCorrect) {
              btnStyle = isHighContrast
                ? 'bg-yellow-400 text-black border-yellow-300 font-extrabold ring-2 ring-yellow-400'
                : 'bg-emerald-950/80 border-emerald-400 text-emerald-200 ring-2 ring-emerald-500/50';
            } else if (isSelected && !isThisCorrect) {
              btnStyle = isHighContrast
                ? 'bg-black text-rose-300 border-rose-500 line-through'
                : 'bg-rose-950/70 border-rose-500 text-rose-200';
            } else {
              btnStyle = 'opacity-35 bg-slate-950 border-slate-800 text-slate-500';
            }
          } else {
            btnStyle = isHighContrast
              ? 'bg-black border-slate-600 text-yellow-100 hover:border-yellow-400 hover:bg-yellow-950/30'
              : 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-emerald-500/60 hover:bg-slate-800/80';
          }

          if (isEliminatedBy5050) {
            btnStyle = 'opacity-20 bg-slate-950 border-dashed border-slate-800 text-slate-600 cursor-not-allowed';
          }

          return (
            <button
              key={index}
              disabled={isAnswered || isEliminatedBy5050}
              onClick={() => onSelectOption(option)}
              role="radio"
              aria-checked={isSelected}
              aria-label={`Alternativa ${letter}: ${option}`}
              className={`w-full px-4 rounded-xl border text-left flex items-center justify-between transition-all group focus-visible:ring-4 focus-visible:ring-emerald-400 ${
                fontClasses.options
              } ${btnStyle}`}
            >
              <div className="flex items-center gap-3">
                {/* Letter Badge (A, B, C, D) for clear option identification */}
                <span
                  className={`w-7 h-7 rounded-lg font-mono font-bold text-xs flex items-center justify-center shrink-0 border ${
                    isAnswered && isThisCorrect
                      ? 'bg-emerald-500 text-black border-emerald-400 font-black'
                      : isHighContrast
                      ? 'bg-slate-900 text-yellow-300 border-yellow-400/40'
                      : 'bg-slate-900 text-slate-300 border-slate-700 group-hover:border-emerald-400 group-hover:text-emerald-300'
                  }`}
                >
                  {letter}
                </span>
                <span className="font-medium leading-snug">{option}</span>
              </div>

              {/* Status Icons */}
              {isAnswered && isThisCorrect && (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />
              )}
              {isAnswered && isSelected && !isThisCorrect && (
                <XCircle className="w-5 h-5 text-rose-400 shrink-0 ml-2" />
              )}
            </button>
          );
        })}
      </div>

      {/* Immediate Feedback Box with grammar explanation */}
      {isAnswered && (
        <div
          role="alert"
          aria-live="assertive"
          className={`mt-5 p-4 rounded-xl border transition-all animate-fade-in ${
            isCorrect
              ? isHighContrast
                ? 'bg-black border-yellow-400 text-yellow-100'
                : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              : isHighContrast
              ? 'bg-black border-rose-400 text-rose-200'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
          }`}
        >
          <div className="flex items-start gap-3">
            {isCorrect ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="font-bold uppercase tracking-wider text-sm mb-1">
                {isCorrect
                  ? `🎯 Alvo atingido! (${activePlayerName})`
                  : `💥 Dano sofrido! (${activePlayerName})`}
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
                <strong className="text-slate-100">Explicação: </strong>
                {question.explanation}
              </p>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={onNextTurn}
              autoFocus
              className={`px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-xs sm:text-sm flex items-center gap-2 transition-transform active:scale-95 shadow-lg ${
                isHighContrast
                  ? 'bg-yellow-400 text-black border-2 border-yellow-300 font-extrabold'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20'
              }`}
            >
              <span>Próxima Rodada (Espaço)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
