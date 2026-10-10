import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Package } from 'lucide-react';
import { PRODUCTS, REBAR_SIZES, type Product } from '../data';
import { EASE, Reveal, SectionHead } from '../ui';

function ProductIcon({ icon }: { icon: Product['icon'] }) {
  const cls = 'h-9 w-9';
  switch (icon) {
    case 'rebar':
      return (
        <svg viewBox="0 0 40 40" className={cls} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <rect x="6" y="8" width="5" height="28" rx="1.5" />
          <rect x="16" y="8" width="5" height="28" rx="1.5" />
          <rect x="26" y="8" width="5" height="28" rx="1.5" />
          <path d="M6 13h5M6 19h5M6 25h5M6 31h5M16 13h5M16 19h5M16 25h5M16 31h5M26 13h5M26 19h5M26 25h5M26 31h5" strokeWidth="1.2" />
        </svg>
      );
    case 'cement':
      return (
        <svg viewBox="0 0 40 40" className={cls} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M10 12 L20 8 L30 12 L30 30 Q30 33 27 33 L13 33 Q10 33 10 30 Z" />
          <path d="M10 12 Q20 16 30 12" />
          <path d="M14 20 Q20 23 26 20" strokeWidth="1.2" />
        </svg>
      );
    case 'coil':
      return (
        <svg viewBox="0 0 40 40" className={cls} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <circle cx="20" cy="20" r="13" />
          <circle cx="20" cy="20" r="8" />
          <circle cx="20" cy="20" r="3.5" />
          <path d="M20 7 a13 13 0 0 1 12.5 9.6" stroke="currentColor" strokeWidth="3" />
        </svg>
      );
    case 'plywood':
      return (
        <svg viewBox="0 0 40 40" className={cls} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M6 30 L20 34 L34 30 L20 26 Z" />
          <path d="M6 24 L20 28 L34 24" strokeWidth="1.4" />
          <path d="M6 18 L20 22 L34 18" strokeWidth="1.4" />
          <path d="M6 12 L20 16 L34 12" strokeWidth="1.4" />
        </svg>
      );
  }
}

function RebarExplorer() {
  const [sel, setSel] = useState(REBAR_SIZES[3]); // 14mm
  const maxKg = 75.72;
  const pct = Math.max(6, Math.round((sel.kg / maxKg) * 100));

  return (
    <Reveal delay={0.1}>
      <div className="border-line bg-panel/70 relative overflow-hidden rounded-3xl border backdrop-blur-sm">
        <div className="texture-grid absolute inset-0 opacity-30" aria-hidden />
        <div className="relative grid gap-10 p-8 sm:p-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="font-display text-[0.68rem] font-bold tracking-[0.3em] text-ember uppercase">
              Interactive · Rebar Weight Guide
            </p>
            <h3 className="font-display mt-4 text-2xl font-bold sm:text-3xl">
              Pick a diameter.
              <br />
              <span className="text-mute">See the weight per bar.</span>
            </h3>
            <p className="text-mute mt-4 max-w-md text-sm leading-relaxed">
              Standard metric sizes from 6mm coil up to 32mm heavy bar. Your quotation includes
              exact weight-based pricing — no surprises.
            </p>

            <div className="mt-8 flex flex-wrap gap-2.5">
              {REBAR_SIZES.map((s) => (
                <button
                  key={s.mm}
                  type="button"
                  onClick={() => setSel(s)}
                  className={`font-display rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300 cursor-pointer ${
                    sel.mm === s.mm
                      ? 'border-ember bg-ember text-bg shadow-[0_0_20px_rgba(255,90,31,0.4)]'
                      : 'border-line text-mute hover:border-ember/50 hover:text-ink'
                  }`}
                >
                  Ø{s.mm}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center border-line lg:border-l lg:pl-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={sel.mm}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <div className="flex items-end gap-3">
                  <span className="font-display text-gradient-ember text-6xl font-extrabold tracking-tight sm:text-7xl">
                    {sel.kg}
                  </span>
                  <span className="text-mute pb-2 text-sm font-semibold tracking-wide uppercase">
                    kg / piece · Ø{sel.mm}mm
                  </span>
                </div>

                <div className="mt-6 h-3 w-full overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    className="from-ember to-amber h-full rounded-full bg-gradient-to-r"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.7, ease: EASE }}
                  />
                </div>

                <div className="text-mute mt-6 grid grid-cols-3 gap-4 text-center text-xs">
                  <div className="border-line rounded-xl border py-3">
                    <p className="font-display text-ink text-base font-bold">Grade 75</p>
                    <p className="mt-0.5">Yield strength</p>
                  </div>
                  <div className="border-line rounded-xl border py-3">
                    <p className="font-display text-ink text-base font-bold">Metric</p>
                    <p className="mt-0.5">Standard bars</p>
                  </div>
                  <div className="border-line rounded-xl border py-3">
                    <p className="font-display text-ember text-base font-bold">In Stock</p>
                    <p className="mt-0.5">All branches</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export default function Products() {
  return (
    <section id="products" className="relative overflow-hidden py-28 sm:py-36">
      <div
        className="absolute inset-0 bg-[radial-gradient(800px_460px_at_10%_10%,rgba(255,90,31,0.05),transparent_60%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHead
            eyebrow="What We Supply"
            title="Everything your build needs,"
            accent="stocked deep."
            sub="From foundation steel to formwork plywood — four product lines, one reliable partner, seven branches to serve you."
          />
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08}>
              <div className="card-glow border-line bg-panel/60 group relative h-full overflow-hidden rounded-2xl border p-7">
                <div
                  className="bg-ember/10 absolute -top-16 -right-16 h-36 w-36 rounded-full blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                  aria-hidden
                />
                <div className="text-ember relative transition-transform duration-500 group-hover:-translate-y-1">
                  <ProductIcon icon={p.icon} />
                </div>
                <p className="font-display text-mute relative mt-6 text-[0.65rem] font-bold tracking-[0.25em] uppercase">
                  {p.tagline}
                </p>
                <h3 className="font-display relative mt-2 text-xl font-bold">{p.name}</h3>
                <p className="text-mute relative mt-3 text-sm leading-relaxed">{p.copy}</p>
                <a
                  href="#quote"
                  className="text-ember relative mt-6 inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-300 hover:gap-3"
                >
                  Get pricing
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-14">
          <RebarExplorer />
        </div>

        <Reveal delay={0.1}>
          <p className="text-mute mt-8 flex items-center justify-center gap-2 text-center text-xs tracking-wide">
            <Package className="text-ember h-4 w-4" />
            6mm is supplied as steel coil (staffa) · all other sizes as standard metric bars
          </p>
        </Reveal>
      </div>
    </section>
  );
}
