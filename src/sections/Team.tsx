import { useState, useRef, useEffect, useCallback, type MouseEvent } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'motion/react';
import {
  Crown,
  Truck,
  HeartHandshake,
  ShieldCheck,
  Cpu,
  Phone,
  ArrowUpRight,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  Heart,
  CheckCircle2,
  Eye,
  Flame,
} from 'lucide-react';
import { CSR_PHOTOS, CONTACT } from '../data';
import { EASE, Reveal, Counter } from '../ui';
import { useApp } from '../context/AppContext';

// ==========================================
// Enriched Leadership Profiles
// ==========================================
export interface TeamLeader {
  id: string;
  code: string;
  name: string;
  amName: string;
  role: string;
  amRole: string;
  dept: string;
  amDept: string;
  category: 'executive' | 'logistics' | 'customer' | 'tech-finance';
  photo: string;
  icon: typeof Crown;
  color: string;
  quote: string;
  amQuote: string;
  pillars: { en: string; am: string }[];
  deskPhone: string;
}

const EXTENDED_TEAM: TeamLeader[] = [
  {
    id: 'zelalem',
    code: 'YT-01',
    name: 'Ato Zelalem Alene',
    amName: 'አቶ ዘላለም አለነ',
    role: 'General Manager & Founder',
    amRole: 'ዋና ሥራ አስኪያጅና መሥራች',
    dept: 'Executive Direction',
    amDept: 'የሥራ አመራርና ስትራቴጂ',
    category: 'executive',
    photo: '/images/team-zelalem.jpg',
    icon: Crown,
    color: '#d97706',
    quote:
      'Our word is as unyielding as the Grade 75 steel we distribute. Trust is the foundation of every structure in Ethiopia.',
    amQuote:
      'ቃላችን እንደምናቀርበው Grade 75 ብረት የጸና ነው። በኢትዮጵያ ለእያንዳንዱ ህንፃ ግንባታ መሠረቱ እምነት ነው።',
    pillars: [
      {
        en: 'Strategic mill partnerships with domestic & certified global manufacturers',
        am: 'ከአገር ውስጥና ዓለም አቀፍ አምራቾች ጋር ስትራቴጂካዊ ግንኙነት መፍጠር',
      },
      {
        en: 'Strict yield strength & batch compliance across all 8mm–32mm rebar',
        am: 'ከ8ሚሜ እስከ 32ሚሜ ሬባር ደረጃውን የጠበቀ የጥራት ቁጥጥር ማድረግ',
      },
      {
        en: 'Nationwide infrastructure & high-rise project supply management',
        am: 'አገር አቀፍ የኮንስትራክሽንና የሪል እስቴት ፕሮጀክቶችን በበላይነት መከታተል',
      },
    ],
    deskPhone: CONTACT.phoneClean,
  },
  {
    id: 'getahun',
    code: 'YT-02',
    name: 'Getahun Assefa',
    amName: 'ጌታሁን አሰፋ',
    role: 'Supply Chain Director',
    amRole: 'የአቅርቦት ሰንሰለት ዳይሬክተር',
    dept: 'Logistics & Depot Network',
    amDept: 'የአቅርቦት ሰንሰለትና ሎጂስቲክስ',
    category: 'logistics',
    photo: '/images/team-getahun.jpg',
    icon: Truck,
    color: '#b45309',
    quote:
      'A concrete pour cannot wait. When rebar is needed at dawn, our supply chain and depot dispatch move before sunrise.',
    amQuote:
      'የኮንክሪት ሙሌት ጊዜ አይጠብቅም። በንጋት ለተያዘ የግንባታ ሥራ ብረቱ ሳይዘገይ በሰዓቱ እንዲደርስ እናደርጋለን።',
    pillars: [
      {
        en: 'Centralized inventory coordination across Addis Ababa depot hubs',
        am: 'በአዲስ አበባ መጋዘኖች ያለውን የስቶክ ክምችት በአስተማማኝ ሁኔታ ማስተዳደር',
      },
      {
        en: 'Direct logistics dispatch guaranteeing zero pour-day contractor delays',
        am: 'በግንባታ ቦታዎች ላይ መስተጓጎል እንዳይፈጠር የሎጂስቲክስ እንቅስቃሴውን መምራት',
      },
      {
        en: 'Mill-to-site tracking ensuring certified heat numbers & traceability',
        am: 'ጥራታቸው የተረጋገጠ የብረት ምርቶችን ከፋብሪካ እስከ ግንባታ ቦታ ማጓጓዝ',
      },
    ],
    deskPhone: CONTACT.phones[3]?.tel || CONTACT.phoneClean,
  },
  {
    id: 'abreham',
    code: 'YT-03',
    name: 'Abreham Andarge',
    amName: 'አብርሃም አንዳርጌ',
    role: 'Customer Relation Manager',
    amRole: 'የደንበኞች ግንኙነት ሥራ አስኪያጅ',
    dept: 'Client Partnerships & Support',
    amDept: 'የደንበኞች ግንኙነትና ድጋፍ',
    category: 'customer',
    photo: '/images/team-abreham.jpg',
    icon: HeartHandshake,
    color: '#ea580c',
    quote:
      'Every contractor is a partner for life. We don’t just supply steel; we ensure peace of mind on the job site.',
    amQuote:
      'እያንዳንዱ ተቋራጭ የረጅም ጊዜ አጋራችን ነው። ቁሳቁስ ከማቅረብ ባለፈ በሥራ ቦታ ላይ ሙሉ የአእምሮ ሰላምን እንፈጥራለን።',
    pillars: [
      {
        en: 'Dedicated project account managers for developers & site engineers',
        am: 'ለሪል እስቴትና ለኮንስትራክሽን ድርጅቶች ልዩ የደንበኛ እንክብካቤ መስጠት',
      },
      {
        en: 'Rapid quotation turnaround with transparent metric conversions',
        am: 'ትክክለኛ የሜትሪክ እና የኩንታል ስሌትን መሠረት ያደረገ ፈጣን የዋጋ ዝርዝር ማቅረብ',
      },
      {
        en: 'Direct telephone & Telegram dispatch assistance on active job sites',
        am: 'በግንባታ ሂደት የሚያጋጥሙ ጥያቄዎችንና ፍላጎቶችን በቅጽበት መፍታት',
      },
    ],
    deskPhone: CONTACT.phones[1]?.tel || CONTACT.phoneClean,
  },
  {
    id: 'hiwot',
    code: 'YT-04',
    name: 'Hiwot Tilahun',
    amName: 'ህይወት ጥላሁን',
    role: 'Finance Manager',
    amRole: 'የፋይናንስ ሥራ አስኪያጅ',
    dept: 'Financial Governance & Audits',
    amDept: 'የፋይናንስ አስተዳደርና ቁጥጥር',
    category: 'tech-finance',
    photo: '/images/team-hiwot.jpg',
    icon: ShieldCheck,
    color: '#0d9488',
    quote:
      'Every delivery carries verified fiscal invoices and certified paperwork. Financial integrity is our greatest currency.',
    amQuote:
      'ማንኛውም አቅርቦት ሕጋዊ የቫት ደረሰኝ እና የፋብሪካ የምስክር ወረቀት አብሮት ይጓዛል። ግልጽነት ዋነኛ መለያችን ነው።',
    pillars: [
      {
        en: 'Strict fiscal compliance with Ethiopian tax laws & instant legal VAT receipts',
        am: 'የገቢዎች ሚኒስቴርን ሕጋዊ አሠራር የተከተለ የቫት (VAT) ደረሰኝ አሰጣጥ',
      },
      {
        en: 'Transparent, audit-proof billing with zero metric ton discrepancies',
        am: 'ምንም ዓይነት ያልተገለጸ ክፍያ የሌለበት ግልጽና ሕጋዊ የሂሳብ አሠራር',
      },
      {
        en: 'Structured procurement payment workflows for enterprise contractors',
        am: 'ለታመኑ ደንበኞች የተመቻቸና የተደራጀ የክፍያ ስምምነት ማመቻቸት',
      },
    ],
    deskPhone: CONTACT.phones[2]?.tel || CONTACT.phoneClean,
  },
  {
    id: 'mulugeta',
    code: 'YT-05',
    name: 'Mulugeta Awoke',
    amName: 'ሙሉጌታ አወቀ',
    role: 'MIS Manager',
    amRole: 'የመረጃ ስርዓት (MIS) ሥራ አስኪያጅ',
    dept: 'MIS & Digital Inventory Systems',
    amDept: 'የመረጃ ቴክኖሎጂና ሥርዓት',
    category: 'tech-finance',
    photo: '/images/team-mulugeta.jpg',
    icon: Cpu,
    color: '#6366f1',
    quote:
      'From mill batch heat numbers to digital warehouse scales, technology guarantees exact tonnage delivery.',
    amQuote:
      'ከፋብሪካ ባች መለያ እስከ መጋዘን ሚዛን ድረስ፣ ዲጂታል ሥርዓታችን በእያንዳንዱ ቶን ላይ ፍጹም ትክክለኛነትን ያረጋግጣል።',
    pillars: [
      {
        en: 'Real-time cloud ERP monitoring rebar stocks across all warehouse bays',
        am: 'የመጋዘን ክምችትን በዘመናዊ የኢአርፒ (ERP) ሥርዓት በቅጽበት መከታተል',
      },
      {
        en: 'Digital batch verification tying mill certificates to physical deliveries',
        am: 'የጥራት ማረጋገጫ ሰነዶችን ከእያንዳንዱ የተላከ ብረት ጋር በዲጂታል መንገድ ማገናኘት',
      },
      {
        en: 'Automated order status messaging keeps engineers updated in real-time',
        am: 'የትዕዛዝ ሁኔታን በቴሌግራም እና በኤስኤምኤስ ለግንባታ መሃንዲሶች ማሳወቅ',
      },
    ],
    deskPhone: CONTACT.phoneClean,
  },
];

