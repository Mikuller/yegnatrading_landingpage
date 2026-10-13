import { useState, useId } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Sparkles, Layers, Sliders, ShieldCheck, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

export interface RodSpec {
  id: string;
  diameter: number;
  label: string;
  amLabel: string;
  weightPer12m: number;
  pcsPerQuintal: number;
  use: string;
  amUse: string;
  cx: number;
  rx: number;
  ry: number;
  topY: number;
  height: number;
  layer: number;
  idleDuration: number;
  idleAmplitude: number;
}

// 12 precisely arranged rods that recreate the iconic rebar bundle cluster in 3D isometric projection
export const BUNDLE_RODS: RodSpec[] = [
  // Layer 1: Back row (Tallest foundation & column bars)
  {
    id: 'rod-32-back',
    diameter: 32,
    label: 'Ø 32 mm',
    amLabel: 'Ø 32 ሚሜ',
    weightPer12m: 75.72,
    pcsPerQuintal: 1.32,
    use: 'Heavy Raft & High-Rise Columns',
    amUse: 'ለከባድ መሠረትና ፎቅ አምዶች',
    cx: 236,
    rx: 23,
    ry: 10.5,
    topY: 52,
    height: 275,
    layer: 1,
    idleDuration: 4.8,
    idleAmplitude: 7,
  },
  {
    id: 'rod-28-back',
    diameter: 28,
    label: 'Ø 28 mm',
    amLabel: 'Ø 28 ሚሜ',
    weightPer12m: 57.96,
    pcsPerQuintal: 1.73,
    use: 'Deep Beams & Bridge Abutments',
    amUse: 'ለዋና ቢሞችና ድልድይ መሠረት',
    cx: 184,
    rx: 21,
    ry: 9.5,
    topY: 66,
    height: 260,
    layer: 1,
    idleDuration: 5.2,
    idleAmplitude: 6,
  },
  {
    id: 'rod-24-back',
    diameter: 24,
    label: 'Ø 24 mm',
    amLabel: 'Ø 24 ሚሜ',
    weightPer12m: 42.6,
    pcsPerQuintal: 2.35,
    use: 'Core Shear Walls & Piers',
    amUse: 'ለኮር ግንቦችና ተሸካሚዎች',
    cx: 134,
    rx: 19,
    ry: 8.5,
    topY: 88,
    height: 240,
    layer: 1,
    idleDuration: 4.4,
    idleAmplitude: 8,
  },

  // Layer 2: Middle-Back row
  {
    id: 'rod-20-mid-r',
    diameter: 20,
    label: 'Ø 20 mm',
    amLabel: 'Ø 20 ሚሜ',
    weightPer12m: 29.64,
    pcsPerQuintal: 3.37,
    use: 'Multi-Storey Columns & Slabs',
    amUse: 'ለፎቅ አምዶችና ስላቦች',
    cx: 272,
    rx: 18,
    ry: 8,
    topY: 124,
    height: 205,
    layer: 2,
    idleDuration: 4.9,
    idleAmplitude: 6,
  },
  {
    id: 'rod-24-mid-c',
    diameter: 24,
    label: 'Ø 24 mm',
    amLabel: 'Ø 24 ሚሜ',
    weightPer12m: 42.6,
    pcsPerQuintal: 2.35,
    use: 'Grade Beams & Footings',
    amUse: 'ለግሬድ ቢሞችና እግሮች',
    cx: 186,
    rx: 19,
    ry: 8.5,
    topY: 118,
    height: 210,
    layer: 2,
    idleDuration: 5.5,
    idleAmplitude: 7,
  },
  {
    id: 'rod-16-mid-l',
    diameter: 16,
    label: 'Ø 16 mm',
    amLabel: 'Ø 16 ሚሜ',
    weightPer12m: 18.96,
    pcsPerQuintal: 5.27,
    use: 'Structural Slabs & Staircases',
    amUse: 'ለስላቦችና ደረጃዎች',
    cx: 98,
    rx: 16,
    ry: 7.2,
    topY: 142,
    height: 190,
    layer: 2,
    idleDuration: 4.2,
    idleAmplitude: 8,
  },

  // Layer 3: Middle-Front row
  {
    id: 'rod-20-front-r',
    diameter: 20,
    label: 'Ø 20 mm',
    amLabel: 'Ø 20 ሚሜ',
    weightPer12m: 29.64,
    pcsPerQuintal: 3.37,
    use: 'Foundation Footings & Lintels',
    amUse: 'ለመሠረትና ሊንተል',
    cx: 232,
    rx: 18,
    ry: 8,
    topY: 165,
    height: 170,
    layer: 3,
    idleDuration: 5.0,
    idleAmplitude: 6,
  },
  {
    id: 'rod-16-front-l',
    diameter: 16,
    label: 'Ø 16 mm',
    amLabel: 'Ø 16 ሚሜ',
    weightPer12m: 18.96,
    pcsPerQuintal: 5.27,
    use: 'Cantilever Beams & Decks',
    amUse: 'ለካንቲሊቨር ቢሞችና ደርቦች',
    cx: 140,
    rx: 16,
    ry: 7.2,
    topY: 162,
    height: 175,
    layer: 3,
    idleDuration: 4.6,
    idleAmplitude: 7,
  },
  {
    id: 'rod-14-front-c',
    diameter: 14,
    label: 'Ø 14 mm',
    amLabel: 'Ø 14 ሚሜ',
    weightPer12m: 14.52,
    pcsPerQuintal: 6.89,
    use: 'Secondary Beams & Parapets',
    amUse: 'ለረዳት ቢሞችና ፓራፔቶች',
    cx: 182,
    rx: 15,
    ry: 6.8,
    topY: 184,
    height: 160,
    layer: 3,
    idleDuration: 5.3,
    idleAmplitude: 6,
  },

  // Layer 4: Foreground Front row (Closest to camera)
  {
    id: 'rod-12-front-l',
    diameter: 12,
    label: 'Ø 12 mm',
    amLabel: 'Ø 12 ሚሜ',
    weightPer12m: 10.68,
    pcsPerQuintal: 9.36,
    use: 'Concrete Slabs & Footpaths',
    amUse: 'ለኮንክሪት ስላብና የእግረኛ መንገድ',
    cx: 132,
    rx: 14,
    ry: 6.2,
    topY: 218,
    height: 132,
    layer: 4,
    idleDuration: 4.1,
    idleAmplitude: 7,
  },
  {
    id: 'rod-10-front-r',
    diameter: 10,
    label: 'Ø 10 mm',
    amLabel: 'Ø 10 ሚሜ',
    weightPer12m: 7.44,
    pcsPerQuintal: 13.44,
    use: 'Stirrups & Staffa Reinforcement',
    amUse: 'ለስታፋና ማሰሪያ ቀለበቶች',
    cx: 226,
    rx: 13,
    ry: 5.8,
    topY: 212,
    height: 138,
    layer: 4,
    idleDuration: 5.1,
    idleAmplitude: 6,
  },
  {
    id: 'rod-16-front-center',
    diameter: 16,
    label: 'Ø 16 mm',
    amLabel: 'Ø 16 ሚሜ',
    weightPer12m: 18.96,
    pcsPerQuintal: 5.27,
    use: 'Standard Structural Slabs',
    amUse: 'ለመደበኛ የኮንክሪት ስላብ',
    cx: 178,
    rx: 16,
    ry: 7.2,
    topY: 236,
    height: 125,
    layer: 4,
    idleDuration: 4.7,
    idleAmplitude: 8,
  },
];

