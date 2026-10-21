import { useState, useId, useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Activity,
  ShieldCheck,
  ArrowUpRight,
  Volume2,
  VolumeX,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { QuotePrefill } from '../sections/RebarLab';

// Web Audio API Synthesizer with throttling for zero audio stutter
let lastSoundTimestamp = 0;
function playAcousticFeedback(type: 'clink' | 'snap' | 'pump', enabled: boolean) {
  if (!enabled) return;
  const now = performance.now();
  if (type === 'clink' && now - lastSoundTimestamp < 55) return;
  lastSoundTimestamp = now;

  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === 'clink') {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(1650, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(820, ctx.currentTime + 0.08);
      osc2.frequency.setValueAtTime(3100, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.11);
      osc2.stop(ctx.currentTime + 0.11);
    } else if (type === 'snap') {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(740, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(130, ctx.currentTime + 0.3);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1480, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.32, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.32);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.33);
      osc2.stop(ctx.currentTime + 0.33);
    } else if (type === 'pump') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(85, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(115, ctx.currentTime + 0.16);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    }
  } catch {
    // AudioContext not allowed or uninitialized; safely ignore
  }
}

// 8 Core Commercial Diameters in Ethiopian Construction (Clean naming without pre-zeros or slashed zeros)
export interface CommercialRebarSpec {
  diameter: number; // 8, 10, 12, 14, 16, 20, 24, 32
  label: string;
  amLabel: string;
  rx: number; // SVG horizontal radius
  ry: number; // SVG isometric vertical radius
  unitWeightKgM: string;
  weightPer12mKg: number;
  pcsPerQuintal: string;
  application: string;
  amApplication: string;
  fyMpa: number; // Grade 75 yield strength = 520 MPa
  fuMpa: number; // Ultimate tensile strength = 660 MPa
}

export const COMMERCIAL_SPECS: CommercialRebarSpec[] = [
  {
    diameter: 8,
    label: '8 mm',
    amLabel: '8 ሚሜ',
    rx: 8,
    ry: 4.2,
    unitWeightKgM: '0.395 kg/m',
    weightPer12mKg: 4.74,
    pcsPerQuintal: '~21 pcs',
    application: 'Slab distribution mesh & light lintels',
    amApplication: 'ለስላብ የዝርጋታ መረብና ቀላል ሊንተሎች',
    fyMpa: 520,
    fuMpa: 650,
  },
  {
    diameter: 10,
    label: '10 mm',
    amLabel: '10 ሚሜ',
    rx: 10,
    ry: 4.8,
    unitWeightKgM: '0.617 kg/m',
    weightPer12mKg: 7.4,
    pcsPerQuintal: '~13.5 pcs',
    application: 'Suspended floor slabs & secondary beams',
    amApplication: 'ለወለል ስላቦችና ሁለተኛ ደረጃ ቢሞች',
    fyMpa: 520,
    fuMpa: 655,
  },
  {
    diameter: 12,
    label: '12 mm',
    amLabel: '12 ሚሜ',
    rx: 12,
    ry: 5.4,
    unitWeightKgM: '0.888 kg/m',
    weightPer12mKg: 10.66,
    pcsPerQuintal: '~9.4 pcs',
    application: 'Concrete slabs, stairs & standard beams',
    amApplication: 'ለመደበኛ ስላብ፣ ደረጃዎችና ጋሪዎች (Beams)',
    fyMpa: 525,
    fuMpa: 660,
  },
  {
    diameter: 14,
    label: '14 mm',
    amLabel: '14 ሚሜ',
    rx: 14,
    ry: 6.2,
    unitWeightKgM: '1.210 kg/m',
    weightPer12mKg: 14.52,
    pcsPerQuintal: '~6.9 pcs',
    application: 'Continuous floor beams & boundary ties',
    amApplication: 'ለተከታታይ የፎቅ ቢሞችና የደህንነት ማሰሪያዎች',
    fyMpa: 530,
    fuMpa: 665,
  },
  {
    diameter: 16,
    label: '16 mm',
    amLabel: '16 ሚሜ',
    rx: 17,
    ry: 7.2,
    unitWeightKgM: '1.580 kg/m',
    weightPer12mKg: 18.96,
    pcsPerQuintal: '~5.3 pcs',
    application: 'Primary building columns & main beams',
    amApplication: 'ለዋና ዋና ህንጻ አምዶችና ተሸካሚ ቢሞች',
    fyMpa: 535,
    fuMpa: 670,
  },
  {
    diameter: 20,
    label: '20 mm',
    amLabel: '20 ሚሜ',
    rx: 21,
    ry: 8.4,
    unitWeightKgM: '2.470 kg/m',
    weightPer12mKg: 29.64,
    pcsPerQuintal: '~3.4 pcs',
    application: 'High-rise column cages & foundation footings',
    amApplication: 'ለፎቆች ዋና አምድና ለመሠረት እግሮች (Footings)',
    fyMpa: 540,
    fuMpa: 675,
  },
  {
    diameter: 24,
    label: '24 mm',
    amLabel: '24 ሚሜ',
    rx: 25,
    ry: 9.8,
    unitWeightKgM: '3.550 kg/m',
    weightPer12mKg: 42.66,
    pcsPerQuintal: '~2.3 pcs',
    application: 'Core shear walls, transfer girders & heavy piers',
    amApplication: 'ለኮር ግንቦች፣ ለከባድ ሸክም ተሸካሚዎች',
    fyMpa: 545,
    fuMpa: 680,
  },
  {
    diameter: 32,
    label: '32 mm',
    amLabel: '32 ሚሜ',
    rx: 31,
    ry: 11.5,
    unitWeightKgM: '6.310 kg/m',
    weightPer12mKg: 75.72,
    pcsPerQuintal: '~1.3 pcs',
    application: 'Heavy raft foundations & mega-structure infrastructure',
    amApplication: 'ለከባድ ራፍት መሠረትና ሜጋ ፕሮጀክቶች',
    fyMpa: 550,
    fuMpa: 690,
  },
];

// Calculate exact non-overlapping physically balanced positions for all 8 diameters in Scale Lineup
export const SCALE_LINEUP_POSITIONS: Record<number, number> = (() => {
  const barGap = 8; // Clear uniform spacing between adjacent rebar outer surfaces
  let curX = 0;
  const raw = COMMERCIAL_SPECS.map((spec) => {
    const cx = curX + spec.rx;
    curX += spec.rx * 2 + barGap;
    return { diameter: spec.diameter, cx };
  });
  const totalBarSpan = curX - barGap; // Total span occupied by all 8 bars = 332px
  const offset = (380 - totalBarSpan) / 2; // Symmetrically centers all bars in the 380px SVG stage (offset = 24px)
  const map: Record<number, number> = {};
  raw.forEach((item) => {
    map[item.diameter] = Math.round(item.cx + offset);
  });
  return map;
})();

// Isometric Bundle Rods representing commercial warehouse stock with all 8 diameters present
interface BundleRodItem {
  id: string;
  diameter: number;
  cx: number;
  topY: number;
  height: number;
  layer: number;
}

