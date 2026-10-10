import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowDown, MousePointerClick, Route } from 'lucide-react';
import { EASE, Reveal, SectionHead } from '../ui';
import { useApp } from '../context/AppContext';

type PartId = 'footing' | 'column' | 'beam' | 'slab' | 'stair';

type Part = {
  id: PartId;
  n: string;
  label: string;
  amLabel: string;
  title: string;
  amTitle: string;
  copy: string;
  amCopy: string;
  sizes: string[];
};

const PARTS: Part[] = [
  {
    id: 'footing',
    n: '01',
    label: 'Footing',
    amLabel: 'የመሠረት ማሰሪያ',
    title: 'The handshake with the ground',
    amTitle: 'ከመሬት ጋር የሚደረግ ጽኑ ትስስር',
    copy: 'Everything the structure carries ends up here. A cage of stout bars spreads the load evenly into the soil — so your building never tells stories with cracks later.',
    amCopy: 'የህንጻው አጠቃላይ ክብደት እዚህ ያርፋል። ጠንካራ የሬባር መዋቅር ክብደቱን ወደ መሬቱ እኩል በማሰራጨት ስንጥቆችን ይከላከላል።',
    sizes: ['Ø12mm', 'Ø14mm', 'Ø16mm'],
  },
  {
    id: 'column',
    n: '02',
    label: 'Column',
    amLabel: 'የህንጻ አምድ',
    title: 'The spine that carries it all',
    amTitle: 'የህንጻው ዋና ደጋፊ ምሰሶ',
    copy: 'Vertical bars tied with close-spaced stirrups take the crushing load floor by floor — and keep the frame standing through wind, quake and time.',
    amCopy: 'በስታፋ የታሰሩ የቁም ብረቶች የፎቆቹን ክብደት በየደረጃው በመሸከም ህንጻውን በንፋስና በመሬት መንቀጥቀጥ ጸንቶ እንዲቆም ያደርጉታል።',
    sizes: ['Ø16mm', 'Ø20mm', 'Ø24mm'],
  },
  {
    id: 'beam',
    n: '03',
    label: 'Beam',
    amLabel: 'ጋሪ (Beam)',
    title: 'The bridge between columns',
    amTitle: 'በአምዶች መካከል ያለ ድልድይ',
    copy: 'Top bars hug the compression zone while bottom steel fights bending — the quiet teamwork that keeps spans open and sag-free.',
    amCopy: 'የላይኛውና የታችኛው የብረት አደራደር መተጣጠፍን በመቋቋም ሰፋፊ ክፍተቶች ያለምንም ዝቅጠት ጸንተው እንዲቆዩ ያደርጋል።',
    sizes: ['Ø12mm', 'Ø16mm', 'Ø20mm'],
  },
  {
    id: 'slab',
    n: '04',
    label: 'Slab',
    amLabel: 'ጠፍጣፋ ወለል (Slab)',
    title: 'The roof over everything',
    amTitle: 'የወለልና ጣሪያ መደላድል',
    copy: 'A rhythm of main bars and distributors spaced like graph paper, so live loads walk smoothly into the beams below.',
    amCopy: 'ዋናና አጋዥ የብረት አደራደር ወለል ላይ የሚመጡ ጫናዎችን በቀጥታ ወደ ጋሪዎች (Beams) በማስተላለፍ ጥንካሬን ያረጋግጣል።',
    sizes: ['Ø8mm', 'Ø10mm', 'Ø12mm'],
  },
  {
    id: 'stair',
    n: '05',
    label: 'Staircase',
    amLabel: 'ደረጃ',
    title: 'The diagonal worth dancing on',
    amTitle: 'አስተማማኝ መወጣጫ',
    copy: 'Waist steel runs the slope while the steps take the traffic — engineered so every flight feels solid underfoot.',
    amCopy: 'በተዳፋቱ የሚዘረጋው ጠንካራ ብረት የሰው እንቅስቃሴን በሙሉ በጽናት ይሸከማል።',
    sizes: ['Ø12mm', 'Ø16mm'],
  },
];

const TOUR_ORDER: PartId[] = ['footing', 'column', 'beam', 'slab', 'stair'];

export type QuotePrefill = { size: string; part: string; message: string; ts: number };

