import { useApp } from '../context/AppContext';

export default function Marquee() {
  const { t } = useApp();

  const items = [
    t('Grade 75 Rebar', 'Grade 75 ሬባር'),
    t('Portland Cement', 'ሲሚንቶ'),
    t('Staffa Steel Coil', 'ስታፋ'),
    t('Formwork Plywood', 'ፕላይዉድ'),
    t('Any Quantity', 'በማንኛውም መጠን'),
    t('Any Size', 'በማንኛውም ልኬት'),
    t('Delivered Anywhere', 'የትም ቦታ እናደርሳለን'),
    t('Kazanchis Joburg Bldg (2Q7F+J6X)', 'ካዛንቺስ ጆበርግ ሕንፃ (2Q7F+J6X)'),
  ];

  const row = [...items, ...items];

  return (
    <section aria-hidden className="relative z-10 my-0 overflow-hidden border-y border-line/40">
      <div className="w-full">
        <div className="bg-ember text-white flex overflow-hidden py-3 shadow-md">
          <div className="animate-marquee flex shrink-0 items-center">
            {row.map((item, i) => (
              <span key={i} className="font-display flex items-center text-xs sm:text-sm font-bold tracking-[0.18em] whitespace-nowrap uppercase">
                <span className="px-5">{item}</span>
                <svg viewBox="0 0 10 10" className="h-2 w-2 fill-current opacity-80">
                  <path d="M5 0 L6.2 3.8 L10 5 L6.2 6.2 L5 10 L3.8 6.2 L0 5 L3.8 3.8 Z" />
                </svg>
              </span>
            ))}
          </div>
          <div className="animate-marquee flex shrink-0 items-center">
            {row.map((item, i) => (
              <span key={i} className="font-display flex items-center text-xs sm:text-sm font-bold tracking-[0.18em] whitespace-nowrap uppercase">
                <span className="px-5">{item}</span>
                <svg viewBox="0 0 10 10" className="h-2 w-2 fill-current opacity-80">
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
