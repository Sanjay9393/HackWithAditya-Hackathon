import React, { useState, useEffect } from 'react';
import { VillageLogo } from './VillageLogo';
import { Sparkles, ArrowRight } from 'lucide-react';

interface WelcomeSplashProps {
  durationMs?: number; // default 2500ms (2.5 seconds)
}

export const WelcomeSplash: React.FC<WelcomeSplashProps> = ({ durationMs = 2500 }) => {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / durationMs) * 100));
      setProgress(pct);

      if (elapsed >= durationMs) {
        clearInterval(interval);
        setIsFading(true);
        // Remove from DOM after fade transition completes (700ms)
        setTimeout(() => {
          setIsDismissed(true);
        }, 700);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [durationMs]);

  const handleSkip = () => {
    setIsFading(true);
    setTimeout(() => {
      setIsDismissed(true);
    }, 400);
  };

  if (isDismissed) {
    return null;
  }

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden cursor-pointer select-none transition-all duration-700 ease-out ${
        isFading ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'radial-gradient(circle at 50% 35%, #064E3B 0%, #022C22 45%, #0F172A 100%)',
      }}
    >
      {/* Decorative Rural Backdrop Elements */}
      {/* Warm Sunrise Radiance */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-amber-500/15 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-emerald-400/20 blur-2xl pointer-events-none" />

      {/* Decorative Traditional Rice Sheaf / Village SVG Silhouette at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-40 opacity-20 pointer-events-none">
        <svg viewBox="0 0 1440 240" fill="none" className="w-full h-full preserve-3d" preserveAspectRatio="none">
          <path
            d="M0 160 Q 360 80, 720 140 T 1440 100 L 1440 240 L 0 240 Z"
            fill="#10B981"
          />
          <path
            d="M0 190 Q 420 120, 840 170 T 1440 140 L 1440 240 L 0 240 Z"
            fill="#047857"
          />
        </svg>
      </div>

      {/* Main Brand Card */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center max-w-lg mx-auto">
        {/* Village Themed Logo with glowing ring */}
        <div className="relative mb-6 group">
          <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-amber-400 to-emerald-400 opacity-60 blur-md group-hover:opacity-100 transition duration-500" />
          <div className="relative bg-slate-900/60 p-2 rounded-full border border-emerald-500/40 backdrop-blur-xs">
            <VillageLogo size={120} />
          </div>
        </div>

        {/* Category Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold tracking-wider uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
          Smart Village AI Platform • స్మార్ట్ విలేజ్ వేదిక
        </div>

        {/* Brand Name */}
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-1">
          Praja<span className="text-emerald-400">AI</span>
          <span className="ml-3 text-2xl sm:text-3xl font-extrabold text-amber-300 font-telugu">
            (ప్రజా AI)
          </span>
        </h1>

        {/* Village Jurisdiction */}
        <p className="text-emerald-200/90 text-sm font-medium mb-3">
          చందానగర్ గ్రామ పంచాయతీ • గుంటూరు జిల్లా
        </p>

        {/* Tagline */}
        <div className="space-y-1 mb-8">
          <p className="text-lg sm:text-xl font-medium text-slate-100 italic">
            "Your village. Your information. Your future."
          </p>
          <p className="text-sm sm:text-base font-semibold text-emerald-300 font-telugu">
            "మీ గ్రామం. మీ సమాచారం. మీ భవిష్యత్తు."
          </p>
        </div>

        {/* 2.5s Animated Progress Indicator */}
        <div className="w-64 sm:w-72 space-y-2 mb-6">
          <div className="h-1.5 w-full bg-emerald-950/80 rounded-full overflow-hidden border border-emerald-800/50 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-green-300 rounded-full transition-all ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-emerald-300/80 tracking-wide font-medium flex items-center justify-center gap-2">
            <span>గ్రామ సమాచార వ్యవస్థ ప్రారంభమవుతోంది...</span>
            <span className="text-amber-300 font-bold">{progress}%</span>
          </p>
        </div>

        {/* Skip button for immediate entry */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSkip();
          }}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-md hover:bg-white/10 transition-colors"
        >
          <span>Skip / నేరుగా ప్రవేశించండి</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
