import { useEffect, type ReactNode } from 'react';
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
    <div className="bg-bg text-ink font-body min-h-screen pb-28 md:pb-0 overflow-x-hidden">
      <RealisticRebarWeaveBackground />
      <ScrollProgress />
      <Nav />
      <main className="relative z-10 overflow-x-clip">{children}</main>
      <Footer />
      <MobileStickyBar />
    </div>
  );
}
