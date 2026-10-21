export const CONTACT = {
  phone: '+251 943 00 00 05',
  phoneClean: '+251943000005',
  phones: [
    { label: 'Sales & Orders', number: '+251 943 00 00 05', tel: '+251943000005' },
    { label: 'Customer Support', number: '+251 941 15 15 15', tel: '+251941151515' },
  ],
  email: 'info@Yegnatradingethiopia.com',
  hq: 'Kazanchis Joburg Plaza 5th floor, Addis Ababa, Ethiopia',
  hqPlusCode: '2Q7F+H7, Addis Ababa',
  hours: [
    { day: 'Monday – Friday', time: '08:30 AM – 5:30 PM' },
    { day: 'Saturday', time: '08:30 AM – 12:30 PM' },
  ],
  helpDeskUrl: 'https://yegnatrading.crisp.help/en/',
  companyProfileUrl: 'https://drive.google.com/file/d/1TWE42u94PPmXz6wMW0-0htNIPRT1E4YV/view',
  telegram: 'https://t.me/Yegna_Tradingplc',
  linktree: 'https://linktr.ee/yegnaTrading',
};

export type NavSublink = {
  label: string;
  amLabel: string;
  href: string;
  description?: string;
  amDescription?: string;
};

export type NavLink = {
  label: string;
  amLabel: string;
  href: string;
  sublinks?: NavSublink[];
};

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', amLabel: 'መነሻ', href: '/' },
  {
    label: 'About Us',
    amLabel: 'ስለ እኛ',
    href: '/about/',
    sublinks: [
      {
        label: 'Who We Are',
        amLabel: 'ስለ እኛ',
        href: '/about/#about',
        description: 'Our story, mission & corporate values',
        amDescription: 'ታሪካችን፣ ተልዕኳችንና የድርጅት እሴቶች',
      },
      {
        label: 'Why Yegna',
        amLabel: 'ለምን የኛ?',
        href: '/about/#why',
        description: 'Grade 75 mill test certified quality guarantees',
        amDescription: 'የተረጋገጠ የጥራት ዋስትናና ደረጃዎች',
      },
      {
        label: 'Our Team',
        amLabel: 'አመራርና ቡድናችን',
        href: '/about/#team',
        description: 'Executive leadership & supply specialists',
        amDescription: 'የሥራ አመራር ቦርድና ባለሙያዎች',
      },
      {
        label: 'Head Office & Map',
        amLabel: 'ዋና መሥሪያ ቤትና ካርታ',
        href: '/contact/#branches',
        description: 'Kazanchis Joburg Plaza 5th floor & map',
        amDescription: 'ካዛንቺስ ጆበርግ ፕላዛ 5ኛ ፎቅና ካርታ',
      },
    ],
  },
  { label: 'Products', amLabel: 'ምርቶች', href: '/products/' },
  { label: 'Careers', amLabel: 'ክፍት የሥራ ቦታዎች', href: '/careers/' },
  { label: 'Blog', amLabel: 'ብሎግ', href: '/insights/' },
  { label: 'Contact', amLabel: 'ያግኙን', href: '/contact/' },
];

