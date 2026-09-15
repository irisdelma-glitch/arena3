import React from 'react';
import { Shield, Crosshair, PlusCircle, Zap, Package } from 'lucide-react';
import { Player, AccessibilitySettings } from '../types';

interface TacticalLootDrawerProps {
  player: Player;
  isAnswered: boolean;
  onUseShield: () => void;
  onUseRadar: () => void;
  onUseMedkit: () => void;
  onUseDoubleXp: () => void;
  settings: AccessibilitySettings;
}

export const TacticalLootDrawer: React.FC<TacticalLootDrawerProps> = ({
  player,
  isAnswered,
  onUseShield,
  onUseRadar,
  onUseMedkit,
  onUseDoubleXp,
  settings,
}) => {
  const isHighContrast = settings.highContrast;
  const inv = player.inventory;

  return (
    <div
      role="region"
      aria-label="Mochila de Equipamentos Táticos"
      className={`w-full rounded-2xl border p-3 sm:p-4 transition-all ${
        isHighContrast
          ? 'bg-black border-yellow-400 text-yellow-100'
          : 'bg-slate-900/80 border-slate-800 text-slate-200'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-emerald-400" aria-hidden="true" />
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider font-['Chakra_Petch']">
            Arsenal Tático de Campo
          </h3>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">
          Itens de {player.name}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {/* Shield Power-up */}
        <button
          onClick={onUseShield}
          disabled={isAnswered || inv.shield <= 0 || player.shields > 0}
          aria-label={`Usar Colete Kevlar. Disponível: ${inv.shield}`}
          className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
            inv.shield > 0 && player.shields === 0 && !isAnswered
              ? isHighContrast
                ? 'bg-black border-yellow-400 hover:bg-yellow-950/40 text-yellow-200'
                : 'bg-slate-950 border-cyan-500/40 hover:border-cyan-400 text-slate-100'
              : 'opacity-40 bg-slate-950 border-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <span className="text-xs font-bold block">Colete Kevlar</span>
              <span className="text-[10px] text-slate-400">Absorve 1 erro</span>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
            {inv.shield}
          </span>
        </button>

        {/* 50/50 Radar Laser */}
        <button
          onClick={onUseRadar}
          disabled={isAnswered || inv.radar5050 <= 0}
          aria-label={`Usar Mira Laser 50/50. Disponível: ${inv.radar5050}`}
          className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
            inv.radar5050 > 0 && !isAnswered
              ? isHighContrast
                ? 'bg-black border-yellow-400 hover:bg-yellow-950/40 text-yellow-200'
                : 'bg-slate-950 border-purple-500/40 hover:border-purple-400 text-slate-100'
              : 'opacity-40 bg-slate-950 border-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <div className="flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-purple-400 shrink-0" />
            <div>
              <span className="text-xs font-bold block">Mira 50/50</span>
              <span className="text-[10px] text-slate-400">Elimina 2 erradas</span>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
            {inv.radar5050}
          </span>
        </button>

        {/* Medkit */}
        <button
          onClick={onUseMedkit}
          disabled={isAnswered || inv.medkit <= 0 || player.lives >= player.maxLives}
          aria-label={`Usar Kit Médico. Disponível: ${inv.medkit}`}
          className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
            inv.medkit > 0 && player.lives < player.maxLives && !isAnswered
              ? isHighContrast
                ? 'bg-black border-yellow-400 hover:bg-yellow-950/40 text-yellow-200'
                : 'bg-slate-950 border-emerald-500/40 hover:border-emerald-400 text-slate-100'
              : 'opacity-40 bg-slate-950 border-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <div className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-xs font-bold block">Kit Médico</span>
              <span className="text-[10px] text-slate-400">+1 Coração</span>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
            {inv.medkit}
          </span>
        </button>

        {/* 2x XP Boost */}
        <button
          onClick={onUseDoubleXp}
          disabled={isAnswered || inv.doubleXp <= 0}
          aria-label={`Usar Dobro de XP. Disponível: ${inv.doubleXp}`}
          className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
            inv.doubleXp > 0 && !isAnswered
              ? isHighContrast
                ? 'bg-black border-yellow-400 hover:bg-yellow-950/40 text-yellow-200'
                : 'bg-slate-950 border-amber-500/40 hover:border-amber-400 text-slate-100'
              : 'opacity-40 bg-slate-950 border-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-xs font-bold block">Foco Duplo</span>
              <span className="text-[10px] text-slate-400">2x XP no acerto</span>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
            {inv.doubleXp}
          </span>
        </button>
      </div>
    </div>
  );
};
