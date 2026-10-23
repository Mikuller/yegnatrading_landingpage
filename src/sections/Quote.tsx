import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowDown,
  ArrowUpRight,
  Building,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  HelpCircle,
  Layers,
  Loader2,
  MapPin,
  Minus,
  Package,
  Phone,
  Plus,
  RotateCcw,
  Send,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { CONTACT, REBAR_CONVERSION_TABLE } from '../data';
import { EASE, Reveal, SectionHead } from '../ui';
import type { QuotePrefill, StructuralQuoteItem } from './RebarLab';
import { useApp } from '../context/AppContext';

type Status = 'idle' | 'sending' | 'sent';

export type QuoteUnit = 'Quintals' | 'Tons' | 'Pcs' | 'Bags' | 'Sheets';

export interface ItemQuantityRow {
  id: string;
  partId?: string;
  partLabel?: string;
  amPartLabel?: string;
  size: string;
  qty: number;
  unit: QuoteUnit;
  isFromLab?: boolean;
  weightPer12mKg?: number | string;
  pcsPerQuintal?: string;
}

const PRODUCTS = [
  {
    id: 'rebar',
    name: 'Steel Rebar',
    amName: 'ሬባር',
    sizes: ['06mm Coil', '08mm', '10mm', '12mm', '14mm', '16mm', '20mm', '24mm', '32mm'],
    defaultUnit: 'Quintals' as QuoteUnit,
  },
  {
    id: 'cement',
    name: 'Cement',
    amName: 'ሲሚንቶ',
    sizes: ['OPC (Ordinary)', 'PPC (Pozzolana)'],
    defaultUnit: 'Bags' as QuoteUnit,
  },
  {
    id: 'coil',
    name: 'Staffa Coil',
    amName: 'ስታፋ',
    sizes: ['06mm High Tensile'],
    defaultUnit: 'Quintals' as QuoteUnit,
  },
  {
    id: 'plywood',
    name: 'Plywood',
    amName: 'ፕላይዉድ',
    sizes: ['Film Faced 18mm', 'Marine 12mm', 'Formwork 9mm', 'Commercial 6mm'],
    defaultUnit: 'Sheets' as QuoteUnit,
  },
];

const inputCls =
  'w-full min-w-0 rounded-xl border border-line bg-panel2 text-ink placeholder:text-mute/60 px-4 py-3 text-base sm:text-sm outline-none transition-all duration-300 focus:border-ember focus:shadow-[0_0_0_3px_rgba(245,124,0,0.12)]';

const stepNumCls =
  'font-display grid h-6 w-6 sm:h-7 sm:w-7 shrink-0 place-items-center rounded-full border border-ember/50 bg-ember/15 text-[0.7rem] sm:text-[0.72rem] font-bold text-ember';

