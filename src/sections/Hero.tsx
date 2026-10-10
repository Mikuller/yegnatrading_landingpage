import { type MouseEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ArrowDown, ArrowUpRight, ShieldCheck, MapPin, Ruler, Phone, Clock, FileDown } from 'lucide-react';
import { CONTACT, STATS } from '../data';
import { Counter, EASE, EmberButton } from '../ui';
import { useApp } from '../context/AppContext';

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

function RealRebarCard() {
  const { t } = useApp();

  return (
    <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
      {/* ambient orange/amber halo glow */}
      <div
        className="bg-ember/20 dark:bg-ember/25 absolute -inset-6 rounded-full blur-[90px] transition-all"
        aria-hidden
      />

      {/* glassmorphic showcase card */}
      <div className="border-line bg-panel/90 dark:bg-panel/75 card-glow relative overflow-hidden rounded-3xl border p-6 shadow-2xl backdrop-blur-md sm:p-9">
        <div className="texture-grid absolute inset-0 opacity-40 dark:opacity-60" aria-hidden />

        <div className="relative">
          {/* header pill */}
          <div className="flex items-center justify-between">
            <span className="font-display text-primary dark:text-amber text-[0.68rem] font-bold tracking-[0.28em] uppercase">
              YEGNA · GRADE 75
            </span>
            <div className="flex items-center gap-1.5 rounded-full bg-ember/10 px-2.5 py-1 text-ember">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-[0.68rem] font-semibold tracking-wider uppercase">
                {t('Certified', 'የተረጋገጠ')}
              </span>
            </div>
          </div>

          {/* REAL REBAR IMAGE (Replacing SVG illustration) */}
          <div className="relative my-4 flex items-center justify-center py-2 sm:my-6 sm:py-4">
            <div className="group relative mx-auto flex items-center justify-center">
              {/* Radial sheen highlight behind rebar */}
              <div
                className="absolute inset-0 scale-90 rounded-full bg-radial from-amber/25 via-ember/15 to-transparent blur-2xl transition-transform duration-700 group-hover:scale-110"
                aria-hidden
              />
              <motion.img
                src="/rebar-hero.png"
                alt="Yegna Grade 75 certified steel reinforcement bars bundle"
                className="relative z-10 mx-auto max-h-[300px] w-auto max-w-[280px] object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.35)] transition-transform duration-700 sm:max-h-[360px] sm:max-w-[340px] group-hover:scale-[1.03]"
                initial={{ opacity: 0, scale: 0.9, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
              />
            </div>
          </div>

          {/* spec indicators footer */}
          <div className="border-line mt-4 flex items-center justify-between border-t pt-5">
            <div>
              <p className="font-display text-ink text-lg font-bold sm:text-xl">Ø 6 – 32 mm</p>
              <p className="text-mute text-xs">
                {t('Metric bars, always in stock', 'በሙሉ መጠን በማንኛውም ጊዜ በስቶክ')}
              </p>
            </div>
            <div className="text-right">
              <p className="font-display text-ember text-lg font-bold sm:text-xl">
                {t('7 Branches', '7 ቅርንጫፎች')}
              </p>
              <p className="text-mute text-xs">Addis Ababa · Bahirdar</p>
            </div>
          </div>
        </div>
      </div>

      {/* floating trust chips */}
      <motion.div
        className="border-line bg-panel2/95 text-ink shadow-lg absolute -top-5 -left-3 flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-md sm:-top-6 sm:-left-6"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.6, ease: EASE }}
      >
        <MapPin className="text-ember h-4 w-4 shrink-0" />
        <span className="text-xs font-semibold">{t('Delivered anywhere', 'የትም ቦታ ማድረስ')}</span>
      </motion.div>

      <motion.div
        className="border-line bg-panel2/95 text-ink shadow-lg absolute -right-3 -bottom-5 flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-md sm:-right-6 sm:-bottom-6"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.4, duration: 0.6, ease: EASE }}
      >
        <Ruler className="text-ember h-4 w-4 shrink-0" />
        <span className="text-xs font-semibold">{t('Any quantity, any size', 'በማንኛውም መጠንና ልኬት')}</span>
      </motion.div>
    </div>
  );
}

export default function Hero() {
  const { t } = useApp();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 18 });
  const sy = useSpring(my, { stiffness: 50, damping: 18 });
  const rotY = useTransform(sx, [-0.5, 0.5], [6, -6]);
  const rotX = useTransform(sy, [-0.5, 0.5], [-5, 5]);

  const onMouseMove = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <section
      id="top"
      onMouseMove={onMouseMove}
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
        <div>
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
          <h1 className="font-display text-ink mt-6 text-[clamp(2.7rem,7.5vw,5.6rem)] leading-[1.02] font-extrabold tracking-[-0.02em]">
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
            className="text-primary dark:text-amber font-display mt-4 text-base font-semibold tracking-wide sm:text-lg"
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
            className="text-mute mt-4 max-w-xl text-sm leading-relaxed sm:text-base"
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
            className="border-line bg-panel2/60 mt-6 grid gap-3 rounded-2xl border p-4 sm:grid-cols-2"
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
              className="border-line bg-panel2/80 text-ink hover:border-ember hover:text-ember group inline-flex items-center gap-2 rounded-full border px-6 py-3.5 text-sm font-semibold transition-all duration-300"
            >
              <Phone className="text-ember h-4 w-4 transition-transform group-hover:scale-110" />
              <span>{CONTACT.phone}</span>
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
        <div className="perspective-[1200px]" style={{ perspective: 1200 }}>
          <motion.div style={{ rotateX: rotX, rotateY: rotY }} className="animate-float">
            <RealRebarCard />
          </motion.div>
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
