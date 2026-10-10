import { useEffect, useState } from 'react';
import { motion, useMotionValue, useScroll, useSpring } from 'motion/react';
import { ArrowUpRight, MessageCircle, Moon, Phone, Send, Sun } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { CONTACT } from './data';
import Nav from './sections/Nav';
import Hero from './sections/Hero';
import Marquee from './sections/Marquee';
import About from './sections/About';
import Products from './sections/Products';
import RebarLab, { type QuotePrefill } from './sections/RebarLab';
import Why from './sections/Why';
import Ceo from './sections/Ceo';
import Branches from './sections/Branches';
import Team from './sections/Team';
import Careers from './sections/Careers';
import Insights from './sections/Insights';
import Quote from './sections/Quote';
import Footer from './sections/Footer';

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

function RebarBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="texture-rebar absolute -inset-[340px]"
        style={{ animation: 'rebar-drift 80s linear infinite' }}
      />
      {/* Light/Dark adaptive overlays defined in style.css */}
      <div className="backdrop-overlay absolute inset-0" />
      <div className="backdrop-vignette absolute inset-0" />
      {/* traveling sheen */}
      <div className="rebar-sheen absolute inset-y-0 left-[-40%] w-[180%]" />
    </div>
  );
}

function CursorGlow() {
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const sx = useSpring(x, { stiffness: 90, damping: 22 });
  const sy = useSpring(y, { stiffness: 90, damping: 22 });

  useEffect(() => {
    const move = (e: PointerEvent) => {
      x.set(e.clientX - 250);
      y.set(e.clientY - 250);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [x, y]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed z-0 hidden h-[500px] w-[500px] rounded-full md:block"
      style={{
        x: sx,
        y: sy,
        background:
          'radial-gradient(circle, rgba(245,124,0,0.06) 0%, rgba(245,124,0,0.02) 40%, transparent 70%)',
      }}
    />
  );
}

// Mobile Sticky Action Bar (Spec Requirement 7 #2)
function MobileStickyBar() {
  const { t } = useApp();

  return (
    <div className="border-line bg-panel/95 fixed inset-x-0 bottom-0 z-40 border-t p-2.5 shadow-2xl backdrop-blur-xl md:hidden">
      <div className="mx-auto flex max-w-md items-center justify-between gap-2">
        <a
          href={`tel:${CONTACT.phoneClean}`}
          className="border-line bg-panel2 text-ink hover:text-ember flex flex-1 items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-bold transition-all shadow-sm"
        >
          <Phone className="text-ember h-3.5 w-3.5" />
          <span>{t('Call Now', 'ደውል')}</span>
        </a>

        <a
          href="#quote"
          className="bg-ember text-white hover:bg-ember/90 flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold shadow-md transition-all"
        >
          <span>{t('Get Quote', 'ዋጋ ጠይቅ')}</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>

        <a
          href="https://t.me/yegnatrading"
          target="_blank"
          rel="noreferrer"
          aria-label="Telegram"
          className="border-line bg-panel2 text-ink hover:text-ember grid h-10 w-10 shrink-0 place-items-center rounded-xl border text-xs font-bold"
        >
          <Send className="text-ember h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

function MainApp() {
  const [quotePrefill, setQuotePrefill] = useState<QuotePrefill | null>(null);

  const handleQuote = (p: QuotePrefill) => {
    setQuotePrefill(p);
    document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-bg text-ink font-body min-h-screen pb-14 md:pb-0">
      <RebarBackdrop />
      <ScrollProgress />
      <CursorGlow />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <Marquee />
        <About />
        <Products />
        <RebarLab onQuote={handleQuote} />
        <Why />
        <Ceo />
        <Branches />
        <Team />
        <Careers />
        <Insights />
        <Quote prefill={quotePrefill} />
      </main>
      <Footer />
      <MobileStickyBar />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
