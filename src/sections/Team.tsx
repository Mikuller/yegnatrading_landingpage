import { motion } from 'motion/react';
import { TEAM } from '../data';
import { EASE, SectionHead } from '../ui';

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('');
}

export default function Team() {
  return (
    <section id="team" className="texture-noise relative overflow-hidden py-28 sm:py-36">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead
          eyebrow="Leadership"
          title="The people behind"
          accent="every delivery."
          sub="At Yegna, people are our most valuable asset — and everyone plays a unique role in our customers' success."
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {TEAM.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
              className="border-line bg-panel/60 card-glow group relative overflow-hidden rounded-2xl border p-7 text-center"
            >
              <div
                className="bg-ember/10 absolute -top-12 left-1/2 h-28 w-28 -translate-x-1/2 rounded-full blur-2xl"
                aria-hidden
              />
              <span className="font-display bg-gradient-ember text-bg relative mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-ember to-amber text-lg font-bold shadow-[0_0_24px_rgba(255,90,31,0.3)]">
                {initials(m.name)}
              </span>
              <h3 className="font-display relative mt-5 text-[0.98rem] font-bold">{m.name}</h3>
              <p className="text-mute relative mt-1.5 text-xs leading-relaxed">{m.role}</p>
              <span
                className="from-ember absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-gradient-to-r to-transparent transition-all duration-500 group-hover:w-2/3"
                aria-hidden
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
