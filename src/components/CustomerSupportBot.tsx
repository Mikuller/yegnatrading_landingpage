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
  Layers,
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
- Chief Executive Officer (CEO): Tilahun Tamirat (ጥላሁን ታሚራት)
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
- Headquarters Office: Kazanchis Joburg Plaza, 5th Floor, Addis Ababa, Ethiopia (Plus Code: 2Q7F+H7, walking distance from UNECA and Interluxury Hotel). Google Maps: https://maps.app.goo.gl/FQVCfhaxFvV8goy7A?g_st=atm
- Yegna Trading Physical Warehouse & Central Stock Depot:
  * IMPORTANT: Yegna Trading owns and operates its own dedicated, fully stocked physical warehouse and storage depot with extensive inventory across all Grade 75 rebar diameters, Portland cement, staffa coils, and formwork plywood.
  * Direct Warehouse Navigation Link (Google Maps): https://maps.app.goo.gl/iT4jNjBeeoQgr2JEA
  * Whenever a customer or contractor asks about our warehouse, depot, material storage, site pickup, or truck loading, ALWAYS confirm that Yegna Trading has its own warehouse and help them navigate directly using this link: https://maps.app.goo.gl/iT4jNjBeeoQgr2JEA
- Working Hours:
  * Monday – Friday: 08:30 AM – 05:30 PM
  * Saturday: 08:30 AM – 12:30 PM
  * Sunday: Closed

4. PRODUCTS & TECHNICAL SPECIFICATIONS:
A. Reinforcement Bar (Grade 75 Rebar / የኮንክሪት የብረት ቆራጭ / ፌሮ ብረት):
   - Local Amharic Terminology: In Ethiopia, deformed steel rebar is universally and colloquially known as "ፌሮ" (Fero), "የፌሮ ብረት", "ቆራጭ ብረት", or "የኮንክሪት ብረት".
   - Material Availability Inquiries (e.g. "ፌሮ አለ?", "ፌሮ አላችሁ?", "ብረት አለ?", "do you have rebar?", "is rebar available?"):
     ALWAYS CONFIRM WITH AN ENTHUSIASTIC AND FACTUAL YES: Yegna Trading PLC maintains extensive, continuous warehouse stock of certified Grade 75 ፌሮ (from 8mm to 32mm in full 12-meter lengths), 6mm staffa wire coils, Dangote and Mugher cement, and formwork plywood ready for immediate dispatch or truck pickup at our warehouse. Ask them what diameter (mm) or quantity they need.
   - Quality Standards: Full compliance with Ethiopian Standard ES ISO 6935-2 and American Standard ASTM A615.
   - Strength: Grade 75 Yield Strength ≥ 520 MPa (75,000+ PSI).
   - Length: Standard full 12-meter metric lengths.
   - Quality Assurance: Official mill test certificates (MTC) supplied with batch heat numbers.
   - Official Rebar Sizes & Standard Conversion Table (Official metric standard Pcs / Kg for 12m bars):
     * 06mm (Steel coil / Staffa): Coil / Variable length | Unit weight: 0.222 kg/m - Column stirrups, structural links, tie rings
     * 08mm: 4.74 kg / 12m bar (0.395 kg/m) | ~21.1 pcs / quintal (100 kg) - Slab distribution, stairways, light foundations
     * 10mm: 7.40 kg / 12m bar (0.617 kg/m) | ~13.5 pcs / quintal (100 kg) - Floor slabs, grade beams, lintels, retaining walls
     * 12mm: 10.66 kg / 12m bar (0.888 kg/m) | ~9.38 pcs / quintal (100 kg) - Foundation pads, residential columns, cantilever beams
     * 14mm: 14.52 kg / 12m bar (1.210 kg/m) | ~6.89 pcs / quintal (100 kg) - Heavy foundation footings, framed structures, shear walls
     * 16mm: 18.96 kg / 12m bar (1.580 kg/m) | ~5.27 pcs / quintal (100 kg) - Multi-story structural columns, heavy transfer beams
     * 20mm: 29.64 kg / 12m bar (2.470 kg/m) | ~3.37 pcs / quintal (100 kg) - High-rise structural columns, bridges, deep footings
     * 24mm: 42.66 kg / 12m bar (3.550 kg/m) | ~2.34 pcs / quintal (100 kg) - Heavy commercial towers, mega raft foundations
     * 32mm: 75.72 kg / 12m bar (6.310 kg/m) | ~1.32 pcs / quintal (100 kg) - Mega infrastructure, deep pile caps, industrial facilities

=======================================================
RULE 3: PRECISE REBAR CONVERSIONS & MATHEMATICAL CALCULATIONS
=======================================================
When a user asks how much a specific quantity/pieces of rebar weighs (e.g. "how many kg is 400pcs of 16mm grade 75 rebar", "500 pcs 12mm in quintals", "weight of 100 pcs 20mm"):
1. Multiply: Total Weight in kg = (Number of Pieces) × (Weight per 12m bar in kg).
2. Convert to Quintals: Total Quintals = Total kg / 100.
3. Convert to Metric Tons: Total Metric Tons = Total kg / 1,000.
4. Worked Calculation Examples:
   - Example (16mm): "400 pieces of 16mm Grade 75 rebar (12m length) weighs exactly 7,584 kg (75.84 quintals or ~7.58 metric tons), based on the official standard of 18.96 kg per 12m bar (1.580 kg/m)."
     (In Amharic: "400 ፍሬ 16ሚሜ Grade 75 ባለ 12 ሜትር ብረት 7,584 ኪሎ ግራም (75.84 ኩንታል ወይም ~7.58 ሜትሪክ ቶን) ይመዝናል። ይህም በደረጃው መሠረት አንዱ ባለ 12 ሜትር ብረት 18.96 ኪ.ግ (1.580 ኪ.ግ/ሜትር) በመሆኑ ነው።")
   - Example (12mm): "250 pieces of 12mm Grade 75 rebar weighs exactly 2,665 kg (26.65 quintals or ~2.67 metric tons), based on 10.66 kg per 12m bar (0.888 kg/m)."
Always calculate accurately using the table values. Never guess or hallucinate arbitrary weights.

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

7. VERIFIED TECHNICAL BLOG INSIGHTS & ENGINEERING FACTS:
(Strict Constraint: Only share verified engineering, structural, and material facts. DO NOT output or invent unverified contact details from blog text; all official hotlines are defined in Section 3 above).
A. Grade 75 vs Grade 60 Rebar Differences:
   - Grade 75 provides a guaranteed minimum yield strength of 500–520+ MPa (75,000+ PSI), compared to standard Grade 60's 415–420 MPa.
   - Engineering benefit: Structural engineers can reduce total steel mass by ~15–20% while providing equal or superior tensile load capacity. This significantly reduces structural dead load on foundations and cuts project shipping/freight costs.
B. OPC vs PPC Cement Technical Selection:
   - Ordinary Portland Cement (OPC 42.5N/R - Dangote & Mugher): Achieves rapid early compressive strength. Essential for early formwork/shuttering removal, structural columns, suspended slabs, transfer beams, and pre-cast concrete.
   - Pozzolana Portland Cement (PPC 32.5R - Dangote & Mugher): Contains reactive pozzolanic volcanic ash/silica. Generates significantly lower heat of hydration, which prevents thermal cracking in mass concrete pours. Offers superior long-term impermeability and chemical/sulfate resistance. Ideal for foundation rafts, substructures, hollow concrete block (HCB) masonry, bricklaying, and plastering.
C. What is PPC in Cement (Chemical & Structural Dynamics):
   - In PPC, calcium hydroxide released during clinker hydration reacts with pozzolanic silica to form additional calcium silicate hydrate (C-S-H) gel—the compound responsible for strength. This densifies concrete pore structure over time, drastically resisting water infiltration and ground sulfate attack.
