import { useState } from 'react';
import PageShell from '../components/PageShell';
import Hero from '../sections/Hero';
import Marquee from '../sections/Marquee';
import Products from '../sections/Products';
import RebarLab, { type QuotePrefill } from '../sections/RebarLab';
import Why from '../sections/Why';
import Ceo from '../sections/Ceo';
import Insights from '../sections/Insights';
import Faq from '../sections/Faq';
import Quote from '../sections/Quote';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function HomePage() {
  const { t } = useApp();
  const [quotePrefill, setQuotePrefill] = useState<QuotePrefill | null>(null);

  const handleQuote = (p: QuotePrefill) => {
    setQuotePrefill(p);
    document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <PageShell>
      <Hero onQuote={handleQuote} />
      <Marquee />

      {/* Featured Products & Direct Navigation Callout */}
      <section className="relative">
        <Products />
        <div className="mx-auto max-w-7xl px-5 sm:px-8 pb-16">
          <div className="border-line bg-panel2 rounded-2xl border p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg backdrop-blur-md">
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-ember/15 text-ember border border-ember/30">
                <ShieldCheck className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-display text-ink text-base sm:text-lg font-bold">
                  {t('Need Full Specifications & Weight Charts?', 'ሙሉ የቴክኒክ መረጃዎችና የክብደት ሠንጠረዥ ይፈልጋሉ?')}
                </h3>
                <p className="text-mute text-xs sm:text-sm mt-1 max-w-xl">
                  {t(
                    'Explore our dedicated Products page for complete Grade 75 technical specifications, chemical properties, and our live metric conversion calculator.',
                    'የተሟላ የቴክኒክ ዝርዝሮች፣ የኬሚካል ይዘት እና የቀጥታ የሜትሪክ ልወጣ ካልኩሌተርን በምርቶች ገጻችን ይመልከቱ።'
                  )}
                </p>
              </div>
            </div>
            <a
              href="/products/"
              className="bg-ember text-white hover:bg-ember/90 font-display w-full sm:w-auto text-center justify-center shrink-0 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-xs sm:text-sm font-bold shadow-md transition-all duration-300 hover:-translate-y-0.5"
            >
              <span>{t('View All Products & Specs', 'ሁሉንም ምርቶችና ዝርዝሮች እይ')}</span>
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Interactive Rebar Lab & Weight Calculator (Offscreen hardware containment) */}
      <div className="content-auto">
        <RebarLab onQuote={handleQuote} />
      </div>

      {/* Why Choose Yegna & CEO Message */}
      <div className="content-auto">
        <Why />
      </div>
      <div className="content-auto">
        <Ceo />
      </div>

      {/* Insights Preview */}
      <div className="content-auto">
        <Insights />
      </div>

      <div className="content-auto">
        <Faq />
      </div>

      {/* Request For Quote Form */}
      <div className="content-auto">
        <Quote prefill={quotePrefill} />
      </div>
    </PageShell>
  );
}
