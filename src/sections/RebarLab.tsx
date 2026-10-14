import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  Building,
  Check,
  CheckCircle2,
  ChevronRight,
  Eye,
  FileSpreadsheet,
  Hammer,
  HelpCircle,
  Info,
  Layers,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Volume2,
  VolumeX,
  Zap,
} from 'lucide-react';
import { EASE, Reveal, SectionHead } from '../ui';
import { useApp } from '../context/AppContext';
import { REBAR_CONVERSION_TABLE } from '../data';

export type PartId = 'footing' | 'column' | 'beam' | 'slab' | 'stair';

export interface PartConfig {
  id: PartId;
  stepNumber: number;
  label: string;
  amLabel: string;
  tagline: string;
  amTagline: string;
  description: string;
  amDescription: string;
  engineeringTip: string;
  amEngineeringTip: string;
  recommendedSizes: string[];
  acceptableSizes: string[];
  incompatibleSizes: string[];
  bestSize: string;
  defaultSize: string;
}

export const LAB_PARTS: PartConfig[] = [
  {
    id: 'footing',
    stepNumber: 1,
    label: 'Footing & Foundation',
    amLabel: 'የመሠረት ማሰሪያ (Footing)',
    tagline: 'The seismic anchor to bedrock',
    amTagline: 'ከመሬት ጋር የሚደረግ ጽኑ ትስስር',
    description:
      'Everything the house carries ends up here. A dense two-way cage of stout deformed bars spreads high column loads evenly into the soil — preventing punch-through shear and uneven settlement.',
    amDescription:
      'የህንጻው አጠቃላይ ክብደት እዚህ ያርፋል። ጠንካራ ባለሁለት አቅጣጫ የሬባር መረብ ክብደቱን ወደ መሬቱ እኩል በማሰራጨት ስንጥቆችንና መደላደልን ይከላከላል።',
    engineeringTip:
      'EBCS standard recommends minimum 50mm concrete cover and 90° hooked anchorages to prevent moisture corrosion and punching shear.',
    amEngineeringTip:
      'በኢትዮጵያ የግንባታ መመሪያ መሠረት ዝገትን ለመከላከል ቢያንስ 50ሚሜ የኮንክሪት ሽፋን (cover) እና የ90 ዲግሪ መታጠፊያ እንዲኖረው ይመከራል።',
    recommendedSizes: ['14mm', '16mm', '20mm'],
    acceptableSizes: ['12mm'],
    incompatibleSizes: ['06mm Coil', '08mm'],
    bestSize: '16mm',
    defaultSize: '16mm',
  },
  {
    id: 'column',
    stepNumber: 2,
    label: 'Columns & Staffa Stirrups',
    amLabel: 'የህንጻ አምዶችና ስታፋ (Columns)',
    tagline: 'The vertical spine carrying compression',
    amTagline: 'የህንጻው ዋና ደጋፊ ምሰሶ',
    description:
      'Vertical high-tensile longitudinal bars take massive axial gravity loads, while closely tied 6mm steel coils (Staffa) confine the core concrete and prevent lateral bar buckling under earthquake shear.',
    amDescription:
      'የቁም ብረቶች የፎቆቹን ክብደት በየደረጃው ሲሸከሙ፤ በ6ሚሜ ስታፋ ጥቅል በጥብቅ የታሰሩ ቀለበቶች ብረቶቹ እንዳይጣመሙና የመሬት መንቀጥቀጥ ጫናን እንዲቋቋሙ ያደርጋሉ።',
    engineeringTip:
      'Stirrup spacing must be tightened to 100mm near column-beam joints (critical seismic zones) with 135° hook bends.',
    amEngineeringTip:
      'የስታፋ ማሰሪያ ክፍተት በመገጣጠሚያዎች አካባቢ ወደ 100ሚሜ መጠጋጋት አለበት፤ የ135 ዲግሪ የደህንነት ማጠፊያም ግዴታ ነው።',
    recommendedSizes: ['16mm', '20mm', '24mm'],
    acceptableSizes: ['14mm'],
    incompatibleSizes: ['06mm Coil', '08mm', '10mm'],
    bestSize: '20mm',
    defaultSize: '20mm',
  },
  {
    id: 'beam',
    stepNumber: 3,
    label: 'Beams & Lintels',
    amLabel: 'የወለልና የመሬት ጋሪ (Beams)',
    tagline: 'The horizontal flexural bridge',
    amTagline: 'በአምዶች መካከል ያለ ድልድይ',
    description:
      'Bottom tensile rebars fight sag and flexure at mid-span, while top bars resist negative bending moments over columns. High-tensile shear links absorb diagonal splitting tension.',
    amDescription:
      'የታችኛው የብረት አደራደር መተጣጠፍንና መስመጥን ሲከላከል፤ የላይኛው ብረት ደግሞ በአምዶቹ ራስ ላይ የሚፈጠረውን የጉልበት ጫና ይቋቋማል።',
    engineeringTip:
      'Ensure proper development lap length (Ld ≥ 40 bar diameters) where beams intersect column cores.',
    amEngineeringTip:
      'ቢሞች ከአምድ ጋር በሚገናኙበት ነጥብ ላይ በቂ የመደራረቢያ ርዝመት (Ld ≥ 40 እጥፍ የብረት ውፍረት) መኖሩን ያረጋግጡ።',
    recommendedSizes: ['14mm', '16mm', '20mm'],
    acceptableSizes: ['12mm'],
    incompatibleSizes: ['06mm Coil', '08mm'],
    bestSize: '16mm',
    defaultSize: '16mm',
  },
  {
    id: 'slab',
    stepNumber: 4,
    label: 'Suspended Floor & Roof Slab',
    amLabel: 'ጠፍጣፋ ወለልና ጣሪያ (Slabs)',
    tagline: 'The continuous live-load platform',
    amTagline: 'የወለልና ጣሪያ መደላድል',
    description:
      'A dense orthotropic rebar mesh spaced at 150-200mm distributes furniture, live occupancy, and dead loads smoothly into surrounding beams without deflection or hairline cracking.',
    amDescription:
      'በየ150-200ሚሜ ልዩነት የሚዘረጋው የሬባር መረብ የሰዎችን፣ የዕቃዎችንና የወለሉን ክብደት ያለምንም ዝቅጠት በቀጥታ ወደ ጋሪዎች (Beams) ያስተላልፋል።',
    engineeringTip:
      'Use rebar spacer chairs to keep the top mesh elevated during concrete pour for maximum lever arm depth.',
    amEngineeringTip:
      'ኮንክሪት በሚሞላበት ወቅት የላይኛው የብረት መረብ ዝቅ እንዳይል የብረት ቼር (spacer chairs) መጠቀም ወሳኝ ነው።',
    recommendedSizes: ['08mm', '10mm', '12mm'],
    acceptableSizes: ['14mm'],
    incompatibleSizes: ['06mm Coil', '24mm', '32mm'],
    bestSize: '10mm',
    defaultSize: '10mm',
  },
  {
    id: 'stair',
    stepNumber: 5,
    label: 'Cantilever Dog-Legged Staircase',
    amLabel: 'የደረጃ መዋቅር (Stairs)',
    tagline: 'The dynamic circulation spine',
    amTagline: 'አስተማማኝ መወጣጫ',
    description:
      'Waist slab inclined rebars run the entire slope while riser distribution steel ties the stepped concrete flight. Engineered to feel stiff, vibration-free, and safe under continuous traffic.',
    amDescription:
      'በተዳፋቱ የሚዘረጋው ዋና ብረት የደረጃውን ውፍረትና የሰዎችን እንቅስቃሴ በሙሉ ያለምንም መንቀጥቀጥ በጽናት ይሸከማል።',
    engineeringTip:
      'Anchor the top and bottom flight reinforcement deeply into beam cores with cranked hooks to resist dynamic foot-traffic vibration.',
    amEngineeringTip:
      'የደረጃው የላይና የታች ጫፎች ከመሬትና ከወለል ጋሪዎች ጋር በጥልቅ ታስረው መዋሃድ አለባቸው።',
    recommendedSizes: ['12mm', '14mm', '16mm'],
    acceptableSizes: ['10mm'],
    incompatibleSizes: ['06mm Coil', '24mm', '32mm'],
    bestSize: '12mm',
    defaultSize: '12mm',
  },
];