export const SOCIALS = [
  { label: 'Telegram', href: 'https://t.me/Yegna_Tradingplc' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@yegna_trading' },
  { label: 'YouTube', href: 'https://www.youtube.com/@yegnatrading' },
  { label: 'Facebook', href: 'https://web.facebook.com/profile.php?id=61566925694036' },
  { label: 'Instagram', href: 'https://www.instagram.com/yegnatradinget' },
  { label: 'X', href: 'https://x.com/yegnatrading' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/yegna-trading-plc' },
];

export const STATS = [
  { value: 10, suffix: '+', label: 'Years delivering quality', amLabel: 'ዓመታት በስኬት' },
  { value: 100, suffix: '%', label: 'Mill test certified', amLabel: 'የተረጋገጠ ጥራት' },
  { value: 9, suffix: '', label: 'Certified bar sizes', amLabel: 'የብረት ዓይነቶች' },
  { value: 98, suffix: '%', label: 'Satisfied contractors', amLabel: 'ረክተው የወጡ ደንበኞች' },
];

export type Product = {
  id: string;
  name: string;
  amName: string;
  tagline: string;
  copy: string;
  icon: 'rebar' | 'cement' | 'coil' | 'plywood';
  features: string[];
};

export const PRODUCTS: Product[] = [
  {
    id: 'rebar',
    name: 'Reinforcement Bar',
    amName: 'የኮንክሪት የብረት ቆራጭ (ሬባር)',
    tagline: 'Grade 75 · 8mm – 32mm',
    copy: 'High-strength deformed rebar conforming to Ethiopian & international standards for concrete tensile reinforcement.',
    icon: 'rebar',
    features: ['Grade 75 Yield Strength', 'High bonding ribs', 'Full metric stock', 'Batch certified'],
  },
  {
    id: 'cement',
    name: 'Portland Cement',
    amName: 'ሲሚንቶ (OPC እና PPC)',
    tagline: 'OPC & PPC Certified Bags',
    copy: 'High-grade Ordinary Portland Cement (OPC) & Pozzolana Portland Cement (PPC) for foundations, columns, and smooth finishing.',
    icon: 'cement',
    features: ['Fresh mill batches', 'High early strength', 'Weatherproof storage', 'Bulk & bagged'],
  },
  {
    id: 'coil',
    name: 'Steel Coil (Staffa)',
    amName: 'ስታፋ (6ሚሜ የብረት ጥቅል)',
    tagline: '6mm High-Tensile Wire',
    copy: 'Uniform ductility steel wire coil engineered for column stirrups, beam ties, mesh, and structural bindings.',
    icon: 'coil',
    features: ['6mm diameter', 'Consistent tensile strength', 'Easy bending without crack', 'Tightly bundled'],
  },
  {
    id: 'plywood',
    name: 'Formwork Plywood',
    amName: 'ፕላይዉድ ለኮንስትራክሽን',
    tagline: 'Phenolic Film & Marine Grade',
    copy: 'Multi-layer durable wooden formwork sheets engineered for smooth concrete surfaces, moisture resistance, and high re-usability.',
    icon: 'plywood',
    features: ['High re-use cycles', 'Water-resistant glue', 'Smooth pour finish', 'Calibrated thickness'],
  },
];

export interface RebarSizeSpec {
  no: number;
  description: string;
  amDescription: string;
  diameter: string;
  mm: number;
  weightPer12mKg: number | string;
  unitWeightKgM: string;
  pcsPerKg: number | string; // legacy alias for backward compatibility
  pcsPerQuintal: string;
  application: string;
}

export const REBAR_CONVERSION_TABLE: RebarSizeSpec[] = [
  {
    no: 1,
    description: 'Steel coil (Staffa)',
    amDescription: 'ስታፋ 6ሚሜ የብረት ጥቅል',
    diameter: '6mm',
    mm: 6,
    weightPer12mKg: 'Coil / Variable',
    unitWeightKgM: '0.222 kg/m',
    pcsPerKg: 'Variable',
    pcsPerQuintal: 'Coil bundle',
    application: 'Column stirrups, structural links, tie rings',
  },
  {
    no: 2,
    description: 'Reinforcement Bar 8mm',
    amDescription: 'የብረት ቆራጭ 8ሚሜ',
    diameter: '8mm',
    mm: 8,
    weightPer12mKg: 4.74,
    unitWeightKgM: '0.395 kg/m',
    pcsPerKg: 4.74,
    pcsPerQuintal: '~21 pcs / quintal',
    application: 'Slab distribution bars, stairways, light foundations',
  },
  {
    no: 3,
    description: 'Reinforcement Bar 10mm',
    amDescription: 'የብረት ቆራጭ 10ሚሜ',
    diameter: '10mm',
    mm: 10,
    weightPer12mKg: 7.404,
    unitWeightKgM: '0.617 kg/m',
    pcsPerKg: 7.404,
    pcsPerQuintal: '~13.5 pcs / quintal',
    application: 'Floor slabs, grade beams, lintels, retaining walls',
  },
  {
    no: 4,
    description: 'Reinforcement Bar 12mm',
    amDescription: 'የብረት ቆራጭ 12ሚሜ',
    diameter: '12mm',
    mm: 12,
    weightPer12mKg: 10.656,
    unitWeightKgM: '0.888 kg/m',
    pcsPerKg: 10.656,
    pcsPerQuintal: '~9.4 pcs / quintal',
    application: 'Foundation pads, residential columns, cantilever beams',
  },
  {
    no: 5,
    description: 'Reinforcement Bar 14mm',
    amDescription: 'የብረት ቆራጭ 14ሚሜ',
    diameter: '14mm',
    mm: 14,
    weightPer12mKg: 14.52,
    unitWeightKgM: '1.210 kg/m',
    pcsPerKg: 14.52,
    pcsPerQuintal: '~6.9 pcs / quintal',
    application: 'Heavy foundation footings, framed structures, shear walls',
  },
  {
    no: 6,
    description: 'Reinforcement Bar 16mm',
    amDescription: 'የብረት ቆራጭ 16ሚሜ',
    diameter: '16mm',
    mm: 16,
    weightPer12mKg: 18.96,
    unitWeightKgM: '1.580 kg/m',
    pcsPerKg: 18.96,
    pcsPerQuintal: '~5.3 pcs / quintal',
    application: 'Multi-story structural columns, heavy transfer beams',
  },
  {
    no: 7,
    description: 'Reinforcement Bar 20mm',
    amDescription: 'የብረት ቆራጭ 20ሚሜ',
    diameter: '20mm',
    mm: 20,
    weightPer12mKg: 29.64,
    unitWeightKgM: '2.470 kg/m',
    pcsPerKg: 29.64,
    pcsPerQuintal: '~3.4 pcs / quintal',
    application: 'High-rise structural columns, bridges, deep footings',
  },
  {
    no: 8,
    description: 'Reinforcement Bar 24mm',
    amDescription: 'የብረት ቆራጭ 24ሚሜ',
    diameter: '24mm',
    mm: 24,
    weightPer12mKg: 42.66,
    unitWeightKgM: '3.550 kg/m',
    pcsPerKg: 42.66,
    pcsPerQuintal: '~2.3 pcs / quintal',
    application: 'Heavy commercial towers, mega raft foundations',
  },
  {
    no: 9,
    description: 'Reinforcement Bar 32mm',
    amDescription: 'የብረት ቆራጭ 32ሚሜ',
    diameter: '32mm',
    mm: 32,
    weightPer12mKg: 75.72,
    unitWeightKgM: '6.310 kg/m',
    pcsPerKg: 75.72,
    pcsPerQuintal: '~1.3 pcs / quintal',
    application: 'Mega infrastructure, deep pile caps, industrial facilities',
  },
];

export const PILLARS = [
  {
    n: '01',
    title: 'Reliable Quality',
    amTitle: 'አስተማማኝ ጥራት',
    copy: 'We carefully select certified rebar manufacturers so we can guarantee consistent Grade 75 strength on every delivery.',
    amCopy: 'ጥራታቸው የተረጋገጡ የአገር ውስጥና የውጭ አምራቾችን በጥንቃቄ በመምረጥ ወጥ ጥራት ያለው ሬባር እናቀርባለን።',
  },
  {
    n: '02',
    title: 'Reasonable Price',
    amTitle: 'ተመጣጣኝ ዋጋ',
    copy: 'The best doesn’t have to be overpriced. Direct mill relationships and transparent weight metrics keep our pricing fair.',
    amCopy: 'ምርጡ ጥራት ውድ መሆን የለበትም፤ ቀጥታ ከፋብሪካ በማቅረብ ፍትሃዊና ተወዳዳሪ ዋጋ እናቀርባለን።',
  },
  {
    n: '03',
    title: 'Timely Delivery',
    amTitle: 'ወቅቱን የጠበቀ አቅርቦት',
    copy: 'Construction timelines are non-negotiable. Direct logistics dispatch from our central Addis Ababa hub ensures prompt delivery directly to your job site.',
    amCopy: 'የግንባታ ጊዜ ውድ ነው፤ ከዋናው የአዲስ አበባ ማዕከላችን በቀጥታ ወደ ግንባታ ቦታዎ በወቅቱ እናደርሳለን።',
  },
  {
    n: '04',
    title: 'Ethics & Integrity',
    amTitle: 'ሥነ-ምግባርና ታማኝነት',
    copy: 'All business transactions follow legal, transparent, and ethical procedures with full fiscal receipts and certificates.',
    amCopy: 'ማንኛውም የንግድ ልውውጥ ሕጋዊ፣ ግልጽ እና ሥነ-ምግባርን የተከተለ አሠራር አለው።',
  },
];

export const VALUES = [
  { en: 'Business Integrity', am: 'የንግድ ታማኝነት' },
  { en: 'Professionalism', am: 'ሙያዊ ብቃት' },
  { en: 'Social Responsibility', am: 'ማኅበራዊ ኃላፊነት' },
  { en: 'Team Work', am: 'የቡድን ሥራ' },
  { en: 'Learning Organization', am: 'ቀጣይነት ያለው ትምህርት' },
  { en: 'Customer Orientation', am: 'ደንበኛ ተኮር አገልግሎት' },
];

export type Branch = {
  name: string;
  amName: string;
  phone: string;
  tel: string;
  address: string;
  plusCode: string;
  lat: number;
  lng: number;
  mapUrl: string;
};

export const HEAD_OFFICE: Branch = {
  name: 'Kazanchis Head Office',
  amName: 'የካዛንቺስ ዋና መሥሪያ ቤት',
  phone: '+251 943 00 00 05',
  tel: '+251943000005',
  address: 'Kazanchis Joburg Plaza, 5th Floor, Addis Ababa',
  plusCode: '2Q7F+H7',
  lat: 9.014,
  lng: 38.773222,
  mapUrl: 'https://maps.app.goo.gl/FQVCfhaxFvV8goy7A?g_st=atm',
};

export const BRANCHES: Branch[] = [HEAD_OFFICE];

export const TEAM = [
  {
    name: 'Ato Zelalem Alene',
    role: 'General Manager',
    amRole: 'ዋና ሥራ አስኪያጅ',
    photo: '/images/team-zelalem.jpg',
  },
  {
    name: 'Getahun Assefa',
    role: 'Supply Chain Director',
    amRole: 'የአቅርቦት ሰንሰለት ዳይሬክተር',
    photo: '/images/team-getahun.jpg',
  },
  {
    name: 'Abreham Andarge',
    role: 'Customer Relation Manager',
    amRole: 'የደንበኞች ግንኙነት ሥራ አስኪያጅ',
    photo: '/images/team-abreham.jpg',
  },
  {
    name: 'Hiwot Tilahun',
    role: 'Finance Manager',
    amRole: 'የፋይናንስ ሥራ አስኪያጅ',
    photo: '/images/team-hiwot.jpg',
  },
  {
    name: 'Mulugeta Awoke',
    role: 'MIS Manager',
    amRole: 'የመረጃ ስርዓት (MIS) ሥራ አስኪያጅ',
    photo: '/images/team-mulugeta.jpg',
  },
];

export const CSR_PHOTOS = [
  {
    url: '/images/blood-1.jpg',
    caption: 'Yegna Team Blood Donation Drive',
    amCaption: 'የየኛ ትሬዲንግ የደም ልገሳ መርሐ-ግብር',
  },
  {
    url: '/images/blood-2.jpg',
    caption: 'Giving back to save lives in our community',
    amCaption: 'ሕይወት ለማዳን ከማኅበረሰቡ ጋር በመቆም',
  },
  {
    url: '/images/blood-3.jpg',
    caption: 'Committed to corporate social responsibility',
    amCaption: 'ለማኅበራዊ ኃላፊነት ያለን ቁርጠኝነት',
  },
];

export const POSTS = [
  {
    id: 'post-1',
    title: 'ልዩ የዋጋ ቅናሽ ከአስተማማኝ የስቶክ ክምችት ጋር',
    amTitle: 'ልዩ የዋጋ ቅናሽ ከአስተማማኝ የስቶክ ክምችት ጋር',
    sub: 'Special price reduction backed by extensive warehouse stock across all Grade 75 metric sizes.',
    date: 'May 20, 2026',
    tag: 'Offers',
    category: 'Offers',
    href: 'https://yegnatradinget.com/%e1%88%8d%e1%8b%a9-%e1%8b%a8%e1%8b%8b%e1%8c%8b-%e1%89%85%e1%8a%93%e1%88%bd-%e1%8a%a8%e1%8a%a0%e1%88%b5%e1%89%b0%e1%88%9b%e1%88%9b%e1%8a%9d-%e1%8b%a8%e1%88%b5%e1%89%b6%e1%8a%ad-%e1%8a%ad%e1%88%9d/',
    summary: 'የኛ ትሬዲንግ ለግንባታ ባለቤቶች እና ተቋራጮች ጥራት ያለው ሬባር በልዩ ቅናሽ እና ፈጣን ማጓጓዣ አቅርቧል።',
  },
  {
    id: 'post-2',
    title: 'How to Cut Plywood with a Circular Saw: A Step-by-Step Guide',
    amTitle: 'ፕላይዉድ በሰርኩላር ሶው እንዴት በትክክል እንደሚቆረጥ',
    sub: 'Clean edges, zero tear-out, and precision dimensions for smooth concrete formwork casting.',
    date: 'July 28, 2025',
    tag: 'Plywood',
    category: 'Plywood',
    href: 'https://yegnatradinget.com/how-to-cut-plywood-with-a-circular-saw-a-step-by-step-guide/',
    summary: 'Master the right blade selection, zero-clearance cutting, and support technique for construction-grade plywood.',
  },
  {
    id: 'post-3',
    title: 'OPC vs PPC Cement: Deciding the Ideal Choice for House Construction',
    amTitle: 'OPC ወይስ PPC ሲሚንቶ፡ ለቤት ግንባታ የትኛው ይመረጣል?',
    sub: 'Comparing initial curing times, long-term durability, and structural strength for Ethiopian projects.',
    date: 'July 21, 2025',
    tag: 'Cement',
    category: 'Cement',
    href: 'https://yegnatradinget.com/opc-vs-ppc-cement-deciding-the-ideal-choice-for-house-construction/',
    summary: 'Understand when to use Ordinary Portland Cement (OPC) for rapid load bearing vs Portland Pozzolana Cement (PPC) for resistance to cracking.',
  },
  {
    id: 'post-4',
    title: 'Why Timely Rebar Delivery Is Essential for Construction Project Success',
    amTitle: 'የሬባር ወቅቱን የጠበቀ አቅርቦት ለምን ወሳኝ ነው?',
    sub: 'Avoiding costly pour delays, workforce downtime, and structural sequencing bottlenecks.',
    date: 'July 14, 2025',
    tag: 'Rebar',
    category: 'Rebar',
    href: 'https://yegnatradinget.com/why-timely-rebar-delivery-is-essential-for-construction-project-success/',
    summary: 'How strategic yard locations and dedicated logistics safeguard construction schedules and capital efficiency.',
  },
  {
    id: 'post-5',
    title: 'What is PPC in Cement?',
    amTitle: 'PPC ሲሚንቶ ምንድን ነው?',
    sub: 'Exploring Pozzolanic reactions, hydration heat reduction, and environmental durability benefits.',
    date: 'July 7, 2025',
    tag: 'Cement',
    category: 'Cement',
    href: 'https://yegnatradinget.com/what-is-ppc-in-cement/',
    summary: 'A deep dive into Portland Pozzolana Cement composition, pozzolanic ash properties, and hydraulic performance.',
  },
  {
    id: 'post-6',
    title: 'Benefits of Using Green Plywood in Construction and Furniture Making',
    amTitle: 'አረንጓዴ (ኢኮ) ፕላይዉድ በግንባታ ላይ ያለው ጠቀሜታ',
    sub: 'Eco-resins, weather resistance, and reduced environmental footprint on modern work sites.',
    date: 'June 30, 2025',
    tag: 'Plywood',
    category: 'Plywood',
    href: 'https://yegnatradinget.com/benefits-of-using-green-plywood-in-construction-and-furniture-making/',
    summary: 'Sustainable timber formwork materials that minimize chemical off-gassing while ensuring structural performance.',
  },
];

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
}

export const OPEN_JOBS: JobOpening[] = [
  // Currently no active listings per spec 4.6, so we show the required open application state
];
