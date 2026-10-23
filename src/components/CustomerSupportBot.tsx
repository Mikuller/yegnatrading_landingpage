import { useState, useEffect, useRef, type FormEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  Bot,
  MessageSquare,
  Sparkles,
  X,
  Send,
  Phone,
  ArrowUpRight,
  RotateCcw,
  MapPin,
  Calculator,
  HelpCircle,
  FileCheck2,
  Clock,
  ShieldCheck,
  Headphones,
} from 'lucide-react';
import { CONTACT } from '../data';
import { useApp } from '../context/AppContext';
import { useNavigation } from '../context/NavigationContext';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  actions?: Array<{
    label: string;
    href?: string;
    onClick?: () => void;
  }>;
}

// System Knowledge Base Prompt for Google Gemini Flash Free Tier
const SYSTEM_KNOWLEDGE_PROMPT = `
You are "Yegna AI" (የኛ አጋዥ), the official customer support and sales assistant for Yegna Trading PLC (የኛ ትሬዲንግ ኃ.የተ.የግ.ማ).

=======================================================
RULE 1: STRICT GROUNDING & FALLBACK TO HUMAN SUPPORT (MANDATORY)
=======================================================
- You must ONLY provide answers that are verified and grounded in the company context provided below.
- NEVER extrapolate, fabricate, assume, or hallucinate names, products, services, policies, prices, or numbers.
- IF A QUESTION CANNOT BE ANSWERED DIRECTLY FROM THE INFORMATION PROVIDED BELOW:
  Do NOT guess, speculate, or make up an answer. Instead, immediately tell the user that you do not have verified records on that specific question, and direct them to contact human customer support or call the hotline:
  * English fallback: "I don't have verified records regarding that specific question in my records. Please call our Customer Support hotline at +251 941 15 15 15 or our Sales & Orders desk at +251 943 00 00 05. You can also chat with our team on Telegram at @Yegna_Tradingplc."
  * Amharic fallback: "ይቅርታ፣ ለዚህ ጥያቄ በስርዓቴ ውስጥ የተረጋገጠ መረጃ አልተገኘም። እባክዎ በቀጥታ ለደንበኞች አገልግሎት በ +251 941 15 15 15 ወይም ለሽያጭ መስመራችን በ +251 943 00 00 05 ይደውሉ፤ ወይም በቴሌግራም @Yegna_Tradingplc ያግኙን።"

=======================================================
RULE 2: LANGUAGE & TONE
=======================================================
- If the user writes in Amharic (or asks for Amharic like "በአማርኛ መልስ" or "answer in amharic"), YOU MUST ANSWER IN NATURAL, RESPECTFUL, PROFESSIONAL AMHARIC. If in English, answer in English.
- Keep answers concise, factual, direct, and helpful (2 to 4 sentences). Zero AI fluff.

=======================================================
VERIFIED COMPANY INFORMATION:
=======================================================
1. COMPANY IDENTITY & MISSION:
- Company Name: Yegna Trading PLC (የኛ ትሬዲንግ ኃ.የተ.የግ.ማ).
- Founded: 2017 (established in the center of Addis Ababa, over 10 years of trusted industry excellence).
- Founding Slogan / Motto: "ንግድ በእምነትና በታማኝነት!" ("Trade with trust and integrity!") / "FOR A STRONGER TOMORROW" ("ለተሻለ ነገ").
- Mission: To build Ethiopia with excellence through trading superior quality construction supplies, delivering project ownership by establishing lasting client partnerships.
- Vision: To build Ethiopia with excellence as the country's most trusted, premier construction supply partner.
- Core Values (Six Principles):
  1. Business Integrity (የንግድ ታማኝነት)
  2. Professionalism (ሙያዊ ብቃት)
  3. Social Responsibility (ማኅበራዊ ኃላፊነት - e.g. regular Yegna Team community blood donation drives)
  4. Team Work (የቡድን ሥራ - e.g. annual Workers' Day retreat at Bisset Babogaya Resort in Bishoftu)
  5. Learning Organization (ቀጣይነት ያለው ትምህርት)
  6. Customer Orientation (ደንበኛ ተኮር አገልግሎት)
- Four Pillars: Reliable Quality, Reasonable Price, Timely Delivery, Ethics & Integrity (with full legal VAT fiscal receipts and certified paperwork).

2. REAL EXECUTIVE LEADERSHIP & KEY PERSONNEL:
- Chief Executive Officer (CEO): Tilahun Tamrat (ጥላሁን ታምራት)
- General Manager & Founder: Ato Zelalem Alene (አቶ ዘላለም አለነ)
- Operation Director / Supply Chain Director: Getahun Assefa (ጌታሁን አሰፋ)
- HR Manager: Hanna Girma (ሃና ግርማ)
- Finance Director / Manager: Hiwot Tilahun (ህይወት ጥላሁን)
- IT & ERP Business Transformation Director / MIS Manager: Mulugeta Awoke (ሙሉጌታ አወቀ)
(STRICT CONSTRAINT: These are the ONLY verified team leaders. Do NOT invent or alter names or roles).

3. CONTACT DETAILS & OPERATING HOURS:
- Sales & Orders Hotline: +251 943 00 00 05
- Customer Support Hotline: +251 941 15 15 15
- Official Email: info@Yegnatradingethiopia.com
- Telegram Channel / Support: https://t.me/Yegna_Tradingplc (@Yegna_Tradingplc)
- Help Desk: https://yegnatrading.crisp.help/en/
- Verified Company Profile (PDF on Google Drive): https://drive.google.com/file/d/1TWE42u94PPmXz6wMW0-0htNIPRT1E4YV/view
- Headquarters: Kazanchis Joburg Plaza, 5th Floor, Addis Ababa, Ethiopia (Plus Code: 2Q7F+H7, walking distance from UNECA and Interluxury Hotel).
- Working Hours:
  * Monday – Friday: 08:30 AM – 05:30 PM
  * Saturday: 08:30 AM – 12:30 PM
  * Sunday: Closed

4. PRODUCTS & TECHNICAL SPECIFICATIONS:
A. Reinforcement Bar (Grade 75 Rebar / የኮንክሪት የብረት ቆራጭ):
   - Quality Standards: Full compliance with Ethiopian Standard ES ISO 6935-2 and American Standard ASTM A615.
   - Strength: Grade 75 Yield Strength ≥ 520 MPa (75,000+ PSI).
   - Length: Standard full 12-meter metric lengths.
   - Quality Assurance: Official mill test certificates (MTC) supplied with batch heat numbers.
   - Exact Standard Metric Conversion (12m bar):
     * 6mm (Staffa coil): 0.222 kg/m - Column stirrups, structural links, tie rings
     * 8mm: 4.74 kg/bar (~21 pcs / quintal), 0.395 kg/m - Slab distribution, stairways, light foundations
     * 10mm: 7.404 kg/bar (~13.5 pcs / quintal), 0.617 kg/m - Floor slabs, grade beams, lintels, retaining walls
     * 12mm: 10.656 kg/bar (~9.4 pcs / quintal), 0.888 kg/m - Foundation pads, residential columns, cantilever beams
     * 14mm: 14.52 kg/bar (~6.9 pcs / quintal), 1.210 kg/m - Heavy foundation footings, framed structures, shear walls
     * 16mm: 18.96 kg/bar (~5.3 pcs / quintal), 1.580 kg/m - Multi-story structural columns, heavy transfer beams
     * 20mm: 29.64 kg/bar (~3.4 pcs / quintal), 2.470 kg/m - High-rise structural columns, bridges, deep footings
     * 24mm: 42.66 kg/bar (~2.3 pcs / quintal), 3.550 kg/m - Heavy commercial towers, mega raft foundations
     * 32mm: 75.72 kg/bar (~1.3 pcs / quintal), 6.310 kg/m - Mega infrastructure, deep pile caps, industrial facilities
B. Portland Cement (ሲሚንቶ):
   - Fresh mill batches from Mugher Cement and Dangote Cement.
   - OPC (Ordinary Portland Cement 42.5N/R) for rapid structural strength, columns, and heavy raft foundations.
   - PPC (Pozzolana Portland Cement 32.5R) for masonry, plastering, hollow concrete block (HCB) works, and cracking prevention.
   - Formats: 50kg weatherproof sealed bags and bulk tanker supply.
C. Steel Wire Coil (Staffa / ስታፋ 6ሚሜ):
   - 6mm high-tensile, uniform ductility cold-drawn steel wire coil for column stirrups, beam ties, and structural mesh binding. Bends easily without micro-cracking.
D. Formwork Plywood (ፕላይዉድ):
   - Phenolic film-faced and marine-grade multi-layer waterproof wooden plywood sheets for high reuse cycles, water resistance, and mirror-smooth concrete surface finishes.

5. LOGISTICS & NATIONWIDE DISPATCH:
- Centralized depot network across Addis Ababa.
- Prompt nationwide dispatch to contractor job sites throughout Ethiopia (Addis Ababa, Hawassa, Bahir Dar, Adama/Nazret, Mekelle, Dire Dawa, Gondar, Jimma, etc.).
- Direct mill offloading capabilities at construction sites.

6. PRICING & QUOTATION INQUIRIES:
- Pricing is calculated per quintal (100 kg) or metric ton (1,000 kg).
- Steel and cement prices fluctuate daily with factory mill indices.
- Never guess or quote an arbitrary price in birr. Instead, inform the user that prices adjust daily with mill index and invite them to call our sales desk at +251 943 00 00 05 or use the online quote request form on the website to lock in today's official mill price.
`;

