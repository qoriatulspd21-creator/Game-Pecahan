import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Scissors, CheckCircle } from 'lucide-react';
import { MathFraction } from './MathFraction';

interface FractionBarProps {
  island: 'A' | 'B';
  title: string;
  num: number;
  den: number;
  isTransformed?: boolean;
  transformedNum?: number;
  transformedDen?: number;
  isSelected?: boolean;
  onSelect?: () => void;
  isSlicing?: boolean;
  multiplier?: number;
}

export const FractionBar: React.FC<FractionBarProps> = ({
  island,
  title,
  num,
  den,
  isTransformed = false,
  transformedNum,
  transformedDen,
  isSelected = false,
  onSelect,
  isSlicing = false,
  multiplier = 2,
}) => {
  const isIslandA = island === 'A';
  
  // Current active fraction to display
  const activeNum = isIslandA && isTransformed && transformedNum ? transformedNum : num;
  const activeDen = isIslandA && isTransformed && transformedDen ? transformedDen : den;

  // Generate parts array for rendering
  const parts = Array.from({ length: activeDen }, (_, i) => ({
    index: i,
    isGreen: i < activeNum,
  }));

  return (
    <div
      onClick={onSelect}
      className={`relative w-full rounded-2xl transition-all duration-300 p-2 sm:p-2.5 shadow-2xl select-none bg-stone-900/95 border-2 sm:border-3 ${
        isIslandA && !isTransformed
          ? 'cursor-pointer hover:border-amber-400 active:scale-[0.99]'
          : 'cursor-default'
      } ${
        isSelected
          ? 'border-amber-400 ring-4 ring-amber-400/40 shadow-[0_0_25px_rgba(251,191,36,0.5)]'
          : 'border-amber-900/90 shadow-stone-950/80'
      }`}
    >
      {/* Wood signboard outer frame texture */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-amber-900/40 via-transparent to-amber-950/60 pointer-events-none" />

      {/* Header of the fraction model */}
      <div className="flex items-center justify-between mb-1.5 px-0.5 relative z-10 gap-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg flex items-center justify-center font-black text-[10px] sm:text-xs shadow-md shrink-0 ${
              isIslandA ? 'bg-emerald-600 text-white' : 'bg-cyan-600 text-white'
            }`}
          >
            {island}
          </span>
          <div className="font-heading font-bold text-amber-100 text-xs sm:text-sm drop-shadow-sm truncate">
            {title}
          </div>
        </div>

        {/* Fraction Badge with Vertical Fraction Layout */}
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-stone-950/90 border border-amber-600/40 text-white font-heading font-black shadow-inner shrink-0">
          <span className="text-emerald-400 flex items-center">
            <MathFraction num={activeNum} den={activeDen} size="xs" />
          </span>
          {isIslandA && isTransformed && (
            <span className="text-[9px] text-amber-300 font-normal">
              (Bagi {multiplier})
            </span>
          )}
        </div>
      </div>

      {/* The Fraction Bar Container (Standardized Whole Reference = 100%) */}
      <div className="relative w-full h-11 sm:h-12 bg-amber-950/90 rounded-xl p-1 border-2 border-amber-800 shadow-inner overflow-hidden z-10 flex items-center">
        {/* Dynamic Equal Parts */}
        <div className="w-full h-full flex rounded-lg overflow-hidden relative">
          {parts.map((p) => {
            const partWidthPct = 100 / activeDen;
            return (
              <div
                key={p.index}
                style={{ width: `${partWidthPct}%` }}
                className={`h-full border-r last:border-r-0 flex items-center justify-center transition-all ${
                  p.isGreen
                    ? 'bg-gradient-to-b from-emerald-500 to-emerald-600 border-emerald-900/60 text-white shadow-inner'
                    : 'bg-gradient-to-b from-amber-100 to-amber-200/95 border-amber-300/80 text-amber-950 shadow-inner'
                }`}
              >
                <MathFraction
                  num={1}
                  den={activeDen}
                  size={activeDen > 6 ? '2xs' : 'xs'}
                  className={p.isGreen ? 'drop-shadow text-white' : 'text-amber-950'}
                />
              </div>
            );
          })}

          {/* Slicing Animation Effect */}
          {isSlicing && (
            <motion.div
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: [0, 1.2, 1], opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-amber-200/30 flex items-center justify-around pointer-events-none z-30"
            >
              {Array.from({ length: den }).map((_, i) => (
                <div key={i} className="w-1 h-full bg-amber-300 shadow-[0_0_12px_#fbbf24]" />
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Subtext info */}
      <div className="flex items-center justify-between text-[10px] text-amber-300/90 px-1 mt-1 font-heading">
        <span>{activeNum} Bagian Hijau</span>
        <span>Total {activeDen} Bagian</span>
      </div>
    </div>
  );
};
