import { useEffect, useState, type ReactNode } from 'react';
import BrandPreloader from './BrandPreloader';
import ArchitecturalTransition from './ArchitecturalTransition';
import { motion, useScroll, useSpring } from 'motion/react';
import { ArrowUpRight, Phone, Send } from 'lucide-react';
import { CONTACT } from '../data';
import { useApp } from '../context/AppContext';
import Nav from '../sections/Nav';
import Footer from '../sections/Footer';
import RealisticRebarWeaveBackground from './RealisticRebarWeaveBackground';

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 });
  return (
    <motion.div
      className="from-ember to-amber fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r"
      style={{ scaleX }}
    />
  );
}

function NavigationProgress({ isNavigating }: { isNavigating: boolean }) {
  if (!isNavigating) return null;
  return (
    <div className="fixed inset-x-0 top-0 z-[70] h-[3px] overflow-hidden pointer-events-none bg-ember/20">
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '0%' }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="h-full w-full bg-gradient-to-r from-amber via-ember to-amber-300 shadow-[0_0_12px_rgba(245,124,0,0.9)]"
      />
    </div>
  );
}

function MobileStickyBar() {
  const { t } = useApp();

  return (
    <div className="border-line bg-panel/95 fixed inset-x-0 bottom-0 z-40 border-t p-2.5 pl-[max(0.625rem,env(safe-area-inset-left))] pr-[max(0.625rem,env(safe-area-inset-right))] pb-[max(0.625rem,env(safe-area-inset-bottom))] shadow-2xl backdrop-blur-xl md:hidden">
      <div className="mx-auto flex max-w-md items-center justify-between gap-2.5">
        <a
          href={`tel:${CONTACT.phoneClean}`}
          className="border-line bg-panel2 text-ink hover:text-ember active:scale-95 flex flex-1 min-h-[44px] items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-bold transition-all shadow-sm"
        >
          <Phone className="text-ember h-4 w-4 shrink-0" />
          <span>{t('Call Now', 'ደውል')}</span>
        </a>

        <a
          href="/contact/#quote"
          className="bg-ember text-white hover:bg-ember/90 active:scale-95 flex flex-1 min-h-[44px] items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold shadow-md transition-all"
        >
          <span>{t('Get Quote', 'ዋጋ ጠይቅ')}</span>
          <ArrowUpRight className="h-4 w-4 shrink-0" />
        </a>

        <a
          href={CONTACT.telegram}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on Telegram"
          className="border-line bg-panel2 text-ink hover:text-ember active:scale-95 grid h-11 w-11 shrink-0 place-items-center rounded-xl border text-xs font-bold"
        >
          <Send className="text-ember h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

export default function PageShell({ children }: { children: ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const [targetPath, setTargetPath] = useState('');
  const [isSlowNetwork, setIsSlowNetwork] = useState(false);

  useEffect(() => {
    let slowTimer: ReturnType<typeof setTimeout> | null = null;
    if (isNavigating) {
      // If page navigation takes longer than 600ms (due to severe network lag), fall back to telemetry recovery
      slowTimer = setTimeout(() => {
        setIsSlowNetwork(true);
      }, 600);
    } else {
      setIsSlowNetwork(false);
    }
    return () => {
      if (slowTimer) clearTimeout(slowTimer);
    };
  }, [isNavigating]);

  useEffect(() => {
    // Intercept internal link navigations for sleek progress feedback & frosted acrylic lens transition
    const handleAnchorClick = (e: MouseEvent) => {
      // Ignore modified clicks (Ctrl, Cmd, Shift, Alt, middle-click)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (!href) return;

      if (
        href.startsWith('/') &&
        !href.startsWith('//') &&
        target.getAttribute('target') !== '_blank' &&
        !target.hasAttribute('download')
      ) {
        const [navTarget] = href.split('#');
        const currentPath = window.location.pathname;

        // If clicking a link to another page (not same-page hash jump)
        if (navTarget && navTarget !== currentPath && navTarget !== `${currentPath}/` && `${navTarget}/` !== currentPath) {
          e.preventDefault();
          setTargetPath(navTarget);
          try {
            sessionStorage.setItem('yegna_page_transition', '1');
          } catch {}
          setIsNavigating(true);

          // Fast, snappy architectural column wipe transition (~220ms)
          setTimeout(() => {
            window.location.href = href;
          }, 220);
        }
      }
    };

    const handlePageShow = () => {
      setIsNavigating(false);
      setIsSlowNetwork(false);
    };

    document.addEventListener('click', handleAnchorClick);
    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('popstate', handlePageShow);
    return () => {
      document.removeEventListener('click', handleAnchorClick);
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('popstate', handlePageShow);
    };
  }, []);

  useEffect(() => {
    // If there is a hash in the URL on initial mount, scroll to it smoothly
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.substring(1);
      const target = document.getElementById(hash);
      if (target) {
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  }, []);

  return (
    <div className="bg-bg text-ink font-body min-h-screen overflow-x-hidden w-full max-w-full flex flex-col justify-between">
      {/* Animation 1: Cinematic Cold-Boot Forge Intro (First visit only, or severe network lag fallback) */}
      <BrandPreloader isSlowNetwork={isSlowNetwork} />

      {/* Animation 2: Architectural Staggered 4-Column Wipe Transition (Page redirects / navigation) */}
      <ArchitecturalTransition isNavigating={isNavigating} />

      {/* Lightweight Top Ambient Progress Beam */}
      <NavigationProgress isNavigating={isNavigating} />

      <RealisticRebarWeaveBackground />
      <ScrollProgress />
      <Nav />
      <main className="relative z-10 overflow-x-hidden w-full max-w-full min-w-0 flex-1">{children}</main>
      <Footer />
      <MobileStickyBar />
    </div>
  );
}