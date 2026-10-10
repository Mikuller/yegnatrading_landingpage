import { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Navigation, Phone } from 'lucide-react';
import { BRANCHES, type Branch } from '../data';
import { EASE, Reveal, SectionHead } from '../ui';

const LNG_MIN = 38.7;
const LNG_MAX = 38.9;
const LAT_MIN = 8.92;
const LAT_MAX = 9.06;

function project(b: Branch) {
  const x = 6 + ((b.lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * 88;
  const y = 8 + ((LAT_MAX - b.lat) / (LAT_MAX - LAT_MIN)) * 84;
  return { x: Math.min(94, Math.max(6, x)), y: Math.min(92, Math.max(8, y)) };
}

function MiniMap({ selected, onSelect }: { selected: Branch; onSelect: (b: Branch) => void }) {
  return (
    <div className="border-line bg-panel/70 texture-noise relative aspect-[16/10] overflow-hidden rounded-3xl border">
      <div className="texture-grid absolute inset-0 opacity-50" aria-hidden />
      {/* stylized ring roads */}
      <svg viewBox="0 0 100 62.5" className="absolute inset-0 h-full w-full" aria-hidden>
        <ellipse
          cx="50"
          cy="31"
          rx="34"
          ry="22"
          fill="none"
          stroke="rgba(244,241,234,0.08)"
          strokeWidth="0.4"
        />
        <ellipse
          cx="50"
          cy="31"
          rx="20"
          ry="13"
          fill="none"
          stroke="rgba(244,241,234,0.07)"
          strokeWidth="0.4"
        />
        <path
          d="M8 34 Q 50 26 94 30"
          fill="none"
          stroke="rgba(244,241,234,0.07)"
          strokeWidth="0.4"
        />
      </svg>

      {BRANCHES.filter((b) => !b.outside).map((b) => {
        const { x, y } = project(b);
        const active = selected.name === b.name;
        return (
          <button
            key={b.name}
            type="button"
            onClick={() => onSelect(b)}
            className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{ left: `${x}%`, top: `${y}%` }}
            aria-label={b.name}
          >
            <span
              className={`block h-3.5 w-3.5 rounded-full border-2 transition-all duration-300 ${
                active
                  ? 'animate-pulse-dot scale-125 border-ember bg-ember'
                  : 'border-ember/60 bg-bg group-hover:scale-125 group-hover:bg-ember'
              }`}
            />
            <span
              className={`font-display pointer-events-none absolute top-5 left-1/2 -translate-x-1/2 rounded-md px-2 py-1 text-[0.62rem] font-semibold tracking-wide whitespace-nowrap transition-all duration-300 ${
                active
                  ? 'bg-ember text-bg'
                  : 'bg-panel2/90 text-mute border-line border opacity-0 group-hover:opacity-100'
              }`}
            >
              {b.name}
            </span>
          </button>
        );
      })}

      <div className="border-line absolute right-4 bottom-4 rounded-xl border bg-bg/70 px-3.5 py-2.5 backdrop-blur-md">
        <p className="font-display text-[0.6rem] font-bold tracking-[0.25em] text-ember uppercase">
          Bahirdar
        </p>
        <p className="text-mute mt-0.5 text-[0.65rem]">Regional branch · +251 943 000 055</p>
      </div>
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <MapPin className="text-ember h-4 w-4" />
        <span className="font-display text-[0.62rem] font-bold tracking-[0.25em] uppercase opacity-80">
          Addis Ababa
        </span>
      </div>
    </div>
  );
}

export default function Branches() {
  const [selected, setSelected] = useState<Branch>(BRANCHES[0]);

  const mapsHref = (b: Branch) =>
    `https://maps.google.com/maps?q=${b.lat},${b.lng}&ll=${b.lat},${b.lng}&z=16`;

  return (
    <section id="branches" className="relative overflow-hidden py-28 sm:py-36">
      <div
        className="absolute inset-0 bg-[radial-gradient(800px_500px_at_90%_30%,rgba(255,90,31,0.05),transparent_60%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead
          eyebrow="Our Network"
          title="Seven branches."
          accent="One call away."
          sub="Stock-ready yards across Addis Ababa and Bahirdar — your order ships from the branch nearest your site."
        />

        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_1.25fr] lg:gap-14">
          <Reveal>
            <ul className="divide-line flex flex-col divide-y border-y">
              {BRANCHES.map((b, i) => {
                const active = selected.name === b.name;
                return (
                  <motion.li
                    key={b.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
                  >
                    <button
                      type="button"
                      onClick={() => setSelected(b)}
                      className={`group flex w-full cursor-pointer items-center justify-between gap-4 px-2 py-4.5 text-left transition-colors duration-300 sm:px-4 ${
                        active ? 'text-ink' : 'text-mute hover:text-ink'
                      }`}
                    >
                      <span className="flex items-center gap-4">
                        <span
                          className={`h-2 w-2 rounded-full transition-all duration-300 ${
                            active ? 'bg-ember scale-125' : 'bg-line group-hover:bg-ember/50'
                          }`}
                        />
                        <span className="font-display text-base font-bold sm:text-lg">{b.name}</span>
                        {b.outside && (
                          <span className="border-line rounded-full border px-2.5 py-0.5 text-[0.6rem] font-semibold tracking-[0.15em] uppercase">
                            Regional
                          </span>
                        )}
                      </span>
                      <span className="text-xs tabular-nums">{b.phone}</span>
                    </button>
                  </motion.li>
                );
              })}
            </ul>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="flex flex-col gap-6">
              <MiniMap selected={selected} onSelect={setSelected} />
              <motion.div
                key={selected.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="border-line bg-panel/70 flex flex-wrap items-center justify-between gap-5 rounded-2xl border p-6"
              >
                <div>
                  <p className="font-display text-lg font-bold">Yegna {selected.name} Branch</p>
                  <a
                    href={`tel:${selected.phone.replace(/\s/g, '')}`}
                    className="text-mute hover:text-ember mt-1 flex items-center gap-2 text-sm transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    {selected.phone}
                  </a>
                </div>
                <a
                  href={mapsHref(selected)}
                  target="_blank"
                  rel="noreferrer"
                  className="group border-line hover:border-ember/60 hover:text-ember font-display inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-all duration-300"
                >
                  Get Directions
                  <Navigation className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                </a>
              </motion.div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
