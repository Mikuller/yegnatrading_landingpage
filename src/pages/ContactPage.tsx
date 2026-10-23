import Breadcrumbs from '../components/Breadcrumbs';
import Branches from '../sections/Branches';
import Quote from '../sections/Quote';
import { Clock, Mail, MapPin, Phone, ShieldCheck, Sparkles } from 'lucide-react';
import { CONTACT } from '../data';
import { useApp } from '../context/AppContext';

export default function ContactPage() {
  const { t } = useApp();

  return (
    <>
      {/* Page Header Banner */}
      <section className="texture-noise relative overflow-hidden pt-24 sm:pt-32 lg:pt-36 pb-12 sm:pb-16 border-b border-line">
        <div
          className="absolute inset-0 bg-[radial-gradient(900px_450px_at_50%_0%,rgba(245,124,0,0.12),transparent_70%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <Breadcrumbs items={[{ label: 'Contact & Quote', amLabel: 'ያግኙንና ዋጋ ይጠይቁ' }]} />

          <div className="relative max-w-3xl">
            {/* Soft text-protective scrim halo ensuring 100% crisp legibility */}
            <div aria-hidden="true" className="text-protective-halo" />
            <div className="border-line bg-panel2/90 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold text-ember backdrop-blur-sm mb-4">
              <Phone className="h-4 w-4" />
              <span>{t('Direct Sales & Logistics Support', 'የቀጥታ ሽያጭና ሎጂስቲክስ ድጋፍ')}</span>
            </div>

            <h1 className="font-display text-ink text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
              {t('Get in Touch with', 'ከየኛ ትሬዲንግ ጋር')} <br />
              <span className="text-gradient-ember">{t('Our Order Desk.', 'ቀጥታ ይገናኙ።')}</span>
            </h1>

            <p className="text-mute text-base sm:text-lg mt-5 leading-relaxed">
              {t(
                'Visit our central headquarters at Kazanchis Joburg Plaza or connect directly with our sales, logistics, and customer service teams for fast quotes and on-site delivery coordination.',
                'በካዛንቺስ ጆበርግ ፕላዛ 5ኛ ፎቅ የሚገኘውን ዋና መሥሪያ ቤታችንን ይጎብኙ ወይም ከሽያጭና ሎጂስቲክስ ቡድናችን ጋር በመደወል ፈጣን የዋጋ ዝርዝርና የቀጥታ አቅርቦት ያግኙ።'
              )}
            </p>
          </div>

          {/* Department Hotlines Grid (2 Official Lines) */}
          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-2xl mx-auto sm:gap-4">
            {CONTACT.phones.map((p) => (
              <a
                key={p.number}
                href={`tel:${p.tel}`}
                className="border-line bg-panel/90 hover:border-ember hover:bg-panel2 rounded-2xl border p-4 shadow-sm backdrop-blur-md transition-all duration-200 group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-ember/15 text-ember group-hover:bg-ember group-hover:text-white transition-colors">
                    <Phone className="h-4 w-4" />
                  </span>
                  <div>
                    <span className="text-mute text-[0.72rem] block font-medium">{p.label}</span>
                    <span className="text-ink font-mono text-xs sm:text-sm font-bold group-hover:text-ember transition-colors">
                      {p.number}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Head Office, Map & Blueprint */}
      <Branches />

      {/* Comprehensive RFQ Builder */}
      <Quote />
    </>
  );
}
