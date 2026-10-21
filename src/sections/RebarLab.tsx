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
  Compass,
  Eye,
  FileSpreadsheet,
  Hammer,
  HelpCircle,
  Info,
  Layers,
  RotateCcw,
  Scan,
  ShieldCheck,
  SlidersHorizontal,
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
  sectionDimensions: string;
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
    label: 'Footing & Foundation Pads',
    amLabel: 'የመሠረት ማሰሪያ (Footings)',
    tagline: 'The seismic anchor to bedrock',
    amTagline: 'ከመሬት ጋር የሚደረግ ጽኑ ትስስር',
    description:
      'Everything the house carries ends up here. A dense two-way cage of stout deformed bars spreads high column loads evenly into the soil — preventing punch-through shear and differential settlement.',
    amDescription:
      'የህንጻው አጠቃላይ ክብደት እዚህ ያርፋል። ጠንካራ ባለሁለት አቅጣጫ የሬባር መረብ ክብደቱን ወደ መሬቱ እኩል በማሰራጨት ስንጥቆችንና መደላደልን ይከላከላል።',
    engineeringTip:
      'EBCS standard recommends minimum 50mm concrete cover and 90° hooked anchorages to prevent moisture corrosion and punching shear.',
    amEngineeringTip:
      'በኢትዮጵያ የግንባታ መመሪያ መሠረት ዝገትን ለመከላከል ቢያንስ 50ሚሜ የኮንክሪት ሽፋን (cover) እና የ90 ዲግሪ መታጠፊያ እንዲኖረው ይመከራል።',
    sectionDimensions: '1400 × 1400 × 350 mm',
    recommendedSizes: ['14mm', '16mm', '20mm'],
    acceptableSizes: ['12mm'],
    incompatibleSizes: ['06mm Coil', '08mm'],
    bestSize: '16mm',
    defaultSize: '16mm',
  },
  {
    id: 'column',
    stepNumber: 2,
    label: 'Columns & Staffa Stirrup Cages',
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
    sectionDimensions: '300 × 300 × 3200 mm',
    recommendedSizes: ['16mm', '20mm', '24mm'],
    acceptableSizes: ['14mm'],
    incompatibleSizes: ['06mm Coil', '08mm', '10mm'],
    bestSize: '20mm',
    defaultSize: '20mm',
  },
  {
    id: 'beam',
    stepNumber: 3,
    label: 'Plinth & Inter-Floor Beams',
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
    sectionDimensions: '250 × 400 × 4800 mm',
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
    sectionDimensions: '4800 × 6000 × 150 mm',
    recommendedSizes: ['08mm', '10mm', '12mm'],
    acceptableSizes: ['14mm'],
    incompatibleSizes: ['06mm Coil', '24mm', '32mm'],
    bestSize: '10mm',
    defaultSize: '10mm',
  },
  {
    id: 'stair',
    stepNumber: 5,
    label: 'Dog-Legged Reinforced Staircase',
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
    sectionDimensions: '1000 mm Width · 150 mm Waist',
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

// Acoustic synthesizer for tactile structural audio feedback
function playSoundFX(type: 'rebar' | 'pour' | 'xray' | 'earthquake' | 'fanfare') {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === 'rebar') {
      // Crisp metallic clang + harmonic ring
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1250, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.14);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === 'pour') {
      // Heavy liquid thud & slurry pour sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.36);
    } else if (type === 'xray') {
      // Sci-fi laser ultrasonic scan sweep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(550, ctx.currentTime + 0.22);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.23);
    } else if (type === 'earthquake') {
      // Low rumble seismic oscillation
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(65, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(85, ctx.currentTime + 0.4);
      osc.frequency.linearRampToValueAtTime(45, ctx.currentTime + 0.8);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.85);
    } else if (type === 'fanfare') {
      // 4-note celebration arpeggio
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        window.setTimeout(() => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          gain.gain.setValueAtTime(0.2, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.26);
        }, idx * 100);
      });
    }
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
  const blueprintLine = isDark ? 'rgba(244, 241, 234, 0.35)' : 'rgba(31, 42, 68, 0.3)';
  const blueprintGrid = isDark ? 'rgba(244, 241, 234, 0.05)' : 'rgba(31, 42, 68, 0.05)';
  const rebarEmber = '#f57c00';
  const rebarGold = '#ffb74d';
  const laserCyan = '#00e5ff';

  // Gamified house state: which parts are built and with what rebar diameter
  const [builtChoices, setBuiltChoices] = useState<Record<PartId, string | null>>({
    footing: null,
    column: null,
    beam: null,
    slab: null,
    stair: null,
  });

  const [activePartId, setActivePartId] = useState<PartId>('footing');
  const [viewMode, setViewMode] = useState<'xray' | 'concrete' | 'split'>('xray');
  const [isStressTesting, setIsStressTesting] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [justReinforced, setJustReinforced] = useState<PartId | null>(null);
  const [showBOMModal, setShowBOMModal] = useState(false);

  // Pouring animation trigger
  const [isPouring, setIsPouring] = useState(false);

  // Interactive X-Ray Scanner Wipe Position (0 to 100%)
  const [scanSliderPos, setScanSliderPos] = useState<number>(50);
  const [isAutoScanning, setIsAutoScanning] = useState<boolean>(false);

  // Sparks when reinforcing
  const [sparks, setSparks] = useState<{ id: number; x: number; y: number }[]>([]);

  const [hoveredPartId, setHoveredPartId] = useState<PartId | null>(null);

  const activePart = useMemo(
    () => LAB_PARTS.find((p) => p.id === activePartId) || LAB_PARTS[0],
    [activePartId]
  );

  const hoveredPart = useMemo(
    () => (hoveredPartId ? LAB_PARTS.find((p) => p.id === hoveredPartId) : null),
    [hoveredPartId]
  );

  const nextUnbuiltPart = useMemo(
    () => LAB_PARTS.find((p) => p.id !== activePartId && !builtChoices[p.id]),
    [activePartId, builtChoices]
  );

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

  // Handle rebar selection
  const handleSelectRebar = (part: PartConfig, size: string) => {
    if (soundEnabled) {
      playSoundFX('rebar');
    }

    setBuiltChoices((prev) => ({
      ...prev,
      [part.id]: size,
    }));

    setJustReinforced(part.id);
    window.setTimeout(() => setJustReinforced(null), 1200);

    const newSpark = { id: Date.now(), x: Math.random() * 20 - 10, y: Math.random() * 20 - 10 };
    setSparks((prev) => [...prev.slice(-6), newSpark]);

    const nextUnbuilt = LAB_PARTS.find(
      (p) => p.id !== part.id && !builtChoices[p.id]
    );
    if (nextUnbuilt) {
      window.setTimeout(() => {
        setActivePartId(nextUnbuilt.id);
      }, 450);
    } else if (builtCount + 1 >= LAB_PARTS.length && soundEnabled) {
      window.setTimeout(() => {
        playSoundFX('fanfare');
      }, 500);
    }
  };

  // Switch to Solid Concrete with Fluid Pour Animation
  const switchToConcreteMode = () => {
    if (soundEnabled) playSoundFX('pour');
    setViewMode('concrete');
    setIsPouring(true);
    window.setTimeout(() => setIsPouring(false), 1400);
  };

  // Switch to X-Ray Mode with Electric Laser Scan
  const switchToXRayMode = () => {
    if (soundEnabled) playSoundFX('xray');
    setViewMode('xray');
  };

  // Trigger Split Scanner
  const switchToSplitMode = () => {
    if (soundEnabled) playSoundFX('xray');
    setViewMode('split');
  };

  // Auto-scan sweep across the building
  useEffect(() => {
    if (!isAutoScanning) return;
    const interval = window.setInterval(() => {
      setScanSliderPos((prev) => {
        if (prev >= 98) return 5;
        return prev + 2;
      });
    }, 40);
    return () => window.clearInterval(interval);
  }, [isAutoScanning]);

  // Run dynamic load & seismic earthquake stress test
  const triggerStressTest = () => {
    if (isStressTesting) return;
    setIsStressTesting(true);
    if (soundEnabled) {
      playSoundFX('earthquake');
    }
    window.setTimeout(() => {
      setIsStressTesting(false);
    }, 4500);
  };

  // Reset construction
  const resetHouse = () => {
    setBuiltChoices({
      footing: null,
      column: null,
      beam: null,
      slab: null,
      stair: null,
    });
    setActivePartId('footing');
    if (soundEnabled) playSoundFX('rebar');
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

    const coilSpec = REBAR_CONVERSION_TABLE.find((s) => s.diameter === '6mm');
    items.push({
      partId: 'column',
      partLabel: 'Column Stirrup Ties (Staffa 6mm Coil)',
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

  interface HotspotLayoutItem {
    id: PartId;
    target: { x: number; y: number };
    badge: { x: number; y: number };
    leaderStart: { x: number; y: number };
    leaderEnd: { x: number; y: number };
  }

  // Precision 3D Architectural Hotspot Coordinates & Leader Paths
  const HOTSPOT_LAYOUT: Record<PartId, HotspotLayoutItem> = {
    footing: {
      id: 'footing',
      target: { x: 155, y: 435 },
      badge: { x: 155, y: 474 },
      leaderStart: { x: 155, y: 442 },
      leaderEnd: { x: 155, y: 461 },
    },
    column: {
      id: 'column',
      target: { x: 159, y: 270 },
      badge: { x: 252, y: 270 },
      leaderStart: { x: 178, y: 270 },
      leaderEnd: { x: 185, y: 270 },
    },
    beam: {
      id: 'beam',
      target: { x: 370, y: 225 },
      badge: { x: 370, y: 182 },
      leaderStart: { x: 370, y: 225 },
      leaderEnd: { x: 370, y: 195 },
    },
    slab: {
      id: 'slab',
      target: { x: 270, y: 65 },
      badge: { x: 270, y: 34 },
      leaderStart: { x: 270, y: 65 },
      leaderEnd: { x: 270, y: 47 },
    },
    stair: {
      id: 'stair',
      target: { x: 470, y: 330 },
      badge: { x: 550, y: 348 },
      leaderStart: { x: 470, y: 330 },
      leaderEnd: { x: 483, y: 345 },
    },
  };

  const hotspots: Record<PartId, { x: number; y: number }> = {
    footing: HOTSPOT_LAYOUT.footing.target,
    column: HOTSPOT_LAYOUT.column.target,
    beam: HOTSPOT_LAYOUT.beam.target,
    slab: HOTSPOT_LAYOUT.slab.target,
    stair: HOTSPOT_LAYOUT.stair.target,
  };

  // SVG split cut x position in user units
  const splitCutX = 760 * (scanSliderPos / 100);

  return (
    <section
      id="structural-lab"
      className="texture-noise relative overflow-hidden py-20 sm:py-28"
      aria-labelledby={`${sectionId}-heading`}
    >
      {/* Background ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_520px_at_50%_15%,rgba(245,124,0,0.08),transparent_65%)]"
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
                'Experience how a Grade 75 reinforced concrete structure comes together in real 3D perspective. Switch between X-Ray steel inspection, liquid concrete pour, and live earthquake simulation.',
                'የግሬድ 75 ኮንክሪት ህንጻ መዋቅር በ3D እይታ ደረጃ በደረጃ እንዴት እንደሚቆም ይለማመዱ። የኤክስሬይ ብረት ምርመራን፣ የፈሳሽ ኮንክሪት ሙላትን እና የመሬት መንቀጥቀጥ ጫናን በተግባር ይፈትሹ።'
              )}
            />
          </div>

          {/* Gamified Score & Action Hub */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Audio Toggle */}
            <button
              type="button"
              onClick={() => setSoundEnabled((v) => !v)}
              className="border-line bg-panel hover:border-ember text-ink flex h-11 w-11 items-center justify-center rounded-2xl border shadow-sm transition-all cursor-pointer"
              title={soundEnabled ? 'Mute Audio FX' : 'Enable Audio FX'}
              aria-label="Toggle structural audio sound effects"
            >
              {soundEnabled ? (
                <Volume2 className="text-ember h-4 w-4" />
              ) : (
                <VolumeX className="text-mute h-4 w-4" />
              )}
            </button>

            {/* View Mode Switcher: 3 Spectacular Modes */}
            <div className="border-line bg-panel flex items-center rounded-2xl border p-1 shadow-sm">
              <button
                type="button"
                onClick={switchToXRayMode}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'xray'
                    ? 'bg-ember text-white shadow-sm ring-1 ring-ember/40'
                    : 'text-mute hover:text-ink'
                }`}
              >
                <Zap className="h-3.5 w-3.5" />
                <span>{t('X-Ray Rebar', 'የኤክስሬይ ብረት')}</span>
              </button>

              <button
                type="button"
                onClick={switchToConcreteMode}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'concrete'
                    ? 'bg-ember text-white shadow-sm ring-1 ring-ember/40'
                    : 'text-mute hover:text-ink'
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                <span>{t('Pour Concrete', 'ኮንክሪት ሙላ')}</span>
              </button>

              <button
                type="button"
                onClick={switchToSplitMode}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'split'
                    ? 'bg-cyan-500 text-white shadow-sm ring-1 ring-cyan-500/40'
                    : 'text-mute hover:text-ink'
                }`}
              >
                <Scan className="h-3.5 w-3.5 text-cyan-400" />
                <span>{t('X-Ray Scanner', 'ሌዘር ስካነር')}</span>
              </button>
            </div>

            {/* Seismic & Stress Simulation Button */}
            <button
              type="button"
              onClick={triggerStressTest}
              disabled={isStressTesting}
              className={`group font-display flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer ${
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
                  ? t('Simulating Earth Tremor (0.18g)…', 'የመሬት መንቀጥቀጥ ጫና በመሞከር ላይ…')
                  : t('Test Structural Load', 'የክብደት ጫናን ፈትሽ')}
              </span>
            </button>

            {/* Reset Construction */}
            {builtCount > 0 && (
              <button
                type="button"
                onClick={resetHouse}
                className="border-line bg-panel hover:border-red-400 text-mute hover:text-red-500 flex h-11 w-11 items-center justify-center rounded-2xl border shadow-sm transition-all cursor-pointer"
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

        {/* 100% Construction Complete Callout Banner */}
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

        {/* Main Stage Grid: 3D Architectural Isometric Canvas & Inspection Panel */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.22fr_0.78fr]">
          {/* 3D Architectural Blueprint Canvas with Motion Vibration and X-Ray Shader */}
          <div className="border-line bg-panel card-glow texture-grid relative flex flex-col justify-between overflow-hidden rounded-3xl border shadow-xl">
            {/* Canvas Header Bar with Inspection Tools */}
            <div className="border-line bg-panel/75 flex flex-wrap items-center justify-between border-b px-5 py-3 text-xs backdrop-blur-sm gap-2">
              <div className="flex items-center gap-2">
                <Compass className="text-ember h-4 w-4 shrink-0" />
                <span className="font-display text-ink font-semibold">
                  {viewMode === 'xray'
                    ? t('3D CAD X-Ray Rebar Cage Core', 'የ3D ኤክስሬይ ሬባር መዋቅር')
                    : viewMode === 'concrete'
                    ? t('Poured Structural Concrete (Architectural Cast)', 'የተሞላ የኮንክሪት ህንጻ (Architectural Cast)')
                    : t('Interactive X-Ray Laser Inspection Visor', 'ተንቀሳቃሽ የሌዘር ኤክስሬይ መመርመሪያ')}
                </span>
              </div>

              {/* Split Scanner Controls if in Split Mode */}
              {viewMode === 'split' && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAutoScanning((v) => !v)}
                    className={`rounded-lg border px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                      isAutoScanning
                        ? 'border-cyan-400 bg-cyan-400/20 text-cyan-500'
                        : 'border-line text-mute hover:text-ink'
                    }`}
                  >
                    {isAutoScanning ? t('Stop Auto Scan', 'ስካኑን አቁም') : t('Auto Sweep Scan', 'በራስ-ሰር ቃኝ')}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={scanSliderPos}
                    onChange={(e) => {
                      setIsAutoScanning(false);
                      setScanSliderPos(Number(e.target.value));
                    }}
                    className="w-24 accent-cyan-400 cursor-pointer"
                    title="Slide to peel concrete and reveal rebar"
                  />
                </div>
              )}
            </div>

            {/* Interactive Mission Guidance Strip */}
            <div className="border-line bg-ember/10 border-b px-4 sm:px-5 py-2.5 text-xs flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 text-ink">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ember opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-ember"></span>
                </span>
                <span className="font-medium text-xs">
                  {hoveredPart
                    ? t(
                        `Inspecting Stage 0${hoveredPart.stepNumber} · ${hoveredPart.label}: ${hoveredPart.sectionDimensions} — Click to configure`,
                        `እየተመለከቱ ነው፡ ደረጃ 0${hoveredPart.stepNumber} · ${hoveredPart.amLabel} — ብረት ለመምረጥ ይጫኑ`
                      )
                    : t(
                        'Click any numbered beacon (1–5) on the building below to select that stage & choose your rebar',
                        'በህንጻው ላይ ያሉትን ቁጥሮች (1-5) በመጫን ለእያንዳንዱ ክፍል የብረት ዓይነት ይምረጡ'
                      )}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] font-bold text-ember font-mono">
                <span className="text-mute">{t('Active Stage:', 'አሁን የተመረጠ፡')}</span>
                <span className="bg-ember text-white rounded-md px-2 py-0.5 shadow-xs">
                  0{activePart.stepNumber} · {t(activePart.label.split(' ')[0], activePart.amLabel.split(' ')[0])}
                </span>
              </div>
            </div>

            {/* Interactive SVG Stage with Motion Earthquake Oscillations */}
            <div className="relative p-2 sm:p-4 overflow-hidden">
              <motion.div
                animate={
                  isStressTesting
                    ? {
                        x: [0, -7, 6, -5, 4, -2, 1, 0],
                        y: [0, 2, -2, 1, 0],
                      }
                    : { x: 0, y: 0 }
                }
                transition={
                  isStressTesting
                    ? {
                        duration: 0.85,
                        repeat: 4,
                        ease: 'easeInOut',
                      }
                    : { duration: 0.2 }
                }
                className="w-full relative"
              >
                <svg
                  viewBox="0 0 760 520"
                  className="relative w-full overflow-visible select-none"
                  role="img"
                  aria-label="3D architectural reinforced concrete building structure"
                >
                  <defs>
                    {/* Soil Bedrock Hatch */}
                    <pattern id="soil-bedrock" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                      <line x1="0" y1="0" x2="0" y2="16" stroke={blueprintLine} strokeWidth="1.2" opacity="0.45" />
                    </pattern>

                    {/* Architectural Concrete Texture with Aggregates */}
                    <pattern id="concrete-surface" width="30" height="30" patternUnits="userSpaceOnUse">
                      <rect width="30" height="30" fill={isDark ? '#1e293b' : '#cbd5e1'} opacity="0.9" />
                      <circle cx="8" cy="8" r="1.5" fill={isDark ? '#334155' : '#94a3b8'} opacity="0.5" />
                      <circle cx="22" cy="18" r="1.8" fill={isDark ? '#0f172a' : '#e2e8f0'} opacity="0.4" />
                      <circle cx="16" cy="26" r="1.2" fill={isDark ? '#334155' : '#64748b'} opacity="0.3" />
                      {/* Formwork panel joint line */}
                      <line x1="0" y1="29.5" x2="30" y2="29.5" stroke={isDark ? '#0f172a' : '#94a3b8'} strokeWidth="0.8" opacity="0.3" />
                    </pattern>

                    {/* Wet Liquid Concrete Pour Wave Gradient */}
                    <linearGradient id="wet-concrete-wave" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ff9800" stopOpacity="0.4" />
                      <stop offset="40%" stopColor={isDark ? '#334155' : '#94a3b8'} stopOpacity="0.95" />
                      <stop offset="100%" stopColor={isDark ? '#1e293b' : '#64748b'} stopOpacity="1" />
                    </linearGradient>

                    {/* Grade 75 Deformed Rebar Steel Gradient */}
                    <linearGradient id="steel-rebar-rod" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#b45309" />
                      <stop offset="35%" stopColor="#f57c00" />
                      <stop offset="70%" stopColor="#ffb74d" />
                      <stop offset="100%" stopColor="#b45309" />
                    </linearGradient>

                    {/* Rebar Rib Spiral Pattern */}
                    <pattern id="rebar-rib-spiral" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
                      <line x1="0" y1="0" x2="0" y2="6" stroke="#b45309" strokeWidth="1.6" opacity="0.75" />
                    </pattern>

                    {/* Cyan Laser Scanner Line Gradient */}
                    <linearGradient id="laser-glow" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#00e5ff" stopOpacity="0" />
                      <stop offset="50%" stopColor="#00e5ff" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
                    </linearGradient>

                    {/* Laser Clip Path for Split Scan Mode */}
                    <clipPath id="split-concrete-clip">
                      <rect x="0" y="0" width={viewMode === 'split' ? splitCutX : viewMode === 'concrete' ? 760 : 0} height="520" />
                    </clipPath>

                    <clipPath id="split-xray-clip">
                      <rect
                        x={viewMode === 'split' ? splitCutX : viewMode === 'xray' ? 0 : 760}
                        y="0"
                        width={viewMode === 'split' ? 760 - splitCutX : viewMode === 'xray' ? 760 : 0}
                        height="520"
                      />
                    </clipPath>
                  </defs>

                  {/* 3D Blueprint CAD Grid */}
                  <g opacity="0.3">
                    <line x1="40" y1="80" x2="720" y2="80" stroke={blueprintGrid} strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="40" y1="230" x2="720" y2="230" stroke={blueprintGrid} strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="40" y1="380" x2="720" y2="380" stroke={blueprintGrid} strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="160" y1="40" x2="160" y2="480" stroke={blueprintGrid} strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="600" y1="40" x2="600" y2="480" stroke={blueprintGrid} strokeWidth="1" strokeDasharray="4 4" />
                  </g>

                  {/* 3D Foundation Excavation Pit & Subsoil Strata */}
                  <rect x="30" y="450" width="700" height="55" fill="url(#soil-bedrock)" />
                  <line x1="20" y1="450" x2="740" y2="450" stroke={blueprintLine} strokeWidth="2.5" />
                  <text x="50" y="495" fill={blueprintLine} fontSize="10" fontFamily="monospace" fontWeight="600">
                    {t('COMPACTED BEDROCK STRATA · 250 kN/m² SOIL BEARING CAPACITY', 'የተጨመቀ የመሠረት አፈር · 250 kN/m²')}
                  </text>

                  {/* ========================================================== */}
                  {/* LAYER A: HIGH-DEFINITION SOLID POURED CONCRETE (3D ARCHITECTURAL) */}
                  {/* ========================================================== */}
                  <g clipPath="url(#split-concrete-clip)">
                    {/* 3D Footing Pads (Solid Cast Concrete with Isometric Depth) */}
                    {[
                      { x: 70, y: 415, w: 170, h: 42, d: 20 },
                      { x: 510, y: 415, w: 170, h: 42, d: 20 },
                    ].map((f, i) => (
                      <g
                        key={`solid-footing-${i}`}
                        className="cursor-pointer transition-all duration-200"
                        onClick={() => {
                          setActivePartId('footing');
                          if (soundEnabled) playSoundFX('rebar');
                        }}
                        onMouseEnter={() => setHoveredPartId('footing')}
                        onMouseLeave={() => setHoveredPartId(null)}
                      >
                        {/* 3D Isometric Top Face */}
                        <polygon
                          points={`${f.x},${f.y} ${f.x + f.d},${f.y - 12} ${f.x + f.w + f.d},${f.y - 12} ${f.x + f.w},${f.y}`}
                          fill={isDark ? '#334155' : '#e2e8f0'}
                          stroke={activePartId === 'footing' ? rebarEmber : isDark ? '#475569' : '#94a3b8'}
                          strokeWidth={activePartId === 'footing' ? '1.8' : '1.2'}
                        />
                        {/* 3D Isometric Right Side Face */}
                        <polygon
                          points={`${f.x + f.w},${f.y} ${f.x + f.w + f.d},${f.y - 12} ${f.x + f.w + f.d},${f.y + f.h - 12} ${f.x + f.w},${f.y + f.h}`}
                          fill={isDark ? '#0f172a' : '#94a3b8'}
                          stroke={activePartId === 'footing' ? rebarEmber : isDark ? '#1e293b' : '#64748b'}
                          strokeWidth={activePartId === 'footing' ? '1.8' : '1.2'}
                        />
                        {/* Front Face with Concrete Texture */}
                        <rect
                          x={f.x}
                          y={f.y}
                          width={f.w}
                          height={f.h}
                          fill="url(#concrete-surface)"
                          stroke={activePartId === 'footing' ? rebarEmber : isDark ? '#475569' : '#64748b'}
                          strokeWidth={activePartId === 'footing' ? '2.2' : '1.8'}
                        />
                        {/* Formwork tie-rod holes */}
                        <circle cx={f.x + 25} cy={f.y + 20} r="2.5" fill={isDark ? '#0f172a' : '#475569'} />
                        <circle cx={f.x + f.w - 25} cy={f.y + 20} r="2.5" fill={isDark ? '#0f172a' : '#475569'} />
                      </g>
                    ))}

                    {/* 3D Columns (Solid Cast Concrete with Front & Side Shading) */}
                    {[
                      { x: 140, y: 85, w: 38, h: 330, d: 16 },
                      { x: 580, y: 85, w: 38, h: 330, d: 16 },
                    ].map((c, i) => (
                      <g
                        key={`solid-col-${i}`}
                        className="cursor-pointer transition-all duration-200"
                        onClick={() => {
                          setActivePartId('column');
                          if (soundEnabled) playSoundFX('rebar');
                        }}
                        onMouseEnter={() => setHoveredPartId('column')}
                        onMouseLeave={() => setHoveredPartId(null)}
                      >
                        {/* Side Shadow Face */}
                        <polygon
                          points={`${c.x + c.w},${c.y} ${c.x + c.w + c.d},${c.y - 10} ${c.x + c.w + c.d},${c.y + c.h - 10} ${c.x + c.w},${c.y + c.h}`}
                          fill={isDark ? '#0f172a' : '#94a3b8'}
                          stroke={activePartId === 'column' ? rebarEmber : isDark ? '#1e293b' : '#64748b'}
                          strokeWidth={activePartId === 'column' ? '1.8' : '1.2'}
                        />
                        {/* Front Face */}
                        <rect
                          x={c.x}
                          y={c.y}
                          width={c.w}
                          height={c.h}
                          fill="url(#concrete-surface)"
                          stroke={activePartId === 'column' ? rebarEmber : isDark ? '#475569' : '#64748b'}
                          strokeWidth={activePartId === 'column' ? '2.2' : '1.8'}
                        />
                        {/* Formwork Panel Joint Seams */}
                        {[165, 245, 325].map((jy) => (
                          <line
                            key={`col-joint-${i}-${jy}`}
                            x1={c.x}
                            y1={jy}
                            x2={c.x + c.w}
                            y2={jy}
                            stroke={isDark ? '#0f172a' : '#475569'}
                            strokeWidth="1.2"
                            opacity="0.6"
                          />
                        ))}
                      </g>
                    ))}

                    {/* 3D Beams (Solid Cast Concrete Spans) */}
                    <g
                      className="cursor-pointer transition-all duration-200"
                      onClick={() => {
                        setActivePartId('beam');
                        if (soundEnabled) playSoundFX('rebar');
                      }}
                      onMouseEnter={() => setHoveredPartId('beam')}
                      onMouseLeave={() => setHoveredPartId(null)}
                    >
                      {/* Top Isometric Face */}
                      <polygon
                        points="120,225 138,213 638,213 620,225"
                        fill={isDark ? '#334155' : '#e2e8f0'}
                        stroke={activePartId === 'beam' ? rebarEmber : isDark ? '#475569' : '#94a3b8'}
                        strokeWidth={activePartId === 'beam' ? '1.8' : '1.2'}
                      />
                      {/* Front Face */}
                      <rect
                        x="120"
                        y="225"
                        width="500"
                        height="32"
                        fill="url(#concrete-surface)"
                        stroke={activePartId === 'beam' ? rebarEmber : isDark ? '#475569' : '#64748b'}
                        strokeWidth={activePartId === 'beam' ? '2.2' : '1.8'}
                      />
                    </g>

                    {/* 3D Suspended Floor Slab (Solid Deck Plate) */}
                    <g
                      className="cursor-pointer transition-all duration-200"
                      onClick={() => {
                        setActivePartId('slab');
                        if (soundEnabled) playSoundFX('rebar');
                      }}
                      onMouseEnter={() => setHoveredPartId('slab')}
                      onMouseLeave={() => setHoveredPartId(null)}
                    >
                      {/* Top Deck Surface */}
                      <polygon
                        points="50,65 72,50 712,50 690,65"
                        fill={isDark ? '#334155' : '#e2e8f0'}
                        stroke={activePartId === 'slab' ? rebarEmber : isDark ? '#475569' : '#94a3b8'}
                        strokeWidth={activePartId === 'slab' ? '2' : '1.5'}
                      />
                      {/* Front Edge Thickness */}
                      <rect
                        x="50"
                        y="65"
                        width="640"
                        height="30"
                        fill="url(#concrete-surface)"
                        stroke={activePartId === 'slab' ? rebarEmber : isDark ? '#475569' : '#64748b'}
                        strokeWidth={activePartId === 'slab' ? '2.2' : '1.8'}
                      />
                    </g>

                    {/* 3D Staircase (Solid Architectural Stepped Concrete) */}
                    <g
                      className="cursor-pointer transition-all duration-200"
                      onClick={() => {
                        setActivePartId('stair');
                        if (soundEnabled) playSoundFX('rebar');
                      }}
                      onMouseEnter={() => setHoveredPartId('stair')}
                      onMouseLeave={() => setHoveredPartId(null)}
                    >
                      {/* Stepped Concrete Risers */}
                      <path
                        d="M380 415 L415 415 L415 380 L450 380 L450 345 L485 345 L485 310 L520 310 L520 275 L555 275 L555 240 L535 240 L360 415 Z"
                        fill="url(#concrete-surface)"
                        stroke={activePartId === 'stair' ? rebarEmber : isDark ? '#475569' : '#64748b'}
                        strokeWidth={activePartId === 'stair' ? '2.2' : '1.8'}
                      />
                      {/* 3D Step Tread Depths */}
                      {[
                        [380, 415, 415],
                        [415, 380, 450],
                        [450, 345, 485],
                        [485, 310, 520],
                        [520, 275, 555],
                      ].map(([rx, ry, rx2], sIdx) => (
                        <polygon
                          key={`step-tread-${sIdx}`}
                          points={`${rx},${ry} ${rx + 12},${ry - 8} ${rx2 + 12},${ry - 8} ${rx2},${ry}`}
                          fill={isDark ? '#334155' : '#e2e8f0'}
                          stroke={activePartId === 'stair' ? rebarEmber : isDark ? '#475569' : '#94a3b8'}
                          strokeWidth="1"
                        />
                      ))}
                    </g>

                    {/* Fluid Concrete Pour Wave Effect when pouring */}
                    {isPouring && (
                      <motion.rect
                        x="0"
                        y="0"
                        width="760"
                        height="520"
                        fill="url(#wet-concrete-wave)"
                        initial={{ opacity: 0.9, y: 300 }}
                        animate={{ opacity: [0.9, 0.4, 0], y: [-50, -200] }}
                        transition={{ duration: 1.3, ease: 'easeOut' }}
                      />
                    )}
                  </g>

                  {/* ========================================================== */}
                  {/* LAYER B: ULTRA-DETAILED X-RAY REBAR CAGES (GRADE 75 DEFORMED STEEL) */}
                  {/* ========================================================== */}
                  <g clipPath="url(#split-xray-clip)">
                    {/* 1. Footing Rebar 3D Double Mat with 90° Hooks */}
                    {[
                      { x: 80, y: 420, cx: 160 },
                      { x: 520, y: 420, cx: 600 },
                    ].map((f, i) => {
                      const isBuilt = Boolean(builtChoices.footing);
                      const chosen = builtChoices.footing || '16mm';
                      const strokeW = chosen === '20mm' ? 4 : chosen === '16mm' ? 3.2 : 2.4;

                      return (
                        <g
                          key={`xray-footing-${i}`}
                          className="cursor-pointer"
                          onClick={() => {
                            setActivePartId('footing');
                            if (soundEnabled) playSoundFX('rebar');
                          }}
                          onMouseEnter={() => setHoveredPartId('footing')}
                          onMouseLeave={() => setHoveredPartId(null)}
                        >
                          {/* Ghost outline of footing */}
                          <rect
                            x={f.x}
                            y={f.y}
                            width="150"
                            height="38"
                            fill="none"
                            stroke={activePartId === 'footing' ? rebarEmber : blueprintLine}
                            strokeWidth={activePartId === 'footing' ? '2' : '1.4'}
                            strokeDasharray="4 4"
                          />

                          {/* Orthogonal Longitudinal Rebar Bars with Hooks */}
                          {[f.y + 16, f.y + 26].map((by) => (
                            <path
                              key={`fbar-${f.x}-${by}`}
                              d={`M${f.x + 8} ${by - 10} L${f.x + 10} ${by} L${f.x + 140} ${by} L${f.x + 142} ${by - 10}`}
                              fill="none"
                              stroke={isBuilt ? 'url(#steel-rebar-rod)' : blueprintLine}
                              strokeWidth={isBuilt ? strokeW : 1.5}
                              strokeDasharray={isBuilt ? 'none' : '4 3'}
                            />
                          ))}

                          {/* Transverse Cross Dots (Mesh orthogonal grid) */}
                          {[f.x + 22, f.x + 44, f.x + 66, f.x + 88, f.x + 110, f.x + 130].map((px) => (
                            <circle
                              key={`f-mesh-${px}`}
                              cx={px}
                              cy={f.y + 26}
                              r={isBuilt ? '2.8' : '1.8'}
                              fill={isBuilt ? rebarGold : blueprintLine}
                            />
                          ))}

                          {/* Column Starter Dowels (L-bars welded into footing) */}
                          <path
                            d={`M${f.cx - 10} ${f.y + 26} L${f.cx - 10} ${f.y - 14} M${f.cx + 10} ${f.y + 26} L${f.cx + 10} ${f.y - 14}`}
                            fill="none"
                            stroke={isBuilt ? rebarEmber : blueprintLine}
                            strokeWidth="2.5"
                          />
                        </g>
                      );
                    })}

                    {/* 2. Column Vertical Deformed Main Bars & Staffa Stirrups */}
                    {[
                      { x: 144, cx: 160 },
                      { x: 584, cx: 600 },
                    ].map((col, idx) => {
                      const isBuilt = Boolean(builtChoices.column);
                      const chosen = builtChoices.column || '20mm';
                      const strokeW = chosen === '24mm' ? 4.2 : chosen === '20mm' ? 3.4 : 2.5;

                      return (
                        <g
                          key={`xray-col-${idx}`}
                          className="cursor-pointer"
                          onClick={() => {
                            setActivePartId('column');
                            if (soundEnabled) playSoundFX('rebar');
                          }}
                          onMouseEnter={() => setHoveredPartId('column')}
                          onMouseLeave={() => setHoveredPartId(null)}
                        >
                          {/* Ghost column shaft */}
                          <rect
                            x={col.x}
                            y="85"
                            width="32"
                            height="335"
                            fill="none"
                            stroke={activePartId === 'column' ? rebarEmber : blueprintLine}
                            strokeWidth={activePartId === 'column' ? '2' : '1.2'}
                            strokeDasharray="4 4"
                          />

                          {/* 4 Heavy Corner Ribbed Rebar Rods */}
                          {[col.x + 5, col.x + 12, col.x + 19, col.x + 27].map((lx) => (
                            <line
                              key={`cbar-${lx}`}
                              x1={lx}
                              y1="75"
                              x2={lx}
                              y2="422"
                              stroke={isBuilt ? 'url(#steel-rebar-rod)' : blueprintLine}
                              strokeWidth={isBuilt ? strokeW : 1.5}
                            />
                          ))}

                          {/* 6mm Staffa Stirrups Rings with 135° Seismic Hooks */}
                          {[
                            98, 118, 138, 168, 198, 228, 258, 288, 318, 348, 378, 398,
                          ].map((sy) => (
                            <g key={`cstirrup-${col.x}-${sy}`}>
                              <line
                                x1={col.x + 3}
                                y1={sy}
                                x2={col.x + 29}
                                y2={sy}
                                stroke={isBuilt ? rebarGold : blueprintLine}
                                strokeWidth={isBuilt ? '2' : '1'}
                              />
                              {isBuilt && (
                                <line
                                  x1={col.x + 29}
                                  y1={sy}
                                  x2={col.x + 24}
                                  y2={sy - 4}
                                  stroke={rebarGold}
                                  strokeWidth="1.6"
                                />
                              )}
                            </g>
                          ))}
                        </g>
                      );
                    })}

                    {/* 3. Beams Top Compression & Bottom Tension Rebars */}
                    {(() => {
                      const isBuilt = Boolean(builtChoices.beam);
                      const chosen = builtChoices.beam || '16mm';
                      const strokeW = chosen === '20mm' ? 4 : chosen === '16mm' ? 3.2 : 2.2;

                      return (
                        <g
                          className="cursor-pointer"
                          onClick={() => {
                            setActivePartId('beam');
                            if (soundEnabled) playSoundFX('rebar');
                          }}
                          onMouseEnter={() => setHoveredPartId('beam')}
                          onMouseLeave={() => setHoveredPartId(null)}
                        >
                          {/* Ghost beam profile */}
                          <rect
                            x="120"
                            y="225"
                            width="520"
                            height="32"
                            fill="none"
                            stroke={activePartId === 'beam' ? rebarEmber : blueprintLine}
                            strokeWidth={activePartId === 'beam' ? '2' : '1.2'}
                            strokeDasharray="4 4"
                          />

                          {/* Top Bars */}
                          <line
                            x1="128"
                            y1="231"
                            x2="632"
                            y2="231"
                            stroke={isBuilt ? 'url(#steel-rebar-rod)' : blueprintLine}
                            strokeWidth={isBuilt ? strokeW : 1.5}
                          />

                          {/* Bottom Tension Bars */}
                          <line
                            x1="128"
                            y1="249"
                            x2="632"
                            y2="249"
                            stroke={isBuilt ? 'url(#steel-rebar-rod)' : blueprintLine}
                            strokeWidth={isBuilt ? strokeW : 1.5}
                          />

                          {/* Shear Stirrups Links */}
                          {[
                            140, 165, 195, 230, 270, 315, 360, 410, 460, 505, 545, 580, 610,
                          ].map((bx) => (
                            <line
                              key={`blink-${bx}`}
                              x1={bx}
                              y1="227"
                              x2={bx}
                              y2="253"
                              stroke={isBuilt ? rebarGold : blueprintLine}
                              strokeWidth={isBuilt ? '1.8' : '1'}
                            />
                          ))}
                        </g>
                      );
                    })()}

                    {/* 4. Suspended Floor Slab Two-Way Mesh */}
                    {(() => {
                      const isBuilt = Boolean(builtChoices.slab);
                      const chosen = builtChoices.slab || '10mm';
                      const strokeW = chosen === '12mm' ? 2.8 : chosen === '10mm' ? 2.2 : 1.8;

                      return (
                        <g
                          className="cursor-pointer"
                          onClick={() => {
                            setActivePartId('slab');
                            if (soundEnabled) playSoundFX('rebar');
                          }}
                          onMouseEnter={() => setHoveredPartId('slab')}
                          onMouseLeave={() => setHoveredPartId(null)}
                        >
                          <rect
                            x="50"
                            y="65"
                            width="640"
                            height="30"
                            fill="none"
                            stroke={activePartId === 'slab' ? rebarEmber : blueprintLine}
                            strokeWidth={activePartId === 'slab' ? '2' : '1.2'}
                            strokeDasharray="4 4"
                          />

                          {/* Top & Bottom Continuous Mesh Bars */}
                          <line
                            x1="60"
                            y1="72"
                            x2="680"
                            y2="72"
                            stroke={isBuilt ? 'url(#steel-rebar-rod)' : blueprintLine}
                            strokeWidth={isBuilt ? strokeW : 1.4}
                          />
                          <line
                            x1="60"
                            y1="86"
                            x2="680"
                            y2="86"
                            stroke={isBuilt ? 'url(#steel-rebar-rod)' : blueprintLine}
                            strokeWidth={isBuilt ? strokeW : 1.4}
                          />

                          {/* Cross Mesh Distribution Pins */}
                          {[
                            80, 110, 140, 170, 200, 230, 260, 290, 320, 350, 380, 410, 440, 470, 500, 530, 560, 590, 620, 650,
                          ].map((sx) => (
                            <circle
                              key={`slab-pin-${sx}`}
                              cx={sx}
                              cy="79"
                              r={isBuilt ? '2.2' : '1.4'}
                              fill={isBuilt ? rebarGold : blueprintLine}
                            />
                          ))}
                        </g>
                      );
                    })()}

                    {/* 5. Staircase Inclined Waist Rebar */}
                    {(() => {
                      const isBuilt = Boolean(builtChoices.stair);
                      const chosen = builtChoices.stair || '12mm';
                      const strokeW = chosen === '16mm' ? 3.5 : chosen === '12mm' ? 2.8 : 2.2;

                      return (
                        <g
                          className="cursor-pointer"
                          onClick={() => {
                            setActivePartId('stair');
                            if (soundEnabled) playSoundFX('rebar');
                          }}
                          onMouseEnter={() => setHoveredPartId('stair')}
                          onMouseLeave={() => setHoveredPartId(null)}
                        >
                          <path
                            d="M380 415 L545 240"
                            fill="none"
                            stroke={isBuilt ? 'url(#steel-rebar-rod)' : blueprintLine}
                            strokeWidth={isBuilt ? strokeW : 1.5}
                          />
                          {[
                            [405, 390],
                            [435, 360],
                            [465, 330],
                            [495, 300],
                            [525, 270],
                          ].map(([sx, sy], idx) => (
                            <circle
                              key={`stair-pin-${idx}`}
                              cx={sx}
                              cy={sy}
                              r={isBuilt ? '2.6' : '1.6'}
                              fill={isBuilt ? rebarGold : blueprintLine}
                            />
                          ))}
                        </g>
                      );
                    })()}
                  </g>

                  {/* ========================================================== */}
                  {/* LAYER C: INTERACTIVE X-RAY LASER SCANNER BEAM (SPLIT MODE) */}
                  {/* ========================================================== */}
                  {viewMode === 'split' && (
                    <g>
                      {/* Laser scanning vertical blade */}
                      <line
                        x1={splitCutX}
                        y1="30"
                        x2={splitCutX}
                        y2="490"
                        stroke={laserCyan}
                        strokeWidth="3"
                        filter="drop-shadow(0 0 6px #00e5ff)"
                      />
                      {/* Laser Glow Ribbon */}
                      <rect
                        x={splitCutX - 16}
                        y="30"
                        width="32"
                        height="460"
                        fill="url(#laser-glow)"
                        pointerEvents="none"
                      />
                      {/* Laser Reticle Target on Scan Line */}
                      <circle cx={splitCutX} cy="245" r="7" fill={laserCyan} />
                      <circle cx={splitCutX} cy="245" r="14" fill="none" stroke={laserCyan} strokeWidth="1.5" className="animate-ping" />
                      <text
                        x={splitCutX + (splitCutX > 500 ? -12 : 12)}
                        y="48"
                        textAnchor={splitCutX > 500 ? 'end' : 'start'}
                        fill={laserCyan}
                        fontSize="10"
                        fontFamily="monospace"
                        fontWeight="800"
                      >
                        {t('◄ CONCRETE | X-RAY REBAR ►', '◄ ኮንክሪት | ሬባር ►')}
                      </text>
                    </g>
                  )}

                  {/* ========================================================== */}
                  {/* LAYER D: DYNAMIC SEISMIC & LOAD PATH STRESS FLOW */}
                  {/* ========================================================== */}
                  {isStressTesting && (
                    <g>
                      {/* Gravity Wave Flows Down */}
                      <motion.path
                        d="M70 79 L380 79 L690 79"
                        fill="none"
                        stroke="#ff5722"
                        strokeWidth="6"
                        strokeDasharray="16 12"
                        initial={{ strokeDashoffset: 100 }}
                        animate={{ strokeDashoffset: 0 }}
                        transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
                      />
                      <motion.path
                        d="M380 241 L160 241 M380 241 L600 241"
                        fill="none"
                        stroke="#ff9800"
                        strokeWidth="6"
                        strokeDasharray="16 12"
                        initial={{ strokeDashoffset: 80 }}
                        animate={{ strokeDashoffset: 0 }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                      />
                      <motion.path
                        d="M160 85 L160 440 M600 85 L600 440"
                        fill="none"
                        stroke="#ff5722"
                        strokeWidth="7"
                        strokeDasharray="24 14"
                        initial={{ strokeDashoffset: 140 }}
                        animate={{ strokeDashoffset: 0 }}
                        transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
                      />
                      <motion.path
                        d="M160 440 L80 475 M160 440 L240 475 M600 440 L520 475 M600 440 L680 475"
                        fill="none"
                        stroke="#ff9800"
                        strokeWidth="5"
                        strokeDasharray="14 10"
                        initial={{ strokeDashoffset: 50 }}
                        animate={{ strokeDashoffset: 0 }}
                        transition={{ repeat: Infinity, duration: 0.5, ease: 'linear' }}
                      />

                      {/* Seismic Moment Joint Nodes */}
                      {[
                        { x: 160, y: 79 },
                        { x: 600, y: 79 },
                        { x: 160, y: 241 },
                        { x: 600, y: 241 },
                        { x: 160, y: 440 },
                        { x: 600, y: 440 },
                      ].map((pt, pIdx) => (
                        <circle
                          key={`stress-node-${pIdx}`}
                          cx={pt.x}
                          cy={pt.y}
                          r="9"
                          fill="rgba(255, 87, 34, 0.45)"
                          stroke="#ff5722"
                          strokeWidth="2.5"
                          className="animate-pulse"
                        />
                      ))}
                    </g>
                  )}

                  {/* ========================================================== */}
                  {/* LAYER E: INTERACTIVE ARCHITECTURAL HOTSPOT CALLOUT TAGS */}
                  {/* ========================================================== */}
                  {LAB_PARTS.map((part) => {
                    const item = HOTSPOT_LAYOUT[part.id];
                    const target = item.target;
                    const badge = item.badge;
                    const isActive = activePartId === part.id;
                    const isBuilt = Boolean(builtChoices[part.id]);
                    const isHovered = hoveredPartId === part.id;

                    return (
                      <g
                        key={`hotspot-tag-${part.id}`}
                        className="cursor-pointer select-none outline-none group"
                        role="button"
                        tabIndex={0}
                        aria-label={`Configure ${part.label}`}
                        onClick={() => {
                          setActivePartId(part.id);
                          if (soundEnabled) playSoundFX('rebar');
                        }}
                        onMouseEnter={() => setHoveredPartId(part.id)}
                        onMouseLeave={() => setHoveredPartId(null)}
                      >
                        {/* 1. Large Invisible Hitbox (covers both beacon and badge) */}
                        <rect
                          x={badge.x - 72}
                          y={badge.y - 16}
                          width="144"
                          height="32"
                          fill="transparent"
                        />
                        <circle
                          cx={target.x}
                          cy={target.y}
                          r="20"
                          fill="transparent"
                        />

                        {/* 2. Target Beacon on the Physical Building Structure */}
                        {/* Concentric pulsing radar wave for unbuilt or active parts */}
                        {(!isBuilt || isActive) && (
                          <circle
                            cx={target.x}
                            cy={target.y}
                            r="8"
                            fill="none"
                            stroke={isActive ? rebarEmber : '#f57c00'}
                            strokeWidth="1.6"
                          >
                            <animate
                              attributeName="r"
                              values="6;20;26"
                              dur="2.2s"
                              repeatCount="indefinite"
                            />
                            <animate
                              attributeName="opacity"
                              values="0.9;0.35;0"
                              dur="2.2s"
                              repeatCount="indefinite"
                            />
                          </circle>
                        )}

                        {/* Active Double Focus Ring */}
                        {isActive && (
                          <circle
                            cx={target.x}
                            cy={target.y}
                            r="12"
                            fill="none"
                            stroke={rebarEmber}
                            strokeWidth="1.5"
                            strokeDasharray="3 2"
                            opacity="0.8"
                          />
                        )}

                        {/* Crosshair Ticks on Structure Target */}
                        <line
                          x1={target.x - 7}
                          y1={target.y}
                          x2={target.x + 7}
                          y2={target.y}
                          stroke={isBuilt ? '#10b981' : isActive ? rebarEmber : '#f57c00'}
                          strokeWidth="1"
                          opacity="0.75"
                        />
                        <line
                          x1={target.x}
                          y1={target.y - 7}
                          x2={target.x}
                          y2={target.y + 7}
                          stroke={isBuilt ? '#10b981' : isActive ? rebarEmber : '#f57c00'}
                          strokeWidth="1"
                          opacity="0.75"
                        />

                        {/* Target Center Dot & Rim */}
                        <circle
                          cx={target.x}
                          cy={target.y}
                          r={isActive ? 5.5 : 4.5}
                          fill={isBuilt ? '#10b981' : isActive ? rebarEmber : '#f57c00'}
                          stroke={isDark ? '#0f172a' : '#ffffff'}
                          strokeWidth="1.5"
                        />

                        {/* 3. Architectural Leader Line Connecting Target to Callout Tag */}
                        <line
                          x1={item.leaderStart.x}
                          y1={item.leaderStart.y}
                          x2={item.leaderEnd.x}
                          y2={item.leaderEnd.y}
                          stroke={isActive ? rebarEmber : isBuilt ? '#10b981' : isHovered ? rebarEmber : isDark ? '#64748b' : '#94a3b8'}
                          strokeWidth={isActive || isHovered ? '1.8' : '1.2'}
                          strokeDasharray={isBuilt ? 'none' : '3 2'}
                          opacity={isActive || isHovered ? '1' : '0.75'}
                        />

                        {/* 4. Callout Badge Pill Container */}
                        <rect
                          x={badge.x - 67}
                          y={badge.y - 13}
                          width="134"
                          height="26"
                          rx="13"
                          fill={
                            isActive
                              ? isDark ? '#1a140f' : '#fff7ed'
                              : isBuilt
                              ? isDark ? '#062016' : '#f0fdf4'
                              : isDark ? '#0f172a' : '#ffffff'
                          }
                          stroke={
                            isActive
                              ? rebarEmber
                              : isBuilt
                              ? '#10b981'
                              : isHovered
                              ? rebarEmber
                              : isDark ? '#334155' : '#cbd5e1'
                          }
                          strokeWidth={isActive ? 2 : isHovered ? 1.8 : 1.2}
                          filter={
                            isActive
                              ? 'drop-shadow(0 2px 8px rgba(245, 124, 0, 0.45))'
                              : isBuilt
                              ? 'drop-shadow(0 2px 6px rgba(16, 185, 129, 0.3))'
                              : isHovered
                              ? 'drop-shadow(0 2px 8px rgba(245, 124, 0, 0.35))'
                              : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))'
                          }
                          className="transition-colors duration-200"
                        />

                        {/* 5. Left Step Number Circle / Checkmark */}
                        <circle
                          cx={badge.x - 51}
                          cy={badge.y}
                          r="9"
                          fill={
                            isBuilt
                              ? '#10b981'
                              : isActive
                              ? rebarEmber
                              : isDark ? '#334155' : '#e2e8f0'
                          }
                        />
                        <text
                          x={badge.x - 51}
                          y={badge.y + 3.5}
                          textAnchor="middle"
                          fontSize="10"
                          fontWeight="800"
                          fill={isBuilt || isActive ? '#ffffff' : isDark ? '#f8fafc' : '#0f172a'}
                          fontFamily="sans-serif"
                        >
                          {isBuilt ? '✓' : part.stepNumber}
                        </text>

                        {/* 6. Component Name Label */}
                        <text
                          x={badge.x - 36}
                          y={badge.y + 3.5}
                          textAnchor="start"
                          fontSize="10"
                          fontWeight="700"
                          fill={
                            isActive
                              ? rebarEmber
                              : isBuilt
                              ? isDark ? '#34d399' : '#059669'
                              : isDark ? '#f1f5f9' : '#0f172a'
                          }
                          fontFamily="sans-serif"
                        >
                          {t(part.label.split(' ')[0], part.amLabel.split(' ')[0])}
                        </text>

                        {/* 7. Right Tag Status Pill */}
                        {isBuilt ? (
                          <g>
                            <rect
                              x={badge.x + 22}
                              y={badge.y - 8}
                              width="38"
                              height="16"
                              rx="8"
                              fill={isDark ? '#064e3b' : '#d1fae5'}
                            />
                            <text
                              x={badge.x + 41}
                              y={badge.y + 3}
                              textAnchor="middle"
                              fontSize="8.5"
                              fontWeight="800"
                              fill={isDark ? '#6ee7b7' : '#047857'}
                              fontFamily="monospace"
                            >
                              {builtChoices[part.id]}
                            </text>
                          </g>
                        ) : (
                          <g>
                            <rect
                              x={badge.x + 20}
                              y={badge.y - 8}
                              width="40"
                              height="16"
                              rx="8"
                              fill={isActive ? 'rgba(245,124,0,0.2)' : isDark ? '#1e293b' : '#f1f5f9'}
                              stroke={isActive ? rebarEmber : 'none'}
                              strokeWidth="0.8"
                            />
                            <text
                              x={badge.x + 40}
                              y={badge.y + 3}
                              textAnchor="middle"
                              fontSize="8"
                              fontWeight="700"
                              fill={isActive ? rebarEmber : isDark ? '#94a3b8' : '#64748b'}
                              fontFamily="sans-serif"
                            >
                              {isActive ? t('ACTIVE', 'ንቁ') : t('BUILD', 'ይምረጡ')}
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </motion.div>

              {/* Dynamic Seismic Telemetry HUD Overlay when testing */}
              {isStressTesting && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 border border-amber/40 bg-black/85 backdrop-blur-md rounded-2xl p-3 text-xs text-amber font-mono shadow-xl grid grid-cols-2 sm:grid-cols-4 gap-2.5"
                >
                  <div>
                    <span className="text-white/60 block text-[10px]">SEISMIC ACCEL:</span>
                    <span className="font-bold text-amber">0.18g (Addis Rift)</span>
                  </div>
                  <div>
                    <span className="text-white/60 block text-[10px]">COLUMN CORE:</span>
                    <span className="font-bold text-emerald-400">1,420 kN [STABLE]</span>
                  </div>
                  <div>
                    <span className="text-white/60 block text-[10px]">STAFFA CONFINEMENT:</span>
                    <span className="font-bold text-emerald-400">135° Hooks Active</span>
                  </div>
                  <div>
                    <span className="text-white/60 block text-[10px]">DRIFT RATIO:</span>
                    <span className="font-bold text-amber">0.14% &lt; 1.0% EBCS</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Bottom Blueprint Footer Info */}
            <div className="border-line bg-panel2/60 flex flex-wrap items-center justify-between gap-3 border-t px-6 py-3.5 text-xs">
              <p className="text-mute flex items-center gap-2">
                <Info className="text-ember h-3.5 w-3.5 shrink-0" />
                <span>
                  {t(
                    'Drag the X-Ray Scanner or toggle modes to inspect internal Grade 75 deformed steel rebars.',
                    'የኤክስሬይ ስካነሩን በማንቀሳቀስ ወይም ሁነታዎችን በመቀያየር የብረቱን አደራደር ይፈትሹ።'
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

                {/* Section Dimensions & Civil Engineering Tip */}
                <div className="border-line bg-panel2/60 mt-4 rounded-2xl border p-3.5 text-xs">
                  <div className="flex items-start gap-2.5">
                    <ShieldCheck className="text-ember mt-0.5 h-4 w-4 shrink-0" />
                    <div>
                      <div className="flex items-center justify-between">
                        <p className="font-display text-ink font-semibold">
                          {t('Engineering Site Standard', 'የኢንጂነሪንግ ጣቢያ መመሪያ')}
                        </p>
                        <span className="font-mono text-[10px] text-ember font-bold">
                          {activePart.sectionDimensions}
                        </span>
                      </div>
                      <p className="text-mute/90 mt-1 text-[11px] leading-relaxed">
                        {t(activePart.engineeringTip, activePart.amEngineeringTip)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Rebar Selection Rack (Items We Sell) */}
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

                  {/* Rebar Chips Grid with Radiant Sparks */}
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
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
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

                  {/* Guided Next Stage Button */}
                  {nextUnbuiltPart && builtChoices[activePart.id] && (
                    <motion.button
                      type="button"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => {
                        setActivePartId(nextUnbuiltPart.id);
                        if (soundEnabled) playSoundFX('rebar');
                      }}
                      className="mt-4 flex w-full items-center justify-between rounded-2xl border border-ember/40 bg-ember/10 hover:bg-ember/20 text-ember px-4 py-3 text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer group"
                    >
                      <span className="flex items-center gap-2">
                        <span className="grid h-6 w-6 place-items-center rounded-full bg-ember text-white text-xs font-bold">
                          0{nextUnbuiltPart.stepNumber}
                        </span>
                        <span>
                          {t(
                            `Proceed to Next Stage: ${nextUnbuiltPart.label.split(' ')[0]}`,
                            `ቀጣይ ደረጃ ይጀምሩ፡ ${nextUnbuiltPart.amLabel.split(' ')[0]}`
                          )}
                        </span>
                      </span>
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </motion.button>
                  )}
                </div>

                {/* Primary CTA Buttons */}
                <div className="mt-6 pt-4 border-t border-line flex flex-col gap-2.5">
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

        {/* Bill of Materials (BOM) Modal */}
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
                    className="text-mute hover:text-ink text-sm font-bold p-2 cursor-pointer"
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
