import { useState } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, MapPin, Navigation, Phone } from 'lucide-react';
import { BRANCHES, type Branch } from '../data';
import { EASE, Reveal, SectionHead } from '../ui';
import { useApp } from '../context/AppContext';

export default function Branches() {
  const { t } = useApp();
  const [selected, setSelected] = useState<Branch>(BRANCHES[0]);

  return (
    <section id="branches" className="texture-noise relative overflow-hidden py-24 sm:py-32">
      <div
        className="absolute inset-0 bg-[radial-gradient(800px_400px_at_80%_60%,rgba(245,124,0,0.05),transparent_65%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead
          eyebrow={t('Branch Network', 'የቅርንጫፎች አውታረ መረብ')}
          title={t('Seven Branches Ready', '7 ቅርንጫፎች በተሟላ ስቶክ')}
          accent={t('To Supply Your Site.', 'ለእርስዎ ዝግጁ ናቸው።')}
          sub={t(
            'From Addis Ababa commercial hubs to our regional depot in Bahirdar — pick up directly or arrange fast transport to your project.',
            'በአዲስ አበባ ዋና ዋና የንግድ ማዕከላት እንዲሁም በባሕር ዳር ባሉን ቅርንጫፎች በኩል ምርቱን በቦታው ይረከቡ ወይም በፈጣን ማጓጓዣ ወደ ግንባታ ቦታዎ እንልካለን።'
          )}
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start">
          {/* Branch Grid Selector */}
          <div className="grid gap-3.5 sm:grid-cols-2">
            {BRANCHES.map((b) => {
              const isActive = selected.name === b.name;
              return (
                <button
                  key={b.name}
                  type="button"
                  onClick={() => setSelected(b)}
                  className={`border-line text-left rounded-2xl border p-5 transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-panel border-ember shadow-lg ring-1 ring-ember/40'
                      : 'bg-panel/70 hover:bg-panel hover:border-ember/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-ember text-[0.68rem] font-bold tracking-wider uppercase">
                        {b.outside
                          ? t('Regional Branch', 'የክልል ቅርንጫፍ')
                          : b.name.includes('Head')
                          ? t('Headquarters', 'ዋናው መሥሪያ ቤት')
                          : t('Addis Ababa Branch', 'የአዲስ አበባ ቅርንጫፍ')}
                      </span>
                      <h4 className="font-display text-ink mt-1 text-base font-bold">
                        {t(b.name, b.amName)}
                      </h4>
                    </div>
                    <MapPin
                      className={`h-4 w-4 ${isActive ? 'text-ember' : 'text-mute'}`}
                    />
                  </div>

                  <p className="text-mute mt-2 text-xs line-clamp-1">{b.address}</p>

                  <div className="mt-4 flex items-center justify-between border-t border-line/60 pt-3">
                    <span className="text-ink font-mono text-xs font-semibold">
                      {b.phone}
                    </span>
                    <span
                      className={`text-[0.7rem] font-bold ${
                        isActive ? 'text-ember' : 'text-mute'
                      }`}
                    >
                      {isActive ? t('Selected', 'የተመረጠ') : t('View Details', 'ዝርዝር እይ')}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Branch Focus Card with Directions & Map */}
          <Reveal delay={0.15}>
            <div className="border-line bg-panel card-glow relative overflow-hidden rounded-3xl border p-7 sm:p-9 shadow-xl">
              <div className="texture-grid absolute inset-0 opacity-30" aria-hidden />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="bg-ember/15 text-ember rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider">
                    {selected.outside ? 'Regional Center' : 'Addis Ababa Hub'}
                  </span>
                  <Navigation className="text-ember h-5 w-5" />
                </div>

                <h3 className="font-display text-ink mt-4 text-2xl font-bold sm:text-3xl">
                  {t(selected.name, selected.amName)}
                </h3>
                <p className="text-mute mt-2 text-sm leading-relaxed">{selected.address}</p>

                {/* Direct Action Buttons */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <a
                    href={`tel:${selected.tel}`}
                    className="bg-ember hover:bg-ember/90 text-white font-display inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-bold shadow-md transition-all"
                  >
                    <Phone className="h-4 w-4" />
                    <span>
                      {t('Call This Branch', 'ለዚህ ቅርንጫፍ ይደውሉ')} ({selected.phone})
                    </span>
                  </a>

                  <a
                    href={selected.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="border-line bg-panel2 hover:bg-panel text-ink inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-xs font-semibold transition-all"
                  >
                    <ExternalLink className="h-4 w-4 text-ember" />
                    <span>{t('Get Direction on Google Maps', 'አቅጣጫ በGoogle Maps አሳይ')}</span>
                  </a>
                </div>

                {/* Interactive Map embed frame preview */}
                <div className="border-line mt-7 overflow-hidden rounded-2xl border bg-panel2/80">
                  <iframe
                    title={`Google Map for ${selected.name}`}
                    src={`https://maps.google.com/maps?q=${selected.lat},${selected.lng}&hl=en&z=14&output=embed`}
                    className="h-64 w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-mute">
                  <span>
                    {t('Stock Available: All metric sizes Ø6mm–32mm', 'ስቶክ፡ ሁሉም የሜትሪክ መጠኖች')}
                  </span>
                  <span className="font-mono text-ember font-semibold">
                    GPS: {selected.lat.toFixed(4)}, {selected.lng.toFixed(4)}
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
