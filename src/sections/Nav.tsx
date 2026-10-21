import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowUpRight,
  Globe,
  Mail,
  Menu,
  Moon,
  Phone,
  Sun,
  X,
  Clock,
  ChevronDown,
} from 'lucide-react';
import { CONTACT, NAV_LINKS, SOCIALS } from '../data';
import { BrandIcon, EASE } from '../ui';
import { useApp } from '../context/AppContext';

const BRAND_ICON_COLORS: Record<string, string> = {
  Facebook: 'text-[#1877F2]',
  LinkedIn: 'text-[#0A66C2]',
  Instagram: 'text-[#E1306C]',
  Telegram: 'text-[#229ED9]',
  TikTok: '',
};

export function Logo({ className = '' }: { className?: string }) {
  return (
    <a href="/" className={`group flex items-center gap-3 ${className}`}>
      <span className="border-line relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl border bg-panel shadow-sm transition-shadow duration-300 group-hover:shadow-[0_0_24px_rgba(245,124,0,0.35)]">
        <img
          src="/images/logo-icon.png"
          alt="Yegna Trading PLC icon"
          width={40}
          height={40}
          className="h-full w-full object-contain p-1"
          onError={(e) => {
            // fallback if needed
            (e.currentTarget as HTMLImageElement).src = '/logo-mark.png';
          }}
        />
      </span>
      <span className="leading-none">
        <span className="font-display text-ink block text-[1.05rem] font-extrabold tracking-[0.16em]">
          YEGNA
        </span>
        <span className="text-mute block text-[0.62rem] font-semibold tracking-[0.28em] uppercase">
          Trading PLC
        </span>
      </span>
    </a>
  );
}

