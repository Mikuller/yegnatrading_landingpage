import { useEffect, useState, useRef, type MouseEvent, type TouchEvent } from 'react';
import { motion, AnimatePresence, useSpring, useTransform, useMotionValue } from 'motion/react';
import { ShieldCheck, Wifi } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface BrandPreloaderProps {
  /** Forced active state when a page redirection is taking too long (>450ms lag) */
  isSlowNetwork?: boolean;
  /** Callback when the initial entry curtain has fully cleared */
  onComplete?: () => void;
}

const FIRST_VISIT_PHASES = [
  { en: 'CALIBRATING GRADE 75 STEEL...', am: 'የGrade 75 ብረት ጥራትን በማረጋገጥ ላይ...' },
  { en: 'VERIFYING MILL HEAT NUMBER...', am: 'የፋብሪካ ባች መለያዎችን በመፈተሽ ላይ...' },
  { en: 'CENTRAL DEPOT STOCK READY', am: 'የዋና መጋዘን ክምችት ተረጋግጧል' },
  { en: 'ENTERING YEGNA TRADING', am: 'እንኳን ወደ የኛ ትሬዲንግ በደኅና መጡ' },
];

const SLOW_NETWORK_PHASES = [
  { en: 'HIGH NETWORK LATENCY DETECTED...', am: 'የኔትወርክ መዘግየት አጋጥሟል...' },
  { en: 'ESTABLISHING SECURE DEPOT LINK...', am: 'ከመጋዘኑ ጋር ግንኙነት በመፍጠር ላይ...' },
  { en: 'OPTIMIZING METRIC DATA STREAM...', am: 'የመረጃ ልውውጡን በማፋጠን ላይ...' },
];

