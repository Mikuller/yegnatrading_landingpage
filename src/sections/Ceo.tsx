import { Quote } from 'lucide-react';
import { Reveal } from '../ui';

export default function Ceo() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div
        className="absolute inset-0 bg-[radial-gradient(900px_400px_at_50%_50%,rgba(255,90,31,0.07),transparent_65%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
        <Reveal>
          <span className="border-line bg-panel/60 glow-ember mx-auto grid h-14 w-14 place-items-center rounded-full border">
            <Quote className="text-ember h-6 w-6" />
          </span>
        </Reveal>
        <Reveal delay={0.1}>
          <blockquote className="font-serif-i mt-9 text-[clamp(1.6rem,4vw,2.6rem)] leading-snug text-balance">
            “We are committed to listening to your needs, providing reliable service, and remaining
            your dependable business partner for years to come.”
          </blockquote>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-9 flex items-center justify-center gap-4">
            <span className="font-display bg-gradient-ember text-bg grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-ember to-amber text-sm font-bold">
              TA
            </span>
            <div className="text-left">
              <p className="font-display text-sm font-bold">Temesgen Alemayehu</p>
              <p className="text-mute text-xs tracking-[0.18em] uppercase">Chief Executive Officer</p>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.28}>
          <div className="ribbed mx-auto mt-10 h-1.5 w-40 rounded-full opacity-60" aria-hidden />
        </Reveal>
      </div>
    </section>
  );
}