export default function Nav() {
  const { theme, toggleTheme, lang, toggleLanguage, t } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
    }
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isLinkActive = (href: string) => {
    if (href === '/') {
      return currentPath === '/' || currentPath === '' || currentPath === '/index.html';
    }
    return currentPath.startsWith(href);
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
      className="fixed inset-x-0 top-0 z-50"
    >
      {/* Top utility contact bar (Customer Support, Email, Head Office, Hours, Socials with logos) */}
      <div className="border-line bg-panel2/95 text-mute hidden border-b px-5 py-2 text-xs backdrop-blur-md md:block sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          {/* Popping Contact & Location Information */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            {/* Phone hotline: High-contrast popping pill button */}
            <a
              href={`tel:${CONTACT.phoneClean}`}
              className="border-line bg-panel hover:border-ember/70 hover:bg-panel2 text-ink group inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-semibold shadow-2xs transition-all duration-200 hover:-translate-y-0.5"
              title={t('Direct Sales & Support Hotline', 'የቀጥታ የሽያጭና ድጋፍ መስመር')}
            >
              <span className="grid h-4 w-4 place-items-center rounded-full bg-ember/15 text-ember group-hover:bg-ember group-hover:text-white transition-colors">
                <Phone className="h-2.5 w-2.5" />
              </span>
              <span className="font-mono tracking-tight font-bold text-ink">{CONTACT.phone}</span>
            </a>

            {/* Email: Refined popping pill button */}
            <a
              href={`mailto:${CONTACT.email}`}
              className="border-line bg-panel hover:border-ember/70 hover:bg-panel2 text-ink group inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium shadow-2xs transition-all duration-200 hover:-translate-y-0.5"
              title={t('Send an Email', 'ኢሜይል ይላኩ')}
            >
              <Mail className="h-3.5 w-3.5 text-ember shrink-0" />
              <span className="tracking-tight text-mute group-hover:text-ink transition-colors">{CONTACT.email}</span>
            </a>

            {/* Operating Hours: Clean status badge */}
            <div className="hidden xl:inline-flex items-center gap-2 rounded-full border border-line bg-panel/60 px-3 py-1 text-[0.72rem] text-mute shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
              <Clock className="h-3 w-3 text-ember shrink-0" />
              <span>
                <strong className="text-ink font-semibold">Mon–Fri</strong> 08:30–17:30 <span className="opacity-30">|</span> <strong className="text-ink font-semibold">Sat</strong> 08:30–12:30
              </span>
            </div>
          </div>

          {/* Social Channels with Authentic Brand Logos (Unified neutral pills) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-[0.68rem] uppercase font-bold tracking-wider text-mute/80 pr-1 hidden lg:inline">
              {t('Follow Us', 'ይከተሉን')}:
            </span>
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                title={s.label}
                className="border-line bg-panel/85 hover:bg-panel hover:border-ember/50 text-ink group inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium shadow-2xs transition-all duration-200 hover:-translate-y-0.5"
              >
                <BrandIcon
                  label={s.label}
                  className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${BRAND_ICON_COLORS[s.label] ?? 'text-ember'}`}
                />
                <span className="text-[0.72rem] text-mute group-hover:text-ink transition-colors hidden lg:inline">
                  {s.label}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div
        className={`transition-all duration-400 ${
          scrolled
            ? 'border-line bg-panel/95 shadow-lg backdrop-blur-2xl border-b'
            : 'border-b border-line/40 bg-panel/85 backdrop-blur-xl'
        }`}
      >
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <Logo />

          {/* Desktop links */}
          <nav className="hidden items-center gap-5 xl:gap-7 lg:flex">
            {NAV_LINKS.map((l) => {
              const active = isLinkActive(l.href);
              if (l.sublinks && l.sublinks.length > 0) {
                return (
                  <div key={l.label} className="group/dropdown relative py-2">
                    <a
                      href={l.href}
                      className={`${
                        active ? 'text-ember font-bold' : 'text-mute hover:text-ink'
                      } group relative flex items-center gap-1.5 text-[0.84rem] font-semibold tracking-wide transition-colors`}
                    >
                      <span>{t(l.label, l.amLabel)}</span>
                      <ChevronDown className="h-3.5 w-3.5 opacity-60 transition-transform duration-200 group-hover/dropdown:rotate-180" />
                      <span
                        className={`bg-ember absolute -bottom-0.5 left-0 h-[2px] transition-all duration-300 ${
                          active ? 'w-full' : 'w-0 group-hover:w-full'
                        }`}
                      />
                    </a>

                    {/* Floating Dropdown Card */}
                    <div className="invisible opacity-0 -translate-y-2 pointer-events-none group-hover/dropdown:visible group-hover/dropdown:opacity-100 group-hover/dropdown:translate-y-0 group-hover/dropdown:pointer-events-auto absolute top-full left-1/2 -translate-x-1/2 pt-2 transition-all duration-200 z-50">
                      <div className="border-line bg-panel/95 shadow-2xl backdrop-blur-2xl rounded-2xl border p-2 min-w-[280px]">
                        <div className="px-3 py-1.5 border-b border-line/60 mb-1">
                          <p className="text-[0.68rem] uppercase font-bold tracking-wider text-ember">
                            {t('Company & Standards', 'ስለ ድርጅቱና ደረጃዎች')}
                          </p>
                        </div>
                        <div className="space-y-0.5">
                          {l.sublinks.map((sub) => (
                            <a
                              key={sub.href}
                              href={sub.href}
                              className="group/item flex flex-col rounded-xl px-3 py-2 text-xs transition-colors hover:bg-panel2"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-ink group-hover/item:text-ember transition-colors">
                                  {t(sub.label, sub.amLabel)}
                                </span>
                                <ArrowUpRight className="h-3 w-3 text-mute/50 group-hover/item:text-ember transition-colors" />
                              </div>
                              {sub.description && (
                                <span className="text-[0.7rem] text-mute mt-0.5 leading-snug">
                                  {t(sub.description, sub.amDescription || sub.description)}
                                </span>
                              )}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <a
                  key={l.href}
                  href={l.href}
                  className={`${
                    active ? 'text-ember font-bold' : 'text-mute hover:text-ink'
                  } group relative text-[0.84rem] font-semibold tracking-wide transition-colors`}
                >
                  {t(l.label, l.amLabel)}
                  <span
                    className={`bg-ember absolute -bottom-1.5 left-0 h-[2px] transition-all duration-300 ${
                      active ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          {/* Actions & controls */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Quick theme toggle button (visible on mobile / tablet as well) */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="border-line text-ink hover:text-ember hover:border-ember grid h-9 w-9 place-items-center rounded-full border transition-all cursor-pointer"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber" />
              ) : (
                <Moon className="h-4 w-4 text-primary" />
              )}
            </button>

            {/* Quick language toggle button */}
            <button
              type="button"
              onClick={toggleLanguage}
              aria-label="Toggle language"
              className="border-line text-ink hover:text-ember hover:border-ember hidden h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-bold transition-all sm:flex cursor-pointer"
            >
              <Globe className="h-3.5 w-3.5 text-ember" />
              <span>{lang === 'en' ? 'አማ' : 'EN'}</span>
            </button>

            {/* Quotation CTA */}
            <a
              href="/contact/#quote"
              className="bg-ember text-white hover:bg-ember/90 font-display hidden items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold tracking-wide shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(245,124,0,0.4)] sm:inline-flex"
            >
              {t('Get a Quote', 'ዋጋ ይጠይቁ')}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>

            {/* Mobile menu button */}
            <button
              type="button"
              aria-label="Toggle navigation menu"
              onClick={() => setOpen((v) => !v)}
              className="border-line text-ink hover:text-ember grid h-10 w-10 place-items-center rounded-xl border lg:hidden cursor-pointer"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 1 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="border-line bg-panel/98 border-b shadow-2xl backdrop-blur-2xl overflow-hidden lg:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-5 sm:px-8">
              {/* Mobile controls bar */}
              <div className="border-line mb-3 flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleLanguage}
                    className="border-line text-ink flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold"
                  >
                    <Globe className="h-3.5 w-3.5 text-ember" />
                    <span>{lang === 'en' ? 'አማርኛ' : 'English'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="border-line text-ink flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold"
                  >
                    {theme === 'dark' ? (
                      <>
                        <Sun className="h-3.5 w-3.5 text-amber" />
                        <span>Light</span>
                      </>
                    ) : (
                      <>
                        <Moon className="h-3.5 w-3.5 text-primary" />
                        <span>Dark</span>
                      </>
                    )}
                  </button>
                </div>

                <a
                  href={`tel:${CONTACT.phoneClean}`}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-ember/45 bg-ember/10 hover:bg-ember px-2.5 py-1 text-xs font-bold text-ember hover:text-white transition-all shadow-xs"
                >
                  <span className="grid h-4 w-4 place-items-center rounded-full bg-ember text-white group-hover:bg-white group-hover:text-ember transition-colors">
                    <Phone className="h-2.5 w-2.5" />
                  </span>
                  <span className="font-mono text-[0.72rem]">{CONTACT.phone}</span>
                </a>
              </div>

              {/* Links */}
              {NAV_LINKS.map((l) => {
                const active = isLinkActive(l.href);
                return (
                  <div key={l.label}>
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={`${
                        active ? 'bg-ember/10 text-ember font-bold' : 'text-ink hover:text-ember hover:bg-panel2 font-semibold'
                      } flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm transition-colors`}
                    >
                      <span>{t(l.label, l.amLabel)}</span>
                      {l.sublinks && (
                        <span className="text-[0.68rem] text-ember font-mono uppercase bg-ember/15 px-2 py-0.5 rounded-full font-bold">
                          {t('4 Sections', '4 ክፍሎች')}
                        </span>
                      )}
                    </a>

                    {/* Sublinks nested inside mobile drawer */}
                    {l.sublinks && (
                      <div className="ml-3 my-1 border-l-2 border-ember/30 pl-2.5 space-y-1">
                        {l.sublinks.map((sub) => (
                          <a
                            key={sub.href}
                            href={sub.href}
                            onClick={() => setOpen(false)}
                            className="text-mute hover:text-ember hover:bg-panel2 flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors"
                          >
                            <span>{t(sub.label, sub.amLabel)}</span>
                            <ArrowUpRight className="h-3 w-3 opacity-50" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="mt-4 pt-3 border-t border-line flex flex-col gap-2.5">
                <a
                  href="/contact/#quote"
                  onClick={() => setOpen(false)}
                  className="bg-ember text-white hover:bg-ember/90 rounded-xl py-3 text-center text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>{t('Get a Quick Quotation', 'ፈጣን የዋጋ መጠየቂያ')}</span>
                  <ArrowUpRight className="h-4 w-4" />
                </a>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${CONTACT.phoneClean}`}
                    className="border-line bg-panel2 hover:border-ember text-ink flex items-center justify-center gap-2 rounded-xl py-2.5 text-center text-xs font-bold border transition-colors shadow-2xs"
                  >
                    <span className="grid h-4 w-4 place-items-center rounded-full bg-ember/15 text-ember">
                      <Phone className="h-2.5 w-2.5" />
                    </span>
                    <span>{t('Call Us', 'ደውሉ')}</span>
                  </a>

                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="border-line bg-panel2 hover:border-ember text-ink flex items-center justify-center gap-2 rounded-xl py-2.5 text-center text-xs font-bold border transition-colors shadow-2xs"
                  >
                    <Mail className="h-3.5 w-3.5 text-ember" />
                    <span>{t('Email Us', 'ኢሜይል')}</span>
                  </a>
                </div>

                {/* Social media channels in drawer */}
                <div className="pt-2 border-t border-line/60 flex items-center justify-center gap-2 flex-wrap">
                  {SOCIALS.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={s.label}
                      className="border-line bg-panel hover:border-ember/60 text-ink flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.7rem] font-medium transition-all shadow-2xs"
                    >
                      <BrandIcon
                        label={s.label}
                        className={`h-3 w-3 shrink-0 ${BRAND_ICON_COLORS[s.label] ?? 'text-ember'}`}
                      />
                      <span className="text-mute">{s.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