const EAGER_PROMPTS = [
  {
    en: 'Psst! Ask me how many 12mm bars make a quintal! 👀',
    am: '1 ኩንታል 12ሚሜ ብረት ስንት ፍሬ እንደሆነ ያውቃሉ? ይጠይቁኝ! 👀',
    emoji: '📐',
  },
  {
    en: "Want today's live mill factory steel & cement rates? ⚡",
    am: 'የዛሬውን የቀጥታ የፋብሪካ ብረትና ሲሚንቶ ዋጋ ማወቅ ይፈልጋሉ? ⚡',
    emoji: '🔥',
  },
  {
    en: 'Don’t calculate rebar weights by hand—test me! 🏗️',
    am: 'የብረት ክብደት በእጅ ማሰብ ቀረ፤ እኔን በቀላሉ ይጠይቁኝ! 🏗️',
    emoji: '🧠',
  },
  {
    en: 'Looking for Dangote vs Mugher cement specs? Tap me! 🧱',
    am: 'ስለ ዳንጎቴና ሙገር ሲሚንቶ ልዩነት ማወቅ ይፈልጋሉ? ይጠይቁኝ! 🧱',
    emoji: '💬',
  },
];

export default function CustomerSupportBot() {
  const { lang, t } = useApp();
  const { navigate } = useNavigation();
  const shouldReduceMotion = useReducedMotion();

  const [isOpen, setIsOpen] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const [isWiggling, setIsWiggling] = useState(false);
  const [eagerPromptIndex, setEagerPromptIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Initialize initial welcome message
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      sender: 'bot',
      text:
        lang === 'am'
          ? 'እንኳን ወደ የኛ ትሬዲንግ በደህና መጡ! ስለ Grade 75 ብረት፣ ሲሚንቶ፣ ዋጋ ወይም የቢሮአችን አድራሻ ምን ማወቅ ይፈልጋሉ?'
          : 'Welcome to Yegna Trading! How can I assist you today with Grade 75 rebar specs, pricing, cement, or our Kazanchis office?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actions: [
        {
          label: lang === 'am' ? '🏗️ የዋጋ መጠየቂያ' : '🏗️ Request Price Quote',
          href: '#quote',
        },
        {
          label: lang === 'am' ? '📍 የቢሮ አድራሻ' : '📍 Kazanchis HQ Location',
          onClick: () => handlePresetQuery(lang === 'am' ? 'አድራሻችሁ የት ነው?' : 'Where is your office?'),
        },
        {
          label: lang === 'am' ? '⚖️ የብረት ክብደትና ልኬት' : '⚖️ Rebar Sizes & Weights',
          onClick: () => handlePresetQuery(lang === 'am' ? 'የብረት ክብደት ዝርዝር' : 'Rebar weight conversion'),
        },
      ],
    },
  ]);

  // Scroll to bottom of message list on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // focus input when opened on non-mobile
      if (typeof window !== 'undefined' && window.innerWidth > 640) {
        setTimeout(() => inputRef.current?.focus(), 150);
      }
    }
  }, [messages, isOpen]);

  // =========================================================================
  // EAGER PROMPT CYCLING & ATTENTION HOP ENGINE
  // =========================================================================
  useEffect(() => {
    // If dismissed in this session, do not auto-popup
    const dismissed = sessionStorage.getItem('yegna_teaser_dismissed');
    if (!dismissed) {
      const timer = setTimeout(() => {
        if (!isOpen) setShowTeaser(true);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Prompt cycling interval (cycles every 5 seconds)
  useEffect(() => {
    if (isOpen) return;
    const promptInterval = setInterval(() => {
      setEagerPromptIndex((prev) => (prev + 1) % EAGER_PROMPTS.length);
    }, 5000);
    return () => clearInterval(promptInterval);
  }, [isOpen]);

  // Eager Bounce / Wiggle periodic trigger (hops every 7 seconds)
  useEffect(() => {
    if (isOpen || shouldReduceMotion) return;
    const wiggleInterval = setInterval(() => {
      setIsWiggling(true);
      setTimeout(() => setIsWiggling(false), 900);
    }, 7000);
    return () => clearInterval(wiggleInterval);
  }, [isOpen, shouldReduceMotion]);

  // =========================================================================
  // SMART "LOST USER" HEURISTIC DETECTION ENGINE
  // =========================================================================
  useEffect(() => {
    const dismissedSession = sessionStorage.getItem('yegna_teaser_dismissed');
    if (dismissedSession) return;

    let userInteracted = false;
    let scrollDirectionChanges = 0;
    let lastScrollY = window.scrollY;
    let lastScrollDirection: 'up' | 'down' | null = null;
    let lastScrollChangeTime = Date.now();

    const triggerLostNudge = () => {
      if (userInteracted || isOpen) return;
      userInteracted = true;
      setShowTeaser(true);
    };

    // Heuristic 1: Inactivity Idle Trigger
    const idleTimer = setTimeout(() => {
      triggerLostNudge();
    }, 30000);

    // Heuristic 2: Erratic Scroll Hunt
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const now = Date.now();
      const currentDirection = currentScrollY > lastScrollY ? 'down' : 'up';

      if (Math.abs(currentScrollY - lastScrollY) > 35) {
        if (lastScrollDirection && currentDirection !== lastScrollDirection) {
          if (now - lastScrollChangeTime < 7000) {
            scrollDirectionChanges += 1;
            if (scrollDirectionChanges >= 3) {
              triggerLostNudge();
            }
          } else {
            scrollDirectionChanges = 1;
          }
          lastScrollChangeTime = now;
        }
        lastScrollDirection = currentDirection;
      }
      lastScrollY = currentScrollY;

      // Heuristic 3: Scrolled to footer without clicking anything
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      if (currentScrollY + winHeight > docHeight - 350) {
        triggerLostNudge();
      }
    };

    const onUserClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('#yegna-ai-bot-trigger, #yegna-ai-bot-panel')) return;
      clearTimeout(idleTimer);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('click', onUserClick);

    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('click', onUserClick);
    };
  }, [isOpen]);

  const dismissTeaser = () => {
    setShowTeaser(false);
    sessionStorage.setItem('yegna_teaser_dismissed', 'true');
  };

  const openBot = () => {
    setIsOpen(true);
    setShowTeaser(false);
    sessionStorage.setItem('yegna_teaser_dismissed', 'true');
  };

  const handleQuickChip = (queryText: string) => {
    openBot();
    setTimeout(() => {
      handleSendMessage(queryText);
    }, 180);
  };

  // =========================================================================
  // KNOWLEDGE BASE / LOCAL SMART INTENT ENGINE ($0, ZERO DEPENDENCIES)
  // =========================================================================
  const getSmartLocalResponse = (query: string): { text: string; actions?: ChatMessage['actions'] } => {
    const q = query.toLowerCase();
    const hasEthiopicChars = /[\u1200-\u137F]/.test(query);
    const preferAmharic =
      hasEthiopicChars ||
      lang === 'am' ||
      q.includes('amharic') ||
      q.includes('አማርኛ') ||
      q.includes('inamharic');

    // 0. Leadership, Team, Ownership & Founders
    if (
      q.includes('who run') ||
      q.includes('who runs') ||
      q.includes('who owns') ||
      q.includes('management') ||
      q.includes('leader') ||
      q.includes('team') ||
      q.includes('founder') ||
      q.includes('ceo') ||
      q.includes('zelalem') ||
      q.includes('tilahun') ||
      q.includes('getahun') ||
      q.includes('hanna') ||
      q.includes('hiwot') ||
      q.includes('mulugeta') ||
      q.includes('ማን ናችሁ') ||
      q.includes('ማን ይመራል') ||
      q.includes('አመራር') ||
      q.includes('ስራ አስኪያጅ') ||
      q.includes('መስራች') ||
      q.includes('ባለቤት') ||
      q.includes('ቡድን')
    ) {
      return {
        text: preferAmharic
          ? 'የኛ ትሬዲንግ ኃ.የተ.የግ.ማ በዋና ሥራ አስፈፃሚ (CEO) ጥላሁን ታምራት እና በዋና ሥራ አስኪያጅና መሥራች አቶ ዘላለም አለነ ይመራል። የአመራር ቡድኑ አባላት፡ ጌታሁን አሰፋ (ኦፐሬሽን ዳይሬክተር)፣ ሃና ግርማ (የሰው ኃይል ሥራ አስኪያጅ)፣ ህይወት ጥላሁን (የፋይናንስ ዳይሬክተር) እና ሙሉጌታ አወቀ (የመረጃና ኢአርፒ ስርዓት ዳይሬክተር) ናቸው።'
          : 'Yegna Trading PLC is led by Chief Executive Officer (CEO) Tilahun Tamrat and General Manager & Founder Ato Zelalem Alene, supported by our directors: Getahun Assefa (Operation Director), Hanna Girma (HR Manager), Hiwot Tilahun (Finance Director), and Mulugeta Awoke (IT & ERP Director).',
        actions: [
          {
            label: preferAmharic ? '👥 ሙሉ የአመራር ቡድን' : '👥 View Full Team',
            href: '/about/#team',
          },
          {
            label: preferAmharic ? '📞 ለዋናው ቢሮ ደውል' : '📞 Call Head Office',
            href: `tel:${CONTACT.phoneClean}`,
          },
        ],
      };
    }

    // 1. Company Profile & Who We Are
    if (
      q.includes('about') ||
      q.includes('who are you') ||
      q.includes('company') ||
      q.includes('ስለ ድርጅቱ') ||
      q.includes('ስለ እኛ') ||
      q.includes('የኛ ትሬዲንግ')
    ) {
      return {
        text: preferAmharic
          ? 'የኛ ትሬዲንግ ኃ.የተ.የግ.ማ (Yegna Trading PLC) በ2017 የተመሰረተ፣ ከ10 ዓመታት በላይ ልምድ ያለው ታማኝ የኮንስትራክሽን ግብአቶች አቅራቢ ነው። ደረጃቸውን የጠበቁ Grade 75 ብረቶች፣ ፖርትላንድ ሲሚንቶ፣ 6ሚሜ ስታፋ እና ፕላይዉድ በታማኝነት በመላው ኢትዮጵያ እናቀርባለን።'
          : 'Yegna Trading PLC is an established, trusted Ethiopian construction materials supplier with over 10 years of experience (Est. 2017). We supply verified Grade 75 steel rebar, Portland cement, 6mm staffa, and formwork plywood across Ethiopia.',
        actions: [
          {
            label: preferAmharic ? '🏢 ስለ እኛ ገጽ' : '🏢 About Yegna',
            href: '/about/',
          },
          {
            label: preferAmharic ? '📄 የድርጅት መገለጫ (PDF)' : '📄 Company Profile (PDF)',
            href: CONTACT.companyProfileUrl,
          },
        ],
      };
    }

    // 2. Price / Cost Queries
    if (
      q.includes('price') ||
      q.includes('cost') ||
      q.includes('rate') ||
      q.includes('ዋጋ') ||
      q.includes('ስንት') ||
      q.includes('ክፍያ') ||
      q.includes('ብር')
    ) {
      return {
        text: preferAmharic
          ? 'የብረትና የሲሚንቶ ዋጋ በየቀኑ በፋብሪካ ኢንዴክስ ስለሚለዋወጥ፣ ወቅታዊና ቀጥተኛውን የፋብሪካ ዋጋ በደቂቃዎች ውስጥ ለማግኘት በቀጥታ ይደውሉልን (+251 943 00 00 05) ወይም የዋጋ መጠየቂያ ቅጹን ይሙሉ!'
          : 'Rebar and cement prices adjust daily based on factory mill stock. For real-time locked-in rates with zero intermediary markup, you can call our sales hotline (+251 943 00 00 05) or request an instant quotation!',
        actions: [
          {
            label: preferAmharic ? '📞 አሁን ይደውሉ (+251 943 00 00 05)' : '📞 Call Sales Hotline',
            href: `tel:${CONTACT.phoneClean}`,
          },
          {
            label: preferAmharic ? '📝 የዋጋ መጠየቂያ ቅጽ' : '📝 Request Official Quote',
            href: '#quote',
          },
        ],
      };
    }

    // 3. Location / Office / Address
    if (
      q.includes('location') ||
      q.includes('address') ||
      q.includes('office') ||
      q.includes('where') ||
      q.includes('joburg') ||
      q.includes('kazanchis') ||
      q.includes('ቦታ') ||
      q.includes('አድራሻ') ||
      q.includes('ቢሮ') ||
      q.includes('የት')
    ) {
      return {
        text: preferAmharic
          ? 'ዋናው ቢሮአችን ካዛንቺስ ጆበርግ ፕላዛ (Joburg Plaza)፣ 5ኛ ፎቅ (Addis Ababa Plus Code: 2Q7F+H7) ይገኛል። ከሰኞ እስከ አርብ ከጠዋቱ 2:30 እስከ 11:30፣ ቅዳሜ እስከ 6:30 ክፍት ነን።'
          : 'Our headquarters is located at Kazanchis Joburg Plaza, 5th Floor, Addis Ababa (Plus Code: 2Q7F+H7). Working hours are Mon–Fri 08:30 AM–05:30 PM, Saturday 08:30 AM–12:30 PM.',
        actions: [
          {
            label: preferAmharic ? '🗺️ በ Google Maps ክፈት' : '🗺️ Open in Google Maps',
            href: 'https://maps.app.goo.gl/FQVCfhaxFvV8goy7A?g_st=atm',
          },
          {
            label: preferAmharic ? '🕒 የቢሮ ሰዓታት' : '🕒 Contact Hours',
            onClick: () => handlePresetQuery(preferAmharic ? 'የስራ ሰዓት' : 'Working hours'),
          },
        ],
      };
    }

    // 4. Sizes, Weights, Specifications, Rebar Lab
    if (
      q.includes('size') ||
      q.includes('weight') ||
      q.includes('diameter') ||
      q.includes('metric') ||
      q.includes('kg') ||
      q.includes('8mm') ||
      q.includes('10mm') ||
      q.includes('12mm') ||
      q.includes('14mm') ||
      q.includes('16mm') ||
      q.includes('20mm') ||
      q.includes('24mm') ||
      q.includes('32mm') ||
      q.includes('መጠን') ||
      q.includes('ክብደት') ||
      q.includes('ዲያሜትር') ||
      q.includes('ሚሜ')
    ) {
      return {
        text: preferAmharic
          ? 'ከ8ሚሜ እስከ 32ሚሜ ደረጃ 75 (Grade 75) ሬባር በሙሉ 12 ሜትር ርዝመት አለን። ምሳሌ፦ 12ሚሜ = 10.66 ኪ.ግ/ባር፣ 14ሚሜ = 14.52 ኪ.ግ/ባር፣ 16ሚሜ = 18.96 ኪ.ግ/ባር፣ 20ሚሜ = 29.64 ኪ.ግ/ባር። በይነ-መረባችን ላይ ያለውን የቀጥታ የክብደት ካልኩሌተር መሞከር ይችላሉ!'
          : 'We stock full metric lengths (12m) from 8mm up to 32mm in certified Grade 75. For example: 12mm is ~10.66 kg/bar, 14mm is ~14.52 kg/bar, 16mm is ~18.96 kg/bar, and 20mm is ~29.64 kg/bar. Try our interactive Rebar Lab calculator below!',
        actions: [
          {
            label: preferAmharic ? '🧪 ወደ ሬባር ላብራቶሪ ሂድ' : '🧪 Open Rebar Lab Calculator',
            href: '#structural-lab',
          },
          {
            label: preferAmharic ? '📋 ሙሉ የክብደት ሰንጠረዥ' : '📋 View Product Specs',
            href: '/products/',
          },
        ],
      };
    }

    // 5. Cement, Staffa, Plywood
    if (
      q.includes('cement') ||
      q.includes('opc') ||
      q.includes('ppc') ||
      q.includes('staffa') ||
      q.includes('plywood') ||
      q.includes('coil') ||
      q.includes('mugher') ||
      q.includes('dangote') ||
      q.includes('ሙገር') ||
      q.includes('ዳንጎቴ') ||
      q.includes('ሲሚንቶ') ||
      q.includes('ስታፋ') ||
      q.includes('ፕላይዉድ')
    ) {
      return {
        text: preferAmharic
          ? 'ከሬባር በተጨማሪ ዳንጎቴና ሙገር OPC (42.5N) እና PPC (32.5R) ሲሚንቶ፣ 6ሚሜ ስታፋ (የብረት ሽቦ) እና ፊልም የተለበጠ ጥራት ያለው የኮንክሪት ፕላይዉድ በተመጣጣኝ ዋጋ እናቀርባለን።'
          : 'In addition to Grade 75 rebar, we supply fresh mill Dangote/Mugher OPC & PPC cement, 6mm high-tensile staffa steel coil, and phenolic film-faced marine formwork plywood.',
        actions: [
          {
            label: preferAmharic ? '🧱 ምርቶችን በሙሉ ተመልከት' : '🧱 View All Materials',
            href: '/products/',
          },
        ],
      };
    }

    // 6. Contact / Call / Phone / Telegram / Support
    if (
      q.includes('phone') ||
      q.includes('call') ||
      q.includes('contact') ||
      q.includes('telegram') ||
      q.includes('email') ||
      q.includes('support') ||
      q.includes('help') ||
      q.includes('ስልክ') ||
      q.includes('ደውል') ||
      q.includes('ቴሌግራም') ||
      q.includes('ኢሜይል') ||
      q.includes('እርዳታ')
    ) {
      return {
        text: preferAmharic
          ? `የሽያጭና ትዕዛዝ መስመራችን፡ ${CONTACT.phone} ሲሆን፣ የደንበኞች ድጋፍ መስመራችን፡ ${CONTACT.phones[1]?.number || '+251 941 15 15 15'} ነው። እንዲሁም በቴሌግራም @Yegna_Tradingplc በማንኛውም ጊዜ ማግኘት ይችላሉ።`
          : `Reach our Sales & Orders desk at ${CONTACT.phone} or Customer Support at ${CONTACT.phones[1]?.number || '+251 941 15 15 15'}. You can also chat on Telegram at @Yegna_Tradingplc.`,
        actions: [
          {
            label: preferAmharic ? '📞 የሽያጭ መስመር' : '📞 Call Sales Desk',
            href: `tel:${CONTACT.phoneClean}`,
          },
          {
            label: preferAmharic ? '📞 የደንበኞች ድጋፍ' : '📞 Customer Support',
            href: `tel:${CONTACT.phones[1]?.tel || '+251941151515'}`,
          },
          {
            label: preferAmharic ? '💬 በቴሌግራም አውራ' : '💬 Chat on Telegram',
            href: CONTACT.telegram,
          },
        ],
      };
    }

    // 7. Certifications & Quality Standards
    if (
      q.includes('cert') ||
      q.includes('standard') ||
      q.includes('quality') ||
      q.includes('grade 75') ||
      q.includes('iso') ||
      q.includes('astm') ||
      q.includes('ጥራት') ||
      q.includes('ደረጃ') ||
      q.includes('ሰርተፊኬት')
    ) {
      return {
        text: preferAmharic
          ? 'ሁሉም የኛ ትሬዲንግ ሬባር በኢትዮጵያ ደረጃ ES ISO 6935-2 እና በአለም አቀፉ ASTM A615 መሰረት ሙሉ የፋብሪካ ጥራት ሰርተፊኬት (Mill Test Certificate) ያለው Grade 75 ብረት ነው።'
          : 'Every batch of Yegna rebar is certified Grade 75, strictly conforming to Ethiopian Standard ES ISO 6935-2 and ASTM A615. Complete laboratory mill test certificates are provided with every order.',
        actions: [
          {
            label: preferAmharic ? '📄 የድርጅት መገለጫ (PDF)' : '📄 Company Profile (PDF)',
            href: CONTACT.companyProfileUrl,
          },
        ],
      };
    }

    // 8. Delivery / Transport / Logistics
    if (
      q.includes('delivery') ||
      q.includes('transport') ||
      q.includes('ship') ||
      q.includes('dispatch') ||
      q.includes('ማድረስ') ||
      q.includes('መጓጓዣ') ||
      q.includes('ትራንስፖርት') ||
      q.includes('ክልል')
    ) {
      return {
        text: preferAmharic
          ? 'በአዲስ አበባም ሆነ በመላው የኢትዮጵያ ክልሎች (ሀዋሳ፣ ባህር ዳር፣ አዳማ፣ መቐለ ወዘተ) ድረስ ያለ ምንም መዘግየት በታማኝነት በፍጥነት እናደርሳለን።'
          : 'We provide prompt site delivery across Addis Ababa and all regional cities throughout Ethiopia with direct mill offloading capabilities.',
        actions: [
          {
            label: preferAmharic ? '🏗️ የትራንስፖርት ዋጋ ጠይቅ' : '🏗️ Quote Delivery',
            href: '#quote',
          },
        ],
      };
    }

    // 9. Greetings
    if (
      q.includes('hi') ||
      q.includes('hello') ||
      q.includes('hey') ||
      q.includes('ሰላም') ||
      q.includes('ጤና') ||
      q.includes('እንደምን')
    ) {
      return {
        text: preferAmharic
          ? 'ሰላም! የኛ ትሬዲንግ (Yegna Trading PLC) የኮንስትራክሽን ግብአቶች አጋዥ ነኝ። ዛሬ በምን ልርዳዎ? የዋጋ መረጃ፣ የብረት ልኬት ወይስ የቢሮ አድራሻ?'
          : 'Hello! I am your Yegna Trading construction assistant. How can I help you today? Would you like current pricing, rebar specs, or office directions?',
      };
    }

    // 10. STRICT FALLBACK RULE: If question cannot be answered from context, direct to hotline
    return {
      text: preferAmharic
        ? 'ይቅርታ፣ ለዚህ ጥያቄ በስርዓቴ ውስጥ የተረጋገጠ መረጃ አልተገኘም። እባክዎ በቀጥታ ለደንበኞች አገልግሎት በ +251 941 15 15 15 ወይም ለሽያጭ መስመራችን በ +251 943 00 00 05 ይደውሉ፤ ወይም በቴሌግራም @Yegna_Tradingplc ያግኙን።'
        : "I don't have verified records regarding that specific question in my records. Please call our Customer Support hotline at +251 941 15 15 15 or our Sales & Orders desk at +251 943 00 00 05. You can also chat with our team on Telegram at @Yegna_Tradingplc.",
      actions: [
        {
          label: preferAmharic ? '📞 የደንበኞች ድጋፍ (+251 941 15 15 15)' : '📞 Customer Support (+251 941 15 15 15)',
          href: 'tel:+251941151515',
        },
        {
          label: preferAmharic ? '📞 የሽያጭ መስመር (+251 943 00 00 05)' : '📞 Sales Desk (+251 943 00 00 05)',
          href: `tel:${CONTACT.phoneClean}`,
        },
        {
          label: preferAmharic ? '💬 በቴሌግራም አውራ' : '💬 Chat on Telegram',
          href: CONTACT.telegram,
        },
      ],
    };
  };

  // =========================================================================
  // MESSAGE SUBMISSION & GEMINI FLASH HYBRID DISPATCH
  // =========================================================================
  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isTyping) return;

    const hasEthiopic = /[\u1200-\u137F]/.test(trimmed);
    const preferAmharic =
      hasEthiopic ||
      lang === 'am' ||
      trimmed.toLowerCase().includes('amharic') ||
      trimmed.toLowerCase().includes('አማርኛ') ||
      trimmed.toLowerCase().includes('inamharic');

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Primary: Google Gemini 2.5 Flash Free Tier (from environment variable)
    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (geminiApiKey) {
      try {
        // Multi-turn context: pass last 6 messages for full conversational continuity
        const conversationHistory = messages
          .filter((m) => m.id !== 'welcome')
          .slice(-6)
          .map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }],
          }));

        conversationHistory.push({
          role: 'user',
          parts: [{ text: trimmed }],
        });

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              system_instruction: {
                parts: [{ text: SYSTEM_KNOWLEDGE_PROMPT }],
              },
              contents: conversationHistory,
              generationConfig: {
                temperature: 0.35,
                maxOutputTokens: 1000,
              },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (aiText && aiText.trim()) {
            setMessages((prev) => [
              ...prev,
              {
                id: `b-${Date.now()}`,
                sender: 'bot',
                text: aiText.trim(),
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                actions: [
                  {
                    label: preferAmharic ? '📞 ደውል (+251 943 00 00 05)' : '📞 Call Hotline',
                    href: `tel:${CONTACT.phoneClean}`,
                  },
                  {
                    label: preferAmharic ? '📝 የዋጋ መጠየቂያ' : '📝 Request Quote',
                    href: '#quote',
                  },
                ],
              },
            ]);
            setIsTyping(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to smart local engine:', err);
      }
    }

    // Default & Zero-Lag Fallback: Local Smart Intent Engine
    setTimeout(() => {
      const smartReply = getSmartLocalResponse(trimmed);
      setMessages((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          sender: 'bot',
          text: smartReply.text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actions: smartReply.actions,
        },
      ]);
      setIsTyping(false);
    }, 450);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const handlePresetQuery = (queryText: string) => {
    handleSendMessage(queryText);
  };

  const handleActionClick = (action: { href?: string; onClick?: () => void }) => {
    if (action.onClick) {
      action.onClick();
      return;
    }
    if (action.href) {
      if (action.href.startsWith('#')) {
        const el = document.getElementById(action.href.substring(1));
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          setIsOpen(false);
          return;
        }
      }
      if (action.href.startsWith('/')) {
        navigate(action.href);
        setIsOpen(false);
        return;
      }
      window.open(action.href, '_blank', 'noreferrer');
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'bot',
        text:
          lang === 'am'
            ? 'ውይይቱ ታድሷል። ስለ የኛ ትሬዲንግ ምርቶች ወይም አገልግሎቶች ምን ማወቅ ይፈልጋሉ?'
            : 'Chat reset. How else can I assist you with Yegna Trading products or services?',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: [
          {
            label: lang === 'am' ? '🏗️ የዋጋ መጠየቂያ' : '🏗️ Request Price Quote',
            href: '#quote',
          },
          {
            label: lang === 'am' ? '📍 የቢሮ አድራሻ' : '📍 Kazanchis HQ Location',
            onClick: () => handlePresetQuery(lang === 'am' ? 'አድራሻችሁ የት ነው?' : 'Where is your office?'),
          },
        ],
      },
    ]);
  };

  return (
    <>
      {/* ===================================================================== */}
      {/* 1. EAGER TEASER BUBBLE WITH INTERACTIVE QUICK-CHIPS                   */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {showTeaser && !isOpen && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.9 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 400, damping: 24 }}
            className="fixed bottom-[135px] md:bottom-22 right-3 sm:right-6 z-40 w-[calc(100vw-1.5rem)] sm:w-[330px] rounded-2xl border border-ember/30 bg-panel/95 p-3.5 shadow-2xl backdrop-blur-2xl card-glow select-none"
          >
            {/* Header: Eager emoji, live status, and close button */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <motion.span
                  animate={
                    shouldReduceMotion
                      ? {}
                      : { rotate: [0, -14, 14, -8, 8, 0], scale: [1, 1.25, 1] }
                  }
                  transition={{ repeat: Infinity, repeatDelay: 3.5, duration: 0.8 }}
                  className="text-base leading-none select-none"
                >
                  {EAGER_PROMPTS[eagerPromptIndex].emoji}
                </motion.span>
                <span className="font-display text-[0.68rem] font-bold uppercase tracking-wider text-ember flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {lang === 'am' ? 'የቀጥታ ድጋፍ • ይጠይቁኝ' : 'Live Desk • Eager to Help'}
                </span>
              </div>
              <button
                type="button"
                onClick={dismissTeaser}
                aria-label={lang === 'am' ? 'ዝጋ' : 'Dismiss teaser'}
                className="text-mute hover:text-ink -mr-1 -mt-1 p-1 rounded-lg hover:bg-panel2 transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Rotating eager prompt question */}
            <div className="relative mt-2 min-h-[38px] flex items-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={eagerPromptIndex}
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
                  animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.22 }}
                  onClick={() =>
                    handleQuickChip(
                      lang === 'am'
                        ? EAGER_PROMPTS[eagerPromptIndex].am
                        : EAGER_PROMPTS[eagerPromptIndex].en
                    )
                  }
                  className="text-ink text-xs font-semibold leading-snug cursor-pointer hover:text-ember transition-colors"
                >
                  {lang === 'am'
                    ? EAGER_PROMPTS[eagerPromptIndex].am
                    : EAGER_PROMPTS[eagerPromptIndex].en}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Clickable Quick-Chips */}
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5 pt-2 border-t border-line/60">
              <motion.button
                type="button"
                whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -1 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                onClick={() =>
                  handleQuickChip(
                    lang === 'am'
                      ? 'የዛሬው የብረትና የሲሚንቶ ዋጋ ስንት ነው?'
                      : 'What are today’s steel and cement prices?'
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-full bg-panel2/90 hover:bg-ember/15 border border-line hover:border-ember/50 px-2.5 py-1 text-[0.68rem] font-semibold text-ink transition-colors cursor-pointer shadow-2xs"
              >
                <Sparkles className="h-3 w-3 text-ember" />
                <span>{lang === 'am' ? 'የዛሬ ዋጋ' : "Today's Price"}</span>
              </motion.button>

              <motion.button
                type="button"
                whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -1 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                onClick={() =>
                  handleQuickChip(
                    lang === 'am'
                      ? 'የ12ሚሜ ብረት ክብደትና 1 ኩንታል ስንት ፍሬ ነው?'
                      : 'How many 12mm rebar pieces in a quintal and what is the weight?'
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-full bg-panel2/90 hover:bg-ember/15 border border-line hover:border-ember/50 px-2.5 py-1 text-[0.68rem] font-semibold text-ink transition-colors cursor-pointer shadow-2xs"
              >
                <Calculator className="h-3 w-3 text-amber-500" />
                <span>{lang === 'am' ? '12ሚሜ ክብደት' : '12mm Weight'}</span>
              </motion.button>

              <motion.button
                type="button"
                whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -1 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                onClick={() =>
                  handleQuickChip(
                    lang === 'am'
                      ? 'የካዛንቺስ ቢሮአችሁ የት ነው?'
                      : 'Where is your Kazanchis office located?'
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-full bg-panel2/90 hover:bg-ember/15 border border-line hover:border-ember/50 px-2.5 py-1 text-[0.68rem] font-semibold text-ink transition-colors cursor-pointer shadow-2xs"
              >
                <MapPin className="h-3 w-3 text-emerald-500" />
                <span>{lang === 'am' ? 'ካዛንቺስ ቢሮ' : 'Kazanchis HQ'}</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================================================================== */}
      {/* 2. PERSISTENT CORNER FLOATING TRIGGER BUTTON (WITH EAGER HOP)        */}
      {/* ===================================================================== */}
      <div className="fixed bottom-[74px] md:bottom-6 right-4 sm:right-6 z-40 select-none">
        <motion.button
          id="yegna-ai-bot-trigger"
          type="button"
          onClick={() => (isOpen ? setIsOpen(false) : openBot())}
          aria-label={isOpen ? 'Close Customer Support' : 'Open Yegna Customer Support'}
          animate={
            isWiggling && !isOpen && !shouldReduceMotion
              ? {
                  y: [0, -10, 0, -6, 0],
                  rotate: [0, -7, 7, -5, 5, 0],
                  scale: [1, 1.08, 0.96, 1.04, 1],
                  transition: { duration: 0.85, ease: 'easeInOut' },
                }
              : { y: 0, rotate: 0, scale: 1 }
          }
          whileHover={shouldReduceMotion ? {} : { scale: 1.08, y: -2 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.94 }}
          className={`group relative flex items-center gap-2 rounded-full border px-3.5 py-2.5 sm:px-4 sm:py-3 shadow-xl backdrop-blur-xl transition-colors cursor-pointer ${
            isOpen
              ? 'border-ember bg-panel text-ink shadow-ember/20'
              : 'border-line bg-panel/95 hover:border-ember text-ink hover:shadow-[0_0_24px_rgba(245,124,0,0.35)]'
          }`}
        >
          {/* Eager bouncing badge over button */}
          {!isOpen && (
            <motion.span
              animate={
                shouldReduceMotion
                  ? {}
                  : { y: [0, -3, 0], rotate: [0, -3, 3, 0] }
              }
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="absolute -top-3 -left-2 bg-gradient-to-r from-ember to-amber-500 text-white text-[0.62rem] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 uppercase tracking-wider"
            >
              <Sparkles className="h-2.5 w-2.5 animate-spin" />
              <span>{lang === 'am' ? 'ጠይቁኝ!' : 'Ask me!'}</span>
            </motion.span>
          )}

          {/* Pulsing online ambient glow ring */}
          {!isOpen && (
            <span className="bg-ember/25 absolute -inset-1 rounded-full blur-md animate-pulse" />
          )}

          <motion.div
            animate={
              isWiggling && !isOpen && !shouldReduceMotion
                ? { rotate: [0, -15, 15, -10, 10, 0] }
                : { rotate: 0 }
            }
            transition={{ duration: 0.6 }}
            className="relative grid h-7 w-7 place-items-center rounded-full bg-ember text-white shadow-xs"
          >
            {isOpen ? <X className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
            {!isOpen && (
              <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-panel bg-emerald-500" />
            )}
          </motion.div>

          <div className="hidden sm:flex flex-col text-left leading-none">
            <span className="font-display text-ink text-xs font-bold tracking-tight">
              {isOpen ? t('Close Chat', 'ዝጋ') : t('Support Desk', 'የደንበኞች ድጋፍ')}
            </span>
            <span className="text-[0.62rem] text-mute font-medium mt-0.5 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {t('Online', 'ኦንላይን')}
            </span>
          </div>
        </motion.button>
      </div>

      {/* ===================================================================== */}
      {/* 3. INTERACTIVE CHAT WINDOW DIALOG                                     */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="yegna-ai-bot-panel"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="fixed bottom-[130px] md:bottom-20 right-3 sm:right-6 z-50 flex flex-col w-[calc(100vw-1.5rem)] sm:w-[400px] h-[520px] max-h-[calc(100vh-160px)] rounded-3xl border border-line bg-panel/98 shadow-2xl backdrop-blur-2xl overflow-hidden card-glow"
          >
            {/* Header */}
            <div className="border-b border-line/70 bg-panel2/90 px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-ember text-white shadow-xs">
                  <Headphones className="h-4.5 w-4.5" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-panel bg-emerald-500" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-ink text-sm font-bold truncate">
                      {t('Yegna Support Desk', 'የኛ ደንበኞች ድጋፍ')}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[0.62rem] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {t('Online', 'ኦንላይን')}
                    </span>
                  </div>
                  <p className="text-mute text-[0.68rem] leading-tight flex items-center gap-1 truncate mt-0.5">
                    <MapPin className="h-3 w-3 text-ember shrink-0" />
                    <span>{t('Kazanchis HQ, Addis Ababa', 'ካዛንቺስ ዋና ቢሮ፣ አዲስ አበባ')}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={resetChat}
                  title={t('Reset conversation', 'ውይይት አድስ')}
                  className="text-mute hover:text-ink grid h-8 w-8 place-items-center rounded-lg hover:bg-panel transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title={t('Close chat', 'ዝጋ')}
                  className="text-mute hover:text-ink grid h-8 w-8 place-items-center rounded-lg hover:bg-panel transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Quick Human Fallback strip */}
            <div className="bg-panel/90 border-b border-line/40 px-3 py-1.5 flex items-center justify-between text-[0.68rem] text-mute shrink-0">
              <span className="flex items-center gap-1">
                <Headphones className="h-3 w-3 text-ember" />
                <span>{t('Need urgent human sales?', 'አስቸኳይ የሰው ድጋፍ?')}</span>
              </span>
              <a
                href={`tel:${CONTACT.phoneClean}`}
                className="text-ember font-bold hover:underline inline-flex items-center gap-1"
              >
                <span>{CONTACT.phone}</span>
                <ArrowUpRight className="h-2.5 w-2.5" />
              </a>
            </div>

            {/* Message Thread */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-ember text-white rounded-br-xs shadow-xs'
                        : 'border-line bg-panel2 text-ink rounded-bl-xs border shadow-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.text}</p>
                  </div>

                  {/* Optional Action Pills */}
                  {m.actions && m.actions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5 max-w-[90%]">
                      {m.actions.map((act, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleActionClick(act)}
                          className="border-line bg-panel hover:border-ember hover:text-ember text-ink inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[0.68rem] font-semibold transition-all shadow-2xs hover:-translate-y-0.5 cursor-pointer"
                        >
                          <span>{act.label}</span>
                          <ArrowUpRight className="h-2.5 w-2.5 opacity-60" />
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="text-[0.62rem] text-mute mt-1 px-1">
                    {m.time}
                  </span>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-1.5 text-mute text-xs pl-2">
                  <div className="h-2 w-2 rounded-full bg-ember animate-bounce" />
                  <div className="h-2 w-2 rounded-full bg-ember animate-bounce [animation-delay:0.18s]" />
                  <div className="h-2 w-2 rounded-full bg-ember animate-bounce [animation-delay:0.36s]" />
                  <span className="text-[0.68rem] ml-1">{t('Yegna AI is typing...', 'የኛ አጋዥ በመጻፍ ላይ...')}</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Starter Chips */}
            <div className="px-3 py-1.5 border-t border-line/40 bg-panel2/50 overflow-x-auto scrollbar-none flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => handlePresetQuery(lang === 'am' ? 'የዛሬ የብረት ዋጋ ስንት ነው?' : 'What are current rebar prices?')}
                className="shrink-0 text-[0.65rem] font-medium border border-line rounded-full px-2.5 py-1 bg-panel hover:border-ember text-ink transition-colors cursor-pointer"
              >
                💰 {lang === 'am' ? 'ዋጋ' : 'Prices'}
              </button>
              <button
                type="button"
                onClick={() => handlePresetQuery(lang === 'am' ? 'ቢሮአችሁ የት ነው?' : 'Where is your office?')}
                className="shrink-0 text-[0.65rem] font-medium border border-line rounded-full px-2.5 py-1 bg-panel hover:border-ember text-ink transition-colors cursor-pointer"
              >
                📍 {lang === 'am' ? 'አድራሻ' : 'Office Location'}
              </button>
              <button
                type="button"
                onClick={() => handlePresetQuery(lang === 'am' ? 'የ 12ሚሜ እና 16ሚሜ ክብደት' : '12mm & 16mm rebar weights')}
                className="shrink-0 text-[0.65rem] font-medium border border-line rounded-full px-2.5 py-1 bg-panel hover:border-ember text-ink transition-colors cursor-pointer"
              >
                ⚖️ {lang === 'am' ? 'ክብደት' : 'Weights'}
              </button>
              <button
                type="button"
                onClick={() => handlePresetQuery(lang === 'am' ? 'ሲሚንቶ እና ስታፋ አላችሁ?' : 'Cement and Staffa details')}
                className="shrink-0 text-[0.65rem] font-medium border border-line rounded-full px-2.5 py-1 bg-panel hover:border-ember text-ink transition-colors cursor-pointer"
              >
                🧱 {lang === 'am' ? 'ሲሚንቶ' : 'Cement & Staffa'}
              </button>
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSubmit} className="border-t border-line/70 bg-panel p-2.5 flex items-center gap-2 shrink-0">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={
                  lang === 'am'
                    ? 'ስለ ብረት፣ ዋጋ ወይም አድራሻ ይጠይቁ...'
                    : 'Ask about rebar, prices, cement, or office...'
                }
                className="border-line bg-panel2 text-ink placeholder:text-mute flex-1 rounded-xl border px-3.5 py-2 text-xs focus:border-ember focus:outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                aria-label="Send question"
                className="bg-ember hover:bg-ember/90 disabled:opacity-40 text-white grid h-9 w-9 place-items-center rounded-xl shadow-xs transition-all cursor-pointer shrink-0 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
