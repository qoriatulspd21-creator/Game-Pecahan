import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, BookOpen, Scissors, Layers, ShieldCheck, Play, ArrowRight, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/sound';
import { MathFraction } from './MathFraction';

interface TutorialScreenProps {
  onBackToHome: () => void;
  onStartAdventure: () => void;
}

interface StepItem {
  step: number;
  title: string;
  desc: React.ReactNode;
  icon: React.ElementType;
  color: string;
  tip: React.ReactNode;
}

const STEPS: StepItem[] = [
  {
    step: 1,
    title: '1. Amati Dua Model Pecahan',
    desc: (
      <span>
        Di Pulau A terdapat pecahan <MathFraction num={1} den={2} size="xs" /> (1 dari 2 bagian berwarna hijau). Di Pulau B terdapat pecahan <MathFraction num={2} den={4} size="xs" /> (2 dari 4 bagian berwarna hijau). Keduanya memiliki ukuran balok keseluruhan yang sama panjang.
      </span>
    ),
    icon: Layers,
    color: 'from-cyan-600 to-sky-700',
    tip: 'Perhatikan bahwa panjang total satu balok mewakili 1 unit utuh yang sama!',
  },
  {
    step: 2,
    title: '2. Potong Menggunakan Tombol "BAGI 2"',
    desc: (
      <span>
        Sentuh model Pulau A lalu tekan tombol <strong>"BAGI 2"</strong>. Setiap 1 bagian akan terbelah menjadi 2 bagian sama besar. Bagian hijau yang tadinya 1 bagian (<MathFraction num={1} den={2} size="xs" />) berubah menjadi 2 bagian (<MathFraction num={2} den={4} size="xs" />), namun luas daerah hijau tidak bertambah atau berkurang!
      </span>
    ),
    icon: Scissors,
    color: 'from-amber-500 to-amber-700',
    tip: (
      <span className="inline-flex items-center gap-1.5 flex-wrap">
        <span>Rumus matematis:</span>
        <MathFraction num={1} den={2} size="xs" />
        <span>=</span>
        <MathFraction num={<>1 &times; 2</>} den={<>2 &times; 2</>} size="xs" />
        <span>=</span>
        <MathFraction num={2} den={4} size="xs" />
        <span>. Luasnya tetap persis sama!</span>
      </span>
    ),
  },
  {
    step: 3,
    title: '3. Susun 4 Segmen Papan Jembatan',
    desc: (
      <span>
        Pasang 4 papan pecahan ke bentang jembatan menggunakan drag-and-drop atau ketuk papan lalu ketuk slot jembatan. Susun persis sesuai urutan model potongan: 2 papan hijau di slot 1 & 2, lalu 2 papan kayu di slot 3 & 4.
      </span>
    ),
    icon: BookOpen,
    color: 'from-emerald-600 to-emerald-800',
    tip: (
      <span className="inline-flex items-center gap-1">
        <span>Papan jembatan mewakili 4 pecahan seperempat (</span>
        <MathFraction num={1} den={4} size="xs" />
        <span>) yang saling menyambung.</span>
      </span>
    ),
  },
  {
    step: 4,
    title: '4. Uji Bukti dengan Tombol Pembuktian',
    desc: (
      <span>
        Buka tab <strong>"Tombol Pembuktian"</strong>, pilih tanda sama dengan (=) dan pilih alasan matematis yang menyatakan bahwa luas daerah berwarna tetap sama meskipun jumlah potongannya berubah.
      </span>
    ),
    icon: ShieldCheck,
    color: 'from-amber-400 to-amber-600',
    tip: 'Setelah semua syarat terpenuhi, jembatan akan mengunci kokoh dan Kiko menyeberang dengan selamat!',
  },
];

export const TutorialScreen: React.FC<TutorialScreenProps> = ({
  onBackToHome,
  onStartAdventure,
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const current = STEPS[activeStepIndex];

  return (
    <div className="w-full min-h-screen bg-slate-950 flex flex-col items-center justify-start overflow-y-auto font-sans select-none text-slate-100 pb-12">
      {/* Top Header */}
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
            <span>PANDUAN CARA BERMAIN</span>
            <span className="text-[11px] bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 px-2 py-0.5 rounded-full font-bold">
              4 Langkah Mudah
            </span>
          </h1>
          <p className="text-[10px] sm:text-xs text-amber-200/80">
            Pelajari langkah pembuktian pecahan senilai sebelum memulai petualangan!
          </p>
        </div>

        <button
          onClick={() => {
            sound.playStart();
            onStartAdventure();
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-amber-950 font-heading font-black text-xs sm:text-sm shadow-md active:scale-95 transition-all cursor-pointer"
          style={{ minHeight: '44px' }}
        >
          <span>Mulai Misi</span>
          <Play className="w-3.5 h-3.5 fill-current" />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-3xl px-4 mt-6 flex flex-col gap-5">
        {/* Step Selector Pills */}
        <div className="grid grid-cols-4 gap-2">
          {STEPS.map((s, idx) => {
            const isActive = idx === activeStepIndex;
            return (
              <button
                key={s.step}
                onClick={() => {
                  sound.playClick();
                  setActiveStepIndex(idx);
                }}
                className={`py-2 px-2 rounded-xl font-heading font-black text-xs sm:text-sm flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-amber-950 border-amber-300 ring-2 ring-amber-400/50 font-black'
                    : 'bg-stone-900/90 text-stone-300 hover:bg-stone-800 border-white/10'
                }`}
                style={{ minHeight: '52px' }}
              >
                <span>Langkah {s.step}</span>
              </button>
            );
          })}
        </div>

        {/* Step Detail Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-5 sm:p-6 bg-stone-900/95 rounded-3xl border-2 border-amber-800/80 shadow-2xl flex flex-col gap-4"
          >
            {/* Header of step */}
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-black shadow-lg">
                <current.icon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-heading font-black text-base sm:text-xl text-white">
                  {current.title}
                </h2>
                <span className="text-xs text-amber-300 font-bold">
                  Langkah {current.step} dari 4
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="text-xs sm:text-sm text-stone-200 leading-relaxed">
              {current.desc}
            </div>

            {/* Key pedagogical tip */}
            <div className="p-3.5 bg-emerald-950/70 rounded-2xl border border-emerald-500/40 flex items-start gap-2.5 text-xs text-emerald-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>{current.tip}</div>
            </div>

            {/* Step Navigation Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <button
                disabled={activeStepIndex === 0}
                onClick={() => {
                  sound.playClick();
                  setActiveStepIndex((prev) => Math.max(0, prev - 1));
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all ${
                  activeStepIndex === 0
                    ? 'opacity-40 cursor-not-allowed bg-stone-800 text-stone-500'
                    : 'bg-stone-800 hover:bg-stone-700 text-stone-200 active:scale-95 cursor-pointer'
                }`}
                style={{ minHeight: '44px' }}
              >
                Sebelumnya
              </button>

              {activeStepIndex < STEPS.length - 1 ? (
                <button
                  onClick={() => {
                    sound.playClick();
                    setActiveStepIndex((prev) => Math.min(STEPS.length - 1, prev + 1));
                  }}
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-heading font-black text-xs sm:text-sm flex items-center gap-1.5 shadow active:scale-95 cursor-pointer"
                  style={{ minHeight: '44px' }}
                >
                  <span>Selanjutnya</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    sound.playStart();
                    onStartAdventure();
                  }}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 text-white font-heading font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-lg active:scale-95 cursor-pointer"
                  style={{ minHeight: '44px' }}
                >
                  <span>Mulai Tantangan!</span>
                  <Play className="w-4 h-4 fill-current" />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};
