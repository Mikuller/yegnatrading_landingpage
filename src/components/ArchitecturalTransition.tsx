import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface ArchitecturalTransitionProps {
  /** Whether an internal page redirection has been initiated */
  isNavigating: boolean;
}

export default function ArchitecturalTransition({ isNavigating }: ArchitecturalTransitionProps) {
  // Detect if arriving from an internal page transition
  const [isRevealing, setIsRevealing] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      return sessionStorage.getItem('yegna_page_transition') === '1';
    }
    return false;
  });

  useEffect(() => {
    if (isRevealing) {
      // Clear the session transition flag
      try {
        sessionStorage.removeItem('yegna_page_transition');
      } catch {
        // Safe ignore
      }

      // Finish reveal exit after curtain sweeps away (~280ms)
      const timer = setTimeout(() => {
        setIsRevealing(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isRevealing]);

  // Safety failsafe on popstate/pageshow
  useEffect(() => {
    const handleReset = () => {
      setIsRevealing(false);
    };
    window.addEventListener('pageshow', handleReset);
    window.addEventListener('popstate', handleReset);
    return () => {
      window.removeEventListener('pageshow', handleReset);
      window.removeEventListener('popstate', handleReset);
    };
  }, []);

  const shouldRender = isNavigating || isRevealing;
  if (!shouldRender) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[95] pointer-events-none select-none overflow-hidden"
    >
      {/* =========================================================================
          EXIT SWEEP: Departing Page -> Curtain surges UP from bottom with Laser Blade
          ========================================================================= */}
      {isNavigating && (
        <motion.div
          key="exit-curtain"
          initial={{ y: '100%' }}
          animate={{ y: '0%' }}
          transition={{
            duration: 0.25,
            ease: [0.77, 0, 0.175, 1], // High-speed fluid aerodynamic curve
          }}
          className="relative h-full w-full bg-gradient-to-b from-[#060911] via-[#090d18] to-[#04060b] shadow-[0_-20px_50px_rgba(0,0,0,0.8)] flex flex-col justify-between overflow-hidden"
        >
          {/* 1. Leading Edge: High-Intensity Blazing Ember Laser Blade */}
          <div className="relative w-full z-20">
            {/* Ambient Warm Volumetric Bloom */}
            <div className="absolute -top-12 inset-x-0 h-24 bg-gradient-to-b from-transparent via-ember/40 to-transparent blur-xl pointer-events-none" />

            {/* Glowing Laser Rim Core */}
            <div className="relative h-[3px] w-full bg-gradient-to-r from-amber-500/10 via-amber-300 via-white to-amber-500/10 shadow-[0_0_24px_rgba(245,124,0,1),0_0_50px_rgba(251,191,36,0.85)]" />

            {/* High-Speed Traveling Laser Spark Sweep */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="absolute -top-2 h-2 w-48 bg-gradient-to-r from-transparent via-white to-transparent blur-sm"
            />
          </div>

          {/* 2. Curtain Interior: Precision Structural Blueprint Grid & Watermark */}
          <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(245,124,0,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(245,124,0,0.4)_1px,transparent_1px)] [background-size:32px_32px]" />

          {/* 3. High-End Monolith Center Brand Pulse */}
          <div className="relative z-10 m-auto flex flex-col items-center justify-center gap-2">
            <motion.div
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.18, delay: 0.05 }}
              className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-slate-900/80 border border-ember/30 shadow-[0_0_30px_rgba(245,124,0,0.25)] backdrop-blur-md"
            >
              <span className="h-2 w-2 rounded-full bg-ember shadow-[0_0_8px_#f57c00] animate-ping" />
              <span className="font-display text-[0.72rem] font-extrabold tracking-[0.3em] uppercase text-slate-100">
                YEGNA TRADING
              </span>
              <span className="text-[0.62rem] font-mono text-amber font-bold">GRADE 75</span>
            </motion.div>
          </div>

          {/* Bottom aesthetic anchor */}
          <div className="h-1 w-full" />
        </motion.div>
      )}

      {/* =========================================================================
          ENTER REVEAL: Arriving Page -> Curtain sweeps UP and OUT offscreen
          ========================================================================= */}
      {isRevealing && !isNavigating && (
        <motion.div
          key="enter-curtain"
          initial={{ y: '0%' }}
          animate={{ y: '-100%' }}
          transition={{
            duration: 0.24,
            ease: [0.77, 0, 0.175, 1],
          }}
          className="relative h-full w-full bg-gradient-to-b from-[#060911] via-[#090d18] to-[#04060b] shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col justify-between overflow-hidden"
        >
          {/* Top anchor */}
          <div className="h-1 w-full" />

          {/* Curtain Interior Grid */}
          <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(245,124,0,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(245,124,0,0.4)_1px,transparent_1px)] [background-size:32px_32px]" />

          {/* Trailing Bottom Edge: Blazing Laser Blade revealing the new page */}
          <div className="relative w-full z-20">
            {/* Glowing Laser Rim Core */}
            <div className="relative h-[3px] w-full bg-gradient-to-r from-amber-500/10 via-amber-300 via-white to-amber-500/10 shadow-[0_0_24px_rgba(245,124,0,1),0_0_50px_rgba(251,191,36,0.85)]" />

            {/* Ambient Bloom */}
            <div className="absolute -bottom-8 inset-x-0 h-16 bg-gradient-to-t from-transparent via-ember/40 to-transparent blur-xl pointer-events-none" />
          </div>
        </motion.div>
      )}
    </div>
  );
}
