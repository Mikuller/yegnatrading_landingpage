import { type MouseEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ArrowDown, ArrowUpRight, ShieldCheck, MapPin, Ruler } from 'lucide-react';
import { CONTACT, STATS } from '../data';
import { Counter, EASE, EmberButton } from '../ui';

function HeadlineWord({ word, delay }: { word: string; delay: number }) {
  return (
    <span className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom">
      <motion.span
        className="inline-block"
        initial={{ y: '110%' }}
        animate={{ y: 0 }}
        transition={{ duration: 1, delay, ease: EASE }}
      >
        {word}
      </motion.span>
    </span>
  );
}

const CYLS = [
  { x: 100, y: 96, r: 40, d: 0 },
  { x: 182, y: 72, r: 35, d: 0.09 },
  { x: 254, y: 100, r: 42, d: 0.18 },
  { x: 74, y: 166, r: 32, d: 0.27 },
  { x: 152, y: 150, r: 38, d: 0.24 },
  { x: 230, y: 168, r: 34, d: 0.36 },
  { x: 118, y: 224, r: 28, d: 0.45 },
  { x: 196, y: 222, r: 31, d: 0.4 },
];

// shaft end point — bars fan slightly outward from the bundle center
const shaftEnd = (c: (typeof CYLS)[number]) => ({
  x: c.x + (c.x - 165) * 0.42 + 22,
  y: c.y + 238,
});

function RebarCluster() {
  return (
    <svg viewBox="0 0 330 300" className="h-auto w-full" role="img" aria-label="Bundle of ribbed steel rebar">
      <defs>
        {/* cylindrical shading across each shaft — light from top-left */}
        <linearGradient id="shaftGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0b0d10" />
          <stop offset="0.14" stopColor="#272d36" />
          <stop offset="0.32" stopColor="#5f6978" />
          <stop offset="0.5" stopColor="#373e4a" />
          <stop offset="0.74" stopColor="#1b1f26" />
          <stop offset="1" stopColor="#0a0c0e" />
        </linearGradient>
        <radialGradient id="faceGrad" cx="0.36" cy="0.3" r="0.95">
          <stop offset="0" stopColor="#8b95a5" />
          <stop offset="0.22" stopColor="#596273" />
          <stop offset="0.5" stopColor="#333947" />
          <stop offset="0.75" stopColor="#1d2129" />
          <stop offset="1" stopColor="#11141a" />
        </radialGradient>
        <radialGradient id="specGrad" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="rgba(225,235,250,0.5)" />
          <stop offset="0.6" stopColor="rgba(225,235,250,0.14)" />
          <stop offset="1" stopColor="rgba(225,235,250,0)" />
        </radialGradient>
        <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="rgba(235,242,252,0.32)" />
          <stop offset="1" stopColor="rgba(235,242,252,0.02)" />
        </linearGradient>
        <linearGradient id="emberArc" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffb25c" />
          <stop offset="1" stopColor="#ff5a1f" />
        </linearGradient>
      </defs>

      {/* bar shafts running down-right */}
      {/* 1) merged dark mass so gaps read as bundle depth, not background */}
      {CYLS.map((c, i) => (
        <motion.line
          key={`mass-${i}`}
          x1={c.x}
          y1={c.y}
          x2={c.x + 52}
          y2={c.y + 230}
          stroke="#0b0c10"
          strokeWidth={c.r * 2 + 22}
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 + i * 0.07, duration: 0.7 }}
        />
      ))}
      {/* 2) steel bodies with cylindrical shading */}
      {CYLS.map((c, i) => (
        <motion.line
          key={`shaft-${i}`}
          x1={c.x}
          y1={c.y}
          x2={c.x + 52}
          y2={c.y + 230}
          stroke="url(#shaftGrad)"
          strokeWidth={c.r * 2 - 6}
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 + i * 0.07, duration: 0.7 }}
        />
      ))}
      {/* 3) transverse rib grooves: dark bands + thin light catch on each rib, phase-shifted per bar */}
      {CYLS.map((c, i) => (
        <motion.g
          key={`rib-${i}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 + i * 0.07, duration: 0.7 }}
        >
          <line
            x1={c.x}
            y1={c.y}
            x2={c.x + 52}
            y2={c.y + 230}
            stroke="#101318"
            strokeWidth={c.r * 2 - 6}
            strokeDasharray="4.5 13"
            strokeDashoffset={i * 11}
            opacity="0.8"
          />
          <line
            x1={c.x}
            y1={c.y}
            x2={c.x + 52}
            y2={c.y + 230}
            stroke="rgba(205,218,236,0.15)"
            strokeWidth={c.r * 2 - 6}
            strokeDasharray="1.5 16"
            strokeDashoffset={i * 11 + 5.2}
          />
        </motion.g>
      ))}
      {/* 4) specular streak + reflected light along each shaft */}
      {CYLS.map((c, i) => (
        <motion.g
          key={`streak-${i}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 + i * 0.07, duration: 0.7 }}
        >
          <line
            x1={c.x - c.r * 0.38}
            y1={c.y + c.r * 0.09}
            x2={c.x + 52 - c.r * 0.38}
            y2={c.y + 230 + c.r * 0.09}
            stroke="rgba(215,228,246,0.16)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1={c.x + c.r * 0.36}
            y1={c.y - c.r * 0.08}
            x2={c.x + 52 + c.r * 0.36}
            y2={c.y + 230 - c.r * 0.08}
            stroke="rgba(125,140,165,0.10)"
            strokeWidth="2"
          />
        </motion.g>
      ))}

      {/* front faces */}
      {CYLS.map((c, i) => (
        <g key={`face-${i}`} transform={`translate(${c.x} ${c.y})`}>
          <motion.g
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.95 + c.d, type: 'spring', stiffness: 210, damping: 16 }}
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          >
            <circle r={c.r} fill="url(#faceGrad)" stroke="#0a0b0e" strokeWidth="5" />
            {/* rib crest catchlight on the lit edge */}
            <circle r={c.r - 2} fill="none" stroke="url(#ringGrad)" strokeWidth="1.8" />
            {/* transverse rib grooves — slowly flowing */}
            <circle
              className="rib-spin"
              r={c.r - 6}
              fill="none"
              stroke="rgba(12,15,20,0.6)"
              strokeWidth="2.4"
              strokeDasharray="2.5 4.5"
              pathLength={90}
            />
            {/* core rib marks */}
            <circle
              r={c.r * 0.6}
              fill="none"
              stroke="rgba(0,0,0,0.32)"
              strokeWidth="1.4"
              strokeDasharray="1.5 5"
              pathLength={60}
            />
            {/* specular highlight */}
            <ellipse
              cx={-c.r * 0.3}
              cy={-c.r * 0.38}
              rx={c.r * 0.44}
              ry={c.r * 0.3}
              fill="url(#specGrad)"
              transform={`rotate(-18 ${-c.r * 0.3} ${-c.r * 0.38})`}
            />
            {/* core shadow crescent, bottom-right */}
            <circle
              r={c.r - 1.2}
              fill="none"
              stroke="#050609"
              strokeWidth="3.2"
              strokeLinecap="round"
              pathLength={100}
              strokeDasharray="34 66"
              transform="rotate(28)"
              opacity="0.85"
            />
            {/* ember brand light */}
            <circle
              r={c.r - 3.2}
              fill="none"
              stroke="url(#emberArc)"
              strokeWidth="2.2"
              strokeLinecap="round"
              pathLength={100}
              strokeDasharray="16 84"
              transform="rotate(-150)"
            />
          </motion.g>
        </g>
      ))}
    </svg>
  );
}