export const CATALOG_REBARS = [
  { size: '06mm Coil', mm: 6, label: '6mm Coil (Staffa)', amLabel: '6ሚሜ ስታፋ ጥቅል', category: 'stirrup', weight12m: 'Coil ~25kg', unitWt: '0.222 kg/m', pcsQuintal: 'Coil bundle' },
  { size: '08mm', mm: 8, label: '8mm Deformed Bar', amLabel: '8ሚሜ ሬባር', category: 'slab-dist', weight12m: '4.74 kg', unitWt: '0.395 kg/m', pcsQuintal: '~21 pcs' },
  { size: '10mm', mm: 10, label: '10mm Deformed Bar', amLabel: '10ሚሜ ሬባር', category: 'slab-main', weight12m: '7.40 kg', unitWt: '0.617 kg/m', pcsQuintal: '~13.5 pcs' },
  { size: '12mm', mm: 12, label: '12mm Deformed Bar', amLabel: '12ሚሜ ሬባር', category: 'standard', weight12m: '10.66 kg', unitWt: '0.888 kg/m', pcsQuintal: '~9.4 pcs' },
  { size: '14mm', mm: 14, label: '14mm Deformed Bar', amLabel: '14ሚሜ ሬባር', category: 'heavy', weight12m: '14.52 kg', unitWt: '1.210 kg/m', pcsQuintal: '~6.9 pcs' },
  { size: '16mm', mm: 16, label: '16mm Deformed Bar', amLabel: '16ሚሜ ሬባር', category: 'heavy', weight12m: '18.96 kg', unitWt: '1.580 kg/m', pcsQuintal: '~5.3 pcs' },
  { size: '20mm', mm: 20, label: '20mm Deformed Bar', amLabel: '20ሚሜ ሬባር', category: 'structural', weight12m: '29.64 kg', unitWt: '2.470 kg/m', pcsQuintal: '~3.4 pcs' },
  { size: '24mm', mm: 24, label: '24mm Deformed Bar', amLabel: '24ሚሜ ሬባር', category: 'high-rise', weight12m: '42.66 kg', unitWt: '3.550 kg/m', pcsQuintal: '~2.3 pcs' },
  { size: '32mm', mm: 32, label: '32mm Deformed Bar', amLabel: '32ሚሜ ሬባር', category: 'mega-infra', weight12m: '75.72 kg', unitWt: '6.310 kg/m', pcsQuintal: '~1.3 pcs' },
];

export interface StructuralQuoteItem {
  partId: PartId;
  partLabel: string;
  amPartLabel: string;
  size: string;
  defaultQty: number;
  unit: 'Quintals' | 'Tons' | 'Pcs';
  weightPer12mKg?: number | string;
  unitWeightKgM?: string;
  pcsPerQuintal?: string;
}

export type QuotePrefill = {
  size: string;
  part: string;
  message: string;
  ts: number;
  isFullHouse?: boolean;
  integrityScore?: number;
  items?: StructuralQuoteItem[];
};

// Synthesize pleasant structural metallic feedback without external audio files
function playTone(freq: number, duration: number, type: OscillatorType = 'triangle', gainLevel = 0.15) {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(gainLevel, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Ignore audio restrictions
  }
}