const ISOMETRIC_BUNDLE: BundleRodItem[] = [
  // Layer 1: Back row (Tallest foundation & core bars)
  { id: 'b-32', diameter: 32, cx: 236, topY: 48, height: 280, layer: 1 },
  { id: 'b-24-back', diameter: 24, cx: 180, topY: 62, height: 265, layer: 1 },
  { id: 'b-20-back', diameter: 20, cx: 126, topY: 82, height: 245, layer: 1 },

  // Layer 2: Mid-Back row
  { id: 'b-24-r', diameter: 24, cx: 275, topY: 118, height: 210, layer: 2 },
  { id: 'b-20-c', diameter: 20, cx: 186, topY: 112, height: 215, layer: 2 },
  { id: 'b-16-l', diameter: 16, cx: 94, topY: 136, height: 195, layer: 2 },

  // Layer 3: Mid-Front row
  { id: 'b-20-front-r', diameter: 20, cx: 235, topY: 158, height: 175, layer: 3 },
  { id: 'b-16-front-c', diameter: 16, cx: 184, topY: 178, height: 165, layer: 3 },
  { id: 'b-14-front-l', diameter: 14, cx: 136, topY: 156, height: 178, layer: 3 },

  // Layer 4: Foreground Front row (Closest to camera, including 8mm!)
  { id: 'b-08-front-l', diameter: 8, cx: 88, topY: 208, height: 142, layer: 4 },
  { id: 'b-12-front-c', diameter: 12, cx: 138, topY: 226, height: 128, layer: 4 },
  { id: 'b-16-front', diameter: 16, cx: 186, topY: 232, height: 124, layer: 4 },
  { id: 'b-10-front-r', diameter: 10, cx: 236, topY: 214, height: 136, layer: 4 },
];

export interface InteractiveRebarBundleProps {
  onQuote?: (prefill: QuotePrefill) => void;
}

