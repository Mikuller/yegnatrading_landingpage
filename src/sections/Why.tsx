import { motion } from 'motion/react';
import { PILLARS } from '../data';
import { EASE, SectionHead } from '../ui';

export default function Why() {
  return (
    <section id="why" className="texture-noise relative overflow-hidden py-28 sm:py-36">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead
          eyebrow="Why Choose Yegna"
          title="Four reasons contractors"
          accent="keep coming back."
        />

        <div className="mt-16">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.n}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: EASE }}
              className="group border-line relative border-t transition-colors duration-500 last:border-b hover:border-ember/40"
            >
              <div className="relative grid items-center gap-4 px-2 py-9 sm:grid-cols-[90px_1fr_1.4fr] sm:gap-10 sm:px-6">
                <span className="font-display text-outline text-5xl font-extrabold transition-all duration-500 group-hover:[-webkit-text-stroke-color:rgba(255,90,31,0.7)] sm:text-6xl">
                  {p.n}
                </span>
                <h3 className="font-display text-2xl font-bold tracking-tight transition-colors duration-300 group-hover:text-ember sm:text-3xl">
                  {p.title}
                </h3>
                <p className="text-mute max-w-xl text-sm leading-relaxed sm:text-base">{p.copy}</p>
              </div>
              <span
                className="from-ember to-amber absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r transition-all duration-700 group-hover:w-full"
                aria-hidden
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
