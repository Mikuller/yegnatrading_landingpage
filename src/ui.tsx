import { useEffect, useRef, type ReactNode } from 'react';
import { animate, motion, useInView } from 'motion/react';

export const EASE = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 32,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHead({
  eyebrow,
  title,
  accent,
  after,
  sub,
  align = 'left',
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  after?: string;
  sub?: string;
  align?: 'left' | 'center';
}) {
  return (
    <div className={align === 'center' ? 'text-center' : ''}>
      <Reveal>
        <p className={`font-display flex items-center gap-3 text-xs font-semibold tracking-[0.3em] text-ember uppercase ${align === 'center' ? 'justify-center' : ''}`}>
          <span className={`inline-block h-px w-10 bg-ember ${align === 'center' ? 'hidden' : ''}`} />
          {eyebrow}
        </p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="font-display mt-5 text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
          {title}{' '}
          {accent ? <span className="font-serif-i text-gradient-ember pr-2">{accent}</span> : null}
          {after ? <span>{after}</span> : null}
        </h2>
      </Reveal>
      {sub ? (
        <Reveal delay={0.16}>
          <p className={`text-mute mt-6 max-w-2xl text-base leading-relaxed sm:text-lg ${align === 'center' ? 'mx-auto' : ''}`}>
            {sub}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}

export function Counter({
  value,
  suffix = '',
  className,
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const node = ref.current;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: EASE,
      onUpdate(v) {
        node.textContent = `${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, value, suffix]);

  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  );
}

export function EmberButton({
  children,
  href,
  onClick,
  variant = 'solid',
  className = '',
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'solid' | 'ghost';
  className?: string;
}) {
  const base =
    'group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-3.5 font-display text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer';
  const styles =
    variant === 'solid'
      ? 'bg-ember text-bg hover:shadow-[0_0_36px_rgba(255,90,31,0.5)] hover:-translate-y-0.5'
      : 'border border-line text-ink hover:border-ember/60 hover:text-ember hover:-translate-y-0.5';
  const inner = (
    <>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {variant === 'solid' && (
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      )}
    </>
  );
  return href ? (
    <a href={href} className={`${base} ${styles} ${className}`}>
      {inner}
    </a>
  ) : (
    <button type="button" onClick={onClick} className={`${base} ${styles} ${className}`}>
      {inner}
    </button>
  );
}
