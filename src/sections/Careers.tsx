import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Briefcase,
  CheckCircle2,
  FileUp,
  Mail,
  Phone,
  Send,
  Sparkles,
  User,
} from 'lucide-react';
import { CONTACT } from '../data';
import { EASE, Reveal, SectionHead } from '../ui';
import { useApp } from '../context/AppContext';

export default function Careers() {
  const { t } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fileName, setFileName] = useState('');

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    position: 'General / Spontaneous Application',
    note: '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 900);
  };

  return (
    <section id="jobs" className="texture-noise relative overflow-hidden py-24 sm:py-32">
      <div
        className="absolute inset-0 bg-[radial-gradient(800px_400px_at_20%_40%,rgba(245,124,0,0.05),transparent_65%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead
          eyebrow={t('Careers & Opportunities', 'የሥራ ዕድሎች')}
          title={t('Build Your Career', 'የሥራ ሕይወትዎን')}
          accent={t('With Yegna Trading.', 'ከየኛ ትሬዲንግ ጋር ይገንቡ።')}
          sub={t(
            'We provide our employees a stable, merit-driven work environment with equal opportunity for continuous learning, leadership, and personal growth.',
            'ለሠራተኞቻችን ምቹ የሥራ አካባቢ፣ ቀጣይነት ያለው የሙያ ማሻሻያ እና የዕድገት ዕድል እናመቻቻለን።'
          )}
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.1fr] items-start">
          {/* Left: Open Positions State (Spec Requirement 4.6) */}
          <Reveal delay={0.1}>
            <div className="border-line bg-panel card-glow relative overflow-hidden rounded-3xl border p-7 sm:p-9 shadow-lg">
              <div className="flex items-center gap-3 border-b border-line pb-5">
                <div className="bg-ember/15 text-ember grid h-10 w-10 place-items-center rounded-xl">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-ink text-lg font-bold">
                    {t('Current Open Positions', 'ወቅታዊ ክፍት የሥራ ቦታዎች')}
                  </h3>
                  <p className="text-mute text-xs">
                    {t('Head Office — Kazanchis, Addis Ababa', 'ዋና መሥሪያ ቤት — ካዛንቺስ፣ አዲስ አበባ')}
                  </p>
                </div>
              </div>

              {/* Empty state per spec 4.6 requirement */}
              <div className="my-8 rounded-2xl border border-dashed border-line bg-panel2/60 p-8 text-center">
                <div className="bg-panel mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full border border-line text-ember shadow-sm">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h4 className="font-display text-ink text-base font-bold">
                  {t('No active listings right now.', 'በአሁኑ ሰዓት ክፍት የሥራ መደብ የለም።')}
                </h4>
                <p className="text-mute mt-2 max-w-sm mx-auto text-xs sm:text-sm leading-relaxed">
                  {t(
                    'We are always looking for driven talent in sales, supply chain, civil logistics, and accounting. Submit your CV below for spontaneous evaluation.',
                    'ነገር ግን በሽያጭ፣ በሎጂስቲክስ፣ በሲቪል ምህንድስና እና በሒሳብ ዘርፍ ጎበዝ ባለሙያዎችን ሁልጊዜ እንቀበላለን። የሕይወት ታሪክዎን (CV) ከዚህ በታች ይላኩልን።'
                  )}
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-ink text-xs font-bold uppercase tracking-wider">
                  {t('Why Work at Yegna?', 'ለምን በየኛ ትሬዲንግ ይሠራሉ?')}
                </p>
                <div className="grid gap-2 text-xs text-mute">
                  <div className="border-line bg-panel2/50 flex items-center gap-2.5 rounded-xl border p-3">
                    <CheckCircle2 className="h-4 w-4 text-ember shrink-0" />
                    <span>
                      {t('Merit-based advancement & career growth', 'በብቃት ላይ የተመሠረተ የዕድገት ዕድል')}
                    </span>
                  </div>
                  <div className="border-line bg-panel2/50 flex items-center gap-2.5 rounded-xl border p-3">
                    <CheckCircle2 className="h-4 w-4 text-ember shrink-0" />
                    <span>
                      {t('Collaborative team and ethical workplace', 'የተቀናጀ የቡድን ሥራና ጤናማ የሥራ አካባቢ')}
                    </span>
                  </div>
                  <div className="border-line bg-panel2/50 flex items-center gap-2.5 rounded-xl border p-3">
                    <CheckCircle2 className="h-4 w-4 text-ember shrink-0" />
                    <span>
                      {t('Competitive compensation & medical support', 'ተወዳዳሪ ክፍያ እና የተለያዩ ጥቅማጥቅሞች')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right: Interactive Application Form (Spec 4.6 Requirement) */}
          <Reveal delay={0.2}>
            <div className="border-line bg-panel card-glow relative overflow-hidden rounded-3xl border p-7 sm:p-9 shadow-xl">
              <h3 className="font-display text-ink text-xl font-bold sm:text-2xl">
                {t('Submit Your Application / CV', 'የሥራ ማመልከቻዎን / CV ይላኩ')}
              </h3>
              <p className="text-mute mt-1.5 text-xs sm:text-sm">
                {t(
                  'Complete the form below and our HR department will reach out when a matching role opens.',
                  'ቅጹን ይሙሉ፤ ተስማሚ የሥራ ቦታ ሲከፈት የሰው ኃይል ክፍላችን ያነጋግርዎታል።'
                )}
              </p>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="my-10 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center"
                  >
                    <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-emerald-500 text-white shadow-md">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <h4 className="font-display text-ink text-lg font-bold">
                      {t('Application Received!', 'ማመልከቻዎ ደርሶናል!')}
                    </h4>
                    <p className="text-mute mt-2 text-xs sm:text-sm leading-relaxed">
                      {t(
                        'Thank you for your interest in joining Yegna Trading PLC. Your profile has been entered into our candidate database.',
                        'የኛ ትሬዲንግን ለመቀላቀል ፍላጎት ስላሳዩ እናመሰግናለን። መረጃዎ በእጩዎች መዝገብ ውስጥ ተይዟል።'
                      )}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setForm({
                          name: '',
                          phone: '',
                          email: '',
                          position: 'General / Spontaneous Application',
                          note: '',
                        });
                        setFileName('');
                      }}
                      className="border-line bg-panel text-ink hover:text-ember mt-5 rounded-xl border px-4 py-2 text-xs font-bold"
                    >
                      {t('Submit Another CV', 'ሌላ CV ይላኩ')}
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="career-name" className="text-ink block text-xs font-semibold mb-1.5">
                          {t('Full Name *', 'ሙሉ ስም *')}
                        </label>
                        <div className="relative">
                          <User className="text-mute absolute left-3.5 top-3.5 h-4 w-4" />
                          <input
                            id="career-name"
                            required
                            type="text"
                            placeholder="Abebe Kebede"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="border-line bg-panel2 text-ink placeholder:text-mute/60 focus:border-ember w-full rounded-xl border px-4 py-3 pl-10 text-xs sm:text-sm outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="career-phone" className="text-ink block text-xs font-semibold mb-1.5">
                          {t('Phone Number *', 'ስልክ ቁጥር *')}
                        </label>
                        <div className="relative">
                          <Phone className="text-mute absolute left-3.5 top-3.5 h-4 w-4" />
                          <input
                            id="career-phone"
                            required
                            type="tel"
                            placeholder="+251 9..."
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            className="border-line bg-panel2 text-ink placeholder:text-mute/60 focus:border-ember w-full rounded-xl border px-4 py-3 pl-10 text-xs sm:text-sm outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="career-email" className="text-ink block text-xs font-semibold mb-1.5">
                          {t('Email Address', 'ኢሜይል አድራሻ')}
                        </label>
                        <div className="relative">
                          <Mail className="text-mute absolute left-3.5 top-3.5 h-4 w-4" />
                          <input
                            id="career-email"
                            type="email"
                            placeholder="applicant@example.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="border-line bg-panel2 text-ink placeholder:text-mute/60 focus:border-ember w-full rounded-xl border px-4 py-3 pl-10 text-xs sm:text-sm outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="career-position" className="text-ink block text-xs font-semibold mb-1.5">
                          {t('Desired Role / Department', 'የሚፈልጉት የሥራ ዘርፍ')}
                        </label>
                        <select
                          id="career-position"
                          value={form.position}
                          onChange={(e) => setForm({ ...form, position: e.target.value })}
                          className="border-line bg-panel2 text-ink focus:border-ember w-full rounded-xl border px-4 py-3 text-xs sm:text-sm outline-none transition-all"
                        >
                          <option value="General / Spontaneous Application">
                            {t('General / Spontaneous Application', 'አጠቃላይ / ክፍት ማመልከቻ')}
                          </option>
                          <option value="Sales & Customer Relations">
                            {t('Sales & Customer Relations', 'ሽያጭና የደንበኞች ግንኙነት')}
                          </option>
                          <option value="Supply Chain & Warehouse Logistics">
                            {t('Supply Chain & Warehouse Logistics', 'አቅርቦት ሰንሰለትና መጋዘን')}
                          </option>
                          <option value="Accounting & Financial Analysis">
                            {t('Accounting & Financial Analysis', 'ሒሳብና ፋይናንስ')}
                          </option>
                          <option value="Structural & Rebar Estimation">
                            {t('Structural & Rebar Estimation', 'የኮንስትራክሽን ብረት ስሌት')}
                          </option>
                          <option value="Fleet & Delivery Operations">
                            {t('Fleet & Delivery Operations', 'ትራንስፖርትና ማጓጓዣ')}
                          </option>
                        </select>
                      </div>
                    </div>

                    {/* CV Upload */}
                    <div>
                      <span className="text-ink block text-xs font-semibold mb-1.5">
                        {t('Upload CV / Resume (PDF / DOCX)', 'የሕይወት ታሪክ (CV) ያያይዙ')}
                      </span>
                      <label htmlFor="career-cv" className="border-line bg-panel2/60 hover:bg-panel2 hover:border-ember flex cursor-pointer items-center justify-between rounded-xl border border-dashed px-4 py-3 transition-all">
                        <div className="flex items-center gap-2.5">
                          <FileUp className="text-ember h-4 w-4" />
                          <span className="text-mute text-xs">
                            {fileName || t('Click to browse file...', 'ፋይል ለመምረጥ እዚህ ይጫኑ...')}
                          </span>
                        </div>
                        <span className="border-line bg-panel rounded-lg border px-2.5 py-1 text-[0.7rem] font-bold text-ink">
                          {t('Browse', 'ምረጥ')}
                        </span>
                        <input
                          id="career-cv"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setFileName(file.name);
                          }}
                        />
                      </label>
                    </div>

                    <div>
                      <label htmlFor="career-note" className="text-ink block text-xs font-semibold mb-1.5">
                        {t('Cover Note / Summary', 'አጭር ማስታወሻ')}
                      </label>
                      <textarea
                        id="career-note"
                        rows={3}
                        placeholder={t(
                          'Briefly describe your experience or background...',
                          'ስለ ልምድዎና የትምህርት ዝግጅትዎ በአጭሩ ይግለጹ...'
                        )}
                        value={form.note}
                        onChange={(e) => setForm({ ...form, note: e.target.value })}
                        className="border-line bg-panel2 text-ink placeholder:text-mute/60 focus:border-ember w-full rounded-xl border p-3 text-xs sm:text-sm outline-none transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="bg-ember hover:bg-ember/90 text-white font-display flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer disabled:opacity-60"
                    >
                      <Send className="h-4 w-4" />
                      <span>
                        {submitting
                          ? t('Sending Application...', 'በመላክ ላይ...')
                          : t('Submit Job Application', 'ማመልከቻውን ላክ')}
                      </span>
                    </button>
                  </form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
