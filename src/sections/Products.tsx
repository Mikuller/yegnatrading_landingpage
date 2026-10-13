import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  Calculator,
  Check,
  FileSpreadsheet,
  Package,
  Phone,
  Ruler,
  ShieldCheck,
} from 'lucide-react';
import { CONTACT, PRODUCTS, REBAR_CONVERSION_TABLE, type Product } from '../data';
import { EASE, Reveal, SectionHead } from '../ui';
import { useApp } from '../context/AppContext';

function ProductGlyph({ icon }: { icon: Product['icon'] }) {
  const cls = 'h-8 w-8';
  switch (icon) {
    case 'rebar':
      return (
        <svg viewBox="0 0 40 40" className={cls} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <rect x="6" y="8" width="5" height="28" rx="1.5" />
          <rect x="16" y="8" width="5" height="28" rx="1.5" />
          <rect x="26" y="8" width="5" height="28" rx="1.5" />
          <path d="M6 13h5M6 19h5M6 25h5M6 31h5M16 13h5M16 19h5M16 25h5M16 31h5M26 13h5M26 19h5M26 25h5M26 31h5" strokeWidth="1.2" />
        </svg>
      );
    case 'cement':
      return (
        <svg viewBox="0 0 40 40" className={cls} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M10 12 L20 8 L30 12 L30 30 Q30 33 27 33 L13 33 Q10 33 10 30 Z" />
          <path d="M10 12 Q20 16 30 12" />
          <path d="M14 20 Q20 23 26 20" strokeWidth="1.2" />
        </svg>
      );
    case 'coil':
      return (
        <svg viewBox="0 0 40 40" className={cls} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <circle cx="20" cy="20" r="13" />
          <circle cx="20" cy="20" r="8" />
          <circle cx="20" cy="20" r="3.5" />
          <path d="M20 7 a13 13 0 0 1 12.5 9.6" stroke="currentColor" strokeWidth="3" />
        </svg>
      );
    case 'plywood':
      return (
        <svg viewBox="0 0 40 40" className={cls} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M6 30 L20 34 L34 30 L20 26 Z" />
          <path d="M6 24 L20 28 L34 24" strokeWidth="1.4" />
          <path d="M6 18 L20 22 L34 18" strokeWidth="1.4" />
          <path d="M6 12 L20 16 L34 12" strokeWidth="1.4" />
        </svg>
      );
  }
}

