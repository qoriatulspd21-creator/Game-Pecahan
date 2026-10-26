import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Info, Award, GraduationCap, CheckCircle, Monitor, Sparkles } from 'lucide-react';
import { sound } from '../utils/sound';
import { MathFraction } from './MathFraction';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 12 }}
          className="relative w-full max-w-2xl bg-stone-900 border-2 border-amber-400 rounded-3xl p-5 sm:p-6 shadow-2xl text-slate-100 flex flex-col max-h-[90vh] overflow-y-auto select-none"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-amber-800/40">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center shadow-lg font-black">
                <Info className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-heading font-black text-lg sm:text-xl text-white flex items-center gap-2">
                  <span>FRACTERRA: Proof Bridge</span>
                  <span className="text-xs bg-emerald-600/30 text-emerald-300 border border-emerald-400/50 px-2 py-0.5 rounded-full font-bold">
                    Inovasi Digital
                  </span>
                </h2>
                <p className="text-xs text-amber-300">
                  Media Pembelajaran Interaktif Matematika Kelas IV SD (Fase B)
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="w-10 h-10 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center border border-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="py-4 flex flex-col gap-4 text-xs sm:text-sm text-slate-200 leading-relaxed">
            {/* Pedagogical Alignment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-stone-800/90 rounded-2xl border border-white/10 flex flex-col gap-1.5">
                <span className="font-heading font-bold text-amber-300 flex items-center gap-1.5 text-xs">
                  <GraduationCap className="w-4 h-4 text-amber-400" />
                  Kurikulum & Sasaran
                </span>
                <p className="text-stone-300 text-[11px] sm:text-xs">
                  <strong>Kurikulum Merdeka</strong> · Matematika Fase B (Kelas IV SD) · Elemen Bilangan: <em>Pecahan Senilai</em>.
                </p>
              </div>

              <div className="p-3 bg-stone-800/90 rounded-2xl border border-white/10 flex flex-col gap-1.5">
                <span className="font-heading font-bold text-emerald-300 flex items-center gap-1.5 text-xs">
                  <Award className="w-4 h-4 text-emerald-400" />
                  Tujuan Pembelajaran (TP)
                </span>
                <p className="text-stone-300 text-[11px] sm:text-xs">
                  Membuktikan bahwa <strong className="inline-flex items-center gap-1 mx-0.5"><MathFraction num={1} den={2} size="2xs" /> = <MathFraction num={2} den={4} size="2xs" /></strong> melalui representasi konkret luas daerah tanpa spekulasi acak.
                </p>
              </div>
            </div>

            {/* Inovasi Media */}
            <div className="p-3.5 bg-emerald-950/60 rounded-2xl border border-emerald-500/40 flex flex-col gap-2">
              <span className="font-heading font-bold text-emerald-300 text-xs sm:text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Karakteristik & Inovasi Media:
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] sm:text-xs text-stone-200">
                <li className="flex items-start gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Ketepatan Matematika:</strong> Luas daerah model dan jembatan 100% konsisten.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Optimal IFP:</strong> Tombol minimal 56 piksel, sentuhan jari & stylus responsif.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Kearifan Lokal Nusantara:</strong> Karakter robot penjelajah Kiko berbusana Dayak Kaltim.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Bebas Hambatan:</strong> Berjalan luring di peramban, tanpa akun atau API luar.</span>
                </li>
              </ul>
            </div>

            {/* Petunjuk Flat Panel */}
            <div className="p-3 bg-stone-800/80 rounded-2xl border border-white/10 flex items-center gap-3">
              <Monitor className="w-8 h-8 text-sky-400 flex-shrink-0" />
              <div className="text-[11px] sm:text-xs text-stone-300">
                <strong>Tips Tampilan Papan Interaktif (IFP):</strong> Gunakan tombol <em>Layar Penuh (Fullscreen)</em> di pojok kanan atas untuk presentasi optimal di kelas tanpa gangguan menu browser.
              </div>
            </div>
          </div>

          {/* Close Action */}
          <div className="pt-2 border-t border-amber-800/40 flex justify-end">
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-amber-950 font-heading font-black text-sm shadow-md transition-all active:scale-95 cursor-pointer"
              style={{ minHeight: '44px' }}
            >
              Tutup
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
