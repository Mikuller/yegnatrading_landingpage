import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  HelpCircle,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Send,
  ShoppingCart,
} from 'lucide-react';
import { CONTACT } from '../data';
import { EASE, Reveal, SectionHead } from '../ui';
import type { QuotePrefill } from './RebarLab';
import { useApp } from '../context/AppContext';

type Status = 'idle' | 'sending' | 'sent';

const PRODUCTS = [
  {
    id: 'rebar',
    name: 'Steel Rebar',
    amName: 'ሬባር',
    sizes: ['Ø8mm', 'Ø10mm', 'Ø12mm', 'Ø14mm', 'Ø16mm', 'Ø20mm', 'Ø24mm', 'Ø32mm', '6mm Coil'],
  },
  { id: 'cement', name: 'Cement', amName: 'ሲሚንቶ', sizes: ['OPC (Ordinary)', 'PPC (Pozzolana)'] },
  { id: 'coil', name: 'Staffa Coil', amName: 'ስታፋ', sizes: ['6mm High Tensile'] },
  {
    id: 'plywood',
    name: 'Plywood',
    amName: 'ፕላይዉድ',
    sizes: ['Film Faced 18mm', 'Marine 12mm', 'Formwork 9mm', 'Commercial 6mm'],
  },
];

const inputCls =
  'w-full rounded-xl border border-line bg-panel2 text-ink placeholder:text-mute/60 px-4 py-3.5 text-xs sm:text-sm outline-none transition-all duration-300 focus:border-ember focus:shadow-[0_0_0_3px_rgba(245,124,0,0.12)]';

const stepNumCls =
  'font-display grid h-7 w-7 shrink-0 place-items-center rounded-full border border-ember/50 bg-ember/15 text-[0.72rem] font-bold text-ember';

function ProductGlyph({ id }: { id: string }) {
  const cls = 'h-5 w-5';
  if (id === 'rebar')
    return (
      <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <rect x="4" y="3" width="4" height="18" rx="1" />
        <rect x="13" y="3" width="4" height="18" rx="1" />
        <path d="M4 8h4M4 13h4M4 18h4M13 8h4M13 13h4M13 18h4" strokeWidth="1.2" />
      </svg>
    );
  if (id === 'cement')
    return (
      <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M6 8 L12 5 L18 8 L18 19 Q18 21 16 21 L8 21 Q6 21 6 19 Z" />
        <path d="M6 8 Q12 11 18 8" />
      </svg>
    );
  if (id === 'coil')
    return (
      <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="12" cy="12" r="1.4" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M3 16 L12 19 L21 16 L12 13 Z" />
      <path d="M3 11 L12 14 L21 11" strokeWidth="1.3" />
      <path d="M3 6 L12 9 L21 6" strokeWidth="1.3" />
    </svg>
  );
}

