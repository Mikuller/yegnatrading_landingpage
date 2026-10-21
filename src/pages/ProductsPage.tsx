import { useState } from 'react';
import PageShell from '../components/PageShell';
import Breadcrumbs from '../components/Breadcrumbs';
import Products from '../sections/Products';
import RebarLab, { type QuotePrefill } from '../sections/RebarLab';
import { ArrowUpRight, Award, CheckCircle2, FileCheck2, FileSpreadsheet, Ruler, ShieldCheck, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { REBAR_CONVERSION_TABLE } from '../data';

export default function ProductsPage() {
  const { t } = useApp();
  const [quotePrefill, setQuotePrefill] = useState<QuotePrefill | null>(null);

  const handleQuote = (p: QuotePrefill) => {
    // If the user clicks quote inside RebarLab, redirect them to /contact/#quote with state or scroll
    if (typeof window !== 'undefined') {
      window.location.href = '/contact/#quote';
    }
  };

  return (
    <PageShell>
      {/* Page Header Banner */}
      <section className="texture-noise relative overflow-hidden pt-24 sm:pt-32 lg:pt-36 pb-12 sm:pb-16 border-b border-line">
        <div
          className="absolute inset-0 bg-[radial-gradient(900px_450px_at_50%_0%,rgba(245,124,0,0.12),transparent_70%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <Breadcrumbs items={[{ label: 'Products & Specs', amLabel: 'ምርቶችና ዝርዝሮች' }]} />

          <div className="relative max-w-3xl">
            {/* Soft text-protective scrim halo ensuring 100% crisp legibility */}
            <div aria-hidden="true" className="text-protective-halo" />

            <div className="border-line bg-panel2/90 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold text-ember backdrop-blur-sm mb-4">
              <FileCheck2 className="h-4 w-4" />
              <span>{t('Grade 75 Mill Test Certified', 'ደረጃ 75 የፋብሪካ ጥራት የተረጋገጠ')}</span>
            </div>

            <h1 className="font-display text-ink text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
              {t('Certified Construction', 'የተረጋገጡ የግንባታ')} <br />
              <span className="text-gradient-ember">{t('Steel & Materials.', 'ብረትና ግብአቶች።')}</span>
            </h1>

            <p className="text-mute text-base sm:text-lg mt-5 leading-relaxed">
              {t(
                'High-performance deformed rebar (8mm–32mm), Portland cement (OPC & PPC), 6mm staffa steel coil, and multi-layer formwork plywood engineered for structural longevity, high tensile strength, and full compliance with Ethiopian standards.',
                'ከ8ሚሜ እስከ 32ሚሜ ደረጃ 75 ሬባር፣ የፖርትላንድ ሲሚንቶ (OPC እና PPC)፣ 6ሚሜ ስታፋ እና ፕላይዉድ ለረጅም ጊዜ ጥንካሬና ለኢትዮጵያ የጥራት ደረጃዎች ተስማሚ ሆነው የቀረቡ።'
              )}
            </p>
          </div>

          {/* Quick Specifications Strip */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            <div className="border-line bg-panel/90 rounded-2xl border p-4 shadow-sm backdrop-blur-md">
              <span className="text-ember font-mono text-xl sm:text-2xl font-bold">Grade 75</span>
              <p className="text-ink text-xs font-semibold mt-1">{t('High Yield Strength', 'ከፍተኛ የመሸከም አቅም')}</p>
              <p className="text-mute text-[0.7rem]">{t('500+ MPa tensile yield', 'ከ500+ MPa በላይ ጥንካሬ')}</p>
            </div>

            <div className="border-line bg-panel/90 rounded-2xl border p-4 shadow-sm backdrop-blur-md">
              <span className="text-ember font-mono text-xl sm:text-2xl font-bold">8mm – 32mm</span>
              <p className="text-ink text-xs font-semibold mt-1">{t('Full Metric Range', 'ሙሉ የሜትሪክ መጠኖች')}</p>
              <p className="text-mute text-[0.7rem]">{t('Standard 12-meter lengths', 'መደበኛ 12 ሜትር ርዝመት')}</p>
            </div>

            <div className="border-line bg-panel/90 rounded-2xl border p-4 shadow-sm backdrop-blur-md">
              <span className="text-ember font-mono text-xl sm:text-2xl font-bold">OPC & PPC</span>
              <p className="text-ink text-xs font-semibold mt-1">{t('Portland Cement', 'የፖርትላንድ ሲሚንቶ')}</p>
              <p className="text-mute text-[0.7rem]">{t('Bags & bulk direct delivery', 'በጆንያና በጅምላ አቅርቦት')}</p>
            </div>

            <div className="border-line bg-panel/90 rounded-2xl border p-4 shadow-sm backdrop-blur-md">
              <span className="text-ember font-mono text-xl sm:text-2xl font-bold">100% Legal</span>
              <p className="text-ink text-xs font-semibold mt-1">{t('Certified Mill Batches', 'ሕጋዊና የተረጋገጠ ጥራት')}</p>
              <p className="text-mute text-[0.7rem]">{t('Complete fiscal receipts & docs', 'ሕጋዊ ደረሰኝና የጥራት ሰርተፊኬት')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Products Catalog with Detail Viewers */}
      <Products />

      {/* Interactive Rebar Lab & Live Conversion Table */}
      <RebarLab onQuote={handleQuote} />

      {/* Standards & Compliance Section */}
      <section className="texture-noise relative overflow-hidden py-20 border-t border-line">
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <span className="border-line bg-panel2/80 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold text-ember">
                <ShieldCheck className="h-4 w-4" />
                <span>{t('Strict Quality Verification', 'ጥብቅ የጥራት ቁጥጥር')}</span>
              </span>
              <h2 className="font-display text-ink text-2xl sm:text-4xl font-extrabold mt-4">
                {t('Every Batch Tested.', 'እያንዳንዱ ምርት የተፈተነ።')} <br />
                <span className="text-gradient-ember">{t('Zero Counterfeits.', 'ምንም ዓይነት እንከን የሌለበት።')}</span>
              </h2>
              <p className="text-mute text-sm sm:text-base mt-4 leading-relaxed">
                {t(
                  'Substandard rebar compromises the structural integrity of foundations, beams, and columns. Yegna Trading guarantees only factory-tested Grade 75 deformed rebar with full dimensional accuracy, high bonding ribs, and certified chemical composition.',
                  'ደረጃውን ያልጠበቀ የብረት ቆራጭ የሕንፃን መሠረት፣ ምሰሶና ጨረር ለአደጋ ያጋልጣል። የኛ ትሬዲንግ በፋብሪካ የተረጋገጠ፣ ወጥ የጎድን ቅርጽ ያለውና ትክክለኛ የክብደት መጠን የተጠበቀለትን ሬባር ብቻ ያቀርባል።'
                )}
              </p>

              <ul className="mt-6 space-y-3 text-xs sm:text-sm">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span className="text-ink font-semibold">{t('Adherence to Ethiopian standard ES ISO 6935-2', 'ከኢትዮጵያ የጥራት ደረጃ ES ISO 6935-2 ጋር የሚስማማ')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span className="text-ink font-semibold">{t('Guaranteed yield strength (>500 MPa / Grade 75)', 'የተረጋገጠ የመሸከም አቅም (>500 MPa / Grade 75)')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span className="text-ink font-semibold">{t('Calibrated electronic scale weigh-bridge verification', 'በተስተካከለ የኤሌክትሮኒክስ ሚዛን የተረጋገጠ ክብደት')}</span>
                </li>
              </ul>
            </div>

            <div className="border-line bg-panel rounded-3xl border p-6 sm:p-8 shadow-xl">
              <h3 className="font-display text-ink text-lg font-bold flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-ember" />
                <span>{t('Metric Weight Standards Reference', 'መደበኛ የሜትሪክ ክብደት ማጣቀሻ')}</span>
              </h3>
              <p className="text-mute text-xs mt-1">
                {t('Quick reference for engineers and site purchasing managers:', 'ለኢንጂነሮችና ለግዢ ባለሙያዎች ፈጣን ማጣቀሻ፦')}
              </p>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-line text-mute">
                      <th className="py-2.5 pr-3 font-semibold">{t('Size', 'መጠን')}</th>
                      <th className="py-2.5 pr-3 font-semibold">{t('Unit Weight (kg/m)', 'ክብደት (kg/m)')}</th>
                      <th className="py-2.5 pr-3 font-semibold">{t('12m Bar (kg)', 'የ12ሜ ክብደት (kg)')}</th>
                      <th className="py-2.5 font-semibold">{t('Pcs / Quintal', 'ፍሬ በኩንታል')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line/60 font-mono">
                    {REBAR_CONVERSION_TABLE.slice(1, 7).map((item) => (
                      <tr key={item.diameter} className="hover:bg-panel2/50 transition-colors">
                        <td className="py-2 pr-3 font-bold text-ink">{item.diameter}</td>
                        <td className="py-2 pr-3 text-mute">{item.unitWeightKgM}</td>
                        <td className="py-2 pr-3 text-mute">{item.weightPer12mKg} kg</td>
                        <td className="py-2 text-ember font-semibold">{item.pcsPerQuintal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 pt-4 border-t border-line flex justify-end">
                <a
                  href="/contact/#quote"
                  className="bg-ember text-white hover:bg-ember/90 font-display text-xs font-bold inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl shadow-sm transition-all"
                >
                  <span>{t('Request Order for These Sizes', 'በእነዚህ መጠኖች ዋጋ ጠይቅ')}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
