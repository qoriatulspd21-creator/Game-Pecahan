import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Layers, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { MathFraction } from './MathFraction';
import { sound } from '../utils/sound';

interface FractionOverlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  fractionA: { num: number; den: number };
  fractionB: { num: number; den: number };
  titleA?: string;
  titleB?: string;
}

export const FractionOverlayModal: React.FC<FractionOverlayModalProps> = ({
  isOpen,
  onClose,
  fractionA,
  fractionB,
  titleA = 'Pulau A',
  titleB = 'Pulau B',
}) => {
  const [isOverlaid, setIsOverlaid] = useState<boolean>(true);

  if (!isOpen) return null;

  const valA = fractionA.num / fractionA.den;
  const valB = fractionB.num / fractionB.den;
  const isEquivalent = Math.abs(valA - valB) < 0.0001;

  const handleToggle = () => {
    sound.playClick();
    setIsOverlaid(!isOverlaid);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/85 backdrop-blur-md select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-2xl bg-stone-900 border-2 border-amber-600/80 rounded-2xl shadow-2xl p-4 sm:p-6 text-stone-100 flex flex-col gap-4 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-amber-900/60 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center shadow">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-heading font-black text-base sm:text-lg text-amber-200 flex items-center gap-2">
                  <span>Uji Tumpuk Model (Overlay)</span>
                  <span className="text-xs font-bold text-amber-400 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-400/40">
                    Buktikan Kesetaraan
                  </span>
                </h2>
                <p className="text-xs text-stone-300">
                  Tumpuk kedua balok pecahan untuk membuktikan apakah luas bagian hijaunya sama atau berbeda.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-white/10 transition-all cursor-pointer"
              title="Tutup Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action Toggle Button */}
          <div className="flex items-center justify-between bg-stone-950/70 p-2.5 rounded-xl border border-stone-800">
            <span className="text-xs text-stone-300 font-heading">
              Status Tampilan: <strong className="text-amber-300">{isOverlaid ? 'Bertumpuk (Overlay Aktif)' : 'Berdampingan (Terpisah)'}</strong>
            </span>

            <button
              onClick={handleToggle}
              className={`px-4 py-2 rounded-xl font-heading font-black text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer ${
                isOverlaid
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-emerald-950 ring-2 ring-emerald-300'
                  : 'bg-amber-400 hover:bg-amber-300 text-amber-950'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>{isOverlaid ? 'Pisahkan Batang' : '🔄 Tumpuk Model (Overlay)'}</span>
            </button>
          </div>

          {/* Visual Canvas Area */}
          <div className="relative w-full bg-stone-950/90 rounded-2xl p-4 sm:p-6 border border-amber-900/60 shadow-inner flex flex-col gap-4 min-h-[170px] justify-center items-center overflow-hidden">
            {/* Guide line for the green boundary of Fraction A */}
            <div
              style={{ left: `${(fractionA.num / fractionA.den) * 100}%` }}
              className="absolute top-2 bottom-2 w-0.5 border-r-2 border-dashed border-amber-400/90 pointer-events-none z-30"
            >
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] font-mono text-amber-300 bg-stone-900 px-1 rounded whitespace-nowrap shadow">
                Batas Hijau {titleA}
              </span>
            </div>

            {/* Guide line for Fraction B if different */}
            {!isEquivalent && (
              <div
                style={{ left: `${(fractionB.num / fractionB.den) * 100}%` }}
                className="absolute top-2 bottom-2 w-0.5 border-r-2 border-dashed border-cyan-400/90 pointer-events-none z-30"
              >
                <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[9px] font-mono text-cyan-300 bg-stone-900 px-1 rounded whitespace-nowrap shadow">
                  Batas Hijau {titleB}
                </span>
              </div>
            )}

            {/* Model A Bar */}
            <div className="w-full flex flex-col gap-1 z-20">
              <div className="flex items-center justify-between text-xs font-heading font-bold text-emerald-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  {titleA}
                </span>
                <span className="inline-flex items-center gap-1">
                  Pecahan: <MathFraction num={fractionA.num} den={fractionA.den} size="xs" />
                </span>
              </div>

              <motion.div
                animate={isOverlaid ? { y: 22, opacity: 0.85, scale: 0.99 } : { y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full h-11 rounded-xl border-2 border-emerald-500 overflow-hidden flex shadow-lg bg-stone-900"
              >
                {Array.from({ length: fractionA.den }).map((_, idx) => {
                  const isGreen = idx < fractionA.num;
                  return (
                    <div
                      key={idx}
                      style={{ width: `${100 / fractionA.den}%` }}
                      className={`h-full border-r last:border-r-0 flex items-center justify-center font-heading font-bold text-xs ${
                        isGreen
                          ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white border-emerald-900'
                          : 'bg-gradient-to-r from-amber-800 to-amber-700 text-amber-200 border-amber-950'
                      }`}
                    >
                      <MathFraction num={1} den={fractionA.den} size="2xs" />
                    </div>
                  );
                })}
              </motion.div>
            </div>

            {/* Model B Bar */}
            <div className="w-full flex flex-col gap-1 z-10">
              <div className="flex items-center justify-between text-xs font-heading font-bold text-cyan-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  {titleB}
                </span>
                <span className="inline-flex items-center gap-1">
                  Pecahan: <MathFraction num={fractionB.num} den={fractionB.den} size="xs" />
                </span>
              </div>

              <motion.div
                animate={isOverlaid ? { y: -22, opacity: 0.85, scale: 0.99 } : { y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full h-11 rounded-xl border-2 border-cyan-500 overflow-hidden flex shadow-lg bg-stone-900"
              >
                {Array.from({ length: fractionB.den }).map((_, idx) => {
                  const isGreen = idx < fractionB.num;
                  return (
                    <div
                      key={idx}
                      style={{ width: `${100 / fractionB.den}%` }}
                      className={`h-full border-r last:border-r-0 flex items-center justify-center font-heading font-bold text-xs ${
                        isGreen
                          ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white border-emerald-900'
                          : 'bg-gradient-to-r from-amber-800 to-amber-700 text-amber-200 border-amber-950'
                      }`}
                    >
                      <MathFraction num={1} den={fractionB.den} size="2xs" />
                    </div>
                  );
                })}
              </motion.div>
            </div>
          </div>

          {/* Mathematical Conclusion Banner based on Overlay */}
          <div
            className={`p-3.5 rounded-xl border flex items-center gap-3 shadow-md ${
              isEquivalent
                ? 'bg-emerald-950/90 border-emerald-400 text-emerald-100'
                : 'bg-amber-950/90 border-amber-400 text-amber-100'
            }`}
          >
            {isEquivalent ? (
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-emerald-950 font-black flex items-center justify-center text-xl shrink-0 shadow">
                ✓
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-amber-500 text-amber-950 font-black flex items-center justify-center text-xl shrink-0 shadow">
                ≠
              </div>
            )}

            <div className="flex-1">
              <div className="flex items-center gap-2 font-heading font-black text-sm sm:text-base">
                <MathFraction num={fractionA.num} den={fractionA.den} size="xs" />
                <span className={isEquivalent ? 'text-emerald-300 font-black text-lg' : 'text-amber-300 font-black text-lg'}>
                  {isEquivalent ? '=' : valA > valB ? '>' : '<'}
                </span>
                <MathFraction num={fractionB.num} den={fractionB.den} size="xs" />
                <span className="text-white text-xs sm:text-sm font-bold ml-1">
                  {isEquivalent
                    ? 'KEDUA PECAHAN INI SENILAI!'
                    : valA > valB
                    ? `${titleA} LEBIH BESAR dari ${titleB}`
                    : `${titleA} LEBIH KECIL dari ${titleB}`}
                </span>
              </div>
              <p className="text-xs opacity-90 mt-0.5">
                {isEquivalent
                  ? 'Bagian hijau pada kedua batang memiliki panjang dan luas yang persis sama, meskipun jumlah potongannya berbeda.'
                  : `Bagian hijau pada ${valA > valB ? titleA : titleB} lebih panjang daripada ${valA > valB ? titleB : titleA}.`}
              </p>
            </div>
          </div>

          {/* Bottom Close */}
          <div className="flex justify-end pt-1">
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl font-heading font-black text-xs sm:text-sm bg-stone-800 hover:bg-stone-700 text-stone-200 border border-white/20 active:scale-95 transition-all cursor-pointer"
            >
              Tutup & Lanjutkan Konstruksi
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
