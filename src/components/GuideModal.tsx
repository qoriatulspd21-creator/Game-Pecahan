import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, X, Layers, Hammer, Sliders, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/sound';
import { MathFraction } from './MathFraction';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/85 backdrop-blur-sm select-none">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-lg bg-stone-900 rounded-3xl border-3 border-amber-600/80 p-4 sm:p-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col justify-between"
        >
          {/* Top Header with Kiko Greeting */}
          <div className="flex items-center justify-between border-b border-amber-800/40 pb-3">
            <div className="flex items-center gap-3">
              <img
                src="/assets/kiko_welcome.png"
                alt="Kiko Penjelajah"
                className="w-12 h-12 object-contain rounded-xl bg-amber-950/80 p-0.5 border border-amber-500/50 shadow"
                referrerPolicy="no-referrer"
              />
              <div>
                <h2 className="font-heading font-black text-base sm:text-lg text-white">
                  Panduan Belajar FRACTERRA
                </h2>
                <p className="text-xs text-amber-300">
                  Konsep 2 Jembatan Panjang Sama · Belahan Berbeda (Kelas IV SD)
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

          {/* Core Content */}
          <div className="py-3 flex flex-col gap-3 text-sm text-slate-200 overflow-y-auto">
            {/* Konsep Inti */}
            <div className="bg-amber-950/40 p-3 rounded-2xl border border-amber-500/40">
              <h4 className="font-heading font-black text-amber-300 text-xs sm:text-sm mb-1 flex items-center gap-1.5">
                <span>🌟 Konsep Dasar 2 Jembatan:</span>
              </h4>
              <p className="text-xs leading-relaxed text-stone-200">
                Kedua jembatan di jurang memiliki <strong>panjang total yang sama persis (1 bagian utuh)</strong>. Namun, jumlah potongan dan ukuran balok kayunya berbeda tergantung penyebut pecahan yang dipilih.
              </p>
            </div>

            {/* 3 Langkah Bermain */}
            <div className="flex flex-col gap-2">
              <h4 className="font-heading font-bold text-emerald-300 text-xs sm:text-sm">
                Alur Eksperimen Siswa:
              </h4>

              {/* Step 1 */}
              <div className="flex items-start gap-2.5 bg-stone-800/90 p-2.5 rounded-xl border border-white/10">
                <div className="w-6 h-6 rounded-lg bg-amber-400 text-stone-950 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <span className="font-bold text-white flex items-center gap-1.5 text-xs">
                    <Sliders className="w-3.5 h-3.5 text-amber-400" />
                    Pilih / Masukkan Angka Pecahan
                  </span>
                  <p className="text-[11px] text-stone-300 mt-0.5 leading-relaxed">
                    Atur pembilang dan penyebut sesukamu. Pada tahap ini jembatan masih berupa rangka blueprint (belum langsung terpasang).
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-2.5 bg-stone-800/90 p-2.5 rounded-xl border border-white/10">
                <div className="w-6 h-6 rounded-lg bg-cyan-400 text-stone-950 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <span className="font-bold text-white flex items-center gap-1.5 text-xs">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    Klik "Ujicoba di Overlay (Tumpuk)"
                  </span>
                  <p className="text-[11px] text-stone-300 mt-0.5 leading-relaxed">
                    Lihat balok jembatan saling bertumpuk di jurang! Garis penanda ujung akan menunjukkan apakah senilai (sama panjang) atau mana yang lebih panjang (&lt;, =, &gt;).
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-2.5 bg-stone-800/90 p-2.5 rounded-xl border border-white/10">
                <div className="w-6 h-6 rounded-lg bg-emerald-400 text-stone-950 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <span className="font-bold text-white flex items-center gap-1.5 text-xs">
                    <Hammer className="w-3.5 h-3.5 text-emerald-400" />
                    Klik "Bangun Jembatan" & Seberangi!
                  </span>
                  <p className="text-[11px] text-stone-300 mt-0.5 leading-relaxed">
                    Setelah terbukti di overlay, tekan tombol Bangun Jembatan! Balok kayu dipasang kokoh dan Kiko dapat menyeberangi jurang dengan selamat!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 border-t border-amber-800/40">
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-stone-950 font-heading font-black text-sm shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              Saya Mengerti, Ayo Mulai Eksperimen!
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
