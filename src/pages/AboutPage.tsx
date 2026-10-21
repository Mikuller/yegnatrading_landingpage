import PageShell from '../components/PageShell';
import Breadcrumbs from '../components/Breadcrumbs';
import About from '../sections/About';
import Ceo from '../sections/Ceo';
import Team from '../sections/Team';
import Why from '../sections/Why';
import { ArrowUpRight, Award, Building2, CheckCircle2, ShieldCheck, Users } from 'lucide-react';
import { STATS, CSR_PHOTOS } from '../data';
import { useApp } from '../context/AppContext';
import { Counter, Reveal } from '../ui';

export default function AboutPage() {
  const { t } = useApp();

  return (
    <PageShell>
      {/* Page Header Banner */}
      <section className="texture-noise relative overflow-hidden pt-36 pb-16 border-b border-line">
        <div
          className="absolute inset-0 bg-[radial-gradient(900px_450px_at_50%_0%,rgba(245,124,0,0.12),transparent_70%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <Breadcrumbs items={[{ label: 'About Us', amLabel: 'ስለ እኛ' }]} />

          <div className="relative max-w-3xl">
            {/* Soft text-protective scrim halo ensuring 100% crisp legibility */}
            <div aria-hidden="true" className="text-protective-halo" />

            <div className="border-line bg-panel2/90 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold text-ember backdrop-blur-sm mb-4">
              <ShieldCheck className="h-4 w-4" />
              <span>{t('Established in Addis Ababa (2017)', 'በአዲስ አበባ የተመሠረተ (2017)')}</span>
            </div>

            <h1 className="font-display text-ink text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
              {t('Building Ethiopia with', 'ኢትዮጵያን በጠንካራ')} <br />
              <span className="text-gradient-ember">{t('Trust & Integrity.', 'እምነትና ታማኝነት መገንባት።')}</span>
            </h1>

            <p className="text-mute text-base sm:text-lg mt-5 leading-relaxed">
              {t(
                'For over 7 years, Yegna Trading PLC has stood as a premier supplier of legally certified Grade 75 steel rebar, Portland cement, staffa coil, and formwork plywood to commercial contractors, public enterprises, and residential developers nationwide.',
                'የኛ ትሬዲንግ ኃ/የተ/የግ/ማህበር ላለፉት 7+ ዓመታት ደረጃውን የጠበቀ የኮንክሪት ብረት (ሬባር G75)፣ ሲሚንቶ፣ ስታፋ እና ፕላይዉድ ለመንግሥትና የግል ኮንስትራክሽን ፕሮጀክቶች በታማኝነት በማቅረብ ግንባር ቀደም አጋር ሆኖ ዘልቋል።'
              )}
            </p>
          </div>

          {/* Quick Metrics Grid */}
          <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="border-line bg-panel/90 rounded-2xl border p-5 shadow-sm backdrop-blur-md"
              >
                <div className="font-display text-ink text-3xl sm:text-4xl font-extrabold">
                  <Counter value={s.value} suffix={s.suffix} />
                </div>
                <p className="text-mute text-xs sm:text-sm mt-1 font-medium">
                  {t(s.label, s.amLabel)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main About Story & Core Values */}
      <About />

      {/* CEO Leadership Message */}
      <Ceo />

      {/* Executive Leadership Team */}
      <Team />

      {/* Why Choose Yegna & Quality Commitments */}
      <Why />

      {/* Corporate Social Responsibility (CSR) Showcase */}
      <section className="texture-noise relative overflow-hidden py-20 border-t border-line">
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="border-line bg-panel2/80 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold text-ember">
              <Users className="h-4 w-4" />
              <span>{t('Corporate Social Responsibility', 'ማኅበራዊ ኃላፊነት')}</span>
            </span>
            <h2 className="font-display text-ink text-2xl sm:text-4xl font-bold mt-3">
              {t('Committed to Our Community', 'ለማኅበረሰባችን ያለን ቁርጠኝነት')}
            </h2>
            <p className="text-mute text-sm mt-2">
              {t(
                'Giving back and supporting vital civic initiatives across Addis Ababa.',
                'ከንግድ ባሻገር ሕይወት ለማዳንና ማኅበረሰባችንን ለመደገፍ የምናደርገው ተሳትፎ።'
              )}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {CSR_PHOTOS.map((csr, idx) => (
              <div
                key={idx}
                className="group border-line bg-panel overflow-hidden rounded-2xl border shadow-sm hover:border-ember/50 transition-all duration-300"
              >
                <div className="aspect-[4/3] overflow-hidden bg-panel2">
                  <img
                    src={csr.url}
                    alt={t(csr.caption, csr.amCaption)}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <p className="text-ink text-xs sm:text-sm font-semibold">
                    {t(csr.caption, csr.amCaption)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="relative py-16 bg-panel2/60 border-t border-line">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="border-line bg-panel rounded-3xl border p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="font-display text-ink text-2xl sm:text-3xl font-extrabold">
                {t('Ready to Partner With Us?', 'አብረውን ለመሥራት ዝግጁ ነዎት?')}
              </h2>
              <p className="text-mute text-sm mt-2 max-w-xl">
                {t(
                  'Reach out to our executive order desk for direct factory quotes, site delivery schedules, and certified mill test compliance.',
                  'ከፋብሪካ ቀጥታ ተወዳዳሪ ዋጋዎችን፣ ወቅቱን የጠበቀ አቅርቦትና የጥራት ማረጋገጫ የምስክር ወረቀቶችን ለማግኘት አሁኑኑ ያነጋግሩን።'
                )}
              </p>
            </div>
            <div className="flex flex-wrap gap-3.5">
              <a
                href="/products/"
                className="border-line bg-panel2 hover:border-ember text-ink font-display rounded-xl border px-6 py-3 text-xs sm:text-sm font-bold transition-all shadow-sm"
              >
                {t('Explore Products', 'ምርቶችን እይ')}
              </a>
              <a
                href="/contact/#quote"
                className="bg-ember text-white hover:bg-ember/90 font-display inline-flex items-center gap-2 rounded-xl px-6 py-3 text-xs sm:text-sm font-bold shadow-md transition-all"
              >
                <span>{t('Get a Free Quotation', 'ነጻ የዋጋ መጠየቂያ')}</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
