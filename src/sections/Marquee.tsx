const ITEMS = ['Steel Rebar', 'Cement', 'Staffa Coil', 'Plywood', 'Any Quantity', 'Any Size', 'Delivered Anywhere'];

export default function Marquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <section aria-hidden className="relative z-10 -my-2 overflow-hidden">
      <div className="rotate-[-1.2deg] scale-[1.02]">
        <div className="bg-ember text-bg flex overflow-hidden py-3.5 shadow-[0_0_50px_rgba(255,90,31,0.35)]">
          <div className="animate-marquee flex shrink-0 items-center">
            {row.map((item, i) => (
              <span key={i} className="font-display flex items-center text-sm font-bold tracking-[0.18em] whitespace-nowrap uppercase">
                <span className="px-6">{item}</span>
                <svg viewBox="0 0 10 10" className="h-2.5 w-2.5 fill-current">
                  <path d="M5 0 L6.2 3.8 L10 5 L6.2 6.2 L5 10 L3.8 6.2 L0 5 L3.8 3.8 Z" />
                </svg>
              </span>
            ))}
          </div>
          <div className="animate-marquee flex shrink-0 items-center">
            {row.map((item, i) => (
              <span key={i} className="font-display flex items-center text-sm font-bold tracking-[0.18em] whitespace-nowrap uppercase">
                <span className="px-6">{item}</span>
                <svg viewBox="0 0 10 10" className="h-2.5 w-2.5 fill-current">
                  <path d="M5 0 L6.2 3.8 L10 5 L6.2 6.2 L5 10 L3.8 6.2 L0 5 L3.8 3.8 Z" />
                </svg>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