D. Formwork Plywood Cutting & Quality Best Practices:
   - When cutting construction formwork plywood with a circular saw, use a fine-tooth carbide-tipped blade (60–80 teeth), score the cut line, or use zero-clearance backing to prevent face veneer tear-out. Clean, sealed edges prevent water intrusion and guarantee mirror-smooth concrete finishes with maximum reusability.
   - Green / Eco Plywood: Uses low-emission, moisture-resistant bonding resins that eliminate hazardous off-gassing on modern sites while delivering heavy-duty multi-cycle reuse.
E. Job Site Weight Verification:
   - Every steel delivery from Yegna Trading includes certified electronic weigh-bridge tickets from our central dispatch. Contractors can double-check accuracy on site by multiplying physical bar counts by standard metric weights (e.g. 10.66 kg per 12m bar for 12mm rebar, or 18.96 kg per bar for 16mm rebar).
F. Why Timely Rebar Logistics Matters:
   - In construction sequencing, late rebar delivery creates catastrophic bottlenecks—stopping steel-fixers, idling concrete pump crews, and delaying structural pours. Yegna Trading's dedicated logistics, central warehouse stock, and prompt dispatch safeguard project timelines.

8. INTERACTIVE STRUCTURAL LAB & BUILDING COMPONENT REBAR ADVISORY (IDEAL VS NON-IDEAL CHOICES):
=======================================================
Yegna Trading provides an advanced on-site interactive engineering simulator: the "Interactive Structural Lab" (የሬባር ምህንድስና ላብራቶሪ) on our website (accessible directly at #structural-lab).
Engineers, contractors, and builders can configure a complete 5-stage building frame, simulate 1,420–2,130 kN factored structural gravity loads and 0.18g seismic ground motion, witness real-time failure animations if incompatible bars are chosen, and export an itemized bill of quantities (BOQ) with a structural integrity rating.

MANDATORY ADVISORY & RECOMMENDATION RULE:
Whenever a user asks what rebar diameter to use for a particular part of a building (footings, columns, beams, slabs, stairs), whether a specific rebar size is safe, or asks for structural recommendations:
1. Provide the exact engineering advisory below, explaining the ideal sizes AND warning against non-ideal (under-reinforced or over-reinforced) sizes.
2. ALWAYS EXPLICITLY RECOMMEND THE USER TO USE THE INTERACTIVE STRUCTURAL LAB:
   - Invite them to test and simulate their load paths on the website's Interactive Structural Lab (action link: #structural-lab).
   - In Amharic: "ለህንጻዎ ተስማሚውን የብረት መጠን በቀጥታ ለመፈተሽና የክብደት ጫናን (Structural Load Simulation) በቅጽበት ለመለካት በይነ-መረባችን ላይ ያለውን 'የሬባር ምህንድስና ላብራቶሪ' (Interactive Structural Lab) እንዲሞክሩ እንመክራለን!"
   - In English: "We strongly recommend testing your structural configuration in our on-page Interactive Structural Lab (#structural-lab), where you can simulate seismic load paths and factored gravity loads for your project!"

STAGE-BY-STAGE ENGINEERING ADVISORY & REBAR MATRIX:

A. STAGE 1: FOOTING & FOUNDATION PADS (የመሠረት ማሰሪያ / Footings)
   - Structural Function: The seismic anchor to bedrock. Carries the entire building weight and distributes high column axial loads evenly into the subsoil to prevent punch-through shear and differential settlement.
   - IDEAL / RECOMMENDED SIZES: 14mm, 16mm, 20mm (Best Choice: 16mm).
     * Engineering Requirements: Dense two-way bottom grid, minimum 50mm concrete cover (EBCS code to resist groundwater corrosion), and 90° hooked anchorages.
   - ACCEPTABLE: 12mm (only for lightweight, single-story residential footings).
   - NON-IDEAL / INCOMPATIBLE (STRUCTURAL DANGER): 06mm Coil, 08mm, 10mm.
     * 06mm Coil: Zero structural capacity for high column axial loads (1,420+ kN); causes catastrophic punching shear rupture where the foundation pad snaps in half and the column punches into subsoil.
     * 08mm: Tensile area is 72% below minimum EBCS flexural foundation code; snaps under building self-weight.
     * 10mm: Insufficient bending moment resistance for two-way foundation action; causes bedrock settlement cracks that propagate vertically into columns.

B. STAGE 2: COLUMNS & STAFFA STIRRUP CAGES (የህንጻ አምዶችና ስታፋ / Columns)
   - Structural Function: The vertical spine carrying compression axial gravity loads and lateral earthquake shear.
   - IDEAL / RECOMMENDED SIZES:
     * Longitudinal Main Compression Bars: 16mm, 20mm, 24mm (Best Choice: 20mm).
     * Confinement Ties / Stirrups: 06mm high-tensile wire coil (Staffa) tied at 100mm spacing near beam-column joints with 135° seismic safety hooks to confine concrete core and prevent lateral bar buckling.
   - ACCEPTABLE: 14mm (for short residential columns).
   - NON-IDEAL / INCOMPATIBLE FOR VERTICAL MAIN STEEL: 06mm Coil, 08mm, 10mm, 12mm.
     * 06mm Coil: Cannot function as vertical compression steel (Euler critical load P_cr exceeded by 900%); triggers violent axial buckling and core burst.
     * 08mm: Slenderness ratio lambda > 120, triggering explosive lateral buckling where concrete cover blows off.
     * 10mm: Yields prematurely under axial dead load + seismic lateral shear; causes heavy building drift.
     * 12mm: Violates Ethiopian Building Code (EBCS) minimum steel ratio for multi-story buildings, leading to micro-buckling and joint fractures under seismic motion.

C. STAGE 3: PLINTH & INTER-FLOOR BEAMS (የወለልና የመሬት ጋሪ / Beams)
   - Structural Function: The horizontal flexural bridge. Bottom tensile rebars fight positive bending (sag) at mid-span; top bars resist negative bending moments over columns; stirrups absorb diagonal splitting tension.
   - IDEAL / RECOMMENDED SIZES: 14mm, 16mm, 20mm (Best Choice: 16mm).
     * Engineering Requirements: Development lap length Ld >= 40 bar diameters where beams intersect column cores.
   - ACCEPTABLE: 12mm (for short, light-duty spans).
   - NON-IDEAL / INCOMPATIBLE: 06mm Coil, 08mm, 10mm.
     * 06mm Coil: Zero tensile moment resistance across structural spans; snaps cleanly at mid-span causing sudden floor collapse (deflections exceeding 38cm).
     * 08mm: Insufficient flexural yield strength; develops 45° diagonal shear tears near column joints.
     * 10mm: Exceeds allowable deflection limits (L/250); causes heavy sag, cracked non-structural masonry walls, and ceiling rupture.

D. STAGE 4: SUSPENDED FLOOR & ROOF SLAB (ጠፍጣፋ ወለልና ጣሪያ / Slabs)
   - Structural Function: The continuous two-way live-load platform (150–200mm mesh) transferring furniture, occupants, and dead load smoothly into supporting beams.
   - IDEAL / RECOMMENDED SIZES: 08mm, 10mm, 12mm (Best Choice: 10mm).
     * Engineering Requirements: Use rebar spacer chairs to keep the top mesh elevated during concrete pour for proper effective depth.
   - ACCEPTABLE: 14mm (for heavy commercial floors or long spans).
   - NON-IDEAL / INCOMPATIBLE (UNDER-SIZED & OVER-SIZED DANGER):
     * Under-sized (06mm Coil): Lacks tensile area for two-way distribution; causes cross-pattern cracking and punch-through tears.
     * OVER-SIZED (20mm, 24mm, 32mm) — CRITICAL STRUCTURAL HAZARD:
       Using 20mm, 24mm, or 32mm in a standard 150mm slab creates an "OVER-REINFORCED SECTION" violating EBCS ductility limits!
       In an over-reinforced slab, steel never yields before the concrete crushes. Instead of ductile bending with visible hairline cracks giving advance warning, the top compression concrete crushes explosively without warning (brittle failure hazard). In addition, 32mm rebar cannot physically fit minimum concrete cover clearances in a 150mm slab, causing debonding along the entire bar length.

E. STAGE 5: DOG-LEGGED REINFORCED STAIRCASE (የደረጃ መዋቅር / Stairs)
   - Structural Function: The dynamic circulation spine carrying pedestrian footfall impact and continuous vibration.
   - IDEAL / RECOMMENDED SIZES: 12mm, 14mm, 16mm (Best Choice: 12mm).
     * Engineering Requirements: Anchor top and bottom flight reinforcement deeply into beam cores with cranked hooks to resist dynamic vibrations.
   - ACCEPTABLE: 10mm (for light distribution / riser ties).
   - NON-IDEAL / INCOMPATIBLE:
     * Under-sized (06mm Coil): Snaps under dynamic pedestrian footfall impact; waist slab severs completely from landing beam.
     * OVER-SIZED (20mm, 24mm, 32mm): Bend radius exceeds 150mm stair waist thickness, causing radial bursting tension, landing joint cleavage, and anchor hook concrete spalling.
`;

const EAGER_PROMPTS = [
  {
    en: 'Testing column or slab rebars? Try the Interactive Structural Lab! 🏗️',
    am: 'ለአምድና ለወለል ተስማሚውን ብረት ለመፈተሽ የሬባር ላብራቶሪያችንን ይሞክሩ! 🏗️',
    emoji: '🧪',
  },
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
  const [isScrolledDown, setIsScrolledDown] = useState(false);
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
        {
          label: lang === 'am' ? '🧪 ሬባር ላብራቶሪ' : '🧪 Structural Lab',
          onClick: () =>
            handlePresetQuery(
              lang === 'am'
                ? 'ለህንጻ ክፍሎች ተስማሚ የብረት መጠን ምክር'
                : 'Rebar recommendations for building parts'
            ),
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

  // Auto-hide floating support trigger on scroll down, reveal on scroll up / top
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollDirection = () => {
      const currentScrollY = window.scrollY;

      // Always show near the top of the page
      if (currentScrollY < 120) {
        setIsScrolledDown(false);
      } else if (currentScrollY > lastScrollY + 15) {
        // Scrolling down past threshold -> hide
        setIsScrolledDown(true);
      } else if (currentScrollY < lastScrollY - 10) {
        // Scrolling up -> reveal immediately
        setIsScrolledDown(false);
      }

      lastScrollY = currentScrollY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
          ? 'የኛ ትሬዲንግ ኃ.የተ.የግ.ማ በዋና ሥራ አስፈፃሚ (CEO) ጥላሁን ታሚራት እና በዋና ሥራ አስኪያጅና መሥራች አቶ ዘላለም አለነ ይመራል። የአመራር ቡድኑ አባላት፡ ጌታሁን አሰፋ (ኦፐሬሽን ዳይሬክተር)፣ ሃና ግርማ (የሰው ኃይል ሥራ አስኪያጅ)፣ ህይወት ጥላሁን (የፋይናንስ ዳይሬክተር) እና ሙሉጌታ አወቀ (የመረጃና ኢአርፒ ስርዓት ዳይሬክተር) ናቸው።'
          : 'Yegna Trading PLC is led by Chief Executive Officer (CEO) Tilahun Tamirat and General Manager & Founder Ato Zelalem Alene, supported by our directors: Getahun Assefa (Operation Director), Hanna Girma (HR Manager), Hiwot Tilahun (Finance Director), and Mulugeta Awoke (IT & ERP Director).',
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

    // 1.2 Structural Engineering Advisory & Interactive Structural Lab Recommendations
    const isStructuralAdviceQuery =
      q.includes('recommend') ||
      q.includes('building parts') ||
      q.includes('building part') ||
      q.includes('parts of building') ||
      q.includes('parts of a building') ||
      q.includes('column') ||
      q.includes('beam') ||
      q.includes('slab') ||
      q.includes('footing') ||
      q.includes('foundation') ||
      q.includes('stair') ||
      q.includes('structural') ||
      q.includes('lab') ||
      q.includes('ideal') ||
      q.includes('over-reinforced') ||
      q.includes('buckl') ||
      q.includes('shear') ||
      q.includes('ምክር') ||
      q.includes('የህንጻ ክፍሎች') ||
      q.includes('የህንፃ ክፍሎች') ||
      q.includes('የህንጻ') ||
      q.includes('የህንፃ') ||
      q.includes('አምድ') ||
      q.includes('ምሰሶ') ||
      q.includes('መሠረት') ||
      q.includes('ጋሪ') ||
      q.includes('ቢም') ||
      q.includes('ወለል') ||
      q.includes('ጣሪያ') ||
      q.includes('ደረጃ') ||
      q.includes('ላብራቶሪ') ||
      (q.includes('which') && (q.includes('rebar') || q.includes('size') || q.includes('fero') || q.includes('ብረት'))) ||
      (q.includes('what') && (q.includes('size for') || q.includes('rebar for') || q.includes('best rebar') || q.includes('choice')));

    if (isStructuralAdviceQuery) {
      // Case A: Column (አምድ / ምሰሶ)
      if (q.includes('column') || q.includes('አምድ') || q.includes('ምሰሶ')) {
        return {
          text: preferAmharic
            ? 'ለህንጻ አምዶች (Columns) ተስማሚው የቁም ብረት 16ሚሜ፣ 20ሚሜ እና 24ሚሜ (በጣም ተመራጩ 20ሚሜ) ሲሆን፤ ለማሰሪያ ደግሞ 6ሚሜ ስታፋ በ100ሚሜ ክፍተት በ135° ማጠፊያ ማሰር ግዴታ ነው። ቀጭን ብረቶች (6ሚሜ፣ 8ሚሜ፣ 10ሚሜ፣ 12ሚሜ) ለቁም አምድ መጠቀም ፈጽሞ የተከለከለ ነው (የአምድ መጣመም/Euler buckling እና የኮንክሪት መፈንዳት ያስከትላል)። በይነ-መረባችን ላይ ያለውን "የሬባር ምህንድስና ላብራቶሪ" (Interactive Structural Lab) በመጠቀም የአምዶችን ጫና በቀጥታ እንዲሞክሩ እንመክራለን!'
            : 'For structural Columns, the IDEAL main compression rebar sizes are 16mm, 20mm, and 24mm (Best: 20mm), confined with 6mm high-tensile staffa wire coils spaced at 100mm near joints with 135° seismic hooks. NON-IDEAL sizes (6mm, 8mm, 10mm, 12mm) are structurally dangerous for main vertical steel, violating EBCS code and triggering violent Euler buckling or core bursting. We strongly recommend testing your column configuration in our on-page Interactive Structural Lab!',
          actions: [
            {
              label: preferAmharic ? '🧪 ወደ ሬባር ላብራቶሪ ሂድ' : '🧪 Open Structural Lab',
              href: '#structural-lab',
            },
            {
              label: preferAmharic ? '📞 ለምህንድስና ድጋፍ ደውል' : '📞 Call Engineering Desk',
              href: `tel:${CONTACT.phoneClean}`,
            },
            {
              label: preferAmharic ? '📝 የዋጋ መጠየቂያ' : '📝 Request Quote',
              href: '#quote',
            },
          ],
        };
      }

      // Case B: Footing & Foundation (መሠረት)
      if (q.includes('footing') || q.includes('foundation') || q.includes('መሠረት')) {
        return {
          text: preferAmharic
            ? 'ለመሠረት ማሰሪያ (Footing Pads) ተስማሚው የብረት መጠን 14ሚሜ፣ 16ሚሜ እና 20ሚሜ (በጣም ተመራጩ 16ሚሜ) ሲሆን፤ ቢያንስ 50ሚሜ የኮንክሪት ሽፋን (Cover) እና የ90° ማጠፊያ ይፈልጋል። 6ሚሜ፣ 8ሚሜ ወይም 10ሚሜ መጠቀም ፈጽሞ አደገኛ ነው (የመሠረት መሰንጠቅና መደርመስ/Punching Shear Rupture ያስከትላል)። ለህንጻዎ መሠረት አስተማማኝ ምርመራ ለማድረግ የሬባር ላብራቶሪያችንን (Interactive Structural Lab) እንዲጠቀሙ እንመክራለን!'
            : 'For Footing & Foundation Pads, IDEAL rebar sizes are 14mm, 16mm, and 20mm (Best: 16mm) with a dense two-way grid, minimum 50mm concrete cover (EBCS code), and 90° hook anchorages. NON-IDEAL sizes (6mm, 8mm, 10mm) lack tensile moment capacity and risk catastrophic punching shear rupture where the footing snaps in half. We recommend simulating your foundation load in our Interactive Structural Lab!',
          actions: [
            {
              label: preferAmharic ? '🧪 ወደ ሬባር ላብራቶሪ ሂድ' : '🧪 Open Structural Lab',
              href: '#structural-lab',
            },
            {
              label: preferAmharic ? '📞 ለምህንድስና ድጋፍ ደውል' : '📞 Call Engineering Desk',
              href: `tel:${CONTACT.phoneClean}`,
            },
            {
              label: preferAmharic ? '📝 የዋጋ መጠየቂያ' : '📝 Request Quote',
              href: '#quote',
            },
          ],
        };
      }

      // Case C: Beams (የወለልና የመሬት ጋሪ / ቢም)
      if (q.includes('beam') || q.includes('ጋሪ') || q.includes('ቢም')) {
        return {
          text: preferAmharic
            ? 'ለወለልና ለመሬት ጋሪዎች (Plinth & Floor Beams) ተስማሚው የብረት መጠን 14ሚሜ፣ 16ሚሜ እና 20ሚሜ (በጣም ተመራጩ 16ሚሜ) ሲሆን፤ በአምዶች መገጣጠሚያ ላይ ቢያንስ 40 እጥፍ የብረት ውፍረት የመደራረቢያ ርዝመት (Ld) ያስፈልጋል። 6ሚሜ፣ 8ሚሜ እና 10ሚሜ ብረቶች ለቢም በፍጹም ተስማሚ አይደሉም (በመሃል መቀደድና የ45° የጎንዮሽ መሰንጠቅ ያመጣሉ)። በይነ-መረባችን ላይ ያለውን "የሬባር ምህንድስና ላብራቶሪ" እንዲሞክሩ እንመክራለን!'
            : 'For Floor & Plinth Beams, IDEAL rebar sizes are 14mm, 16mm, and 20mm (Best: 16mm) with development lap lengths (Ld >= 40 bar diameters) at column cores. NON-IDEAL sizes (6mm, 8mm, 10mm) have insufficient flexural moment capacity, resulting in mid-span flexural rupture, 38cm excessive sag, and 45° diagonal shear tears near column joints. Test and verify your beam spans in our Interactive Structural Lab!',
          actions: [
            {
              label: preferAmharic ? '🧪 ወደ ሬባር ላብራቶሪ ሂድ' : '🧪 Open Structural Lab',
              href: '#structural-lab',
            },
            {
              label: preferAmharic ? '📞 ለምህንድስና ድጋፍ ደውል' : '📞 Call Engineering Desk',
              href: `tel:${CONTACT.phoneClean}`,
            },
            {
              label: preferAmharic ? '📝 የዋጋ መጠየቂያ' : '📝 Request Quote',
              href: '#quote',
            },
          ],
        };
      }

      // Case D: Slab (ጠፍጣፋ ወለልና ጣሪያ)
      if (q.includes('slab') || q.includes('ወለል') || q.includes('ጣሪያ')) {
        return {
          text: preferAmharic
            ? 'ለውፍረቱ 150ሚሜ ለሆነ ጠፍጣፋ ወለልና ጣሪያ (Slabs) ተስማሚው የብረት መጠን 8ሚሜ፣ 10ሚሜ እና 12ሚሜ (በጣም ተመራጩ 10ሚሜ) ነው። ⚠️ ወሳኝ ማስጠንቀቂያ፦ 6ሚሜ ስታፋ የወለል መረብን ስለሚቀድደው ተስማሚ አይደለም፤ በሌላ በኩል ደግሞ ወፍራም ብረቶችን (20ሚሜ፣ 24ሚሜ፣ 32ሚሜ) በ150ሚሜ ወለል ውስጥ መጠቀም ከመጠን በላይ (Over-reinforced) በማድረግ ኮንክሪቱ ሳይታጠፍ በድንገት እንዲፈነዳ (brittle explosive crushing) ስለሚያደርግ በጣም አደገኛ ነው! ይህንን በሬባር ላብራቶሪያችን (Interactive Structural Lab) በቀጥታ መሞከር ይችላሉ።'
            : 'For standard 150mm suspended Floor & Roof Slabs, IDEAL rebar sizes are 8mm, 10mm, and 12mm (Best: 10mm spaced at 150–200mm with spacer chairs). ⚠️ CRITICAL HAZARD: Under-sized 6mm coil tears under two-way load, while OVER-SIZED bars (20mm, 24mm, 32mm) create a hazardous "OVER-REINFORCED SECTION" where steel never yields, causing concrete to crush explosively in compression without ductile warning! We strongly recommend simulating slab loads in our Interactive Structural Lab.',
          actions: [
            {
              label: preferAmharic ? '🧪 ወደ ሬባር ላብራቶሪ ሂድ' : '🧪 Open Structural Lab',
              href: '#structural-lab',
            },
            {
              label: preferAmharic ? '📞 ለምህንድስና ድጋፍ ደውል' : '📞 Call Engineering Desk',
              href: `tel:${CONTACT.phoneClean}`,
            },
            {
              label: preferAmharic ? '📝 የዋጋ መጠየቂያ' : '📝 Request Quote',
              href: '#quote',
            },
          ],
        };
      }

      // Case E: Staircase (የደረጃ መዋቅር)
      if (q.includes('stair') || q.includes('ደረጃ')) {
        return {
          text: preferAmharic
            ? 'ለደረጃ መዋቅር (Stairs) ተስማሚው የብረት መጠን 12ሚሜ፣ 14ሚሜ እና 16ሚሜ (በጣም ተመራጩ 12ሚሜ) ሲሆን፤ ከወለልና ከመሬት ጋሪዎች ጋር በጥልቅ ታስሮ መዋሃድ አለበት። 6ሚሜ ስታፋ በሰዎች እንቅስቃሴ ንዝረት ስለሚበጠስ፤ እንዲሁም 20ሚሜ–32mm ከመጠን በላይ ወፍራም በመሆናቸው መታጠፊያ አንግላቸው ኮንክሪቱን ስለሚሰነጥቀው ተስማሚ አይደሉም። በይነ-መረባችን ላይ ያለውን "የሬባር ምህንድስና ላብራቶሪ" እንዲጠቀሙ እንመክራለን!'
            : 'For dog-legged concrete Staircases, IDEAL rebar sizes are 12mm, 14mm, and 16mm (Best: 12mm) anchored deeply into beam cores with cranked hooks to resist pedestrian dynamic vibrations. NON-IDEAL sizes include 6mm coil (snaps under dynamic impact fatigue) and over-sized 20mm–32mm bars (bend radius exceeds waist thickness, causing radial bursting tension and joint spalling). Test this in our on-page Interactive Structural Lab!',
          actions: [
            {
              label: preferAmharic ? '🧪 ወደ ሬባር ላብራቶሪ ሂድ' : '🧪 Open Structural Lab',
              href: '#structural-lab',
            },
            {
              label: preferAmharic ? '📞 ለምህንድስና ድጋፍ ደውል' : '📞 Call Engineering Desk',
              href: `tel:${CONTACT.phoneClean}`,
            },
            {
              label: preferAmharic ? '📝 የዋጋ መጠየቂያ' : '📝 Request Quote',
              href: '#quote',
            },
          ],
        };
      }

      // Case F: General Structural Advisory / Complete Building Parts Guide
      return {
        text: preferAmharic
          ? 'የኛ ትሬዲንግ በህንጻ መዋቅር 5 ዋና ዋና ክፍሎች ላይ ተስማሚ የሬባር ምርጫዎችን ይመክራል፦\n\n1. መሠረት (Footings)፦ 14–20ሚሜ (16ሚሜ ምርጥ)፤ ቢያንስ 50ሚሜ ሽፋን። 6–10ሚሜ መሰንጠቅ ያመጣሉ።\n2. አምድ (Columns)፦ 16–24ሚሜ (20ሚሜ ምርጥ) + 6ሚሜ ስታፋ ማሰሪያ። 6–12ሚሜ መጣመም (Euler buckling) ያመጣሉ።\n3. ጋሪ (Beams)፦ 14–20ሚሜ (16ሚሜ ምርጥ)። 6–10ሚሜ በመሃል መሰበርና መስመጥ ያመጣሉ።\n4. ወለል (Slabs 150mm)፦ 8–12ሚሜ (10ሚሜ ምርጥ)። ⚠️ 20–32ሚሜ ከመጠን በላይ (over-reinforced) በመሆኑ ኮንክሪቱ በድንገት እንዲፈነዳ ስለሚያደርግ የተከለከለ ነው!\n5. ደረጃ (Stairs)፦ 12–16ሚሜ (12ሚሜ ምርጥ)።\n\nለህንጻዎ ትክክለኛውን የክብደትና የመሬት መንቀጥቀጥ ጫና በቀጥታ ለመፈተሽ "የሬባር ምህንድስና ላብራቶሪ" (Interactive Structural Lab) እንዲጠቀሙ እንመክራለን!'
          : 'Yegna Trading engineering guidelines for building structural stages:\n\n1. Footings & Foundation: 14mm, 16mm, 20mm (Best: 16mm). Min 50mm cover. (6mm–10mm risk punching shear failure).\n2. Columns & Stirrups: 16mm, 20mm, 24mm (Best: 20mm) + 6mm staffa stirrups at 100mm joints. (6mm–12mm cause violent Euler buckling).\n3. Beams: 14mm, 16mm, 20mm (Best: 16mm) with Ld ≥ 40d. (6mm–10mm cause midspan rupture and >38cm sag).\n4. Slabs (150mm): 8mm, 10mm, 12mm (Best: 10mm). ⚠️ CRITICAL: Avoid 20mm–32mm over-reinforced brittle crushing danger!\n5. Stairs: 12mm, 14mm, 16mm (Best: 12mm). (Avoid 6mm fatigue snap or 20mm+ bursting).\n\nWe strongly recommend testing your complete structural frame in our on-page Interactive Structural Lab to simulate live 1,420–2,130 kN gravity and seismic loads!',
        actions: [
          {
            label: preferAmharic ? '🧪 ወደ ሬባር ላብራቶሪ ሂድ' : '🧪 Open Structural Lab',
            href: '#structural-lab',
          },
          {
            label: preferAmharic ? '📞 ለምህንድስና ድጋፍ ደውል' : '📞 Call Engineering Desk',
            href: `tel:${CONTACT.phoneClean}`,
          },
          {
            label: preferAmharic ? '📝 የዋጋ መጠየቂያ' : '📝 Request Quote',
            href: '#quote',
          },
        ],
      };
    }

    // 1.5 Material Availability & Stock Inquiries (e.g. "do you have rebar", "is steel in stock", "ፌሮ አለ", "ሲሚንቶ አላችሁ")
    const isStockInquiry =
      (
        q.includes('in stock') ||
        q.includes('out of stock') ||
        q.includes('available') ||
        q.includes('availability') ||
        q.includes('do you have') ||
        q.includes('do u have') ||
        q.includes('have rebar') ||
        q.includes('have cement') ||
        q.includes('have steel') ||
        q.includes('አላችሁ') ||
        q.includes('አለዎት') ||
        q.includes('ይገኛል') ||
        q.includes('ይኖራል') ||
        q.includes('ስቶክ') ||
        q.includes('ክምችት') ||
        q.includes('ፌሮ አለ') ||
        q.includes('ብረት አለ') ||
        q.includes('ሲሚንቶ አለ') ||
        q.includes('ስታፋ አለ') ||
        q.includes('ፕላይዉድ አለ') ||
        q === 'ፌሮ' ||
        q === 'ብረት' ||
        q === 'rebar' ||
        q === 'fero'
      ) &&
      !q.includes('recommend') &&
      !q.includes('building') &&
      !q.includes('ምክር') &&
      !q.includes('how many') &&
      !q.includes('calculate') &&
      !q.includes('weight');

    if (isStockInquiry) {
      // If asking specifically about cement availability
      if (q.includes('cement') || q.includes('ሲሚንቶ') || q.includes('ሙገር') || q.includes('ዳንጎቴ')) {
        return {
          text: preferAmharic
            ? 'አዎ! ዳንጎቴና ሙገር OPC (42.5N) እና PPC (32.5R) ሲሚንቶ በበቂ ክምችት በመጋዘናችን ይገኛል። በ50 ኪ.ግ የታሸገ ወይም በቦቴ (Bulk) በፍጥነት እናቀርባለን።'
            : 'Yes! We have fresh mill Dangote and Mugher OPC (42.5N) and PPC (32.5R) cement in stock in 50kg bags and bulk tankers ready for delivery or pickup.',
          actions: [
            {
              label: preferAmharic ? '📞 ለሽያጭ ደውል (+251 943 00 00 05)' : '📞 Call Sales Hotline',
              href: `tel:${CONTACT.phoneClean}`,
            },
            {
              label: preferAmharic ? '📝 የዋጋ መጠየቂያ' : '📝 Request Quote',
              href: '#quote',
            },
          ],
        };
      }

      // If asking specifically about staffa / wire availability
      if (q.includes('staffa') || q.includes('ስታፋ') || q.includes('ሽቦ')) {
        return {
          text: preferAmharic
            ? 'አዎ! 6ሚሜ ከፍተኛ ጥንካሬ ያለው የስታፋ ብረት ሽቦ (Staffa Coil) ለማሰሪያና ለሊንክስ በበቂ ክምችት በመጋዘናችን አለን።'
            : 'Yes! We stock 6mm high-tensile staffa steel wire coils for column stirrups and structural ties in our warehouse.',
          actions: [
            {
              label: preferAmharic ? '📞 ለሽያጭ ደውል' : '📞 Call Sales',
              href: `tel:${CONTACT.phoneClean}`,
            },
            {
              label: preferAmharic ? '📝 የዋጋ መጠየቂያ' : '📝 Request Quote',
              href: '#quote',
            },
          ],
        };
      }

      // If asking specifically about plywood availability
      if (q.includes('plywood') || q.includes('ፕላይዉድ') || q.includes('ሳንቃ')) {
        return {
          text: preferAmharic
            ? 'አዎ! ፊልም የተለበጠ (Film-faced) እና ማሪን ግሬድ የኮንክሪት ፕላይዉድ በበቂ ክምችት በመጋዘናችን ይገኛል።'
            : 'Yes! We have certified phenolic film-faced marine formwork plywood sheets in stock for smooth concrete casting.',
          actions: [
            {
              label: preferAmharic ? '📞 ለሽያጭ ደውል' : '📞 Call Sales',
              href: `tel:${CONTACT.phoneClean}`,
            },
            {
              label: preferAmharic ? '📝 የዋጋ መጠየቂያ' : '📝 Request Quote',
              href: '#quote',
            },
          ],
        };
      }

      // Rebar / Fero / General Steel Availability (e.g. "ፌሮ አለ", "ብረት አለ", "do you have rebar", "is steel in stock")
      return {
        text: preferAmharic
          ? 'አዎ! የኛ ትሬዲንግ (Yegna Trading PLC) ከ8ሚሜ እስከ 32ሚሜ ደረጃቸውን የጠበቁ Grade 75 ፌሮ ብረቶች (ባለ 12 ሜትር ሙሉ ርዝመት) በበቂ ስቶክ በመጋዘናችን ይገኛሉ። እንዲሁም 6ሚሜ ስታፋ፣ ዳንጎቴና ሙገር ሲሚንቶ አለን። የሚፈልጉትን መጠን ወይም ዲያሜትር (ሚሜ) ይንገሩን!'
          : 'Yes! Yegna Trading PLC maintains extensive warehouse stock of certified Grade 75 deformed rebar (from 8mm up to 32mm, full 12-meter lengths), 6mm staffa wire coils, Dangote & Mugher cement, and formwork plywood ready for immediate dispatch or truck pickup.',
        actions: [
          {
            label: preferAmharic ? '⚖️ የፌሮ ክብደትና ልኬት' : '⚖️ Rebar Sizes & Weights',
            href: '#structural-lab',
          },
          {
            label: preferAmharic ? '📞 ለሽያጭ መስመር ደውል' : '📞 Call Sales Hotline',
            href: `tel:${CONTACT.phoneClean}`,
          },
          {
            label: preferAmharic ? '🗺️ የመጋዘን አድራሻ' : '🗺️ Warehouse Location',
            href: 'https://maps.app.goo.gl/iT4jNjBeeoQgr2JEA',
          },
          {
            label: preferAmharic ? '📝 የዋጋ መጠየቂያ ቅጽ' : '📝 Request Official Quote',
            href: '#quote',
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

    // 3. Warehouse / Depot Location (Direct Navigation)
    if (
      q.includes('warehouse') ||
      q.includes('depot') ||
      q.includes('store') ||
      q.includes('storage') ||
      q.includes('መጋዘን') ||
      q.includes('ስቶር') ||
      q.includes('ክምችት') ||
      q.includes('pickup') ||
      q.includes('ማከማቻ')
    ) {
      return {
        text: preferAmharic
          ? 'አዎ! የኛ ትሬዲንግ (Yegna Trading PLC) የራሱ የሆነ ሰፊና ሙሉ በሙሉ የተደራጀ የኮንስትራክሽን ግብአቶች መጋዘን አለው። ደንበኞች እቃ ለመመልከት፣ በሚዛን ለማስመዘን ወይም በራሳቸው መኪና በቀጥታ ለመጫን መምጣት ይችላሉ። የመጋዘኑ የቀጥታ የጉግል ካርታ (Google Maps) አድራሻ፦ https://maps.app.goo.gl/iT4jNjBeeoQgr2JEA'
          : 'Yes! Yegna Trading PLC operates its own dedicated, fully stocked physical warehouse and central depot for rebar, cement, and formwork plywood. You can visit directly for material inspection, weigh-bridge verification, or truck pickup. Navigate directly via Google Maps: https://maps.app.goo.gl/iT4jNjBeeoQgr2JEA',
        actions: [
          {
            label: preferAmharic ? '🗺️ ወደ መጋዘኑ ሂድ (Google Maps)' : '🗺️ Navigate to Warehouse (Google Maps)',
            href: 'https://maps.app.goo.gl/iT4jNjBeeoQgr2JEA',
          },
          {
            label: preferAmharic ? '🏢 ዋና ቢሮ (ካዛንቺስ)' : '🏢 Kazanchis HQ (Office)',
            href: 'https://maps.app.goo.gl/FQVCfhaxFvV8goy7A?g_st=atm',
          },
          {
            label: preferAmharic ? '📞 ለሽያጭ ደውል' : '📞 Call Sales Desk',
            href: `tel:${CONTACT.phoneClean}`,
          },
        ],
      };
    }

    // 3.1 Headquarters Office / Address
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

    // 3.2 Operating Schedule & Working Hours (e.g. "Working hours", "Contact Hours", "የስራ ሰዓት", "Are you open on Sunday?")
    if (
      q.includes('hour') ||
      q.includes('working') ||
      q.includes('schedule') ||
      q.includes('time') ||
      q.includes('open') ||
      q.includes('close') ||
      q.includes('sunday') ||
      q.includes('saturday') ||
      q.includes('weekend') ||
      q.includes('ሰዓት') ||
      q.includes('የስራ ሰዓት') ||
      q.includes('ክፍት') ||
      q.includes('ዝግ')
    ) {
      return {
        text: preferAmharic
          ? 'የስራ ሰዓታችን፦ ከሰኞ እስከ አርብ ከጠዋቱ 2:30 እስከ 11:30 (08:30 AM – 05:30 PM)፣ ቅዳሜ ከጠዋቱ 2:30 እስከ 6:30 (08:30 AM – 12:30 PM) ክፍት ነው። እሁድ ዝግ ነው። በስራ ሰዓት በስልክ (+251 943 00 00 05 / +251 941 15 15 15) ወይም በማንኛውም ሰዓት በቴሌግራም @Yegna_Tradingplc ያግኙን!'
          : 'Our working hours are: Monday – Friday from 08:30 AM – 05:30 PM, Saturday from 08:30 AM – 12:30 PM. We are closed on Sunday. Reach our desk at +251 943 00 00 05 or on Telegram @Yegna_Tradingplc.',
        actions: [
          {
            label: preferAmharic ? '📞 አሁን ይደውሉ' : '📞 Call Head Office',
            href: `tel:${CONTACT.phoneClean}`,
          },
          {
            label: preferAmharic ? '💬 በቴሌግራም አውራ' : '💬 Chat on Telegram',
            href: CONTACT.telegram,
          },
          {
            label: preferAmharic ? '📍 የቢሮ አድራሻ (ካዛንቺስ)' : '📍 Office Location (Kazanchis)',
            href: 'https://maps.app.goo.gl/FQVCfhaxFvV8goy7A?g_st=atm',
          },
        ],
      };
    }

    // 3.3 Product Catalog / What do you sell (e.g. "what products do you sell", "catalog", "materials", "ምን ምን አላችሁ")
    if (
      q.includes('what do you sell') ||
      q.includes('product') ||
      q.includes('material') ||
      q.includes('catalog') ||
      q.includes('ምን ምን አላችሁ') ||
      q.includes('ምን ትሸጣላችሁ') ||
      q.includes('ምርቶች')
    ) {
      return {
        text: preferAmharic
          ? 'የኛ ትሬዲንግ (Yegna Trading PLC) የሚያቀርባቸው ዋና ዋና የኮንስትራክሽን ግብአቶች፦ 1) Grade 75 ፌሮ ብረት (ከ8ሚሜ እስከ 32ሚሜ ባለ 12 ሜትር ርዝመት)፣ 2) 6ሚሜ ስታፋ የሽቦ ኮይል፣ 3) ዳንጎቴና ሙገር OPC (42.5N) እና PPC (32.5R) ሲሚንቶ፣ 4) ፊልም የተለበጠ የኮንክሪት ፕላይዉድ ናቸው።'
          : 'Yegna Trading PLC supplies four certified construction product lines: 1) Grade 75 deformed steel rebar (8mm–32mm in full 12m bars), 2) 6mm high-tensile staffa wire coils, 3) Dangote & Mugher OPC (42.5N) and PPC (32.5R) cement, and 4) Phenolic film-faced marine formwork plywood.',
        actions: [
          {
            label: preferAmharic ? '🧱 ምርቶችን በሙሉ ተመልከት' : '🧱 View Product Catalog',
            href: '/products/',
          },
          {
            label: preferAmharic ? '📝 የዋጋ መጠየቂያ' : '📝 Request Quote',
            href: '#quote',
          },
          {
            label: preferAmharic ? '📞 የሽያጭ መስመር' : '📞 Call Sales Hotline',
            href: `tel:${CONTACT.phoneClean}`,
          },
        ],
      };
    }

    // 3.4 Payment Methods & Invoicing (e.g. "payment", "bank transfer", "cbe", "telebirr", "ክፍያ", "ባንክ")
    if (
      q.includes('pay') ||
      q.includes('bank') ||
      q.includes('telebirr') ||
      q.includes('cbe') ||
      q.includes('cheque') ||
      q.includes('check') ||
      q.includes('receipt') ||
      q.includes('vat') ||
      q.includes('ክፍያ') ||
      q.includes('ባንክ') ||
      q.includes('ቼክ') ||
      q.includes('ቴሌብር') ||
      q.includes('ደረሰኝ') ||
      q.includes('ቫት')
    ) {
      return {
        text: preferAmharic
          ? 'ክፍያ በባንክ ዝውውር (CBE እና ሌሎች ባንኮች)፣ በቴሌብር (Telebirr) ወይም በህጋዊ ቼክ መቀበል እንችላለን። ሁሉም ሽያጮቻችን ሙሉ የህጋዊ ቫት (VAT) ካሽ ሬጂስተር ደረሰኝ እና የጥራት ሰርተፊኬት አላቸው።'
          : 'We accept bank transfers (CBE, Awash, etc.), Telebirr SuperApp, and certified company cheques. All purchases include legal VAT fiscal cash receipts and laboratory mill test certificates (MTC).',
        actions: [
          {
            label: preferAmharic ? '📞 የፋይናንስ / ሽያጭ መስመር' : '📞 Contact Sales / Finance',
            href: `tel:${CONTACT.phoneClean}`,
          },
          {
            label: preferAmharic ? '📝 የዋጋ መጠየቂያ ቅጽ' : '📝 Request Official Quote',
            href: '#quote',
          },
        ],
      };
    }

    // 3.5 Specific Quantity & Rebar Weight Calculation (e.g., "how many kg is 400pcs of 16mm grade 75 rebar", "400 pcs 16mm", "400 ፍሬ 16ሚሜ")
    const rebarWeights: Record<number, { kgPerBar: number; unitWeight: number; pcsPerQuintal: number }> = {
      8: { kgPerBar: 4.74, unitWeight: 0.395, pcsPerQuintal: 21.1 },
      10: { kgPerBar: 7.40, unitWeight: 0.617, pcsPerQuintal: 13.5 },
      12: { kgPerBar: 10.66, unitWeight: 0.888, pcsPerQuintal: 9.38 },
      14: { kgPerBar: 14.52, unitWeight: 1.210, pcsPerQuintal: 6.89 },
      16: { kgPerBar: 18.96, unitWeight: 1.580, pcsPerQuintal: 5.27 },
      20: { kgPerBar: 29.64, unitWeight: 2.470, pcsPerQuintal: 3.37 },
      24: { kgPerBar: 42.66, unitWeight: 3.550, pcsPerQuintal: 2.34 },
      32: { kgPerBar: 75.72, unitWeight: 6.310, pcsPerQuintal: 1.32 },
    };

    const diaMatch =
      q.match(/(?:^|\D)(8|10|12|14|16|20|24|32)\s*(?:mm|ሚሜ)/i) ||
      q.match(/(?:mm|ሚሜ|size|diameter|ባለ)\s*(8|10|12|14|16|20|24|32)(?:\D|$)/i);
    const qtyMatch =
      q.match(/(\d[\d,]*)\s*(?:pcs|pieces|bars?|ፍሬ|ባር)/i) ||
      q.match(/(?:how many kg is|weight of|calculate|ስንት ኪሎ ነው)\s*(\d[\d,]*)/i) ||
      q.match(/(\d[\d,]*)\s*(?:of\s*)?(?:8|10|12|14|16|20|24|32)\s*mm/i);

    if (diaMatch && qtyMatch) {
      const dia = parseInt(diaMatch[1], 10);
      const qty = parseInt(qtyMatch[1].replace(/,/g, ''), 10);
      const spec = rebarWeights[dia];
      if (spec && qty > 0) {
        const totalKg = Number((qty * spec.kgPerBar).toFixed(2));
        const quintals = Number((totalKg / 100).toFixed(2));
        const tons = Number((totalKg / 1000).toFixed(3));

        return {
          text: preferAmharic
            ? `${qty.toLocaleString()} ፍሬ ${dia}ሚሜ Grade 75 ባለ 12 ሜትር ብረት በትክክል ${totalKg.toLocaleString()} ኪ.ግ (${quintals.toLocaleString()} ኩንታል ወይም ~${tons.toLocaleString()} ሜትሪክ ቶን) ይመዝናል። ይህም በደረጃው መሠረት አንዱ ባለ 12 ሜትር ብረት ${spec.kgPerBar} ኪ.ግ (${spec.unitWeight} ኪ.ግ/ሜትር) በመሆኑ ነው።`
            : `${qty.toLocaleString()} pieces of ${dia}mm Grade 75 rebar (12m length) weighs exactly ${totalKg.toLocaleString()} kg (${quintals.toLocaleString()} quintals or ~${tons.toLocaleString()} metric tons), based on the official standard of ${spec.kgPerBar} kg per 12m bar (${spec.unitWeight} kg/m).`,
          actions: [
            {
              label: preferAmharic ? '📞 የዋጋ መረጃ ይጠይቁ' : '📞 Call Sales for Pricing',
              href: `tel:${CONTACT.phoneClean}`,
            },
            {
              label: preferAmharic ? '📝 የዋጋ መጠየቂያ ቅጽ' : '📝 Request Official Quote',
              href: '#quote',
            },
            {
              label: preferAmharic ? '🧪 ወደ ሬባር ላብራቶሪ' : '🧪 Open Rebar Lab Calculator',
              href: '#structural-lab',
            },
          ],
        };
      }
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

    // 4.5 Engineering & Technical Insights (from official technical blog & FAQ)
    if (
      (q.includes('opc') && q.includes('ppc')) ||
      (q.includes('difference') && (q.includes('cement') || q.includes('grade'))) ||
      q.includes('ልዩነት') ||
      q.includes('grade 60') ||
      q.includes('grade 75 vs') ||
      q.includes('weighbridge') ||
      q.includes('weigh bridge') ||
      q.includes('cut plywood') ||
      q.includes('circular saw')
    ) {
      if (q.includes('grade 60') || q.includes('grade 75 vs')) {
        return {
          text: preferAmharic
            ? 'ደረጃ 75 (Grade 75) ሬባር ከ500–520+ MPa በላይ የመሸከም አቅም ያለው ሲሆን፣ ከመደበኛው Grade 60 (415 MPa) ጋር ሲነጻጸር ከ15%–20% አነስተኛ ብረት በመጠቀም የሕንፃውን ጥንካሬ አስተማማኝ ለማድረግ እና የትራንስፖርት ወጪን ለመቀነስ ያስችላል።'
            : 'Grade 75 rebar delivers 500–520+ MPa yield strength versus standard Grade 60 (415–420 MPa). This allows structural engineers to reduce total rebar tonnage by ~15–20% while maintaining superior tensile capacity and lowering dead load.',
          actions: [
            {
              label: preferAmharic ? '📋 የብረት ዝርዝር' : '📋 View Rebar Specs',
              href: '/products/',
            },
            {
              label: preferAmharic ? '📖 የብሎግ ጽሑፎች' : '📖 Read Technical Articles',
              href: '/insights/',
            },
          ],
        };
      }
      if (q.includes('cut plywood') || q.includes('circular saw') || q.includes('saw')) {
        return {
          text: preferAmharic
            ? 'ፕላይዉድ በሰርኩላር ሶው ሲቆረጥ የጠርዝ መሰንጠቅ እንዳይፈጠር ከ60–80 ጥርስ ያለው ጥሩ የካርባይድ ምላጭ መጠቀም፣ የቆራጭ መስመሩን አስቀድሞ ምልክት ማድረግ እና ጫፎቹን በውሃ መከላከያ ማሸግ ይመከራል።'
            : 'When cutting formwork plywood with a circular saw, use a fine-tooth carbide blade (60–80 teeth) and score the cut line to prevent face tear-out. Clean, sealed edges prevent water intrusion for maximum reuse cycles.',
          actions: [
            {
              label: preferAmharic ? '📖 የብሎግ መመሪያ' : '📖 Read Full Guide',
              href: '/insights/',
            },
          ],
        };
      }
      return {
        text: preferAmharic
          ? 'OPC ሲሚንቶ (42.5N/R) በፍጥነት ጥንካሬ ስለሚይዝ ለምሰሶዎች፣ ጨረሮችና አስቸኳይ የኮንክሪት ሥራዎች ይመረጣል። PPC ሲሚንቶ (32.5R) ደግሞ ስንጥቆችን የሚከላከልና የውሃ ውስጥ ኬሚካሎችን የሚቋቋም በመሆኑ ለመሠረት፣ ለማለስለስና ለግንብ ሥራዎች ተመራጭ ነው።'
          : 'OPC cement (42.5N/R) achieves rapid early compressive strength—ideal for columns, beams, and early shuttering removal. PPC cement (32.5R) generates lower hydration heat to prevent thermal cracking and offers superior long-term impermeability for foundations and masonry.',
        actions: [
          {
            label: preferAmharic ? '🧱 የሲሚንቶ ምርቶች' : '🧱 View Cement Products',
            href: '/products/',
          },
          {
            label: preferAmharic ? '📖 የብሎግ ጽሑፎች' : '📖 Read Technical Guide',
            href: '/insights/',
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
            const isStructuralQuery =
              trimmed.toLowerCase().includes('structural') ||
              trimmed.toLowerCase().includes('lab') ||
              trimmed.toLowerCase().includes('column') ||
              trimmed.toLowerCase().includes('beam') ||
              trimmed.toLowerCase().includes('slab') ||
              trimmed.toLowerCase().includes('footing') ||
              trimmed.toLowerCase().includes('foundation') ||
              trimmed.toLowerCase().includes('stair') ||
              trimmed.toLowerCase().includes('ideal') ||
              trimmed.toLowerCase().includes('rebar') ||
              trimmed.toLowerCase().includes('ላብራቶሪ') ||
              trimmed.toLowerCase().includes('አምድ') ||
              trimmed.toLowerCase().includes('መሠረት') ||
              trimmed.toLowerCase().includes('ጋሪ') ||
              trimmed.toLowerCase().includes('ወለል') ||
              trimmed.toLowerCase().includes('ደረጃ') ||
              trimmed.toLowerCase().includes('ምክር') ||
              aiText.toLowerCase().includes('structural lab') ||
              aiText.toLowerCase().includes('ላብራቶሪ');

            const dynamicActions = isStructuralQuery
              ? [
                  {
                    label: preferAmharic ? '🧪 ወደ ሬባር ላብራቶሪ ሂድ' : '🧪 Open Structural Lab',
                    href: '#structural-lab',
                  },
                  {
                    label: preferAmharic ? '📞 ለምህንድስና ደውል' : '📞 Call Engineering Desk',
                    href: `tel:${CONTACT.phoneClean}`,
                  },
                  {
                    label: preferAmharic ? '📝 የዋጋ መጠየቂያ' : '📝 Request Quote',
                    href: '#quote',
                  },
                ]
              : [
                  {
                    label: preferAmharic ? '📞 ደውል (+251 943 00 00 05)' : '📞 Call Hotline',
                    href: `tel:${CONTACT.phoneClean}`,
                  },
                  {
                    label: preferAmharic ? '📝 የዋጋ መጠየቂያ' : '📝 Request Quote',
                    href: '#quote',
                  },
                ];

            setMessages((prev) => [
              ...prev,
              {
                id: `b-${Date.now()}`,
                sender: 'bot',
                text: aiText.trim(),
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                actions: dynamicActions,
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
        {showTeaser && !isOpen && !isScrolledDown && (
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
                className="inline-flex items-center gap-1.5 rounded-full bg-panel2/90 hover:bg-emerald-500/15 border border-line hover:border-emerald-500/50 px-2.5 py-1 text-[0.68rem] font-semibold text-ink transition-colors cursor-pointer shadow-2xs"
              >
                <MapPin className="h-3 w-3 text-emerald-500" />
                <span>{lang === 'am' ? 'ካዛንቺስ ቢሮ' : 'Kazanchis HQ'}</span>
              </motion.button>

              <motion.button
                type="button"
                whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -1 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                onClick={() =>
                  handleQuickChip(
                    lang === 'am'
                      ? 'የህንጻ ክፍሎች ተስማሚ የብረት መጠን ምክር እና የሬባር ላብራቶሪ'
                      : 'Rebar recommendations for building parts and Structural Lab'
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-full bg-panel2/90 hover:bg-cyan-500/15 border border-line hover:border-cyan-500/50 px-2.5 py-1 text-[0.68rem] font-semibold text-ink transition-colors cursor-pointer shadow-2xs"
              >
                <Layers className="h-3 w-3 text-cyan-500" />
                <span>{lang === 'am' ? 'ሬባር ላብራቶሪ' : 'Structural Lab'}</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================================================================== */}
      {/* 2. PERSISTENT CORNER FLOATING TRIGGER BUTTON (WITH EAGER HOP)        */}
      {/* ===================================================================== */}
      <motion.div
        animate={
          isScrolledDown && !isOpen
            ? { y: 110, opacity: 0, pointerEvents: 'none' }
            : { y: 0, opacity: 1, pointerEvents: 'auto' }
        }
        transition={{ type: 'spring', stiffness: 360, damping: 28 }}
        className="fixed bottom-[74px] md:bottom-6 right-4 sm:right-6 z-40 select-none"
      >
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
      </motion.div>

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