function RebarCard() {
  return (
    <div className="relative">
      {/* halo */}
      <div className="bg-ember/20 absolute -inset-10 rounded-full blur-[90px]" aria-hidden />

      <div className="border-line bg-panel/70 relative overflow-hidden rounded-3xl border p-8 backdrop-blur-sm sm:p-10">
        <div className="texture-grid absolute inset-0 opacity-60" aria-hidden />
        <div className="relative">
          <div className="flex items-center justify-between">
            <span className="font-display text-mute text-[0.65rem] font-semibold tracking-[0.3em] uppercase">
              Yegna · Grade 75
            </span>
            <ShieldCheck className="text-ember h-5 w-5" />
          </div>

          {/* isometric rebar bundle */}
          <div className="mt-6" aria-hidden>
            <RebarCluster />
          </div>

          <div className="border-line mt-8 flex items-center justify-between border-t pt-5">
            <div>
              <p className="font-display text-lg font-bold">Ø 6 – 32 mm</p>
              <p className="text-mute text-xs">Metric bars, always in stock</p>
            </div>
            <div className="text-right">
              <p className="font-display text-lg font-bold text-ember">7 Branches</p>
              <p className="text-mute text-xs">Addis Ababa · Bahirdar</p>
            </div>
          </div>
        </div>
      </div>

      {/* floating chips */}
      <motion.div
        className="border-line bg-panel2/90 absolute -top-6 -left-4 flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-md sm:-left-10"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.6, duration: 0.6, ease: EASE }}
      >
        <MapPin className="text-ember h-4 w-4" />
        <span className="text-xs font-semibold">Delivered anywhere</span>
      </motion.div>
      <motion.div
        className="border-line bg-panel2/90 absolute -right-3 -bottom-6 flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-md sm:-right-8"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.85, duration: 0.6, ease: EASE }}
      >
        <Ruler className="text-ember h-4 w-4" />
        <span className="text-xs font-semibold">Any quantity, any size</span>
      </motion.div>
    </div>
  );
}