export default function Products() {
  const { t } = useApp();
  const [selectedSize, setSelectedSize] = useState(REBAR_CONVERSION_TABLE[4]); // 14mm default

  return (
    <section id="products" className="texture-noise relative overflow-hidden py-24 sm:py-32">
      <div
        className="absolute inset-0 bg-[radial-gradient(800px_460px_at_10%_10%,rgba(245,124,0,0.05),transparent_60%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead
            eyebrow={t('Products & Materials', 'የምርት ዓይነቶች')}
            title={t('Premium Quality', 'ደረጃቸውን የጠበቁ')}
            accent={t('Steel Rebar & Supplies.', 'የኮንስትራክሽን ግብአቶች።')}
            sub={t(
              'Reinforcing bars strengthen concrete and keep it in tension to improve mechanical performance. Yegna Trading supplies certified Grade 75 rebar, cement, staffa coil, and formwork plywood.',
              'የኮንክሪት የብረት ቆራጭ (ሬባር) ኮንክሪትን በማጠንከር የህንፃዎችን መዋቅር አስተማማኝ ያደርጋል። የኛ ትሬዲንግ Grade 75 ሬባር፣ ሲሚንቶ፣ ስታፋ እና ፕላይዉድ በሙሉ መጠን ያቀርባል።'
            )}
          />

          <div className="flex items-center gap-3">
            <a
              href={`tel:${CONTACT.phoneClean}`}
              className="bg-primary hover:bg-primary/90 text-white font-display inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition-all shadow-md"
            >
              <Phone className="h-3.5 w-3.5 text-ember" />
              <span>{t('Call Now: +251 943 00 00 07', 'አሁን ይደውሉ፡ +251 943 00 00 07')}</span>
            </a>
          </div>
        </div>

        {/* 4 Product Cards */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08}>
              <div className="border-line bg-panel card-glow group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border p-6 shadow-sm">
                <div
                  className="bg-ember/10 absolute -top-12 -right-12 h-32 w-32 rounded-full blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                  aria-hidden
                />
                <div>
                  <div className="text-ember relative transition-transform duration-300 group-hover:-translate-y-1">
                    <ProductGlyph icon={p.icon} />
                  </div>
                  <p className="font-display text-ember relative mt-5 text-[0.68rem] font-bold tracking-[0.2em] uppercase">
                    {p.tagline}
                  </p>
                  <h3 className="font-display text-ink relative mt-1.5 text-lg font-bold">
                    {t(p.name, p.amName)}
                  </h3>
                  <p className="text-mute relative mt-2.5 text-xs leading-relaxed">
                    {p.copy}
                  </p>

                  <ul className="mt-4 space-y-1.5 border-t border-line/60 pt-3">
                    {p.features.map((f) => (
                      <li key={f} className="text-mute flex items-center gap-2 text-[0.7rem]">
                        <Check className="h-3 w-3 text-ember shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-3 border-t border-line">
                  <a
                    href="#quote"
                    className="text-ember hover:text-ember/80 font-display inline-flex items-center gap-1.5 text-xs font-bold transition-all group-hover:gap-2.5"
                  >
                    <span>{t('Request Quotation', 'ዋጋ ይጠይቁ')}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Rebar Size & Conversion Table (Spec Section 4.3) */}
        <div className="mt-16">
          <Reveal delay={0.1}>
            <div className="border-line bg-panel card-glow relative overflow-hidden rounded-3xl border shadow-xl">
              <div className="border-line bg-panel2/60 flex flex-wrap items-center justify-between gap-4 border-b px-6 py-5 sm:px-8">
                <div className="flex items-center gap-3">
                  <div className="bg-ember/15 grid h-9 w-9 place-items-center rounded-xl text-ember">
                    <FileSpreadsheet className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-ink text-base font-bold sm:text-lg">
                      {t(
                        'Rebar Sizes & Standard Conversion Table',
                        'የሬባር ልኬቶችና የክብደት ልወጣ ሠንጠረዥ'
                      )}
                    </h3>
                    <p className="text-mute text-xs">
                      {t(
                        'Official metric standard (Pcs / Kg) — Grade 75 deformed steel bars',
                        'መደበኛ የሜትሪክ መለኪያ (ፍሬ በኪሎግራም) — Grade 75'
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="border-line bg-panel text-ember inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Grade 75 Certified</span>
                  </span>
                </div>
              </div>

              {/* Table view */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-line bg-panel2/30 text-mute border-b text-[0.72rem] font-bold tracking-wider uppercase">
                      <th className="px-5 py-3.5 sm:px-6">No.</th>
                      <th className="px-5 py-3.5 sm:px-6">{t('Description', 'የእቃው ዝርዝር')}</th>
                      <th className="px-5 py-3.5 sm:px-6">{t('Diameter', 'ዲያሜትር')}</th>
                      <th className="px-5 py-3.5 sm:px-6 text-right">
                        {t('Weight / 12m Bar (kg)', 'የአንድ 12ሜ ቁራጭ ክብደት (ኪ.ግ)')}
                      </th>
                      <th className="px-5 py-3.5 sm:px-6 hidden lg:table-cell text-right">
                        {t('Unit Weight', 'ክብደት በሜትር')}
                      </th>
                      <th className="px-5 py-3.5 sm:px-6 hidden md:table-cell">
                        {t('Primary Application', 'ዋና አጠቃቀም')}
                      </th>
                      <th className="px-5 py-3.5 sm:px-6 text-center">{t('Status', 'ሁኔታ')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line/60">
                    {REBAR_CONVERSION_TABLE.map((row) => {
                      const isSelected = selectedSize.no === row.no;
                      return (
                        <tr
                          key={row.no}
                          onClick={() => setSelectedSize(row)}
                          className={`cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-ember/10 font-medium'
                              : 'hover:bg-panel2/50 text-ink'
                          }`}
                        >
                          <td className="px-5 py-3.5 sm:px-6 font-mono text-mute">{row.no}</td>
                          <td className="px-5 py-3.5 sm:px-6 font-semibold text-ink">
                            {t(row.description, row.amDescription)}
                          </td>
                          <td className="px-5 py-3.5 sm:px-6">
                            <span className="border-line bg-panel rounded-md border px-2 py-0.5 font-mono text-xs font-bold text-ember">
                              Ø{row.diameter}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 sm:px-6 text-right font-mono font-bold text-ink">
                            {typeof row.weightPer12mKg === 'number'
                              ? `${row.weightPer12mKg.toFixed(2)} kg / pc`
                              : row.weightPer12mKg}
                          </td>
                          <td className="px-5 py-3.5 sm:px-6 text-right font-mono text-mute hidden lg:table-cell text-xs">
                            {row.unitWeightKgM}
                          </td>
                          <td className="px-5 py-3.5 sm:px-6 text-mute hidden md:table-cell text-xs">
                            {row.application}
                          </td>
                          <td className="px-5 py-3.5 sm:px-6 text-center">
                            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[0.68rem] font-bold text-emerald-600 dark:text-emerald-400">
                              {t('In Stock', 'በስቶክ አለ')}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Quick calculator preview */}
              <div className="border-line bg-panel2/40 border-t p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-ember text-white grid h-12 w-12 place-items-center rounded-2xl shadow-md">
                      <Calculator className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-mute text-xs uppercase font-semibold">
                        {t('Selected Metric Specification', 'የተመረጠው የብረት መለኪያ')}
                      </p>
                      <p className="font-display text-ink text-lg font-bold sm:text-xl">
                        {selectedSize.description} —{' '}
                        <span className="text-ember font-mono">
                          {typeof selectedSize.weightPer12mKg === 'number'
                            ? `${selectedSize.weightPer12mKg} kg / pc`
                            : selectedSize.weightPer12mKg}
                        </span>{' '}
                        <span className="text-mute font-mono text-sm font-normal">
                          ({selectedSize.unitWeightKgM} · {selectedSize.pcsPerQuintal})
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <a
                      href="#quote"
                      className="bg-ember hover:bg-ember/90 text-white font-display inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-bold shadow-md transition-all"
                    >
                      <span>{t('Order This Size Now', 'ይህን መጠን ይዘዙ')}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
