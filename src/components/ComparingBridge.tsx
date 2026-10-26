import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Layers,
  Sparkles,
  Hammer,
  RotateCcw,
  Sliders,
  HelpCircle,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Award,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Check,
} from 'lucide-react';
import { sound } from '../utils/sound';
import { MathFraction } from './MathFraction';
import { IslandLandscape } from './IslandLandscape';

interface ComparingBridgeProps {
  onBackToHome: () => void;
  onSwitchToEquivalent: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenGuide: () => void;
}

interface ComparingPreset {
  id: string;
  numA: number;
  denA: number;
  numB: number;
  denB: number;
  label: string;
}

const PRESETS: ComparingPreset[] = [
  { id: 'c1', numA: 1, denA: 2, numB: 3, denB: 4, label: '1/2 vs 3/4' },
  { id: 'c2', numA: 2, denA: 5, numB: 4, denB: 5, label: '2/5 vs 4/5' },
  { id: 'c3', numA: 2, denA: 3, numB: 1, denB: 2, label: '2/3 vs 1/2' },
  { id: 'c4', numA: 3, denA: 8, numB: 5, denB: 8, label: '3/8 vs 5/8' },
  { id: 'c5', numA: 1, denA: 3, numB: 1, denB: 4, label: '1/3 vs 1/4' },
];

