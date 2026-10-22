import { useState } from 'react';
import { COMMERCIAL_SPECS, type CommercialRebarSpec } from './InteractiveRebarBundle';
import { useApp } from '../context/AppContext';
import { ArrowUpRight, ShieldCheck, Scale, Ruler, Sparkles } from 'lucide-react';
import type { QuotePrefill } from '../sections/RebarLab';

export interface MobileRebarShowcaseProps {
  onQuote?: (prefill: QuotePrefill) => void;
}

export default function MobileRebarShowcase({ onQuote }: MobileRebarShowcaseProps) {
  const { t, lang } = useApp();
  const [activeDiameter, setActiveDiameter] = useState<number>(14);

  const activeSpec: CommercialRebarSpec =
    COMMERCIAL_SPECS.find((s) => s.diameter === activeDiameter) || COMMERCIAL_SPECS[3];

  const handleRequestQuote = () => {
    if (onQuote) {
      onQuote({
        size: `${activeSpec.diameter}mm`,
        part: `Grade 75 ${activeSpec.diameter}mm Rebar`,
        message: `Quote request for ${activeSpec.diameter}mm Grade 75 deformed rebar (${activeSpec.pcsPerQuintal}).`,
        ts: Date.now(),
      });
    } else {
      const quoteEl = document.getElementById('quote');
      quoteEl?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full flex flex-col gap-3 py-1">
      {/* 1. Quick Diameter Pill Carousel / Selector */}
      <div className="flex items-center justify-between px-1">
        <span className="text-[0.7rem] uppercase tracking-wider font-bold text-mute flex items-center gap-1">
          <Ruler className="h-3 w-3 text-ember" />
          <span>{t('Select Metric Diameter', 'የብረት ዲያሜትር ይምረጡ')}</span>
        </span>
        <span className="text-[0.65rem] px-2 py-0.5 rounded-full bg-ember/15 text-ember font-bold border border-ember/30">
          Grade 75
        </span>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none select-none">
        {COMMERCIAL_SPECS.map((spec) => {
          const isSelected = spec.diameter === activeDiameter;
          return (
            <button
              key={spec.diameter}
              onClick={() => setActiveDiameter(spec.diameter)}
              type="button"
              className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-bold font-display shrink-0 transition-all ${
                isSelected
                  ? 'bg-ember text-white shadow-[0_4px_12px_rgba(245,124,0,0.4)] scale-105'
                  : 'bg-panel2 border border-line text-ink hover:border-ember/40'
              }`}
            >
              {lang === 'am' ? spec.amLabel : spec.label}
            </button>
          );
        })}
      </div>

      {/* 2. Visual Spec Card */}
      <div className="bg-panel2/90 border border-line rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
        {/* Header with Title and Yield Strength */}
        <div className="flex items-center justify-between border-b border-line/60 pb-2.5">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-display text-base font-extrabold text-ink">
                {activeSpec.diameter}mm Grade 75 {t('Deformed Bar', 'ባለቅርጽ ብረት')}
              </h4>
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-[0.72rem] text-mute mt-0.5">
              {lang === 'am' ? activeSpec.amApplication : activeSpec.application}
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[0.65rem] font-bold text-mute block uppercase">Yield (fy)</span>
            <span className="text-sm font-bold text-ember font-display">{activeSpec.fyMpa} MPa</span>
          </div>
        </div>

        {/* Rebar Cross-Section Bar Graphic */}
        <div className="relative h-14 bg-panel rounded-xl border border-line/70 flex items-center justify-center px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-amber/5 via-ember/10 to-amber/5" />
          
          {/* Simulated Rebar Rod with Ribs */}
          <div className="relative w-full flex items-center justify-between">
            <div
              className="w-full rounded-full bg-gradient-to-r from-slate-600 via-slate-400 to-slate-700 dark:from-slate-700 dark:via-slate-500 dark:to-slate-800 border border-slate-500/50 shadow-inner flex items-center justify-around px-2 relative overflow-hidden"
              style={{ height: `${Math.min(32, Math.max(12, activeSpec.diameter * 1.15))}px` }}
            >
              {/* Highlight sheen */}
              <div className="absolute inset-x-0 top-0 h-[30%] bg-white/30 rounded-t-full" />
              
              {/* Transverse ribs pattern */}
              <div className="absolute inset-0 flex justify-between items-center px-1 opacity-40">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="w-1 h-full bg-slate-900/60 dark:bg-black/60 rotate-12" />
                ))}
              </div>

              {/* Mill Mark Stamp */}
              <span className="relative z-10 text-[0.6rem] font-mono font-bold tracking-widest text-slate-900/80 dark:text-slate-200/90 select-none">
                YEGNA G75 {activeSpec.diameter}MM
              </span>
            </div>
          </div>
        </div>

        {/* Metric Badges */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-panel/70 border border-line/60 rounded-xl p-2">
            <span className="text-[0.62rem] text-mute block uppercase">{t('Unit Weight', 'ክብደት በሜትር')}</span>
            <span className="text-xs font-bold text-ink mt-0.5 block">{activeSpec.unitWeightKgM}</span>
          </div>
          <div className="bg-panel/70 border border-line/60 rounded-xl p-2">
            <span className="text-[0.62rem] text-mute block uppercase">{t('12m Bar', '12 ሜትር')}</span>
            <span className="text-xs font-bold text-ink mt-0.5 block">{activeSpec.weightPer12mKg} kg</span>
          </div>
          <div className="bg-panel/70 border border-line/60 rounded-xl p-2">
            <span className="text-[0.62rem] text-mute block uppercase">{t('Per Quintal', 'በኩንታል')}</span>
            <span className="text-xs font-bold text-ember mt-0.5 block">{activeSpec.pcsPerQuintal}</span>
          </div>
        </div>

        {/* Instant Quote CTA */}
        <button
          onClick={handleRequestQuote}
          type="button"
          className="w-full min-h-[44px] bg-ember text-white hover:bg-ember/90 active:scale-[0.98] font-display text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-ember/20 transition-all mt-1"
        >
          <span>{t(`Request Quote for ${activeSpec.diameter}mm`, `የ${activeSpec.diameter}ሚሜ ዋጋ ጠይቅ`)}</span>
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