// ==========================================
// Particle Burst & Combo Streaks for Appreciation Micro-Interaction
// ==========================================
interface SparkParticle {
  id: number;
  x: number;
  y: number;
  scale: number;
  color: string;
  rotation: number;
  char?: string;
}

interface FloatingText {
  id: number;
  text: string;
  x: number;
}

function CrewAppreciationWidget() {
  const { t } = useApp();
  const [claps, setClaps] = useState(385);
  const [particles, setParticles] = useState<SparkParticle[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [streak, setStreak] = useState(0);
  const [isPressed, setIsPressed] = useState(false);
  const streakTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduce = useReducedMotion();

  const handleClap = () => {
    setClaps((c) => c + 1);
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 240);

    // Track combo streak
    const nextStreak = streak + 1;
    setStreak(nextStreak);
    if (streakTimer.current) clearTimeout(streakTimer.current);
    streakTimer.current = setTimeout(() => setStreak(0), 1400);

    if (reduce) return;

    // Spawn floating praise badge
    const textId = Date.now();
    let cheerText = '+1 👏';
    if (nextStreak >= 10) cheerText = '⚡ ULTRA CHEER! 🔥';
    else if (nextStreak >= 6) cheerText = '🚀 SUPER COMBO!';
    else if (nextStreak >= 3) cheerText = `${nextStreak}x Streak! 🔥`;

    setFloatingTexts((prev) => [
      ...prev.slice(-3),
      { id: textId, text: cheerText, x: (Math.random() - 0.5) * 40 },
    ]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== textId));
    }, 900);

    // Dynamic celebration particle fountain
    const chars = ['👏', '✨', '⭐', '🔥', '✦', '🎉'];
    const colors = ['#f59e0b', '#d97706', '#ef4444', '#10b981', '#6366f1', '#ec4899'];
    const count = nextStreak >= 5 ? 16 : 10;
    const newSparks: SparkParticle[] = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i + Math.random(),
      x: (Math.random() - 0.5) * 140,
      y: -35 - Math.random() * 75,
      scale: 0.7 + Math.random() * 0.7,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: (Math.random() - 0.5) * 140,
      char: Math.random() > 0.45 ? chars[Math.floor(Math.random() * chars.length)] : undefined,
    }));

    setParticles((prev) => [...prev.slice(-24), ...newSparks]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newSparks.some((ns) => ns.id === p.id)));
    }, 950);
  };

  return (
    <div className="relative inline-flex items-center">
      {/* Floating Combo / Cheer Badges */}
      <AnimatePresence>
        {floatingTexts.map((ft) => (
          <motion.div
            key={ft.id}
            initial={{ opacity: 0, y: 0, scale: 0.6 }}
            animate={{ opacity: 1, y: -45, scale: 1.15 }}
            exit={{ opacity: 0, y: -65, scale: 0.9 }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
            style={{ left: `calc(50% + ${ft.x}px)` }}
            className="pointer-events-none absolute -top-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-ember to-amber px-2.5 py-0.5 text-[0.7rem] font-black text-white shadow-lg z-30"
          >
            {ft.text}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Ambient Breathing Glow */}
      <div
        className="pointer-events-none absolute -inset-1 rounded-full bg-gradient-to-r from-ember/30 via-amber/40 to-ember/30 blur-sm opacity-50 transition-opacity group-hover:opacity-100 animate-pulse"
        aria-hidden
      />

      <motion.button
        type="button"
        onClick={handleClap}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.9 }}
        animate={
          isPressed
            ? {
                scale: [1, 0.88, 1.22, 0.95, 1],
                rotate: [0, -5, 5, -2, 0],
              }
            : {}
        }
        transition={{ duration: 0.28 }}
        className="group relative flex items-center gap-2.5 rounded-full border border-ember/50 bg-panel px-4 py-2.5 text-xs font-bold text-ink shadow-md backdrop-blur-md transition-all hover:border-ember hover:shadow-ember/30 cursor-pointer overflow-hidden z-10 select-none"
        aria-label="Applaud the team"
      >
        {/* Subtle Shimmer Sheen */}
        <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

        {/* Clapping Icon with spring rotation */}
        <motion.span
          className="text-base select-none inline-block"
          animate={{ rotate: isPressed ? [0, -22, 22, 0] : [0, -6, 6, 0] }}
          transition={{ duration: isPressed ? 0.25 : 2.5, repeat: isPressed ? 0 : Infinity }}
        >
          👏
        </motion.span>

        <span className="font-bold text-ink transition-colors group-hover:text-ember">
          {t('Applaud Our Crew', 'ለቡድናችን አድናቆት ይስጡ')}
        </span>

        {/* Animated Claps Counter Pill */}
        <motion.span
          key={claps}
          initial={{ scale: 1.35, color: '#f59e0b' }}
          animate={{ scale: 1, color: '#b45309' }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="rounded-full bg-ember/15 px-2.5 py-0.5 font-mono text-xs font-black text-ember shadow-inner"
        >
          {claps}
        </motion.span>

        {streak > 1 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-0.5 rounded-full bg-red-500/15 px-1.5 py-0.2 text-[0.65rem] font-extrabold text-red-600 dark:text-red-400"
          >
            <Flame className="h-3 w-3 fill-current text-red-500 animate-bounce" />
            <span>{streak}x</span>
          </motion.span>
        )}
      </motion.button>

      {/* Particle Fountain (Stars, Emojis, Sparks) */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, x: 0, y: 0, scale: p.scale }}
            animate={{
              opacity: 0,
              x: p.x,
              y: p.y,
              rotate: p.rotation,
              scale: p.scale * 1.3,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            style={{ color: p.color }}
            className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 select-none z-40"
          >
            {p.char ? (
              <span className="text-sm font-bold">{p.char}</span>
            ) : (
              <Sparkles className="h-4 w-4 fill-current" />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// 3D Perspective Tilt Card - Clean, Elegant & Digestible
// ==========================================
interface TiltCardProps {
  leader: TeamLeader;
  index: number;
  onSelect: (leader: TeamLeader) => void;
}

function InteractiveTeamCard({ leader, index, onSelect }: TiltCardProps) {
  const { t } = useApp();
  const cardRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const LeaderIcon = leader.icon;

  // Mouse coords relative to card [-0.5, 0.5]
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for tilt
  const springX = useSpring(mouseX, { stiffness: 280, damping: 22, mass: 0.4 });
  const springY = useSpring(mouseY, { stiffness: 280, damping: 22, mass: 0.4 });

  // Transforms
  const rotateX = useTransform(springY, [-0.5, 0.5], reduce ? [0, 0] : [8, -8]);
  const rotateY = useTransform(springX, [-0.5, 0.5], reduce ? [0, 0] : [-8, 8]);
  const glareX = useTransform(springX, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(springY, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduce || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: EASE }}
      className="perspective-1000 h-full"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => onSelect(leader)}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{
          y: -6,
          transition: { duration: 0.25, ease: EASE },
        }}
        whileTap={{ scale: 0.98 }}
        className="group border-line bg-panel card-glow relative flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border p-4 sm:p-5 shadow-sm transition-colors hover:border-ember/50 select-none"
      >
        {/* Dynamic Specular Sheen */}
        {!reduce && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-20 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: useTransform(
                [glareX, glareY],
                ([gx, gy]) =>
                  `radial-gradient(350px circle at ${gx} ${gy}, rgba(255, 255, 255, 0.18), transparent 70%)`
              ),
            }}
          />
        )}

        {/* Ambient Warm Backlight */}
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full blur-2xl opacity-15 transition-opacity duration-500 group-hover:opacity-40"
          style={{ backgroundColor: leader.color }}
        />

        {/* Clean Framed Photo with Domain Icon */}
        <div className="relative aspect-[4/3.8] w-full overflow-hidden rounded-xl border border-line bg-panel2/80 shadow-sm">
          <img
            src={leader.photo}
            alt={leader.name}
            loading="lazy"
            width={260}
            height={240}
            className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-106"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80';
            }}
          />

          {/* Clean Hover Overlay Cue */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 backdrop-blur-[1px] transition-opacity duration-250 group-hover:opacity-100">
            <span className="flex items-center gap-1.5 rounded-full bg-panel/95 px-3 py-1.5 text-xs font-bold text-ink shadow-lg">
              <Eye className="h-3.5 w-3.5 text-ember" />
              <span>{t('View Profile', 'ሙሉ መገለጫ')}</span>
            </span>
          </div>

          {/* Floating Domain Icon Chip (e.g. Truck for SCD, Crown for GM) */}
          <div
            className="absolute bottom-2.5 right-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-lg border border-line/90 bg-panel/90 text-ink shadow-md backdrop-blur-md transition-all duration-300 group-hover:scale-115 group-hover:border-ember group-hover:text-ember group-hover:shadow-ember/25"
            style={{ borderColor: `${leader.color}50` }}
            title={t(leader.dept, leader.amDept)}
          >
            <LeaderIcon className="h-4 w-4 transition-transform group-hover:rotate-6" />
          </div>
        </div>

        {/* Text Information - Clean, Single-line, Breathable */}
        <div className="mt-4 flex flex-1 flex-col justify-between text-left">
          <div>
            <h3 className="font-display text-ink text-base font-bold transition-colors group-hover:text-ember line-clamp-1">
              {t(leader.name, leader.amName)}
            </h3>
            <p className="text-ember text-xs font-semibold mt-1 line-clamp-1">
              {t(leader.role, leader.amRole)}
            </p>
          </div>

          {/* Simple Bottom Action Cue */}
          <div className="mt-4 flex items-center justify-between border-t border-line/60 pt-3">
            <span className="text-xs font-semibold text-mute group-hover:text-ember transition-colors">
              {t('View Profile', 'ሙሉ መገለጫ')}
            </span>
            <ChevronRight className="h-4 w-4 text-ember transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>

        {/* Bottom Ember Accent Line */}
        <span
          className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-ember to-amber transition-all duration-400 group-hover:w-full"
          aria-hidden
        />
      </motion.div>
    </motion.div>
  );
}