function ProductGlyph({ id }: { id: string }) {
  const cls = 'h-5 w-5 shrink-0';
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

function normalizeSize(s: string): string {
  const clean = s.trim().replace('Ø', '').trim();
  if (clean === '6mm' || clean === '6mm Coil' || clean === '06mm') return '06mm Coil';
  if (clean === '8mm') return '08mm';
  if (clean === '10mm') return '10mm';
  if (clean === '12mm') return '12mm';
  if (clean === '14mm') return '14mm';
  if (clean === '16mm') return '16mm';
  if (clean === '20mm') return '20mm';
  if (clean === '24mm') return '24mm';
  if (clean === '32mm') return '32mm';
  return clean;
}

function getRebarSpec(size: string) {
  const norm = normalizeSize(size);
  return REBAR_CONVERSION_TABLE.find(
    (s) => s.diameter === norm || s.diameter === norm.replace(/^0/, '') || (norm.includes('6mm') && s.mm === 6)
  );
}

export default function Quote({ prefill = null }: { prefill?: QuotePrefill | null }) {
  const { t } = useApp();
  const [status, setStatus] = useState<Status>('idle');
  const [flash, setFlash] = useState(false);

  const [productId, setProductId] = useState('rebar');
  const [sizes, setSizes] = useState<string[]>(['14mm']);
  const [hasLabSchedule, setHasLabSchedule] = useState(false);
  const [labIntegrityScore, setLabIntegrityScore] = useState<number | null>(null);

  // Itemized quantity rows per rebar diameter or structural component
  const [itemRows, setItemRows] = useState<ItemQuantityRow[]>([
    {
      id: 'default-14mm',
      size: '14mm',
      qty: 25,
      unit: 'Quintals',
      isFromLab: false,
    },
  ]);

  const [location, setLocation] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');

  const product = useMemo(() => PRODUCTS.find((p) => p.id === productId)!, [productId]);

  // Synchronize with incoming prefill data from the Interactive Structural Lab
  useEffect(() => {
    if (!prefill) return;
    setProductId('rebar');
    setFlash(true);
    const tm = window.setTimeout(() => setFlash(false), 1600);

    if (prefill.items && prefill.items.length > 0) {
      setHasLabSchedule(true);
      setLabIntegrityScore(prefill.integrityScore ?? 98);

      const rows: ItemQuantityRow[] = prefill.items.map((it, idx) => {
        const norm = normalizeSize(it.size);
        const spec = getRebarSpec(norm);
        return {
          id: `${it.partId || 'part'}-${norm}-${idx}`,
          partId: it.partId,
          partLabel: it.partLabel,
          amPartLabel: it.amPartLabel,
          size: norm,
          qty: it.defaultQty || 25,
          unit: it.unit || 'Quintals',
          isFromLab: true,
          weightPer12mKg: it.weightPer12mKg || spec?.weightPer12mKg,
          pcsPerQuintal: it.pcsPerQuintal || spec?.pcsPerQuintal,
        };
      });

      setItemRows(rows);
      const uniqueSizes = Array.from(new Set(rows.map((r) => r.size)));
      setSizes(uniqueSizes);
      setNote(prefill.message);
    } else {
      setHasLabSchedule(false);
      const norm = normalizeSize(prefill.size);
      const spec = getRebarSpec(norm);
      setSizes([norm]);
      setItemRows([
        {
          id: `single-${norm}`,
          partLabel: prefill.part,
          size: norm,
          qty: 25,
          unit: 'Quintals',
          isFromLab: false,
          weightPer12mKg: spec?.weightPer12mKg,
          pcsPerQuintal: spec?.pcsPerQuintal,
        },
      ]);
      setNote(prefill.message);
    }

    return () => window.clearTimeout(tm);
  }, [prefill]);

  // Update quantity of an individual item row
  const updateRowQty = (id: string, newQty: number) => {
    setItemRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, qty: Math.max(1, newQty) } : row))
    );
  };

  // Update unit of an individual item row
  const updateRowUnit = (id: string, newUnit: QuoteUnit) => {
    setItemRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, unit: newUnit } : row))
    );
  };

  // Remove a row
  const removeRow = (id: string) => {
    setItemRows((prev) => {
      const filtered = prev.filter((r) => r.id !== id);
      const remainingSizes = Array.from(new Set(filtered.map((r) => r.size)));
      setSizes(remainingSizes);
      if (filtered.length === 0) setHasLabSchedule(false);
      return filtered;
    });
  };

  // Toggle rebar size directly from the catalog chips
  const toggleSize = (s: string) => {
    const norm = normalizeSize(s);
    setSizes((prev) => {
      const exists = prev.includes(norm);
      const nextSizes = exists ? prev.filter((x) => x !== norm) : [...prev, norm];

      setItemRows((prevRows) => {
        if (exists) {
          return prevRows.filter((r) => r.size !== norm);
        } else {
          const spec = getRebarSpec(norm);
          const defaultQty = norm === '06mm Coil' ? 10 : 25;
          const newRow: ItemQuantityRow = {
            id: `manual-${norm}-${Date.now()}`,
            size: norm,
            qty: defaultQty,
            unit: product.defaultUnit,
            isFromLab: false,
            weightPer12mKg: spec?.weightPer12mKg,
            pcsPerQuintal: spec?.pcsPerQuintal,
          };
          return [...prevRows, newRow];
        }
      });

      return nextSizes;
    });
  };

  // Switch between Rebar, Cement, Coil, Plywood
  const switchProduct = (id: string) => {
    setProductId(id);
    setHasLabSchedule(false);
    const prod = PRODUCTS.find((p) => p.id === id)!;
    const initialSize = prod.sizes[0];
    setSizes([initialSize]);

    const defaultQty = id === 'cement' ? 100 : id === 'plywood' ? 50 : 25;
    setItemRows([
      {
        id: `prod-${id}-${initialSize}`,
        size: initialSize,
        qty: defaultQty,
        unit: prod.defaultUnit,
        isFromLab: false,
      },
    ]);
  };

  // Apply standard Ethiopian Villa Presets
  const applyVillaPreset = (type: 'g1' | 'g2') => {
    setProductId('rebar');
    setHasLabSchedule(true);
    if (type === 'g1') {
      const g1Items: ItemQuantityRow[] = [
        { id: 'p-footing', partLabel: 'Footing & Foundation Pads', size: '16mm', qty: 25, unit: 'Quintals', isFromLab: true },
        { id: 'p-columns', partLabel: 'Structural Columns (Main)', size: '20mm', qty: 35, unit: 'Quintals', isFromLab: true },
        { id: 'p-stirrup', partLabel: 'Column Ties & Rings (Staffa)', size: '06mm Coil', qty: 10, unit: 'Quintals', isFromLab: true },
        { id: 'p-beams', partLabel: 'Beams & Lintels', size: '16mm', qty: 25, unit: 'Quintals', isFromLab: true },
        { id: 'p-slab', partLabel: 'Floor & Roof Slabs', size: '10mm', qty: 30, unit: 'Quintals', isFromLab: true },
        { id: 'p-stairs', partLabel: 'Staircase Flights', size: '12mm', qty: 10, unit: 'Quintals', isFromLab: true },
      ];
      setItemRows(g1Items);
      setSizes(Array.from(new Set(g1Items.map((r) => r.size))));
    } else {
      const g2Items: ItemQuantityRow[] = [
        { id: 'p-footing', partLabel: 'Heavy Raft & Footing Pads', size: '20mm', qty: 45, unit: 'Quintals', isFromLab: true },
        { id: 'p-columns', partLabel: 'Heavy Multi-Storey Columns', size: '24mm', qty: 65, unit: 'Quintals', isFromLab: true },
        { id: 'p-stirrup', partLabel: 'Column Stirrup Ties (Staffa)', size: '06mm Coil', qty: 20, unit: 'Quintals', isFromLab: true },
        { id: 'p-beams', partLabel: 'Transfer & Floor Beams', size: '20mm', qty: 45, unit: 'Quintals', isFromLab: true },
        { id: 'p-slab', partLabel: 'Suspended Floor Slabs', size: '12mm', qty: 50, unit: 'Quintals', isFromLab: true },
        { id: 'p-stairs', partLabel: 'Heavy Traffic Stairs', size: '14mm', qty: 15, unit: 'Quintals', isFromLab: true },
      ];
      setItemRows(g2Items);
      setSizes(Array.from(new Set(g2Items.map((r) => r.size))));
    }
  };

  // Compute total estimated weight in Quintals and Metric Tons
  const totals = useMemo(() => {
    let totalQuintals = 0;
    let totalPcsEstimate = 0;

    itemRows.forEach((row) => {
      const spec = getRebarSpec(row.size);
      if (row.unit === 'Quintals') {
        totalQuintals += row.qty;
        if (spec && typeof spec.weightPer12mKg === 'number') {
          totalPcsEstimate += Math.round((row.qty * 100) / spec.weightPer12mKg);
        }
      } else if (row.unit === 'Tons') {
        totalQuintals += row.qty * 10;
        if (spec && typeof spec.weightPer12mKg === 'number') {
          totalPcsEstimate += Math.round((row.qty * 1000) / spec.weightPer12mKg);
        }
      } else if (row.unit === 'Pcs') {
        totalPcsEstimate += row.qty;
        if (spec && typeof spec.weightPer12mKg === 'number') {
          totalQuintals += (row.qty * spec.weightPer12mKg) / 100;
        }
      } else {
        totalQuintals += row.qty;
      }
    });

    return {
      quintals: Math.round(totalQuintals * 10) / 10,
      tons: Math.round((totalQuintals / 10) * 10) / 10,
      pcs: totalPcsEstimate,
    };
  }, [itemRows]);

  // Format concise summary text
  const summary = useMemo(() => {
    if (itemRows.length === 0) return null;
    const itemsText = itemRows
      .map((r) => `${r.partLabel ? `${r.partLabel} (${r.size})` : r.size}: ${r.qty} ${r.unit}`)
      .join(' · ');
    return `${product.name} [${itemsText}]${location ? ` · Deliver to: ${location}` : ''}`;
  }, [itemRows, product.name, location]);

  // Construct itemized message for Telegram
  const tgMessage = useMemo(() => {
    const list = itemRows
      .map((r) => `• ${r.partLabel ? `${r.partLabel} [${r.size}]` : r.size}: ${r.qty} ${r.unit}`)
      .join('\n');

    return (
      `Hello Yegna Trading — I would like an official price quotation:\n\n` +
      `Product: ${product.name}\n` +
      `Schedule / Items:\n${list}\n\n` +
      `Total Weight: ~${totals.quintals} Quintals (${totals.tons} Metric Tons)\n` +
      (location ? `Delivery Site: ${location}\n` : '') +
      (name ? `Contact Person: ${name}\n` : '') +
      (phone ? `Phone: ${phone}\n` : '') +
      (note ? `Additional Notes: ${note}\n` : '')
    );
  }, [itemRows, product.name, totals, location, name, phone, note]);

  const tgHref = `${CONTACT.telegram}?text=${encodeURIComponent(tgMessage)}`;

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
        {/* Welcome Banner */}
        <Reveal>
          <div className="border-line bg-panel2 mb-12 rounded-2xl border p-4 sm:p-5 text-center shadow-sm">
            <p className="font-display text-primary dark:text-amber text-sm sm:text-base font-bold">
              “እንኳን ወደ የኛ ትሬዲንግ በደኅና መጡ! የሚያስፈልግዎን የግንባታ ግብአት ይዘዙን በብቃት እናቀርባለን!”
            </p>
            <p className="text-mute mt-1 text-xs">
              {t(
                'Welcome to Yegna Trading! Order certified Grade 75 rebars and construction essentials with guaranteed rapid delivery.',
                'ለሁሉም የግንባታ ፕሮጀክትዎ ፈጣን ምላሽ እንሰጣለን።'
              )}
            </p>
          </div>
        </Reveal>

        {/* Rock-solid Two Column Grid with explicit column containment */}
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12 items-start w-full max-w-full">
          {/* Left Column: Direct Contact Info & Crisp Help Desk (5 cols on lg) */}
          <div className="lg:col-span-5 w-full min-w-0 flex flex-col">
            <SectionHead
              eyebrow={t('Get Quotations Quickly', 'ፈጣን የዋጋ መጠየቂያ')}
              title={t('Any Quantity, Any Size', 'በማንኛውም መጠንና ልኬት')}
              accent={t('Delivered Anywhere!', 'ወደ የትኛውም ቦታ እናደርሳለን!')}
              sub={t(
                'Submit your bill of quantities below. Each diameter is priced according to your specific quantity in quintals, tons, or 12m bars. Our sales desk responds within 1–2 hours during business hours.',
                'የግንባታ ፍላጎትዎን ከታች ያስገቡ፤ ለእያንዳንዱ የብረት መጠን ትክክለኛውን ዋጋ እና የማጓጓዣ መርሃ-ግብር ይዘን በሥራ ሰዓት ከ1–2 ሰዓታት ውስጥ ፈጣን ምላሽ እንሰጣለን።'
              )}
            />

            <Reveal delay={0.2} className="w-full min-w-0">
              <div className="mt-8 flex flex-col gap-4 w-full min-w-0">
                {/* Dedicated Phone Lines */}
                <div className="border-line bg-panel rounded-2xl border p-5 shadow-sm w-full min-w-0">
                  <p className="font-display text-ember text-xs font-bold tracking-wider uppercase mb-3">
                    {t('Dedicated Phone Lines (Call Us Anytime)', 'የስልክ መስመሮች (በማንኛውም ጊዜ ይደውሉ)')}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full min-w-0">
                    {CONTACT.phones.map((p) => (
                      <a
                        key={p.number}
                        href={`tel:${p.tel}`}
                        className="group border-line bg-panel2/70 hover:border-ember hover:bg-panel2 flex items-center gap-3 rounded-xl border p-3 transition-all duration-200 shadow-2xs hover:shadow-xs hover:-translate-y-0.5 min-w-0"
                      >
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-ember/15 text-ember group-hover:bg-ember group-hover:text-white transition-colors shadow-2xs">
                          <Phone className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1 truncate">
                          <span className="block text-[0.65rem] text-mute uppercase font-semibold group-hover:text-ember transition-colors truncate">
                            {p.label}
                          </span>
                          <span className="font-mono font-bold text-ink text-xs sm:text-sm truncate block">{p.number}</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Office Info & Hours */}
                <div className="border-line bg-panel grid gap-4 rounded-2xl border p-5 sm:grid-cols-2 shadow-sm w-full min-w-0">
                  <div className="flex items-start gap-3 min-w-0">
                    <Clock className="text-ember h-4 w-4 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="font-display text-xs font-bold text-ink truncate">
                        {t('Opening Hours', 'የሥራ ሰዓት')}
                      </p>
                      <p className="text-mute text-xs mt-1 leading-relaxed">
                        Mon – Fri: 08:30 AM – 5:30 PM
                        <br />
                        Sat: 08:30 AM – 12:30 PM
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 min-w-0">
                    <MapPin className="text-ember h-4 w-4 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="font-display text-xs font-bold text-ink truncate">
                        {t('Head Office', 'ዋናው መሥሪያ ቤት')}
                      </p>
                      <p className="text-mute text-xs mt-1 leading-relaxed">
                        Kazanchis Joburg Plaza 5th floor, Addis Ababa
                      </p>
                      <a
                        href="#branches"
                        className="text-ember hover:text-ember/80 font-semibold text-xs mt-2 inline-flex items-center gap-1 transition-colors"
                      >
                        <span>{t('View Office Blueprint & Map', 'ካርታና መገኛ ይመልከቱ')}</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Help Desk */}
                <div className="border-line bg-panel2 rounded-2xl border p-5 shadow-sm w-full min-w-0">
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
                    <span>{t('Search Help Center', 'የእርዳታ ማዕከሉን ይጎብኙ')}</span>
                    <ExternalLink className="h-3.5 w-3.5 text-ember" />
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Complete Quotation Form with Itemized Lab Sync (7 cols on lg) */}
          <div className="lg:col-span-7 w-full min-w-0 max-w-full">
            <Reveal delay={0.15} className="w-full min-w-0 max-w-full">
              <div
                className={`border-line bg-panel card-glow relative w-full max-w-full min-w-0 overflow-hidden rounded-3xl border shadow-xl transition-all duration-500 ${
                  flash ? 'border-ember ring-2 ring-ember/40' : ''
                }`}
              >
                <div className="texture-grid absolute inset-0 opacity-30 pointer-events-none" aria-hidden />
                <div className="relative p-5 sm:p-7 w-full min-w-0">
                  <AnimatePresence mode="wait">
                    {status === 'sent' ? (
                      <motion.div
                        key="sent"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex min-h-[440px] flex-col items-center justify-center p-6 text-center"
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
                            'A Yegna Trading supply representative will contact you via phone or email within 1–2 hours with official mill rates and truck dispatch options.',
                            'የኛ ትሬዲንግ የሽያጭ ባለሙያ በሥራ ሰዓት ከ1–2 ሰዓታት ውስጥ በስልክ ወይም በኢሜይል ፈጣን ምላሽ ይሰጥዎታል።'
                          )}
                        </p>
                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                          <a
                            href={tgHref}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-ember text-white rounded-xl px-5 py-2.5 text-xs font-bold shadow-md inline-flex items-center gap-2 min-h-[44px]"
                          >
                            <Send className="h-3.5 w-3.5" />
                            <span>{t('Chat on Telegram Now', 'በቴሌግራም ያናግሩን')}</span>
                          </a>
                          <button
                            type="button"
                            onClick={() => setStatus('idle')}
                            className="border-line bg-panel2 text-ink rounded-xl border px-5 py-2.5 text-xs font-semibold min-h-[44px] cursor-pointer"
                          >
                            {t('Submit Another Request', 'ሌላ ጥያቄ ያስገቡ')}
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <form onSubmit={onSubmit} className="flex flex-col gap-5 w-full min-w-0">
                        {/* Header bar */}
                        <div className="flex items-center justify-between border-b border-line pb-3.5">
                          <p className="font-display text-ember flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
                            <ShoppingCart className="h-4 w-4" />
                            {t('Request Price Quotation', 'የዋጋ መጠየቂያ ቅጽ')}
                          </p>
                          <span className="text-mute text-[0.7rem] font-medium">
                            {t('Fast 1–2h Response', 'ፈጣን የ1-2 ሰዓት ምላሽ')}
                          </span>
                        </div>

                        {/* Step 1: Product Selection & Diameters */}
                        <div className="w-full min-w-0">
                          <div className="font-display text-ink flex items-center gap-2 text-xs sm:text-sm font-bold">
                            <span className={stepNumCls}>1</span>
                            <span>{t('Material Category & Diameters', 'የእቃውን ዓይነትና የሚፈለጉ መጠኖች')}</span>
                          </div>

                          {/* Product Type Buttons - 4 equal grid columns, strictly contained */}
                          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 w-full min-w-0" role="radiogroup" aria-label="Product categories">
                            {PRODUCTS.map((p) => (
                              <button
                                key={p.id}
                                type="button"
                                role="radio"
                                aria-checked={productId === p.id}
                                aria-label={t(p.name, p.amName)}
                                onClick={() => switchProduct(p.id)}
                                className={`flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border p-2 transition-all min-h-[58px] min-w-0 truncate ${
                                  productId === p.id
                                    ? 'border-ember bg-ember/15 text-ember font-bold shadow-sm ring-1 ring-ember/30'
                                    : 'border-line bg-panel2/60 text-mute hover:border-ember/40 hover:text-ink'
                                }`}
                              >
                                <ProductGlyph id={p.id} />
                                <span className="text-[0.7rem] truncate max-w-full text-center font-medium">
                                  {t(p.name, p.amName)}
                                </span>
                              </button>
                            ))}
                          </div>

                          {/* Available Sizes Picker */}
                          <div className="mt-3 flex flex-wrap items-center gap-1.5 w-full min-w-0">
                            <span className="text-[11px] text-mute mr-1 shrink-0">{t('Sizes:', 'መጠኖች፡')}</span>
                            {product.sizes.map((s) => {
                              const isSelected = sizes.includes(s);
                              return (
                                <button
                                  key={s}
                                  type="button"
                                  onClick={() => toggleSize(s)}
                                  className={`rounded-full border px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                                    isSelected
                                      ? 'border-ember bg-ember text-white shadow-sm'
                                      : 'border-line bg-panel2/60 text-mute hover:border-ember/40 hover:text-ink'
                                  }`}
                                >
                                  {s}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Step 2: Itemized Quantities (Directly Aligned with Structural Lab) */}
                        <div className="border-t border-line pt-4 w-full min-w-0">
                          {/* Step 2 Header & Quick Presets */}
                          <div className="flex flex-wrap items-center justify-between gap-2 w-full min-w-0">
                            <div className="font-display text-ink flex items-center gap-2 text-xs sm:text-sm font-bold">
                              <span className={stepNumCls}>2</span>
                              <span>{t('Quantities Per Selected Item *', 'ለእያንዳንዱ ክፍል የሚፈለግ መጠን *')}</span>
                            </div>

                            {productId === 'rebar' && (
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[10px] text-mute">{t('Preset:', 'ግምት፡')}</span>
                                <button
                                  type="button"
                                  onClick={() => applyVillaPreset('g1')}
                                  className="border-line bg-panel hover:border-ember text-ink text-[10px] font-semibold rounded-lg border px-2.5 py-1 transition-all cursor-pointer shadow-2xs"
                                >
                                  {t('G+1 Villa (~135 Qtl)', 'G+1 ቪላ (~135 ኩ)')}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => applyVillaPreset('g2')}
                                  className="border-line bg-panel hover:border-ember text-ink text-[10px] font-semibold rounded-lg border px-2.5 py-1 transition-all cursor-pointer shadow-2xs"
                                >
                                  {t('G+2 Frame (~240 Qtl)', 'G+2 ህንጻ (~240 ኩ)')}
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Notice Banner if imported from Interactive Structural Lab */}
                          {hasLabSchedule && (
                            <div className="border-ember/30 bg-ember/10 mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border p-2.5 sm:p-3 text-xs w-full min-w-0">
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <Building className="text-ember h-4 w-4 shrink-0" />
                                <div className="min-w-0">
                                  <span className="font-bold text-ink truncate block">
                                    {t('Imported Structural Schedule from Lab', 'ከሬባር ላብራቶሪ በቀጥታ የመጣ ዝርዝር')}
                                  </span>
                                  {labIntegrityScore && (
                                    <span className="text-mute text-[10px]">
                                      {t(`Integrity Score: ${labIntegrityScore}% · Grade 75 Certified`, `የጥራት ደረጃ፡ ${labIntegrityScore}% · ግሬድ 75`)}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <a
                                href="#structural-lab"
                                className="text-ember hover:underline text-[11px] font-bold shrink-0 inline-flex items-center gap-1"
                              >
                                <span>{t('Review in Lab ↑', 'ላብራቶሪውን እይ ↑')}</span>
                              </a>
                            </div>
                          )}

                          {/* Itemized Rows Container - Compact, Contained, Self-Aligning */}
                          <div className="mt-3 flex flex-col gap-2 w-full min-w-0">
                            {itemRows.length === 0 ? (
                              <div className="border-line bg-panel2/50 rounded-xl border p-4 text-center text-xs text-mute w-full">
                                {t(
                                  'No items selected. Choose rebar diameters above or configure in the Structural Lab.',
                                  'ምንም የተመረጠ መጠን የለም። ከላይ ያሉትን መጠኖች ይምረጡ ወይም ከላብራቶሪው ይገንቡ።'
                                )}
                              </div>
                            ) : (
                              itemRows.map((row) => {
                                const spec = getRebarSpec(row.size);
                                let piecesEstimate: number | null = null;
                                if (row.unit === 'Quintals' && spec && typeof spec.weightPer12mKg === 'number') {
                                  piecesEstimate = Math.round((row.qty * 100) / spec.weightPer12mKg);
                                } else if (row.unit === 'Tons' && spec && typeof spec.weightPer12mKg === 'number') {
                                  piecesEstimate = Math.round((row.qty * 1000) / spec.weightPer12mKg);
                                }

                                return (
                                  <div
                                    key={row.id}
                                    className="border-line bg-panel2/70 hover:border-ember/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border p-2.5 sm:p-3 text-xs transition-all w-full min-w-0"
                                  >
                                    {/* Left: Size badge + Part name + Weight info */}
                                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                      <span className="font-mono rounded-lg bg-ember/15 px-2 py-1 text-xs font-bold text-ember shrink-0">
                                        {row.size}
                                      </span>
                                      <div className="min-w-0 flex-1">
                                        <p className="font-display text-ink font-bold truncate">
                                          {row.partLabel || `${row.size} Material`}
                                        </p>
                                        {spec && (
                                          <p className="text-[10px] text-mute block truncate">
                                            {spec.unitWeightKgM} • {spec.pcsPerQuintal}
                                          </p>
                                        )}
                                      </div>
                                    </div>

                                    {/* Right: Stepper Input + Unit Selector + Delete */}
                                    <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto shrink-0 pt-1.5 sm:pt-0 border-t sm:border-t-0 border-line/40">
                                      {/* Stepper with clear boundary */}
                                      <div className="border-line bg-panel flex items-center rounded-lg border h-8 shrink-0">
                                        <button
                                          type="button"
                                          onClick={() => updateRowQty(row.id, row.qty - 5)}
                                          className="text-mute hover:text-ink hover:bg-panel2 grid h-8 w-7 place-items-center cursor-pointer transition-colors active:scale-90"
                                          aria-label="Decrease quantity"
                                        >
                                          <Minus className="h-3 w-3" />
                                        </button>
                                        <input
                                          type="number"
                                          min="1"
                                          value={row.qty}
                                          onChange={(e) => updateRowQty(row.id, Number(e.target.value))}
                                          className="font-mono text-ink w-12 text-center text-sm sm:text-xs font-bold outline-none bg-transparent"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => updateRowQty(row.id, row.qty + 5)}
                                          className="text-mute hover:text-ink hover:bg-panel2 grid h-8 w-7 place-items-center cursor-pointer transition-colors active:scale-90"
                                          aria-label="Increase quantity"
                                        >
                                          <Plus className="h-3 w-3" />
                                        </button>
                                      </div>

                                      {/* Unit Select */}
                                      <select
                                        value={row.unit}
                                        onChange={(e) => updateRowUnit(row.id, e.target.value as QuoteUnit)}
                                        className="border-line bg-panel text-ink rounded-lg border px-2 h-8 text-xs font-semibold outline-none cursor-pointer shrink-0"
                                      >
                                        <option value="Quintals">{t('Quintals', 'ኩንታል')}</option>
                                        <option value="Tons">{t('Tons', 'ቶን')}</option>
                                        <option value="Pcs">{t('Bars (Pcs)', 'ፍሬ')}</option>
                                        {productId === 'cement' && <option value="Bags">{t('Bags', 'ከረጢት')}</option>}
                                        {productId === 'plywood' && <option value="Sheets">{t('Sheets', 'ሉህ')}</option>}
                                      </select>

                                      {/* Quick Pieces / Bars calculation text */}
                                      {piecesEstimate && (
                                        <span className="font-mono text-mute text-[10px] hidden md:inline shrink-0">
                                          ≈ {piecesEstimate} {t('pcs', 'ፍሬ')}
                                        </span>
                                      )}

                                      {/* Remove item */}
                                      <button
                                        type="button"
                                        onClick={() => removeRow(row.id)}
                                        className="text-mute/70 hover:text-red-500 hover:bg-red-500/10 grid h-8 w-7 place-items-center rounded-lg transition-colors cursor-pointer shrink-0"
                                        title={t('Remove item', 'አስወግድ')}
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>

                          {/* Live Total Order Weight Box - Fully Contained */}
                          {itemRows.length > 0 && (
                            <div className="border-line bg-panel2 mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-xs w-full min-w-0">
                              <div className="flex items-center gap-2 min-w-0">
                                <Package className="text-ember h-3.5 w-3.5 shrink-0" />
                                <span className="text-mute font-semibold truncate">
                                  {t('Total Estimated Weight:', 'ጠቅላላ የተገመተ ክብደት፡')}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 font-mono shrink-0">
                                <span className="font-display font-bold text-ink text-sm">
                                  {totals.quintals} {t('Quintals', 'ኩንታል')}
                                </span>
                                <span className="text-mute text-xs">
                                  (~{totals.tons} {t('Tons', 'ቶን')})
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Delivery Site / Project Location Field */}
                          <div className="mt-4 w-full min-w-0">
                            <label htmlFor="quote-location" className="block text-xs font-semibold text-ink mb-1.5">
                              {t('Delivery Site / Project Location *', 'የማድረሻ ቦታ / ፕሮጀክት አድራሻ *')}
                            </label>
                            <div className="relative w-full min-w-0">
                              <MapPin className="text-mute pointer-events-none absolute left-3.5 top-3.5 h-4 w-4" />
                              <input
                                id="quote-location"
                                required
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder={t('e.g. Bole Atlas, Lebu, Ayat, Bahirdar…', 'ምሳሌ፡ ቦሌ አትላስ፣ ለቡ፣ አያት፣ ባሕር ዳር…')}
                                className={`${inputCls} pl-10`}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Step 3: Contact Details */}
                        <div className="border-t border-line pt-4 w-full min-w-0">
                          <div className="font-display text-ink flex items-center gap-2 text-xs sm:text-sm font-bold">
                            <span className={stepNumCls}>3</span>
                            <span>{t('Your Contact Details', 'የእርስዎ አድራሻ')}</span>
                          </div>
                          <div className="mt-3 grid gap-3 grid-cols-1 sm:grid-cols-3 w-full min-w-0">
                            <div className="w-full min-w-0">
                              <label htmlFor="quote-name" className="block text-xs font-semibold text-ink mb-1.5">
                                {t('Full Name *', 'ሙሉ ስም *')}
                              </label>
                              <input
                                id="quote-name"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t('Ato Abebe / Eng. Sara', 'አቶ አበበ / ኢንጂነር ሳራ')}
                                className={inputCls}
                              />
                            </div>
                            <div className="w-full min-w-0">
                              <label htmlFor="quote-phone" className="block text-xs font-semibold text-ink mb-1.5">
                                {t('Phone Number *', 'ስልክ ቁጥር *')}
                              </label>
                              <input
                                id="quote-phone"
                                required
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+251 9... / 09..."
                                className={inputCls}
                              />
                            </div>
                            <div className="w-full min-w-0">
                              <label htmlFor="quote-email" className="block text-xs font-semibold text-ink mb-1.5">
                                {t('Email Address (Optional)', 'ኢሜይል (አማራጭ)')}
                              </label>
                              <input
                                id="quote-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="contractor@example.com"
                                className={inputCls}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Step 4: Notes / Bar Bending Schedule (BBS) */}
                        <div className="border-t border-line pt-4 w-full min-w-0">
                          <label
                            htmlFor="quote-note"
                            className="font-display text-ink flex items-center gap-2 text-xs sm:text-sm font-bold mb-2 cursor-pointer"
                          >
                            <span className={stepNumCls}>4</span>
                            <span>{t('Message or Bar Bending Schedule (BBS) Notes', 'ተጨማሪ መልእክት ወይም ማስታወሻ')}</span>
                          </label>
                          <textarea
                            id="quote-note"
                            rows={2}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder={t(
                              'Enter specific project requirements, bending schedule specifications, delivery timeline…',
                              'የግንባታ ዝርዝር፣ የሚፈለግበት ጊዜ ወይም ልዩ ማስታወሻ…'
                            )}
                            className={`${inputCls} resize-none`}
                          />
                        </div>

                        {/* Summary Pill Bar */}
                        <div className="border-ember/30 bg-ember/10 flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs text-ink w-full min-w-0 overflow-hidden">
                          <span className="h-1.5 w-1.5 rounded-full bg-ember shrink-0" />
                          <span className="truncate">
                            {summary || t('Select items above to construct your quotation', 'ከላይ መጠኖችን ይምረጡ')}
                          </span>
                        </div>

                        {/* Submit Button */}
                        <button
                          type="submit"
                          disabled={status === 'sending' || itemRows.length === 0}
                          className="bg-ember hover:bg-ember/90 text-white font-display flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer disabled:opacity-60"
                        >
                          {status === 'sending' ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>{t('Submitting Request...', 'በመላክ ላይ...')}</span>
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4" />
                              <span>{t('Send Quotation Request', 'የዋጋ መጠየቂያውን ላክ')}</span>
                            </>
                          )}
                        </button>

                        {/* Fast Telegram Direct Button */}
                        <div className="flex items-center justify-center gap-3 pt-1 text-xs text-mute">
                          <span>{t('Fast Channel:', 'ፈጣን ግንኙነት፡')}</span>
                          <a
                            href={tgHref}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-ember flex items-center gap-1 font-bold transition-colors"
                          >
                            <Send className="h-3 w-3 text-ember" />
                            <span>Telegram Direct</span>
                          </a>
                          <span>·</span>
                          <a
                            href={`tel:${CONTACT.phoneClean}`}
                            className="hover:text-ember flex items-center gap-1 font-bold transition-colors"
                          >
                            <Phone className="h-3 w-3 text-ember" />
                            <span>Call Direct</span>
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
      </div>
    </section>
  );
}
