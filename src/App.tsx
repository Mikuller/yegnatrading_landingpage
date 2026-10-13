import { useState } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { ArrowUpRight, Phone, Send } from 'lucide-react';
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
import RealisticRebarWeaveBackground from './components/RealisticRebarWeaveBackground';

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
  return <RealisticRebarWeaveBackground />;
}

// Mobile Sticky Action Bar (Spec Requirement 7 #2)
function MobileStickyBar() {
  const { t } = useApp();

  return (
    <div className="border-line bg-panel/95 fixed inset-x-0 bottom-0 z-40 border-t p-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] shadow-2xl backdrop-blur-xl md:hidden">
      <div className="mx-auto flex max-w-md items-center justify-between gap-2.5">
        <a
          href={`tel:${CONTACT.phoneClean}`}
          className="border-line bg-panel2 text-ink hover:text-ember flex flex-1 min-h-[44px] items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-bold transition-all shadow-sm"
        >
          <Phone className="text-ember h-4 w-4 shrink-0" />
          <span>{t('Call Now', 'ደውል')}</span>
        </a>

        <a
          href="#quote"
          className="bg-ember text-white hover:bg-ember/90 flex flex-1 min-h-[44px] items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold shadow-md transition-all"
        >
          <span>{t('Get Quote', 'ዋጋ ጠይቅ')}</span>
          <ArrowUpRight className="h-4 w-4 shrink-0" />
        </a>

        <a
          href="https://t.me/yegnatrading"
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on Telegram"
          className="border-line bg-panel2 text-ink hover:text-ember grid h-11 w-11 shrink-0 place-items-center rounded-xl border text-xs font-bold"
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
    <div className="bg-bg text-ink font-body min-h-screen pb-24 md:pb-0">
      <RebarBackdrop />
      <ScrollProgress />
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
