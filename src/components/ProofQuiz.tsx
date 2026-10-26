import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, AlertTriangle, ShieldCheck, Sparkles } from 'lucide-react';
import { sound } from '../utils/sound';
import { MathFraction } from './MathFraction';

interface ProofQuizProps {
  symbol: string | null;
  onSelectSymbol: (sym: string) => void;
  reasonId: string | null;
  onSelectReason: (id: string) => void;
  onVerify: () => void;
  feedbackMessage: React.ReactNode;
  isSuccess: boolean;
  canVerify: boolean;
  isTransformed: boolean;
  allSlotsFilled: boolean;
}

interface ReasonOption {
  id: string;
  renderText: () => React.ReactNode;
  isCorrect: boolean;
}

const REASONS: ReasonOption[] = [
  {
    id: 'reason-correct',
    renderText: () => (
      <span>
        Kedua pecahan <strong>senilai</strong> karena bagian yang berwarna tetap <strong>sama luas</strong> meskipun jumlah bagiannya berubah.
      </span>
    ),
    isCorrect: true,
  },
  {
    id: 'reason-different',
    renderText: () => (
      <span>
        Kedua pecahan tidak senilai karena angka pembilang (1 & 2) dan penyebut (2 & 4) berbeda.
      </span>
    ),
    isCorrect: false,
  },
  {
    id: 'reason-bigger',
    renderText: () => (
      <span>
        Pecahan <MathFraction num={2} den={4} size="xs" /> lebih besar dari <MathFraction num={1} den={2} size="xs" /> karena angka 2 dan 4 lebih besar daripada angka 1 dan 2.
      </span>
    ),
    isCorrect: false,
  },
];

