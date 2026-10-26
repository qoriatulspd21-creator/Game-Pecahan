import React from 'react';

interface IslandLandscapeProps {
  bgImageUrl?: string;
}

export const IslandLandscape: React.FC<IslandLandscapeProps> = ({
  bgImageUrl = '/island_chasm_wide.jpg',
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* 16:9 Tropical World Background Image */}
      <img
        src={bgImageUrl}
        alt="FRACTERRA World Background"
        className="w-full h-full object-cover object-center select-none"
        referrerPolicy="no-referrer"
      />

      {/* Subtle Ambient Shimmer Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-sky-950/15 pointer-events-none" />

      {/* Animated Birds in distant sky */}
      <div className="absolute top-6 left-1/3 opacity-60">
        <svg className="w-5 h-3 text-white animate-pulse" viewBox="0 0 24 16" fill="currentColor">
          <path d="M0 8 Q6 0 12 8 Q18 0 24 8 Q18 4 12 10 Q6 4 0 8 Z" />
        </svg>
      </div>
      <div className="absolute top-10 left-1/2 opacity-50" style={{ animationDelay: '1.2s' }}>
        <svg className="w-4 h-2.5 text-white animate-pulse" viewBox="0 0 24 16" fill="currentColor">
          <path d="M0 8 Q6 0 12 8 Q18 0 24 8 Q18 4 12 10 Q6 4 0 8 Z" />
        </svg>
      </div>
    </div>
  );
};