export default function RebarLab({ onQuote }: { onQuote: (p: QuotePrefill) => void }) {
  const { theme, t } = useApp();
  const outline = theme === 'dark' ? 'rgba(244,241,234,0.38)' : 'rgba(31,42,68,0.35)';
  const rebarColor = '#f57c00';
  const fillRect = theme === 'dark' ? 'rgba(244,241,234,0.03)' : 'rgba(31,42,68,0.03)';

  const [selected, setSelected] = useState<PartId>('footing');
  const [touring, setTouring] = useState(false);
  const tourIdx = useRef(0);

  const isDim = (id: PartId) => selected !== null && selected !== id;

  const startTour = () => {
    tourIdx.current = 0;
    setSelected(TOUR_ORDER[0]);
    setTouring(true);
  };

  useEffect(() => {
    if (!touring) return;
    const tm = window.setInterval(() => {
      tourIdx.current += 1;
      if (tourIdx.current >= TOUR_ORDER.length) {
        setTouring(false);
        return;
      }
      setSelected(TOUR_ORDER[tourIdx.current]);
    }, 1900);
    return () => window.clearInterval(tm);
  }, [touring]);

  const select = (id: PartId) => {
    setTouring(false);
    setSelected(id);
  };

  const sendToQuote = (part: Part, size: string) => {
    onQuote({
      size,
      part: part.label,
      message: `Hello Yegna — please quote ${size} rebar for the ${part.label.toLowerCase()} of my project. I can share full quantities on call.`,
      ts: Date.now(),
    });
  };

  const active = PARTS.find((p) => p.id === selected)!;
  const tickXs = (from: number, to: number, step: number) => {
    const out: number[] = [];
    for (let x = from; x <= to; x += step) out.push(x);
    return out;
  };

  return (
    <section className="texture-noise relative overflow-hidden py-24 sm:py-32">
      <div
        className="absolute inset-0 bg-[radial-gradient(800px_460px_at_80%_15%,rgba(245,124,0,0.06),transparent_60%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHead
            eyebrow={t('Interactive Structural Lab', 'የሬባር ላብራቶሪ')}
            title={t('Where Every Bar', 'እያንዳንዱ ብረት የራሱ')}
            accent={t('Has A Purpose.', 'ቦታና ሚና አለው።')}
            sub={t(
              'Tap any part of the building structure to see which rebar diameter belongs there, and instantly push that size into your quote request.',
              'የህንጻውን ክፍል በመጫን ተስማሚውን የሬባር መጠን ይመልከቱ፤ በቀጥታም ወደ የዋጋ መጠየቂያዎ ያስገቡት።'
            )}
          />
          <Reveal delay={0.2}>
            <button
              type="button"
              onClick={startTour}
              className={`group font-display inline-flex cursor-pointer items-center gap-2.5 rounded-full border px-6 py-3 text-xs sm:text-sm font-semibold transition-all duration-300 ${
                touring
                  ? 'border-ember bg-ember text-white shadow-md'
                  : 'border-line bg-panel text-ink hover:border-ember hover:text-ember shadow-sm'
              }`}
            >
              <Route className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
              <span>{touring ? t('Tracing load path…', 'ጭነቱን በመከታተል ላይ…') : t('Trace the load path', 'የክብደት ፍሰቱን ይመልከቱ')}</span>
            </button>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Structural SVG Diagram */}
          <Reveal>
            <div className="border-line bg-panel card-glow texture-grid relative overflow-hidden rounded-3xl border shadow-lg">
              <svg viewBox="0 0 640 460" className="relative w-full" role="img" aria-label="Interactive building structure diagram">
                {/* ground */}
                <line x1="16" y1="402" x2="624" y2="402" stroke={outline} strokeWidth="2" />
                {tickXs(40, 596, 34).map((x) => (
                  <line key={`h${x}`} x1={x} y1="402" x2={x - 14} y2="416" stroke={outline} strokeWidth="1.2" opacity="0.6" />
                ))}

                {/* footing */}
                <g
                  className="struct-line cursor-pointer"
                  style={{ opacity: isDim('footing') ? 0.22 : 1 }}
                  onClick={() => select('footing')}
                >
                  <motion.g
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                  >
                    {(
                      [
                        [56, 374],
                        [456, 374],
                      ] as const
                    ).map(([x, y]) => (
                      <g key={`f${x}`}>
                        <rect x={x} y={y} width="128" height="28" fill={fillRect} stroke={outline} strokeWidth="1.6" />
                        <line className="rebar-flow" x1={x + 8} y1={y + 10} x2={x + 120} y2={y + 10} stroke={rebarColor} strokeWidth="2" style={{ animationDuration: selected === 'footing' ? '0.55s' : undefined }} />
                        <line className="rebar-flow" x1={x + 8} y1={y + 19} x2={x + 120} y2={y + 19} stroke={rebarColor} strokeWidth="2" style={{ animationDuration: selected === 'footing' ? '0.55s' : undefined }} />
                      </g>
                    ))}
                  </motion.g>
                </g>

                {/* columns */}
                <g
                  className="struct-line cursor-pointer"
                  style={{ opacity: isDim('column') ? 0.22 : 1 }}
                  onClick={() => select('column')}
                >
                  <motion.g
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  >
                    {[108, 506].map((x) => (
                      <g key={`c${x}`}>
                        <rect x={x} y="124" width="26" height="250" fill={fillRect} stroke={outline} strokeWidth="1.6" />
                        {[x + 6, x + 13, x + 20].map((lx) => (
                          <line key={lx} className="rebar-flow" x1={lx} y1="132" x2={lx} y2="366" stroke={rebarColor} strokeWidth="1.8" style={{ animationDuration: selected === 'column' ? '0.55s' : undefined }} />
                        ))}
                        {tickXs(140, 360, 22).map((y) => (
                          <line key={`st${x}-${y}`} x1={x + 2} y1={y} x2={x + 24} y2={y} stroke={rebarColor} strokeWidth="1" opacity="0.5" />
                        ))}
                      </g>
                    ))}
                  </motion.g>
                </g>

                {/* beam */}
                <g
                  className="struct-line cursor-pointer"
                  style={{ opacity: isDim('beam') ? 0.22 : 1 }}
                  onClick={() => select('beam')}
                >
                  <motion.g
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                  >
                    <rect x="108" y="248" width="424" height="24" fill={fillRect} stroke={outline} strokeWidth="1.6" />
                    <line className="rebar-flow" x1="116" y1="254" x2="524" y2="254" stroke={rebarColor} strokeWidth="2" style={{ animationDuration: selected === 'beam' ? '0.55s' : undefined }} />
                    <line className="rebar-flow" x1="116" y1="266" x2="524" y2="266" stroke={rebarColor} strokeWidth="2" style={{ animationDuration: selected === 'beam' ? '0.55s' : undefined }} />
                    {tickXs(152, 500, 44).map((x) => (
                      <line key={`bt${x}`} x1={x} y1="248" x2={x} y2="272" stroke={rebarColor} strokeWidth="1" opacity="0.5" />
                    ))}
                  </motion.g>
                </g>

                {/* slab */}
                <g
                  className="struct-line cursor-pointer"
                  style={{ opacity: isDim('slab') ? 0.22 : 1 }}
                  onClick={() => select('slab')}
                >
                  <motion.g
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  >
                    <rect x="56" y="96" width="528" height="28" fill={fillRect} stroke={outline} strokeWidth="1.6" />
                    {[104, 112, 120].map((y) => (
                      <line key={`sl${y}`} className="rebar-flow" x1="64" y1={y} x2="576" y2={y} stroke={rebarColor} strokeWidth="1.8" style={{ animationDuration: selected === 'slab' ? '0.55s' : undefined }} />
                    ))}
                    {tickXs(100, 540, 44).map((x) => (
                      <line key={`slt${x}`} x1={x} y1="96" x2={x} y2="124" stroke={rebarColor} strokeWidth="1" opacity="0.5" />
                    ))}
                  </motion.g>
                </g>

                {/* stair */}
                <g
                  className="struct-line cursor-pointer"
                  style={{ opacity: isDim('stair') ? 0.22 : 1 }}
                  onClick={() => select('stair')}
                >
                  <motion.g
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.1, duration: 0.6 }}
                  >
                    <path
                      d="M320 402 l22 0 l0 -21 l22 0 l0 -21 l22 0 l0 -21 l22 0 l0 -21 l22 0 l0 -22 l12 0"
                      fill="none"
                      stroke={outline}
                      strokeWidth="1.6"
                    />
                    <line className="rebar-flow" x1="330" y1="396" x2="446" y2="284" stroke={rebarColor} strokeWidth="2" style={{ animationDuration: selected === 'stair' ? '0.55s' : undefined }} />
                  </motion.g>
                </g>

                {/* hotspots */}
                {(
                  [
                    { id: 'footing', x: 120, y: 388 },
                    { id: 'column', x: 121, y: 220 },
                    { id: 'beam', x: 320, y: 260 },
                    { id: 'slab', x: 320, y: 110 },
                    { id: 'stair', x: 400, y: 340 },
                  ] as const
                ).map((h, i) => {
                  const isActive = selected === h.id;
                  return (
                    <motion.g
                      key={h.id}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1.4 + i * 0.1, type: 'spring', stiffness: 260, damping: 16 }}
                      className="cursor-pointer"
                      onClick={() => select(h.id)}
                    >
                      {isActive && (
                        <circle cx={h.x} cy={h.y} r="15" fill="none" stroke={rebarColor} strokeWidth="1.5" className="animate-pulse-dot" />
                      )}
                      <circle
                        cx={h.x}
                        cy={h.y}
                        r={isActive ? 16 : 13}
                        fill={isActive ? rebarColor : theme === 'dark' ? '#14171d' : '#ffffff'}
                        stroke={rebarColor}
                        strokeWidth="2"
                      />
                      <text
                        x={h.x}
                        y={h.y + 4.5}
                        textAnchor="middle"
                        fontSize="13"
                        fontWeight="700"
                        fill={isActive ? '#ffffff' : theme === 'dark' ? '#f4f1ea' : '#111827'}
                        style={{ pointerEvents: 'none' }}
                      >
                        {PARTS.findIndex((p) => p.id === h.id) + 1}
                      </text>
                    </motion.g>
                  );
                })}
              </svg>
              <p className="text-mute/70 relative border-t border-line px-6 py-4 text-[0.7rem] leading-relaxed">
                {t(
                  'Engineering guide from site practice — your structural consultant approves the final bar bending schedule.',
                  'ከግንባታ ልምድ የተወሰደ መመሪያ — የመጨረሻውን የብረት ዝርዝር መሐንዲስዎ ያረጋግጣል።'
                )}
              </p>
            </div>
          </Reveal>

          {/* Info card */}
          <Reveal delay={0.12}>
            <div className="border-line bg-panel card-glow relative flex h-full flex-col overflow-hidden rounded-3xl border p-8 sm:p-10 shadow-lg">
              <div
                className="bg-ember/10 pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full blur-3xl"
                aria-hidden
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="flex h-full flex-col"
                >
                  <p className="font-display text-[0.68rem] font-bold tracking-[0.3em] text-ember uppercase">
                    {active.n} · {t(active.label, active.amLabel)}
                  </p>
                  <h3 className="font-display text-ink mt-4 text-2xl leading-tight font-bold sm:text-3xl">
                    {t(active.title, active.amTitle)}
                  </h3>
                  <p className="text-mute mt-4 text-xs sm:text-sm leading-relaxed sm:text-[0.95rem]">
                    {t(active.copy, active.amCopy)}
                  </p>

                  <div className="mt-auto pt-8">
                    <p className="text-ink flex items-center gap-2 text-xs font-semibold tracking-wide">
                      <MousePointerClick className="text-ember h-4 w-4" />
                      {t('Steel sizes used here — tap a size to load into quote:', 'እዚህ የሚገቡ መጠኖች — አንዱን መርጠው ዋጋ ይጠይቁ፡')}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2.5">
                      {active.sizes.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => sendToQuote(active, s)}
                          className="font-display border-line hover:border-ember bg-panel2/60 hover:bg-ember text-ink hover:text-white rounded-full border px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-300 shadow-sm cursor-pointer"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => sendToQuote(active, active.sizes[1] ?? active.sizes[0])}
                      className="group font-display bg-ember hover:bg-ember/90 text-white mt-5 inline-flex cursor-pointer items-center gap-2.5 rounded-full px-6 py-3.5 text-xs sm:text-sm font-bold transition-all shadow-md"
                    >
                      <span>{t('Take Size to Quote Form', 'ይህን መጠን ወደ ቅጹ ውሰድ')}</span>
                      <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
