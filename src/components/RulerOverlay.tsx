import React from 'react';
import { Ruler } from 'lucide-react';
import { MathFraction } from './MathFraction';

interface RulerOverlayProps {
  isVisible: boolean;
  onToggle: () => void;
}

export const RulerOverlay: React.FC<RulerOverlayProps> = ({ isVisible, onToggle }) => {
  return (
    <>
      {/* Toggle button */}
      <button
        onClick={onToggle}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-heading font-bold shadow-md transition-all duration-200 active:scale-95 touch-manipulation ${
          isVisible
            ? 'bg-amber-400 text-amber-950 border-2 border-amber-300 ring-2 ring-amber-400/50'
            : 'bg-slate-800/90 text-slate-200 hover:bg-slate-700 border border-white/20'
        }`}
        title="Garis Mistar Transparan untuk membandingkan panjang pecahan"
      >
        <Ruler className="w-4 h-4" />
        <span>Mistar Bukti {isVisible ? 'Aktif' : ''}</span>
      </button>

      {/* When active, show guideline labels */}
      {isVisible && (
        <div className="pointer-events-none fixed inset-x-0 top-24 bottom-28 z-40 flex flex-col justify-between max-w-4xl mx-auto px-4">
          <div className="w-full flex items-center justify-between text-[11px] font-bold text-amber-300 bg-slate-900/90 px-4 py-1.5 rounded-full border border-amber-400/50 backdrop-blur-sm self-center shadow-2xl">
            <span className="text-emerald-400">0 (Awal)</span>
            <span className="inline-flex items-center gap-1">
              <MathFraction num={1} den={4} size="2xs" />
              <span>(25%)</span>
            </span>
            <span className="text-amber-400 font-black inline-flex items-center gap-1 bg-amber-950/80 px-2.5 py-0.5 rounded-lg border border-amber-500/50">
              <MathFraction num={1} den={2} size="xs" />
              <span>=</span>
              <MathFraction num={2} den={4} size="xs" />
              <span>(50% - Tepat Sama Luas!)</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <MathFraction num={3} den={4} size="2xs" />
              <span>(75%)</span>
            </span>
            <span className="text-sky-300">1 (Utuh)</span>
          </div>
        </div>
      )}
    </>
  );
};
