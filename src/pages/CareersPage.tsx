import PageShell from '../components/PageShell';
import Breadcrumbs from '../components/Breadcrumbs';
import Careers from '../sections/Careers';
import { ArrowUpRight, Briefcase, CheckCircle2, HeartHandshake, ShieldCheck, Sparkles, TrendingUp, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VALUES } from '../data';

export default function CareersPage() {
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
          <Breadcrumbs items={[{ label: 'Careers', amLabel: 'ክፍት የሥራ ቦታዎች' }]} />

          <div className="max-w-3xl">
            <div className="border-line bg-panel2/90 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold text-ember backdrop-blur-sm mb-4">
              <Briefcase className="h-4 w-4" />
              <span>{t('Grow With Ethiopia’s Supply Leader', 'ከግንባር ቀደሙ አቅራቢ ጋር ያድጉ')}</span>
            </div>

            <h1 className="font-display text-ink text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
              {t('Build Your Career,', 'ሙያዎን ይገንቡ፣')} <br />
              <span className="text-gradient-ember">{t('Shape Tomorrow.', 'ነገን አብረን እንቅረጽ።')}</span>
            </h1>

            <p className="text-mute text-base sm:text-lg mt-5 leading-relaxed">
              {t(
                'At Yegna Trading PLC, our people are our cornerstone. We cultivate an inclusive, ambitious environment where professionals in logistics, supply chain, customer relations, and business administration thrive.',
                'በየኛ ትሬዲንግ ኃ/የተ/የግ/ማህበር ሠራተኞቻችን የመሠረታችን ምሰሶዎች ናቸው። በሎጂስቲክስ፣ በደንበኞች አገልግሎት፣ በፋይናንስና በአስተዳደር ዘርፎች ችሎታዎን የሚያዳብሩበትን ምቹ የሥራ አካባቢ ፈጥረናል።'
              )}
            </p>
          </div>

          {/* Value Highlights */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 sm:gap-4">
            {VALUES.map((val) => (
              <div
                key={val.en}
                className="border-line bg-panel/90 rounded-2xl border p-4 text-center shadow-sm backdrop-blur-md"
              >
                <div className="mx-auto mb-2 grid h-8 w-8 place-items-center rounded-xl bg-ember/10 text-ember">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <p className="text-ink text-xs font-bold">{t(val.en, val.am)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Careers Section (Application form, benefits & open roles) */}
      <Careers />
    </PageShell>
  );
}
