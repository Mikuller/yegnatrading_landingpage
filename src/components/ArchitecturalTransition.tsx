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

      // Smooth dissolution finishes in ~260ms
      const timer = setTimeout(() => {
        setIsRevealing(false);
      }, 280);

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
          EXIT: Departing Page -> Depth Dissolve & Horizon Laser Blade Flare
          ========================================================================= */}
      {isNavigating && (
        <div className="relative h-full w-full flex items-center justify-center">
          {/* 1. Subtle Cinematic Depth Veil: Keeps page visible with soft depth blur */}
          <motion.div
            key="depth-veil"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="absolute inset-0 bg-slate-950/20 dark:bg-black/30 backdrop-blur-[2.5px]"
          />

          {/* 2. Top Horizon Laser Blade (High-Intensity Blazing Beam) */}
          <div className="absolute inset-x-0 top-0 z-30">
            {/* Ambient Volumetric Bloom cascading down */}
            <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-ember/30 via-amber/15 to-transparent blur-2xl" />

            {/* Glowing Laser Rim Core */}
            <div className="relative h-[3px] w-full bg-gradient-to-r from-amber-500/10 via-amber-300 via-white to-amber-500/10 shadow-[0_0_24px_rgba(245,124,0,1),0_0_48px_rgba(251,191,36,0.9)]" />

            {/* High-Speed Anamorphic Flare sweeping across top horizon */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -top-1.5 h-3 w-3/4 mx-auto bg-gradient-to-r from-transparent via-white via-amber-200 to-transparent blur-xs shadow-[0_0_30px_#fff]"
            />
          </div>

          {/* 3. Floating Luxurious Company Logo Medallion in Center */}
          <div className="relative z-20 flex flex-col items-center justify-center">
            {/* Ambient Warm Golden Halo Pulse */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 1.25, 1], opacity: [0.35, 0.65, 0.35] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute w-24 h-24 rounded-full bg-gradient-to-r from-ember/30 via-amber-400/25 to-ember/30 blur-xl pointer-events-none"
            />

            {/* Sculpted Obsidian & Frosted Glass Seal */}
            <motion.div
              initial={{ scale: 0.84, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 420, damping: 28 }}
              className="relative flex items-center justify-center h-14 w-14 rounded-2xl border border-amber-500/40 bg-slate-900/90 dark:bg-slate-950/95 shadow-[0_12px_32px_rgba(0,0,0,0.7),0_0_24px_rgba(245,124,0,0.35)] backdrop-blur-md overflow-hidden"
            >
              {/* High-Resolution Company Logo Icon */}
              <img
                src="/images/logo-icon.png"
                alt="Yegna Logo"
                width={36}
                height={36}
                className="relative z-10 h-9 w-9 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/logo-mark.png';
                }}
              />

              {/* High-End Specular Diamond Light Sweep */}
              <motion.div
                initial={{ x: '-150%', opacity: 0 }}
                animate={{ x: '180%', opacity: [0, 0.7, 0] }}
                transition={{ duration: 0.45, delay: 0.05, ease: 'easeInOut' }}
                className="pointer-events-none absolute inset-y-0 w-8 -rotate-25 bg-gradient-to-r from-transparent via-white/50 to-transparent blur-[2px] z-20"
              />
            </motion.div>
          </div>
        </div>
      )}

      {/* =========================================================================
          ENTER: Arriving Page -> Horizon Blade Flash Dissolves Away
          ========================================================================= */}
      {isRevealing && !isNavigating && (
        <div className="relative h-full w-full">
          {/* Dissolving Horizon Blade Flare */}
          <motion.div
            initial={{ scaleX: 0.9, opacity: 1 }}
            animate={{ scaleX: 1.15, opacity: 0 }}
            transition={{ duration: 0.26, ease: 'easeOut' }}
            className="absolute inset-x-0 top-0 h-[3.5px] bg-gradient-to-r from-transparent via-amber-300 via-white to-transparent shadow-[0_0_30px_rgba(245,124,0,1)]"
          />

          {/* Dissolving Volumetric Ambient Top Bloom */}
          <motion.div
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-amber-500/25 via-ember/15 to-transparent blur-2xl"
          />
        </div>
      )}
    </div>
  );
}
