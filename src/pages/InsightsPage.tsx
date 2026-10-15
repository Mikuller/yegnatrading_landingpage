import PageShell from '../components/PageShell';
import Breadcrumbs from '../components/Breadcrumbs';
import Insights from '../sections/Insights';
import { ArrowUpRight, BookOpen, CheckCircle2, HelpCircle, Newspaper, Sparkles, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function InsightsPage() {
  const { t } = useApp();

  const FAQS = [
    {
      q: 'What makes Grade 75 rebar different from standard Grade 60 rebar?',
      amQ: 'ደረጃ 75 ሬባር ከመደበኛው ደረጃ 60 ሬባር በምን ይለያል?',
      a: 'Grade 75 rebar provides a minimum yield strength of 500–520 MPa compared to Grade 60 (415–420 MPa). This higher yield strength allows structural engineers to use less total steel mass while maintaining identical or superior tensile capacity, lowering structural load and shipping costs.',
      amA: 'ደረጃ 75 ሬባር ከ500–520 MPa በላይ የመሸከም አቅም ያለው ሲሆን፣ ከመደበኛው የብረት ዓይነት ጋር ሲነጻጸር አነስተኛ ብረት በመጠቀም የሕንፃውን ጥንካሬ አስተማማኝ ለማድረግ ያስችላል።',
    },
    {
      q: 'When should a contractor choose OPC vs PPC cement?',
      amQ: 'ተቋራጮች በOPC እና PPC ሲሚንቶ መካከል መቼና እንዴት መምረጥ አለባቸው?',
      a: 'Ordinary Portland Cement (OPC) achieves rapid early compressive strength and is ideal for early shuttering removal, structural columns, beams, and pre-cast elements. Pozzolana Portland Cement (PPC) offers lower heat of hydration, reduced cracking, higher long-term chemical resistance, and is optimal for foundations, plastering, and mass concrete pours.',
      amA: 'OPC ሲሚንቶ በፍጥነት ጥንካሬ ስለሚይዝ ለምሰሶዎች፣ ጨረሮችና አስቸኳይ ሥራዎች ይመረጣል። PPC ሲሚንቶ ደግሞ ስንጥቆችን የሚከላከልና ረጅም ዕድሜ የሚሰጥ በመሆኑ ለመሠረትና ለማለስለስ ሥራዎች ተመራጭ ነው።',
    },
    {
      q: 'How does Yegna Trading verify delivery weight on site?',
      amQ: 'የኛ ትሬዲንግ በግንባታ ቦታ ላይ ትክክለኛውን ክብደት እንዴት ያረጋግጣል?',
      a: 'All steel deliveries include certified weigh-bridge printouts from our central logistics dispatch in Addis Ababa. Customers can cross-reference physical bar counts against standard metric unit weights per meter (e.g. 10.656 kg for 12mm x 12m bar).',
      amA: 'ሁሉም የብረት አቅርቦቶች በዋናው ማዕከላችን የተረጋገጠ የኤሌክትሮኒክስ ሚዛን ወረቀት አላቸው። በተጨማሪም በሜትሪክ ሠንጠረዡ መሠረት ፍሬ በመቁጠር ትክክለኛነቱን ማረጋገጥ ይቻላል።',
    },
  ];

  return (
    <PageShell>
      {/* Page Header Banner */}
      <section className="texture-noise relative overflow-hidden pt-36 pb-16 border-b border-line">
        <div
          className="absolute inset-0 bg-[radial-gradient(900px_450px_at_50%_0%,rgba(245,124,0,0.12),transparent_70%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <Breadcrumbs items={[{ label: 'Blog & Insights', amLabel: 'ብሎግና መረጃዎች' }]} />

          <div className="max-w-3xl">
            <div className="border-line bg-panel2/90 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold text-ember backdrop-blur-sm mb-4">
              <BookOpen className="h-4 w-4" />
              <span>{t('Industry Bulletins & Market Guides', 'የዘርፉ መረጃዎችና የገበያ መመሪያዎች')}</span>
            </div>

            <h1 className="font-display text-ink text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
              {t('Construction Knowledge,', 'የግንባታ እውቀትና')} <br />
              <span className="text-gradient-ember">{t('Poured Fresh.', 'ወቅታዊ መረጃዎች።')}</span>
            </h1>

            <p className="text-mute text-base sm:text-lg mt-5 leading-relaxed">
              {t(
                'Stay updated with technical engineering articles, steel pricing shifts, rebar delivery logistics advice, and material selection best practices in Addis Ababa and across Ethiopia.',
                'ስለ ኮንስትራክሽን ብረት ዋጋ፣ የሲሚንቶ አጠቃቀም፣ የፕላይዉድ ጥራትና የሎጂስቲክስ አቅርቦት ጠቃሚ ጽሑፎችንና የገበያ መረጃዎችን እዚህ ያግኙ።'
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Main Insights Directory & Filterable Grid */}
      <Insights />

      {/* Engineering Knowledge Base & FAQ */}
      <section className="texture-noise relative overflow-hidden py-20 border-t border-line">
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-2xl mb-12">
            <span className="border-line bg-panel2/80 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold text-ember">
              <HelpCircle className="h-4 w-4" />
              <span>{t('Frequently Asked Questions', 'ተደጋግመው የሚጠየቁ ጥያቄዎች')}</span>
            </span>
            <h2 className="font-display text-ink text-2xl sm:text-4xl font-extrabold mt-3">
              {t('Technical & Commercial Answers', 'ቴክኒካዊና የንግድ ምላሾች')}
            </h2>
            <p className="text-mute text-sm mt-2">
              {t(
                'Everything you need to know before procuring steel and cement for your job site.',
                'ለግንባታ ቦታዎ ብረትና ሲሚንቶ ከመግዛትዎ በፊት ማወቅ የሚገቡዎት ቁልፍ ነጥቦች።'
              )}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="border-line bg-panel rounded-2xl border p-6 shadow-sm hover:border-ember/40 transition-colors"
              >
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-ember/10 text-ember font-mono text-xs font-bold mb-4">
                  0{idx + 1}
                </div>
                <h3 className="font-display text-ink text-base font-bold">
                  {t(faq.q, faq.amQ)}
                </h3>
                <p className="text-mute text-xs sm:text-sm mt-3 leading-relaxed">
                  {t(faq.a, faq.amA)}
                </p>
              </div>
            ))}
          </div>

          {/* Quick CTA Box */}
          <div className="mt-12 border-line bg-panel2/80 rounded-2xl border p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-ember shrink-0" />
              <p className="text-ink text-xs sm:text-sm font-semibold">
                {t(
                  'Have specific site requirements or project bill of quantities (BOQ)?',
                  'የተለየ የግንባታ ፍላጎት ወይም የብረት ዝርዝር (BOQ) አለዎት?'
                )}
              </p>
            </div>
            <a
              href="/contact/#quote"
              className="bg-ember text-white hover:bg-ember/90 font-display shrink-0 text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm"
            >
              {t('Contact Sales Desk', 'የሽያጭ ክፍሉን ያነጋግሩ')}
            </a>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
