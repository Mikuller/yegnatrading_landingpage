import { ArrowUpRight, CalendarDays } from 'lucide-react';
import { POSTS } from '../data';
import { Reveal, SectionHead } from '../ui';

export default function Insights() {
  return (
    <section id="insights" className="relative overflow-hidden py-28 sm:py-36">
      <div
        className="absolute inset-0 bg-[radial-gradient(700px_400px_at_15%_80%,rgba(255,90,31,0.05),transparent_60%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead
            eyebrow="Industry Insights"
            title="Knowledge poured"
            accent="fresh."
          />
          <Reveal delay={0.2}>
            <a
              href="https://yegnatradinget.com/blog/"
              target="_blank"
              rel="noreferrer"
              className="group border-line hover:border-ember/60 hover:text-ember font-display inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-all duration-300"
            >
              View all articles
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {POSTS.map((p, i) => (
            <Reveal key={p.href} delay={i * 0.09}>
              <a
                href={p.href}
                target="_blank"
                rel="noreferrer"
                className="border-line bg-panel/60 card-glow group relative flex h-full flex-col overflow-hidden rounded-2xl border p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="border-ember/30 text-ember rounded-full border px-3 py-1 text-[0.62rem] font-bold tracking-[0.2em] uppercase">
                    {p.tag}
                  </span>
                  <ArrowUpRight className="text-mute group-hover:text-ember h-5 w-5 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <h3 className="font-display group-hover:text-ember relative mt-7 text-xl leading-snug font-bold transition-colors duration-300">
                  {p.title}
                </h3>
                <p className="text-mute relative mt-3 flex-1 text-sm leading-relaxed">{p.sub}</p>
                <p className="text-mute relative mt-6 flex items-center gap-2 text-xs">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {p.date}
                </p>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
