import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, CalendarDays, ExternalLink, Tag, X } from 'lucide-react';
import { POSTS } from '../data';
import { Reveal, SectionHead } from '../ui';
import { useApp } from '../context/AppContext';

export default function Insights() {
  const { t } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activePost, setActivePost] = useState<(typeof POSTS)[number] | null>(null);

  useEffect(() => {
    if (!activePost) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActivePost(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activePost]);

  const categories = ['All', 'Rebar', 'Cement', 'Plywood', 'Offers'];

  const filteredPosts =
    activeCategory === 'All'
      ? POSTS
      : POSTS.filter((p) => p.category === activeCategory);

  return (
    <section id="insights" className="texture-noise relative overflow-hidden py-24 sm:py-32">
      <div
        className="absolute inset-0 bg-[radial-gradient(700px_400px_at_15%_80%,rgba(245,124,0,0.05),transparent_60%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead
            eyebrow={t('Industry & Product Insights', 'የዘርፉ ትንታኔዎችና መረጃዎች')}
            title={t('Construction Knowledge', 'የግንባታ እውቀትና')}
            accent={t('Poured Fresh.', 'የገበያ መረጃዎች።')}
            sub={t(
              'Technical guides, material selection advice, and industry updates to help project owners and engineers make informed decisions.',
              'ስለ ሬባር፣ ሲሚንቶና ፕላይዉድ አጠቃቀም ጠቃሚ ሙያዊ ትንታኔዎች እና የገበያ መረጃዎች።'
            )}
          />

          <a
            href="https://yegnatradinget.com/blog/"
            target="_blank"
            rel="noreferrer"
            className="border-line hover:border-ember hover:text-ember text-ink font-display inline-flex items-center gap-2 rounded-full border bg-panel px-5 py-2.5 text-xs font-bold transition-all shadow-sm"
          >
            <span>{t('View All Blog Posts (5 Pages)', 'ሁሉንም ጽሑፎች እይ')}</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Category Filters */}
        <div className="mt-10 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-ember text-white shadow-sm'
                  : 'border border-line bg-panel2/60 text-mute hover:text-ink hover:border-ember/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 6 Post Cards Grid */}
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.07}>
              <div
                role="button"
                tabIndex={0}
                aria-label={`Read article: ${p.title}`}
                onClick={() => setActivePost(p)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActivePost(p);
                  }
                }}
                className="border-line bg-panel card-glow group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border p-6 shadow-sm cursor-pointer outline-none focus:ring-2 focus:ring-ember"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="border-line bg-panel2 text-ember inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[0.68rem] font-bold tracking-wider uppercase">
                      <Tag className="h-3 w-3" />
                      {p.tag}
                    </span>
                    <ArrowUpRight className="text-mute group-hover:text-ember h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>

                  <h3 className="font-display text-ink group-hover:text-ember mt-4 text-base font-bold sm:text-lg leading-snug transition-colors line-clamp-2">
                    {p.title}
                  </h3>

                  <p className="text-mute mt-2.5 text-xs sm:text-sm leading-relaxed line-clamp-2">
                    {p.sub}
                  </p>
                </div>

                <div className="border-line mt-6 flex items-center justify-between border-t pt-4 text-xs text-mute">
                  <span className="flex items-center gap-1.5 text-[0.72rem]">
                    <CalendarDays className="h-3.5 w-3.5 text-ember" />
                    {p.date}
                  </span>
                  <span className="font-bold text-ember text-[0.72rem] group-hover:underline">
                    {t('Read More', 'ተጨማሪ አንብብ')} →
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Article Reader Modal */}
        <AnimatePresence>
          {activePost && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
              onClick={() => setActivePost(null)}
            >
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="insight-modal-title"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="border-line bg-panel relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl border p-6 shadow-2xl sm:p-8"
              >
                <div className="flex items-start justify-between">
                  <span className="bg-ember/15 text-ember rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider">
                    {activePost.tag}
                  </span>
                  <button
                    type="button"
                    onClick={() => setActivePost(null)}
                    aria-label={t('Close article modal', 'መስኮቱን ዝጋ')}
                    className="border-line text-mute hover:text-ink grid h-9 w-9 place-items-center rounded-full border cursor-pointer min-h-[36px]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <h3 id="insight-modal-title" className="font-display text-ink mt-4 text-xl font-bold sm:text-2xl">
                  {activePost.title}
                </h3>

                <p className="text-mute mt-2 flex items-center gap-2 text-xs">
                  <CalendarDays className="h-3.5 w-3.5 text-ember" />
                  {activePost.date} · Yegna Trading Insights
                </p>

                <div className="border-line my-5 border-t pt-5">
                  <p className="text-ink font-medium text-sm leading-relaxed">
                    {activePost.sub}
                  </p>
                  <p className="text-mute mt-4 text-xs sm:text-sm leading-relaxed">
                    {activePost.summary}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                  <a
                    href={activePost.href}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-ember hover:bg-ember/90 text-white font-display inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold shadow-md min-h-[44px]"
                  >
                    <span>{t('View Full Article on Live Site', 'ሙሉውን ጽሑፍ በድረ-ገጹ ላይ ይመልከቱ')}</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setActivePost(null)}
                    className="border-line text-mute hover:text-ink rounded-xl border px-4 py-2 text-xs font-semibold min-h-[44px] cursor-pointer"
                  >
                    {t('Close', 'ዝጋ')}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
