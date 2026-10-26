import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  FlaskConical,
  BookOpen,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Info,
  Sparkles,
  X,
  Play,
  Hammer,
} from 'lucide-react';
import { sound } from '../utils/sound';
import { MathFraction } from './MathFraction';

interface HomeScreenProps {
  onStartAdventure: () => void;
  onStartComparing: () => void;
  onStartDiscovery: () => void;
  onOpenLab: () => void;
  onOpenTutorial: () => void;
  onOpenInfo: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartAdventure,
  onStartComparing,
  onStartDiscovery,
  onOpenLab,
  onOpenTutorial,
  onOpenInfo,
  isMuted,
  onToggleMute,
}) => {
  const [showDialog, setShowDialog] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(Boolean(document.fullscreenElement));

  const toggleFullscreen = () => {
    sound.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-slate-950 flex items-center justify-center overflow-hidden font-sans select-none">
      {/* 16:9 Landscape Interactive Master Canvas */}
      <div className="relative w-full max-w-[1920px] aspect-video max-h-[100dvh] mx-auto overflow-hidden flex flex-col justify-between shadow-2xl bg-sky-950">
        {/* Main World Background Image (Fracterra World) */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="/fracterra_world.jpg"
            alt="Dunia FRACTERRA"
            className="w-full h-full object-cover object-center select-none"
            referrerPolicy="no-referrer"
          />

          {/* Ambient Lighting & Atmosphere Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40" />

          {/* Sun Ray & Atmospheric Glow */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-amber-200/25 via-sky-300/10 to-transparent blur-3xl pointer-events-none" />

          {/* Ambient Tropical Floating Particles / Leaves */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-emerald-400/40 blur-[1px] animate-pulse" />
          <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-amber-300/40 blur-[1px] animate-pulse" style={{ animationDelay: '1.5s' }} />
          <div className="absolute bottom-1/3 left-1/3 w-2 h-2 rounded-full bg-cyan-300/40 blur-[1px] animate-pulse" style={{ animationDelay: '2.5s' }} />

          {/* Unconnected Bridge Span in Center (Visual Cue of the Challenge) */}
          <div className="absolute left-[31%] top-[39%] w-[38%] h-14 border-b-2 border-dashed border-amber-400/60 flex items-center justify-center">
            <span className="px-3 py-1 bg-stone-950/80 rounded-full border border-amber-400/40 text-[11px] font-heading font-black text-amber-300 shadow-lg animate-pulse flex items-center gap-1.5">
              <Hammer className="w-3.5 h-3.5 text-amber-400" />
              <span>Pilih Jembatan & Bangun Pembuktian!</span>
            </span>
          </div>
        </div>

        {/* Top Floating Utility Bar (Right Corner Controls) */}
        <header className="relative z-30 w-full px-4 sm:px-8 py-3 flex items-center justify-between pointer-events-auto">
          {/* Top Left Badge */}
          <div className="flex items-center gap-2 bg-stone-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-amber-600/40 shadow-lg">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-heading font-black text-xs shadow">
              IV
            </div>
            <span className="font-heading font-bold text-xs text-amber-100 hidden sm:inline">
              Matematika SD · Kurikulum Merdeka
            </span>
          </div>

          {/* Top Right Mini Utilities */}
          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              onClick={() => {
                sound.playClick();
                onToggleMute();
              }}
              className="w-11 h-11 rounded-2xl bg-stone-950/85 backdrop-blur-md hover:bg-stone-900 text-stone-200 border border-white/20 shadow-lg flex items-center justify-center transition-all active:scale-95 touch-manipulation cursor-pointer"
              title={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-red-400" />
              ) : (
                <Volume2 className="w-5 h-5 text-emerald-400" />
              )}
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="w-11 h-11 rounded-2xl bg-stone-950/85 backdrop-blur-md hover:bg-stone-900 text-stone-200 border border-white/20 shadow-lg flex items-center justify-center transition-all active:scale-95 touch-manipulation cursor-pointer"
              title="Layar Penuh (Optimal untuk IFP)"
            >
              {isFullscreen ? (
                <Minimize className="w-5 h-5 text-amber-400" />
              ) : (
                <Maximize className="w-5 h-5 text-amber-400" />
              )}
            </button>

            {/* Media Info Modal Trigger */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenInfo();
              }}
              className="w-11 h-11 rounded-2xl bg-stone-950/85 backdrop-blur-md hover:bg-stone-900 text-stone-200 border border-white/20 shadow-lg flex items-center justify-center transition-all active:scale-95 touch-manipulation cursor-pointer"
              title="Informasi Media Pembelajaran"
            >
              <Info className="w-5 h-5 text-sky-400" />
            </button>
          </div>
        </header>

        {/* Center Title & Main Action Menu Area */}
        <div className="relative z-20 flex-1 w-full max-w-5xl mx-auto px-4 flex flex-col items-center justify-between py-2 sm:py-4 pointer-events-auto">
          {/* Main Title Badge (Carved Wood & Gold Adventure Style) */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex flex-col items-center text-center mt-1 sm:mt-2"
          >
            {/* Title Carved Container */}
            <div className="relative px-6 sm:px-10 py-3 sm:py-4 bg-stone-950/90 backdrop-blur-md rounded-3xl border-3 border-amber-500/80 shadow-[0_15px_35px_rgba(0,0,0,0.8)] flex flex-col items-center">
              {/* Outer Decorative Corner Brackets */}
              <div className="absolute -top-2 left-6 px-3 py-0.5 bg-emerald-600 rounded-full border border-emerald-300 text-[10px] sm:text-xs font-heading font-black text-white shadow tracking-widest uppercase flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Media Pembelajaran Matematika</span>
              </div>

              {/* Big Main Title: FRACTERRA */}
              <h1 className="font-heading font-black text-4xl sm:text-6xl md:text-7xl tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                FRACTERRA
              </h1>

              {/* Subtitle: PROOF BRIDGE */}
              <div className="flex items-center gap-2 mt-0.5">
                <div className="h-0.5 w-8 sm:w-16 bg-gradient-to-r from-transparent to-amber-400" />
                <span className="font-heading font-extrabold text-sm sm:text-lg md:text-xl text-emerald-400 tracking-widest uppercase drop-shadow">
                  PROOF BRIDGE
                </span>
                <div className="h-0.5 w-8 sm:w-16 bg-gradient-to-l from-transparent to-amber-400" />
              </div>

              {/* Slogan */}
              <p className="mt-1 text-xs sm:text-sm font-semibold text-amber-100/90 drop-shadow flex items-center gap-1.5">
                <span>"Jelajahi Pecahan, Bangun Pembuktian!"</span>
              </p>
            </div>
          </motion.div>

          {/* 2 Main Action Cards: Pecahan Senilai & Membandingkan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 my-2 sm:my-3"
          >
            {/* Card 1: JEMBATAN PECAHAN SENILAI */}
            <button
              onClick={() => {
                sound.playStart();
                onStartAdventure();
              }}
              className="group relative p-4 rounded-2xl bg-gradient-to-b from-emerald-600 via-teal-700 to-emerald-900 hover:from-emerald-500 hover:to-teal-600 text-white font-heading font-black border-2 border-emerald-400 shadow-[0_8px_25px_rgba(16,185,129,0.5)] transition-all duration-200 active:scale-95 touch-manipulation cursor-pointer flex flex-col items-center justify-center text-center gap-1.5 ring-2 ring-emerald-400/30"
              style={{ minHeight: '100px' }}
            >
              <div className="w-11 h-11 rounded-xl bg-stone-950/80 text-emerald-300 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
              </div>
              <span className="text-sm sm:text-base font-black tracking-wide uppercase mt-1">
                Jembatan Pecahan Senilai
              </span>
              <span className="text-xs text-emerald-200 font-medium leading-tight">
                Uji Kesamaan Panjang di Overlay lalu Bangun Jembatan!
              </span>
            </button>

            {/* Card 2: JEMBATAN MEMBANDINGKAN */}
            <button
              onClick={() => {
                sound.playStart();
                onStartComparing();
              }}
              className="group relative p-4 rounded-2xl bg-gradient-to-b from-amber-500 via-amber-600 to-amber-800 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-heading font-black border-2 border-amber-300 shadow-[0_8px_25px_rgba(245,158,11,0.5)] transition-all duration-200 active:scale-95 touch-manipulation cursor-pointer flex flex-col items-center justify-center text-center gap-1.5 ring-2 ring-amber-400/30"
              style={{ minHeight: '100px' }}
            >
              <div className="w-11 h-11 rounded-xl bg-stone-950/80 text-amber-300 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-2xl">⚖️</span>
              </div>
              <span className="text-sm sm:text-base font-black tracking-wide uppercase mt-1 text-white">
                Membandingkan Pecahan
              </span>
              <span className="text-xs text-amber-200 font-medium leading-tight">
                Bandingkan Panjang Jembatan dengan Tanda &lt;, =, &gt;
              </span>
            </button>
          </motion.div>
        </div>

        {/* Character Kiko in Bottom Left (Welcoming Pose) */}
        <div className="relative z-30 w-full px-4 sm:px-8 pb-3 sm:pb-5 pointer-events-none flex items-end justify-between">
          <div className="flex items-end gap-3 pointer-events-auto">
            {/* Kiko Dayak Robot Explorer Sprite */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, x: -20 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative cursor-pointer"
              onClick={() => {
                sound.playClick();
                setShowDialog(!showDialog);
              }}
              title="Ketuk Kiko untuk membuka/menutup sapaan!"
            >
              <img
                src="/assets/kiko_welcome.png"
                alt="Kiko si Robot Penjelajah Dayak"
                className="w-24 sm:w-32 md:w-36 h-24 sm:h-32 md:h-36 object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* Welcoming Speech Bubble (Dismissible & Non-blocking) */}
            <AnimatePresence>
              {showDialog && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85, y: 10 }}
                  className="relative mb-4 sm:mb-6 max-w-xs sm:max-w-sm bg-stone-900/95 text-white p-3 rounded-2xl border-2 border-amber-400 shadow-2xl flex flex-col gap-1 pointer-events-auto"
                >
                  {/* Bubble Pointer triangle */}
                  <div className="absolute -left-2.5 bottom-4 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-amber-400 border-b-8 border-b-transparent" />

                  <div className="flex items-center justify-between border-b border-white/10 pb-1">
                    <span className="font-heading font-black text-amber-300 text-xs flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Kiko si Penjelajah
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDialog(false);
                      }}
                      className="text-stone-400 hover:text-white p-0.5 rounded transition-colors"
                      title="Tutup pesan"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-stone-200 leading-snug font-medium">
                    "Halo, Penjelajah! Siap membangun jembatan dengan bukti pecahan?"
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Right Quick Launch */}
          <div className="pointer-events-auto hidden sm:flex items-center gap-2">
            <button
              onClick={() => {
                sound.playStart();
                onStartAdventure();
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-heading font-black text-xs sm:text-sm shadow-xl active:scale-95 transition-all cursor-pointer"
              style={{ minHeight: '48px' }}
            >
              <span>Mulai Petualangan</span>
              <Play className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