export default function RebarLab({ onQuote }: { onQuote: (p: QuotePrefill) => void }) {
  const { theme, t } = useApp();
  const prefersReducedMotion = useReducedMotion();
  const sectionId = useId();

  // Color tokens
  const isDark = theme === 'dark';
  const blueprintLine = isDark ? 'rgba(244, 241, 234, 0.28)' : 'rgba(31, 42, 68, 0.24)';
  const blueprintGrid = isDark ? 'rgba(244, 241, 234, 0.05)' : 'rgba(31, 42, 68, 0.05)';
  const rebarEmber = '#f57c00';
  const rebarGold = '#ffb74d';
  const concreteFill = isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(31, 42, 68, 0.035)';
  const concreteSolid = isDark ? 'rgba(30, 41, 59, 0.85)' : 'rgba(226, 232, 240, 0.85)';

  // Gamified house state: which parts are built and with what rebar diameter
  const [builtChoices, setBuiltChoices] = useState<Record<PartId, string | null>>({
    footing: null,
    column: null,
    beam: null,
    slab: null,
    stair: null,
  });

  const [activePartId, setActivePartId] = useState<PartId>('footing');
  const [viewMode, setViewMode] = useState<'xray' | 'concrete'>('xray');
  const [isStressTesting, setIsStressTesting] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [justReinforced, setJustReinforced] = useState<PartId | null>(null);
  const [showBOMModal, setShowBOMModal] = useState(false);

  // Spark burst effect particles
  const [sparks, setSparks] = useState<{ id: number; x: number; y: number }[]>([]);

  const activePart = useMemo(
    () => LAB_PARTS.find((p) => p.id === activePartId) || LAB_PARTS[0],
    [activePartId]
  );

  // Count how many parts are built
  const builtCount = useMemo(
    () => Object.values(builtChoices).filter(Boolean).length,
    [builtChoices]
  );

  const progressPercent = Math.round((builtCount / LAB_PARTS.length) * 100);

  // Calculate structural integrity score based on engineering quality of selected rebars
  const integrityScore = useMemo(() => {
    let score = 0;
    LAB_PARTS.forEach((part) => {
      const chosen = builtChoices[part.id];
      if (!chosen) return;
      if (part.recommendedSizes.includes(chosen)) {
        score += 20; // Perfect match
      } else if (part.acceptableSizes.includes(chosen)) {
        score += 14; // Acceptable match
      } else {
        score += 6; // Poor match
      }
    });
    return Math.min(100, score);
  }, [builtChoices]);

  // Handle rebar selection for current step
  const handleSelectRebar = (part: PartConfig, size: string) => {
    if (soundEnabled) {
      playTone(880, 0.12, 'sine', 0.2);
      window.setTimeout(() => playTone(1320, 0.15, 'triangle', 0.15), 60);
    }

    setBuiltChoices((prev) => ({
      ...prev,
      [part.id]: size,
    }));

    setJustReinforced(part.id);
    window.setTimeout(() => setJustReinforced(null), 1200);

    // Trigger visual spark burst
    const newSpark = { id: Date.now(), x: Math.random() * 20 - 10, y: Math.random() * 20 - 10 };
    setSparks((prev) => [...prev.slice(-6), newSpark]);

    // Automatically advance to the next unbuilt part if available
    const nextUnbuilt = LAB_PARTS.find(
      (p) => p.id !== part.id && !builtChoices[p.id]
    );
    if (nextUnbuilt) {
      window.setTimeout(() => {
        setActivePartId(nextUnbuilt.id);
      }, 450);
    } else if (builtCount + 1 >= LAB_PARTS.length && soundEnabled) {
      // Fanfare when all 5 parts are built!
      window.setTimeout(() => {
        playTone(523.25, 0.2, 'triangle', 0.2);
        window.setTimeout(() => playTone(659.25, 0.2, 'triangle', 0.2), 120);
        window.setTimeout(() => playTone(783.99, 0.25, 'triangle', 0.25), 240);
        window.setTimeout(() => playTone(1046.5, 0.4, 'triangle', 0.3), 360);
      }, 500);
    }
  };

  // Run dynamic load / earthquake stress test simulation
  const triggerStressTest = () => {
    if (isStressTesting) return;
    setIsStressTesting(true);
    if (soundEnabled) {
      playTone(220, 0.35, 'sawtooth', 0.1);
      window.setTimeout(() => playTone(330, 0.35, 'sine', 0.12), 250);
      window.setTimeout(() => playTone(440, 0.4, 'triangle', 0.15), 500);
    }
    window.setTimeout(() => {
      setIsStressTesting(false);
    }, 4500);
  };

  // Reset the house to build from scratch
  const resetHouse = () => {
    setBuiltChoices({
      footing: null,
      column: null,
      beam: null,
      slab: null,
      stair: null,
    });
    setActivePartId('footing');
    if (soundEnabled) {
      playTone(400, 0.1, 'sine', 0.15);
    }
  };

  // Prefill entire house bill of materials to Quote
  const sendFullHouseToQuote = () => {
    const defaultQtys: Record<PartId, number> = {
      footing: 25,
      column: 35,
      beam: 25,
      slab: 30,
      stair: 10,
    };

    const items: StructuralQuoteItem[] = LAB_PARTS.map((p) => {
      const size = builtChoices[p.id] || p.bestSize;
      const spec = REBAR_CONVERSION_TABLE.find((s) => s.diameter === size);
      return {
        partId: p.id,
        partLabel: p.label,
        amPartLabel: p.amLabel,
        size,
        defaultQty: defaultQtys[p.id] || 25,
        unit: 'Quintals',
        weightPer12mKg: spec?.weightPer12mKg,
        unitWeightKgM: spec?.unitWeightKgM,
        pcsPerQuintal: spec?.pcsPerQuintal,
      };
    });

    // Also include 6mm Staffa coil for stirrups
    const coilSpec = REBAR_CONVERSION_TABLE.find((s) => s.diameter === '6mm');
    items.push({
      partId: 'column',
      partLabel: 'Column Stirrups (Staffa 6mm Coil)',
      amPartLabel: 'የአምድ ስታፋ ጥቅል (6ሚሜ)',
      size: '06mm Coil',
      defaultQty: 10,
      unit: 'Quintals',
      weightPer12mKg: coilSpec?.weightPer12mKg || 'Coil ~25kg',
      unitWeightKgM: coilSpec?.unitWeightKgM || '0.222 kg/m',
      pcsPerQuintal: coilSpec?.pcsPerQuintal || 'Coil bundle',
    });

    const lines = items.map(
      (it) => `• ${it.partLabel} (${it.size}): ${it.defaultQty} ${it.unit}`
    );

    const fullMessage = `Hello Yegna Trading — I configured a complete structural frame in the Interactive Structural Lab with the following itemized bill of quantities:\n\n${lines.join(
      '\n'
    )}\n\nStructural Integrity: ${integrityScore}%.\nPlease quote certified Grade 75 rebars with site delivery schedule.`;

    const summarySizes = Array.from(new Set(items.map((it) => it.size))).join(' + ');

    onQuote({
      size: summarySizes || '16mm',
      part: 'Complete House Structural Frame',
      message: fullMessage,
      ts: Date.now(),
      isFullHouse: true,
      integrityScore,
      items,
    });
  };

  // Send single active part to quote
  const sendSinglePartToQuote = (part: PartConfig, size: string) => {
    const spec = REBAR_CONVERSION_TABLE.find((s) => s.diameter === size);
    const item: StructuralQuoteItem = {
      partId: part.id,
      partLabel: part.label,
      amPartLabel: part.amLabel,
      size,
      defaultQty: 25,
      unit: 'Quintals',
      weightPer12mKg: spec?.weightPer12mKg,
      unitWeightKgM: spec?.unitWeightKgM,
      pcsPerQuintal: spec?.pcsPerQuintal,
    };

    onQuote({
      size,
      part: part.label,
      message: `Hello Yegna — please quote ${size} Grade 75 deformed rebar for the ${part.label.toLowerCase()} of my building project. I can provide the bar bending schedule upon confirmation.`,
      ts: Date.now(),
      isFullHouse: false,
      items: [item],
    });
  };

  // Hotspot coordinates for interactive pins
  const hotspots: Record<PartId, { x: number; y: number }> = {
    footing: { x: 155, y: 440 },
    column: { x: 155, y: 260 },
    beam: { x: 380, y: 245 },
    slab: { x: 380, y: 105 },
    stair: { x: 485, y: 345 },
  };

  return (
    <section
      id="structural-lab"
      className="texture-noise relative overflow-hidden py-20 sm:py-28"
      aria-labelledby={`${sectionId}-heading`}
    >
      {/* Background ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_520px_at_50%_15%,rgba(245,124,0,0.07),transparent_65%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header & Mode Toolbar */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <SectionHead
              eyebrow={t('Interactive Structural Lab', 'የሬባር ምህንድስና ላብራቶሪ')}
              title={t('Build A Real House,', 'እውነተኛ ቤት ይገንቡ፤')}
              accent={t('Bar by Bar.', 'በእያንዳንዱ ብረት።')}
              sub={t(
                'Experience how a Grade 75 reinforced concrete structure comes together. Choose the exact rebar diameter for each structural stage, test load integrity, and send the schedule straight to quotation.',
                'የግሬድ 75 ኮንክሪት ህንጻ መዋቅር እንዴት እንደሚቆም ደረጃ በደረጃ ይለማመዱ። ለእያንዳንዱ ክፍል ተስማሚውን የብረት መጠን በመምረጥ የመሸከም አቅሙን ይፈትሹ፤ በቀጥታም ወደ ዋጋ መጠየቂያ ይላኩት።'
              )}
            />
          </div>

          {/* Gamified Score & Action Hub */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Audio Toggle */}
            <button
              type="button"
              onClick={() => setSoundEnabled((v) => !v)}
              className="border-line bg-panel hover:border-ember text-ink flex h-11 w-11 items-center justify-center rounded-2xl border shadow-sm transition-all"
              title={soundEnabled ? 'Mute Steel Audio FX' : 'Enable Steel Audio FX'}
              aria-label="Toggle structural audio sound effects"
            >
              {soundEnabled ? (
                <Volume2 className="text-ember h-4 w-4" />
              ) : (
                <VolumeX className="text-mute h-4 w-4" />
              )}
            </button>

            {/* View Mode Toggle (X-Ray Rebar vs Concrete Pour) */}
            <div className="border-line bg-panel flex items-center rounded-2xl border p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setViewMode('xray')}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  viewMode === 'xray'
                    ? 'bg-ember text-white shadow-sm'
                    : 'text-mute hover:text-ink'
                }`}
              >
                <Zap className="h-3.5 w-3.5" />
                <span>{t('X-Ray Rebar', 'የብረት አደራደር')}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('concrete')}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  viewMode === 'concrete'
                    ? 'bg-ember text-white shadow-sm'
                    : 'text-mute hover:text-ink'
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                <span>{t('Solid Concrete', 'የተሞላ ኮንክሪት')}</span>
              </button>
            </div>

            {/* Stress Test Simulation Button */}
            <button
              type="button"
              onClick={triggerStressTest}
              disabled={isStressTesting}
              className={`group font-display flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-xs sm:text-sm font-bold transition-all shadow-sm ${
                isStressTesting
                  ? 'border-amber bg-amber/15 text-amber ring-2 ring-amber/30 animate-pulse'
                  : 'border-line bg-panel hover:border-ember text-ink hover:text-ember'
              }`}
            >
              <Activity
                className={`h-4 w-4 transition-transform ${
                  isStressTesting ? 'animate-spin text-amber' : 'text-ember group-hover:scale-110'
                }`}
              />
              <span>
                {isStressTesting
                  ? t('Simulating Seismic Stress…', 'የክብደት ጫናን በመሞከር ላይ…')
                  : t('Test Structural Load', 'የክብደት ጫናን ፈትሽ')}
              </span>
            </button>

            {/* Reset Construction */}
            {builtCount > 0 && (
              <button
                type="button"
                onClick={resetHouse}
                className="border-line bg-panel hover:border-red-400 text-mute hover:text-red-500 flex h-11 w-11 items-center justify-center rounded-2xl border shadow-sm transition-all"
                title={t('Reset Construction', 'ግንባታውን እንደገና ጀምር')}
                aria-label="Reset house construction"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Gamified Construction Status Bar */}
        <div className="border-line bg-panel/80 card-glow mt-8 rounded-3xl border p-4 sm:p-5 backdrop-blur-md">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Step Indicators */}
            <div className="flex flex-1 flex-wrap items-center gap-2">
              <span className="font-display text-mute mr-2 text-xs font-bold uppercase tracking-wider">
                {t('Building Stages:', 'የግንባታ ደረጃዎች፡')}
              </span>
              {LAB_PARTS.map((part) => {
                const isBuilt = Boolean(builtChoices[part.id]);
                const isCurrent = activePartId === part.id;
                const chosenSize = builtChoices[part.id];

                return (
                  <button
                    key={part.id}
                    type="button"
                    onClick={() => setActivePartId(part.id)}
                    className={`group relative flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                      isCurrent
                        ? 'border-ember bg-ember/10 text-ember font-bold ring-2 ring-ember/30'
                        : isBuilt
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'border-line bg-panel2/60 text-mute hover:border-line/80 hover:text-ink'
                    }`}
                  >
                    <span
                      className={`grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold ${
                        isBuilt
                          ? 'bg-emerald-500 text-white'
                          : isCurrent
                          ? 'bg-ember text-white'
                          : 'bg-panel border border-line text-mute'
                      }`}
                    >
                      {isBuilt ? <Check className="h-3 w-3" /> : part.stepNumber}
                    </span>
                    <span>{t(part.label.split(' ')[0], part.amLabel.split(' ')[0])}</span>
                    {chosenSize && (
                      <span className="font-mono rounded bg-emerald-500/20 px-1 py-0.2 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                        {chosenSize}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Structural Integrity Meter */}
            <div className="flex items-center gap-4 self-end sm:self-center">
              <div className="text-right">
                <p className="text-mute text-[11px] font-medium">
                  {t('Structural Integrity', 'የመዋቅር ጥንካሬ')}
                </p>
                <div className="flex items-center justify-end gap-1.5">
                  <span className="font-display text-ink text-base font-bold sm:text-lg">
                    {integrityScore}%
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      integrityScore >= 90
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                        : integrityScore >= 60
                        ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                        : 'bg-panel2 text-mute'
                    }`}
                  >
                    {integrityScore >= 95
                      ? t('Grade 75 Certified', 'ፕሪሚየም ጥራት')
                      : integrityScore >= 80
                      ? t('Building Code Pass', 'ደረጃውን የጠበቀ')
                      : integrityScore >= 40
                      ? t('In Progress', 'በሂደት ላይ')
                      : t('Draft Blueprint', 'ንድፍ')}
                  </span>
                </div>
              </div>

              {/* Circular gauge */}
              <div className="relative grid h-12 w-12 place-items-center">
                <svg className="h-12 w-12 -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-line stroke-current"
                    strokeWidth="3.2"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <motion.path
                    className="text-ember stroke-current"
                    strokeWidth="3.2"
                    strokeDasharray={`${integrityScore}, 100`}
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    initial={{ strokeDasharray: '0, 100' }}
                    animate={{ strokeDasharray: `${integrityScore}, 100` }}
                    transition={{ duration: 0.6, ease: EASE }}
                  />
                </svg>
                <ShieldCheck
                  className={`absolute h-5 w-5 ${
                    integrityScore >= 80 ? 'text-ember' : 'text-mute'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Progress bar line */}
          <div className="bg-line/40 mt-3.5 h-1.5 w-full overflow-hidden rounded-full">
            <motion.div
              className="from-amber bg-gradient-to-r to-ember h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: EASE }}
            />
          </div>
        </div>

        {/* 100% Construction Complete Callout */}
        <AnimatePresence>
          {builtCount === LAB_PARTS.length && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="border-emerald-500/30 bg-emerald-500/10 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl border p-5 sm:p-6 shadow-md backdrop-blur-md"
            >
              <div className="flex items-center gap-3.5">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-500 text-white shadow-lg">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-display text-ink text-base sm:text-lg font-bold">
                    {t('Structural Frame 100% Erected & Certified!', 'የህንጻው ዋና መዋቅር 100% ተጠናቋል!')}
                  </h4>
                  <p className="text-mute text-xs sm:text-sm">
                    {t(
                      'All 5 critical structural stages are reinforced. You can test seismic load paths or transfer the complete bill of quantities to quotation.',
                      'ሁሉም 5ቱ ዋና መዋቅሮች በግሬድ 75 ጥራት ተጠናቀዋል። የክብደት ጫናውን መፈተሽ ወይም የተሟላውን የብረት ዝርዝር ወደ ዋጋ መጠየቂያ መውሰድ ይችላሉ።'
                    )}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={triggerStressTest}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-2xl border border-line bg-panel hover:border-ember text-ink px-4 py-2.5 text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <Activity className="h-4 w-4 text-ember" />
                  <span>{t('Simulate Load', 'ጫናውን ፈትሽ')}</span>
                </button>

                <button
                  type="button"
                  onClick={sendFullHouseToQuote}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-2xl bg-ember hover:bg-ember/90 text-white px-5 py-2.5 text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  <span>{t('Quote Full House', 'የሙሉውን ዋጋ ጠይቅ')}</span>
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Stage Grid: Interactive SVG House Canvas & Inspection/Selection Panel */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.22fr_0.78fr]">
          {/* Architectural House SVG Diagram */}
          <div className="border-line bg-panel card-glow texture-grid relative flex flex-col justify-between overflow-hidden rounded-3xl border shadow-xl">
            {/* Top Canvas Bar with Dimension Badges & Quick Controls */}
            <div className="border-line bg-panel/75 flex items-center justify-between border-b px-5 py-3 text-xs backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Building className="text-ember h-4 w-4" />
                <span className="font-display text-ink font-semibold">
                  {t('G+1 Structural RC Blueprint', 'የህንጻው ዋና ኮንክሪት መዋቅር (RC Frame)')}
                </span>
                <span className="text-mute hidden sm:inline">• EBCS / ASTM A615</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono text-mute hidden text-[11px] md:inline">
                  {t('Grid Span: 4.80m × 3.20m', 'የስፋት ልኬት: 4.80ሜ × 3.20ሜ')}
                </span>
                {builtCount === LAB_PARTS.length && (
                  <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    <Sparkles className="h-3 w-3" />
                    {t('Ready For Quote', 'ለውል የተዘጋጀ')}
                  </span>
                )}
              </div>
            </div>

            {/* SVG Visual Stage */}
            <div className="relative p-2 sm:p-4">
              <svg
                viewBox="0 0 760 520"
                className="relative w-full overflow-visible select-none"
                role="img"
                aria-label="Interactive reinforced concrete building structure blueprint"
              >
                <defs>
                  {/* Soil layer hatching */}
                  <pattern
                    id="soil-hatch"
                    width="16"
                    height="16"
                    patternUnits="userSpaceOnUse"
                    patternTransform="rotate(45)"
                  >
                    <line x1="0" y1="0" x2="0" y2="16" stroke={blueprintLine} strokeWidth="1" opacity="0.4" />
                  </pattern>

                  {/* Concrete stipple pattern */}
                  <pattern id="concrete-dots" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="4" cy="4" r="1.2" fill={blueprintLine} opacity="0.3" />
                    <circle cx="14" cy="12" r="1" fill={blueprintLine} opacity="0.25" />
                    <circle cx="10" cy="18" r="1.5" fill={blueprintLine} opacity="0.3" />
                  </pattern>

                  {/* Linear Rebar Metallic Gradient */}
                  <linearGradient id="rebar-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#b45309" />
                    <stop offset="50%" stopColor="#f57c00" />
                    <stop offset="100%" stopColor="#ffb74d" />
                  </linearGradient>

                  {/* Load Flow Glow Filter */}
                  <filter id="glow-ember" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Grid Blueprint Reference Lines */}
                <g opacity="0.35">
                  <line x1="40" y1="80" x2="720" y2="80" stroke={blueprintGrid} strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="40" y1="230" x2="720" y2="230" stroke={blueprintGrid} strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="40" y1="380" x2="720" y2="380" stroke={blueprintGrid} strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="160" y1="40" x2="160" y2="480" stroke={blueprintGrid} strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="600" y1="40" x2="600" y2="480" stroke={blueprintGrid} strokeWidth="1" strokeDasharray="4 4" />
                </g>

                {/* Sub-Soil Strata & Excavation Bedrock Layer */}
                <rect x="30" y="450" width="700" height="50" fill="url(#soil-hatch)" />
                <line x1="20" y1="450" x2="740" y2="450" stroke={blueprintLine} strokeWidth="2.2" />

                {/* Depth & Excavation pit hatches */}
                {[
                  { x1: 70, x2: 250 },
                  { x1: 510, x2: 690 },
                ].map((pit, idx) => (
                  <g key={`pit-${idx}`}>
                    <path
                      d={`M${pit.x1} 450 L${pit.x1 + 10} 488 L${pit.x2 - 10} 488 L${pit.x2} 450`}
                      fill="none"
                      stroke={blueprintLine}
                      strokeWidth="1.2"
                      strokeDasharray="3 3"
                    />
                  </g>
                ))}

                {/* ======================================================== */}
                {/* 1. FOOTINGS (FOUNDATION PADS) */}
                {/* ======================================================== */}
                <g
                  id="svg-part-footing"
                  className="cursor-pointer transition-opacity duration-300"
                  onClick={() => setActivePartId('footing')}
                  style={{
                    opacity: activePartId === 'footing' ? 1 : builtChoices.footing ? 0.9 : 0.45,
                  }}
                >
                  {[
                    { x: 80, y: 420, cx: 160 },
                    { x: 520, y: 420, cx: 600 },
                  ].map((f, i) => {
                    const isBuilt = Boolean(builtChoices.footing);
                    const chosen = builtChoices.footing;
                    const isOptimal = LAB_PARTS[0].recommendedSizes.includes(chosen || '');

                    return (
                      <g key={`footing-${i}`}>
                        {/* Concrete Pad Outline */}
                        <rect
                          x={f.x}
                          y={f.y}
                          width="160"
                          height="40"
                          rx="4"
                          fill={viewMode === 'concrete' && isBuilt ? concreteSolid : concreteFill}
                          stroke={activePartId === 'footing' ? rebarEmber : blueprintLine}
                          strokeWidth={activePartId === 'footing' ? '2.5' : '1.8'}
                        />

                        {/* Stipple when poured */}
                        {viewMode === 'concrete' && isBuilt && (
                          <rect x={f.x} y={f.y} width="160" height="40" fill="url(#concrete-dots)" opacity="0.6" />
                        )}

                        {/* Rebar Cage (Bottom 2-way mat with 90° anchor hooks) */}
                        <g>
                          {/* Bottom Layer 1: Horizontal Ribbed Bars */}
                          <path
                            d={`M${f.x + 12} ${f.y + 16} L${f.x + 14} ${f.y + 30} L${f.x + 146} ${f.y + 30} L${f.x + 148} ${f.y + 16}`}
                            fill="none"
                            stroke={isBuilt ? (isOptimal ? rebarEmber : rebarGold) : blueprintLine}
                            strokeWidth={isBuilt ? (chosen === '20mm' ? '3.5' : chosen === '16mm' ? '3' : '2.2') : '1.5'}
                            strokeDasharray={isBuilt ? 'none' : '4 3'}
                          />
                          <path
                            d={`M${f.x + 12} ${f.y + 20} L${f.x + 18} ${f.y + 24} L${f.x + 142} ${f.y + 24} L${f.x + 148} ${f.y + 20}`}
                            fill="none"
                            stroke={isBuilt ? (isOptimal ? rebarEmber : rebarGold) : blueprintLine}
                            strokeWidth={isBuilt ? (chosen === '20mm' ? '3.5' : chosen === '16mm' ? '3' : '2.2') : '1.5'}
                            strokeDasharray={isBuilt ? 'none' : '4 3'}
                          />

                          {/* Transverse Cross Dots representing perpendicular rebar mat */}
                          {[f.x + 28, f.x + 50, f.x + 72, f.x + 94, f.x + 116, f.x + 138].map((px) => (
                            <circle
                              key={`dot-${px}`}
                              cx={px}
                              cy={f.y + 27}
                              r={isBuilt ? '2.5' : '1.8'}
                              fill={isBuilt ? rebarEmber : blueprintLine}
                            />
                          ))}

                          {/* Starter column dowel bars (L-bends into footing) */}
                          <path
                            d={`M${f.cx - 12} ${f.y + 28} L${f.cx - 12} ${f.y - 10} M${f.cx + 12} ${f.y + 28} L${f.cx + 12} ${f.y - 10}`}
                            fill="none"
                            stroke={isBuilt ? rebarEmber : blueprintLine}
                            strokeWidth="2"
                          />
                        </g>

                        {/* Footing Label */}
                        <text
                          x={f.x + 80}
                          y={f.y + 54}
                          textAnchor="middle"
                          fill={activePartId === 'footing' ? rebarEmber : blueprintLine}
                          fontSize="10"
                          fontFamily="monospace"
                          fontWeight="600"
                        >
                          {isBuilt ? `F${i + 1}: ${chosen}` : `F${i + 1}: Footing Pad`}
                        </text>
                      </g>
                    );
                  })}
                </g>

                {/* ======================================================== */}
                {/* 2. COLUMNS & STAFFA STIRRUPS */}
                {/* ======================================================== */}
                <g
                  id="svg-part-column"
                  className="cursor-pointer transition-opacity duration-300"
                  onClick={() => setActivePartId('column')}
                  style={{
                    opacity: activePartId === 'column' ? 1 : builtChoices.column ? 0.9 : 0.45,
                  }}
                >
                  {[
                    { x: 144, cx: 160, label: 'C1' },
                    { x: 584, cx: 600, label: 'C2' },
                  ].map((col, idx) => {
                    const isBuilt = Boolean(builtChoices.column);
                    const chosen = builtChoices.column;
                    const isOptimal = LAB_PARTS[1].recommendedSizes.includes(chosen || '');
                    const barWidth = isBuilt ? (chosen === '24mm' ? 3.5 : chosen === '20mm' ? 3 : 2.2) : 1.5;

                    return (
                      <g key={`col-${idx}`}>
                        {/* Concrete Column Shaft */}
                        <rect
                          x={col.x}
                          y="90"
                          width="32"
                          height="330"
                          fill={viewMode === 'concrete' && isBuilt ? concreteSolid : concreteFill}
                          stroke={activePartId === 'column' ? rebarEmber : blueprintLine}
                          strokeWidth={activePartId === 'column' ? '2.5' : '1.8'}
                        />

                        {/* Stipple if poured */}
                        {viewMode === 'concrete' && isBuilt && (
                          <rect x={col.x} y="90" width="32" height="330" fill="url(#concrete-dots)" opacity="0.6" />
                        )}

                        {/* Longitudinal Main Vertical Rebars (4 heavy corner rods) */}
                        {[col.x + 6, col.x + 13, col.x + 19, col.x + 26].map((lx, rIdx) => (
                          <line
                            key={`col-bar-${lx}`}
                            x1={lx}
                            y1="82"
                            x2={lx}
                            y2="425"
                            stroke={isBuilt ? (isOptimal ? rebarEmber : rebarGold) : blueprintLine}
                            strokeWidth={barWidth}
                            strokeDasharray={isBuilt ? 'none' : '4 3'}
                          />
                        ))}

                        {/* Staffa Stirrups Rings (High-tensile 6mm ties spaced along column height) */}
                        {[
                          105, 125, 145, 175, 205, 235, 265, 295, 325, 355, 385, 405,
                        ].map((sy) => (
                          <g key={`stirrup-${col.x}-${sy}`}>
                            <line
                              x1={col.x + 4}
                              y1={sy}
                              x2={col.x + 28}
                              y2={sy}
                              stroke={isBuilt ? rebarGold : blueprintLine}
                              strokeWidth={isBuilt ? '1.8' : '1'}
                              opacity={isBuilt ? '0.9' : '0.4'}
                            />
                            {/* 135-degree seismic hook detail */}
                            {isBuilt && (
                              <line
                                x1={col.x + 28}
                                y1={sy}
                                x2={col.x + 24}
                                y2={sy - 4}
                                stroke={rebarGold}
                                strokeWidth="1.4"
                              />
                            )}
                          </g>
                        ))}

                        <text
                          x={col.cx}
                          y="435"
                          textAnchor="middle"
                          fill={activePartId === 'column' ? rebarEmber : blueprintLine}
                          fontSize="10"
                          fontFamily="monospace"
                          fontWeight="600"
                        >
                          {isBuilt ? `${col.label}: ${chosen}` : `${col.label}: Column`}
                        </text>
                      </g>
                    );
                  })}
                </g>

                {/* ======================================================== */}
                {/* 3. BEAMS (PLINTH & INTERMEDIATE FLOORS) */}
                {/* ======================================================== */}
                <g
                  id="svg-part-beam"
                  className="cursor-pointer transition-opacity duration-300"
                  onClick={() => setActivePartId('beam')}
                  style={{
                    opacity: activePartId === 'beam' ? 1 : builtChoices.beam ? 0.9 : 0.45,
                  }}
                >
                  {/* Mid-span Beam (Y: 230, Height: 26) */}
                  {(() => {
                    const isBuilt = Boolean(builtChoices.beam);
                    const chosen = builtChoices.beam;
                    const isOptimal = LAB_PARTS[2].recommendedSizes.includes(chosen || '');
                    const barWidth = isBuilt ? (chosen === '20mm' ? 3.4 : chosen === '16mm' ? 2.8 : 2.2) : 1.5;

                    return (
                      <g>
                        {/* Concrete Beam Profile */}
                        <rect
                          x="130"
                          y="228"
                          width="500"
                          height="28"
                          rx="3"
                          fill={viewMode === 'concrete' && isBuilt ? concreteSolid : concreteFill}
                          stroke={activePartId === 'beam' ? rebarEmber : blueprintLine}
                          strokeWidth={activePartId === 'beam' ? '2.5' : '1.8'}
                        />

                        {viewMode === 'concrete' && isBuilt && (
                          <rect x="130" y="228" width="500" height="28" fill="url(#concrete-dots)" opacity="0.6" />
                        )}

                        {/* Top Compression Rebars */}
                        <line
                          x1="136"
                          y1="234"
                          x2="624"
                          y2="234"
                          stroke={isBuilt ? (isOptimal ? rebarEmber : rebarGold) : blueprintLine}
                          strokeWidth={barWidth}
                          strokeDasharray={isBuilt ? 'none' : '4 3'}
                        />

                        {/* Bottom Tension Rebars (Heavy flexural steel) */}
                        <line
                          x1="136"
                          y1="248"
                          x2="624"
                          y2="248"
                          stroke={isBuilt ? (isOptimal ? rebarEmber : rebarGold) : blueprintLine}
                          strokeWidth={barWidth}
                          strokeDasharray={isBuilt ? 'none' : '4 3'}
                        />

                        {/* Vertical Shear Links / Beam Stirrups */}
                        {[
                          150, 175, 205, 240, 280, 330, 380, 430, 480, 520, 555, 585, 610,
                        ].map((bx) => (
                          <line
                            key={`beam-link-${bx}`}
                            x1={bx}
                            y1="230"
                            x2={bx}
                            y2="254"
                            stroke={isBuilt ? rebarGold : blueprintLine}
                            strokeWidth={isBuilt ? '1.5' : '1'}
                            opacity={isBuilt ? '0.85' : '0.4'}
                          />
                        ))}

                        <text
                          x="380"
                          y="246"
                          textAnchor="middle"
                          fill={activePartId === 'beam' ? rebarEmber : blueprintLine}
                          fontSize="10"
                          fontFamily="monospace"
                          fontWeight="700"
                        >
                          {isBuilt ? `B1: ${chosen} (Grade 75)` : 'B1: Floor Beam'}
                        </text>
                      </g>
                    );
                  })()}
                </g>

                {/* ======================================================== */}
                {/* 4. SUSPENDED FLOOR & ROOF SLAB */}
                {/* ======================================================== */}
                <g
                  id="svg-part-slab"
                  className="cursor-pointer transition-opacity duration-300"
                  onClick={() => setActivePartId('slab')}
                  style={{
                    opacity: activePartId === 'slab' ? 1 : builtChoices.slab ? 0.9 : 0.45,
                  }}
                >
                  {(() => {
                    const isBuilt = Boolean(builtChoices.slab);
                    const chosen = builtChoices.slab;
                    const isOptimal = LAB_PARTS[3].recommendedSizes.includes(chosen || '');
                    const barWidth = isBuilt ? (chosen === '12mm' ? 2.6 : chosen === '10mm' ? 2.2 : 1.8) : 1.4;

                    return (
                      <g>
                        {/* Slab Architectural Plate */}
                        <rect
                          x="70"
                          y="65"
                          width="620"
                          height="28"
                          rx="3"
                          fill={viewMode === 'concrete' && isBuilt ? concreteSolid : concreteFill}
                          stroke={activePartId === 'slab' ? rebarEmber : blueprintLine}
                          strokeWidth={activePartId === 'slab' ? '2.5' : '1.8'}
                        />

                        {viewMode === 'concrete' && isBuilt && (
                          <rect x="70" y="65" width="620" height="28" fill="url(#concrete-dots)" opacity="0.6" />
                        )}

                        {/* Top & Bottom Continuous Mesh Bars */}
                        <line
                          x1="78"
                          y1="73"
                          x2="682"
                          y2="73"
                          stroke={isBuilt ? (isOptimal ? rebarEmber : rebarGold) : blueprintLine}
                          strokeWidth={barWidth}
                          strokeDasharray={isBuilt ? 'none' : '4 3'}
                        />
                        <line
                          x1="78"
                          y1="85"
                          x2="682"
                          y2="85"
                          stroke={isBuilt ? (isOptimal ? rebarEmber : rebarGold) : blueprintLine}
                          strokeWidth={barWidth}
                          strokeDasharray={isBuilt ? 'none' : '4 3'}
                        />

                        {/* Orthogonal Grid Distribution Rebars (Cross Pins) */}
                        {[
                          90, 120, 150, 180, 210, 240, 270, 300, 330, 360, 390, 420, 450, 480, 510, 540, 570, 600, 630, 660,
                        ].map((sx) => (
                          <circle
                            key={`slab-mesh-${sx}`}
                            cx={sx}
                            cy="79"
                            r={isBuilt ? '2' : '1.4'}
                            fill={isBuilt ? rebarGold : blueprintLine}
                          />
                        ))}

                        <text
                          x="380"
                          y="56"
                          textAnchor="middle"
                          fill={activePartId === 'slab' ? rebarEmber : blueprintLine}
                          fontSize="10"
                          fontFamily="monospace"
                          fontWeight="700"
                        >
                          {isBuilt ? `S1 Slab: ${chosen} Two-Way Mesh` : 'S1: Suspended Roof Slab'}
                        </text>
                      </g>
                    );
                  })()}
                </g>

                {/* ======================================================== */}
                {/* 5. CANTILEVER & DOG-LEGGED STAIRS */}
                {/* ======================================================== */}
                <g
                  id="svg-part-stair"
                  className="cursor-pointer transition-opacity duration-300"
                  onClick={() => setActivePartId('stair')}
                  style={{
                    opacity: activePartId === 'stair' ? 1 : builtChoices.stair ? 0.9 : 0.45,
                  }}
                >
                  {(() => {
                    const isBuilt = Boolean(builtChoices.stair);
                    const chosen = builtChoices.stair;
                    const isOptimal = LAB_PARTS[4].recommendedSizes.includes(chosen || '');
                    const barWidth = isBuilt ? (chosen === '16mm' ? 3.2 : chosen === '12mm' ? 2.5 : 2) : 1.4;

                    return (
                      <g>
                        {/* Stepped Architectural Profile */}
                        <path
                          d="M390 380 L420 380 L420 350 L450 350 L450 320 L480 320 L480 290 L510 290 L510 260 L540 260 L540 230"
                          fill="none"
                          stroke={activePartId === 'stair' ? rebarEmber : blueprintLine}
                          strokeWidth={activePartId === 'stair' ? '2.5' : '1.8'}
                        />

                        {/* Concrete Waist Slab Ramp */}
                        <path
                          d="M375 395 L530 240 L540 250 L385 405 Z"
                          fill={viewMode === 'concrete' && isBuilt ? concreteSolid : concreteFill}
                          stroke={blueprintLine}
                          strokeWidth="1.2"
                        />

                        {/* Main Waist Rebar Slope Anchor */}
                        <line
                          x1="380"
                          y1="398"
                          x2="535"
                          y2="242"
                          stroke={isBuilt ? (isOptimal ? rebarEmber : rebarGold) : blueprintLine}
                          strokeWidth={barWidth}
                          strokeDasharray={isBuilt ? 'none' : '4 3'}
                        />

                        {/* Step distribution tie bars */}
                        {[
                          [410, 365],
                          [440, 335],
                          [470, 305],
                          [500, 275],
                        ].map(([sx, sy], idx) => (
                          <circle
                            key={`stair-node-${idx}`}
                            cx={sx}
                            cy={sy}
                            r={isBuilt ? '2.4' : '1.6'}
                            fill={isBuilt ? rebarGold : blueprintLine}
                          />
                        ))}

                        <text
                          x="475"
                          y="370"
                          textAnchor="middle"
                          fill={activePartId === 'stair' ? rebarEmber : blueprintLine}
                          fontSize="10"
                          fontFamily="monospace"
                          fontWeight="700"
                        >
                          {isBuilt ? `ST1: ${chosen}` : 'ST1: Stairs'}
                        </text>
                      </g>
                    );
                  })()}
                </g>

                {/* ======================================================== */}
                {/* DYNAMIC STRESS TEST / LOAD PATH SIMULATION WAVE */}
                {/* ======================================================== */}
                {isStressTesting && (
                  <g filter="url(#glow-ember)">
                    {/* Roof slab gravity flow down to beam */}
                    <motion.path
                      d="M70 79 L380 79 L690 79"
                      fill="none"
                      stroke="#ff9800"
                      strokeWidth="5"
                      strokeDasharray="16 12"
                      initial={{ strokeDashoffset: 100 }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                    />

                    {/* Beam load transfer into left & right columns */}
                    <motion.path
                      d="M380 242 L160 242 M380 242 L600 242"
                      fill="none"
                      stroke="#ff9800"
                      strokeWidth="5"
                      strokeDasharray="16 12"
                      initial={{ strokeDashoffset: 60 }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    />

                    {/* Column vertical compression thrust down into footings */}
                    <motion.path
                      d="M160 90 L160 440 M600 90 L600 440"
                      fill="none"
                      stroke="#ff5722"
                      strokeWidth="6"
                      strokeDasharray="20 12"
                      initial={{ strokeDashoffset: 120 }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                    />

                    {/* Footing punch dissipation into soil */}
                    <motion.path
                      d="M160 440 L90 470 M160 440 L230 470 M600 440 L530 470 M600 440 L670 470"
                      fill="none"
                      stroke="#ff9800"
                      strokeWidth="4"
                      strokeDasharray="12 8"
                      initial={{ strokeDashoffset: 40 }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ repeat: Infinity, duration: 0.6, ease: 'linear' }}
                    />

                    {/* Joint moment nodes */}
                    {[
                      { x: 160, y: 79 },
                      { x: 600, y: 79 },
                      { x: 160, y: 242 },
                      { x: 600, y: 242 },
                      { x: 160, y: 440 },
                      { x: 600, y: 440 },
                    ].map((pt, pIdx) => (
                      <circle
                        key={`stress-node-${pIdx}`}
                        cx={pt.x}
                        cy={pt.y}
                        r="8"
                        fill="rgba(255, 87, 34, 0.4)"
                        stroke="#ff5722"
                        strokeWidth="2"
                        className="animate-pulse"
                      />
                    ))}
                  </g>
                )}

                {/* ======================================================== */}
                {/* INTERACTIVE HOTSPOT PINS */}
                {/* ======================================================== */}
                {LAB_PARTS.map((part) => {
                  const pt = hotspots[part.id];
                  const isActive = activePartId === part.id;
                  const isBuilt = Boolean(builtChoices[part.id]);

                  return (
                    <motion.g
                      key={`pin-${part.id}`}
                      className="cursor-pointer outline-none"
                      role="button"
                      tabIndex={0}
                      aria-label={`Inspect ${part.label}`}
                      onClick={() => setActivePartId(part.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setActivePartId(part.id);
                        }
                      }}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    >
                      {isActive && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="20"
                          fill="none"
                          stroke={rebarEmber}
                          strokeWidth="1.5"
                          className="animate-ping opacity-60"
                        />
                      )}

                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isActive ? 16 : 13}
                        fill={
                          isBuilt
                            ? '#10b981'
                            : isActive
                            ? rebarEmber
                            : isDark
                            ? '#111827'
                            : '#ffffff'
                        }
                        stroke={isActive ? rebarEmber : isBuilt ? '#10b981' : blueprintLine}
                        strokeWidth={isActive ? '2.5' : '1.8'}
                        className="transition-colors duration-300"
                      />

                      <text
                        x={pt.x}
                        y={pt.y + 4.5}
                        textAnchor="middle"
                        fontSize={isBuilt ? '11' : '12'}
                        fontWeight="800"
                        fill={isBuilt || isActive ? '#ffffff' : isDark ? '#f4f1ea' : '#111827'}
                        style={{ pointerEvents: 'none' }}
                      >
                        {isBuilt ? '✓' : part.stepNumber}
                      </text>
                    </motion.g>
                  );
                })}
              </svg>
            </div>

            {/* Bottom Blueprint Footer Info */}
            <div className="border-line bg-panel2/60 flex flex-wrap items-center justify-between gap-3 border-t px-6 py-3.5 text-xs">
              <p className="text-mute flex items-center gap-2">
                <Info className="text-ember h-3.5 w-3.5 shrink-0" />
                <span>
                  {t(
                    'Tap any number on the frame or select a stage to place and verify your rebar.',
                    'በመዋቅሩ ላይ ያለውን ቁጥር ይጫኑ ወይም ተስማሚውን የሬባር መጠን ይምረጡ።'
                  )}
                </span>
              </p>
              <div className="flex items-center gap-4 text-[11px]">
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  {t('Built Parts', 'የተጠናቀቁ')}: {builtCount}/5
                </span>
                <button
                  type="button"
                  onClick={() => setShowBOMModal(true)}
                  className="hover:text-ember flex items-center gap-1 font-semibold text-ink transition-colors cursor-pointer"
                >
                  <FileSpreadsheet className="text-ember h-3.5 w-3.5" />
                  <span>{t('View Rebar Schedule (BOM)', 'የብረት ዝርዝር መዝገብ')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel: Rebar Selection Rack & Engineering Guidance */}
          <div className="border-line bg-panel card-glow relative flex flex-col justify-between overflow-hidden rounded-3xl border p-6 sm:p-8 shadow-xl">
            {/* Ambient Ember Glow */}
            <div
              className="bg-ember/10 pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full blur-3xl"
              aria-hidden
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={activePart.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="flex h-full flex-col"
              >
                {/* Active Step Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-display rounded-full bg-ember/15 px-3 py-1 text-xs font-bold text-ember">
                      {t(`Stage 0${activePart.stepNumber}`, `ደረጃ 0${activePart.stepNumber}`)}
                    </span>
                    <span className="text-mute text-xs font-semibold">
                      {t(activePart.label, activePart.amLabel)}
                    </span>
                  </div>

                  {builtChoices[activePart.id] && (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{t('Installed', 'ተተክሏል')}</span>
                    </span>
                  )}
                </div>

                {/* Title & Technical Role */}
                <h3 className="font-display text-ink mt-4 text-2xl leading-tight font-bold sm:text-3xl">
                  {t(activePart.tagline, activePart.amTagline)}
                </h3>
                <p className="text-mute mt-3 text-xs leading-relaxed sm:text-sm">
                  {t(activePart.description, activePart.amDescription)}
                </p>

                {/* Civil Engineering Best Practice Tip Box */}
                <div className="border-line bg-panel2/60 mt-4 rounded-2xl border p-3.5 text-xs">
                  <div className="flex items-start gap-2.5">
                    <ShieldCheck className="text-ember mt-0.5 h-4 w-4 shrink-0" />
                    <div>
                      <p className="font-display text-ink font-semibold">
                        {t('Engineering Site Standard', 'የኢንጂነሪንግ ጣቢያ መመሪያ')}
                      </p>
                      <p className="text-mute/90 mt-1 text-[11px] leading-relaxed">
                        {t(activePart.engineeringTip, activePart.amEngineeringTip)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Gamified Rebar Selection Rack (Items We Sell) */}
                <div className="mt-6">
                  <div className="flex items-center justify-between">
                    <p className="font-display text-ink flex items-center gap-2 text-xs font-bold tracking-wide uppercase">
                      <Hammer className="text-ember h-3.5 w-3.5" />
                      <span>
                        {t(
                          'Choose Rebar Specification (Yegna Stock):',
                          'የብረት ዓይነት ይምረጡ (የኛ ትሬዲንግ ክምችት)፡'
                        )}
                      </span>
                    </p>
                    {builtChoices[activePart.id] && (
                      <span className="font-mono text-ember text-xs font-bold">
                        {builtChoices[activePart.id]}
                      </span>
                    )}
                  </div>

                  {/* Rebar Chips Grid */}
                  <div className="relative mt-3 grid grid-cols-3 gap-2 sm:grid-cols-3">
                    {/* Radiant spark particle burst on reinforcement */}
                    {justReinforced === activePart.id && (
                      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-hidden">
                        {[...Array(12)].map((_, i) => {
                          const angle = (i / 12) * Math.PI * 2;
                          const dist = 40 + (i % 3) * 20;
                          const targetX = Math.cos(angle) * dist;
                          const targetY = Math.sin(angle) * dist;
                          return (
                            <motion.div
                              key={`spark-${i}`}
                              initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                              animate={{ opacity: 0, scale: 0, x: targetX, y: targetY }}
                              transition={{ duration: 0.65, ease: 'easeOut' }}
                              className="absolute h-2 w-2 rounded-full bg-amber shadow-[0_0_8px_#ff9800]"
                            />
                          );
                        })}
                      </div>
                    )}
                    {CATALOG_REBARS.map((rod) => {
                      const isSelected = builtChoices[activePart.id] === rod.size;
                      const isRecommended = activePart.recommendedSizes.includes(rod.size);
                      const isAcceptable = activePart.acceptableSizes.includes(rod.size);
                      const isIncompatible = activePart.incompatibleSizes.includes(rod.size);

                      return (
                        <motion.button
                          key={rod.size}
                          type="button"
                          onClick={() => handleSelectRebar(activePart, rod.size)}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className={`relative flex flex-col items-center justify-between rounded-xl border p-2.5 text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'border-ember bg-ember text-white shadow-md ring-2 ring-ember/40'
                              : isRecommended
                              ? 'border-ember/40 bg-ember/5 text-ink hover:border-ember'
                              : isIncompatible
                              ? 'border-line/60 bg-panel2/40 text-mute/60 opacity-70 hover:opacity-100'
                              : 'border-line bg-panel2 text-ink hover:border-line/80'
                          }`}
                        >
                          {/* Visual rebar gauge representation */}
                          <div
                            className={`mb-1.5 h-1.5 rounded-full transition-all ${
                              isSelected
                                ? 'bg-white'
                                : isRecommended
                                ? 'bg-ember'
                                : 'bg-mute/40'
                            }`}
                            style={{ width: `${Math.min(100, rod.mm * 3.4)}%` }}
                          />

                          <span className="font-display text-xs font-bold">{rod.size}</span>
                          <span
                            className={`text-[10px] ${
                              isSelected ? 'text-white/80' : 'text-mute'
                            }`}
                          >
                            {rod.weight12m}
                          </span>

                          {/* Recommended pill badge */}
                          {isRecommended && !isSelected && (
                            <span className="absolute -top-1.5 -right-1.5 rounded-full bg-ember px-1.5 py-0.2 text-[8px] font-extrabold text-white uppercase shadow-sm">
                              {t('Ideal', 'ምርጥ')}
                            </span>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Engineering Feedback on current choice */}
                  {builtChoices[activePart.id] && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 flex items-center gap-2 rounded-xl border border-line bg-panel2 px-3 py-2 text-xs"
                    >
                      {activePart.recommendedSizes.includes(builtChoices[activePart.id]!) ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                          <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                            {t(
                              `Excellent! ${builtChoices[activePart.id]} meets Grade 75 structural criteria for this section.`,
                              `እጅግ በጣም ጥሩ! ${builtChoices[activePart.id]} ለዚህ ክፍል የተሟላ ጥንካሬ ይሰጣል።`
                            )}
                          </span>
                        </>
                      ) : activePart.acceptableSizes.includes(builtChoices[activePart.id]!) ? (
                        <>
                          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
                          <span className="text-amber-700 dark:text-amber-400 font-medium">
                            {t(
                              `Notice: ${builtChoices[activePart.id]} is acceptable for light loads, but ${activePart.bestSize} is recommended for multi-story.`,
                              `ማስታወሻ፡ ${builtChoices[activePart.id]} ለቀላል ሸክም ይሆናል፤ ለፎቅ ግን ${activePart.bestSize} ይመረጣል።`
                            )}
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
                          <span className="text-red-700 dark:text-red-400 font-medium">
                            {t(
                              `Warning: ${builtChoices[activePart.id]} is non-standard for this structural element. Consult consultant.`,
                              `ማስጠንቀቂያ፡ ${builtChoices[activePart.id]} ለዚህ ክፍል ተስማሚ አይደለም።`
                            )}
                          </span>
                        </>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Primary CTA Buttons */}
                <div className="mt-6 pt-4 border-t border-line flex flex-col gap-2.5">
                  {/* Single part quote button */}
                  <button
                    type="button"
                    onClick={() =>
                      sendSinglePartToQuote(
                        activePart,
                        builtChoices[activePart.id] || activePart.bestSize
                      )
                    }
                    className="border-line bg-panel hover:border-ember hover:text-ember text-ink flex w-full items-center justify-center gap-2 rounded-2xl border py-3 text-xs sm:text-sm font-semibold transition-all shadow-sm cursor-pointer"
                  >
                    <span>
                      {t(
                        `Quote ${builtChoices[activePart.id] || activePart.bestSize} for ${activePart.label.split(' ')[0]} Only`,
                        `ለዚህ ክፍል (${builtChoices[activePart.id] || activePart.bestSize}) ብቻ ዋጋ ጠይቅ`
                      )}
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </button>

                  {/* Send Complete House Schedule Button */}
                  <button
                    type="button"
                    onClick={sendFullHouseToQuote}
                    className="group bg-ember hover:bg-ember/90 text-white flex w-full items-center justify-center gap-2.5 rounded-2xl py-3.5 text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
                  >
                    <Building className="h-4 w-4 transition-transform group-hover:scale-110" />
                    <span>
                      {t(
                        'Take Complete House Schedule to Quote Form',
                        'የተገነባውን ሙሉ የህንጻ ብረት ዝርዝር ወደ ቅጹ ውሰድ'
                      )}
                    </span>
                    <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bill of Materials (BOM) Modal / Popout Drawer */}
        <AnimatePresence>
          {showBOMModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="border-line bg-panel max-w-2xl w-full rounded-3xl border p-6 sm:p-8 shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-line pb-4">
                  <div>
                    <h4 className="font-display text-ink text-xl font-bold">
                      {t('Bar Bending Schedule & Bill of Materials', 'የብረት ዝርዝር መዝገብና መለኪያ (BOM)')}
                    </h4>
                    <p className="text-mute text-xs">
                      {t(
                        'Itemized rebar schedule generated from your interactive structural assembly.',
                        'እርስዎ ከገነቡት መዋቅር የተዘጋጀ የሬባር ዝርዝር።'
                      )}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowBOMModal(false)}
                    className="text-mute hover:text-ink text-sm font-bold p-2"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-line text-mute">
                        <th className="py-2.5 font-semibold">{t('Stage & Component', 'ክፍል')}</th>
                        <th className="py-2.5 font-semibold">{t('Selected Bar', 'የተመረጠ ብረት')}</th>
                        <th className="py-2.5 font-semibold">{t('Unit Weight', 'ክብደት በሜትር')}</th>
                        <th className="py-2.5 font-semibold">{t('Weight / 12m', 'ክብደት በ12ሜ')}</th>
                        <th className="py-2.5 font-semibold">{t('Pcs / Quintal', 'በኩንታል')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line/60">
                      {LAB_PARTS.map((p) => {
                        const chosen = builtChoices[p.id] || p.bestSize;
                        const spec = CATALOG_REBARS.find((r) => r.size === chosen);
                        return (
                          <tr key={p.id} className="hover:bg-panel2/50 transition-colors">
                            <td className="py-3 font-medium text-ink">{p.label}</td>
                            <td className="py-3 font-bold text-ember">{chosen}</td>
                            <td className="py-3 font-mono text-mute">{spec?.unitWt || '-'}</td>
                            <td className="py-3 font-mono text-mute">{spec?.weight12m || '-'}</td>
                            <td className="py-3 font-mono text-mute">{spec?.pcsQuintal || '-'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-line pt-4">
                  <div className="text-xs text-mute">
                    {t(
                      'All bars certified Grade 75 conforming to Ethiopian Standards.',
                      'ሁሉም ብረቶች የግሬድ 75 ጥራት ደረጃን ያሟሉ ናቸው።'
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowBOMModal(false);
                      sendFullHouseToQuote();
                    }}
                    className="bg-ember text-white rounded-xl px-5 py-2.5 text-xs font-bold hover:bg-ember/90 transition-all cursor-pointer"
                  >
                    {t('Transfer All to Quote Request', 'ሁሉንም ወደ ዋጋ መጠየቂያ ውሰድ')}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