export const ComparingBridge: React.FC<ComparingBridgeProps> = ({
  onBackToHome,
  onSwitchToEquivalent,
  isMuted,
  onToggleMute,
  isFullscreen,
  onToggleFullscreen,
  onOpenGuide,
}) => {
  // Fraction A and Fraction B
  const [numA, setNumA] = useState<number>(1);
  const [denA, setDenA] = useState<number>(2);

  const [numB, setNumB] = useState<number>(3);
  const [denB, setDenB] = useState<number>(4);

  // User's selected comparison symbol: '<' | '=' | '>'
  const [chosenSymbol, setChosenSymbol] = useState<'<' | '=' | '>' | null>(null);

  // Pedagogical flow:
  // 1. Input numbers
  // 2. Test in overlay (compare lengths visually)
  // 3. Choose symbol & Build bridge (Kiko crosses if correct, or falls with balloon rescue if wrong!)
  const [isOverlayActive, setIsOverlayActive] = useState<boolean>(false);
  const [isBuilding, setIsBuilding] = useState<boolean>(false);
  const [isBuilt, setIsBuilt] = useState<boolean>(false);
  const [kikoState, setKikoState] = useState<'idle' | 'walking' | 'falling' | 'floating' | 'crossed'>('idle');

  // Mathematical comparison
  const valA = numA / denA;
  const valB = numB / denB;
  const trueSymbol: '<' | '=' | '>' =
    Math.abs(valA - valB) < 0.0001 ? '=' : valA < valB ? '<' : '>';
  const isCorrect = chosenSymbol === trueSymbol;

  // Percentage widths (relative to total canyon bridge length)
  const pctA = Math.min(100, Math.max(0, (numA / denA) * 100));
  const pctB = Math.min(100, Math.max(0, (numB / denB) * 100));

  const handleNumChange = (
    target: 'A' | 'B',
    field: 'num' | 'den',
    delta: number
  ) => {
    sound.playClick();
    setIsBuilt(false);
    setKikoState('idle');
    setChosenSymbol(null);

    if (target === 'A') {
      if (field === 'num') {
        setNumA((prev) => Math.max(1, Math.min(denA, prev + delta)));
      } else {
        const newDen = Math.max(2, Math.min(12, denA + delta));
        setDenA(newDen);
        if (numA > newDen) setNumA(newDen);
      }
    } else {
      if (field === 'num') {
        setNumB((prev) => Math.max(1, Math.min(denB, prev + delta)));
      } else {
        const newDen = Math.max(2, Math.min(12, denB + delta));
        setDenB(newDen);
        if (numB > newDen) setNumB(newDen);
      }
    }
  };

  const handleSelectPreset = (p: ComparingPreset) => {
    sound.playClick();
    setNumA(p.numA);
    setDenA(p.denA);
    setNumB(p.numB);
    setDenB(p.denB);
    setIsBuilt(false);
    setKikoState('idle');
    setChosenSymbol(null);
    setIsOverlayActive(false);
  };

  const handleToggleOverlay = () => {
    sound.playClick();
    setIsOverlayActive(!isOverlayActive);
  };

  const handleSelectSymbol = (sym: '<' | '=' | '>') => {
    setChosenSymbol(sym);
    if (sym === trueSymbol) {
      sound.playSuccess();
    } else {
      sound.playError();
    }
  };

  // Build bridge and test!
  const handleBuildBridge = () => {
    sound.playHammer();
    setIsBuilding(true);

    setTimeout(() => {
      sound.playPlacePlank();
      setIsBuilding(false);
      setIsBuilt(true);

      // Kiko walks onto the bridge
      setTimeout(() => {
        sound.playBridgeWalk();
        setKikoState('walking');

        if (isCorrect) {
          // SUCCESS PATH
          setTimeout(() => {
            setKikoState('crossed');
            sound.playCelebration();
            confetti({
              particleCount: 75,
              spread: 85,
              origin: { y: 0.6 },
            });
          }, 2200);
        } else {
          // COMICAL EDUCATIONAL FALL PATH
          setTimeout(() => {
            sound.playError();
            setKikoState('falling');
            sound.playFall();

            // Emergency balloon rescue!
            setTimeout(() => {
              sound.playRescue();
              setKikoState('floating');

              // Float back safely to starting cliff
              setTimeout(() => {
                setKikoState('idle');
                setIsBuilt(false);
              }, 2100);
            }, 1100);
          }, 1100);
        }
      }, 500);
    }, 850);
  };

  const handleReset = () => {
    sound.playClick();
    setIsOverlayActive(false);
    setIsBuilding(false);
    setIsBuilt(false);
    setKikoState('idle');
    setChosenSymbol(null);
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start pb-10">
      {/* 1. TOP HEADER: Navigation, Mode Switcher, and Tools */}
      <header className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between border-b border-stone-800/80 bg-stone-950/80 backdrop-blur sticky top-0 z-40">
        {/* Left: Branding & Back Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              onBackToHome();
            }}
            className="px-2.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700/80 text-xs font-heading font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
            title="Kembali ke Menu Utama"
          >
            <span>🏠 Menu</span>
          </button>

          <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-stone-800">
            <span className="font-heading font-black text-amber-400 text-sm tracking-wide">
              FRACTERRA
            </span>
            <span className="text-[10px] text-amber-300 font-bold bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-500/40">
              Kelas IV SD
            </span>
          </div>
        </div>

        {/* Center: Clean Dedicated Mode Switcher */}
        <div className="flex items-center bg-stone-900 rounded-xl p-1 border border-stone-800 shadow-inner">
          <button
            onClick={() => {
              sound.playClick();
              onSwitchToEquivalent();
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-heading font-bold text-stone-200 hover:text-emerald-300 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>🌉 Pecahan Senilai</span>
          </button>
          <div className="px-3 py-1.5 rounded-lg text-xs font-heading font-black bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow flex items-center gap-1.5">
            <span>⚖️ Membandingkan Pecahan</span>
          </div>
        </div>

        {/* Right: Audio & Help */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              sound.playClick();
              onOpenGuide();
            }}
            className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-300 border border-stone-800 text-xs font-bold transition-all cursor-pointer"
            title="Buku Petunjuk"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
          </button>

          <button
            onClick={onToggleMute}
            className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 text-xs font-bold transition-all cursor-pointer"
            title={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-amber-400" />
            )}
          </button>

          <button
            onClick={onToggleFullscreen}
            className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 text-xs font-bold transition-all cursor-pointer hidden sm:block"
            title="Layar Penuh"
          >
            {isFullscreen ? (
              <Minimize className="w-4 h-4 text-amber-400" />
            ) : (
              <Maximize className="w-4 h-4 text-amber-400" />
            )}
          </button>

          <button
            onClick={handleReset}
            className="px-2.5 py-1.5 rounded-xl bg-stone-900 hover:bg-red-950/80 text-stone-300 hover:text-red-300 border border-stone-800 hover:border-red-600/50 text-xs font-heading font-bold transition-all cursor-pointer flex items-center gap-1"
            title="Ulangi"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Ulangi</span>
          </button>
        </div>
      </header>

      {/* 2. CANYON STAGE: Clean, Elevated directly on Island Plateaus with Flat Connected Planks */}
      <main className="w-full max-w-5xl px-3 sm:px-4 mt-3 flex flex-col items-center">
        <div className="relative w-full aspect-[16/9] max-h-[58vh] rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-900/50 bg-sky-950 select-none">
          {/* Natural Landscape Background */}
          <IslandLandscape bgImageUrl="/island_chasm_wide.jpg" />

          {/* Status Banner at Top of Canyon */}
          <div className="absolute top-2 inset-x-0 z-20 flex justify-center pointer-events-none px-2">
            <div className="bg-stone-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-stone-700/80 shadow-lg flex items-center gap-2.5 text-xs">
              <span className="font-heading font-bold text-amber-300 flex items-center gap-1">
                <span>Jembatan A:</span>
                <MathFraction num={numA} den={denA} size="xs" />
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400/70" />
              <span className="font-heading font-bold text-teal-300 flex items-center gap-1">
                <span>Jembatan B:</span>
                <MathFraction num={numB} den={denB} size="xs" />
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400/70" />
              {kikoState === 'crossed' ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Jembatan Selesai! Kiko Berhasil Menyeberang!
                </span>
              ) : kikoState === 'falling' || kikoState === 'floating' ? (
                <span className="text-red-400 font-bold flex items-center gap-1">
                  ⚠️ Perbandingan Belum Tepat, Kiko Terjatuh! 🎈
                </span>
              ) : isOverlayActive ? (
                chosenSymbol ? (
                  isCorrect ? (
                    <span className="text-emerald-300 font-bold flex items-center gap-1">
                      ✨ Jawaban Benar: {numA}/{denA} {trueSymbol} {numB}/{denB}! Klik Bangun Jembatan!
                    </span>
                  ) : (
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      ⚠️ Tanda dipilih belum pas (jika diseberangi, Kiko bisa jatuh!)
                    </span>
                  )
                ) : (
                  <span className="text-amber-300 font-bold">
                    Pilih tanda (&lt;, =, &gt;) yang sesuai panjang jembatan!
                  </span>
                )
              ) : (
                <span className="text-amber-200 font-medium">
                  Uji di overlay atau klik Bangun Jembatan untuk menguji perbandingan!
                </span>
              )}
            </div>
          </div>

          {/* KIKO CHARACTER & RESCUE BALLOON */}
          <motion.div
            className="absolute z-30 pointer-events-none"
            animate={
              kikoState === 'crossed'
                ? { left: '72%', top: '34%', rotate: 0, scale: 1 }
                : kikoState === 'walking'
                ? { left: isCorrect ? '72%' : '48%', top: '34%', rotate: [0, -3, 3, 0], scale: 1 }
                : kikoState === 'falling'
                ? { left: '48%', top: '75%', rotate: 45, scale: 0.85 }
                : kikoState === 'floating'
                ? { left: ['48%', '30%', '19%'], top: ['75%', '24%', '34%'], rotate: [25, -5, 0], scale: 1 }
                : { left: '19%', top: '34%', rotate: 0, scale: 1 }
            }
            transition={
              kikoState === 'crossed' || (kikoState === 'walking' && isCorrect)
                ? { duration: 2.2, ease: 'easeInOut' }
                : kikoState === 'walking' && !isCorrect
                ? { duration: 1.1, ease: 'easeOut' }
                : kikoState === 'falling'
                ? { duration: 0.75, ease: 'easeIn' }
                : kikoState === 'floating'
                ? { duration: 2.1, ease: 'easeInOut' }
                : { duration: 0.4 }
            }
          >
            <div className="relative flex flex-col items-center">
              {/* Emergency Rescue Balloon during floating state */}
              {kikoState === 'floating' && (
                <motion.div
                  initial={{ scale: 0, y: 15 }}
                  animate={{ scale: 1, y: 0 }}
                  className="flex flex-col items-center -mb-2"
                >
                  <span className="text-3xl filter drop-shadow-lg animate-bounce">🎈</span>
                  <div className="w-0.5 h-6 bg-stone-300 -mt-1 shadow" />
                </motion.div>
              )}

              {/* Speech Bubble above Kiko */}
              <div className="mb-1 bg-stone-950/95 text-white px-2.5 py-1 rounded-xl text-[10px] sm:text-xs font-heading font-bold border border-amber-400/80 shadow-xl max-w-[210px] text-center pointer-events-auto">
                {kikoState === 'crossed' ? (
                  <span className="text-amber-300 flex items-center justify-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>Hebat! Perbandinganmu Tepat!</span>
                  </span>
                ) : kikoState === 'walking' ? (
                  <span className="text-emerald-300">Menyeberangi jembatan...</span>
                ) : kikoState === 'falling' ? (
                  <span className="text-red-400 font-black animate-pulse">
                    Waaaaah! Bukan itu tandanya! 😱
                  </span>
                ) : kikoState === 'floating' ? (
                  <span className="text-amber-300 font-bold">
                    🎈 Belum tepat, lihat mana yang lebih panjang ya!
                  </span>
                ) : isBuilt && !isCorrect ? (
                  <span className="text-amber-300 font-bold">
                    Tanda belum tepat, Kiko hati-hati ya!
                  </span>
                ) : isOverlayActive && isCorrect ? (
                  <span className="text-emerald-300">Tepat sekali! Ayo seberangi jembatan!</span>
                ) : isOverlayActive ? (
                  <span className="text-amber-300">Lihat garis ujungnya, mana lebih panjang?</span>
                ) : (
                  <span className="text-amber-200">Klik "Ujicoba di Overlay" yuk!</span>
                )}
              </div>

              {/* Kiko Character Sprite */}
              <img
                src={
                  kikoState === 'crossed'
                    ? '/assets/kiko_celebrate.png'
                    : kikoState === 'falling' || kikoState === 'floating'
                    ? '/assets/kiko_hint.png'
                    : '/assets/kiko_welcome.png'
                }
                alt="Kiko Robot"
                className={`w-14 sm:w-16 md:w-20 h-14 sm:h-16 md:h-20 object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.85)] ${
                  kikoState === 'crossed' ? 'animate-bounce' : ''
                }`}
              />
            </div>
          </motion.div>

          {/* TWO PARALLEL BRIDGES ACROSS CANYON (Clean, flat, seamless, straight connected planks) */}
          <div
            className={`absolute left-[31.5%] right-[31.5%] top-[43.5%] z-20 flex flex-col gap-2.5 select-none transition-transform ${
              kikoState === 'falling' ? 'animate-pulse' : ''
            }`}
          >
            {/* JEMBATAN A - Jalur Atas Datar Lurus Menyambung */}
            <div className="relative w-full">
              <div className="flex items-center justify-between text-[10px] sm:text-xs font-heading font-black mb-1 px-1">
                <span className="text-amber-300 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded bg-amber-500 text-stone-950 flex items-center justify-center text-[9px] font-black">
                    A
                  </span>
                  <span>Jembatan A: {numA}/{denA}</span>
                </span>
              </div>

              {/* Flat, Seamless, Connected Wooden Bridge Track A */}
              <div className="relative w-full h-8 sm:h-9 bg-stone-950/90 rounded-md border-2 border-amber-800/80 shadow-lg flex overflow-hidden">
                {Array.from({ length: denA }).map((_, idx) => {
                  const isActiveSlice = idx < numA;
                  const isPlankVisible = isBuilt ? isActiveSlice : isOverlayActive && isActiveSlice;

                  return (
                    <div
                      key={idx}
                      className={`relative flex-1 h-full border-r last:border-r-0 border-amber-950/40 flex items-center justify-center transition-all ${
                        isPlankVisible
                          ? 'bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 shadow-inner'
                          : 'bg-stone-950/50'
                      }`}
                    >
                      {isPlankVisible && (
                        <div className="w-full h-full relative flex items-center justify-center px-0.5 overflow-hidden">
                          {/* Continuous horizontal wood grain shimmer */}
                          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-amber-300/30 pointer-events-none" />

                          {/* Level fraction label */}
                          <span className="relative z-10 text-[9px] sm:text-[10px] font-heading font-black text-amber-100 bg-stone-950/70 px-1 py-0.2 rounded shadow-sm border border-amber-500/30">
                            1/{denA}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Laser Guide for Bridge A */}
                {isOverlayActive && (
                  <div
                    style={{ left: `${pctA}%` }}
                    className="absolute top-0 bottom-0 w-1 bg-amber-300 shadow-[0_0_10px_rgba(251,191,36,1)] z-30 pointer-events-none"
                  />
                )}
              </div>
            </div>

            {/* JEMBATAN B - Jalur Bawah Datar Lurus Menyambung */}
            <div className="relative w-full">
              <div className="flex items-center justify-between text-[10px] sm:text-xs font-heading font-black mb-1 px-1">
                <span className="text-teal-300 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded bg-teal-500 text-stone-950 flex items-center justify-center text-[9px] font-black">
                    B
                  </span>
                  <span>Jembatan B: {numB}/{denB}</span>
                </span>
              </div>

              {/* Flat, Seamless, Connected Wooden Bridge Track B */}
              <div className="relative w-full h-8 sm:h-9 bg-stone-950/90 rounded-md border-2 border-teal-800/80 shadow-lg flex overflow-hidden">
                {Array.from({ length: denB }).map((_, idx) => {
                  const isActiveSlice = idx < numB;
                  const isPlankVisible = isBuilt ? isActiveSlice : isOverlayActive && isActiveSlice;

                  return (
                    <div
                      key={idx}
                      className={`relative flex-1 h-full border-r last:border-r-0 border-teal-950/40 flex items-center justify-center transition-all ${
                        isPlankVisible
                          ? 'bg-gradient-to-r from-teal-700 via-teal-600 to-teal-700 shadow-inner'
                          : 'bg-stone-950/50'
                      }`}
                    >
                      {isPlankVisible && (
                        <div className="w-full h-full relative flex items-center justify-center px-0.5 overflow-hidden">
                          {/* Continuous horizontal wood grain shimmer */}
                          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-teal-300/30 pointer-events-none" />

                          {/* Level fraction label */}
                          <span className="relative z-10 text-[9px] sm:text-[10px] font-heading font-black text-teal-100 bg-stone-950/70 px-1 py-0.2 rounded shadow-sm border border-teal-500/30">
                            1/{denB}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Laser Guide for Bridge B */}
                {isOverlayActive && (
                  <div
                    style={{ left: `${pctB}%` }}
                    className="absolute top-0 bottom-0 w-1 bg-teal-300 shadow-[0_0_10px_rgba(45,212,191,1)] z-30 pointer-events-none"
                  />
                )}
              </div>
            </div>

            {/* DIRECT LASER COMPARISON LINE */}
            {isOverlayActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 pointer-events-none z-30"
              >
                <div
                  style={{ left: `${pctA}%` }}
                  className="absolute top-0 bottom-0 w-1 bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)]"
                />
                <div
                  style={{ left: `${pctB}%` }}
                  className="absolute top-0 bottom-0 w-1 bg-teal-400 shadow-[0_0_12px_rgba(45,212,191,0.9)]"
                />
              </motion.div>
            )}
          </div>
        </div>

        {/* 3. CLEAN & TIDY CONTROL DECK */}
        <div className="w-full bg-stone-900/90 rounded-2xl border border-stone-800 p-3.5 sm:p-4 mt-3 shadow-xl flex flex-col gap-3.5">
          {/* Main 2-Card Input Grid: Fraction A & Fraction B */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Card Jembatan A */}
            <div className="bg-stone-950/80 rounded-xl p-3 border border-amber-700/50 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-heading font-black text-amber-300 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-amber-500 text-stone-950 flex items-center justify-center text-xs font-black">
                    A
                  </span>
                  <span>Jembatan A:</span>
                  <MathFraction num={numA} den={denA} size="xs" />
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* Pembilang A */}
                <div className="bg-stone-900 rounded-lg p-1.5 border border-stone-800 flex items-center justify-between">
                  <span className="text-[11px] text-amber-200 pl-1 font-bold">Pembilang:</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleNumChange('A', 'num', -1)}
                      className="w-7 h-7 rounded bg-stone-800 hover:bg-stone-700 text-amber-300 font-black text-xs active:scale-95 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-heading font-black text-white text-sm">
                      {numA}
                    </span>
                    <button
                      onClick={() => handleNumChange('A', 'num', 1)}
                      className="w-7 h-7 rounded bg-stone-800 hover:bg-stone-700 text-amber-300 font-black text-xs active:scale-95 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Penyebut A */}
                <div className="bg-stone-900 rounded-lg p-1.5 border border-stone-800 flex items-center justify-between">
                  <span className="text-[11px] text-amber-200 pl-1 font-bold">Penyebut:</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleNumChange('A', 'den', -1)}
                      className="w-7 h-7 rounded bg-stone-800 hover:bg-stone-700 text-amber-300 font-black text-xs active:scale-95 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-heading font-black text-white text-sm">
                      {denA}
                    </span>
                    <button
                      onClick={() => handleNumChange('A', 'den', 1)}
                      className="w-7 h-7 rounded bg-stone-800 hover:bg-stone-700 text-amber-300 font-black text-xs active:scale-95 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Jembatan B */}
            <div className="bg-stone-950/80 rounded-xl p-3 border border-teal-700/50 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-heading font-black text-teal-300 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-teal-500 text-stone-950 flex items-center justify-center text-xs font-black">
                    B
                  </span>
                  <span>Jembatan B:</span>
                  <MathFraction num={numB} den={denB} size="xs" />
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* Pembilang B */}
                <div className="bg-stone-900 rounded-lg p-1.5 border border-stone-800 flex items-center justify-between">
                  <span className="text-[11px] text-teal-200 pl-1 font-bold">Pembilang:</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleNumChange('B', 'num', -1)}
                      className="w-7 h-7 rounded bg-stone-800 hover:bg-stone-700 text-teal-300 font-black text-xs active:scale-95 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-heading font-black text-white text-sm">
                      {numB}
                    </span>
                    <button
                      onClick={() => handleNumChange('B', 'num', 1)}
                      className="w-7 h-7 rounded bg-stone-800 hover:bg-stone-700 text-teal-300 font-black text-xs active:scale-95 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Penyebut B */}
                <div className="bg-stone-900 rounded-lg p-1.5 border border-stone-800 flex items-center justify-between">
                  <span className="text-[11px] text-teal-200 pl-1 font-bold">Penyebut:</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleNumChange('B', 'den', -1)}
                      className="w-7 h-7 rounded bg-stone-800 hover:bg-stone-700 text-teal-300 font-black text-xs active:scale-95 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-heading font-black text-white text-sm">
                      {denB}
                    </span>
                    <button
                      onClick={() => handleNumChange('B', 'den', 1)}
                      className="w-7 h-7 rounded bg-stone-800 hover:bg-stone-700 text-teal-300 font-black text-xs active:scale-95 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Row: Symbol Picker (<, =, >) + Overlay + Build */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-3 pt-1 border-t border-stone-800/80">
            {/* Quick Examples Shortcut */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPreset(p)}
                  className="px-2 py-1 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-amber-200 text-[11px] font-heading font-bold border border-amber-500/30 transition-all cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Symbol Buttons: < , = , > */}
            <div className="flex items-center gap-2 bg-stone-950/70 p-1 rounded-xl border border-stone-800">
              <span className="text-xs font-heading font-black text-amber-300 px-2">Pilih Tanda:</span>
              {(['<', '=', '>'] as const).map((sym) => {
                const isSelected = chosenSymbol === sym;
                return (
                  <button
                    key={sym}
                    onClick={() => handleSelectSymbol(sym)}
                    className={`w-10 h-10 rounded-lg font-heading font-black text-base transition-all cursor-pointer active:scale-95 flex items-center justify-center ${
                      isSelected
                        ? isCorrect
                          ? 'bg-emerald-500 text-stone-950 ring-2 ring-emerald-300 shadow-lg'
                          : 'bg-amber-500 text-stone-950 ring-2 ring-amber-300 shadow-lg'
                        : 'bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700'
                    }`}
                    title={`Pilih ${sym}`}
                  >
                    {sym}
                  </button>
                );
              })}
            </div>

            {/* Action Buttons: Overlay & Build */}
            <div className="flex items-center gap-2.5 w-full lg:w-auto justify-end">
              {/* Button 1: Ujicoba di Overlay */}
              <button
                onClick={handleToggleOverlay}
                className={`flex-1 lg:flex-initial px-4 py-2.5 rounded-xl font-heading font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95 ${
                  isOverlayActive
                    ? 'bg-amber-500 text-stone-950 ring-2 ring-amber-300'
                    : 'bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/40'
                }`}
                style={{ minHeight: '44px' }}
              >
                <Layers className="w-4 h-4" />
                <span>{isOverlayActive ? '✓ Overlay Aktif' : '✨ Ujicoba di Overlay'}</span>
              </button>

              {/* Button 2: Bangun Jembatan & Coba Seberangi */}
              <button
                onClick={handleBuildBridge}
                disabled={isBuilding || kikoState !== 'idle'}
                className={`flex-1 lg:flex-initial px-5 py-2.5 rounded-xl font-heading font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 cursor-pointer ${
                  isBuilding || kikoState !== 'idle'
                    ? 'bg-stone-800 text-stone-500 cursor-not-allowed opacity-60'
                    : isCorrect
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 text-stone-950 ring-4 ring-emerald-400/40 animate-pulse'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-stone-950 ring-2 ring-amber-400/40'
                }`}
                style={{ minHeight: '44px' }}
                title="Bangun jembatan dan coba apakah Kiko bisa menyeberang dengan aman!"
              >
                <Hammer className="w-4 h-4" />
                <span>
                  {kikoState === 'crossed'
                    ? '✓ Jembatan Selesai!'
                    : isCorrect
                    ? '🔨 Bangun Jembatan'
                    : '🔨 Bangun Jembatan (Uji Coba)'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
