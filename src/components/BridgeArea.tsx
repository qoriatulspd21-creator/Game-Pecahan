import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlankSegment, SlotAssignment } from '../types/game';
import { sound } from '../utils/sound';
import { Sparkles, ArrowDown, RotateCcw, Lock, CheckCircle2 } from 'lucide-react';
import { MathFraction } from './MathFraction';

interface BridgeSpanProps {
  slots: SlotAssignment;
  selectedPlank: PlankSegment | null;
  onSlotClick: (index: number) => void;
  onDropOnSlot: (slotIndex: number, plankId: string) => void;
  isLockedAndProven: boolean;
  lockAnimationStep?: number; // 0 to 4 for sequential locking animation
}

export const BridgeSpan: React.FC<BridgeSpanProps> = ({
  slots,
  selectedPlank,
  onSlotClick,
  onDropOnSlot,
  isLockedAndProven,
  lockAnimationStep = 0,
}) => {
  const [hoveredSlotIndex, setHoveredSlotIndex] = useState<number | null>(null);

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setHoveredSlotIndex(index);
  };

  const handleDragLeave = () => {
    setHoveredSlotIndex(null);
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setHoveredSlotIndex(null);
    const plankId = e.dataTransfer.getData('text/plain');
    if (plankId) {
      onDropOnSlot(index, plankId);
    }
  };

  return (
    <div className="relative w-full flex items-center justify-center select-none">
      {/* Left Anchor Bracket */}
      <div className="w-2 sm:w-2.5 h-10 sm:h-12 bg-gradient-to-r from-amber-950 to-amber-800 border border-amber-600/60 rounded-l shadow shrink-0 z-20" />

      {/* CENTRAL 4-SLOT BRIDGE DECK: Continuous seamless path from Pulau A to Pulau B */}
      <div
        className={`relative flex-1 h-14 sm:h-16 rounded-md border-y-3 transition-all duration-500 flex overflow-hidden shadow-[0_10px_25px_rgba(0,0,0,0.7)] ${
          isLockedAndProven
            ? 'bg-amber-950/95 border-amber-400 ring-2 ring-amber-400/50 shadow-[0_0_30px_rgba(251,191,36,0.6)]'
            : 'bg-stone-950/90 border-amber-900/90'
        }`}
      >
        {/* CONTINUOUS TOP SAFETY ROPE: Stretches without interruption from Pulau A to Pulau B */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 border-b border-amber-950 pointer-events-none z-20 shadow-sm flex items-center justify-between px-2">
          {/* Rope knots at intervals */}
          <span className="w-2 h-2 rounded-full bg-amber-400/80 shadow" />
          <span className="w-2 h-2 rounded-full bg-amber-400/80 shadow" />
          <span className="w-2 h-2 rounded-full bg-amber-400/80 shadow" />
          <span className="w-2 h-2 rounded-full bg-amber-400/80 shadow" />
          <span className="w-2 h-2 rounded-full bg-amber-400/80 shadow" />
        </div>

        {/* CONTINUOUS BOTTOM SUPPORT CABLE: Grounding the bridge planks */}
        <div className="absolute bottom-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 border-t border-amber-950 pointer-events-none z-20 shadow-sm" />

        {/* Golden Shimmer Wave when fully locked and connected */}
        {isLockedAndProven && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }}
            className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-amber-300/40 to-transparent pointer-events-none z-30 skew-x-12"
          />
        )}

        {/* EQUAL CONTIGUOUS FRACTIONAL SLOTS (dynamically based on target fraction denominator) */}
        {slots.map((placed, slotIdx) => {
          const isHovered = hoveredSlotIndex === slotIdx;
          const canAcceptSelected = !placed && Boolean(selectedPlank);
          const isStepLocked = isLockedAndProven || lockAnimationStep > slotIdx;
          const denVal = slots.length || 4;

          return (
            <div
              key={slotIdx}
              onClick={() => onSlotClick(slotIdx)}
              onDragOver={(e) => handleDragOver(e, slotIdx)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, slotIdx)}
              className={`relative flex-1 h-full border-r last:border-r-0 border-amber-950/70 flex items-center justify-center transition-all duration-200 select-none ${
                placed
                  ? isStepLocked
                    ? 'cursor-default ring-1 ring-amber-400/80 brightness-105'
                    : 'cursor-pointer hover:brightness-110 active:scale-[0.99]'
                  : canAcceptSelected
                  ? 'cursor-pointer bg-emerald-500/30 animate-pulse border-2 border-dashed border-emerald-400'
                  : isHovered
                  ? 'bg-amber-400/40 border-2 border-amber-300'
                  : 'cursor-pointer hover:bg-white/10'
              }`}
              title={
                placed
                  ? isLockedAndProven
                    ? 'Papan terpasang kokoh & terkunci!'
                    : 'Ketuk untuk melepas papan ini'
                  : selectedPlank
                  ? 'Ketuk untuk memasang papan terpilih di sini'
                  : `Slot ${slotIdx + 1} (1/${denVal} Bagian Jembatan)`
              }
            >
              {/* Empty Blueprint Slot Guide */}
              {!placed && (
                <div className="flex flex-col items-center justify-center text-amber-200/80 pointer-events-none px-1 text-center">
                  <span className="font-heading text-[10px] sm:text-xs font-black">
                    Slot {slotIdx + 1}
                  </span>
                  <span className="text-[9px] text-amber-300/90 font-bold inline-flex items-center gap-0.5">
                    <MathFraction num={1} den={denVal} size="2xs" /> Jembatan
                  </span>
                </div>
              )}

              {/* Placed Wooden Plank Asset */}
              <AnimatePresence>
                {placed && (
                  <motion.div
                    initial={{ scale: 0.85, opacity: 0, y: -6 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.85, opacity: 0, y: -6 }}
                    className="relative w-full h-full p-0.5 flex items-center justify-center overflow-hidden"
                  >
                    {/* Authentic 3D Wooden Plank Sprite Image */}
                    <img
                      src={placed.type === 'green' ? '/assets/plank_green.png' : '/assets/plank_wood.png'}
                      alt={placed.label}
                      className="absolute inset-0 w-full h-full object-cover object-center filter drop-shadow select-none pointer-events-none"
                      referrerPolicy="no-referrer"
                    />

                    {/* Fractional Value Overlay on top of Plank (Pembilang di atas, penyebut di bawah) */}
                    <div
                      className={`relative z-10 px-2 py-0.5 rounded-lg border shadow-md flex items-center gap-1 transition-all ${
                        isStepLocked
                          ? 'bg-amber-950/90 border-amber-400 text-amber-200'
                          : 'bg-stone-950/85 border-white/20 text-white'
                      }`}
                    >
                      <MathFraction num={1} den={denVal} size="xs" className="drop-shadow filter" />
                      {placed.type === 'green' && (
                        <span className="text-[9px] text-emerald-300 font-extrabold hidden sm:inline">
                          (Hijau)
                        </span>
                      )}
                    </div>

                    {/* Locked Rivet Indicator when sequentially locked */}
                    {isStepLocked && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-1 left-1 z-20 bg-amber-400 text-amber-950 rounded-full p-0.5 shadow-md"
                        title="Terkunci Kokoh"
                      >
                        <Lock className="w-2.5 h-2.5" />
                      </motion.div>
                    )}

                    {/* Detach indicator if not finalized */}
                    {!isLockedAndProven && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-red-600/90 text-white rounded-full text-[9px] font-bold flex items-center justify-center shadow opacity-0 hover:opacity-100 transition-opacity z-20">
                        ✕
                      </span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Right Anchor Bracket */}
      <div className="w-2 sm:w-2.5 h-10 sm:h-12 bg-gradient-to-r from-amber-800 to-amber-950 border border-amber-600/60 rounded-r shadow shrink-0 z-20" />
    </div>
  );
};

interface PlankTrayProps {
  availablePlanks: PlankSegment[];
  selectedPlankId: string | null;
  onSelectPlank: (plank: PlankSegment) => void;
  onResetPlanks: () => void;
  placedCount: number;
  isLockedAndProven: boolean;
}

export const PlankTray: React.FC<PlankTrayProps> = ({
  availablePlanks,
  selectedPlankId,
  onSelectPlank,
  onResetPlanks,
  placedCount,
  isLockedAndProven,
}) => {
  const handleDragStart = (e: React.DragEvent, plank: PlankSegment) => {
    e.dataTransfer.setData('text/plain', plank.id);
    e.dataTransfer.effectAllowed = 'move';
    onSelectPlank(plank);
  };

  const handlePlankClick = (plank: PlankSegment) => {
    sound.playClick();
    onSelectPlank(plank);
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Tray Status Header */}
      <div className="flex items-center justify-between text-xs px-1">
        <div className="flex items-center gap-1.5 font-bold text-slate-200">
          <span className="text-amber-400 font-heading inline-flex items-center gap-1">
            Material Papan Jembatan (<MathFraction num={1} den={4} size="xs" />):
          </span>
          <span className="text-emerald-300 inline-flex items-center gap-1">
            <MathFraction num={placedCount} den={4} size="xs" /> Terpasang di Jembatan
          </span>
        </div>
        {placedCount > 0 && !isLockedAndProven && (
          <button
            onClick={onResetPlanks}
            className="text-amber-300 hover:text-amber-200 flex items-center gap-1 font-semibold text-[11px] bg-stone-800/90 px-2.5 py-1 rounded-lg border border-amber-400/40 shadow active:scale-95 touch-manipulation cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" /> Lepas Semua
          </button>
        )}
      </div>

      {/* 4 Planks Rack using Authentic Wooden Plank Asset Images */}
      {availablePlanks.length > 0 ? (
        <div className="w-full grid grid-cols-4 gap-2">
          {availablePlanks.map((plank) => {
            const isSelected = selectedPlankId === plank.id;
            return (
              <div
                key={plank.id}
                draggable
                onDragStart={(e) => handleDragStart(e, plank)}
                onClick={() => handlePlankClick(plank)}
                className={`relative h-14 sm:h-16 rounded-xl p-1 flex items-center justify-center cursor-pointer transition-all duration-200 shadow-xl overflow-hidden select-none active:scale-95 touch-manipulation ${
                  isSelected
                    ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-stone-950 scale-105 shadow-[0_0_20px_rgba(251,191,36,0.7)]'
                    : 'hover:scale-[1.02] border-2 border-amber-900/80'
                }`}
                style={{ minHeight: '56px' }}
              >
                {/* Plank Sprite Texture */}
                <img
                  src={plank.type === 'green' ? '/assets/plank_green.png' : '/assets/plank_wood.png'}
                  alt={plank.label}
                  className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none"
                  referrerPolicy="no-referrer"
                />

                {/* Fractional Label Badge (Pembilang di atas, penyebut di bawah) */}
                <div className="relative z-10 bg-stone-950/85 px-2.5 py-1 rounded-lg border border-white/20 shadow flex items-center gap-1.5">
                  <MathFraction num={1} den={4} size="base" className="text-white drop-shadow" />
                  <span className="text-[10px] text-amber-200 font-bold">
                    {plank.type === 'green' ? 'Hijau' : 'Kayu'}
                  </span>
                </div>

                {/* Touch / Drag hint */}
                <span className="absolute bottom-1 right-1 text-[8px] bg-black/60 text-stone-300 px-1 rounded pointer-events-none">
                  Ketuk / Tarik
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="w-full py-3 px-4 bg-emerald-950/60 rounded-xl border border-emerald-500/40 text-emerald-200 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-inner">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Semua 4 papan jembatan (4/4) telah dipasang di bentang jembatan!</span>
          </span>
          {!isLockedAndProven && (
            <span className="text-amber-300 text-xs font-bold animate-pulse">
              Buka Tab "3. Tombol Pembuktian" di atas!
            </span>
          )}
        </div>
      )}
    </div>
  );
};
