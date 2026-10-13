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
} from 'lucide-react';
import { CONTACT, NAV_LINKS, SOCIALS } from '../data';
import { EASE } from '../ui';
import { useApp } from '../context/AppContext';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <a href="#top" className={`group flex items-center gap-3 ${className}`}>
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
      className="fixed inset-x-0 top-0 z-50"
    >
      {/* Top utility contact bar (Spec 4.1: Customer Support, Email, Hours, Socials) */}
      <div className="border-line bg-panel2/95 text-mute hidden border-b px-5 py-1.5 text-xs backdrop-blur-md md:block sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-6">
            <a
              href={`tel:${CONTACT.phoneClean}`}
              className="hover:text-ember flex items-center gap-1.5 transition-colors"
            >
              <Phone className="text-ember h-3.5 w-3.5" />
              <span>{CONTACT.phone}</span>
            </a>
            <a
              href={`mailto:${CONTACT.email}`}
              className="hover:text-ember flex items-center gap-1.5 transition-colors"
            >
              <Mail className="text-ember h-3.5 w-3.5" />
              <span>{CONTACT.email}</span>
            </a>
            <span className="flex items-center gap-1.5 opacity-80">
              <Clock className="h-3 w-3 text-ember" />
              <span>Mon–Fri 08:30 AM–5:30 PM | Sat 08:30 AM–12:30 PM</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Social links */}
            <div className="flex items-center gap-2.5 pr-2 border-r border-line">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="hover:text-ember transition-colors text-xs opacity-75 hover:opacity-100"
                >
                  {s.label}
                </a>
              ))}
            </div>

            {/* Language Toggle */}
            <button
              type="button"
              onClick={toggleLanguage}
              aria-label="Toggle language"
              className="border-line hover:border-ember text-ink hover:text-ember flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.72rem] font-semibold transition-colors cursor-pointer"
            >
              <Globe className="h-3 w-3 text-ember" />
              <span>{lang === 'en' ? 'አማርኛ' : 'English'}</span>
            </button>

            {/* Theme Toggle (Light default / Dark) */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="border-line hover:border-ember text-ink hover:text-ember flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.72rem] font-semibold transition-colors cursor-pointer"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="h-3 w-3 text-amber" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon className="h-3 w-3 text-primary" />
                  <span>Dark</span>
                </>
              )}
            </button>
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
          <nav className="hidden items-center gap-6 xl:gap-7 lg:flex">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-mute hover:text-ink group relative text-[0.84rem] font-semibold tracking-wide transition-colors"
              >
                {t(l.label, l.amLabel)}
                <span className="bg-ember absolute -bottom-1.5 left-0 h-[2px] w-0 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
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
              href="#quote"
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
            exit={{ height: 0, opacity: 0 }}
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
                  className="text-ember flex items-center gap-1 text-xs font-bold"
                >
                  <Phone className="h-3 w-3" />
                  {CONTACT.phone}
                </a>
              </div>

              {/* Links */}
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-ink hover:text-ember hover:bg-panel2 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors"
                >
                  {t(l.label, l.amLabel)}
                </a>
              ))}

              <div className="mt-4 pt-3 border-t border-line flex flex-col gap-2.5">
                <a
                  href="#quote"
                  onClick={() => setOpen(false)}
                  className="bg-ember text-white rounded-xl py-3 text-center text-sm font-bold shadow-md"
                >
                  {t('Get a Quick Quotation', 'ፈጣን የዋጋ መጠየቂያ')}
                </a>
                <a
                  href={`tel:${CONTACT.phoneClean}`}
                  className="border-line bg-panel2 text-ink flex items-center justify-center gap-2 rounded-xl py-2.5 text-center text-xs font-semibold border"
                >
                  <Phone className="h-3.5 w-3.5 text-ember" />
                  <span>Call {CONTACT.phone}</span>
                </a>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
