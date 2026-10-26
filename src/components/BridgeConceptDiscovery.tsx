import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Scissors,
  Layers,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Hammer,
  ArrowLeft,
} from 'lucide-react';
import { sound } from '../utils/sound';
import { MathFraction } from './MathFraction';

interface BridgeConceptDiscoveryProps {
  onCompleteDiscovery: () => void;
  isAlreadyTransformed?: boolean;
  fractionA?: { num: number; den: number };
  fractionB?: { num: number; den: number };
}

type StepIndex = 1 | 2 | 3 | 4 | 5;

export const BridgeConceptDiscovery: React.FC<BridgeConceptDiscoveryProps> = ({
  onCompleteDiscovery,
  isAlreadyTransformed = false,
  fractionA = { num: 1, den: 2 },
  fractionB = { num: 2, den: 4 },
}) => {
  const [step, setStep] = useState<StepIndex>(isAlreadyTransformed ? 5 : 1);

  // Step 1: Split animation
  const [isSlicingAnim, setIsSlicingAnim] = useState<boolean>(false);
  const [isSplitDone, setIsSplitDone] = useState<boolean>(isAlreadyTransformed);

  // Step 2: Question "Apa yang berubah?"
  const [selectedChange, setSelectedChange] = useState<string | null>(
    isAlreadyTransformed ? 'parts' : null
  );
  const [changeFeedback, setChangeFeedback] = useState<string | null>(null);

  // Step 3: Overlay comparison
  const [isOverlaid, setIsOverlaid] = useState<boolean>(false);
  const [relationSymbol, setRelationSymbol] = useState<'<' | '=' | '>' | null>(
    isAlreadyTransformed ? '=' : null
  );
  const [relationFeedback, setRelationFeedback] = useState<string | null>(null);

  // Step 4: Cloze reasoning
  const [clozeEquiv, setClozeEquiv] = useState<'senilai' | 'berbeda' | null>(
    isAlreadyTransformed ? 'senilai' : null
  );
  const [clozeLength, setClozeLength] = useState<'sama' | 'berbeda' | null>(
    isAlreadyTransformed ? 'sama' : null
  );
  const [reasonFeedback, setReasonFeedback] = useState<string | null>(null);

  // Reset to Step 1
  const handleReset = () => {
    sound.playClick();
    setStep(1);
    setIsSlicingAnim(false);
    setIsSplitDone(false);
    setSelectedChange(null);
    setChangeFeedback(null);
    setIsOverlaid(false);
    setRelationSymbol(null);
    setRelationFeedback(null);
    setClozeEquiv(null);
    setClozeLength(null);
    setReasonFeedback(null);
  };

  // Step 1: Handle Split
  const handleSplit = () => {
    sound.playSlice();
    setIsSlicingAnim(true);
    setTimeout(() => {
      setIsSlicingAnim(false);
      setIsSplitDone(true);
      sound.playSuccess();
      setStep(2);
    }, 700);
  };

  // Step 2: Answer question
  const handleAnswerChange = (ans: 'parts' | 'green_len' | 'total_len') => {
    setSelectedChange(ans);
    if (ans === 'parts') {
      sound.playSuccess();
      setChangeFeedback(
        'Tepat sekali! Yang berubah adalah jumlah bagiannya (dari 2 menjadi 4). Panjang warna hijaunya tetap sama!'
      );
    } else if (ans === 'green_len') {
      sound.playHint();
      setChangeFeedback(
        'Coba perhatikan: panjang warna hijau tidak berkurang atau bertambah, tetap separuh batang!'
      );
    } else {
      sound.playHint();
      setChangeFeedback(
        'Coba amati kembali: panjang seluruh batang tetap 1 balok yang sama panjang!'
      );
    }
  };

  // Step 3: Choose relation
  const handleChooseRelation = (sym: '<' | '=' | '>') => {
    setRelationSymbol(sym);
    if (sym === '=') {
      sound.playSuccess();
      setRelationFeedback(
        'Benar sekali! Bagian hijau pada kedua batang persis sama panjang!'
      );
    } else {
      sound.playHint();
      setRelationFeedback(
        'Coba lihat garis tumpukan (Overlay): bagian hijau keduanya berhimpitan dan sama panjang.'
      );
    }
  };

  // Step 4: Verify reasoning
  const handleVerifyReasoning = () => {
    if (!clozeEquiv || !clozeLength) {
      sound.playHint();
      setReasonFeedback('Pilih kedua kata yang tepat pada kalimat di atas!');
      return;
    }

    if (clozeEquiv === 'senilai' && clozeLength === 'sama') {
      sound.playSuccess();
      setReasonFeedback('Luar biasa! Alasanmu benar dan logis.');
      setTimeout(() => {
        setStep(5);
      }, 500);
    } else {
      sound.playHint();
      setReasonFeedback(
        'Coba teliti lagi: apakah bagian hijaunya sama panjang? Dan apakah kedua pecahan senilai?'
      );
    }
  };

  return (
    <div className="w-full bg-stone-900/95 rounded-2xl border-2 border-amber-800/80 p-3 sm:p-4 shadow-xl flex flex-col gap-3">
      {/* Header with Progress Steps Indicator */}
      <div className="flex items-center justify-between border-b border-amber-900/50 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-amber-400 text-amber-950 font-black text-xs flex items-center justify-center shadow">
            {step}
          </span>
          <div>
            <h3 className="font-heading font-black text-xs sm:text-sm text-amber-200 flex items-center gap-1.5">
              <span>Penanaman Konsep:</span>
              <MathFraction num={fractionA.num} den={fractionA.den} size="2xs" />
              <span>=</span>
              <MathFraction num={fractionB.num} den={fractionB.den} size="2xs" />
            </h3>
            <p className="text-[11px] text-stone-300">
              {step === 1 && 'Langkah 1: Belah batang pecahan menjadi dua bagian sama besar'}
              {step === 2 && 'Langkah 2: Amati apa yang berubah setelah dibelah'}
              {step === 3 && 'Langkah 3: Tumpuk batang (Overlay) untuk membandingkan panjang'}
              {step === 4 && 'Langkah 4: Lengkapi alasan pembuktian matematika'}
              {step === 5 && 'Langkah 5: Kesimpulan konsep pecahan senilai'}
            </p>
          </div>
        </div>

        {/* Step Indicator Badges (1 - 4) */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                s === step
                  ? 'bg-amber-400 scale-125 ring-2 ring-amber-300'
                  : s < step
                  ? 'bg-emerald-400'
                  : 'bg-stone-700'
              }`}
              title={`Langkah ${s}`}
            />
          ))}
          <button
            onClick={handleReset}
            className="ml-2 flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-heading font-bold bg-stone-800 hover:bg-stone-700 text-stone-300 border border-white/10 active:scale-95 transition-all cursor-pointer"
            title="Mulai Ulang dari Langkah 1"
          >
            <RotateCcw className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">Ulangi</span>
          </button>
        </div>
      </div>

      {/* SINGLE ACTIVE STEP CONTENT (Clean, compact, no clutter!) */}
      <AnimatePresence mode="wait">
        {/* LANGKAH 1: SPLIT */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex flex-col gap-3 py-1"
          >
            {/* Visual Bar A */}
            <div className="flex items-center justify-between text-xs text-amber-300 font-bold">
              <span>Batang Pecahan Awal ({fractionA.num} Hijau dari {fractionA.den} Bagian):</span>
              <span className="text-emerald-300 font-mono text-sm font-black flex items-center gap-1">
                <MathFraction num={fractionA.num} den={fractionA.den} size="xs" />
              </span>
            </div>

            <div className="relative w-full h-12 sm:h-14 bg-amber-950/90 rounded-xl border-2 border-amber-700 overflow-hidden flex shadow-inner">
              {Array.from({ length: fractionA.den }).map((_, i) => {
                const isGreen = i < fractionA.num;
                return (
                  <div
                    key={i}
                    style={{ width: `${100 / fractionA.den}%` }}
                    className={`h-full border-r last:border-r-0 flex items-center justify-center font-heading font-black text-sm drop-shadow ${
                      isGreen
                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 border-amber-950 text-white'
                        : 'bg-gradient-to-r from-amber-800 to-amber-700 border-amber-950 text-amber-200'
                    }`}
                  >
                    <MathFraction num={1} den={fractionA.den} size="xs" />
                    {isGreen && i === 0 && (
                      <span className="text-[10px] ml-1 opacity-90 hidden sm:inline">(Hijau)</span>
                    )}
                  </div>
                );
              })}

              {/* Slicing laser effect */}
              {isSlicingAnim && (
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  className="absolute inset-0 bg-amber-300/20 flex items-center justify-around pointer-events-none z-20"
                >
                  {Array.from({ length: fractionB.den }).map((_, i) => (
                    <div key={i} className="w-1 h-full bg-amber-300 shadow-[0_0_12px_#fbbf24]" />
                  ))}
                </motion.div>
              )}
            </div>

            {/* Interaction Row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <div className="text-xs text-amber-100 flex items-center gap-2">
                <span className="text-xl">🤖</span>
                <span className="leading-snug">
                  <strong>Kiko:</strong> "Bagaimana kalau setiap bagian kita belah menjadi dua? Apakah bagian hijaunya berubah?"
                </span>
              </div>

              <button
                onClick={handleSplit}
                disabled={isSlicingAnim}
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-heading font-black text-sm uppercase tracking-wide bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 text-amber-950 shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer shrink-0 animate-pulse"
                style={{ minHeight: '48px' }}
              >
                <Scissors className="w-4 h-4 text-amber-950" />
                <span>SPLIT (Belah Jadi Dua)</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* LANGKAH 2: APA YANG BERUBAH? */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex flex-col gap-3 py-1"
          >
            {/* Split result representation */}
            <div className="flex items-center justify-between text-xs text-amber-300 font-bold">
              <span>Hasil Pembelahan (Kini Menjadi {fractionB.den} Bagian Sama Besar):</span>
              <span className="text-amber-200 font-mono text-sm font-black flex items-center gap-1">
                <MathFraction num={fractionB.num} den={fractionB.den} size="xs" />
              </span>
            </div>

            <div className="relative w-full h-11 sm:h-12 bg-amber-950/90 rounded-xl border-2 border-amber-700 overflow-hidden flex shadow-inner">
              {Array.from({ length: fractionB.den }).map((_, i) => {
                const isGreen = i < fractionB.num;
                return (
                  <div
                    key={i}
                    style={{ width: `${100 / fractionB.den}%` }}
                    className={`h-full border-r last:border-r-0 flex items-center justify-center font-heading font-bold text-xs ${
                      isGreen
                        ? 'bg-emerald-600 border-emerald-950 text-white'
                        : 'bg-amber-800 border-amber-950 text-amber-200'
                    }`}
                  >
                    <MathFraction num={1} den={fractionB.den} size="2xs" />
                  </div>
                );
              })}
            </div>

            {/* Question */}
            <div className="text-xs sm:text-sm text-amber-100 flex items-center gap-2">
              <span className="text-lg">🤖</span>
              <span><strong>Kiko bertanya:</strong> "Apa yang berubah dari batang ini?"</span>
            </div>

            {/* 3 Choices */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => handleAnswerChange('parts')}
                className={`p-3 rounded-xl text-xs font-heading font-bold border transition-all text-left flex items-center justify-between cursor-pointer active:scale-95 ${
                  selectedChange === 'parts'
                    ? 'bg-emerald-900/90 border-emerald-400 text-emerald-200 shadow-md ring-2 ring-emerald-400/40'
                    : 'bg-stone-800/90 border-stone-700 text-stone-200 hover:bg-stone-700'
                }`}
                style={{ minHeight: '48px' }}
              >
                <span>A. Jumlah bagiannya</span>
                {selectedChange === 'parts' && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
              </button>

              <button
                onClick={() => handleAnswerChange('green_len')}
                className={`p-3 rounded-xl text-xs font-heading font-bold border transition-all text-left flex items-center justify-between cursor-pointer active:scale-95 ${
                  selectedChange === 'green_len'
                    ? 'bg-amber-950 border-amber-500 text-amber-200 shadow-md'
                    : 'bg-stone-800/90 border-stone-700 text-stone-200 hover:bg-stone-700'
                }`}
                style={{ minHeight: '48px' }}
              >
                <span>B. Panjang bagian hijaunya</span>
                {selectedChange === 'green_len' && (
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                )}
              </button>

              <button
                onClick={() => handleAnswerChange('total_len')}
                className={`p-3 rounded-xl text-xs font-heading font-bold border transition-all text-left flex items-center justify-between cursor-pointer active:scale-95 ${
                  selectedChange === 'total_len'
                    ? 'bg-amber-950 border-amber-500 text-amber-200 shadow-md'
                    : 'bg-stone-800/90 border-stone-700 text-stone-200 hover:bg-stone-700'
                }`}
                style={{ minHeight: '48px' }}
              >
                <span>C. Panjang seluruh batangnya</span>
                {selectedChange === 'total_len' && (
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                )}
              </button>
            </div>

            {/* Feedback and Continue Button */}
            {changeFeedback && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-1">
                <div
                  className={`p-2.5 rounded-xl text-xs flex items-center gap-2 flex-1 ${
                    selectedChange === 'parts'
                      ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-500/50'
                      : 'bg-amber-950/80 text-amber-200 border border-amber-500/50'
                  }`}
                >
                  {selectedChange === 'parts' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                  <span>{changeFeedback}</span>
                </div>

                {selectedChange === 'parts' && (
                  <button
                    onClick={() => {
                      sound.playClick();
                      setStep(3);
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-heading font-black text-xs sm:text-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer shrink-0"
                    style={{ minHeight: '44px' }}
                  >
                    <span>Lanjut ke Pembuktian Overlay</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* LANGKAH 3: OVERLAY & PERBANDINGAN */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex flex-col gap-3 py-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Bandingkan Batang 1/2 dan Batang 2/4 Secara Visual</span>
              </span>

              {/* OVERLAY Toggle Button */}
              <button
                onClick={() => {
                  sound.playClick();
                  setIsOverlaid(!isOverlaid);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-heading font-black flex items-center gap-1.5 shadow transition-all active:scale-95 cursor-pointer ${
                  isOverlaid
                    ? 'bg-emerald-500 text-emerald-950 ring-2 ring-emerald-300 shadow-emerald-500/30'
                    : 'bg-amber-400 hover:bg-amber-300 text-amber-950'
                }`}
                style={{ minHeight: '40px' }}
                title="Tumpuk kedua batang untuk melihat kesamaan panjang"
              >
                <Layers className="w-4 h-4" />
                <span>{isOverlaid ? 'Lepas Tumpukan' : '🔄 OVERLAY (Tumpuk Batang)'}</span>
              </button>
            </div>

            {/* Visual Display: Side-by-side or Stacked with Dotted Guide */}
            <div className="relative w-full flex flex-col gap-1.5 py-1">
              {/* Dotted Center Reference Line */}
              <div className="absolute inset-y-0 left-1/2 w-0.5 border-r-2 border-dashed border-amber-400 z-20 pointer-events-none" />
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-[9px] font-mono text-amber-300 bg-stone-900 px-1 rounded z-20 pointer-events-none">
                Garis 50%
              </div>

              {/* Bar 1: Fraction A */}
              <motion.div
                animate={isOverlaid ? { y: 20, opacity: 0.85, scale: 0.99 } : { y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="relative w-full h-9 rounded-lg border-2 border-emerald-600 overflow-hidden flex shadow bg-stone-950"
              >
                {Array.from({ length: fractionA.den }).map((_, i) => {
                  const isGreen = i < fractionA.num;
                  return (
                    <div
                      key={i}
                      style={{ width: `${100 / fractionA.den}%` }}
                      className={`h-full border-r last:border-r-0 flex items-center justify-center font-heading font-bold text-xs ${
                        isGreen
                          ? 'bg-emerald-600 text-white border-emerald-900'
                          : 'bg-amber-800 text-amber-200 border-amber-950'
                      }`}
                    >
                      <MathFraction num={1} den={fractionA.den} size="2xs" />
                    </div>
                  );
                })}
              </motion.div>

              {/* Bar 2: Fraction B */}
              <motion.div
                animate={isOverlaid ? { y: -20, opacity: 0.85, scale: 0.99 } : { y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="relative w-full h-9 rounded-lg border-2 border-amber-500 overflow-hidden flex shadow bg-stone-950"
              >
                {Array.from({ length: fractionB.den }).map((_, i) => {
                  const isGreen = i < fractionB.num;
                  return (
                    <div
                      key={i}
                      style={{ width: `${100 / fractionB.den}%` }}
                      className={`h-full border-r last:border-r-0 flex items-center justify-center font-heading font-bold text-[10px] ${
                        isGreen
                          ? 'bg-emerald-600 text-white border-emerald-900'
                          : 'bg-amber-800 text-amber-200 border-amber-950'
                      }`}
                    >
                      <MathFraction num={1} den={fractionB.den} size="2xs" />
                    </div>
                  );
                })}
              </motion.div>
            </div>

            {/* Question: Relasi Panjang */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1 border-t border-amber-900/40">
              <div className="text-xs text-amber-100 flex items-center gap-1.5">
                <span className="text-lg">🤖</span>
                <span><strong>Kiko:</strong> "Apakah bagian hijau pada kedua batang sama panjang?"</span>
              </div>

              <div className="flex items-center gap-2">
                {(['<', '=', '>'] as const).map((sym) => (
                  <button
                    key={sym}
                    onClick={() => handleChooseRelation(sym)}
                    className={`w-12 h-10 rounded-xl font-heading font-black text-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center shadow ${
                      relationSymbol === sym
                        ? sym === '='
                          ? 'bg-emerald-500 text-emerald-950 ring-2 ring-emerald-300'
                          : 'bg-amber-500 text-amber-950 ring-2 ring-amber-300'
                        : 'bg-stone-800 text-stone-200 hover:bg-stone-700'
                    }`}
                  >
                    {sym}
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback & Next */}
            {relationFeedback && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-1">
                <div
                  className={`p-2.5 rounded-xl text-xs flex items-center gap-2 flex-1 ${
                    relationSymbol === '='
                      ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-500/50'
                      : 'bg-amber-950/80 text-amber-200 border border-amber-500/50'
                  }`}
                >
                  {relationSymbol === '=' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                  <span>{relationFeedback}</span>
                </div>

                {relationSymbol === '=' && (
                  <button
                    onClick={() => {
                      sound.playClick();
                      setStep(4);
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-heading font-black text-xs sm:text-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer shrink-0"
                    style={{ minHeight: '44px' }}
                  >
                    <span>Lanjut ke Alasan Pembuktian</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* LANGKAH 4: MELENGKAPI ALASAN */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex flex-col gap-3 py-1"
          >
            <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Lengkapi Alasan Pembuktian Sederhana:</span>
            </div>

            {/* Sentence with Clickable Cloze Buttons */}
            <div className="bg-stone-950/90 p-3.5 rounded-xl border border-amber-900/60 text-xs sm:text-sm text-amber-100 flex flex-wrap items-center gap-2 leading-loose">
              <span>Kedua pecahan</span>

              {/* Blank 1 */}
              <div className="inline-flex items-center gap-1 bg-stone-900 px-1 py-0.5 rounded-lg border border-amber-600/60">
                <button
                  onClick={() => setClozeEquiv('senilai')}
                  className={`px-2.5 py-1 rounded-md text-xs font-heading font-black transition-all cursor-pointer ${
                    clozeEquiv === 'senilai'
                      ? 'bg-emerald-500 text-emerald-950 shadow'
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                  }`}
                >
                  senilai
                </button>
                <button
                  onClick={() => setClozeEquiv('berbeda')}
                  className={`px-2.5 py-1 rounded-md text-xs font-heading font-black transition-all cursor-pointer ${
                    clozeEquiv === 'berbeda'
                      ? 'bg-amber-600 text-white shadow'
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                  }`}
                >
                  berbeda
                </button>
              </div>

              <span>karena bagian yang diwarnai</span>

              {/* Blank 2 */}
              <div className="inline-flex items-center gap-1 bg-stone-900 px-1 py-0.5 rounded-lg border border-amber-600/60">
                <button
                  onClick={() => setClozeLength('sama')}
                  className={`px-2.5 py-1 rounded-md text-xs font-heading font-black transition-all cursor-pointer ${
                    clozeLength === 'sama'
                      ? 'bg-emerald-500 text-emerald-950 shadow'
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                  }`}
                >
                  sama panjang
                </button>
                <button
                  onClick={() => setClozeLength('berbeda')}
                  className={`px-2.5 py-1 rounded-md text-xs font-heading font-black transition-all cursor-pointer ${
                    clozeLength === 'berbeda'
                      ? 'bg-amber-600 text-white shadow'
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                  }`}
                >
                  berbeda panjang
                </button>
              </div>

              <span>meskipun jumlah bagiannya berbeda.</span>
            </div>

            {/* Check Button & Feedback */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-1">
              <span className="text-[11px] text-stone-400">
                Pilih kata yang benar pada kotak hijau di atas.
              </span>

              <button
                onClick={handleVerifyReasoning}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-heading font-black text-xs sm:text-sm bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-amber-950 shadow-md active:scale-95 transition-all cursor-pointer"
                style={{ minHeight: '44px' }}
              >
                Periksa Alasan Pembuktian
              </button>
            </div>

            {reasonFeedback && (
              <div
                className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                  clozeEquiv === 'senilai' && clozeLength === 'sama'
                    ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-500/50'
                    : 'bg-amber-950/80 text-amber-200 border border-amber-500/50'
                }`}
              >
                {clozeEquiv === 'senilai' && clozeLength === 'sama' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                )}
                <span>{reasonFeedback}</span>
              </div>
            )}
          </motion.div>
        )}

        {/* LANGKAH 5: KESIMPULAN EMAS & TOMBOL BANGUN JEMBATAN */}
        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-gradient-to-r from-emerald-950 via-stone-900 to-amber-950 p-4 rounded-xl border-2 border-amber-400 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center font-heading font-black text-xl shadow-lg shrink-0">
                ✓
              </div>
              <div>
                <div className="flex items-center gap-2 font-heading font-black text-sm sm:text-base text-amber-300">
                  <MathFraction num={fractionA.num} den={fractionA.den} size="sm" />
                  <span>=</span>
                  <MathFraction num={fractionB.num} den={fractionB.den} size="sm" />
                  <span className="text-white text-xs sm:text-sm font-bold ml-1">Kedua pecahan ini senilai!</span>
                </div>
                <p className="text-xs text-stone-300 mt-0.5">
                  Bukti visual terbukti kuat! Sekarang ayo pasang papan kayu di jembatan penghubung Pulau A ke Pulau B.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playSuccess();
                onCompleteDiscovery();
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-heading font-black text-sm uppercase tracking-wide bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 text-amber-950 shadow-[0_4px_25px_rgba(251,191,36,0.6)] flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer animate-pulse shrink-0"
              style={{ minHeight: '52px' }}
            >
              <span>Mulai Pasang Papan Jembatan</span>
              <Hammer className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
