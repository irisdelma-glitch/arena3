import React from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Type,
  Eye,
  Zap,
  Keyboard,
  Mic,
  Sliders,
  Check,
} from 'lucide-react';
import { AccessibilitySettings, ColorblindMode, FontSizeScale } from '../types';

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AccessibilitySettings;
  onUpdateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
}

export const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="acc-panel-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
    >
      <div
        id="accessibility-modal-card"
        className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border ${
          settings.highContrast
            ? 'bg-black border-yellow-400 text-yellow-100 shadow-[0_0_30px_#facc15]'
            : 'bg-slate-900 border-emerald-500/40 text-slate-100 shadow-[0_0_30px_rgba(16,185,129,0.2)]'
        } p-6`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 mb-6 border-slate-700/60">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                settings.highContrast
                  ? 'bg-yellow-400 text-black'
                  : 'bg-emerald-500/20 text-emerald-400'
              }`}
            >
              <Sliders className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <h2
                id="acc-panel-title"
                className="text-xl font-bold tracking-wider uppercase font-['Chakra_Petch']"
              >
                Central de Acessibilidade Tática
              </h2>
              <p className="text-xs text-slate-400">
                Ajuste contraste, tamanho de texto, leitor de voz e controles
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar painel de acessibilidade"
            className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Alto Contraste */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-amber-400" aria-hidden="true" />
              <div>
                <span className="font-semibold block text-sm">Modo de Alto Contraste</span>
                <span className="text-xs text-slate-400">
                  Fundo preto absoluto, bordas nítidas e textos em amarelo/branco (21:1)
                </span>
              </div>
            </div>
            <button
              onClick={() => onUpdateSettings({ highContrast: !settings.highContrast })}
              role="switch"
              aria-checked={settings.highContrast}
              aria-label="Alternar modo de alto contraste"
              className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${
                settings.highContrast
                  ? 'bg-yellow-400 text-black font-extrabold shadow-[0_0_10px_#facc15]'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {settings.highContrast ? 'ATIVADO' : 'DESATIVADO'}
            </button>
          </div>

          {/* Tamanho da Fonte */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-3 mb-3">
              <Type className="w-5 h-5 text-blue-400" aria-hidden="true" />
              <div>
                <span className="font-semibold block text-sm">Escala de Fonte e Legibilidade</span>
                <span className="text-xs text-slate-400">
                  Aumenta títulos, enunciados e opções de resposta
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'normal', label: 'Padrão (100%)', example: 'A' },
                  { id: 'large', label: 'Grande (115%)', example: 'A+' },
                  { id: 'extralarge', label: 'Extra (130%)', example: 'A++' },
                ] as { id: FontSizeScale; label: string; example: string }[]
              ).map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onUpdateSettings({ fontSize: opt.id })}
                  aria-pressed={settings.fontSize === opt.id}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    settings.fontSize === opt.id
                      ? settings.highContrast
                        ? 'bg-yellow-400 text-black border-yellow-400 font-bold'
                        : 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-lg font-bold block">{opt.example}</span>
                  <span className="text-xs">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Modo Daltônico */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-3 mb-3">
              <Eye className="w-5 h-5 text-purple-400" aria-hidden="true" />
              <div>
                <span className="font-semibold block text-sm">Paleta para Daltonismo</span>
                <span className="text-xs text-slate-400">
                  Substitui tons conflitantes por contrastes com símbolos universais
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(
                [
                  { id: 'none', label: 'Padrão', desc: 'Verde/Vermelho' },
                  { id: 'protanopia', label: 'Protanopia', desc: 'Azul / Laranja' },
                  { id: 'deuteranopia', label: 'Deuteranopia', desc: 'Azul / Amarelo' },
                  { id: 'tritanopia', label: 'Tritanopia', desc: 'Ciano / Magenta' },
                ] as { id: ColorblindMode; label: string; desc: string }[]
              ).map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => onUpdateSettings({ colorblindMode: mode.id })}
                  aria-pressed={settings.colorblindMode === mode.id}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    settings.colorblindMode === mode.id
                      ? settings.highContrast
                        ? 'bg-yellow-400 text-black border-yellow-400 font-bold'
                        : 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-white">{mode.label}</span>
                    {settings.colorblindMode === mode.id && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">{mode.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Leitor de Voz e Narração */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mic className="w-5 h-5 text-emerald-400" aria-hidden="true" />
                <div>
                  <span className="font-semibold block text-sm">Leitura por Voz Automática</span>
                  <span className="text-xs text-slate-400">
                    Narra as perguntas e avisos de combate automaticamente
                  </span>
                </div>
              </div>
              <button
                onClick={() =>
                  onUpdateSettings({ autoSpeakQuestions: !settings.autoSpeakQuestions })
                }
                role="switch"
                aria-checked={settings.autoSpeakQuestions}
                aria-label="Alternar leitura automática por voz"
                className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${
                  settings.autoSpeakQuestions
                    ? 'bg-emerald-500 text-black shadow-[0_0_10px_#10b981]'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {settings.autoSpeakQuestions ? 'LIGADA' : 'DESLIGADA'}
              </button>
            </div>

            {/* Velocidade da fala */}
            <div>
              <label htmlFor="voice-rate-slider" className="text-xs font-semibold text-slate-300 block mb-1">
                Velocidade da Voz: {settings.voiceRate.toFixed(1)}x
              </label>
              <input
                id="voice-rate-slider"
                type="range"
                min="0.7"
                max="1.3"
                step="0.1"
                value={settings.voiceRate}
                onChange={(e) => onUpdateSettings({ voiceRate: parseFloat(e.target.value) })}
                className="w-full accent-emerald-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Calmo (0.7x)</span>
                <span>Normal (1.0x)</span>
                <span>Rápido (1.3x)</span>
              </div>
            </div>
          </div>

          {/* Efeitos Sonoros e Áudio */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settings.soundEnabled ? (
                <Volume2 className="w-5 h-5 text-emerald-400" aria-hidden="true" />
              ) : (
                <VolumeX className="w-5 h-5 text-rose-400" aria-hidden="true" />
              )}
              <div>
                <span className="font-semibold block text-sm">Sintetizador Sonoro Tático</span>
                <span className="text-xs text-slate-400">
                  Tiros, impactos, quebra de escudo e fanfarras sintetizadas
                </span>
              </div>
            </div>
            <button
              onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
              role="switch"
              aria-checked={settings.soundEnabled}
              aria-label="Alternar efeitos sonoros"
              className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${
                settings.soundEnabled
                  ? 'bg-emerald-500 text-black'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {settings.soundEnabled ? 'ATIVO' : 'MUTADO'}
            </button>
          </div>

          {/* Redução de Movimento */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-sky-400" aria-hidden="true" />
              <div>
                <span className="font-semibold block text-sm">Redução de Movimento</span>
                <span className="text-xs text-slate-400">
                  Elimina tremores de dano, transições dinâmicas e partículas
                </span>
              </div>
            </div>
            <button
              onClick={() => onUpdateSettings({ reducedMotion: !settings.reducedMotion })}
              role="switch"
              aria-checked={settings.reducedMotion}
              aria-label="Alternar redução de movimento"
              className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${
                settings.reducedMotion
                  ? 'bg-sky-400 text-black'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {settings.reducedMotion ? 'ATIVADA' : 'DESATIVADA'}
            </button>
          </div>

          {/* Guia de Teclado Rápido */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2 mb-3 text-slate-300">
              <Keyboard className="w-5 h-5 text-emerald-400" aria-hidden="true" />
              <span className="font-semibold text-sm">Atalhos de Teclado Operacionais</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <kbd className="px-1.5 py-0.5 bg-slate-800 text-emerald-400 font-mono rounded font-bold mr-1">
                  1 2 3 4
                </kbd>
                <span className="text-slate-300">Escolher opção</span>
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <kbd className="px-1.5 py-0.5 bg-slate-800 text-emerald-400 font-mono rounded font-bold mr-1">
                  Espaço
                </kbd>
                <span className="text-slate-300">Próxima rodada</span>
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <kbd className="px-1.5 py-0.5 bg-slate-800 text-emerald-400 font-mono rounded font-bold mr-1">
                  L
                </kbd>
                <span className="text-slate-300">Ouvir questão</span>
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <kbd className="px-1.5 py-0.5 bg-slate-800 text-emerald-400 font-mono rounded font-bold mr-1">
                  U
                </kbd>
                <span className="text-slate-300">Abrir Loot</span>
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <kbd className="px-1.5 py-0.5 bg-slate-800 text-emerald-400 font-mono rounded font-bold mr-1">
                  Alt+A
                </kbd>
                <span className="text-slate-300">Acessibilidade</span>
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <kbd className="px-1.5 py-0.5 bg-slate-800 text-emerald-400 font-mono rounded font-bold mr-1">
                  ESC
                </kbd>
                <span className="text-slate-300">Fechar janela</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase tracking-wider text-sm transition-colors"
          >
            Confirmar e Retornar ao Jogo
          </button>
        </div>
      </div>
    </div>
  );
};
