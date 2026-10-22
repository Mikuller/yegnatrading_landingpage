import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ArchitecturalTransitionProps {
  /** Whether an internal page redirection has been initiated */
  isNavigating: boolean;
}

const COLUMN_COUNT = 4;
const COLUMNS = Array.from({ length: COLUMN_COUNT }, (_, i) => i);

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

      // Finish reveal exit after animation completes (~320ms)
      const timer = setTimeout(() => {
        setIsRevealing(false);
      }, 340);

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
      className="fixed inset-0 z-[85] grid grid-cols-4 pointer-events-none select-none overflow-hidden"
    >
      {COLUMNS.map((colIndex) => {
        // Exit wipe (Departing Page): sweep up from bottom to top
        if (isNavigating) {
          return (
            <motion.div
              key={`exit-col-${colIndex}`}
              initial={{ y: '100%' }}
              animate={{ y: '0%' }}
              transition={{
                duration: 0.22,
                delay: colIndex * 0.04,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative h-full w-full bg-slate-950 border-r border-amber-500/20 last:border-r-0 shadow-2xl flex flex-col justify-start overflow-hidden"
            >
              {/* Glowing Amber Laser Rim on top leading edge */}
              <div className="h-[3px] w-full bg-gradient-to-r from-amber via-ember to-amber-300 shadow-[0_0_16px_rgba(245,124,0,0.95)]" />
              
              {/* Subtle architectural vertical rib texture */}
              <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,#f57c00_1px,transparent_1px)] [background-size:16px_100%]" />
            </motion.div>
          );
        }

        // Enter reveal (Arriving Page): start full cover and slide up and away
        return (
          <motion.div
            key={`enter-col-${colIndex}`}
            initial={{ y: '0%' }}
            animate={{ y: '-100%' }}
            transition={{
              duration: 0.22,
              delay: (COLUMN_COUNT - 1 - colIndex) * 0.035,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative h-full w-full bg-slate-950 border-r border-amber-500/20 last:border-r-0 shadow-2xl flex flex-col justify-end overflow-hidden"
          >
            {/* Subtle architectural vertical rib texture */}
            <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,#f57c00_1px,transparent_1px)] [background-size:16px_100%]" />

            {/* Glowing Amber Laser Rim on bottom trailing edge */}
            <div className="h-[3px] w-full bg-gradient-to-r from-amber via-ember to-amber-300 shadow-[0_0_16px_rgba(245,124,0,0.95)]" />
          </motion.div>
        );
      })}
    </div>
  );
}
