import { useEffect, type ReactNode } from 'react';
import BrandPreloader from './BrandPreloader';
import ArchitecturalTransition from './ArchitecturalTransition';
import { motion, useScroll, useSpring } from 'motion/react';
import { ArrowUpRight, Phone, Send } from 'lucide-react';
import { CONTACT } from '../data';
import { useApp } from '../context/AppContext';
import { useNavigation } from '../context/NavigationContext';
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
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="h-full w-full bg-gradient-to-r from-amber via-ember to-amber-300 shadow-[0_0_12px_rgba(245,124,0,0.9)]"
      />
    </div>
  );
}

function MobileStickyBar() {
  const { t } = useApp();

  return (
    <div className="border-line bg-panel/98 fixed inset-x-0 bottom-0 z-40 border-t p-2.5 pl-[max(0.625rem,env(safe-area-inset-left))] pr-[max(0.625rem,env(safe-area-inset-right))] pb-[max(0.625rem,env(safe-area-inset-bottom))] shadow-2xl backdrop-blur-xs md:hidden">
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
  const { isNavigating } = useNavigation();

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
      {/* Animation 1: Cinematic Cold-Boot Forge Intro (First cold visit only) */}
      <BrandPreloader />

      {/* Animation 2: Architectural Transition with Sculpted Logo Medallion (Instant, 0 blank screen) */}
      <ArchitecturalTransition />

      {/* Zero-CPU Blueprint Grid on Mobile, Full Interactive Weave on Desktop */}
      <RealisticRebarWeaveBackground />

      {/* Scroll Reading Depth Progress Indicator */}
      <ScrollProgress />

      {/* Ultra-Fast Top Edge Laser Beam */}
      <NavigationProgress isNavigating={isNavigating} />

      {/* Primary Navigation Bar with Mega-Dropdown */}
      <Nav />

      {/* Main Page Content Body */}
      <main className="relative z-10 overflow-x-hidden w-full max-w-full min-w-0 flex-1">
        {children}
      </main>

      {/* Full Multi-Column Footer with Amharic Badges & Map */}
      <Footer />

      {/* Mobile Sticky Quick Action Dock */}
      <MobileStickyBar />
    </div>
  );
}
