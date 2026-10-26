import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Sparkles, Scissors, CheckCircle, RotateCcw, Play, Layers } from 'lucide-react';
import { sound } from '../utils/sound';
import { MathFraction } from './MathFraction';

interface FreeLabScreenProps {
  onBackToHome: () => void;
  onStartAdventure: () => void;
}

interface BaseFractionOption {
  numerator: number;
  denominator: number;
  label: string;
}

const FRACTIONS: BaseFractionOption[] = [
  { numerator: 1, denominator: 2, label: '1/2' },
  { numerator: 1, denominator: 3, label: '1/3' },
  { numerator: 2, denominator: 3, label: '2/3' },
  { numerator: 1, denominator: 4, label: '1/4' },
  { numerator: 2, denominator: 4, label: '2/4' },
];

export const FreeLabScreen: React.FC<FreeLabScreenProps> = ({
  onBackToHome,
  onStartAdventure,
}) => {
  const [selectedFraction, setSelectedFraction] = useState<BaseFractionOption>(FRACTIONS[0]);
  const [multiplier, setMultiplier] = useState<number>(2);
  const [isSliced, setIsSliced] = useState<boolean>(false);

  // Calculated equivalent fraction
  const newNum = selectedFraction.numerator * multiplier;
  const newDen = selectedFraction.denominator * multiplier;

  const handleSelectFraction = (f: BaseFractionOption) => {
    sound.playClick();
    setSelectedFraction(f);
    setIsSliced(false);
  };

  const handleSlice = (m: number) => {
    sound.playSlice();
    setMultiplier(m);
    setIsSliced(true);
  };

  const handleReset = () => {
    sound.playClick();
    setIsSliced(false);
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 flex flex-col items-center justify-start overflow-y-auto font-sans select-none text-slate-100 pb-12">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 w-full px-4 sm:px-6 py-3 bg-stone-950/90 backdrop-blur-md border-b border-amber-900/60 flex items-center justify-between shadow-lg">
        <button
          onClick={() => {
            sound.playClick();
            onBackToHome();
          }}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-white/20 font-heading font-bold text-xs sm:text-sm active:scale-95 transition-all cursor-pointer shadow"
          style={{ minHeight: '44px' }}
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>Menu Utama</span>
        </button>

        <div className="text-center">
          <h1 className="font-heading font-black text-base sm:text-lg text-white flex items-center justify-center gap-2">
            <span>LABORATORIUM BEBAS PECAHAN</span>
            <span className="text-[11px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full font-bold">
              Eksperimen Mandiri
            </span>
          </h1>
          <p className="text-[10px] sm:text-xs text-amber-200/80">
            Pilih pecahan, potong bagiannya, dan amati pembuktian kesetaraan luas!
          </p>
        </div>

        {/* Direct Switcher: Petualangan Jembatan <-> Lab Bebas */}
        <div className="flex items-center bg-stone-900/90 rounded-xl p-1 border border-amber-900/60 shadow">
          <button
            onClick={() => {
              sound.playStart();
              onStartAdventure();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading font-bold text-stone-300 hover:text-white hover:bg-stone-800 transition-all cursor-pointer"
            style={{ minHeight: '36px' }}
            title="Buka Mode Petualangan Jembatan"
          >
            <span>🌉 Petualangan</span>
          </button>
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading font-black bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow"
            style={{ minHeight: '36px' }}
          >
            <span>🧪 Lab Bebas</span>
          </div>
        </div>
      </header>

      {/* Main Lab Content Area */}
      <main className="w-full max-w-4xl px-3 sm:px-6 mt-4 flex flex-col gap-4">
        {/* Step 1: Choose Starting Fraction */}
        <div className="p-4 bg-stone-900/90 rounded-2xl border-2 border-amber-900/60 shadow-xl flex flex-col gap-2.5">
          <span className="font-heading font-bold text-xs sm:text-sm text-amber-300 flex items-center gap-2">
            <span>1. Pilih Pecahan Awal yang Ingin Diuji:</span>
          </span>
          <div className="grid grid-cols-5 gap-2">
            {FRACTIONS.map((f) => {
              const isSelected = selectedFraction.label === f.label;
              return (
                <button
                  key={f.label}
                  onClick={() => handleSelectFraction(f)}
                  className={`py-2 px-1 rounded-xl font-heading font-black transition-all active:scale-95 cursor-pointer shadow flex items-center justify-center ${
                    isSelected
                      ? 'bg-amber-400 text-amber-950 ring-3 ring-amber-300 scale-105'
                      : 'bg-stone-800 text-stone-200 hover:bg-stone-700 border border-white/10'
                  }`}
                  style={{ minHeight: '56px' }}
                  title={`Pilih pecahan ${f.numerator} per ${f.denominator}`}
                >
                  <MathFraction num={f.numerator} den={f.denominator} size="base" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Slice Multipliers */}
        <div className="p-4 bg-stone-900/90 rounded-2xl border-2 border-amber-900/60 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="font-heading font-bold text-xs sm:text-sm text-amber-300">
              2. Pilih Pembagian Tiap Bagian:
            </span>
            <span className="text-[11px] text-stone-300">
              Setiap 1 bagian dipotong menjadi sejumlah bagian sama besar.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSlice(2)}
              className={`px-4 py-2.5 rounded-xl font-heading font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow ${
                isSliced && multiplier === 2
                  ? 'bg-emerald-500 text-white ring-2 ring-emerald-300'
                  : 'bg-stone-800 text-stone-200 hover:bg-stone-700 border border-white/10'
              }`}
              style={{ minHeight: '52px' }}
            >
              <Scissors className="w-4 h-4 text-amber-400" />
              <span>BAGI 2 (×2)</span>
            </button>

            <button
              onClick={() => handleSlice(3)}
              className={`px-4 py-2.5 rounded-xl font-heading font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow ${
                isSliced && multiplier === 3
                  ? 'bg-emerald-500 text-white ring-2 ring-emerald-300'
                  : 'bg-stone-800 text-stone-200 hover:bg-stone-700 border border-white/10'
              }`}
              style={{ minHeight: '52px' }}
            >
              <Scissors className="w-4 h-4 text-amber-400" />
              <span>BAGI 3 (×3)</span>
            </button>

            {isSliced && (
              <button
                onClick={handleReset}
                className="p-2.5 rounded-xl bg-stone-800 text-stone-300 hover:bg-stone-700 border border-white/10"
                title="Reset Pembagian"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Step 3: Live Visual Bar Comparison */}
        <div className="p-4 sm:p-5 bg-stone-900/95 rounded-2xl border-2 border-emerald-500/50 shadow-2xl flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-heading font-black text-sm sm:text-base text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Perbandingan Luas Model Pecahan</span>
            </span>
            <span className="text-xs bg-emerald-950 text-emerald-300 px-2.5 py-0.5 rounded-lg border border-emerald-400/40 font-bold">
              Panjang Utuh = Sama Persis
            </span>
          </div>

          {/* Model 1: Original */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-amber-200">
              <span className="inline-flex items-center gap-1">
                <span>Model Awal:</span>
                <MathFraction num={selectedFraction.numerator} den={selectedFraction.denominator} size="xs" />
              </span>
              <span className="text-stone-300 text-[11px]">
                {selectedFraction.numerator} dari {selectedFraction.denominator} bagian diwarnai
              </span>
            </div>
            <div className="w-full h-12 bg-amber-950/80 rounded-xl p-1 border-2 border-amber-900 shadow-inner flex overflow-hidden">
              {Array.from({ length: selectedFraction.denominator }).map((_, i) => {
                const isGreen = i < selectedFraction.numerator;
                return (
                  <div
                    key={i}
                    className={`flex-1 h-full border-r last:border-r-0 border-black/30 flex items-center justify-center ${
                      isGreen
                        ? 'bg-gradient-to-b from-emerald-400 to-emerald-600 text-white'
                        : 'bg-gradient-to-b from-amber-100 to-amber-200 text-amber-950'
                    }`}
                  >
                    <MathFraction num={1} den={selectedFraction.denominator} size="xs" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Model 2: Transformed (If sliced) */}
          {isSliced ? (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
                <span className="inline-flex items-center gap-1">
                  <span>Model Hasil Transformasi:</span>
                  <MathFraction num={newNum} den={newDen} size="xs" />
                </span>
                <span className="text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Luas daerah hijau sama persis!
                </span>
              </div>
              <div className="w-full h-12 bg-amber-950/80 rounded-xl p-1 border-2 border-emerald-500 shadow-inner flex overflow-hidden">
                {Array.from({ length: newDen }).map((_, i) => {
                  const isGreen = i < newNum;
                  return (
                    <div
                      key={i}
                      className={`flex-1 h-full border-r last:border-r-0 border-black/30 flex items-center justify-center ${
                        isGreen
                          ? 'bg-gradient-to-b from-emerald-400 to-emerald-600 text-white'
                          : 'bg-gradient-to-b from-amber-100 to-amber-200 text-amber-950'
                      }`}
                    >
                      <MathFraction num={1} den={newDen} size="2xs" />
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <div className="p-4 rounded-xl border border-dashed border-amber-500/40 text-center text-xs text-amber-300">
              Pilih tombol pembagian di atas untuk melihat bagaimana pecahan bertransformasi!
            </div>
          )}

          {/* Mathematical Equation Card */}
          {isSliced && (
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="p-3 bg-stone-950 rounded-xl border border-amber-400/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left"
            >
              <div>
                <span className="font-heading font-black text-amber-300 text-xs sm:text-sm">
                  Rumus Matematika Pecahan Senilai:
                </span>
                <p className="text-[11px] text-stone-300">
                  Mengalikan pembilang dan penyebut dengan angka yang sama ({multiplier}) tidak mengubah nilai pecahan.
                </p>
              </div>

              <div className="px-4 py-2 bg-stone-900 rounded-lg border border-white/20 font-heading font-black text-base sm:text-lg text-white flex items-center gap-2">
                <MathFraction num={selectedFraction.numerator} den={selectedFraction.denominator} size="base" />
                <span className="text-amber-400">=</span>
                <MathFraction
                  num={<>{selectedFraction.numerator} &times; {multiplier}</>}
                  den={<>{selectedFraction.denominator} &times; {multiplier}</>}
                  size="base"
                  className="text-amber-300"
                />
                <span className="text-amber-400">=</span>
                <MathFraction num={newNum} den={newDen} size="base" className="text-emerald-400" />
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};
