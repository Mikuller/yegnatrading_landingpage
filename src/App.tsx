import { useEffect, useState } from 'react';
import { motion, useMotionValue, useScroll, useSpring } from 'motion/react';
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
      {/* legibility dimmer + vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(10,11,14,0.62) 0%, rgba(10,11,14,0.72) 45%, rgba(10,11,14,0.9) 100%)',
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(1100px_700px_at_50%_38%,transparent_30%,rgba(10,11,14,0.55)_100%)]" />
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
          'radial-gradient(circle, rgba(255,90,31,0.055) 0%, rgba(255,90,31,0.02) 40%, transparent 70%)',
      }}
    />
  );
}

export default function App() {
  const [quotePrefill, setQuotePrefill] = useState<QuotePrefill | null>(null);

  const handleQuote = (p: QuotePrefill) => {
    setQuotePrefill(p);
    document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-bg text-ink font-body min-h-screen">
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
        <Insights />
        <Quote prefill={quotePrefill} />
      </main>
      <Footer />
    </div>
  );
}
