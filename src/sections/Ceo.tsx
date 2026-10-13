import { Quote } from 'lucide-react';
import { Reveal } from '../ui';
import { useApp } from '../context/AppContext';

export default function Ceo() {
  const { t } = useApp();

  return (
    <section className="texture-noise relative overflow-hidden py-24 sm:py-32">
      <div
        className="absolute inset-0 bg-[radial-gradient(900px_400px_at_50%_50%,rgba(245,124,0,0.06),transparent_65%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
        <Reveal>
          <div className="border-line bg-panel card-glow relative overflow-hidden rounded-3xl border p-8 sm:p-12 shadow-xl">
            <div className="grid gap-8 md:grid-cols-[200px_1fr] items-center">
              {/* CEO Portrait */}
              <div className="text-center md:text-left flex flex-col items-center">
                <div className="relative group">
                  <div className="bg-ember/20 absolute -inset-2 rounded-2xl blur-lg transition-opacity group-hover:opacity-100" />
                  <img
                    src="/images/ceo.jpg"
                    alt="Ato Zelalem Alene — General Manager of Yegna Trading PLC"
                    loading="lazy"
                    width={176}
                    height={192}
                    className="border-line relative h-48 w-44 rounded-2xl object-cover object-top border shadow-md"
                  />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="font-display text-ink text-base font-bold">
                    {t('Ato Zelalem Alene', 'አቶ ዘላለም አለነ')}
                  </h3>
                  <p className="text-ember text-xs font-semibold tracking-wider uppercase">
                    {t('General Manager & Founder', 'ዋና ሥራ አስኪያጅና መሥራች')}
                  </p>
                  <p className="text-mute text-[0.7rem]">Yegna Trading PLC</p>
                </div>
              </div>

              {/* CEO Message & Quote */}
              <div className="relative border-line md:border-l md:pl-8">
                <Quote className="text-ember/30 absolute -top-4 -left-2 h-12 w-12 md:left-6 md:-top-4" />
                <div className="relative z-10">
                  <span className="font-display text-ember text-[0.68rem] font-bold tracking-[0.28em] uppercase">
                    {t('Leadership Message', 'የሥራ አመራር መልእክት')}
                  </span>

                  <blockquote className="text-ink mt-3 text-base sm:text-lg leading-relaxed font-medium">
                    {t(
                      '“Yegna Trading has maintained an active market presence and strong reputation since its establishment in trading locally manufactured and imported reinforcement bars. We provide the highest certified quality of Grade 75 rebar along with dependable service to construction companies, real estate developers, government organizations, public enterprises, private corporations, and residential builders.”',
                      '“የኛ ትሬዲንግ ከተመሠረተበት ጊዜ ጀምሮ በአገር ውስጥ የተመረቱ እና ከውጭ የሚገቡ የኮንክሪት የብረት ቆራጮችን (ሬባር) በከፍተኛ ጥራት በማቅረብ ጠንካራ የገበያ ተቀባይነትን አትርፏል። ድርጅታችን የላቀ ጥራት ያለው Grade 75 ሬባር እንዲሁም የተሟላ አገልግሎት ለኮንስትራክሽን ድርጅቶች፣ ለሪል እስቴቶች፣ ለመንግሥትና የግል ተቋማት እንዲሁም ለግለሰቦች በታማኝነት ያቀርባል።”'
                    )}
                  </blockquote>

                  <p className="font-serif-i text-ember mt-5 text-xl font-semibold">
                    “{t('Trade with trust and integrity!', 'ንግድ በእምነትና በታማኝነት!')}”
                  </p>

                  <div className="ribbed mt-6 h-1 w-28 rounded-full opacity-60" aria-hidden />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
