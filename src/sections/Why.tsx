import { motion } from 'motion/react';
import { PILLARS } from '../data';
import { EASE, SectionHead } from '../ui';
import { useApp } from '../context/AppContext';

export default function Why() {
  const { t } = useApp();

  return (
    <section id="why" className="texture-noise relative overflow-hidden py-24 sm:py-32">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead
          eyebrow={t('Why Choose Yegna', 'ለምን የኛን ይመርጣሉ?')}
          title={t('Four Commitments Contractors', 'ተቋራጮች ሁልጊዜ የሚተማመኑባቸው')}
          accent={t('Rely On Every Day.', 'አራት ዋነኛ ምክንያቶች።')}
          sub={t(
            'We combine stringent manufacturing quality control with direct-from-mill pricing, ensuring your projects stand on bedrock strength.',
            'ጥራቱን የጠበቀ ምርት፣ ፍትሃዊ ዋጋ እና ፈጣን አቅርቦትን በማቀናጀት ለግንባታዎ አስተማማኝ መሠረት እንጥላለን።'
          )}
        />

        <div className="mt-16">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.65, delay: i * 0.07, ease: EASE }}
              className="group border-line hover:border-ember/60 relative border-t transition-colors duration-400 last:border-b"
            >
              <div className="relative grid items-center gap-4 px-2 py-8 sm:grid-cols-[90px_1fr_1.4fr] sm:gap-10 sm:px-6">
                <span className="font-display text-outline text-5xl font-extrabold transition-all duration-400 group-hover:[-webkit-text-stroke-color:var(--color-ember)] sm:text-6xl">
                  {p.n}
                </span>
                <h3 className="font-display text-ink text-elevated group-hover:text-ember text-xl font-bold tracking-tight transition-colors duration-300 sm:text-2xl">
                  {t(p.title, p.amTitle)}
                </h3>
                <p className="text-mute text-elevated max-w-xl text-xs sm:text-sm leading-relaxed">
                  {t(p.copy, p.amCopy)}
                </p>
              </div>
              <span
                className="bg-ember absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-500 group-hover:w-full"
                aria-hidden
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