export default function Hero() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 18 });
  const sy = useSpring(my, { stiffness: 50, damping: 18 });
  const rotY = useTransform(sx, [-0.5, 0.5], [7, -7]);
  const rotX = useTransform(sy, [-0.5, 0.5], [-6, 6]);

  const onMouseMove = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <section
      id="top"
      onMouseMove={onMouseMove}
      className="texture-noise relative flex min-h-screen flex-col overflow-hidden pt-[76px]"
    >
      {/* backdrop */}
      <div className="texture-grid absolute inset-0" aria-hidden />
      <div
        className="absolute inset-0 bg-[radial-gradient(1100px_520px_at_78%_18%,rgba(255,90,31,0.16),transparent_65%),radial-gradient(800px_500px_at_12%_85%,rgba(255,178,92,0.07),transparent_60%)]"
        aria-hidden
      />
      <div className="animate-ember bg-ember/25 absolute top-1/4 right-[12%] h-72 w-72 rounded-full blur-[110px]" aria-hidden />
      <div
        className="from-bg absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto grid w-full max-w-7xl flex-1 items-center gap-16 px-5 py-16 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:py-8">
        {/* copy */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
            className="border-line inline-flex items-center gap-2.5 rounded-full border bg-white/[0.03] px-4 py-2 text-[0.72rem] font-semibold tracking-[0.22em] uppercase backdrop-blur-sm"
          >
            <ShieldCheck className="text-ember h-4 w-4" />
            <span className="text-mute">Legally Certified Rebar Supplier · Est. 2017</span>
          </motion.p>

          <h1 className="font-display mt-8 text-[clamp(2.9rem,8.5vw,6.2rem)] leading-[0.98] font-extrabold tracking-[-0.02em]">
            <HeadlineWord word="FOR A" delay={0.45} />{' '}
            <HeadlineWord word="STRONGER" delay={0.55} />
            <br />
            <motion.span
              className="inline-block h-[0.92em] align-baseline"
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.68, ease: EASE }}
            >
              <svg
                viewBox="0 0 640 100"
                className="inline-block h-full w-auto"
                role="img"
                aria-label="TOMORROW"
              >
                <text
                  x="2"
                  y="86"
                  textLength="636"
                  lengthAdjust="spacingAndGlyphs"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: '106px',
                    fill: 'transparent',
                    stroke: 'rgba(244,241,234,0.42)',
                    strokeWidth: 1.6,
                  }}
                >
                  TOMORROW
                </text>
              </svg>
            </motion.span>
            <span className="text-gradient-ember font-serif-i ml-4 inline-block text-[0.55em] font-normal">
              <HeadlineWord word="built to last." delay={0.85} />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0, ease: EASE }}
            className="text-mute mt-7 max-w-xl text-base leading-relaxed sm:text-lg"
          >
            Premium steel rebar, cement, staffa and plywood — supplied with reliable stock, fair
            pricing and expert support for Ethiopia's most ambitious construction projects.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.15, ease: EASE }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <EmberButton href="#quote">
              Get a Quotation
              <ArrowUpRight className="h-4 w-4" />
            </EmberButton>
            <EmberButton href="#products" variant="ghost">
              Explore Products
            </EmberButton>
          </motion.div>

          {/* stats strip */}
          <motion.dl
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.35, ease: EASE }}
            className="border-line mt-14 grid grid-cols-2 gap-x-8 gap-y-6 border-t pt-8 sm:grid-cols-4"
          >
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="text-mute order-2 mt-1 text-[0.7rem] font-medium tracking-[0.14em] uppercase">
                  {s.label}
                </dt>
                <dd className="font-display order-1 text-3xl font-bold sm:text-4xl">
                  <Counter value={s.value} suffix={s.suffix} />
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* interactive card */}
        <div className="hidden perspective-[1200px] lg:block" style={{ perspective: 1200 }}>
          <motion.div style={{ rotateX: rotX, rotateY: rotY }} className="animate-float">
            <RebarCard />
          </motion.div>
        </div>
      </div>

      {/* scroll cue */}
      <motion.a
        href="#company"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="text-mute hover:text-ember absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 transition-colors md:flex"
        aria-label="Scroll down"
      >
        <span className="text-[0.62rem] font-semibold tracking-[0.3em] uppercase">Scroll</span>
        <motion.span animate={{ y: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
          <ArrowDown className="h-4 w-4" />
        </motion.span>
      </motion.a>

      {/* phone ribbon */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.9, duration: 0.8, ease: EASE }}
        className="border-line bg-panel/60 absolute top-28 right-6 hidden rounded-full border px-4 py-2 text-xs backdrop-blur-md xl:block"
      >
        <a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`} className="hover:text-ember transition-colors">
          <span className="text-mute">Hotline · </span>
          {CONTACT.phone}
        </a>
      </motion.div>
    </section>
  );
}