export default function Quote({ prefill }: { prefill: QuotePrefill | null }) {
  const { t } = useApp();
  const [status, setStatus] = useState<Status>('idle');
  const [flash, setFlash] = useState(false);

  const [productId, setProductId] = useState('rebar');
  const [sizes, setSizes] = useState<string[]>(['Ø14mm']);
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');

  const product = useMemo(() => PRODUCTS.find((p) => p.id === productId)!, [productId]);

  useEffect(() => {
    if (!prefill) return;
    setProductId('rebar');
    const size = prefill.size.replace('mm', 'mm');
    setSizes((prev) => (prev.includes(size) ? prev : [...prev, size]));
    setNote(prefill.message);
    setFlash(true);
    const tm = window.setTimeout(() => setFlash(false), 1600);
    return () => window.clearTimeout(tm);
  }, [prefill]);

  const toggleSize = (s: string) =>
    setSizes((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const switchProduct = (id: string) => {
    setProductId(id);
    setSizes([]);
  };

  const summary = [
    product.name,
    sizes.length ? sizes.join(' + ') : null,
    quantity.trim() ? `Qty: ${quantity.trim()}` : null,
    location.trim() ? `Deliver to: ${location.trim()}` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  const tgHref = 'https://t.me/yegnatrading';

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status !== 'idle') return;
    setStatus('sending');
    window.setTimeout(() => setStatus('sent'), 1200);
  };

  return (
    <section id="contact" className="texture-noise relative overflow-hidden py-24 sm:py-32">
      <span id="quote" className="absolute -top-20" />
      <div
        className="absolute inset-0 bg-[radial-gradient(900px_500px_at_50%_0%,rgba(245,124,0,0.06),transparent_60%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* Amharic Welcome Banner from Spec 4.7 */}
        <Reveal>
          <div className="border-line bg-panel2/80 mb-12 rounded-2xl border p-4 sm:p-5 text-center shadow-sm">
            <p className="font-display text-primary dark:text-amber text-sm sm:text-base font-bold">
              “እንኳን ወደ የኛ ትሬዲንግ በደኅና መጡ! የሚያስፈልግዎን የግንባታ ግብአት ይዘዙን በብቃት እናቀርባለን!”
            </p>
            <p className="text-mute mt-1 text-xs">
              {t(
                'Welcome to Yegna Trading! Order your construction materials and we will deliver with proven excellence.',
                'ለሁሉም የግንባታ ፕሮጀክትዎ ፈጣን ምላሽ እንሰጣለን።'
              )}
            </p>
          </div>
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16 items-start">
          {/* Left Column: Direct Contact Info & Crisp Help Desk (Spec 4.7) */}
          <div>
            <SectionHead
              eyebrow={t('Get Quotations Quickly', 'ፈጣን የዋጋ መጠየቂያ')}
              title={t('Any Quantity, Any Size', 'በማንኛውም መጠንና ልኬት')}
              accent={t('Delivered Anywhere!', 'ወደ የትኛውም ቦታ እናደርሳለን!')}
              sub={t(
                'Please enter your message and our supply solutions representative will contact you within 24–48 business hours with verified pricing.',
                'መልክትዎን ያስቀምጡ፤ የሽያጭ ባለሙያዎቻችን በ24–48 የሥራ ሰዓታት ውስጥ ትክክለኛውን ዋጋ ይዘው በስልክ ያነጋግሩዎታል።'
              )}
            />

            <Reveal delay={0.2}>
              <div className="mt-10 flex flex-col gap-4">
                {/* 4 Phone Lines */}
                <div className="border-line bg-panel rounded-2xl border p-5 shadow-sm">
                  <p className="font-display text-ember text-xs font-bold tracking-wider uppercase mb-3">
                    {t('Dedicated Phone Lines (Call Us Anytime)', 'የስልክ መስመሮች (በማንኛውም ጊዜ ይደውሉ)')}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {CONTACT.phones.map((p) => (
                      <a
                        key={p.number}
                        href={`tel:${p.tel}`}
                        className="border-line bg-panel2/60 hover:border-ember hover:text-ember flex items-center gap-2.5 rounded-xl border p-2.5 transition-all text-xs"
                      >
                        <Phone className="text-ember h-3.5 w-3.5 shrink-0" />
                        <div>
                          <span className="block text-[0.65rem] text-mute uppercase font-semibold">
                            {p.label}
                          </span>
                          <span className="font-mono font-bold text-ink">{p.number}</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Office Info & Hours */}
                <div className="border-line bg-panel grid gap-4 rounded-2xl border p-5 sm:grid-cols-2 shadow-sm">
                  <div className="flex items-start gap-3">
                    <Clock className="text-ember h-4 w-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-display text-xs font-bold text-ink">
                        {t('Opening Hours', 'የሥራ ሰዓት')}
                      </p>
                      <p className="text-mute text-xs mt-1 leading-relaxed">
                        Mon – Fri: 08:30 AM – 5:30 PM
                        <br />
                        Sat: 08:30 AM – 12:30 PM
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="text-ember h-4 w-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-display text-xs font-bold text-ink">
                        {t('Head Office', 'ዋናው መሥሪያ ቤት')}
                      </p>
                      <p className="text-mute text-xs mt-1 leading-relaxed">
                        Kazanchis Joburg Building 5th floor, Addis Ababa
                      </p>
                    </div>
                  </div>
                </div>

                {/* Help Desk: What customers ask us (Spec 4.7) */}
                <div className="border-line bg-panel2/80 rounded-2xl border p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-ember">
                      <HelpCircle className="h-4 w-4" />
                      <span className="font-display text-xs font-bold tracking-wider uppercase">
                        {t('Customer Help Desk', 'የደንበኞች አጋዥ ማዕከል')}
                      </span>
                    </div>
                    <span className="text-[0.68rem] text-mute">24/7 Knowledge Base</span>
                  </div>
                  <p className="text-mute mt-2 text-xs leading-relaxed">
                    {t(
                      'Have questions regarding rebar specifications, payment terms, or delivery procedures? Visit our live Help Center.',
                      'ስለ ሬባር ዝርዝር መረጃ፣ የክፍያ ሁኔታዎች ወይም የማጓጓዣ ሥርዓት ጥያቄ አለዎት? የተዘጋጀውን የእርዳታ ማዕከል ይመልከቱ።'
                    )}
                  </p>
                  <a
                    href={CONTACT.helpDeskUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="border-line bg-panel hover:bg-panel2 hover:text-ember text-ink mt-3 inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold transition-all shadow-sm"
                  >
                    <span>{t('Search Help Center (What Customers Ask Us)', 'የእርዳታ ማዕከሉን ይጎብኙ')}</span>
                    <ExternalLink className="h-3.5 w-3.5 text-ember" />
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Complete Quotation Form (Spec 7 #3) */}
          <Reveal delay={0.15}>
            <div
              className={`border-line bg-panel card-glow relative overflow-hidden rounded-3xl border shadow-xl transition-all duration-500 ${
                flash ? 'border-ember ring-2 ring-ember/40' : ''
              }`}
            >
              <div className="texture-grid absolute inset-0 opacity-30" aria-hidden />
              <div className="relative p-6 sm:p-9">
                <AnimatePresence mode="wait">
                  {status === 'sent' ? (
                    <motion.div
                      key="sent"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex min-h-[480px] flex-col items-center justify-center p-6 text-center"
                    >
                      <span className="grid h-16 w-16 place-items-center rounded-full bg-emerald-500/15 text-emerald-500 shadow-lg">
                        <CheckCircle2 className="h-9 w-9" />
                      </span>
                      <h3 className="font-display text-ink mt-6 text-2xl font-bold">
                        {t('Quotation Request Received!', 'የዋጋ መጠየቂያዎ ደርሶናል!')}
                      </h3>
                      <p className="text-mute mt-2.5 max-w-sm text-xs sm:text-sm leading-relaxed">
                        {summary ? `“${summary}”` : ''}
                        <br />
                        {t(
                          'A Yegna Trading supply representative will contact you via phone or email within 24–48 business hours with official rates.',
                          'የኛ ትሬዲንግ የሽያጭ ባለሙያ በ24–48 የሥራ ሰዓታት ውስጥ በስልክ ወይም በኢሜይል ያነጋግርዎታል።'
                        )}
                      </p>
                      <div className="mt-8 flex flex-wrap justify-center gap-3">
                        <a
                          href={tgHref}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-ember text-white rounded-xl px-5 py-2.5 text-xs font-bold shadow-md inline-flex items-center gap-2"
                        >
                          <Send className="h-3.5 w-3.5" />
                          <span>{t('Chat on Telegram Now', 'በቴሌግራም ያናግሩን')}</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => setStatus('idle')}
                          className="border-line bg-panel2 text-ink rounded-xl border px-5 py-2.5 text-xs font-semibold"
                        >
                          {t('Submit Another Request', 'ሌላ ጥያቄ ያስገቡ')}
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <form onSubmit={onSubmit} className="flex flex-col gap-5">
                      <div className="flex items-center justify-between border-b border-line pb-4">
                        <p className="font-display text-ember flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
                          <ShoppingCart className="h-4 w-4" />
                          {t('Request Price Quotation', 'የዋጋ መጠየቂያ ቅጽ')}
                        </p>
                        <span className="text-mute text-[0.7rem]">
                          {t('Fast 24h Response', 'በ24 ሰዓት ምላሽ')}
                        </span>
                      </div>

                      {/* Step 1: Product & Size */}
                      <div>
                        <p className="font-display text-ink flex items-center gap-2 text-xs sm:text-sm font-bold">
                          <span className={stepNumCls}>1</span>
                          {t('Select Material & Diameter', 'የእቃውን ዓይነትና መጠን ይምረጡ')}
                        </p>

                        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                          {PRODUCTS.map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => switchProduct(p.id)}
                              className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border p-2.5 transition-all ${
                                productId === p.id
                                  ? 'border-ember bg-ember/15 text-ember font-bold shadow-sm'
                                  : 'border-line bg-panel2/60 text-mute hover:border-ember/40 hover:text-ink'
                              }`}
                            >
                              <ProductGlyph id={p.id} />
                              <span className="text-[0.7rem]">
                                {t(p.name, p.amName)}
                              </span>
                            </button>
                          ))}
                        </div>

                        {/* Sizes */}
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {product.sizes.map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => toggleSize(s)}
                              className={`rounded-full border px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                                sizes.includes(s)
                                  ? 'border-ember bg-ember text-white shadow-sm'
                                  : 'border-line bg-panel2/60 text-mute hover:border-ember/40 hover:text-ink'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>

                        <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                          <div className="relative">
                            <Package className="text-mute pointer-events-none absolute left-3.5 top-3.5 h-4 w-4" />
                            <input
                              value={quantity}
                              onChange={(e) => setQuantity(e.target.value)}
                              placeholder={t('Quantity (e.g. 15 tons, 200 pcs)', 'ብዛት (ምሳሌ፡ 15 ቶን)')}
                              className={`${inputCls} pl-10`}
                            />
                          </div>
                          <div className="relative">
                            <MapPin className="text-mute pointer-events-none absolute left-3.5 top-3.5 h-4 w-4" />
                            <input
                              value={location}
                              onChange={(e) => setLocation(e.target.value)}
                              placeholder={t('Delivery site / city', 'የማድረሻ ቦታ (አድራሻ)')}
                              className={`${inputCls} pl-10`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Step 2: Contact Info */}
                      <div className="border-t border-line pt-4">
                        <p className="font-display text-ink flex items-center gap-2 text-xs sm:text-sm font-bold">
                          <span className={stepNumCls}>2</span>
                          {t('Your Contact Information', 'የእርስዎ አድራሻ')}
                        </p>
                        <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
                          <input
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t('Full Name *', 'ሙሉ ስም *')}
                            className={inputCls}
                          />
                          <input
                            required
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder={t('Phone Number *', 'ስልክ ቁጥር *')}
                            className={inputCls}
                          />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t('Email (optional)', 'ኢሜይል (አስፈላጊ ከሆነ)')}
                            className={inputCls}
                          />
                        </div>
                      </div>

                      {/* Step 3: Message / Note */}
                      <div className="border-t border-line pt-4">
                        <p className="font-display text-ink flex items-center gap-2 text-xs sm:text-sm font-bold">
                          <span className={stepNumCls}>3</span>
                          {t('Message or Project Note', 'ተጨማሪ መልእክት ወይም ማስታወሻ')}
                        </p>
                        <textarea
                          rows={2}
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          placeholder={t(
                            'Enter specific project requirements, timeline, delivery schedule…',
                            'የግንባታ ዝርዝር፣ የሚፈለግበት ጊዜ ወይም ልዩ ማስታወሻ…'
                          )}
                          className={`${inputCls} mt-2 resize-none`}
                        />
                      </div>

                      {/* Summary pill */}
                      <div className="border-ember/30 bg-ember/10 flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs text-ink">
                        <span className="h-1.5 w-1.5 rounded-full bg-ember shrink-0" />
                        <span className="truncate">
                          {summary || t('Select products above to build your quotation', 'ከላይ ምርቶችን ይምረጡ')}
                        </span>
                      </div>

                      <button
                        type="submit"
                        disabled={status === 'sending'}
                        className="bg-ember hover:bg-ember/90 text-white font-display flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer disabled:opacity-60"
                      >
                        {status === 'sending' ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>{t('Sending Request...', 'በመላክ ላይ...')}</span>
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            <span>{t('Send Quotation Request', 'የዋጋ መጠየቂያውን ላክ')}</span>
                          </>
                        )}
                      </button>

                      {/* Fast Social Channels */}
                      <div className="flex items-center justify-center gap-3 pt-2 text-xs text-mute">
                        <span>{t('Fast Chat:', 'ፈጣን ግንኙነት፡')}</span>
                        <a
                          href={tgHref}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-ember flex items-center gap-1 font-bold transition-colors"
                        >
                          <Send className="h-3 w-3 text-ember" />
                          <span>Telegram</span>
                        </a>
                        <span>·</span>
                        <a
                          href={`tel:${CONTACT.phoneClean}`}
                          className="hover:text-ember flex items-center gap-1 font-bold transition-colors"
                        >
                          <Phone className="h-3 w-3 text-ember" />
                          <span>Direct Phone</span>
                        </a>
                      </div>
                    </form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
