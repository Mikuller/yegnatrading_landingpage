import { motion } from 'motion/react';
import { HeartHandshake, ShieldCheck, Users } from 'lucide-react';
import { CSR_PHOTOS, TEAM } from '../data';
import { EASE, Reveal, SectionHead } from '../ui';
import { useApp } from '../context/AppContext';

export default function Team() {
  const { t } = useApp();

  return (
    <section id="team" className="texture-noise relative overflow-hidden py-24 sm:py-32">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* Section Header */}
        <SectionHead
          eyebrow={t('Leadership & Team', 'የአመራር ቡድን')}
          title={t('The People Behind', 'ከእያንዳንዱ ስኬት ጀርባ')}
          accent={t('Every Delivery.', 'ያሉ ባለሙያዎች።')}
          sub={t(
            'At Yegna, we believe that people are our most valuable asset and that everyone on our team plays a unique role in contributing to our overall success.',
            'በየኛ ትሬዲንግ የሰው ኃይል ትልቁ ሀብታችን እንደሆነ እናምናለን፤ እያንዳንዱ የቡድን አባል ለድርጅቱ ስኬት የራሱ የሆነ የማይተካ ሚና አለው።'
          )}
        />

        {/* 5 Management Team Members with Real Photos */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {TEAM.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: EASE }}
              className="border-line bg-panel card-glow group relative flex flex-col items-center overflow-hidden rounded-2xl border p-5 text-center shadow-sm"
            >
              <div className="relative mb-4">
                <div className="bg-ember/15 absolute -inset-2 rounded-2xl blur-md transition-opacity group-hover:opacity-100" />
                <img
                  src={m.photo}
                  alt={m.name}
                  loading="lazy"
                  width={144}
                  height={144}
                  className="border-line relative h-36 w-36 rounded-2xl object-cover object-top border shadow-md transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback avatar if needed
                    (e.currentTarget as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80';
                  }}
                />
              </div>

              <h3 className="font-display text-ink text-sm font-bold sm:text-base">
                {m.name}
              </h3>
              <p className="text-ember text-xs font-semibold mt-1">
                {t(m.role, m.amRole)}
              </p>
              <p className="text-mute text-[0.68rem] mt-0.5 uppercase tracking-wider">
                Yegna Trading PLC
              </p>

              <span
                className="bg-ember absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 transition-all duration-400 group-hover:w-2/3"
                aria-hidden
              />
            </motion.div>
          ))}
        </div>

        {/* Community Program: Yegna Team Blood Donation (Spec 4.4) */}
        <div className="mt-20">
          <Reveal delay={0.1}>
            <div className="border-line bg-panel card-glow relative overflow-hidden rounded-3xl border p-6 sm:p-10 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
                <div>
                  <div className="flex items-center gap-2 text-ember">
                    <HeartHandshake className="h-5 w-5" />
                    <span className="font-display text-xs font-bold tracking-[0.24em] uppercase">
                      {t('Social Responsibility & CSR', 'ማኅበራዊ ኃላፊነትና ተሳትፎ')}
                    </span>
                  </div>
                  <h3 className="font-display text-ink mt-2 text-2xl font-bold sm:text-3xl">
                    {t('Yegna Team Blood Donation Drive', 'የየኛ ትሬዲንግ የደም ልገሳ መርሐ-ግብር')}
                  </h3>
                  <p className="text-mute mt-2 max-w-2xl text-xs sm:text-sm leading-relaxed">
                    {t(
                      'True integrity extends beyond business into our communities. The Yegna Trading family routinely organizes volunteer blood donations to support local hospitals and emergency healthcare.',
                      'እውነተኛ ታማኝነት ከንግድ ባለፈ ማኅበረሰብን በመደገፍ ይገለጻል። የየኛ ትሬዲንግ ቤተሰብ የአገር ውስጥ ሆስፒታሎችን ለመደገፍና ሕይወት ለማዳን ተከታታይ የደም ልገሳ ፕሮግራሞችን ያካሂዳል።'
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-line bg-panel2 px-4 py-2 text-xs font-bold text-ink">
                  <Users className="h-4 w-4 text-ember" />
                  <span>{t('Annual Community Drive', 'ዓመታዊ የማኅበረሰብ መርሐ-ግብር')}</span>
                </div>
              </div>

              {/* Blood donation photo gallery */}
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {CSR_PHOTOS.map((p, idx) => (
                  <div
                    key={p.url}
                    className="group border-line relative overflow-hidden rounded-2xl border bg-panel2/60 shadow-sm"
                  >
                    <img
                      src={p.url}
                      alt={p.caption}
                      loading="lazy"
                      width={400}
                      height={224}
                      className="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end">
                      <p className="text-white text-xs font-semibold">
                        {t(p.caption, p.amCaption)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