export const ProofQuiz: React.FC<ProofQuizProps> = ({
  symbol,
  onSelectSymbol,
  reasonId,
  onSelectReason,
  onVerify,
  feedbackMessage,
  isSuccess,
  canVerify,
  isTransformed,
  allSlotsFilled,
}) => {
  const symbols = [
    { id: '<', label: '<', desc: 'Lebih kecil' },
    { id: '=', label: '=', desc: 'Sama dengan (Senilai)' },
    { id: '>', label: '>', desc: 'Lebih besar' },
  ];

  return (
    <div className="w-full flex flex-col gap-2.5">
      {/* Header Badge: Explicitly labeled as Tombol Pembuktian */}
      <div className="flex items-center justify-between border-b border-amber-800/40 pb-1.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-400 text-amber-950 flex items-center justify-center font-black">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-black text-sm text-white flex items-center gap-1.5">
              <span>PANEL & TOMBOL PEMBUKTIAN</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded font-bold inline-flex items-center gap-1">
                <MathFraction num={1} den={2} size="xs" /> = <MathFraction num={2} den={4} size="xs" />
              </span>
            </h3>
          </div>
        </div>

        {/* Status Checklist Pill */}
        <div className="flex items-center gap-2 text-[10px] text-amber-200/80 font-bold">
          <span className={isTransformed ? 'text-emerald-400' : 'text-stone-400'}>
            {isTransformed ? '✓ Bagi 2' : '○ Bagi 2'}
          </span>
          <span>·</span>
          <span className={allSlotsFilled ? 'text-emerald-400' : 'text-stone-400'}>
            {allSlotsFilled ? '✓ 4 Papan' : '○ 4 Papan'}
          </span>
        </div>
      </div>

      {/* Row 1: Symbol Comparison with Vertical Fractions (Pembilang di atas, penyebut di bawah) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 bg-stone-900/90 p-2.5 rounded-xl border border-white/10">
        <span className="text-xs font-bold text-amber-200">
          1. Pilih simbol hubungan yang tepat:
        </span>
        <div className="flex items-center gap-2.5">
          {/* Pulau A Fraction 1/2 */}
          <div className="w-13 h-12 bg-stone-950 rounded-xl border border-white/20 text-white flex items-center justify-center p-1 shadow-inner">
            <MathFraction num={1} den={2} size="base" />
          </div>

          <div className="flex items-center gap-1.5">
            {symbols.map((item) => {
              const isSelected = symbol === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onSelectSymbol(item.id);
                  }}
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl font-heading font-black text-xl flex items-center justify-center transition-all duration-150 active:scale-95 touch-manipulation shadow ${
                    isSelected
                      ? 'bg-amber-400 text-amber-950 ring-3 ring-amber-300 scale-105'
                      : 'bg-stone-800 text-stone-200 hover:bg-stone-700 hover:text-white border border-white/10'
                  }`}
                  style={{ minWidth: '44px', minHeight: '44px' }}
                  title={item.desc}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Pulau B Fraction 2/4 */}
          <div className="w-13 h-12 bg-stone-950 rounded-xl border border-white/20 text-white flex items-center justify-center p-1 shadow-inner">
            <MathFraction num={2} den={4} size="base" />
          </div>
        </div>
      </div>

      {/* Row 2: Conceptual Reasoning Selection */}
      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold text-amber-200 px-0.5">
          2. Lengkapi alasan pembuktian:
        </span>
        <div className="flex flex-col gap-1.5">
          {REASONS.map((reason) => {
            const isSelected = reasonId === reason.id;
            return (
              <button
                key={reason.id}
                type="button"
                onClick={() => {
                  sound.playClick();
                  onSelectReason(reason.id);
                }}
                className={`w-full text-left p-2 sm:p-2.5 rounded-xl transition-all duration-150 flex items-start gap-2.5 active:scale-[0.99] touch-manipulation ${
                  isSelected
                    ? 'bg-emerald-950/95 border-2 border-emerald-400 text-white shadow-md'
                    : 'bg-stone-900/90 border border-white/10 text-stone-200 hover:bg-stone-800'
                }`}
                style={{ minHeight: '48px' }}
              >
                <div
                  className={`w-4 h-4 rounded-full mt-0.5 flex-shrink-0 flex items-center justify-center border ${
                    isSelected
                      ? 'border-emerald-400 bg-emerald-500 text-white'
                      : 'border-stone-500 bg-stone-700'
                  }`}
                >
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div className="text-[11px] sm:text-xs font-medium leading-snug">
                  {reason.renderText()}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback Message */}
      {feedbackMessage && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-2 sm:p-2.5 rounded-xl flex items-start gap-2 text-xs leading-snug ${
            isSuccess
              ? 'bg-emerald-950 border border-emerald-400 text-emerald-200'
              : 'bg-amber-950 border border-amber-400 text-amber-200'
          }`}
        >
          {isSuccess ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          )}
          <span>{feedbackMessage}</span>
        </motion.div>
      )}

      {/* THE PROOF BUTTON: Unmistakable, High Contrast, Min 56px */}
      {!isSuccess && (
        <button
          type="button"
          onClick={onVerify}
          className={`w-full py-3.5 px-6 rounded-2xl font-heading font-black text-sm sm:text-base uppercase tracking-wider transition-all duration-200 shadow-2xl flex items-center justify-center gap-2.5 active:scale-98 touch-manipulation cursor-pointer ${
            canVerify
              ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 text-amber-950 shadow-[0_4px_25px_rgba(251,191,36,0.6)] ring-2 ring-amber-300 animate-pulse'
              : 'bg-gradient-to-r from-amber-600/80 to-amber-700/80 hover:from-amber-600 hover:to-amber-600 text-white shadow-lg'
          }`}
          style={{ minHeight: '56px' }}
          title="Tekan tombol ini untuk menguji dan membuktikan apakah pecahan senilai"
        >
          <ShieldCheck className="w-6 h-6 text-amber-950 flex-shrink-0" />
          <span className={canVerify ? 'text-amber-950 font-black' : 'text-amber-100 font-extrabold'}>
            TOMBOL PEMBUKTIAN: BUKTIKAN PECAHAN
          </span>
          <Sparkles className="w-5 h-5 text-amber-950 flex-shrink-0" />
        </button>
      )}
    </div>
  );
};
