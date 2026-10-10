import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { NAV_LINKS } from '../data';
import { EASE } from '../ui';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <a href="#top" className={`group flex items-center gap-3 ${className}`}>
      <span className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-black shadow-[0_0_20px_rgba(255,90,31,0.18)] transition-shadow duration-300 group-hover:shadow-[0_0_28px_rgba(255,90,31,0.35)]">
        <img
          src="/logo-mark.png"
          alt="Yegna Trading PLC logo"
          className="h-full w-full object-cover"
        />
      </span>
      <span className="leading-none">
        <span className="font-display block text-[1.05rem] font-bold tracking-[0.18em]">YEGNA</span>
        <span className="text-mute block text-[0.6rem] font-medium tracking-[0.32em] uppercase">
          Trading PLC
        </span>
      </span>
    </a>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'border-b border-line bg-bg/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <Logo />

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-mute group relative text-[0.83rem] font-medium tracking-wide transition-colors hover:text-ink"
            >
              {l.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-ember transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#quote"
            className="group font-display hidden items-center gap-2 rounded-full bg-ember px-5 py-2.5 text-[0.83rem] font-semibold text-bg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(255,90,31,0.5)] sm:inline-flex"
          >
            Get a Quote
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="border-line text-ink grid h-10 w-10 place-items-center rounded-lg border lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="border-t border-line bg-bg/95 backdrop-blur-xl overflow-hidden lg:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-mute hover:text-ember rounded-lg px-3 py-3 text-sm font-medium transition-colors"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#quote"
                onClick={() => setOpen(false)}
                className="bg-ember text-bg mt-2 rounded-full px-5 py-3 text-center text-sm font-semibold"
              >
                Get a Quote
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