// ==========================================
// Executive Dossier Modal / Inspector Deck (Shown on Click)
// ==========================================
interface DossierModalProps {
  leader: TeamLeader | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

function ExecutiveDossierModal({ leader, onClose, onNext, onPrev }: DossierModalProps) {
  const { t } = useApp();

  // Handle ESC key & Arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  if (!leader) return null;

  const LeaderIcon = leader.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/65 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="border-line bg-panel card-glow relative z-10 w-full max-w-3xl overflow-hidden rounded-3xl border shadow-2xl"
        >
          {/* Top Status Banner */}
          <div className="flex items-center justify-between border-b border-line bg-panel2/80 px-6 py-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-ember uppercase tracking-wider">
                {leader.code} // {t(leader.dept, leader.amDept)}
              </span>
              <span className="h-1 w-1 rounded-full bg-line" />
              <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                {t('Management Profile', 'የአመራር መገለጫ')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onPrev}
                aria-label="Previous leader"
                className="hover:border-ember text-mute hover:text-ink grid h-8 w-8 place-items-center rounded-lg border border-line bg-panel transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onNext}
                aria-label="Next leader"
                className="hover:border-ember text-mute hover:text-ink grid h-8 w-8 place-items-center rounded-lg border border-line bg-panel transition-colors cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="hover:border-ember text-mute hover:text-ink ml-1 grid h-8 w-8 place-items-center rounded-lg border border-line bg-panel transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-[240px_1fr]">
            {/* Photo & Role Card */}
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4 h-56 w-48 overflow-hidden rounded-2xl border-2 border-line shadow-lg">
                <img
                  src={leader.photo}
                  alt={leader.name}
                  className="h-full w-full object-cover object-top"
                />
                <div className="absolute bottom-2 right-2 rounded-lg bg-panel/90 p-2 shadow-md backdrop-blur-md">
                  <LeaderIcon className="h-5 w-5 text-ember" />
                </div>
              </div>

              <h4 className="font-display text-ink text-lg font-bold">{leader.name}</h4>
              <p className="text-mute text-xs">{leader.amName}</p>
              <p className="text-ember mt-1 text-xs font-bold uppercase tracking-wider">
                {t(leader.role, leader.amRole)}
              </p>

              {/* Direct Call Button */}
              <a
                href={`tel:${leader.deskPhone}`}
                className="bg-ember text-white hover:bg-ember/90 mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold shadow-md transition-colors"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>{t('Contact Department Desk', 'የሥራ ክፍሉን በስልክ ያነጋግሩ')}</span>
              </a>
            </div>

            {/* Strategic Bio & Operational Pillars */}
            <div className="flex flex-col justify-between">
              <div>
                <span className="font-display text-ember text-[0.68rem] font-bold tracking-[0.25em] uppercase">
                  {t('Leadership Statement & Core Focus', 'የአመራር ራዕይና የትኩረት መስክ')}
                </span>

                <blockquote className="border-line text-ink mt-3 border-l-2 pl-4 text-base font-medium italic sm:text-lg">
                  "{t(leader.quote, leader.amQuote)}"
                </blockquote>

                {/* Key Operational Pillars */}
                <div className="mt-6">
                  <h5 className="font-display text-ink text-xs font-bold tracking-wider uppercase">
                    {t('Key Operational Responsibilities', 'ዋነኛ የሥራ ኃላፊነቶች')}
                  </h5>
                  <div className="mt-3 space-y-2.5">
                    {leader.pillars.map((pil, idx) => (
                      <div
                        key={idx}
                        className="border-line bg-panel2/60 flex items-start gap-2.5 rounded-xl border p-2.5 text-xs text-mute"
                      >
                        <CheckCircle2 className="text-ember mt-0.5 h-4 w-4 shrink-0" />
                        <span className="font-medium text-ink/90 leading-relaxed">
                          {t(pil.en, pil.am)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer Quote Link */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line/80 pt-4">
                <span className="font-mono text-[0.7rem] text-mute">
                  Kazanchis Joburg Bldg · 5th Floor · Addis Ababa
                </span>
                <a
                  href="#quote"
                  onClick={onClose}
                  className="text-ember hover:text-amber flex items-center gap-1 text-xs font-bold transition-colors"
                >
                  <span>{t('Request Structural Rebar Quote', 'የሬባር የዋጋ ዝርዝር ይጠይቁ')}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// ==========================================
// CSR Blood Donation Lightbox Modal
// ==========================================
interface LightboxProps {
  photo: (typeof CSR_PHOTOS)[0] | null;
  onClose: () => void;
}

function PhotoLightboxModal({ photo, onClose }: LightboxProps) {
  const { t } = useApp();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!photo) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="border-line bg-panel relative z-10 max-w-2xl overflow-hidden rounded-3xl border shadow-2xl"
        >
          <div className="relative">
            <img
              src={photo.url}
              alt={photo.caption}
              className="max-h-[70vh] w-full object-cover"
            />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close lightbox"
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-black/60 text-white backdrop-blur-md transition-colors hover:bg-black cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-6">
            <span className="font-mono text-xs font-bold text-ember uppercase tracking-wider">
              {t('Community Social Responsibility', 'ማኅበራዊ ኃላፊነትና ተሳትፎ')}
            </span>
            <h4 className="font-display text-ink mt-1 text-lg font-bold">
              {t(photo.caption, photo.amCaption)}
            </h4>
            <p className="text-mute mt-2 text-xs leading-relaxed">
              {t(
                'Yegna Trading PLC team members actively donate blood annually in Addis Ababa to support emergency medical supplies and trauma care.',
                'የየኛ ትሬዲንግ ቤተሰብ የአደጋ ጊዜ የጤና አገልግሎቶችን ለመደገፍና ሕይወት ለማዳን በየዓመቱ በፈቃደኝነት ደም ይለግሳል።'
              )}
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// ==========================================
// Main Team Component
// ==========================================
export default function Team() {
  const { t } = useApp();
  const [selectedLeader, setSelectedLeader] = useState<TeamLeader | null>(null);
  const [lightboxPhoto, setLightboxPhoto] = useState<(typeof CSR_PHOTOS)[0] | null>(null);

  // Cycling in modal
  const handleNextLeader = useCallback(() => {
    if (!selectedLeader) return;
    const currentIndex = EXTENDED_TEAM.findIndex((m) => m.id === selectedLeader.id);
    const nextIndex = (currentIndex + 1) % EXTENDED_TEAM.length;
    setSelectedLeader(EXTENDED_TEAM[nextIndex]);
  }, [selectedLeader]);

  const handlePrevLeader = useCallback(() => {
    if (!selectedLeader) return;
    const currentIndex = EXTENDED_TEAM.findIndex((m) => m.id === selectedLeader.id);
    const prevIndex = (currentIndex - 1 + EXTENDED_TEAM.length) % EXTENDED_TEAM.length;
    setSelectedLeader(EXTENDED_TEAM[prevIndex]);
  }, [selectedLeader]);

  return (
    <section id="team" className="texture-noise relative overflow-hidden py-24 sm:py-32">
      {/* Background Radial Glow */}
      <div
        className="pointer-events-none absolute -left-48 top-1/4 h-96 w-96 rounded-full bg-ember/5 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-48 bottom-1/4 h-96 w-96 rounded-full bg-amber/5 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* Kinetic Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="font-display flex items-center gap-2 text-xs font-bold tracking-[0.28em] text-ember uppercase">
                  <span className="h-1.5 w-1.5 rounded-full bg-ember animate-pulse" />
                  {t('Leadership & Team', 'የአመራር ቡድን')}
                </span>
                <span className="h-px w-8 bg-ember/40 hidden sm:inline-block" />
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <h2 className="font-display headline-elevated text-ink mt-3 text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                {t('The People Behind', 'ከእያንዳንዱ ስኬት ጀርባ')}{' '}
                <span className="font-serif-i text-gradient-ember pr-2">
                  {t('Every Delivery.', 'ያሉ ባለሙያዎች።')}
                </span>
              </h2>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="text-mute text-elevated mt-4 max-w-2xl text-base leading-relaxed sm:text-lg">
                {t(
                  'At Yegna, we believe that people are our most valuable asset. Meet the dedicated leadership team driving verified quality and prompt site deliveries across Ethiopia.',
                  'በየኛ ትሬዲንግ የሰው ኃይል ትልቁ ሀብታችን እንደሆነ እናምናለን፤ ጥራት ያለው የግንባታ ግብአት በወቅቱ እንዲደርስዎት የሚተጋውን የአመራር ቡድናችንን ይወቁ።'
                )}
              </p>
            </Reveal>
          </div>

          {/* Micro-Interaction Appreciation Widget */}
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <CrewAppreciationWidget />
          </div>
        </div>

        {/* 5 Clean, Digestible 3D Tilt Cards */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {EXTENDED_TEAM.map((m, i) => (
            <InteractiveTeamCard
              key={m.id}
              leader={m}
              index={i}
              onSelect={(lead) => setSelectedLeader(lead)}
            />
          ))}
        </div>

        {/* Community Program: Yegna Team Blood Donation Drive ("Heart of Yegna") */}
        <div className="mt-20">
          <Reveal delay={0.1}>
            <div className="border-line bg-panel card-glow relative overflow-hidden rounded-3xl border p-6 sm:p-10 shadow-xl">
              {/* Animated ECG Heartbeat Line in background */}
              <div className="pointer-events-none absolute right-0 top-0 h-32 w-72 opacity-15 overflow-hidden">
                <svg
                  viewBox="0 0 300 100"
                  className="h-full w-full stroke-ember"
                  fill="none"
                  strokeWidth="2.5"
                >
                  <path
                    d="M0 50 L80 50 L95 20 L110 80 L125 40 L135 60 L145 50 L300 50"
                    strokeDasharray="6 3"
                    className="rebar-flow"
                  />
                </svg>
              </div>

              {/* CSR Header Row */}
              <div className="flex flex-wrap items-center justify-between gap-6 border-b border-line pb-8">
                <div>
                  <div className="flex items-center gap-2.5 text-ember">
                    <div className="animate-heartbeat flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10 text-red-500">
                      <Heart className="h-4 w-4 fill-current" />
                    </div>
                    <span className="font-display text-xs font-bold tracking-[0.24em] uppercase">
                      {t('Social Responsibility & Impact', 'ማኅበራዊ ኃላፊነትና ተሳትፎ')}
                    </span>
                  </div>

                  <h3 className="font-display text-ink mt-3 text-2xl font-bold sm:text-3xl">
                    {t('Heart of Yegna: Team Blood Donation Drive', 'የየኛ ትሬዲንግ ዓመታዊ የደም ልገሳ መርሐ-ግብር')}
                  </h3>

                  <p className="text-mute mt-2 max-w-2xl text-xs sm:text-sm leading-relaxed">
                    {t(
                      'True structural integrity extends beyond steel and cement into the communities we live in. The Yegna Trading family routinely mobilizes volunteer blood donations to support local Addis Ababa hospitals and trauma centres.',
                      'እውነተኛ ጥንካሬ ከብረትና ሲሚንቶ ባለፈ በምንኖርበት ማኅበረሰብ ውስጥ በሚከናወኑ በጎ ተግባራት ይገለጻል። የየኛ ትሬዲንግ ቤተሰብ የአገር ውስጥ ሆስፒታሎችን ለመደገፍና ሕይወት ለማዳን ተከታታይ የደም ልገሳ ፕሮግራሞችን ያካሂዳል።'
                    )}
                  </p>
                </div>

                {/* 3 Impact Stats Chips */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="border-line bg-panel2/80 rounded-2xl border px-4 py-2.5 text-center shadow-sm">
                    <p className="font-display text-ink text-lg font-bold">
                      <Counter value={120} suffix="+" />
                    </p>
                    <p className="text-mute text-[0.68rem] font-semibold uppercase">
                      {t('Pints Donated', 'ዩኒት ደም የተለገሰ')}
                    </p>
                  </div>

                  <div className="border-line bg-panel2/80 rounded-2xl border px-4 py-2.5 text-center shadow-sm">
                    <p className="font-display text-ink text-lg font-bold">
                      <Counter value={3} suffix=" Hospitals" />
                    </p>
                    <p className="text-mute text-[0.68rem] font-semibold uppercase">
                      {t('Partner Centers', 'ተጠቃሚ ሆስፒታሎች')}
                    </p>
                  </div>

                  <div className="border-line bg-panel2/80 rounded-2xl border px-4 py-2.5 text-center shadow-sm">
                    <p className="font-display text-emerald-600 dark:text-emerald-400 text-lg font-bold">
                      100%
                    </p>
                    <p className="text-mute text-[0.68rem] font-semibold uppercase">
                      {t('Staff Volunteer', 'የሰራተኞች ተሳትፎ')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Blood donation photo gallery with interactive zoom & lightbox */}
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {CSR_PHOTOS.map((p, idx) => (
                  <motion.div
                    key={p.url}
                    whileHover={{ y: -6 }}
                    onClick={() => setLightboxPhoto(p)}
                    className="group border-line bg-panel2/60 relative cursor-pointer overflow-hidden rounded-2xl border shadow-sm transition-all hover:border-ember/50 hover:shadow-lg"
                  >
                    <div className="relative h-60 w-full overflow-hidden">
                      <img
                        src={p.url}
                        alt={p.caption}
                        loading="lazy"
                        width={400}
                        height={240}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent p-5 flex flex-col justify-end">
                        <div className="flex items-center gap-1.5 text-amber text-[0.68rem] font-bold uppercase tracking-wider mb-1">
                          <HeartHandshake className="h-3.5 w-3.5" />
                          <span>{t('Community Drive', 'የማኅበረሰብ መርሐ-ግብር')}</span>
                        </div>
                        <p className="text-white text-sm font-semibold leading-snug">
                          {t(p.caption, p.amCaption)}
                        </p>
                        <span className="mt-2 flex items-center gap-1 text-[0.7rem] font-bold text-white/80 transition-transform group-hover:translate-x-1">
                          <Eye className="h-3 w-3 text-ember" />
                          <span>{t('Click to enlarge', 'ፎቶውን አጉልተው ይመልከቱ')}</span>
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Interactive Dossier Modal (Opened on Click) */}
      <ExecutiveDossierModal
        leader={selectedLeader}
        onClose={() => setSelectedLeader(null)}
        onNext={handleNextLeader}
        onPrev={handlePrevLeader}
      />

      {/* Image Lightbox Modal */}
      <PhotoLightboxModal
        photo={lightboxPhoto}
        onClose={() => setLightboxPhoto(null)}
      />
    </section>
  );
}