export default function BrandPreloader({ isSlowNetwork = false, onComplete }: BrandPreloaderProps) {
  // Prevent SSR hydration mismatch (#418) and keep initial static HTML 100% clean
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const { t } = useApp();
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Check if initial cold intro has already played in this browser session
  const [hasSeenIntro, setHasSeenIntro] = useState<boolean>(() => {
    if (typeof sessionStorage !== 'undefined') {
      return sessionStorage.getItem('yegna_intro_seen') === 'true';
    }
    return false;
  });

  const [isRevealed, setIsRevealed] = useState(() => hasSeenIntro);
  const [shockwaves, setShockwaves] = useState<{ id: number; x: number; y: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // 3D Magnetic Tilt Physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 220, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 220, damping: 20 });
  const rotateX = useTransform(springY, [-100, 100], [10, -10]);
  const rotateY = useTransform(springX, [-100, 100], [-10, 10]);

  // Remove static CSS preloader on mount if present in DOM
  useEffect(() => {
    const staticEl = document.getElementById('yegna-static-preloader');
    if (staticEl) {
      staticEl.remove();
    }
  }, []);

  // Manage Progress & Phases
  useEffect(() => {
    // Case 1: Slow network lag triggered during navigation
    if (isSlowNetwork) {
      setIsRevealed(false);
      setProgress(75);
      const lagInterval = setInterval(() => {
        setPhaseIndex((prev) => (prev + 1) % SLOW_NETWORK_PHASES.length);
      }, 1600);
      return () => clearInterval(lagInterval);
    }

    // Case 2: Already seen intro in this session, do not show loader on fast navigation
    if (hasSeenIntro) {
      setIsRevealed(true);
      return;
    }

    // Case 3: First time opening the website in this session (cinematic transparent brand introduction)
    // On mobile devices, accelerate to ~320ms so users access content immediately without waiting
    const isMobileDevice =
      typeof window !== 'undefined' &&
      (window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches);
    const targetDuration = isMobileDevice ? 320 : 1200;
    const startTime = performance.now();

    const interval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / targetDuration) * 100));
      setProgress(pct);

      if (pct < 30) setPhaseIndex(0);
      else if (pct < 65) setPhaseIndex(1);
      else if (pct < 95) setPhaseIndex(2);
      else setPhaseIndex(3);

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsRevealed(true);
          setHasSeenIntro(true);
          if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem('yegna_intro_seen', 'true');
          }
          if (onComplete) onComplete();
        }, 180);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [isSlowNetwork, hasSeenIntro, onComplete]);

  // Interactive Magnetic Pointer Handlers
  const handlePointerMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handlePointerLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Addictive Tap/Click Ripple Shockwave
  const handleTriggerShockwave = (e: MouseEvent | TouchEvent) => {
    const id = Date.now() + Math.random();
    setShockwaves((prev) => [...prev.slice(-3), { id, x: 0, y: 0 }]);
    setTimeout(() => {
      setShockwaves((prev) => prev.filter((item) => item.id !== id));
    }, 700);
  };

  const activePhases = isSlowNetwork ? SLOW_NETWORK_PHASES : FIRST_VISIT_PHASES;
  const currentPhase = activePhases[phaseIndex] || activePhases[0];

  if (!hasMounted) return null;

  return (
    <AnimatePresence>
      {(!isRevealed || isSlowNetwork) && (
        <motion.div
          key="first-time-preloader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.05,
            transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
          }}
          ref={containerRef}
          onMouseMove={handlePointerMove}
          onMouseLeave={handlePointerLeave}
          onClick={handleTriggerShockwave}
          onTouchStart={handleTriggerShockwave}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center select-none overflow-hidden cursor-pointer"
          aria-label="Loading Yegna Trading"
          role="status"
        >
          {/* 1. Translucent Frosted Scrim Backdrop: The underlying website is visibly dynamic behind a soft blur */}
          <div className="absolute inset-0 bg-slate-950/75 dark:bg-black/80 md:backdrop-blur-xl transition-all" />

          {/* 2. Ambient Warm Radial Ember Bloom */}
          <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-ember/25 via-amber/15 to-transparent blur-[110px] pointer-events-none animate-pulse" />

          {/* 3. Floating 3D Magnetic Core Monolith (Frosted Glass Acrylic Capsule) */}
          <motion.div
            style={{ rotateX, rotateY, perspective: 900 }}
            className="relative z-20 flex flex-col items-center justify-center rounded-3xl border border-white/20 dark:border-white/10 bg-slate-900/90 dark:bg-slate-950/95 md:backdrop-blur-2xl px-8 py-8 sm:px-10 sm:py-9 shadow-[0_25px_65px_rgba(0,0,0,0.5),0_0_40px_rgba(245,124,0,0.25)]"
          >
            {/* Concentric Rebar Caliber Gauge Rings Stage */}
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
              {/* SVG Precision Gauge Rings */}
              <svg viewBox="0 0 240 240" className="absolute inset-0 w-full h-full pointer-events-none">
                {/* Outer Counter-Clockwise Caliber Ring (8mm - 32mm) */}
                <g className="origin-center animate-[spin_12s_linear_infinite_reverse]">
                  <circle
                    cx="120"
                    cy="120"
                    r="104"
                    fill="none"
                    stroke="#475569"
                    strokeWidth="1"
                    strokeDasharray="4 8"
                    opacity="0.6"
                  />
                  <circle
                    cx="120"
                    cy="120"
                    r="104"
                    fill="none"
                    stroke="#f57c00"
                    strokeWidth="1.5"
                    strokeDasharray="24 160"
                    opacity="0.9"
                  />
                  {/* Gauge Ticks */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                    <circle
                      key={deg}
                      cx={120 + 104 * Math.cos((deg * Math.PI) / 180)}
                      cy={120 + 104 * Math.sin((deg * Math.PI) / 180)}
                      r="2.5"
                      fill={i % 2 === 0 ? '#f57c00' : '#cbd5e1'}
                      opacity="0.85"
                    />
                  ))}
                </g>

                {/* Inner Clockwise Mill-Certified Spec Ring */}
                <g className="origin-center animate-[spin_8s_linear_infinite]">
                  <circle
                    cx="120"
                    cy="120"
                    r="82"
                    fill="none"
                    stroke="#334155"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx="120"
                    cy="120"
                    r="82"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    strokeDasharray="16 110"
                    opacity="0.85"
                  />
                  {/* Cardinal Crosshair Points */}
                  {[0, 90, 180, 270].map((deg) => (
                    <rect
                      key={deg}
                      x={118 + 82 * Math.cos((deg * Math.PI) / 180)}
                      y={118 + 82 * Math.sin((deg * Math.PI) / 180)}
                      width="4"
                      height="4"
                      fill="#38bdf8"
                      opacity="0.9"
                    />
                  ))}
                </g>
              </svg>

              {/* Tap Ripple Shockwave Rings */}
              <AnimatePresence>
                {shockwaves.map((wave) => (
                  <motion.div
                    key={wave.id}
                    initial={{ scale: 0.8, opacity: 0.95 }}
                    animate={{ scale: 2.3, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.65, ease: 'easeOut' }}
                    className="absolute inset-0 rounded-full border-2 border-ember shadow-[0_0_25px_rgba(245,124,0,0.6)] pointer-events-none"
                  />
                ))}
              </AnimatePresence>

              {/* Glowing Center Core with Yegna Logo Mark */}
              <motion.div
                animate={{
                  scale: [1, 1.03, 1],
                  y: [-2, 2, -2],
                }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative z-30 flex items-center justify-center p-4 rounded-3xl bg-slate-900/90 border border-slate-700/80 shadow-[0_10px_30px_rgba(0,0,0,0.7),0_0_25px_rgba(245,124,0,0.35)] backdrop-blur-md overflow-hidden"
              >
                {/* Specular Liquid Steel Sheen Overlay */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                  <div className="w-[200%] h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full animate-[shimmer_2.4s_infinite]" />
                </div>

                {/* The Official Logo Mark */}
                <img
                  src="/assets/yegna-mark.png"
                  alt="Yegna Trading PLC"
                  width={80}
                  height={80}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/logo-mark.png';
                  }}
                />
              </motion.div>
            </div>

            {/* Typography & High-End Mill Telemetry */}
            <div className="mt-5 flex flex-col items-center text-center px-4 max-w-sm">
              <span className="font-display text-white text-xs sm:text-sm font-extrabold tracking-[0.32em] uppercase">
                YEGNA TRADING PLC
              </span>

              {/* Dynamic Status Phase */}
              <motion.div
                key={phaseIndex}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-1.5 flex items-center gap-1.5 text-[0.68rem] sm:text-xs font-mono font-medium text-amber-400"
              >
                {isSlowNetwork ? (
                  <Wifi className="h-3 w-3 text-ember shrink-0 animate-pulse" />
                ) : (
                  <ShieldCheck className="h-3 w-3 text-ember shrink-0" />
                )}
                <span>{t(currentPhase.en, currentPhase.am)}</span>
              </motion.div>

              {/* Hairline Molten Gauge Progress Bar */}
              <div className="mt-4 w-48 sm:w-56 h-[3px] rounded-full bg-slate-800/90 overflow-hidden relative border border-slate-700/50">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber via-ember to-amber-300 shadow-[0_0_12px_rgba(245,124,0,0.8)]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: 'linear' }}
                />
              </div>

              {/* Metric & Interactive Hint */}
              <div className="mt-2.5 flex items-center justify-between w-48 sm:w-56 text-[0.62rem] font-mono text-slate-400">
                <span>{isSlowNetwork ? 'NETWORK LAG' : 'EBCS B500B'}</span>
                <span className="text-white font-bold">{progress}%</span>
                <span>GRADE 75</span>
              </div>

              <p className="mt-3 text-[0.58rem] text-slate-400 dark:text-slate-500 font-sans tracking-wider uppercase opacity-85">
                {t('Tap emblem to interact', 'አርማውን ነክተው ይሞክሩ')}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}