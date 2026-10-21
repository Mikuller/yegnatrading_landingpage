import { useState, type MouseEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'motion/react';
import { ArrowDown, ArrowUpRight, ShieldCheck, MapPin, Ruler, Phone, Clock, FileDown } from 'lucide-react';
import { CONTACT, STATS } from '../data';
import { Counter, EASE, EmberButton } from '../ui';
import { useApp } from '../context/AppContext';
import InteractiveRebarBundle from '../components/InteractiveRebarBundle';
import type { QuotePrefill } from './RebarLab';

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

function RealRebarCard({ onQuote }: { onQuote?: (p: QuotePrefill) => void }) {
  const { t } = useApp();
  const shouldReduceMotion = useReducedMotion();
  const [displayMode, setDisplayMode] = useState<'animated' | 'render'>('animated');

  // 3D card tilt motion values with silky spring physics
  const cardX = useMotionValue(0);
  const cardY = useMotionValue(0);
  const springX = useSpring(cardX, { stiffness: 140, damping: 18, mass: 0.8 });
  const springY = useSpring(cardY, { stiffness: 140, damping: 18, mass: 0.8 });

  const rotateX = useTransform(springY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-12, 12]);
  const sheenX = useTransform(springX, [-0.5, 0.5], ['10%', '90%']);
  const sheenY = useTransform(springY, [-0.5, 0.5], ['10%', '90%']);

  const handlePointerMove = (e: MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    cardX.set((e.clientX - rect.left) / rect.width - 0.5);
    cardY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handlePointerLeave = () => {
    cardX.set(0);
    cardY.set(0);
  };

  return (
    <div
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      className="group/card relative mx-auto w-full max-w-lg lg:max-w-none select-none"
      style={{ perspective: 1200 }}
    >
      {/* 1. Ambient pulsing warm ember halo glow */}
      <motion.div
        className="bg-ember/25 dark:bg-ember/35 pointer-events-none absolute -inset-8 rounded-full blur-[90px] transition-opacity duration-700 group-hover/card:opacity-90"
        animate={
          shouldReduceMotion
            ? { opacity: 0.25 }
            : {
                scale: [0.96, 1.14, 0.96],
                opacity: [0.22, 0.45, 0.22],
              }
        }
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        aria-hidden
      />

      {/* 2. Glassmorphic showcase card with true 3D preserve-3d */}
      <motion.div
        style={
          shouldReduceMotion
            ? {}
            : {
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
              }
        }
        initial={{ opacity: 0, scale: 0.92, y: 32 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
        whileHover={shouldReduceMotion ? {} : { scale: 1.015 }}
        className="border-line bg-panel/96 dark:bg-panel/92 card-glow relative overflow-hidden rounded-3xl border p-6 shadow-2xl backdrop-blur-2xl sm:p-9 transition-colors duration-500"
      >
        {/* Subtle grid texture surface */}
        <div className="texture-grid absolute inset-0 opacity-40 dark:opacity-60" aria-hidden />

        {/* Dynamic interactive specular glass reflection that tracks pointer */}
        {!shouldReduceMotion && (
          <motion.div
            className="pointer-events-none absolute -inset-full rounded-3xl opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
            style={{
              background: `radial-gradient(500px circle at ${sheenX} ${sheenY}, rgba(255, 255, 255, 0.14), transparent 70%)`,
            }}
            aria-hidden
          />
        )}

        <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
          {/* Header pill & Certified badge (translateZ: 24px) */}
          <div
            className="flex items-center justify-between flex-wrap gap-2"
            style={{ transform: shouldReduceMotion ? undefined : 'translateZ(24px)' }}
          >
            <div className="flex items-center gap-2">
              <span className="font-display text-primary dark:text-amber text-[0.68rem] font-bold tracking-[0.28em] uppercase">
                YEGNA · GRADE 75
              </span>

              {/* View Mode Toggle Pill */}
              <div className="flex items-center rounded-full border border-line/60 bg-panel2/80 p-0.5 text-[0.6rem] font-bold">
                <button
                  type="button"
                  onClick={() => setDisplayMode('animated')}
                  className={`cursor-pointer rounded-full px-2.5 py-0.5 transition-all ${
                    displayMode === 'animated'
                      ? 'bg-ember text-white shadow-xs'
                      : 'text-mute hover:text-ink'
                  }`}
                >
                  {t('3D Kinetic Rods', 'ተንቀሳቃሽ')}
                </button>
                <button
                  type="button"
                  onClick={() => setDisplayMode('render')}
                  className={`cursor-pointer rounded-full px-2.5 py-0.5 transition-all ${
                    displayMode === 'render'
                      ? 'bg-ember text-white shadow-xs'
                      : 'text-mute hover:text-ink'
                  }`}
                >
                  {t('Studio Render', 'ስቱዲዮ')}
                </button>
              </div>
            </div>

            {/* Certified Pill (Shown in header only when in Studio Render mode) */}
            {displayMode === 'render' && (
              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.06 }}
                className="relative flex items-center gap-1.5 rounded-full border border-ember/25 bg-ember/10 px-2.5 py-1 text-ember shadow-sm backdrop-blur-sm cursor-default"
              >
                <span className="relative flex h-2 w-2">
                  {!shouldReduceMotion && (
                    <motion.span
                      className="absolute inline-flex h-full w-full rounded-full bg-ember opacity-75"
                      animate={{ scale: [1, 2.2], opacity: [0.75, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                    />
                  )}
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-ember" />
                </span>
                <ShieldCheck className="h-3.5 w-3.5" />
                <span className="text-[0.68rem] font-bold tracking-wider uppercase">
                  {t('Certified', 'የተረጋገጠ')}
                </span>
              </motion.div>
            )}
          </div>

          {/* REBAR SHOWCASE - Interactive 3D Kinetic Bundle or Studio Render (translateZ: 42px) */}
          <div
            className="relative my-3 flex items-center justify-center py-1 sm:my-4 sm:py-2"
            style={{ transform: shouldReduceMotion ? undefined : 'translateZ(42px)' }}
          >
            {displayMode === 'animated' ? (
              <InteractiveRebarBundle onQuote={onQuote} />
            ) : (
              <div className="relative mx-auto flex items-center justify-center">
                {/* Radial warm sheen highlight behind steel bundle */}
                <motion.div
                  className="absolute inset-0 scale-95 rounded-full bg-radial from-amber/30 via-ember/20 to-transparent blur-2xl"
                  animate={
                    shouldReduceMotion
                      ? {}
                      : {
                          scale: [0.95, 1.15, 0.95],
                          opacity: [0.35, 0.65, 0.35],
                        }
                  }
                  transition={{
                    duration: 4.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  aria-hidden
                />

                {/* Floating Rebar Wrapper */}
                <motion.div
                  animate={
                    shouldReduceMotion
                      ? {}
                      : {
                          y: [-5, 5, -5],
                          rotateZ: [-0.6, 0.6, -0.6],
                        }
                  }
                  transition={{
                    duration: 5.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="relative z-10 overflow-hidden rounded-2xl"
                >
                  <motion.img
                    src="/rebar-hero.png"
                    alt="Yegna Grade 75 certified steel reinforcement bars bundle"
                    width={340}
                    height={360}
                    className="relative z-10 mx-auto max-h-[300px] w-auto max-w-[280px] object-contain drop-shadow-[0_24px_36px_rgba(0,0,0,0.38)] transition-transform duration-700 sm:max-h-[360px] sm:max-w-[340px] group-hover/card:scale-[1.03]"
                    initial={{ opacity: 0, scale: 0.88, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5, ease: EASE }}
                  />

                  {/* Diagonal Metallic Specular Glint Sweep across steel ribs */}
                  {!shouldReduceMotion && (
                    <motion.div
                      className="pointer-events-none absolute -inset-y-12 -inset-x-20 w-24 -rotate-30 bg-gradient-to-r from-transparent via-white/40 dark:via-white/50 to-transparent blur-[3px] z-20"
                      animate={{
                        x: ['-120%', '350%'],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        repeatDelay: 3.8,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                      aria-hidden
                    />
                  )}
                </motion.div>
              </div>
            )}
          </div>

          {/* Spec Indicators Footer (translateZ: 22px) */}
          <div
            className="border-line mt-4 flex items-center justify-between border-t pt-5"
            style={{ transform: shouldReduceMotion ? undefined : 'translateZ(22px)' }}
          >
            <div>
              <p className="font-display text-ink text-lg font-bold sm:text-xl">6 – 32 mm</p>
              <p className="text-mute text-xs">
                {t('Metric bars, always in stock', 'በሙሉ መጠን በማንኛውም ጊዜ በስቶክ')}
              </p>
            </div>
            <div className="text-right">
              <p className="font-display text-ember text-lg font-bold sm:text-xl">
                {t('Kazanchis HQ', 'ዋናው ቢሮ')}
              </p>
              <p className="text-mute text-xs">Joburg Bldg, 5th Fl (2Q7F+J6X)</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3. Floating Trust Badge 1: Top-Left (Delivered anywhere) */}
      <motion.div
        className="border-line bg-panel2/95 text-ink shadow-xl absolute -top-5 -left-3 flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-md sm:-top-6 sm:-left-6 cursor-default z-30"
        style={{ transform: shouldReduceMotion ? undefined : 'translateZ(55px)' }}
        initial={{ opacity: 0, scale: 0.6, y: 16 }}
        animate={
          shouldReduceMotion
            ? { opacity: 1, scale: 1, y: 0 }
            : {
                opacity: 1,
                scale: 1,
                y: [-6, 6, -6],
                rotate: [-1, 1, -1],
              }
        }
        transition={
          shouldReduceMotion
            ? { delay: 1, duration: 0.5 }
            : {
                opacity: { delay: 0.9, duration: 0.5 },
                scale: { delay: 0.9, type: 'spring', stiffness: 220, damping: 16 },
                y: { duration: 4.2, repeat: Infinity, ease: 'easeInOut' },
                rotate: { duration: 4.2, repeat: Infinity, ease: 'easeInOut' },
              }
        }
        whileHover={shouldReduceMotion ? {} : { scale: 1.08, y: -4, rotate: -2 }}
      >
        <motion.div
          animate={shouldReduceMotion ? {} : { scale: [1, 1.25, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <MapPin className="text-ember h-4 w-4 shrink-0" />
        </motion.div>
        <span className="text-xs font-semibold">{t('Delivered anywhere', 'የትም ቦታ ማድረስ')}</span>
      </motion.div>

      {/* 4. Floating Trust Badge 2: Bottom-Right (Any quantity, any size) */}
      <motion.div
        className="border-line bg-panel2/95 text-ink shadow-xl absolute -right-3 -bottom-5 flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-md sm:-right-6 sm:-bottom-6 cursor-default z-30"
        style={{ transform: shouldReduceMotion ? undefined : 'translateZ(55px)' }}
        initial={{ opacity: 0, scale: 0.6, y: 16 }}
        animate={
          shouldReduceMotion
            ? { opacity: 1, scale: 1, y: 0 }
            : {
                opacity: 1,
                scale: 1,
                y: [6, -6, 6],
                rotate: [1, -1, 1],
              }
        }
        transition={
          shouldReduceMotion
            ? { delay: 1.2, duration: 0.5 }
            : {
                opacity: { delay: 1.1, duration: 0.5 },
                scale: { delay: 1.1, type: 'spring', stiffness: 220, damping: 16 },
                y: { duration: 5.0, repeat: Infinity, ease: 'easeInOut' },
                rotate: { duration: 5.0, repeat: Infinity, ease: 'easeInOut' },
              }
        }
        whileHover={shouldReduceMotion ? {} : { scale: 1.08, y: -4, rotate: 2 }}
      >
        <motion.div
          whileHover={shouldReduceMotion ? {} : { rotate: 25 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
          <Ruler className="text-ember h-4 w-4 shrink-0" />
        </motion.div>
        <span className="text-xs font-semibold">{t('Any quantity, any size', 'በማንኛውም መጠንና ልኬት')}</span>
      </motion.div>
    </div>
  );
}

export default function Hero({ onQuote }: { onQuote?: (p: QuotePrefill) => void }) {
  const { t } = useApp();

  return (
    <section
      id="top"
      className="texture-noise relative flex min-h-screen flex-col overflow-hidden pt-[110px] pb-16 lg:pt-[125px]"
    >
      {/* backdrop textures & ambient gradients */}
      <div className="texture-grid absolute inset-0" aria-hidden />
      <div
        className="absolute inset-0 bg-[radial-gradient(1100px_520px_at_78%_18%,rgba(245,124,0,0.12),transparent_65%),radial-gradient(800px_500px_at_12%_85%,rgba(31,42,68,0.06),transparent_60%)]"
        aria-hidden
      />
      <div
        className="animate-ember bg-ember/15 dark:bg-ember/25 absolute top-1/4 right-[12%] h-72 w-72 rounded-full blur-[110px]"
        aria-hidden
      />
      <div
        className="from-bg absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto grid w-full max-w-7xl flex-1 items-center gap-12 px-5 py-8 sm:px-8 lg:grid-cols-[1.12fr_0.88fr] lg:gap-16 lg:py-12">
        {/* left column: copy & CTA */}
        <div className="relative">
          {/* Soft ambient text-protective scrim halo ensuring 100% crisp legibility over background weave */}
          <div aria-hidden="true" className="text-protective-halo" />

          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
            className="flex flex-wrap items-center gap-3"
          >
            <div className="border-line bg-panel2/90 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[0.72rem] font-semibold tracking-[0.2em] uppercase backdrop-blur-sm">
              <ShieldCheck className="text-ember h-4 w-4" />
              <span className="text-ink">
                {t('Trade with Trust & Integrity!', 'ንግድ በእምነትና በታማኝነት!')}
              </span>
            </div>
            <span className="text-mute text-xs">
              {t('Est. 2017 · 7+ Years of Excellence', 'የተመሠረተበት 2017 · 7+ ዓመታት በታማኝነት')}
            </span>
          </motion.div>

          {/* Main Headline */}
          <h1 className="font-display headline-elevated text-ink mt-6 text-[clamp(2.7rem,7.5vw,5.6rem)] leading-[1.02] font-extrabold tracking-[-0.02em]">
            <HeadlineWord word={t('FOR A', 'ለተሻለ')} delay={0.35} />{' '}
            <span className="text-gradient-ember inline-block pr-2">
              <HeadlineWord word={t('STRONGER', 'ጠንካራ')} delay={0.45} />
            </span>
            <br />
            <span className="inline-block">
              <HeadlineWord word={t('TOMORROW', 'ነገ')} delay={0.55} />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
            className="text-primary dark:text-amber font-display text-elevated mt-4 text-base font-semibold tracking-wide sm:text-lg"
          >
            {t(
              "We're your best partner for building a better future.",
              'ለተሻለ ነገ አስተማማኝ የግንባታ አጋርዎ ነን።'
            )}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.82, ease: EASE }}
            className="text-mute text-elevated mt-4 max-w-xl text-sm leading-relaxed sm:text-base"
          >
            {t(
              'Yegna Trading supplies legally certified Grade 75 steel rebar, cement, staffa and formwork plywood across Ethiopia. Direct mill supplies, fair weight pricing, and on-time site dispatch.',
              'የኛ ትሬዲንግ ደረጃውን የጠበቀ የኮንክሪት ብረት (ሬባር G75)፣ ሲሚንቶ፣ ስታፋ እና ፕላይዉድ በመላው ኢትዮጵያ በታማኝነትና በተመጣጣኝ ዋጋ ያቀርባል።'
            )}
          </motion.p>

          {/* Quick Info Strips from spec 4.1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.95, ease: EASE }}
            className="border-line bg-panel2/90 card-glow backdrop-blur-xl mt-6 grid gap-3 rounded-2xl border p-4 sm:grid-cols-2"
          >
            <div className="flex items-start gap-2.5">
              <Clock className="text-ember mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="text-ink text-xs font-semibold">
                  {t('Opening Hours', 'የሥራ ሰዓት')}
                </p>
                <p className="text-mute text-[0.7rem] leading-tight">
                  Mon – Fri 08:30 AM – 5:30 PM
                  <br />
                  Sat 08:30 AM – 12:30 PM
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <MapPin className="text-ember mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="text-ink text-xs font-semibold">
                  {t('Head Office', 'ዋናው መሥሪያ ቤት')}
                </p>
                <p className="text-mute text-[0.7rem] leading-tight">
                  Kazanchis Joburg Bldg, 5th Floor
                  <br />
                  Addis Ababa (2Q7F+J6X)
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1, ease: EASE }}
            className="mt-8 flex flex-wrap items-center gap-3.5"
          >
            <EmberButton href="#quote">
              {t('Get Quotations Quickly', 'ፈጣን የዋጋ መጠየቂያ')}
              <ArrowUpRight className="h-4 w-4" />
            </EmberButton>
            <a
              href={`tel:${CONTACT.phoneClean}`}
              className="border-line bg-panel2/90 text-ink hover:border-ember hover:text-ember group inline-flex items-center gap-2.5 rounded-full border px-5 py-3 text-sm font-bold transition-all duration-300 shadow-2xs hover:shadow-[0_0_20px_rgba(245,124,0,0.25)] hover:-translate-y-0.5"
            >
              <span className="grid h-6 w-6 place-items-center rounded-full bg-ember/15 border border-ember/30 text-ember group-hover:bg-ember group-hover:text-white transition-colors">
                <Phone className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
              </span>
              <span className="font-mono">{CONTACT.phone}</span>
            </a>
            <a
              href={CONTACT.companyProfileUrl}
              target="_blank"
              rel="noreferrer"
              className="text-mute hover:text-ink inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors"
            >
              <FileDown className="h-3.5 w-3.5" />
              {t('Company Profile (PDF)', 'የድርጅት መገለጫ (PDF)')}
            </a>
          </motion.div>

          {/* Stats strip */}
          <motion.dl
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.25, ease: EASE }}
            className="border-line mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t pt-7 sm:grid-cols-4"
          >
            {STATS.map((s) => (
              <div key={s.label}>
                <dd className="font-display text-ink text-2xl font-bold sm:text-3xl">
                  <Counter value={s.value} suffix={s.suffix} />
                </dd>
                <dt className="text-mute mt-0.5 text-[0.68rem] font-medium tracking-wider uppercase">
                  {t(s.label, s.amLabel)}
                </dt>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* right column: Real 3D Rebar Card Showcase */}
        <div className="relative">
          <RealRebarCard onQuote={onQuote} />
        </div>
      </div>

      {/* scroll cue */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="text-mute hover:text-ember absolute bottom-3 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1.5 transition-colors md:flex"
        aria-label="Scroll down"
      >
        <span className="text-[0.62rem] font-semibold tracking-[0.3em] uppercase">
          {t('Scroll', 'ወደ ታች')}
        </span>
        <motion.span animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
          <ArrowDown className="h-3.5 w-3.5" />
        </motion.span>
      </motion.a>
    </section>
  );
}
