import { useState, type FormEvent } from 'react';
import { ArrowUpRight, CheckCircle2, Download, Mail, Phone, Send } from 'lucide-react';
import { BRANCHES, CONTACT, SOCIALS } from '../data';
import { Reveal } from '../ui';
import { useApp } from '../context/AppContext';

const SOCIAL_PATHS: Record<string, string> = {
  Facebook:
    'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  LinkedIn:
    'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z',
  Instagram:
    'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
  Telegram:
    'M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z',
  TikTok:
    'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
};

function BrandIcon({ label, className = '' }: { label: string; className?: string }) {
  const path = SOCIAL_PATHS[label];
  if (!path) return <ArrowUpRight className={className} />;
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d={path} />
    </svg>
  );
}

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
                  className="border-line text-mute hover:border-ember hover:text-ember bg-panel grid h-10 w-10 place-items-center rounded-full border transition-all duration-300 shadow-sm"
                >
                  <BrandIcon label={s.label} className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Middle Navigation & Branches */}
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

          <div className="sm:col-span-2 lg:col-span-3">
            <p className="font-display text-[0.68rem] font-bold tracking-[0.25em] text-ember uppercase">
              {t('Branch Network (7 Locations)', 'የቅርንጫፎች አውታረ መረብ')}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:grid-cols-4">
              {BRANCHES.map((b) => (
                <a
                  key={b.name}
                  href={`tel:${b.tel}`}
                  className="group rounded-xl border border-line/60 bg-panel/50 p-2.5 transition-all hover:border-ember/50 hover:bg-panel"
                >
                  <span className="group-hover:text-ember block font-bold text-xs transition-colors text-ink">
                    {t(b.name, b.amName)}
                  </span>
                  <span className="text-mute text-[0.68rem] font-mono tabular-nums block mt-0.5">
                    {b.phone}
                  </span>
                </a>
              ))}
            </div>
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
