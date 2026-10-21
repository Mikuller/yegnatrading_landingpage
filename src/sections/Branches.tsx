import { ExternalLink, MapPin, Navigation, Phone, Clock, Truck, ShieldCheck } from 'lucide-react';
import { CONTACT, HEAD_OFFICE } from '../data';
import { Reveal, SectionHead } from '../ui';
import { useApp } from '../context/AppContext';

export default function Branches() {
  const { t } = useApp();

  return (
    <section id="branches" className="texture-noise relative overflow-hidden py-24 sm:py-32">
      <div
        className="absolute inset-0 bg-[radial-gradient(800px_400px_at_80%_60%,rgba(245,124,0,0.05),transparent_65%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead
          eyebrow={t('Central Headquarters & Location', 'ዋና መሥሪያ ቤትና መገኛ')}
          title={t('Kazanchis Head Office', 'የካዛንቺስ ዋና መሥሪያ ቤት')}
          accent={t('Joburg Plaza, 5th Floor.', 'ጆበርግ ፕላዛ 5ኛ ፎቅ።')}
          sub={t(
            'Our sole active headquarters coordinates all procurement, client agreements, mill test verifications, and direct heavy logistics dispatch across Ethiopia.',
            'ዋናውና ንቁ የሥራ መሥሪያ ቤታችን፤ ማንኛውንም የግንባታ ውል፣ የጥራት ማረጋገጫ ሰነዶችና የቀጥታ የትራንስፖርት አቅርቦት የሚያስተባብርበት ማዕከል ነው።'
          )}
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-stretch">
          {/* Active Head Office Focus Card */}
          <Reveal delay={0.1}>
            <div className="border-line bg-panel card-glow relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border p-7 sm:p-9 shadow-xl">
              <div className="texture-grid absolute inset-0 opacity-20 pointer-events-none" aria-hidden />

              <div className="relative">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="bg-ember/15 text-ember rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
                    {t('Sole Active Headquarters', 'ብቸኛው ንቁ ዋና መሥሪያ ቤት')}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-ember font-bold">
                    <Navigation className="h-4 w-4" />
                    <span>2Q7F+H7</span>
                  </div>
                </div>

                <h3 className="font-display text-ink mt-4 text-2xl font-bold sm:text-3xl">
                  {t('Kazanchis Joburg Plaza', 'ካዛንቺስ ጆበርግ ፕላዛ')}
                </h3>
                <p className="text-ember text-sm font-semibold mt-1">
                  {t('5th Floor, Addis Ababa, Ethiopia', '5ኛ ፎቅ፣ አዲስ አበባ፣ ኢትዮጵያ')}
                </p>
                <p className="text-mute mt-3 text-xs sm:text-sm leading-relaxed">
                  {t(
                    'Conveniently located in the commercial heart of Addis Ababa. Visit our corporate office for bulk contract execution, certified mill test sheets, and direct dispatch arrangements.',
                    'በአዲስ አበባ የንግድ ማዕከል ካዛንቺስ ይጎብኙን፤ ለጅምላ ውል ስምምነቶች፣ ለምርመራ ሰነዶችና ለቀጥታ አቅርቦት ዝግጁ ነን።'
                  )}
                </p>

                {/* Visiting Hours & Contact Desks */}
                <div className="mt-6 grid gap-3 sm:grid-cols-2 border-y border-line/60 py-5">
                  <div className="flex items-start gap-3">
                    <Clock className="h-4 w-4 text-ember shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="text-ink font-bold block">{t('Business Hours', 'የሥራ ሰዓት')}</span>
                      <span className="text-mute block mt-0.5">Mon – Fri: 08:30 AM – 5:30 PM</span>
                      <span className="text-mute block">Sat: 08:30 AM – 12:30 PM</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-ember shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="text-ink font-bold block">{t('Plus Code & Landmark', 'ፕላስ ኮድና መለያ')}</span>
                      <span className="font-mono text-ember font-semibold block mt-0.5">2Q7F+H7, Addis Ababa</span>
                      <span className="text-mute block">Kazanchis Business Corridor</span>
                    </div>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <a
                    href={`tel:${HEAD_OFFICE.tel}`}
                    className="bg-ember hover:bg-ember/90 text-white font-display inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-bold shadow-md transition-all"
                  >
                    <Phone className="h-4 w-4" />
                    <span>
                      {t('Call Head Office', 'ዋናውን ቢሮ ይደውሉ')} ({HEAD_OFFICE.phone})
                    </span>
                  </a>

                  <a
                    href={HEAD_OFFICE.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="border-line bg-panel2 hover:bg-panel text-ink inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-xs font-semibold transition-all"
                  >
                    <ExternalLink className="h-4 w-4 text-ember" />
                    <span>{t('Open in Google Maps', 'አቅጣጫ በGoogle Maps')}</span>
                  </a>
                </div>
              </div>

              {/* Nationwide Dispatch Reassurance */}
              <div className="relative mt-8 rounded-2xl border border-line/60 bg-panel2/60 p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-ember/15 text-ember rounded-lg p-2 shrink-0">
                    <Truck className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-display text-ink text-xs font-bold">
                      {t('Nationwide Project Site Dispatch', 'ወደ ማንኛውም የግንባታ ቦታ ቀጥታ ማድረስ')}
                    </h4>
                    <p className="text-mute mt-1 text-[0.72rem] leading-relaxed">
                      {t(
                        'Although client administration operates centrally from Kazanchis Joburg Plaza, certified rebar, cement, and materials are dispatched directly from regional depots to your job site across Ethiopia.',
                        'ምንም እንኳን የቢሮ አስተዳደራችን በካዛንቺስ ጆበርግ ፕላዛ ብቻ የሚገኝ ቢሆንም፣ ምርቶች በቀጥታ ወደ ማንኛውም የግንባታ ቦታዎ በከባድ መኪኖች ይደርሳሉ።'
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Interactive Map embed frame preview */}
          <Reveal delay={0.2}>
            <div className="border-line bg-panel card-glow relative flex h-full flex-col overflow-hidden rounded-3xl border p-7 sm:p-9 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-line/60">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-ember" />
                  <span className="font-display text-ink text-xs font-bold uppercase tracking-wider">
                    {t('Location Blueprint', 'የመገኛ ካርታ')}
                  </span>
                </div>
                <span className="font-mono text-xs text-mute font-semibold">
                  9°00'50.4"N, 38°46'23.6"E
                </span>
              </div>

              <div className="border-line mt-4 flex-1 overflow-hidden rounded-2xl border bg-panel2/80 min-h-[340px]">
                <iframe
                  title="Google Map for Kazanchis Joburg Plaza 5th Floor"
                  src="https://maps.google.com/maps?q=9.013985,38.773222&hl=en&z=16&output=embed"
                  className="h-full w-full min-h-[340px] border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-mute">
                <span>
                  {t('Kazanchis Joburg Plaza, 5th Floor, Addis Ababa', 'ካዛንቺስ ጆበርግ ፕላዛ 5ኛ ፎቅ')}
                </span>
                <a
                  href={HEAD_OFFICE.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-ember font-semibold hover:underline inline-flex items-center gap-1"
                >
                  <span>{t('View Larger Map', 'ትልቁን ካርታ እይ')}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
