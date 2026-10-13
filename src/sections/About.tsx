import { motion } from 'motion/react';
import { CheckCircle2, Download, ShieldCheck, Target, Eye, Award } from 'lucide-react';
import { CONTACT, VALUES } from '../data';
import { EASE, Reveal, SectionHead } from '../ui';
import { useApp } from '../context/AppContext';

function ValueItem({ idx, label, amLabel }: { idx: number; label: string; amLabel: string }) {
  const { t } = useApp();
  return (
    <motion.li
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: idx * 0.06, ease: EASE }}
      className="border-line bg-panel2/60 flex items-center gap-3 rounded-xl border px-4 py-3"
    >
      <CheckCircle2 className="text-ember h-4 w-4 shrink-0" />
      <span className="font-display text-ink text-sm font-semibold">
        {t(label, amLabel)}
      </span>
    </motion.li>
  );
}

export default function About() {
  const { t } = useApp();

  return (
    <section id="about" className="texture-noise relative overflow-hidden py-24 sm:py-32">
      <div
        className="absolute inset-0 bg-[radial-gradient(700px_400px_at_85%_20%,rgba(245,124,0,0.06),transparent_65%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
          <div>
            <SectionHead
              eyebrow={t('Who We Are', 'ስለ እኛ')}
              title={t('Trade with', 'ንግድ በ')}
              accent={t('trust & integrity.', 'እምነትና በታማኝነት።')}
            />

            <Reveal delay={0.15}>
              <p className="text-mute text-elevated mt-6 text-base leading-relaxed sm:text-lg">
                {t(
                  'Yegna Trading PLC is a locally owned Ethiopian business established in 2017 in the center city of Addis Ababa. For more than 7 years, we have been delivering certified steel rebar (Grade 75), portland cement, staffa steel coil, and construction plywood.',
                  'የኛ ትሬዲንግ በ2017 ዓ.ም የተመሠረተ በአዲስ አበባ እምብርት የሚገኝ የሀገር ውስጥ የግንባታ ግብአቶች አቅራቢ ድርጅት ነው። ላለፉት 7+ ዓመታት ደረጃቸውን የጠበቁ ሬባር፣ ሲሚንቶ፣ ስታፋ እና ፕላይዉድ ለኮንስትራክሽን ዘርፍ አስተማማኝ በሆነ መንገድ እያቀረበ ይገኛል።'
                )}
              </p>
            </Reveal>

            <Reveal delay={0.22}>
              <p className="text-mute text-elevated mt-4 text-base leading-relaxed">
                {t(
                  'Our well-experienced staff provides personal, up-front service to commercial contractors, building owners, real estate developers, government & public enterprises, and residential builders nationwide.',
                  'ልምድ ያካበቱ ባለሙያዎቻችን ለግንባታ ተቋራጮች፣ ለሪል እስቴት አልሚዎች፣ ለመንግሥትና የግል ተቋማት እንዲሁም ለግለሰቦች ፈጣን እና ቀጥተኛ አገልግሎት ይሰጣሉ።'
                )}
              </p>
            </Reveal>

            {/* Mission & Vision Cards */}
            <Reveal delay={0.3}>
              <div className="border-line mt-8 grid grid-cols-1 gap-5 border-t pt-8 sm:grid-cols-2">
                <div className="border-line bg-panel/95 card-glow backdrop-blur-xl rounded-2xl border p-5 shadow-md">
                  <div className="flex items-center gap-2">
                    <Target className="text-ember h-4 w-4" />
                    <p className="font-display text-ember text-xs font-bold tracking-[0.2em] uppercase">
                      {t('Mission', 'ተልዕኮ')}
                    </p>
                  </div>
                  <p className="text-mute mt-2.5 text-xs sm:text-sm leading-relaxed">
                    {t(
                      'To build Ethiopia with excellence through trading superior quality construction supplies, delivering the dream of project ownership by establishing lasting client partnerships.',
                      'የላቀ ጥራት ያላቸውን የግንባታ ግብአቶች በታማኝነት በማቅረብ እና ዘላቂ ግንኙነት በመፍጠር ኢትዮጵያን በልህቀት መገንባት።'
                    )}
                  </p>
                </div>

                <div className="border-line bg-panel/95 card-glow backdrop-blur-xl rounded-2xl border p-5 shadow-md">
                  <div className="flex items-center gap-2">
                    <Eye className="text-ember h-4 w-4" />
                    <p className="font-display text-ember text-xs font-bold tracking-[0.2em] uppercase">
                      {t('Vision', 'ራዕይ')}
                    </p>
                  </div>
                  <p className="text-mute mt-2.5 text-xs sm:text-sm leading-relaxed">
                    {t(
                      'To build Ethiopia with excellence as the country’s most trusted, premier construction supply partner.',
                      'ኢትዮጵያን በልህቀት መገንባት፤ በአገሪቱ ግንባር ቀደም እና ተመራጭ የግንባታ ግብአቶች አቅራቢ መሆን።'
                    )}
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Business Principle & Download Profile */}
            <Reveal delay={0.38}>
              <div className="border-line bg-panel2/90 card-glow backdrop-blur-xl mt-6 rounded-2xl border p-5">
                <div className="flex items-center gap-2 text-primary dark:text-amber">
                  <Award className="h-4 w-4 text-ember" />
                  <span className="font-display text-xs font-bold tracking-wider uppercase">
                    {t('Our Business Principle', 'የሥራ መርሐችን')}
                  </span>
                </div>
                <p className="text-mute mt-2 text-xs sm:text-sm leading-relaxed">
                  {t(
                    'How we work with our customers and with each other every day is what sets us apart. Yegna is built on a strong set of values, a continued focus on delivering outstanding customer service, and unwavering commitment to long-term trust.',
                    'ከደንበኞቻችን እና ከቡድናችን ጋር በየዕለቱ በምንሠራበት መንገድ እንለያያለን። የኛ ትሬዲንግ በጠንካራ እሴቶች፣ የላቀ የደንበኛ አገልግሎት እና የማይናወጥ ታማኝነት ላይ የተመሠረተ ነው።'
                  )}
                </p>
                <div className="mt-4 pt-4 border-t border-line flex flex-wrap items-center justify-between gap-3">
                  <a
                    href={CONTACT.companyProfileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-primary text-white hover:bg-primary/90 dark:bg-panel dark:hover:bg-panel2 border-line text-xs font-bold inline-flex items-center gap-2 rounded-xl px-4 py-2.5 border transition-all shadow-sm"
                  >
                    <Download className="h-3.5 w-3.5 text-ember" />
                    <span>{t('Download Company Profile (PDF)', 'የድርጅቱን መገለጫ ያውርዱ (PDF)')}</span>
                  </a>
                  <span className="text-mute text-xs">
                    {t('Google Drive Verified Document', 'በይፋ የተረጋገጠ ሰነድ')}
                  </span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right column: 6 Core values & Philosophy */}
          <div className="flex flex-col justify-center">
            <Reveal delay={0.15}>
              <div className="border-line bg-panel card-glow relative overflow-hidden rounded-3xl border p-7 sm:p-9 shadow-xl">
                <div className="texture-grid absolute inset-0 opacity-30" aria-hidden />

                <div className="relative">
                  <div className="flex items-center justify-between">
                    <p className="font-display text-ember text-[0.7rem] font-bold tracking-[0.28em] uppercase">
                      {t('Core Corporate Values', 'ዋና ዋና እሴቶቻችን')}
                    </p>
                    <ShieldCheck className="text-ember h-5 w-5" />
                  </div>

                  <p className="text-ink font-display mt-2 text-xl font-bold">
                    {t('Six Principles Guiding Every Delivery', 'ሥራችንን የሚመሩ ስድስት እሴቶች')}
                  </p>

                  <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {VALUES.map((v, i) => (
                      <ValueItem key={v.en} idx={i} label={v.en} amLabel={v.am} />
                    ))}
                  </ul>

                  <div className="ribbed mt-8 h-2 w-full rounded-full opacity-60" aria-hidden />

                  <div className="mt-6">
                    <p className="font-serif-i text-ink text-2xl">
                      “ንግድ በእምነትና በታማኝነት!”
                    </p>
                    <p className="text-mute mt-1.5 text-xs tracking-wide">
                      {t(
                        'Trade with trust and integrity — our founding promise to every builder in Ethiopia.',
                        'ንግድ በእምነትና በታማኝነት — ለኢትዮጵያ ግንባታ ባለቤቶች ሁሉ የገባነው ጽኑ ቃል!'
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