export default function InteractiveRebarBundle() {
  const { t } = useApp();
  const shouldReduceMotion = useReducedMotion();
  const uid = useId();

  const [activeRodId, setActiveRodId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'bundle' | 'spread' | 'wave'>('bundle');
  const [waveSeed, setWaveSeed] = useState(0);

  const activeRod = BUNDLE_RODS.find((r) => r.id === activeRodId) || null;

  // Trigger an active wave cascade across all rods
  const triggerWave = () => {
    setViewMode('wave');
    setWaveSeed((s) => s + 1);
    setTimeout(() => {
      setViewMode('bundle');
    }, 2800);
  };

  return (
    <div className="relative mx-auto flex flex-col items-center select-none">
      {/* Mode Switcher Controls */}
      <div className="mb-2 flex items-center justify-between w-full px-2 z-30">
        <div className="flex items-center gap-1 rounded-full border border-line/60 bg-panel2/80 p-1 text-[0.68rem] shadow-sm backdrop-blur-md">
          <button
            type="button"
            onClick={() => setViewMode('bundle')}
            className={`cursor-pointer rounded-full px-3 py-1 font-semibold transition-all ${
              viewMode === 'bundle'
                ? 'bg-ember text-white shadow-sm'
                : 'text-mute hover:text-ink'
            }`}
          >
            {t('Bundle View', 'የተጣመረ ስቶክ')}
          </button>
          <button
            type="button"
            onClick={() => setViewMode('spread')}
            className={`cursor-pointer rounded-full px-3 py-1 font-semibold transition-all ${
              viewMode === 'spread'
                ? 'bg-ember text-white shadow-sm'
                : 'text-mute hover:text-ink'
            }`}
          >
            {t('Exploded View', 'የተከፋፈለ እይታ')}
          </button>
        </div>

        <button
          type="button"
          onClick={triggerWave}
          className="cursor-pointer inline-flex items-center gap-1.5 rounded-full border border-ember/30 bg-ember/10 px-3 py-1 text-[0.68rem] font-bold text-ember hover:bg-ember hover:text-white transition-all shadow-sm"
        >
          <Sparkles className="h-3 w-3" />
          <span>{t('Piston Wave', 'የእንቅስቃሴ ሞገድ')}</span>
        </button>
      </div>

      {/* Main SVG Container */}
      <div className="relative w-full max-w-[380px] aspect-[380/380] flex items-center justify-center">
        <svg
          viewBox="0 0 380 380"
          className="w-full h-full overflow-visible"
          aria-label="Interactive 3D Animated Rebar Steel Bundle"
        >
          <defs>
            {/* Ambient Base Shadow */}
            <radialGradient id={`${uid}-ground-shadow`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#000000" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>

            {/* Cylinder Metallic Specular Gradient for Shafts */}
            <linearGradient id={`${uid}-shaft-steel`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2d3540" />
              <stop offset="14%" stopColor="#64748b" />
              <stop offset="28%" stopColor="#94a3b8" />
              <stop offset="42%" stopColor="#f1f5f9" />
              <stop offset="58%" stopColor="#cbd5e1" />
              <stop offset="78%" stopColor="#475569" />
              <stop offset="92%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            {/* Active Highlighted Shaft Gradient */}
            <linearGradient id={`${uid}-shaft-active`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#78350f" />
              <stop offset="15%" stopColor="#d97706" />
              <stop offset="35%" stopColor="#fef3c7" />
              <stop offset="55%" stopColor="#f59e0b" />
              <stop offset="80%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#451a03" />
            </linearGradient>

            {/* Circular Sheared Top Face Metallic Bevel */}
            <linearGradient id={`${uid}-top-face`} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="25%" stopColor="#e2e8f0" />
              <stop offset="55%" stopColor="#ffffff" />
              <stop offset="85%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>

            {/* Active Sheared Top Face Bevel */}
            <linearGradient id={`${uid}-top-active`} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="30%" stopColor="#fef3c7" />
              <stop offset="65%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>

            {/* Steel Tie Strap Gradient */}
            <linearGradient id={`${uid}-strap`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="30%" stopColor="#64748b" />
              <stop offset="50%" stopColor="#e2e8f0" />
              <stop offset="70%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
          </defs>

          {/* Ground Contact Shadow */}
          <ellipse
            cx="186"
            cy="362"
            rx="145"
            ry="24"
            fill={`url(#${uid}-ground-shadow)`}
            opacity="0.8"
          />

          {/* Render All 12 Rods by Layer */}
          {BUNDLE_RODS.map((rod, idx) => {
            const isHovered = activeRodId === rod.id;
            const isAnyHovered = activeRodId !== null;
            const opacity = isAnyHovered && !isHovered ? 0.65 : 1;

            // Compute target X/Y offsets based on viewMode
            let targetX = 0;
            let targetY = 0;

            if (viewMode === 'spread') {
              // Fan out rods horizontally in staggered formation
              const spreadX = (idx - 5.5) * 14;
              const spreadY = (idx % 2 === 0 ? -12 : 12);
              targetX = spreadX;
              targetY = spreadY;
            } else if (viewMode === 'wave') {
              // Sinusoidal wave cascade
              targetY = Math.sin((idx / BUNDLE_RODS.length) * Math.PI * 2 + waveSeed) * 22;
            }

            // Height and rib calculation
            const ribSpacing = 11;
            const numRibs = Math.floor(rod.height / ribSpacing);

            return (
              <motion.g
                key={rod.id}
                onMouseEnter={() => setActiveRodId(rod.id)}
                onMouseLeave={() => setActiveRodId(null)}
                className="cursor-pointer"
                animate={
                  shouldReduceMotion
                    ? { y: targetY, x: targetX, opacity }
                    : isHovered
                    ? {
                        y: targetY - 32,
                        x: targetX,
                        opacity: 1,
                        scale: 1.04,
                      }
                    : viewMode === 'bundle'
                    ? {
                        y: [
                          targetY - rod.idleAmplitude,
                          targetY + rod.idleAmplitude,
                          targetY - rod.idleAmplitude,
                        ],
                        x: targetX,
                        opacity,
                        scale: 1,
                      }
                    : {
                        y: targetY,
                        x: targetX,
                        opacity,
                        scale: 1,
                      }
                }
                transition={
                  isHovered
                    ? { type: 'spring', stiffness: 400, damping: 22 }
                    : viewMode === 'bundle'
                    ? {
                        y: {
                          duration: rod.idleDuration,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        },
                        opacity: { duration: 0.3 },
                      }
                    : {
                        type: 'spring',
                        stiffness: 260,
                        damping: 24,
                        delay: idx * 0.04,
                      }
                }
              >
                {/* 1. Rod Cast Shadow onto neighbors */}
                <ellipse
                  cx={rod.cx + 5}
                  cy={rod.topY + rod.height}
                  rx={rod.rx * 1.1}
                  ry={rod.ry * 0.8}
                  fill="#000000"
                  opacity="0.3"
                />

                {/* 2. Cylindrical Main Shaft */}
                <path
                  d={`
                    M ${rod.cx - rod.rx} ${rod.topY}
                    L ${rod.cx + rod.rx} ${rod.topY}
                    L ${rod.cx + rod.rx} ${rod.topY + rod.height}
                    A ${rod.rx} ${rod.ry} 0 0 1 ${rod.cx - rod.rx} ${rod.topY + rod.height}
                    Z
                  `}
                  fill={isHovered ? `url(#${uid}-shaft-active)` : `url(#${uid}-shaft-steel)`}
                  stroke={isHovered ? '#f59e0b' : '#334155'}
                  strokeWidth="0.75"
                />

                {/* 3. Transverse Deformed Ribs (Grade 75 Lugs) */}
                {Array.from({ length: numRibs }).map((_, rIdx) => {
                  const ryPos = rod.topY + 16 + rIdx * ribSpacing;
                  if (ryPos >= rod.topY + rod.height - 8) return null;

                  return (
                    <g key={rIdx} pointerEvents="none">
                      {/* Rib top highlight ridge */}
                      <path
                        d={`
                          M ${rod.cx - rod.rx + 1} ${ryPos - 2}
                          Q ${rod.cx} ${ryPos + rod.ry * 0.85 - 2} ${rod.cx + rod.rx - 1} ${ryPos - 2}
                        `}
                        fill="none"
                        stroke={isHovered ? '#fef3c7' : '#ffffff'}
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        opacity={isHovered ? 0.95 : 0.75}
                      />
                      {/* Rib bottom shadow groove */}
                      <path
                        d={`
                          M ${rod.cx - rod.rx + 1} ${ryPos}
                          Q ${rod.cx} ${ryPos + rod.ry * 0.85} ${rod.cx + rod.rx - 1} ${ryPos}
                        `}
                        fill="none"
                        stroke="#090d16"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        opacity="0.7"
                      />
                    </g>
                  );
                })}

                {/* 4. Longitudinal Side Seam Spine */}
                <line
                  x1={rod.cx - rod.rx * 0.65}
                  y1={rod.topY + 2}
                  x2={rod.cx - rod.rx * 0.65}
                  y2={rod.topY + rod.height}
                  stroke={isHovered ? '#fef3c7' : '#f1f5f9'}
                  strokeWidth="1"
                  opacity={isHovered ? 0.7 : 0.35}
                  pointerEvents="none"
                />

                {/* 5. Sheared Cut Circular Top Face */}
                <ellipse
                  cx={rod.cx}
                  cy={rod.topY}
                  rx={rod.rx}
                  ry={rod.ry}
                  fill={isHovered ? `url(#${uid}-top-active)` : `url(#${uid}-top-face)`}
                  stroke={isHovered ? '#ffffff' : '#cbd5e1'}
                  strokeWidth={isHovered ? '1.8' : '1'}
                />

                {/* Beveled Rim Glint on Top Edge */}
                <ellipse
                  cx={rod.cx}
                  cy={rod.topY}
                  rx={rod.rx - 2}
                  ry={rod.ry - 1.2}
                  fill="none"
                  stroke={isHovered ? '#ffffff' : '#f8fafc'}
                  strokeWidth="0.75"
                  opacity="0.8"
                  pointerEvents="none"
                />

                {/* Hover indicator ring on top face */}
                {isHovered && !shouldReduceMotion && (
                  <motion.ellipse
                    cx={rod.cx}
                    cy={rod.topY}
                    rx={rod.rx + 3}
                    ry={rod.ry + 2}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                    initial={{ scale: 0.9, opacity: 1 }}
                    animate={{ scale: 1.3, opacity: 0 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
                    pointerEvents="none"
                  />
                )}
              </motion.g>
            );
          })}

          {/* Heavy Steel Strapping Tie Band (Holding the cluster at mid-height) */}
          {viewMode === 'bundle' && (
            <g pointerEvents="none" className="transition-opacity duration-500">
              <path
                d="M 88 285 Q 186 312 284 285"
                fill="none"
                stroke={`url(#${uid}-strap)`}
                strokeWidth="10"
                strokeLinecap="round"
                opacity="0.9"
              />
              <path
                d="M 88 285 Q 186 312 284 285"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1.5"
                strokeDasharray="6 4"
                opacity="0.6"
              />

              {/* Central Seal Badge on the strap */}
              <rect
                x="160"
                y="292"
                width="52"
                height="16"
                rx="4"
                fill="#0f172a"
                stroke="#f59e0b"
                strokeWidth="1.2"
              />
              <text
                x="186"
                y="303"
                textAnchor="middle"
                fontSize="7.5"
                fontWeight="bold"
                fill="#f59e0b"
                letterSpacing="0.1em"
              >
                G75 PRIME
              </text>
            </g>
          )}
        </svg>

        {/* Live Interactive Floating Tooltip HUD above hovered rod */}
        <AnimatePresence>
          {activeRod && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-none absolute top-1 left-1/2 -translate-x-1/2 z-40 rounded-2xl border border-ember/50 bg-panel/95 p-3.5 shadow-2xl backdrop-blur-xl text-center min-w-[220px]"
            >
              <div className="flex items-center justify-between gap-2 border-b border-line/60 pb-2">
                <span className="font-display text-base font-bold text-ember">
                  {t(activeRod.label, activeRod.amLabel)}
                </span>
                <span className="rounded-full bg-ember/15 px-2 py-0.5 text-[0.65rem] font-bold text-ember uppercase">
                  Grade 75
                </span>
              </div>

              <div className="mt-2 text-left space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-mute">{t('Weight / 12m:', 'ክብደት / 12ሜ፡')}</span>
                  <span className="font-mono font-bold text-ink">{activeRod.weightPer12m} kg</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-mute">{t('Pcs / Quintal:', 'ብዛት / ኩንታል፡')}</span>
                  <span className="font-mono font-bold text-ink">~{activeRod.pcsPerQuintal} pcs</span>
                </div>
                <div className="pt-1.5 border-t border-line/40 text-[0.72rem] text-mute">
                  <span className="text-ink font-semibold">{t(activeRod.use, activeRod.amUse)}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Hint */}
      <div className="mt-1 flex items-center gap-2 text-[0.72rem] text-mute">
        <Info className="h-3.5 w-3.5 text-ember shrink-0" />
        <span>
          {t(
            'Hover any rod to inspect diameter, mass & structural application.',
            'የማንኛውንም ብረት ልኬትና ክብደት ለማየት በላዩ ላይ ያሳልፉ።'
          )}
        </span>
      </div>
    </div>
  );
}
