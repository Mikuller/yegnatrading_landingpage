import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Reveal, SectionHead } from '../ui';
import { useApp } from '../context/AppContext';

const FAQS = [
  {
    q: 'What rebar grades and sizes does Yegna Trading supply?',
    amQ: 'የኛ ትሬዲንግ የትኞቹን የሬባር ደረጃዎችና መጠኖች ያቀርባል?',
    a: 'Yegna Trading supplies mill-certified Grade 75 deformed steel reinforcement bars in full metric sizes from 8mm to 32mm, plus 6mm staffa (stirrup) coil for columns, beams, and ties.',
    amA: 'የኛ ትሬዲንግ ከ8ሚሜ እስከ 32ሚሜ የተረጋገጠ Grade 75 ሬባር፣ እንዲሁም ለአምዶችና ጨረሮች 6ሚሜ ስታፋ (ኮይል) ያቀርባል።',
  },
  {
    q: 'Do you provide mill test certificates with rebar deliveries?',
    amQ: 'ከሬባር አቅርቦት ጋር የፋብሪካ የጥራት ሰርተፊኬት ታቀርባላችሁ?',
    a: 'Yes. Batch mill test certifications are available so contractors and engineers can verify Grade 75 yield strength and compliance for structural pours across Ethiopia.',
    amA: 'አዎ። ተቋራጮችና መሐንዲሶች የGrade 75 ጥንካሬን ማረጋገጥ እንዲችሉ የባች ሚል ቴስት ሰርተፊኬቶች ይቀርባሉ።',
  },
  {
    q: 'Where is Yegna Trading’s head office in Addis Ababa?',
    amQ: 'የኛ ትሬዲንግ ዋና መሥሪያ ቤት በአዲስ አበባ የት ነው?',
    a: 'Our head office is at Kazanchis Joburg Plaza, 5th Floor, Addis Ababa (Plus Code 2Q7F+H7). Sales, order, and logistics desks are open Monday–Friday 08:30–17:30 and Saturday 08:30–12:30.',
    amA: 'ዋና መሥሪያ ቤታችን ካዛንቺስ ጆበርግ ፕላዛ 5ኛ ፎቅ፣ አዲስ አበባ (Plus Code 2Q7F+H7) ነው። ከሰኞ–አርብ 08:30–17:30 እና ቅዳሜ 08:30–12:30 ክፍት ነን።',
  },
  {
    q: 'How can I request a quote for rebar or cement?',
    amQ: 'ለሬባር ወይም ሲሚንቶ ዋጋ እንዴት እጠይቃለሁ?',
    a: 'Use the online quotation builder on our Contact page, call +251 943 00 00 05, or message Telegram @Yegna_Tradingplc for fast pricing and delivery scheduling.',
    amA: 'በእውቂያ ገጻችን ላይ ያለውን የዋጋ ጥያቄ ቅጽ ይሙሉ፣ ወደ +251 943 00 00 05 ይደውሉ፣ ወይም በቴሌግራም @Yegna_Tradingplc ያግኙን።',
  },
];

export default function Faq() {
  const { t } = useApp();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="relative py-24 sm:py-32"
      aria-label={t('Frequently asked questions', 'ተደጋጋሚ ጥያቄዎች')}
    >
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <SectionHead
          eyebrow={t('Common Questions', 'ተደጋጋሚ ጥያቄዎች')}
          title={t('Answers Contractors', 'ተቋራጮች የሚጠይቁዋቸው')}
          accent={t('Ask First.', 'መልሶች።')}
          sub={t(
            'Straight answers on Grade 75 stock, mill certificates, Kazanchis HQ hours, and how to get a quote.',
            'ስለ Grade 75 ክምችት፣ የፋብሪካ ሰርተፊኬት፣ የቢሮ ሰዓት እና የዋጋ ጥያቄ አጭር መልሶች።'
          )}
        />

        <div className="mt-10 space-y-3">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} delay={i * 0.05}>
                <div className="border-line bg-panel/80 rounded-2xl border shadow-sm">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-button-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="text-ink flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-bold sm:text-base"
                  >
                    <span>{t(item.q, item.amQ)}</span>
                    <ChevronDown
                      className={`text-ember h-4 w-4 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      aria-hidden
                    />
                  </button>
                  <div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-button-${i}`}
                    hidden={!isOpen}
                    className="border-line text-mute border-t px-5 py-4 text-sm leading-relaxed"
                  >
                    {t(item.a, item.amA)}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
