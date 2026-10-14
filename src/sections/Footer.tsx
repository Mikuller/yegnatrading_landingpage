import { useState, type FormEvent } from 'react';
import { ArrowUpRight, CheckCircle2, Download, Mail, MapPin, Phone, Send } from 'lucide-react';
import { CONTACT, NAV_LINKS, SOCIALS } from '../data';
import { BrandIcon, Reveal } from '../ui';
import { useApp } from '../context/AppContext';

export default function Footer() {
  const { theme, t } = useApp();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  return (
    <footer className="border-line bg-panel2/50 relative overflow-hidden border-t">
      <div
        className="absolute inset-0 bg-[radial-gradient(800px_300px_at_50%_100%,rgba(245,124,0,0.06),transparent_65%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-center border-b border-line pb-12">
            <div>
              <div className="flex items-center gap-3">
                <img
                  src={theme === 'dark' ? '/images/logo-white.png' : '/images/logo-main.png'}
                  alt="Yegna Trading PLC"
                  loading="lazy"
                  width={180}
                  height={64}
                  className="h-16 w-auto max-w-full sm:h-20 object-contain"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/logo-full.png';
                  }}
                />
              </div>
              <p className="font-serif-i text-ink mt-3 text-lg sm:text-xl">
                For a stronger tomorrow — ባለበት ላይ አብረን።
              </p>
              <p className="text-mute text-xs mt-1">
                {t('Trade with Trust & Integrity!', 'ንግድ በእምነትና በታማኝነት!')}
              </p>
            </div>

            {/* Newsletter: Get Industry & Product Insights (Spec 4.1 & 7 #9) */}
            <div className="w-full max-w-md">
              <p className="font-display text-ink text-sm font-bold">
                {t('Get Industry & Product Insights', 'የዘርፉን አዳዲስ መረጃዎች ያግኙ')}
              </p>
              <p className="text-mute text-xs mt-1">
                {t(
                  'Receive weekly rebar price alerts and construction technical bulletins.',
                  'ሳምንታዊ የዋጋ ዝርዝሮችንና ቴክኒካል መረጃዎችን በኢሜይልዎ ያግኙ።'
                )}
              </p>

              {subscribed ? (
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-2.5 text-xs text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{t('Thank you for subscribing!', 'ስለተመዘገቡ እናመሰግናለን!')}</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletter} className="mt-3 flex gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('Enter your email address', 'ኢሜይል አድራሻዎን ያስገቡ')}
                    className="border-line bg-panel text-ink placeholder:text-mute/60 w-full rounded-xl border px-3.5 py-2.5 text-xs outline-none focus:border-ember"
                  />
                  <button
                    type="submit"
                    className="bg-ember hover:bg-ember/90 text-white font-display shrink-0 rounded-xl px-4 py-2.5 text-xs font-bold transition-all shadow-sm"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </form>
              )}
            </div>

            {/* Social Icons */}
            <div className="flex flex-wrap items-center gap-2.5">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className="border-line bg-panel hover:bg-panel2 hover:border-ember text-mute hover:text-ember grid h-10 w-10 place-items-center rounded-full border transition-all duration-200 shadow-xs hover:-translate-y-0.5"
                >
                  <BrandIcon label={s.label} className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Middle Navigation & Contact Desks */}
        <div className="border-line mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-[0.68rem] font-bold tracking-[0.25em] text-ember uppercase">
              {t('Head Office', 'ዋናው መሥሪያ ቤት')}
            </p>
            <p className="text-mute mt-3 text-xs sm:text-sm leading-relaxed">{CONTACT.hq}</p>
            <p className="text-mute text-xs mt-1">Plus Code: {CONTACT.hqPlusCode}</p>

            <a
              href={`tel:${CONTACT.phoneClean}`}
              className="hover:text-ember mt-3 flex items-center gap-2 text-xs sm:text-sm font-semibold transition-colors"
            >
              <Phone className="text-ember h-3.5 w-3.5" /> {CONTACT.phone}
            </a>
            <a
              href={`mailto:${CONTACT.email}`}
              className="hover:text-ember mt-2 flex items-center gap-2 text-xs sm:text-sm transition-colors text-mute"
            >
              <Mail className="text-ember h-3.5 w-3.5" /> {CONTACT.email}
            </a>

            <div className="mt-2.5">
              <a
                href="#branches"
                className="hover:text-ember inline-flex items-center gap-1.5 text-xs font-semibold text-ember transition-colors"
              >
                <MapPin className="h-3.5 w-3.5" />
                <span>{t('View Office Blueprint & Map', 'ካርታና መገኛ ይመልከቱ')}</span>
                <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>

            <div className="mt-4">
              <a
                href={CONTACT.companyProfileUrl}
                target="_blank"
                rel="noreferrer"
                className="border-line bg-panel hover:bg-panel2 hover:text-ember text-ink text-xs inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-semibold transition-all"
              >
                <Download className="h-3 w-3 text-ember" />
                <span>{t('Download Profile (PDF)', 'የድርጅት መገለጫ (PDF)')}</span>
              </a>
            </div>
          </div>

          <div>
            <p className="font-display text-[0.68rem] font-bold tracking-[0.25em] text-ember uppercase">
              {t('Support & Order Desks', 'የቀጥታ ስልክ መስመሮች')}
            </p>
            <div className="mt-3 space-y-2.5">
              {CONTACT.phones.map((p) => (
                <a
                  key={p.number}
                  href={`tel:${p.tel}`}
                  className="group block text-xs"
                >
                  <span className="text-mute block text-[0.7rem]">{p.label}</span>
                  <span className="text-ink font-mono font-semibold group-hover:text-ember transition-colors">
                    {p.number}
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="font-display text-[0.68rem] font-bold tracking-[0.25em] text-ember uppercase">
              {t('Hours & Dispatch', 'የሥራ ሰዓትና አቅርቦት')}
            </p>
            <div className="mt-3 space-y-2 text-xs">
              {CONTACT.hours.map((h) => (
                <div key={h.day}>
                  <span className="text-ink font-semibold block">{h.day}</span>
                  <span className="text-mute block text-[0.72rem]">{h.time}</span>
                </div>
              ))}
              <div className="border-t border-line/60 pt-2.5 mt-2.5">
                <span className="text-ember font-semibold block">{t('Nationwide Dispatch', 'አገር አቀፍ አቅርቦት')}</span>
                <span className="text-mute block text-[0.72rem] mt-0.5">
                  {t('Direct delivery to job sites across Ethiopia', 'ወደ ማንኛውም የሥራ ቦታ ፈጣን አቅርቦት')}
                </span>
              </div>
            </div>
          </div>

          <div>
            <p className="font-display text-[0.68rem] font-bold tracking-[0.25em] text-ember uppercase">
              {t('Navigation', 'ፈጣን ማውጫ')}
            </p>
            <ul className="mt-3 space-y-2 text-xs">
              {NAV_LINKS.slice(1).map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-mute hover:text-ember transition-colors flex items-center justify-between"
                  >
                    <span>{t(link.label, link.amLabel)}</span>
                    <ArrowUpRight className="h-3 w-3 opacity-60" />
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#branches"
                  className="text-mute hover:text-ember transition-colors flex items-center justify-between"
                >
                  <span>{t('Head Office & Map', 'ዋና መሥሪያ ቤትና ካርታ')}</span>
                  <ArrowUpRight className="h-3 w-3 opacity-60" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer bottom bar with updated copyright year 2026 */}
        <div className="border-line mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row text-xs text-mute">
          <p>© {new Date().getFullYear()} Yegna Trading PLC. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="tracking-wider uppercase">
              {t('Legally Certified · Grade 75 Rebar', 'ሕጋዊ የተረጋገጠ · Grade 75')}
            </span>
            <span>·</span>
            <a href="#top" className="hover:text-ember transition-colors">
              {t('Back to Top ↑', 'ወደ ላይ ውጣ ↑')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
