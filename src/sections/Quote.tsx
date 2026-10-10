import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  CheckCircle2,
  Clock,
  Loader2,
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

type Status = 'idle' | 'sending' | 'sent';

const PRODUCTS = [
  { id: 'rebar', name: 'Steel Rebar', sizes: ['Ø8mm', 'Ø10mm', 'Ø12mm', 'Ø14mm', 'Ø16mm', 'Ø20mm', 'Ø24mm', 'Ø32mm', '6mm Coil'] },
  { id: 'cement', name: 'Cement', sizes: ['OPC', 'PPC'] },
  { id: 'coil', name: 'Staffa Coil', sizes: ['6mm'] },
  { id: 'plywood', name: 'Plywood', sizes: ['4mm', '6mm', '9mm', '12mm', '18mm'] },
];

const inputCls =
  'w-full rounded-xl border border-line bg-white/[0.03] px-4 py-3.5 text-sm text-ink placeholder:text-mute/60 outline-none transition-all duration-300 focus:border-ember/70 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(255,90,31,0.12)]';

const stepNumCls =
  'font-display grid h-7 w-7 shrink-0 place-items-center rounded-full border border-ember/50 bg-ember/10 text-[0.72rem] font-bold text-ember';

function ProductGlyph({ id }: { id: string }) {
  const cls = 'h-6 w-6';
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
  const [status, setStatus] = useState<Status>('idle');
  const [flash, setFlash] = useState(false);

  const [productId, setProductId] = useState('rebar');
  const [sizes, setSizes] = useState<string[]>(['Ø14mm']);
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');

  const product = useMemo(() => PRODUCTS.find((p) => p.id === productId)!, [productId]);

  useEffect(() => {
    if (!prefill) return;
    setProductId('rebar');
    const size = prefill.size.replace('mm', 'mm');
    setSizes((prev) => (prev.includes(size) ? prev : [...prev, size]));
    setNote(prefill.message);
    setFlash(true);
    const t = window.setTimeout(() => setFlash(false), 1600);
    return () => window.clearTimeout(t);
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

  const waNumber = CONTACT.phone.replace(/[^\d]/g, '');
  const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Hello Yegna Trading! I'd like a price quotation.\n${summary || 'Please share your best prices.'}`,
  )}`;
  const tgHref = 'https://t.me/yegnatrading';

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status !== 'idle') return;
    setStatus('sending');
    window.setTimeout(() => setStatus('sent'), 1400);
  };

  return (
    <section id="quote" className="texture-noise relative overflow-hidden py-28 sm:py-36">
      <div
        className="absolute inset-0 bg-[radial-gradient(900px_500px_at_50%_0%,rgba(255,90,31,0.09),transparent_60%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <div>
            <SectionHead
              eyebrow="Get Quotations Quickly"
              title="Your quote in"
              accent="60 seconds."
              sub="Three quick steps — pick your steel, tell us where, leave your number. No account, no waiting on hold. A supply solutions representative calls you back within 24–48 business hours."
            />

            <Reveal delay={0.25}>
              <div className="mt-12 flex flex-col gap-5">
                <a
                  href={`tel:${CONTACT.phone.replace(/\s/g, '')}`}
                  className="group flex items-center gap-4"
                >
                  <span className="border-line group-hover:border-ember/60 group-hover:shadow-[0_0_18px_rgba(255,90,31,0.25)] grid h-11 w-11 shrink-0 place-items-center rounded-xl border transition-all duration-300">
                    <Phone className="text-ember h-4.5 w-4.5" />
                  </span>
                  <span>
                    <span className="text-mute block text-[0.65rem] font-bold tracking-[0.25em] uppercase">
                      Call us now
                    </span>
                    <span className="group-hover:text-ember font-display text-[0.95rem] font-semibold transition-colors">
                      {CONTACT.phone}
                    </span>
                  </span>
                </a>
                <div className="flex items-center gap-4">
                  <span className="border-line grid h-11 w-11 shrink-0 place-items-center rounded-xl border">
                    <Clock className="text-ember h-4.5 w-4.5" />
                  </span>
                  <span>
                    <span className="text-mute block text-[0.65rem] font-bold tracking-[0.25em] uppercase">
                      Opening Hours
                    </span>
                    <span className="block text-[0.85rem]">Mon – Fri · 8:30 AM – 5:30 PM</span>
                    <span className="block text-[0.85rem]">Sat · 8:30 AM – 12:30 PM</span>
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="border-line grid h-11 w-11 shrink-0 place-items-center rounded-xl border">
                    <MapPin className="text-ember h-4.5 w-4.5" />
                  </span>
                  <span>
                    <span className="text-mute block text-[0.65rem] font-bold tracking-[0.25em] uppercase">
                      Head Office
                    </span>
                    <span className="block text-[0.85rem]">{CONTACT.hq}</span>
                  </span>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <div
              className={`border-line bg-panel/70 relative overflow-hidden rounded-3xl border backdrop-blur-sm transition-all duration-500 ${
                flash ? 'border-ember/70 shadow-[0_0_50px_rgba(255,90,31,0.25)]' : ''
              }`}
            >
              <div className="texture-grid absolute inset-0 opacity-30" aria-hidden />
              <div className="relative">
                <AnimatePresence mode="wait">
                  {status === 'sent' ? (
                    <motion.div
                      key="sent"
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease: EASE }}
                      className="flex min-h-[560px] flex-col items-center justify-center p-8 text-center"
                    >
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.15 }}
                        className="glow-ember grid h-20 w-20 place-items-center rounded-full bg-ember/15"
                      >
                        <CheckCircle2 className="text-ember h-10 w-10" />
                      </motion.span>
                      <h3 className="font-display mt-8 text-2xl font-bold">Request received!</h3>
                      <p className="text-mute mt-3 max-w-sm text-sm leading-relaxed">
                        {summary
                          ? `We got your request — ${summary}.`
                          : 'Thank you for reaching out.'}{' '}
                        A supply solutions representative will call you within 24–48 business hours.
                      </p>
                      <div className="mt-8 flex flex-wrap justify-center gap-3">
                        <a
                          href={waHref}
                          target="_blank"
                          rel="noreferrer"
                          className="group border-line hover:border-ember/60 hover:text-ember font-display inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-all duration-300"
                        >
                          <MessageCircle className="h-4 w-4" />
                          Follow up on WhatsApp
                        </a>
                        <button
                          type="button"
                          onClick={() => setStatus('idle')}
                          className="border-line hover:border-ember/60 hover:text-ember font-display cursor-pointer rounded-full border px-5 py-2.5 text-sm font-semibold transition-all duration-300"
                        >
                          New request
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      onSubmit={onSubmit}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className="flex flex-col gap-6 p-7 sm:p-9"
                    >
                      <p className="font-display flex items-center gap-2.5 text-[0.68rem] font-bold tracking-[0.3em] text-ember uppercase">
                        <ShoppingCart className="h-4 w-4" />
                        Price Quotation Request
                      </p>

                      {/* step 1 — what */}
                      <div>
                        <p className="font-display flex items-center gap-2.5 text-[0.82rem] font-bold">
                          <span className={stepNumCls}>1</span>
                          What do you need?
                        </p>
                        <div className="mt-3.5 grid grid-cols-2 gap-2.5 sm:grid-cols-5">
                          {PRODUCTS.map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => switchProduct(p.id)}
                              className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border px-2 py-3.5 transition-all duration-300 ${
                                productId === p.id
                                  ? 'border-ember bg-ember/10 text-ember shadow-[0_0_18px_rgba(255,90,31,0.2)]'
                                  : 'border-line text-mute hover:border-ember/40 hover:text-ink'
                              }`}
                            >
                              <ProductGlyph id={p.id} />
                              <span className="font-display text-[0.68rem] font-bold tracking-wide">
                                {p.name}
                              </span>
                            </button>
                          ))}
                        </div>

                        <div className="mt-3.5 flex flex-wrap gap-2">
                          {product.sizes.map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => toggleSize(s)}
                              className={`font-display cursor-pointer rounded-full border px-3.5 py-1.5 text-[0.8rem] font-semibold transition-all duration-300 ${
                                sizes.includes(s)
                                  ? 'border-ember bg-ember text-bg shadow-[0_0_14px_rgba(255,90,31,0.35)]'
                                  : 'border-line text-mute hover:border-ember/50 hover:text-ink'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>

                        <div className="mt-3.5 grid gap-2.5 sm:grid-cols-2">
                          <div className="relative">
                            <Package className="text-mute pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
                            <input
                              value={quantity}
                              onChange={(e) => setQuantity(e.target.value)}
                              placeholder="Quantity (e.g. 20 tons, 300 bags)"
                              className={`${inputCls} pl-11`}
                            />
                          </div>
                          <div className="relative">
                            <MapPin className="text-mute pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
                            <input
                              value={location}
                              onChange={(e) => setLocation(e.target.value)}
                              placeholder="Delivery location"
                              className={`${inputCls} pl-11`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* step 2 — who */}
                      <div className="border-line border-t pt-6">
                        <p className="font-display flex items-center gap-2.5 text-[0.82rem] font-bold">
                          <span className={stepNumCls}>2</span>
                          Where do we send the price?
                        </p>
                        <div className="mt-3.5 grid gap-2.5 sm:grid-cols-2">
                          <input
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                            className={inputCls}
                          />
                          <input
                            required
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Phone number"
                            className={inputCls}
                          />
                        </div>
                      </div>

                      {/* step 3 — optional */}
                      <div className="border-line border-t pt-6">
                        <p className="font-display flex items-center gap-2.5 text-[0.82rem] font-bold">
                          <span className={stepNumCls}>3</span>
                          Anything else? <span className="text-mute text-xs font-medium">(optional)</span>
                        </p>
                        <textarea
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          rows={3}
                          placeholder="Project details, timeline, specs…"
                          className={`${inputCls} mt-3.5 resize-none`}
                        />
                      </div>

                      {/* live summary */}
                      <div className="border-ember/30 bg-ember/5 flex items-start gap-2.5 rounded-xl border px-4 py-3">
                        <span className="bg-ember mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
                        <p className="text-[0.8rem] leading-snug">
                          {summary || 'Pick products above to build your request'}
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={status === 'sending'}
                        className="group font-display relative inline-flex cursor-pointer items-center justify-center gap-2.5 overflow-hidden rounded-full bg-ember px-7 py-4 text-sm font-bold tracking-wide text-bg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_36px_rgba(255,90,31,0.5)] disabled:opacity-70"
                      >
                        {status === 'sending' ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Sending…
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                            Request My Quotation
                          </>
                        )}
                      </button>

                      <div className="border-line flex flex-wrap items-center justify-center gap-x-2 gap-y-2 border-t pt-5 text-[0.8rem]">
                        <span className="text-mute">Prefer to chat?</span>
                        <a
                          href={`tel:${CONTACT.phone.replace(/\s/g, '')}`}
                          className="hover:text-ember inline-flex items-center gap-1.5 font-semibold transition-colors"
                        >
                          <Phone className="h-3.5 w-3.5" /> Call
                        </a>
                        <span className="text-mute/40">·</span>
                        <a
                          href={tgHref}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-ember inline-flex items-center gap-1.5 font-semibold transition-colors"
                        >
                          <Send className="h-3.5 w-3.5" /> Telegram
                        </a>
                        <span className="text-mute/40">·</span>
                        <a
                          href={waHref}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-ember inline-flex items-center gap-1.5 font-semibold transition-colors"
                        >
                          <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                        </a>
                      </div>
                    </motion.form>
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
