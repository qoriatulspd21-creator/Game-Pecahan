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
  Award,
  Play,
  ArrowLeft,
  HelpCircle,
} from 'lucide-react';
import { sound } from '../utils/sound';
import { MathFraction } from './MathFraction';

interface ConceptDiscoveryProps {
  onBackToHome: () => void;
  onStartAdventure: () => void;
  onOpenLab: () => void;
}

type StageType = 'intro' | 'split' | 'question_change' | 'overlay' | 'reasoning' | 'conclusion';

export const ConceptDiscovery: React.FC<ConceptDiscoveryProps> = ({
  onBackToHome,
  onStartAdventure,
  onOpenLab,
}) => {
  // Main stage flow
  const [stage, setStage] = useState<StageType>('intro');

  // Step 1 & 2: Split state
  const [isSplit, setIsSplit] = useState<boolean>(false);
  const [isSlicingAnim, setIsSlicingAnim] = useState<boolean>(false);

  // Step 5: What changed question
  const [selectedChange, setSelectedChange] = useState<string | null>(null);
  const [changeFeedback, setChangeFeedback] = useState<string | null>(null);

  // Step 6 & 7: Overlay state
  const [isOverlaid, setIsOverlaid] = useState<boolean>(false);

  // Step 8: Relation symbol (<, =, >)
  const [relationSymbol, setRelationSymbol] = useState<'<' | '=' | '>' | null>(null);
  const [relationFeedback, setRelationFeedback] = useState<string | null>(null);

  // Step 9: Reasoning cloze blanks
  const [clozeEquiv, setClozeEquiv] = useState<'senilai' | 'berbeda' | null>(null);
  const [clozeLength, setClozeLength] = useState<'sama' | 'berbeda' | null>(null);
  const [reasonFeedback, setReasonFeedback] = useState<string | null>(null);

  // Handle Split Button Click
  const handleSplit = () => {
    sound.playSlice();
    setIsSlicingAnim(true);
    setTimeout(() => {
      setIsSlicingAnim(false);
      setIsSplit(true);
      setStage('question_change');
    }, 900);
  };

  // Handle question "Apa yang berubah?"
  const handleAnswerChange = (ans: 'parts' | 'green_len' | 'total_len') => {
    setSelectedChange(ans);
    if (ans === 'parts') {
      sound.playSuccess();
      setChangeFeedback('Benar sekali! Yang berubah adalah jumlah bagiannya (dari 2 bagian menjadi 4 bagian). Panjang daerah hijaunya tetap sama persis!');
    } else if (ans === 'green_len') {
      sound.playHint();
      setChangeFeedback('Coba perhatikan baik-baik: panjang daerah hijau tidak bertambah atau berkurang, panjangnya tetap sama persis! Yang berubah adalah jumlah potongannya.');
    } else {
      sound.playHint();
      setChangeFeedback('Coba amati kembali: panjang seluruh batang dari ujung kiri ke kanan tetap 1 batang utuh yang sama panjang! Yang berubah adalah jumlah potongannya.');
    }
  };

  // Handle relation symbol (<, =, >)
  const handleSelectRelation = (sym: '<' | '=' | '>') => {
    setRelationSymbol(sym);
    if (sym === '=') {
      sound.playSuccess();
      setRelationFeedback('Tepat sekali! Panjang bagian hijau pada kedua batang sama panjang!');
    } else if (sym === '<') {
      sound.playHint();
      setRelationFeedback('Perhatikan garis batas hijaunya saat ditumpuk: bagian hijau batang 1/2 tidak lebih pendek dari 2/4. Keduanya tepat sejajar!');
    } else {
      sound.playHint();
      setRelationFeedback('Perhatikan garis batas hijaunya saat ditumpuk: bagian hijau batang 1/2 tidak lebih panjang dari 2/4. Keduanya tepat sejajar!');
    }
  };

  // Handle Reasoning Verification
  const handleVerifyReasoning = () => {
    if (!clozeEquiv || !clozeLength) {
      sound.playHint();
      setReasonFeedback('Lengkapi kedua pilihan kata pada kalimat alasan di bawah ini!');
      return;
    }

    if (clozeEquiv === 'senilai' && clozeLength === 'sama') {
      sound.playVictory();
      setReasonFeedback(null);
      setStage('conclusion');
    } else {
      sound.playHint();
      setReasonFeedback('Coba cek lagi: apakah luasnya sama panjang? Jika luasnya sama panjang, maka kedua pecahan disebut senilai.');
    }
  };

  // Reset discovery tutorial
  const handleReset = () => {
    sound.playClick();
    setStage('intro');
    setIsSplit(false);
    setIsSlicingAnim(false);
    setSelectedChange(null);
    setChangeFeedback(null);
    setIsOverlaid(false);
    setRelationSymbol(null);
    setRelationFeedback(null);
    setClozeEquiv(null);
    setClozeLength(null);
    setReasonFeedback(null);
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 flex flex-col items-center justify-start overflow-y-auto select-none font-sans text-slate-100 pb-12">
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full px-4 sm:px-6 py-2.5 bg-stone-950/95 backdrop-blur-md border-b border-amber-900/60 flex items-center justify-between shadow-xl">
        <button
          onClick={() => {
            sound.playClick();
            onBackToHome();
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-white/20 font-heading font-bold text-xs sm:text-sm active:scale-95 transition-all cursor-pointer shadow"
          style={{ minHeight: '44px' }}
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>Menu Utama</span>
        </button>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="font-heading font-black text-sm sm:text-base text-amber-300">
              TAHAP PENEMUAN KONSEP
            </span>
            <span className="text-[10px] sm:text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2.5 py-0.5 rounded-full font-bold">
              Eksperimen Murid
            </span>
          </div>
          <p className="text-[10px] sm:text-xs text-amber-200/80">
            Temukan bukti mengapa <MathFraction num={1} den={2} size="2xs" /> senilai dengan <MathFraction num={2} den={4} size="2xs" /> melalui eksperimen langsung!
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-400/30 font-heading font-bold text-xs sm:text-sm active:scale-95 transition-all cursor-pointer shadow"
          style={{ minHeight: '44px' }}
          title="Ulangi Eksperimen Penemuan Konsep"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">Ulangi</span>
        </button>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-4xl px-3 sm:px-4 mt-4 flex flex-col gap-4">
        {/* Kiko Guide Dialogue Card */}
        <div className="w-full bg-stone-900/90 rounded-2xl border-2 border-amber-700/60 p-3 sm:p-4 shadow-xl flex items-center gap-3 sm:gap-4 relative overflow-hidden">
          <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 relative">
            <img
              src={
                stage === 'conclusion'
                  ? '/assets/kiko_celebrate.png'
                  : stage === 'question_change' && selectedChange === 'parts'
                  ? '/assets/kiko_celebrate.png'
                  : stage === 'overlay' && relationSymbol === '='
                  ? '/assets/kiko_celebrate.png'
                  : '/assets/kiko_welcome.png'
              }
              alt="Kiko Robot Penjelajah Dayak"
              className="w-full h-full object-contain filter drop-shadow-md"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 font-heading font-black text-xs shadow-sm">
                KIKO
              </span>
              <span className="text-[11px] text-amber-300 font-semibold">
                Robot Penjelajah Dayak
              </span>
            </div>

            <p className="text-xs sm:text-sm text-stone-100 font-medium leading-relaxed">
              {stage === 'intro' && (
                <>
                  "Halo, Penjelajah! Lihat batang pecahan di bawah ini. Satu batang dibagi menjadi 2 bagian sama besar, dan 1 bagian berwarna hijau (<MathFraction num={1} den={2} size="2xs" />).
                  <br />
                  <strong className="text-amber-300">
                    Bagaimana kalau setiap bagian kita belah menjadi dua? Apakah bagian hijaunya berubah?
                  </strong>"
                </>
              )}

              {stage === 'question_change' && (
                <>
                  "Perhatikan batang yang baru saja dibelah!
                  <br />
                  <strong className="text-amber-300">
                    Menurutmu, apa yang berubah setelah batang dibelah?
                  </strong>"
                </>
              )}

              {stage === 'overlay' && (
                <>
                  "Sekarang kita punya dua batang: batang <MathFraction num={1} den={2} size="2xs" /> dan batang <MathFraction num={2} den={4} size="2xs" />.
                  <br />
                  Sentuh tombol <strong className="text-emerald-400">TUMPUK (OVERLAY)</strong> untuk menumpuk keduanya, lalu amati:
                  <strong className="text-amber-300"> Apakah bagian hijau pada kedua batang sama panjang?</strong>"
                </>
              )}

              {stage === 'reasoning' && (
                <>
                  "Hebat! Kamu sudah melihat sendiri bahwa kedua bagian hijau sama panjang.
                  <br />
                  Sekarang, <strong className="text-amber-300">lengkapi kesimpulan alasan matematisnya</strong> di bawah ini agar jembatan pembuktian siap dibangun!"
                </>
              )}

              {stage === 'conclusion' && (
                <>
                  "Hore! Kesimpulanmu sempurna!
                  <br />
                  <strong className="text-emerald-300">
                    <MathFraction num={1} den={2} size="2xs" /> = <MathFraction num={2} den={4} size="2xs" />. Kedua pecahan ini TERBUKTI SENILAI!
                  </strong>
                  <br />
                  Sekarang, mari kita terapkan pembuktian ini untuk menyambungkan jembatan di FRACTERRA!"
                </>
              )}
            </p>
          </div>
        </div>

        {/* SECTION 1: THE SINGLE INTERACTIVE SVG FRACTION BAR (Step 1, 2, 3) */}
        {(stage === 'intro' || stage === 'question_change') && (
          <div className="w-full bg-stone-900/95 rounded-2xl border-2 border-emerald-500/50 p-4 sm:p-5 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-heading font-black text-xs sm:text-sm text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>
                  {isSplit ? 'Model Batang Setelah Dibelah (Menjadi 4 Bagian)' : 'Model Batang Pecahan 1/2 Awal (2 Bagian)'}
                </span>
              </span>
              <span className="text-[11px] bg-stone-800 text-amber-300 px-2.5 py-0.5 rounded-lg border border-amber-500/30 font-bold">
                Panjang Total = 1 Unit Utuh
              </span>
            </div>

            {/* Mathematically Precise SVG Fraction Bar */}
            <div className="relative w-full aspect-[6/1] min-h-[60px] sm:min-h-[76px] rounded-xl overflow-hidden border-2 border-amber-900 shadow-inner bg-stone-950">
              <svg viewBox="0 0 600 70" preserveAspectRatio="none" className="w-full h-full">
                <defs>
                  {/* Green Area Gradient */}
                  <linearGradient id="greenGradDiscovery" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  {/* Wood Area Gradient */}
                  <linearGradient id="woodGradDiscovery" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#fef3c7" />
                    <stop offset="100%" stopColor="#fde68a" />
                  </linearGradient>
                </defs>

                {!isSplit ? (
                  /* Original 1/2: 2 parts of 300px each */
                  <g>
                    {/* Part 1 (Left 50%): Green 1/2 */}
                    <rect x="0" y="0" width="300" height="70" fill="url(#greenGradDiscovery)" />
                    {/* Part 2 (Right 50%): Wood 1/2 */}
                    <rect x="300" y="0" width="300" height="70" fill="url(#woodGradDiscovery)" />

                    {/* Boundary line between parts */}
                    <line x1="300" y1="0" x2="300" y2="70" stroke="#064e3b" strokeWidth="3" />
                  </g>
                ) : (
                  /* Sliced 2/4: 4 parts of 150px each (Total green is still 300px!) */
                  <g>
                    {/* Part 1: Green 1/4 (0 - 150) */}
                    <rect x="0" y="0" width="150" height="70" fill="url(#greenGradDiscovery)" />
                    <line x1="150" y1="0" x2="150" y2="70" stroke="#047857" strokeWidth="2" strokeDasharray="3 3" />

                    {/* Part 2: Green 1/4 (150 - 300) */}
                    <rect x="150" y="0" width="150" height="70" fill="url(#greenGradDiscovery)" />
                    <line x1="300" y1="0" x2="300" y2="70" stroke="#064e3b" strokeWidth="4" />

                    {/* Part 3: Wood 1/4 (300 - 450) */}
                    <rect x="300" y="0" width="150" height="70" fill="url(#woodGradDiscovery)" />
                    <line x1="450" y1="0" x2="450" y2="70" stroke="#d97706" strokeWidth="2" strokeDasharray="3 3" />

                    {/* Part 4: Wood 1/4 (450 - 600) */}
                    <rect x="450" y="0" width="150" height="70" fill="url(#woodGradDiscovery)" />
                  </g>
                )}

                {/* Outer frame */}
                <rect x="0" y="0" width="600" height="70" fill="none" stroke="#78350f" strokeWidth="3" rx="8" />
              </svg>

              {/* Fractional Badges Overlay inside the SVG Bar */}
              <div className="absolute inset-0 flex items-center pointer-events-none">
                {!isSplit ? (
                  <>
                    <div className="w-1/2 flex flex-col items-center justify-center text-white drop-shadow">
                      <MathFraction num={1} den={2} size="base" />
                      <span className="text-[10px] text-emerald-100 font-bold mt-0.5">Hijau (1 bagian)</span>
                    </div>
                    <div className="w-1/2 flex flex-col items-center justify-center text-amber-950">
                      <MathFraction num={1} den={2} size="base" />
                      <span className="text-[10px] text-amber-800 font-bold mt-0.5">Kayu (1 bagian)</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-1/4 flex flex-col items-center justify-center text-white drop-shadow">
                      <MathFraction num={1} den={4} size="sm" />
                    </div>
                    <div className="w-1/4 flex flex-col items-center justify-center text-white drop-shadow">
                      <MathFraction num={1} den={4} size="sm" />
                    </div>
                    <div className="w-1/4 flex flex-col items-center justify-center text-amber-950">
                      <MathFraction num={1} den={4} size="sm" />
                    </div>
                    <div className="w-1/4 flex flex-col items-center justify-center text-amber-950">
                      <MathFraction num={1} den={4} size="sm" />
                    </div>
                  </>
                )}
              </div>

              {/* Slicing Animation Effect */}
              {isSlicingAnim && (
                <>
                  <motion.div
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute left-[25%] top-0 bottom-0 w-2 bg-amber-300 shadow-[0_0_20px_#fde047] z-30 pointer-events-none"
                  />
                  <motion.div
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute left-[75%] top-0 bottom-0 w-2 bg-amber-300 shadow-[0_0_20px_#fde047] z-30 pointer-events-none"
                  />
                </>
              )}
            </div>

            {/* Split Action Button or Next Action */}
            {!isSplit ? (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <span className="text-xs text-stone-300">
                  Sentuh tombol di kanan untuk membelah setiap bagian menjadi 2 bagian sama besar:
                </span>

                <button
                  onClick={handleSplit}
                  disabled={isSlicingAnim}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 text-amber-950 font-heading font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(245,158,11,0.6)] active:scale-95 transition-all cursor-pointer"
                  style={{ minHeight: '56px', minWidth: '220px' }}
                >
                  <Scissors className="w-5 h-5" />
                  <span>BELAH MENJADI DUA (SPLIT)</span>
                </button>
              </div>
            ) : (
              /* Question: Apa yang berubah? (Step 5) */
              <div className="flex flex-col gap-3 pt-2 border-t border-white/10">
                <span className="font-heading font-bold text-xs sm:text-sm text-amber-300">
                  Pertanyaan Kiko: Apa yang berubah setelah batang dibelah?
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                  <button
                    onClick={() => handleAnswerChange('parts')}
                    className={`p-3 rounded-xl border font-heading font-bold text-xs sm:text-sm flex items-center justify-center text-center transition-all cursor-pointer active:scale-95 ${
                      selectedChange === 'parts'
                        ? 'bg-emerald-500 text-white border-emerald-300 ring-2 ring-emerald-400 shadow-lg'
                        : 'bg-stone-800 text-stone-200 border-white/10 hover:bg-stone-700'
                    }`}
                    style={{ minHeight: '56px' }}
                  >
                    <span>Jumlah bagiannya.</span>
                  </button>

                  <button
                    onClick={() => handleAnswerChange('green_len')}
                    className={`p-3 rounded-xl border font-heading font-bold text-xs sm:text-sm flex items-center justify-center text-center transition-all cursor-pointer active:scale-95 ${
                      selectedChange === 'green_len'
                        ? 'bg-amber-600 text-white border-amber-300 ring-2 ring-amber-400'
                        : 'bg-stone-800 text-stone-200 border-white/10 hover:bg-stone-700'
                    }`}
                    style={{ minHeight: '56px' }}
                  >
                    <span>Panjang bagian hijaunya.</span>
                  </button>

                  <button
                    onClick={() => handleAnswerChange('total_len')}
                    className={`p-3 rounded-xl border font-heading font-bold text-xs sm:text-sm flex items-center justify-center text-center transition-all cursor-pointer active:scale-95 ${
                      selectedChange === 'total_len'
                        ? 'bg-amber-600 text-white border-amber-300 ring-2 ring-amber-400'
                        : 'bg-stone-800 text-stone-200 border-white/10 hover:bg-stone-700'
                    }`}
                    style={{ minHeight: '56px' }}
                  >
                    <span>Panjang seluruh batangnya.</span>
                  </button>
                </div>

                {changeFeedback && (
                  <div
                    className={`p-3 rounded-xl text-xs sm:text-sm flex items-start gap-2.5 ${
                      selectedChange === 'parts'
                        ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-500/50'
                        : 'bg-amber-950/80 text-amber-200 border border-amber-500/50'
                    }`}
                  >
                    {selectedChange === 'parts' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    )}
                    <span className="leading-relaxed">{changeFeedback}</span>
                  </div>
                )}

                {selectedChange === 'parts' && (
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => {
                        sound.playClick();
                        setStage('overlay');
                      }}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 text-white font-heading font-black text-sm flex items-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer"
                      style={{ minHeight: '52px' }}
                    >
                      <span>Lanjut: Eksperimen Menumpuk Batang</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* SECTION 2: DUA BATANG DENGAN TOMBOL OVERLAY (Step 6, 7, 8) */}
        {(stage === 'overlay' || stage === 'reasoning' || stage === 'conclusion') && (
          <div className="w-full bg-stone-900/95 rounded-2xl border-2 border-emerald-500/50 p-4 sm:p-5 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-heading font-black text-xs sm:text-sm text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Eksperimen Membandingkan Batang 1/2 dan 2/4</span>
              </span>

              {/* OVERLAY TOGGLE BUTTON */}
              <button
                onClick={() => {
                  sound.playClick();
                  setIsOverlaid(!isOverlaid);
                }}
                className={`px-4 py-2 rounded-xl font-heading font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow active:scale-95 ${
                  isOverlaid
                    ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-300'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
                style={{ minHeight: '48px' }}
              >
                <Layers className="w-4 h-4" />
                <span>{isOverlaid ? 'PISAHKAN KEMBALI' : 'TUMPUK (OVERLAY)'}</span>
              </button>
            </div>

            {/* Visual Bars Container: Relative stacking area */}
            <div className="relative flex flex-col gap-3 py-2">
              {/* Batang 1: 1/2 */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs font-bold text-amber-200">
                  <span className="inline-flex items-center gap-1.5">
                    <span>Batang 1:</span>
                    <MathFraction num={1} den={2} size="xs" />
                    <span className="text-stone-300 font-normal">(1 dari 2 bagian hijau)</span>
                  </span>
                  <span className="text-[11px] text-stone-400">Panjang hijau = 50%</span>
                </div>

                <div className="w-full aspect-[6/1] min-h-[52px] sm:min-h-[64px] rounded-xl overflow-hidden border-2 border-amber-900 shadow-inner bg-stone-950 relative">
                  <svg viewBox="0 0 600 70" preserveAspectRatio="none" className="w-full h-full">
                    <rect x="0" y="0" width="300" height="70" fill="url(#greenGradDiscovery)" />
                    <rect x="300" y="0" width="300" height="70" fill="url(#woodGradDiscovery)" />
                    <line x1="300" y1="0" x2="300" y2="70" stroke="#064e3b" strokeWidth="3" />
                    <rect x="0" y="0" width="600" height="70" fill="none" stroke="#78350f" strokeWidth="3" rx="8" />
                  </svg>
                  <div className="absolute inset-0 flex items-center pointer-events-none">
                    <div className="w-1/2 flex items-center justify-center text-white drop-shadow">
                      <MathFraction num={1} den={2} size="sm" />
                    </div>
                    <div className="w-1/2 flex items-center justify-center text-amber-950">
                      <MathFraction num={1} den={2} size="sm" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Batang 2: 2/4 (Animates up when overlaid!) */}
              <motion.div
                animate={{
                  y: isOverlaid ? -70 : 0,
                  opacity: isOverlaid ? 0.88 : 1,
                }}
                transition={{ type: 'spring', damping: 20, stiffness: 180 }}
                className="flex flex-col gap-1 relative z-10"
              >
                <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
                  <span className="inline-flex items-center gap-1.5">
                    <span>Batang 2:</span>
                    <MathFraction num={2} den={4} size="xs" />
                    <span className="text-stone-300 font-normal">(2 dari 4 bagian hijau)</span>
                  </span>
                  <span className="text-[11px] text-stone-400">Panjang hijau = 25% + 25% = 50%</span>
                </div>

                <div className="w-full aspect-[6/1] min-h-[52px] sm:min-h-[64px] rounded-xl overflow-hidden border-2 border-emerald-500 shadow-inner bg-stone-950 relative">
                  <svg viewBox="0 0 600 70" preserveAspectRatio="none" className="w-full h-full">
                    <rect x="0" y="0" width="150" height="70" fill="url(#greenGradDiscovery)" />
                    <line x1="150" y1="0" x2="150" y2="70" stroke="#047857" strokeWidth="2" strokeDasharray="3 3" />
                    <rect x="150" y="0" width="150" height="70" fill="url(#greenGradDiscovery)" />
                    <line x1="300" y1="0" x2="300" y2="70" stroke="#064e3b" strokeWidth="4" />
                    <rect x="300" y="0" width="150" height="70" fill="url(#woodGradDiscovery)" />
                    <line x1="450" y1="0" x2="450" y2="70" stroke="#d97706" strokeWidth="2" strokeDasharray="3 3" />
                    <rect x="450" y="0" width="150" height="70" fill="url(#woodGradDiscovery)" />
                    <rect x="0" y="0" width="600" height="70" fill="none" stroke="#059669" strokeWidth="3" rx="8" />
                  </svg>
                  <div className="absolute inset-0 flex items-center pointer-events-none">
                    <div className="w-1/4 flex items-center justify-center text-white drop-shadow">
                      <MathFraction num={1} den={4} size="xs" />
                    </div>
                    <div className="w-1/4 flex items-center justify-center text-white drop-shadow">
                      <MathFraction num={1} den={4} size="xs" />
                    </div>
                    <div className="w-1/4 flex items-center justify-center text-amber-950">
                      <MathFraction num={1} den={4} size="xs" />
                    </div>
                    <div className="w-1/4 flex items-center justify-center text-amber-950">
                      <MathFraction num={1} den={4} size="xs" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Vertical Laser Alignment Line Indicator showing exact same 50% line */}
              <div className="absolute left-[50%] top-6 bottom-0 w-0.5 border-l-2 border-dashed border-amber-300 pointer-events-none z-20">
                <span className="absolute -top-3 left-1 text-[9px] font-black bg-amber-400 text-amber-950 px-1 rounded shadow whitespace-nowrap">
                  Garis Batas Hijau (50%) Tepat Sama!
                </span>
              </div>
            </div>

            {/* Step 7 & 8: Relation Question (<, =, >) */}
            <div className="flex flex-col gap-3 pt-2 border-t border-white/10">
              <span className="font-heading font-bold text-xs sm:text-sm text-amber-300 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" />
                <span>Pertanyaan: Apakah bagian hijau pada kedua batang sama panjang?</span>
              </span>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <button
                  onClick={() => handleSelectRelation('<')}
                  className={`p-3 rounded-xl border font-heading font-black text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 ${
                    relationSymbol === '<'
                      ? 'bg-amber-600 text-white border-amber-300'
                      : 'bg-stone-800 text-stone-200 border-white/10 hover:bg-stone-700'
                  }`}
                  style={{ minHeight: '56px' }}
                >
                  <span className="text-xl">&lt;</span>
                  <span className="text-xs font-bold">(Lebih Pendek)</span>
                </button>

                <button
                  onClick={() => handleSelectRelation('=')}
                  className={`p-3 rounded-xl border font-heading font-black text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 ${
                    relationSymbol === '='
                      ? 'bg-emerald-500 text-white border-emerald-300 ring-2 ring-emerald-400 shadow-xl'
                      : 'bg-stone-800 text-stone-200 border-white/10 hover:bg-stone-700'
                  }`}
                  style={{ minHeight: '56px' }}
                >
                  <span className="text-2xl text-amber-300">=</span>
                  <span className="text-xs font-bold">(Sama Panjang)</span>
                </button>

                <button
                  onClick={() => handleSelectRelation('>')}
                  className={`p-3 rounded-xl border font-heading font-black text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 ${
                    relationSymbol === '>'
                      ? 'bg-amber-600 text-white border-amber-300'
                      : 'bg-stone-800 text-stone-200 border-white/10 hover:bg-stone-700'
                  }`}
                  style={{ minHeight: '56px' }}
                >
                  <span className="text-xl">&gt;</span>
                  <span className="text-xs font-bold">(Lebih Panjang)</span>
                </button>
              </div>

              {relationFeedback && (
                <div
                  className={`p-3 rounded-xl text-xs sm:text-sm flex items-start gap-2.5 ${
                    relationSymbol === '='
                      ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-500/50'
                      : 'bg-amber-950/80 text-amber-200 border border-amber-500/50'
                  }`}
                >
                  {relationSymbol === '=' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <span className="leading-relaxed">{relationFeedback}</span>
                </div>
              )}

              {/* Step 9: Reasoning cloze sentence */}
              {relationSymbol === '=' && (
                <div className="flex flex-col gap-3 pt-3 border-t border-white/10">
                  <span className="font-heading font-bold text-xs sm:text-sm text-amber-300">
                    Langkah Terakhir: Lengkapi Alasan Penemuan Konsep:
                  </span>

                  <div className="p-3.5 bg-stone-950/80 rounded-xl border border-white/15 text-xs sm:text-sm leading-relaxed flex flex-wrap items-center gap-2">
                    <span>Kedua pecahan</span>

                    {/* Blank 1: senilai / berbeda nilai */}
                    <div className="inline-flex gap-1">
                      <button
                        onClick={() => {
                          sound.playClick();
                          setClozeEquiv('senilai');
                        }}
                        className={`px-3 py-1.5 rounded-lg font-heading font-bold text-xs transition-all cursor-pointer ${
                          clozeEquiv === 'senilai'
                            ? 'bg-emerald-500 text-white ring-2 ring-emerald-300'
                            : 'bg-stone-800 text-stone-300 hover:bg-stone-700 border border-white/10'
                        }`}
                      >
                        senilai
                      </button>
                      <button
                        onClick={() => {
                          sound.playClick();
                          setClozeEquiv('berbeda');
                        }}
                        className={`px-3 py-1.5 rounded-lg font-heading font-bold text-xs transition-all cursor-pointer ${
                          clozeEquiv === 'berbeda'
                            ? 'bg-amber-700 text-white ring-2 ring-amber-400'
                            : 'bg-stone-800 text-stone-300 hover:bg-stone-700 border border-white/10'
                        }`}
                      >
                        tidak senilai
                      </button>
                    </div>

                    <span>karena bagian yang diwarnai</span>

                    {/* Blank 2: sama panjang / berbeda panjang */}
                    <div className="inline-flex gap-1">
                      <button
                        onClick={() => {
                          sound.playClick();
                          setClozeLength('sama');
                        }}
                        className={`px-3 py-1.5 rounded-lg font-heading font-bold text-xs transition-all cursor-pointer ${
                          clozeLength === 'sama'
                            ? 'bg-emerald-500 text-white ring-2 ring-emerald-300'
                            : 'bg-stone-800 text-stone-300 hover:bg-stone-700 border border-white/10'
                        }`}
                      >
                        sama panjang (luasnya sama)
                      </button>
                      <button
                        onClick={() => {
                          sound.playClick();
                          setClozeLength('berbeda');
                        }}
                        className={`px-3 py-1.5 rounded-lg font-heading font-bold text-xs transition-all cursor-pointer ${
                          clozeLength === 'berbeda'
                            ? 'bg-amber-700 text-white ring-2 ring-amber-400'
                            : 'bg-stone-800 text-stone-300 hover:bg-stone-700 border border-white/10'
                        }`}
                      >
                        berbeda panjang
                      </button>
                    </div>

                    <span>meskipun jumlah bagiannya berbeda.</span>
                  </div>

                  {reasonFeedback && (
                    <div className="p-3 bg-amber-950/80 text-amber-200 border border-amber-500/50 rounded-xl text-xs sm:text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{reasonFeedback}</span>
                    </div>
                  )}

                  {stage !== 'conclusion' && (
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={handleVerifyReasoning}
                        className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 text-amber-950 font-heading font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(245,158,11,0.6)] active:scale-95 transition-all cursor-pointer"
                        style={{ minHeight: '56px' }}
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        <span>UJI KESIMPULAN KONSEP</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SECTION 3: CONCLUSION & GATEWAY TO BRIDGE (Step 10 & 11) */}
        {stage === 'conclusion' && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full bg-gradient-to-b from-stone-900 to-emerald-950/90 rounded-2xl border-2 border-emerald-400 p-5 sm:p-6 shadow-[0_0_35px_rgba(16,185,129,0.3)] flex flex-col gap-4 text-center items-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center shadow-lg">
              <Award className="w-8 h-8" />
            </div>

            <div className="flex flex-col gap-1 items-center">
              <span className="font-heading font-black text-lg sm:text-xl text-amber-300 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>KESIMPULAN TERBUKTI!</span>
                <Sparkles className="w-5 h-5 text-amber-400" />
              </span>

              <div className="mt-2 inline-flex items-center gap-3 bg-stone-950/90 px-6 py-3 rounded-2xl border border-amber-400/50 shadow-inner">
                <MathFraction num={1} den={2} size="xl" className="text-emerald-400" />
                <span className="font-heading font-black text-3xl text-amber-400">=</span>
                <MathFraction num={2} den={4} size="xl" className="text-emerald-400" />
              </div>

              <p className="mt-2 text-sm sm:text-base font-heading font-bold text-emerald-200">
                "Kedua pecahan ini adalah <strong className="text-white underline decoration-amber-400">PECAHAN SENILAI</strong>!"
              </p>

              <p className="text-xs sm:text-sm text-stone-300 max-w-lg mt-1 leading-relaxed">
                Karena keduanya mewakili luas dan panjang bagian yang sama besar dari satu kesatuan utuh, meskipun jumlah bagian pembaginya berbeda.
              </p>
            </div>

            {/* Navigation Buttons to Bridge and Lab */}
            <div className="w-full max-w-md grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <button
                onClick={() => {
                  sound.playStart();
                  onStartAdventure();
                }}
                className="w-full p-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-amber-950 font-heading font-black text-sm flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(245,158,11,0.6)] active:scale-95 transition-all cursor-pointer"
                style={{ minHeight: '56px' }}
              >
                <Play className="w-5 h-5 fill-current" />
                <span>BANGUN JEMBATAN SEKARANG</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onOpenLab();
                }}
                className="w-full p-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-emerald-300 border border-emerald-400/40 font-heading font-black text-sm flex items-center justify-center gap-2 shadow active:scale-95 transition-all cursor-pointer"
                style={{ minHeight: '56px' }}
              >
                <span>LABORATORIUM BEBAS</span>
              </button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};
