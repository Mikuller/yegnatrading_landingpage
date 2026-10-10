import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { VALUES } from '../data';
import { EASE, Reveal, SectionHead } from '../ui';

function ValueItem({ idx, label }: { idx: number; label: string }) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -18 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: idx * 0.07, ease: EASE }}
      className="flex items-center gap-3.5"
    >
      <CheckCircle2 className="text-ember h-5 w-5 shrink-0" />
      <span className="font-display text-[0.95rem] font-medium">{label}</span>
    </motion.li>
  );
}

export default function About() {
  return (
    <section id="company" className="texture-noise relative overflow-hidden py-28 sm:py-36">
      <div
        className="absolute inset-0 bg-[radial-gradient(700px_400px_at_85%_20%,rgba(255,90,31,0.06),transparent_65%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHead eyebrow="Who We Are" title="Trade with" accent="trust & integrity." />
            <Reveal delay={0.2}>
              <p className="text-mute mt-8 text-base leading-relaxed sm:text-lg">
                Yegna Trading PLC is a locally owned business in the heart of Addis Ababa. Since
                2017 we've supplied rebar, cement, staffa and plywood to commercial contractors,
                building owners, private and public enterprises, and residential projects across
                Ethiopia.
              </p>
            </Reveal>
            <Reveal delay={0.28}>
              <p className="text-mute mt-5 text-base leading-relaxed sm:text-lg">
                Our experienced staff deliver personal, up-front service — flexibility, honesty and
                above all, results for your project.
              </p>
            </Reveal>

            <Reveal delay={0.36}>
              <div className="border-line mt-10 grid grid-cols-1 gap-6 border-t pt-8 sm:grid-cols-2">
                <div className="border-line border-l-2 pl-5">
                  <p className="font-display text-ember text-[0.68rem] font-bold tracking-[0.25em] uppercase">
                    Mission
                  </p>
                  <p className="text-mute mt-2 text-sm leading-relaxed">
                    To build Ethiopia with excellence through superior quality construction supplies.
                  </p>
                </div>
                <div className="border-line border-l-2 pl-5">
                  <p className="font-display text-ember text-[0.68rem] font-bold tracking-[0.25em] uppercase">
                    Vision
                  </p>
                  <p className="text-mute mt-2 text-sm leading-relaxed">
                    To become Ethiopia's premier construction-supply organization.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="flex flex-col justify-center">
            <Reveal delay={0.15}>
              <div className="border-line bg-panel/60 relative overflow-hidden rounded-3xl border p-8 backdrop-blur-sm sm:p-10">
                <div className="texture-grid absolute inset-0 opacity-40" aria-hidden />
                <p className="font-display relative text-[0.68rem] font-bold tracking-[0.3em] text-ember uppercase">
                  Our Core Values
                </p>
                <ul className="relative mt-7 grid gap-4">
                  {VALUES.map((v, i) => (
                    <ValueItem key={v} idx={i} label={v} />
                  ))}
                </ul>
                <div className="ribbed relative mt-9 h-2 w-full rounded-full opacity-70" aria-hidden />
                <p className="font-serif-i text-mute relative mt-6 text-xl">ንግድ በእምነትና በታማኝነት!</p>
                <p className="text-mute relative mt-1 text-xs tracking-wide">
                  Trade with trust and integrity — in Amharic, our promise to you.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
