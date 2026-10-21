import { useState, type FormEvent } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowUp,
  ArrowUpRight,
  CheckCircle2,
  Download,
  Mail,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
  Truck,
  Flame,
} from 'lucide-react';
import { CONTACT, NAV_LINKS, SOCIALS } from '../data';
import { BrandIcon, Reveal } from '../ui';
import { useApp } from '../context/AppContext';

export default function Footer() {
  const { t } = useApp();
  const shouldReduceMotion = useReducedMotion();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative overflow-hidden bg-[#0a1120] text-slate-200 border-t border-slate-800 shadow-[0_-24px_48px_rgba(0,0,0,0.35)]">
      {/* 1. Architectural Steel Accent Top Line with Traveling Specular Gleam */}
      <div className="relative h-[2px] w-full bg-slate-800 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-ember/60 to-transparent opacity-80" />
        {!shouldReduceMotion && (
          <motion.div
            className="absolute top-0 bottom-0 w-48 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-90 blur-[1px]"
            animate={{
              x: ['-100%', '800%'],
            }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              repeatDelay: 2,
              ease: 'easeInOut',
            }}
          />
        )}
      </div>

      {/* 2. Industrial Background Textures & Ambient Forge Glow */}
      <div className="texture-grid absolute inset-0 opacity-20 pointer-events-none" aria-hidden="true" />
      <div
        className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-[240px] bg-ember/10 rounded-full blur-[90px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/4 right-[10%] w-56 h-56 bg-amber-500/5 rounded-full blur-[80px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-8 pb-12 sm:px-8 sm:py-10 sm:pb-10">
        <Reveal>
          {/* Top Row: Brand & Live Warehouse Telemetry Beacon */}
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center border-b border-slate-800/80 pb-6 sm:pb-7">
            <div className="shrink-0">
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#top"
                  aria-label="Yegna Trading PLC - Home"
                  className="focus-visible:ring-2 focus-visible:ring-ember rounded-lg focus-visible:outline-none"
                >
                  <img
                    src="/images/logo-white.png"
                    alt="Yegna Trading PLC"
                    loading="lazy"
                    width={150}
                    height={50}
                    className="h-10 sm:h-12 w-auto object-contain drop-shadow-md"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/logo-full.png';
                    }}
                  />
                </a>

                {/* Live Factory & Stock Telemetry Beacon */}
                <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[0.65rem] font-semibold text-emerald-400 backdrop-blur-sm shadow-xs">
                  <span className="relative flex h-1.5 w-1.5">
                    {!shouldReduceMotion && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    )}
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                  </span>
                  <span>{t('Central Depot: Stock Verified · 8–32mm', 'ዋና መጋዘን፡ ክፍት · ስቶክ ተረጋግጧል (8–32ሚሜ)')}</span>
                </div>
              </div>

              <p className="font-serif-i text-slate-100 mt-2 text-sm sm:text-base">
                {t(
                    'For a stronger tomorrow.',
                    'ለተሻለ ነገ።'
                  )}
              </p>
              <p className="text-slate-400 text-xs mt-0.5">
                {t('Trade with Trust & Integrity!', 'ንግድ በእምነትና በታማኝነት!')}
              </p>
            </div>

            {/* Newsletter: Get Industry & Product Insights */}
            <div className="w-full max-w-md bg-slate-900/70 border border-slate-800 rounded-xl p-3.5 sm:p-4 shadow-sm">
              <div className="flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <p className="font-display text-white text-xs sm:text-sm font-bold">
                  {t('Get Weekly Rebar Price & Mill Insights', 'ሳምንታዊ የብረት ዋጋና የገበያ መረጃዎች')}
                </p>
              </div>
              <p className="text-slate-400 text-[0.72rem] mt-0.5 leading-snug">
                {t(
                  'Receive verified Grade 75 price alerts and technical bulletins to your inbox.',
                  'ሳምንታዊ የዋጋ ዝርዝሮችንና ቴክኒካል መረጃዎችን በኢሜይልዎ ያግኙ።'
                )}
              </p>

              {subscribed ? (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="mt-2.5 flex items-center gap-2 rounded-lg bg-emerald-500/15 border border-emerald-500/35 p-2 text-xs text-emerald-400"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                  <span className="font-medium">{t('Subscribed! Weekly bulletins on the way.', 'ስለተመዘገቡ እናመሰግናለን!')}</span>
                </motion.div>
              ) : (
                <form onSubmit={handleNewsletter} className="mt-2.5 flex gap-2">
                  <label htmlFor="footer-newsletter-email" className="sr-only">
                    {t('Email address for price bulletins', 'የኢሜይል አድራሻ')}
                  </label>
                  <input
                    id="footer-newsletter-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    spellCheck={false}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('Enter your email address…', 'ኢሜይል አድራሻዎን ያስገቡ…')}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/90 text-white placeholder:text-slate-400 px-3 py-2 sm:py-1.5 text-base sm:text-xs transition-colors focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:border-transparent outline-none"
                  />
                  <motion.button
                    type="submit"
                    aria-label={t('Subscribe to price bulletins', 'ይመዝገቡ')}
                    whileHover={shouldReduceMotion ? {} : { scale: 1.04 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="cursor-pointer bg-gradient-to-r from-ember to-amber hover:from-amber hover:to-ember text-white font-display shrink-0 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
                  >
                    <Send className="h-3 w-3" />
                  </motion.button>
                </form>
              )}
            </div>

            {/* Social Icons */}
            <div className="flex flex-wrap items-center gap-2">
              {SOCIALS.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  whileHover={shouldReduceMotion ? {} : { y: -2, scale: 1.06 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.94 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                  className="border border-slate-700 bg-slate-800/80 hover:bg-ember hover:border-amber text-slate-300 hover:text-white grid h-9 w-9 place-items-center rounded-full transition-colors duration-200 shadow-xs focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
                >
                  <BrandIcon label={s.label} className="h-3.5 w-3.5" />
                </motion.a>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Middle Navigation & Contact Desks */}
        <div className="mt-7 sm:mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Head Office */}
          <div>
            <p className="font-display text-[0.68rem] font-bold tracking-[0.2em] text-amber-500 uppercase">
              {t('Head Office', 'ዋናው መሥሪያ ቤት')}
            </p>
            <p className="text-slate-300 mt-2 text-xs leading-relaxed">{CONTACT.hq}</p>
            <p className="text-slate-400 text-[0.72rem] mt-0.5">Plus Code: {CONTACT.hqPlusCode}</p>

            <a
              href={`tel:${CONTACT.phoneClean}`}
              className="hover:text-amber-400 mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-slate-200 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500 rounded-sm focus-visible:outline-none"
            >
              <Phone className="text-amber-500 h-3 w-3 shrink-0" /> {CONTACT.phone}
            </a>
            <a
              href={`mailto:${CONTACT.email}`}
              className="hover:text-amber-400 mt-1.5 flex items-center gap-1.5 text-xs transition-colors text-slate-400 focus-visible:ring-2 focus-visible:ring-amber-500 rounded-sm focus-visible:outline-none"
            >
              <Mail className="text-amber-500 h-3 w-3 shrink-0" /> {CONTACT.email}
            </a>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <a
                href="/contact/#branches"
                className="hover:text-amber-300 inline-flex items-center gap-1 text-[0.72rem] font-semibold text-amber-500 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500 rounded-sm focus-visible:outline-none"
              >
                <MapPin className="h-3 w-3" />
                <span>{t('Blueprint & Map', 'ካርታና መገኛ')}</span>
                <ArrowUpRight className="h-2.5 w-2.5" />
              </a>
              <span className="text-slate-700">·</span>
              <a
                href={CONTACT.companyProfileUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-amber-400 inline-flex items-center gap-1 text-[0.72rem] font-semibold text-slate-300 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500 rounded-sm focus-visible:outline-none"
              >
                <Download className="h-2.5 w-2.5 text-amber-500" />
                <span>PDF Profile</span>
              </a>
            </div>
          </div>

          {/* Column 2: 2 Official Phone Lines */}
          <div>
            <p className="font-display text-[0.68rem] font-bold tracking-[0.2em] text-amber-500 uppercase">
              {t('Official Phone Lines', 'የቀጥታ ስልክ መስመሮች')}
            </p>
            <div className="mt-2.5 space-y-2">
              {CONTACT.phones.map((p) => (
                <a
                  key={p.number}
                  href={`tel:${p.tel}`}
                  className="group block text-xs focus-visible:ring-2 focus-visible:ring-amber-500 rounded-sm focus-visible:outline-none bg-slate-900/50 border border-slate-800/80 rounded-lg p-2 hover:border-amber-500/50 transition-colors"
                >
                  <span className="text-slate-400 block text-[0.68rem]">{p.label}</span>
                  <span className="text-slate-200 font-mono font-bold text-xs sm:text-sm group-hover:text-amber-400 transition-colors">
                    {p.number}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Column 3: Hours & Dispatch */}
          <div>
            <p className="font-display text-[0.68rem] font-bold tracking-[0.2em] text-amber-500 uppercase">
              {t('Hours & Dispatch', 'የሥራ ሰዓትና አቅርቦት')}
            </p>
            <div className="mt-2.5 space-y-1.5 text-xs">
              {CONTACT.hours.map((h) => (
                <div key={h.day}>
                  <span className="text-slate-200 font-semibold block text-[0.75rem]">{h.day}</span>
                  <span className="text-slate-400 block text-[0.7rem]">{h.time}</span>
                </div>
              ))}
              <div className="border-t border-slate-800/80 pt-2 mt-2">
                <span className="text-amber-400 font-semibold block flex items-center gap-1 text-[0.75rem]">
                  <Truck className="h-3 w-3 text-amber-500" />
                  {t('Nationwide Dispatch', 'አገር አቀፍ አቅርቦት')}
                </span>
                <span className="text-slate-400 block text-[0.68rem] mt-0.5">
                  {t('Direct delivery to job sites across Ethiopia', 'ወደ ማንኛውም የሥራ ቦታ ፈጣን አቅርቦት')}
                </span>
              </div>
            </div>
          </div>

          {/* Column 4: Quick Navigation */}
          <div>
            <p className="font-display text-[0.68rem] font-bold tracking-[0.2em] text-amber-500 uppercase">
              {t('Navigation', 'ፈጣን ማውጫ')}
            </p>
            <ul className="mt-2.5 space-y-1.5 text-xs">
              {NAV_LINKS.slice(1).map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-slate-300 hover:text-amber-400 transition-colors flex items-center justify-between py-0.5 focus-visible:ring-2 focus-visible:ring-amber-500 rounded-sm focus-visible:outline-none"
                  >
                    <span>{t(link.label, link.amLabel)}</span>
                    <ArrowUpRight className="h-2.5 w-2.5 opacity-60" />
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="/contact/#branches"
                  className="text-slate-300 hover:text-amber-400 transition-colors flex items-center justify-between py-0.5 focus-visible:ring-2 focus-visible:ring-amber-500 rounded-sm focus-visible:outline-none"
                >
                  <span>{t('Head Office & Map', 'ዋና መሥሪያ ቤትና ካርታ')}</span>
                  <ArrowUpRight className="h-2.5 w-2.5 opacity-60" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Consolidated Single Sleek Bottom Bar */}
        <div className="mt-7 sm:mt-8 border-t border-slate-800/80 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 text-center sm:text-left">
            <p className="text-[0.72rem]">© {new Date().getFullYear()} Yegna Trading PLC.</p>
            <span className="hidden sm:inline text-slate-700">·</span>
            <div className="flex flex-wrap items-center justify-center gap-1 text-[0.65rem] text-slate-400">
              {[
                'Grade 75',
                'ASTM A615',
                'Fair-Weight',
                'Traceable Heat #',
              ].map((cert) => (
                <span
                  key={cert}
                  className="inline-flex items-center gap-1 rounded-sm border border-slate-800 bg-slate-900/60 px-2 py-0.5 text-slate-300"
                >
                  <ShieldCheck className="h-2.5 w-2.5 text-amber-500" />
                  <span>{cert}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[0.7rem] text-slate-400 hidden md:inline">
              Addis Ababa, Ethiopia
            </span>
            <motion.button
              type="button"
              onClick={scrollToTop}
              whileHover={shouldReduceMotion ? {} : { y: -2 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              className="cursor-pointer group inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1 text-[0.72rem] font-semibold text-slate-200 hover:border-amber-500 hover:text-amber-400 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none shadow-xs"
            >
              <span>{t('Back to Top', 'ወደ ላይ ውጣ')}</span>
              <ArrowUp className="h-3 w-3 transition-transform duration-200 group-hover:-translate-y-0.5 text-amber-500" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}
