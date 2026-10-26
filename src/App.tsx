/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { sound } from './utils/sound';
import { HomeScreen } from './components/HomeScreen';
import { EquivalentBridge } from './components/EquivalentBridge';
import { ComparingBridge } from './components/ComparingBridge';
import { FreeLabScreen } from './components/FreeLabScreen';
import { TutorialScreen } from './components/TutorialScreen';
import { GuideModal } from './components/GuideModal';
import { InfoModal } from './components/InfoModal';

export type ScreenMode = 'equivalent' | 'comparing' | 'home' | 'lab' | 'tutorial';

export default function App() {
  // Directly start in Equivalent Bridge mode for immediate, immersive play!
  const [currentScreen, setCurrentScreen] = useState<ScreenMode>('equivalent');
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(Boolean(document.fullscreenElement));
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const handleToggleMute = () => {
    const next = sound.toggleMute();
    setIsMuted(next);
  };

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
    <div className="w-full min-h-screen bg-slate-950 font-sans select-none text-slate-100 flex flex-col justify-start">
      {/* 1. Mode Jembatan Pecahan Senilai (+ Lab Uji & Overlay) */}
      {currentScreen === 'equivalent' && (
        <EquivalentBridge
          onBackToHome={() => setCurrentScreen('home')}
          onSwitchToComparing={() => setCurrentScreen('comparing')}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          onOpenGuide={() => setShowGuide(true)}
        />
      )}

      {/* 2. Mode Jembatan Membandingkan Pecahan (<, =, > + Overlay) */}
      {currentScreen === 'comparing' && (
        <ComparingBridge
          onBackToHome={() => setCurrentScreen('home')}
          onSwitchToEquivalent={() => setCurrentScreen('equivalent')}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          onOpenGuide={() => setShowGuide(true)}
        />
      )}

      {/* 3. Menu Utama (Home Screen) */}
      {currentScreen === 'home' && (
        <HomeScreen
          onStartAdventure={() => setCurrentScreen('equivalent')}
          onStartComparing={() => setCurrentScreen('comparing')}
          onStartDiscovery={() => setCurrentScreen('equivalent')}
          onOpenLab={() => setCurrentScreen('lab')}
          onOpenTutorial={() => setCurrentScreen('tutorial')}
          onOpenInfo={() => setShowInfo(true)}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* 4. Laboratorium Bebas Pecahan Mandiri */}
      {currentScreen === 'lab' && (
        <FreeLabScreen
          onBackToHome={() => setCurrentScreen('home')}
          onStartAdventure={() => setCurrentScreen('equivalent')}
        />
      )}

      {/* 5. Panduan Cara Bermain */}
      {currentScreen === 'tutorial' && (
        <TutorialScreen
          onBackToHome={() => setCurrentScreen('home')}
          onStartAdventure={() => setCurrentScreen('equivalent')}
        />
      )}

      {/* Modal Buku Panduan */}
      <GuideModal
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
      />

      {/* Modal Informasi Media */}
      <InfoModal
        isOpen={showInfo}
        onClose={() => setShowInfo(false)}
      />
    </div>
  );
}