export default function InteractiveRebarBundle({ onQuote }: InteractiveRebarBundleProps) {
  const { t } = useApp();
  const shouldReduceMotion = useReducedMotion();
  const uid = useId();

  // Mode: 'bundle' (3D isometric stack) | 'scale' (Comparative lineup) | 'flex' (Universal Testing Machine Bend Test)
  const [viewMode, setViewMode] = useState<'bundle' | 'scale' | 'flex'>('bundle');
  const [activeDiameter, setActiveDiameter] = useState<number>(14);
  const [hoveredRodId, setHoveredRodId] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Flex Test States
  const [flexDeflection, setFlexDeflection] = useState<number>(0);
  const [isFlexing, setIsFlexing] = useState<boolean>(false);
  const [isAutoTesting, setIsAutoTesting] = useState<boolean>(false);
  const [flexTestPassed, setFlexTestPassed] = useState<boolean>(false);
  const [testPhase, setTestPhase] = useState<'idle' | 'loading' | 'holding' | 'recovering'>('idle');
  const flexContainerRef = useRef<HTMLDivElement>(null);

  // High-performance RAF throttle refs for 120fps dragging
  const dragRafRef = useRef<number | null>(null);
  const pendingDxRef = useRef<number>(0);

  const activeSpec =
    COMMERCIAL_SPECS.find((s) => s.diameter === activeDiameter) || COMMERCIAL_SPECS[3];

  useEffect(() => {
    return () => {
      if (dragRafRef.current) cancelAnimationFrame(dragRafRef.current);
    };
  }, []);

  // Direct quotation dispatch to Quote.tsx
  const handleRequestQuote = (spec: CommercialRebarSpec) => {
    if (onQuote) {
      onQuote({
        size: `${spec.diameter}mm`,
        part: `Grade 75 ${spec.diameter}mm Rebar`,
        message: `Quote request from Hero 3D Viewer for ${spec.diameter}mm Grade 75 deformed rebar (${spec.pcsPerQuintal}).`,
        ts: Date.now(),
      });
    } else {
      const quoteEl = document.getElementById('quote');
      quoteEl?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // High-performance pointer drag handlers with RAF throttling
  const handleFlexPointerDown = (e: React.PointerEvent) => {
    if (viewMode !== 'flex' || isAutoTesting) return;
    setIsFlexing(true);
    setFlexTestPassed(false);
    setTestPhase('loading');
    playAcousticFeedback('clink', soundEnabled);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handleFlexPointerMove = (e: React.PointerEvent) => {
    if (!isFlexing || !flexContainerRef.current || isAutoTesting) return;
    const rect = flexContainerRef.current.getBoundingClientRect();
    const midX = rect.left + rect.width / 2;
    const rawDx = e.clientX - midX;
    const clampedDx = Math.max(-65, Math.min(65, rawDx * 0.82));
    pendingDxRef.current = clampedDx;

    if (dragRafRef.current === null) {
      dragRafRef.current = requestAnimationFrame(() => {
        setFlexDeflection(pendingDxRef.current);
        dragRafRef.current = null;
      });
    }
  };

  const handleFlexPointerUp = () => {
    if (!isFlexing || isAutoTesting) return;
    if (dragRafRef.current !== null) {
      cancelAnimationFrame(dragRafRef.current);
      dragRafRef.current = null;
    }
    setIsFlexing(false);
    setTestPhase('recovering');

    if (Math.abs(pendingDxRef.current) > 12) {
      setFlexTestPassed(true);
      playAcousticFeedback('snap', soundEnabled);
    }
    setFlexDeflection(0);
    pendingDxRef.current = 0;
    setTimeout(() => {
      setTestPhase('idle');
    }, 320);
  };

  // Fast & Punchy Automated Test 1: Standard EBCS 45° Elastic Bend Test
  const runStandardBendTest = () => {
    if (isAutoTesting || isFlexing) return;
    setIsAutoTesting(true);
    setIsFlexing(true);
    setFlexTestPassed(false);
    setTestPhase('loading');
    playAcousticFeedback('pump', soundEnabled);

    const targetDeflection = 46;
    const startTime = performance.now();
    const duration = 650;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const ease = 1 - Math.pow(1 - progress, 3);
      setFlexDeflection(targetDeflection * ease);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setTestPhase('holding');
        setTimeout(() => {
          setTestPhase('recovering');
          setFlexDeflection(0);
          setIsFlexing(false);
          setIsAutoTesting(false);
          setFlexTestPassed(true);
          playAcousticFeedback('snap', soundEnabled);
          setTimeout(() => setTestPhase('idle'), 320);
        }, 400);
      }
    };

    requestAnimationFrame(step);
  };

  // Fast & Punchy Automated Test 2: 550 MPa High-Yield Proof Test
  const runHighYieldProofTest = () => {
    if (isAutoTesting || isFlexing) return;
    setIsAutoTesting(true);
    setIsFlexing(true);
    setFlexTestPassed(false);
    setTestPhase('loading');
    playAcousticFeedback('pump', soundEnabled);

    const targetDeflection = 64;
    const startTime = performance.now();
    const duration = 750;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const ease = 1 - Math.pow(1 - progress, 3);
      setFlexDeflection(targetDeflection * ease);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setTestPhase('holding');
        setTimeout(() => {
          setTestPhase('recovering');
          setFlexDeflection(0);
          setIsFlexing(false);
          setIsAutoTesting(false);
          setFlexTestPassed(true);
          playAcousticFeedback('snap', soundEnabled);
          setTimeout(() => setTestPhase('idle'), 450);
        }, 450);
      }
    };

    requestAnimationFrame(step);
  };

  // Engineering calculations
  const deflectionAbs = Math.abs(flexDeflection);
  const stressMpa = Math.min(620, Math.round((deflectionAbs / 65) * 550));
  const bendAngle = Math.round((deflectionAbs / 65) * 45);

  return (
    <div className="relative mx-auto flex w-full flex-col items-center select-none min-w-0 max-w-full">
      {/* Top Controls Bar: Certified Badge + View Modes + Audio Toggle */}
      <div className="mb-2.5 flex w-full items-center justify-between gap-1 sm:gap-2 px-0.5 z-30 min-w-0">
        <div className="flex items-center gap-1 sm:gap-1.5 min-w-0 flex-1 overflow-x-auto scrollbar-none">
          {/* Certified Pill with Live Radar Pulse */}
          <div className="shrink-0 relative inline-flex items-center gap-1 sm:gap-1.5 rounded-full border border-ember/25 bg-ember/10 px-2 sm:px-2.5 py-0.5 sm:py-1 text-ember shadow-xs backdrop-blur-sm cursor-default">
            <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2 shrink-0">
              {!shouldReduceMotion && (
                <motion.span
                  className="absolute inline-flex h-full w-full rounded-full bg-ember opacity-75"
                  animate={{ scale: [1, 2.2], opacity: [0.75, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                />
              )}
              <span className="relative inline-flex h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-ember" />
            </span>
            <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-ember shrink-0" />
            <span className="text-[0.58rem] sm:text-[0.66rem] font-bold tracking-wider uppercase whitespace-nowrap">
              {t('Certified', 'የተረጋገጠ')}
            </span>
          </div>

          {/* Mode Selector Pill */}
          <div
            data-interactive="true"
            className="flex items-center rounded-full border border-line/70 bg-panel2/90 p-0.5 text-[0.56rem] sm:text-[0.65rem] shadow-xs backdrop-blur-md shrink-0 relative min-w-0"
          >
            {(
              [
                { id: 'bundle', shortLabel: t('Bundle', 'ስቶክ'), fullLabel: t('Bundle Stack', 'የተጣመረ ስቶክ') },
                { id: 'scale', shortLabel: t('Lineup', 'ንጽጽር'), fullLabel: t('Scale Lineup', 'የመጠኖች ንጽጽር') },
                { id: 'flex', shortLabel: t('Flex', 'ፈተና'), fullLabel: t('Tensile Flex Test', 'የጥንካሬ ፈተና') },
              ] as const
            ).map((tab) => {
              const isActive = viewMode === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setViewMode(tab.id);
                    playAcousticFeedback('clink', soundEnabled);
                  }}
                  whileTap={{ scale: 0.94 }}
                  className={`relative cursor-pointer rounded-full px-1.5 sm:px-2.5 py-0.5 font-bold whitespace-nowrap transition-colors z-10 ${
                    isActive ? 'text-white' : 'text-mute hover:text-ink'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeRebarViewMode"
                      className="absolute inset-0 rounded-full bg-ember shadow-xs -z-10"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                  <span className="inline sm:hidden">{tab.shortLabel}</span>
                  <span className="hidden sm:inline">{tab.fullLabel}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Audio Toggle */}
        <motion.button
          type="button"
          data-interactive="true"
          onClick={() => setSoundEnabled((prev) => !prev)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.88 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="shrink-0 cursor-pointer inline-flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full border border-line/60 bg-panel2/80 text-mute hover:text-ink hover:border-ember/40 transition-colors"
          title={soundEnabled ? t('Mute audio', 'ድምጽ አጥፋ') : t('Enable audio', 'ድምጽ ክፈት')}
          aria-label="Toggle acoustic feedback"
        >
          {soundEnabled ? (
            <Volume2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-ember" />
          ) : (
            <VolumeX className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          )}
        </motion.button>
      </div>

      {/* Diameter Selector Grid: Strictly fits width without any horizontal scrolling */}
      <div
        data-interactive="true"
        className="mb-2.5 grid grid-cols-8 gap-0.5 sm:gap-1 w-full px-0.5 z-20 min-w-0"
      >
        {COMMERCIAL_SPECS.map((spec) => {
          const isSelected = activeDiameter === spec.diameter;
          return (
            <motion.button
              key={spec.diameter}
              type="button"
              onClick={() => {
                setActiveDiameter(spec.diameter);
                playAcousticFeedback('clink', soundEnabled);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 450, damping: 28 }}
              className={`relative cursor-pointer w-full min-w-0 text-center py-1 sm:py-1.5 text-[0.56rem] xs:text-[0.62rem] sm:text-[0.66rem] font-mono font-bold rounded-lg transition-colors overflow-hidden ${
                isSelected
                  ? 'text-white shadow-xs'
                  : 'bg-panel2/80 text-mute hover:text-ink hover:bg-panel2 border border-line/40'
              }`}
            >
              {isSelected && (
                <motion.span
                  layoutId="activeDiameterPill"
                  className="absolute inset-0 bg-ember rounded-lg ring-1 ring-ember -z-10"
                  transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                />
              )}
              <span className="relative z-10 block truncate px-0.5">{spec.diameter}mm</span>
            </motion.button>
          );
        })}
      </div>

      {/* Main Interactive Stage Area */}
      <div
        ref={flexContainerRef}
        onPointerDown={handleFlexPointerDown}
        onPointerMove={handleFlexPointerMove}
        onPointerUp={handleFlexPointerUp}
        onPointerCancel={handleFlexPointerUp}
        style={{ touchAction: viewMode === 'flex' ? 'none' : 'auto' }}
        className={`relative w-full max-w-[390px] aspect-[390/345] sm:aspect-[390/335] flex items-center justify-center overflow-hidden rounded-2xl border border-line/50 bg-radial from-panel2/70 via-panel/92 to-panel/98 backdrop-blur-sm p-1 ${
          viewMode === 'flex' ? 'cursor-ew-resize' : ''
        }`}
      >
        <svg
          viewBox="0 0 380 345"
          className="w-full h-full overflow-visible pointer-events-auto"
          aria-label="High-Definition Grade 75 Deformed Rebar Steel Visualizer"
        >
          <defs>
            {/* Ambient Ground Contact Shadow */}
            <radialGradient id={`${uid}-ground-shadow`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.55" />
              <stop offset="60%" stopColor="#000000" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>

            {/* Industrial Carbon Steel Specular Cylinder Gradient */}
            <linearGradient id={`${uid}-steel-shaft`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="12%" stopColor="#1e293b" />
              <stop offset="26%" stopColor="#334155" />
              <stop offset="42%" stopColor="#64748b" />
              <stop offset="49%" stopColor="#f8fafc" />
              <stop offset="58%" stopColor="#cbd5e1" />
              <stop offset="78%" stopColor="#334155" />
              <stop offset="92%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            {/* Glowing Active Forge Highlight Steel Gradient */}
            <linearGradient id={`${uid}-active-shaft`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#451a03" />
              <stop offset="14%" stopColor="#78350f" />
              <stop offset="34%" stopColor="#d97706" />
              <stop offset="48%" stopColor="#fef3c7" />
              <stop offset="56%" stopColor="#f59e0b" />
              <stop offset="78%" stopColor="#b45309" />
              <stop offset="94%" stopColor="#78350f" />
              <stop offset="100%" stopColor="#451a03" />
            </linearGradient>

            {/* Cold-Sheared Beveled Cut Top Face Texture */}
            <linearGradient id={`${uid}-top-face`} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#64748b" />
              <stop offset="25%" stopColor="#cbd5e1" />
              <stop offset="52%" stopColor="#ffffff" />
              <stop offset="80%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            {/* Active Top Face Bevel */}
            <linearGradient id={`${uid}-top-active`} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#b45309" />
              <stop offset="30%" stopColor="#fef3c7" />
              <stop offset="60%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>

            {/* Universal Testing Machine Reaction Column Gradient */}
            <linearGradient id={`${uid}-column-metal`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="20%" stopColor="#475569" />
              <stop offset="50%" stopColor="#94a3b8" />
              <stop offset="80%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            {/* Heavy Cast Steel Hydraulic Base Gradient */}
            <linearGradient id={`${uid}-vise-bed`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="35%" stopColor="#1e293b" />
              <stop offset="80%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>

            {/* Machine Jaw Gripping Teeth Pattern */}
            <pattern id={`${uid}-jaw-teeth`} width="6" height="6" patternUnits="userSpaceOnUse">
              <path d="M 0 6 L 6 0 M 0 0 L 6 6" stroke="#475569" strokeWidth="0.8" opacity="0.6" />
            </pattern>

            {/* High-Tensile Strain Forge Glow Filter */}
            <filter id={`${uid}-strain-glow`} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* MODE 1: 3D ISOMETRIC BUNDLE STACK (All 8 diameters represented including 8mm) */}
          {viewMode === 'bundle' && (
            <g>
              <ellipse
                cx="186"
                cy="326"
                rx="148"
                ry="22"
                fill={`url(#${uid}-ground-shadow)`}
                opacity="0.85"
              />

              {ISOMETRIC_BUNDLE.map((rod) => {
                const spec =
                  COMMERCIAL_SPECS.find((s) => s.diameter === rod.diameter) || activeSpec;
                const isSelected = activeDiameter === rod.diameter;
                const isHovered = hoveredRodId === rod.id;
                const isHighlighted = isSelected || isHovered;

                const liftY = isHighlighted ? -12 : 0;
                const ribSpacing = Math.max(8, Math.round(spec.rx * 0.85));
                const numRibs = Math.floor(rod.height / ribSpacing);
                const tilt = spec.rx * 0.42;

                return (
                  <motion.g
                    key={rod.id}
                    onMouseEnter={() => {
                      setHoveredRodId(rod.id);
                      setActiveDiameter(rod.diameter);
                      playAcousticFeedback('clink', soundEnabled);
                    }}
                    onMouseLeave={() => setHoveredRodId(null)}
                    onClick={() => {
                      setActiveDiameter(rod.diameter);
                      playAcousticFeedback('clink', soundEnabled);
                    }}
                    className="cursor-pointer"
                    animate={
                      shouldReduceMotion
                        ? { y: 0 }
                        : {
                            y: liftY,
                          }
                    }
                    transition={{
                      type: 'spring',
                      stiffness: 420,
                      damping: 30,
                      mass: 0.5,
                    }}
                  >
                    {/* Shadow onto neighbor rods */}
                    <ellipse
                      cx={rod.cx + 4}
                      cy={rod.topY + rod.height}
                      rx={spec.rx * 1.15}
                      ry={spec.ry * 0.85}
                      fill="#000000"
                      opacity="0.32"
                    />

                    {/* Rebar Shaft */}
                    <path
                      d={`
                        M ${rod.cx - spec.rx} ${rod.topY}
                        L ${rod.cx + spec.rx} ${rod.topY}
                        L ${rod.cx + spec.rx} ${rod.topY + rod.height}
                        A ${spec.rx} ${spec.ry} 0 0 1 ${rod.cx - spec.rx} ${rod.topY + rod.height}
                        Z
                      `}
                      fill={
                        isHighlighted
                          ? `url(#${uid}-active-shaft)`
                          : `url(#${uid}-steel-shaft)`
                      }
                      stroke={isHighlighted ? '#f59e0b' : '#334155'}
                      strokeWidth="0.85"
                    />

                    {/* Oblique Crescent Deformed Ribs */}
                    {Array.from({ length: numRibs }).map((_, rIdx) => {
                      const ryPos = rod.topY + 14 + rIdx * ribSpacing;
                      if (ryPos >= rod.topY + rod.height - 10) return null;

                      const x1 = rod.cx - spec.rx + 1;
                      const y1 = ryPos + tilt;
                      const xc = rod.cx;
                      const yc = ryPos + spec.ry * 0.65;
                      const x2 = rod.cx + spec.rx - 1;
                      const y2 = ryPos - tilt;

                      return (
                        <g key={rIdx} pointerEvents="none">
                          <path
                            d={`M ${x1} ${y1 - 1.5} Q ${xc} ${yc - 1.5} ${x2} ${y2 - 1.5}`}
                            fill="none"
                            stroke={isHighlighted ? '#fef3c7' : '#ffffff'}
                            strokeWidth={Math.max(1.4, spec.rx * 0.12)}
                            strokeLinecap="round"
                            opacity={isHighlighted ? 0.95 : 0.78}
                          />
                          <path
                            d={`M ${x1} ${y1} Q ${xc} ${yc} ${x2} ${y2}`}
                            fill="none"
                            stroke="#050811"
                            strokeWidth={Math.max(1.1, spec.rx * 0.1)}
                            strokeLinecap="round"
                            opacity="0.8"
                          />
                        </g>
                      );
                    })}

                    {/* Longitudinal Seam Lines */}
                    <line
                      x1={rod.cx - spec.rx * 0.82}
                      y1={rod.topY + 2}
                      x2={rod.cx - spec.rx * 0.82}
                      y2={rod.topY + rod.height}
                      stroke={isHighlighted ? '#fef3c7' : '#e2e8f0'}
                      strokeWidth="1"
                      opacity={isHighlighted ? 0.8 : 0.4}
                      pointerEvents="none"
                    />
                    <line
                      x1={rod.cx + spec.rx * 0.82}
                      y1={rod.topY + 2}
                      x2={rod.cx + spec.rx * 0.82}
                      y2={rod.topY + rod.height}
                      stroke={isHighlighted ? '#f59e0b' : '#94a3b8'}
                      strokeWidth="0.8"
                      opacity="0.35"
                      pointerEvents="none"
                    />

                    {/* Top Cut Sheared Face */}
                    <ellipse
                      cx={rod.cx}
                      cy={rod.topY}
                      rx={spec.rx}
                      ry={spec.ry}
                      fill={
                        isHighlighted
                          ? `url(#${uid}-top-active)`
                          : `url(#${uid}-top-face)`
                      }
                      stroke={isHighlighted ? '#ffffff' : '#cbd5e1'}
                      strokeWidth={isHighlighted ? '1.8' : '1'}
                    />

                    {/* Mill Mark Stamp */}
                    {spec.rx >= 13 && (
                      <text
                        x={rod.cx}
                        y={rod.topY + spec.ry * 0.35}
                        textAnchor="middle"
                        fontSize={Math.min(9, spec.rx * 0.5)}
                        fontWeight="900"
                        fill={isHighlighted ? '#78350f' : '#334155'}
                        letterSpacing="0.05em"
                        pointerEvents="none"
                      >
                        G75
                      </text>
                    )}

                    {/* Indicator pill showing diameter directly on top of lifted rod */}
                    {isHighlighted && (
                      <g pointerEvents="none">
                        <rect
                          x={rod.cx - 18}
                          y={rod.topY - 18}
                          width="36"
                          height="14"
                          rx="4"
                          fill="#090d16"
                          stroke="#f59e0b"
                          strokeWidth="1"
                        />
                        <text
                          x={rod.cx}
                          y={rod.topY - 8}
                          textAnchor="middle"
                          fontSize="8"
                          fontWeight="bold"
                          fill="#f59e0b"
                        >
                          {spec.diameter}mm
                        </text>
                      </g>
                    )}
                  </motion.g>
                );
              })}

              {/* Heavy Steel Strapping Tie */}
              <g pointerEvents="none">
                <path
                  d="M 82 265 Q 186 295 292 265"
                  fill="none"
                  stroke={`url(#${uid}-strap)`}
                  strokeWidth="11"
                  strokeLinecap="round"
                  opacity="0.95"
                />
                <rect
                  x="152"
                  y="274"
                  width="68"
                  height="18"
                  rx="4"
                  fill="#090d16"
                  stroke="#f59e0b"
                  strokeWidth="1.2"
                />
                <text
                  x="186"
                  y="286"
                  textAnchor="middle"
                  fontSize="7.5"
                  fontWeight="bold"
                  fill="#f59e0b"
                  letterSpacing="0.08em"
                >
                  YEGNA · G75
                </text>
              </g>
            </g>
          )}

          {/* MODE 2: SCALE LINEUP */}
          {viewMode === 'scale' && (
            <g>
              {/* Heavy Cast Steel Display Pedestal */}
              <rect
                x="14"
                y="278"
                width="352"
                height="34"
                rx="6"
                fill="#1e293b"
                stroke="#334155"
                strokeWidth="1.2"
              />
              <line x1="16" y1="280" x2="364" y2="280" stroke="#64748b" strokeWidth="1.2" opacity="0.6" />

              {/* Pedestal Ground Shadows (Permanently grounded on pedestal surface) */}
              {COMMERCIAL_SPECS.map((spec) => {
                const cx = SCALE_LINEUP_POSITIONS[spec.diameter] ?? 190;
                const isSelected = activeDiameter === spec.diameter;
                return (
                  <ellipse
                    key={`shadow-${spec.diameter}`}
                    cx={cx}
                    cy="282"
                    rx={spec.rx * (isSelected ? 1.25 : 1.1)}
                    ry={isSelected ? 3.2 : 4}
                    fill="#000000"
                    opacity={isSelected ? 0.22 : 0.45}
                  />
                );
              })}

              {/* Rebar Specimens in Ascending Diameter Order */}
              {COMMERCIAL_SPECS.map((spec) => {
                const cx = SCALE_LINEUP_POSITIONS[spec.diameter] ?? 190;
                const topY = 70 + (32 - spec.diameter) * 2.2;
                const height = 278 - topY;
                const isSelected = activeDiameter === spec.diameter;
                const liftY = isSelected ? -10 : 0;

                const ribSpacing = Math.max(8, Math.round(spec.rx * 0.8));
                const numRibs = Math.floor(height / ribSpacing);
                const tilt = spec.rx * 0.42;

                return (
                  <motion.g
                    key={spec.diameter}
                    onClick={() => {
                      setActiveDiameter(spec.diameter);
                      playAcousticFeedback('clink', soundEnabled);
                    }}
                    className="cursor-pointer"
                    animate={
                      shouldReduceMotion
                        ? { y: 0 }
                        : {
                            y: liftY,
                          }
                    }
                    transition={{ type: 'spring', stiffness: 450, damping: 28, mass: 0.5 }}
                  >
                    {/* Cylindrical Rebar Body Shaft */}
                    <path
                      d={`
                        M ${cx - spec.rx} ${topY}
                        L ${cx + spec.rx} ${topY}
                        L ${cx + spec.rx} ${topY + height}
                        A ${spec.rx} ${spec.ry} 0 0 1 ${cx - spec.rx} ${topY + height}
                        Z
                      `}
                      fill={isSelected ? `url(#${uid}-active-shaft)` : `url(#${uid}-steel-shaft)`}
                      stroke={isSelected ? '#f59e0b' : '#334155'}
                      strokeWidth="0.85"
                    />

                    {/* Transverse Ribs */}
                    {Array.from({ length: numRibs }).map((_, rIdx) => {
                      const ryPos = topY + 12 + rIdx * ribSpacing;
                      if (ryPos >= topY + height - 8) return null;

                      const x1 = cx - spec.rx + 1;
                      const y1 = ryPos + tilt;
                      const xMid = cx;
                      const yMid = ryPos + spec.ry * 0.65;
                      const x2 = cx + spec.rx - 1;
                      const y2 = ryPos - tilt;

                      return (
                        <g key={rIdx} pointerEvents="none">
                          <path
                            d={`M ${x1} ${y1 - 1.2} Q ${xMid} ${yMid - 1.2} ${x2} ${y2 - 1.2}`}
                            fill="none"
                            stroke={isSelected ? '#fef3c7' : '#ffffff'}
                            strokeWidth={Math.max(1.3, spec.rx * 0.11)}
                            strokeLinecap="round"
                            opacity={isSelected ? 0.95 : 0.75}
                          />
                          <path
                            d={`M ${x1} ${y1} Q ${xMid} ${yMid} ${x2} ${y2}`}
                            fill="none"
                            stroke="#050811"
                            strokeWidth={Math.max(1.1, spec.rx * 0.09)}
                            strokeLinecap="round"
                            opacity="0.75"
                          />
                        </g>
                      );
                    })}

                    {/* Sheared Cut Top Face */}
                    <ellipse
                      cx={cx}
                      cy={topY}
                      rx={spec.rx}
                      ry={spec.ry}
                      fill={isSelected ? `url(#${uid}-top-active)` : `url(#${uid}-top-face)`}
                      stroke={isSelected ? '#ffffff' : '#cbd5e1'}
                      strokeWidth={isSelected ? '1.8' : '1'}
                    />

                    {/* Mill Mark Stamp on Top Face */}
                    {spec.rx >= 14 && (
                      <text
                        x={cx}
                        y={topY + spec.ry * 0.35}
                        textAnchor="middle"
                        fontSize={Math.min(8.5, spec.rx * 0.45)}
                        fontWeight="900"
                        fill={isSelected ? '#78350f' : '#334155'}
                        letterSpacing="0.05em"
                        pointerEvents="none"
                      >
                        G75
                      </text>
                    )}

                    {/* Active Floating Specimen Tag above lifted rod */}
                    {isSelected && (
                      <g pointerEvents="none">
                        <rect
                          x={cx - 18}
                          y={topY - 18}
                          width="36"
                          height="14"
                          rx="4"
                          fill="#090d16"
                          stroke="#f59e0b"
                          strokeWidth="1.2"
                        />
                        <text
                          x={cx}
                          y={topY - 8}
                          textAnchor="middle"
                          fontSize="8"
                          fontWeight="bold"
                          fill="#f59e0b"
                        >
                          {spec.diameter}mm
                        </text>
                      </g>
                    )}
                  </motion.g>
                );
              })}

              {/* Pedestal Nameplates / Size Badges (Anchored securely to the pedestal base) */}
              {COMMERCIAL_SPECS.map((spec) => {
                const cx = SCALE_LINEUP_POSITIONS[spec.diameter] ?? 190;
                const isSelected = activeDiameter === spec.diameter;
                const pillW = Math.min(34, Math.max(22, Math.round(spec.rx * 1.3)));

                return (
                  <g
                    key={`badge-${spec.diameter}`}
                    onClick={() => {
                      setActiveDiameter(spec.diameter);
                      playAcousticFeedback('clink', soundEnabled);
                    }}
                    className="cursor-pointer"
                  >
                    <rect
                      x={cx - pillW / 2}
                      y="288"
                      width={pillW}
                      height="16"
                      rx="4"
                      fill={isSelected ? '#f59e0b' : '#0f172a'}
                      stroke={isSelected ? '#ffffff' : '#334155'}
                      strokeWidth={isSelected ? '1.2' : '0.8'}
                    />
                    <text
                      x={cx}
                      y="300"
                      textAnchor="middle"
                      fontSize={pillW < 24 ? '7' : '7.5'}
                      fontWeight="bold"
                      fill={isSelected ? '#ffffff' : '#94a3b8'}
                    >
                      {spec.diameter}mm
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* MODE 3: UNIVERSAL TESTING MACHINE (UTM) - FAST, SMOOTH & STABLE */}
          {viewMode === 'flex' && (
            <g>
              {/* Reaction Frame Columns */}
              <g pointerEvents="none">
                <rect
                  x="24"
                  y="52"
                  width="14"
                  height="228"
                  rx="3"
                  fill={`url(#${uid}-column-metal)`}
                  stroke="#334155"
                  strokeWidth="1"
                />
                {[70, 110, 150, 190, 230].map((tickY) => (
                  <line
                    key={tickY}
                    x1="32"
                    y1={tickY}
                    x2="38"
                    y2={tickY}
                    stroke="#cbd5e1"
                    strokeWidth="1"
                    opacity="0.6"
                  />
                ))}

                <rect
                  x="342"
                  y="52"
                  width="14"
                  height="228"
                  rx="3"
                  fill={`url(#${uid}-column-metal)`}
                  stroke="#334155"
                  strokeWidth="1"
                />
                {[70, 110, 150, 190, 230].map((tickY) => (
                  <line
                    key={tickY}
                    x1="342"
                    y1={tickY}
                    x2="348"
                    y2={tickY}
                    stroke="#cbd5e1"
                    strokeWidth="1"
                    opacity="0.6"
                  />
                ))}

                <rect
                  x="20"
                  y="48"
                  width="340"
                  height="10"
                  rx="2"
                  fill="#1e293b"
                  stroke="#475569"
                  strokeWidth="0.8"
                />

                <line
                  x1="190"
                  y1="64"
                  x2="190"
                  y2="265"
                  stroke="#475569"
                  strokeWidth="1"
                  strokeDasharray="3 4"
                  opacity="0.45"
                />

                <path
                  d="M 125 90 Q 190 76 255 90"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="1"
                  strokeDasharray="2 4"
                  opacity="0.5"
                />
                <text x="126" y="86" fontSize="7" fill="#64748b" textAnchor="middle">-30°</text>
                <text x="190" y="73" fontSize="7" fill="#64748b" textAnchor="middle">0°</text>
                <text x="254" y="86" fontSize="7" fill="#64748b" textAnchor="middle">+30°</text>
              </g>

              {/* Hydraulic Clamping Vise Base */}
              <g pointerEvents="none">
                <rect
                  x="48"
                  y="278"
                  width="284"
                  height="46"
                  rx="6"
                  fill={`url(#${uid}-vise-bed)`}
                  stroke="#334155"
                  strokeWidth="1.2"
                />
                <line x1="50" y1="280" x2="330" y2="280" stroke="#64748b" strokeWidth="1" opacity="0.7" />

                {[[70, 298], [310, 298]].map(([bx, by], bi) => (
                  <g key={bi}>
                    <circle cx={bx} cy={by} r="7" fill="#0f172a" stroke="#64748b" strokeWidth="1.2" />
                    <circle cx={bx} cy={by} r="3" fill="#cbd5e1" />
                  </g>
                ))}

                <rect
                  x="116"
                  y="262"
                  width="68"
                  height="22"
                  rx="3"
                  fill="#1e293b"
                  stroke="#475569"
                  strokeWidth="1"
                />
                <rect
                  x="174"
                  y="263"
                  width="10"
                  height="20"
                  fill={`url(#${uid}-jaw-teeth)`}
                  stroke="#64748b"
                  strokeWidth="0.6"
                />

                <rect
                  x="196"
                  y="262"
                  width="68"
                  height="22"
                  rx="3"
                  fill="#1e293b"
                  stroke="#475569"
                  strokeWidth="1"
                />
                <rect
                  x="196"
                  y="263"
                  width="10"
                  height="20"
                  fill={`url(#${uid}-jaw-teeth)`}
                  stroke="#64748b"
                  strokeWidth="0.6"
                />

                <path
                  d="M 116 273 L 95 273 Q 86 273 86 285 L 86 312"
                  fill="none"
                  stroke="#475569"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <rect x="94" y="270" width="6" height="6" fill="#f59e0b" rx="1" />

                <rect x="125" y="300" width="130" height="15" rx="3" fill="#090d16" stroke="#f59e0b" strokeWidth="0.8" />
                <text
                  x="190"
                  y="311"
                  textAnchor="middle"
                  fontSize="7.2"
                  fontWeight="bold"
                  fill="#f59e0b"
                  letterSpacing="0.08em"
                >
                  UTM-600 kN · ASTM A615 / EBCS
                </text>
              </g>

              {/* Cantilever Deflected Deformed Rebar */}
              {(() => {
                const baseX = 190;
                const baseY = 265;
                const topY = 90;
                const topX = baseX + flexDeflection;
                const rx = activeSpec.rx;

                const c1X = baseX;
                const c1Y = 210;
                const c2X = baseX + flexDeflection * 0.42;
                const c2Y = 145;

                const evalBezier = (t: number) => {
                  const inv = 1 - t;
                  const bx =
                    inv * inv * inv * baseX +
                    3 * inv * inv * t * c1X +
                    3 * inv * t * t * c2X +
                    t * t * t * topX;
                  const by =
                    inv * inv * inv * baseY +
                    3 * inv * inv * t * c1Y +
                    3 * inv * t * t * c2Y +
                    t * t * t * topY;

                  const dx =
                    3 * inv * inv * (c1X - baseX) +
                    6 * inv * t * (c2X - c1X) +
                    3 * t * t * (topX - c2X);
                  const dy =
                    3 * inv * inv * (c1Y - baseY) +
                    6 * inv * t * (c2Y - c1Y) +
                    3 * t * t * (topY - c2Y);

                  const angle = Math.atan2(dy, dx);
                  return { bx, by, angle };
                };

                const sampleSteps = 24;
                const leftPoints: [number, number][] = [];
                const rightPoints: [number, number][] = [];

                for (let i = 0; i <= sampleSteps; i++) {
                  const t = i / sampleSteps;
                  const { bx, by, angle } = evalBezier(t);
                  const normAngle = angle + Math.PI / 2;
                  leftPoints.push([
                    bx - Math.cos(normAngle) * rx,
                    by - Math.sin(normAngle) * rx,
                  ]);
                  rightPoints.push([
                    bx + Math.cos(normAngle) * rx,
                    by + Math.sin(normAngle) * rx,
                  ]);
                }

                const shaftPath = `
                  M ${leftPoints[0][0]} ${leftPoints[0][1]}
                  ${leftPoints.map((p) => `L ${p[0]} ${p[1]}`).join(' ')}
                  L ${rightPoints[sampleSteps][0]} ${rightPoints[sampleSteps][1]}
                  ${rightPoints.reverse().map((p) => `L ${p[0]} ${p[1]}`).join(' ')}
                  Z
                `;

                const numLugs = 16;
                const lugs = [];
                for (let i = 1; i < numLugs; i++) {
                  const t = i / numLugs;
                  const { bx, by, angle } = evalBezier(t);
                  const uX = Math.cos(angle);
                  const uY = Math.sin(angle);
                  const nX = -Math.sin(angle);
                  const nY = Math.cos(angle);

                  const tiltS = rx * 0.44;
                  const crescentBulge = rx * 0.24;

                  const p1x = bx - nX * (rx - 1) + uX * tiltS;
                  const p1y = by - nY * (rx - 1) + uY * tiltS;

                  const pcx = bx + uX * (tiltS * 0.2);
                  const pcy = by + uY * (tiltS * 0.2) + (flexDeflection > 0 ? -crescentBulge * 0.4 : crescentBulge * 0.4);

                  const p2x = bx + nX * (rx - 1) - uX * tiltS;
                  const p2y = by + nY * (rx - 1) - uY * tiltS;

                  lugs.push({ p1x, p1y, pcx, pcy, p2x, p2y, t });
                }

                return (
                  <g>
                    {stressMpa > 280 && (
                      <path
                        d={shaftPath}
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="8"
                        strokeLinecap="round"
                        opacity={Math.min(0.45, (stressMpa - 250) / 450)}
                        filter={`url(#${uid}-strain-glow)`}
                      />
                    )}

                    <path
                      d={shaftPath}
                      fill={`url(#${uid}-steel-shaft)`}
                      stroke={stressMpa > 480 ? '#f59e0b' : '#334155'}
                      strokeWidth="1.2"
                    />

                    <path
                      d={leftPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ')}
                      fill="none"
                      stroke="#f1f5f9"
                      strokeWidth="1.2"
                      opacity="0.5"
                    />
                    <path
                      d={rightPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ')}
                      fill="none"
                      stroke="#475569"
                      strokeWidth="1"
                      opacity="0.6"
                    />

                    {lugs.map((lug, li) => (
                      <g key={li} pointerEvents="none">
                        <path
                          d={`M ${lug.p1x} ${lug.p1y} Q ${lug.pcx} ${lug.pcy} ${lug.p2x} ${lug.p2y}`}
                          fill="none"
                          stroke={stressMpa > 450 ? '#fef3c7' : '#ffffff'}
                          strokeWidth={Math.max(1.5, rx * 0.12)}
                          strokeLinecap="round"
                          opacity={0.88}
                        />
                        <path
                          d={`M ${lug.p1x} ${lug.p1y + 1.2} Q ${lug.pcx} ${lug.pcy + 1.2} ${lug.p2x} ${lug.p2y + 1.2}`}
                          fill="none"
                          stroke="#050811"
                          strokeWidth={Math.max(1.2, rx * 0.1)}
                          strokeLinecap="round"
                          opacity="0.8"
                        />
                      </g>
                    ))}

                    <ellipse
                      cx={topX}
                      cy={topY}
                      rx={rx}
                      ry={rx * 0.45}
                      fill={`url(#${uid}-top-face)`}
                      stroke="#ffffff"
                      strokeWidth="1.2"
                    />

                    {/* Lateral Load Actuator Head Handle */}
                    <g
                      transform={`translate(${topX}, ${topY})`}
                      className="cursor-grab active:cursor-grabbing"
                    >
                      <circle cx={-rx - 5} cy="0" r="5" fill="#475569" stroke="#cbd5e1" strokeWidth="1" />
                      <circle cx={rx + 5} cy="0" r="5" fill="#475569" stroke="#cbd5e1" strokeWidth="1" />

                      <rect
                        x="-28"
                        y="-16"
                        width="56"
                        height="12"
                        rx="4"
                        fill="#0f172a"
                        stroke={isFlexing ? '#f59e0b' : '#475569'}
                        strokeWidth="1.2"
                      />

                      <rect
                        x="-36"
                        y="-38"
                        width="72"
                        height="20"
                        rx="10"
                        fill={isFlexing ? '#d97706' : '#1e293b'}
                        stroke={isFlexing ? '#fef3c7' : '#f59e0b'}
                        strokeWidth="1.5"
                        className="transition-colors"
                      />

                      {[-20, -10, 0, 10, 20].map((gx) => (
                        <line
                          key={gx}
                          x1={gx}
                          y1="-34"
                          x2={gx}
                          y2="-22"
                          stroke={isFlexing ? '#ffffff' : '#64748b'}
                          strokeWidth="1"
                          opacity="0.75"
                        />
                      ))}

                      <text
                        x="0"
                        y="-24"
                        textAnchor="middle"
                        fontSize="7.5"
                        fontWeight="bold"
                        fill={isFlexing ? '#ffffff' : '#f59e0b'}
                        letterSpacing="0.05em"
                        pointerEvents="none"
                      >
                        {isFlexing
                          ? `${deflectionAbs.toFixed(0)} mm (${stressMpa} MPa)`
                          : t('◀ DRAG TO BEND ▶', '◀ ጎትተው ይሞክሩ ▶')}
                      </text>
                    </g>
                  </g>
                );
              })()}

              {/* Digital Telemetry Console Header (Zero Overlap & No Slashed Zero) */}
              <g pointerEvents="none">
                <rect
                  x="14"
                  y="8"
                  width="352"
                  height="36"
                  rx="8"
                  fill="#090d16"
                  stroke="#334155"
                  strokeWidth="1"
                  opacity="0.94"
                />

                <text x="24" y="22" fontSize="9" fontWeight="bold" fill="#f59e0b">
                  {activeSpec.diameter}mm Grade 75 (EBCS B500B)
                </text>
                <text
                  x="24"
                  y="36"
                  fontSize="7.2"
                  fontWeight="600"
                  fill={flexTestPassed ? '#10b981' : stressMpa > 0 ? '#f59e0b' : '#94a3b8'}
                >
                  {flexTestPassed
                    ? t('✓ 100% ELASTIC RECOVERY · PASS', '✓ 100% ሙሉ በሙሉ ተመልሷል')
                    : stressMpa > 0
                    ? `${t('TESTING LOAD', 'የጭነት ፈተና')} · ${stressMpa > 500 ? t('HIGH YIELD ZONE', 'ከፍተኛ ጫና') : t('ELASTIC REGION', 'የመተጣጠፍ ክልል')}`
                    : t('READY · PULL HANDLE OR TEST', 'ዝግጁ · እጀታውን ጎትተው ይሞክሩ')}
                </text>

                <g transform="translate(240, 14)">
                  <text x="0" y="8" fontSize="7" fill="#94a3b8">BEND</text>
                  <text x="32" y="8" fontSize="8.5" fontWeight="bold" fill="#ffffff" fontFamily="monospace">
                    {bendAngle}°
                  </text>

                  <text x="65" y="8" fontSize="7" fill="#94a3b8">STRESS</text>
                  <text
                    x="104"
                    y="8"
                    fontSize="8.5"
                    fontWeight="bold"
                    fill={stressMpa > 500 ? '#f59e0b' : '#10b981'}
                    fontFamily="monospace"
                  >
                    {stressMpa}M
                  </text>
                </g>

                <g transform="translate(240, 28)">
                  <rect x="0" y="0" width="120" height="6" rx="3" fill="#1e293b" />
                  <rect
                    x="0"
                    y="0"
                    width={Math.min(120, (stressMpa / 600) * 120)}
                    height="6"
                    rx="3"
                    fill={stressMpa > 500 ? '#f59e0b' : '#10b981'}
                    className="transition-all duration-75"
                  />
                  <line x1="100" y1="-2" x2="100" y2="8" stroke="#ffffff" strokeWidth="1" opacity="0.8" />
                </g>
              </g>
            </g>
          )}
        </svg>
      </div>

      {/* Mode 3: Universal Testing Machine Mechanical Controls */}
      {viewMode === 'flex' && (
        <div data-interactive="true" className="mt-2.5 flex w-full items-center justify-between gap-2 flex-wrap px-1">
          <div className="flex items-center gap-1.5">
            <motion.button
              type="button"
              onClick={runStandardBendTest}
              disabled={isAutoTesting}
              whileHover={isAutoTesting ? {} : { scale: 1.03 }}
              whileTap={isAutoTesting ? {} : { scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 450, damping: 25 }}
              className={`cursor-pointer inline-flex items-center gap-1.5 rounded-xl border border-ember/40 bg-ember/15 px-3 py-1.5 text-xs font-bold text-ember hover:bg-ember hover:text-white transition-colors shadow-xs ${
                isAutoTesting ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              <Activity className="h-3.5 w-3.5" />
              <span>{t('45° Elastic Bend Test', 'የ45° መተጣጠፍ ፈተና')}</span>
            </motion.button>

            <motion.button
              type="button"
              onClick={runHighYieldProofTest}
              disabled={isAutoTesting}
              whileHover={isAutoTesting ? {} : { scale: 1.03 }}
              whileTap={isAutoTesting ? {} : { scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 450, damping: 25 }}
              className={`cursor-pointer inline-flex items-center gap-1.5 rounded-xl border border-line/60 bg-panel2/90 px-3 py-1.5 text-xs font-bold text-ink hover:border-ember hover:text-ember transition-colors shadow-xs ${
                isAutoTesting ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              <Zap className="h-3.5 w-3.5 text-amber" />
              <span>{t('550 MPa Yield Proof', 'የ550 MPa ጫና ፈተና')}</span>
            </motion.button>
          </div>

          <div className="text-[0.68rem] font-semibold text-mute flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>{t('Zero Plastic Fracture', 'ስብራት የሌለው')}</span>
          </div>
        </div>
      )}

      {/* Engineering HUD & Instant Quotation Card */}
      <div data-interactive="true" className="mt-2.5 w-full min-w-0 rounded-2xl border border-line/60 bg-panel2/80 p-2.5 sm:p-3 shadow-md backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-line/40 pb-2 gap-2 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1 truncate">
            <span className="font-display text-sm sm:text-base font-extrabold text-ember truncate">
              {t(activeSpec.label, activeSpec.amLabel)}
            </span>
            <span className="rounded-md bg-ember/15 px-1.5 py-0.5 text-[0.6rem] sm:text-[0.65rem] font-extrabold text-ember uppercase shrink-0">
              Grade 75
            </span>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[0.62rem] sm:text-[0.68rem] text-mute block leading-tight">{t('Pieces / Quintal', 'ብዛት በኩንታል')}</span>
            <p className="font-mono text-xs font-black text-ink">{activeSpec.pcsPerQuintal}</p>
          </div>
        </div>

        {/* Technical Key Metrics Grid */}
        <div className="mt-2 grid grid-cols-2 gap-1.5 sm:gap-2 text-left text-xs sm:grid-cols-3 min-w-0">
          <div className="rounded-lg bg-panel/70 p-1.5 sm:p-2 border border-line/30 min-w-0">
            <span className="text-[0.6rem] sm:text-[0.65rem] text-mute block">{t('Weight / 12m', 'ክብደት / 12ሜ')}</span>
            <p className="font-mono font-bold text-ink text-xs truncate">{activeSpec.weightPer12mKg} kg</p>
          </div>
          <div className="rounded-lg bg-panel/70 p-1.5 sm:p-2 border border-line/30 min-w-0">
            <span className="text-[0.6rem] sm:text-[0.65rem] text-mute block">{t('Unit Weight', 'የሜትር ክብደት')}</span>
            <p className="font-mono font-bold text-ink text-xs truncate">{activeSpec.unitWeightKgM}</p>
          </div>
          <div className="col-span-2 sm:col-span-1 rounded-lg bg-panel/70 p-1.5 sm:p-2 border border-line/30 min-w-0">
            <span className="text-[0.6rem] sm:text-[0.65rem] text-mute block">{t('Structural Use', 'አገልግሎት')}</span>
            <p className="text-[0.68rem] sm:text-[0.72rem] font-semibold text-ink truncate" title={t(activeSpec.application, activeSpec.amApplication)}>
              {t(activeSpec.application, activeSpec.amApplication)}
            </p>
          </div>
        </div>

        {/* 1-Click Quotation CTA Button directly from Hero Rebar Viewer */}
        <div className="mt-2.5 pt-2 border-t border-line/40 flex items-center justify-between gap-2 flex-wrap min-w-0">
          <div className="flex items-center gap-1.5 text-[0.65rem] sm:text-[0.7rem] text-mute min-w-0 flex-1 truncate">
            <ShieldCheck className="h-3.5 w-3.5 text-ember shrink-0" />
            <span className="truncate">{t('ASTM A615 & ES ISO 6935-2 Certified', 'በአለምአቀፍና በሀገር ውስጥ ደረጃ የተረጋገጠ')}</span>
          </div>

          <motion.button
            type="button"
            onClick={() => handleRequestQuote(activeSpec)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 450, damping: 25 }}
            className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl bg-ember px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-ember/90 transition-colors shrink-0"
          >
            <span>
              {t(
                `Quote ${activeSpec.diameter}mm`,
                `የ${activeSpec.diameter}ሚሜ ዋጋ ጠይቅ`
              )}
            </span>
            <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
