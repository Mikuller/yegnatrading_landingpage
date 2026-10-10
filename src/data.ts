export const CONTACT = {
  phone: '+251 943 00 00 07',
  phones: ['+251 943 00 00 04', '+251 943 00 00 05', '+251 943 00 00 06', '+251 943 00 00 07'],
  email: 'info@yegnatradingethiopia.com',
  hq: 'Kazanchis, Joburg Building — 5th floor, Addis Ababa',
  hours: [
    { day: 'Monday – Friday', time: '8:30 AM – 5:30 PM' },
    { day: 'Saturday', time: '8:30 AM – 12:30 PM' },
  ],
};

export const NAV_LINKS = [
  { label: 'Company', href: '#company' },
  { label: 'Products', href: '#products' },
  { label: 'Why Yegna', href: '#why' },
  { label: 'Branches', href: '#branches' },
  { label: 'Team', href: '#team' },
  { label: 'Insights', href: '#insights' },
];

export const SOCIALS = [
  { label: 'Facebook', href: 'https://web.facebook.com/profile.php?id=61566925694036' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/yegna-trading-plc' },
  { label: 'Instagram', href: 'https://www.instagram.com/yegnatradinget' },
  { label: 'Telegram', href: 'https://t.me/yegnatrading' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@getyegna' },
];

export const STATS = [
  { value: 9, suffix: '+', label: 'Years of delivery' },
  { value: 7, suffix: '', label: 'Branches nationwide' },
  { value: 8, suffix: '', label: 'Rebar sizes in stock' },
  { value: 100, suffix: '%', label: 'Legally certified' },
];

export type Product = {
  id: string;
  name: string;
  tagline: string;
  copy: string;
  icon: 'rebar' | 'cement' | 'coil' | 'plywood';
};

export const PRODUCTS: Product[] = [
  {
    id: 'rebar',
    name: 'Steel Rebar',
    tagline: 'Grade 75 · 6–32mm',
    copy: 'Locally manufactured and imported reinforcement bars, quality-selected for consistent strength in every pour.',
    icon: 'rebar',
  },
  {
    id: 'cement',
    name: 'Cement',
    tagline: 'OPC & PPC',
    copy: 'Trusted cement brands for structural and finishing work — stocked deep, priced fair.',
    icon: 'cement',
  },
  {
    id: 'coil',
    name: 'Staffa Coil',
    tagline: '6mm steel coil',
    copy: 'High-tensile steel coil for binding, fencing and light reinforcement applications.',
    icon: 'coil',
  },
  {
    id: 'plywood',
    name: 'Plywood',
    tagline: 'Construction grade',
    copy: 'Formwork-grade plywood sheets that hold their shape pour after pour.',
    icon: 'plywood',
  },
];

export const REBAR_SIZES = [
  { mm: 8, kg: 4.74 },
  { mm: 10, kg: 7.404 },
  { mm: 12, kg: 10.656 },
  { mm: 14, kg: 14.52 },
  { mm: 16, kg: 18.96 },
  { mm: 20, kg: 29.64 },
  { mm: 24, kg: 42.66 },
  { mm: 32, kg: 75.72 },
];

export const PILLARS = [
  {
    n: '01',
    title: 'Reliable quality',
    copy: 'We carefully select rebar manufacturers so we can guarantee a consistent grade on every order.',
  },
  {
    n: '02',
    title: 'Reasonable price',
    copy: "The best doesn't have to be overpriced. Direct mill relationships keep our pricing sharp.",
  },
  {
    n: '03',
    title: 'Timely delivery',
    copy: 'Your schedule is our schedule. Stock-ready branches mean delivery when the site needs it.',
  },
  {
    n: '04',
    title: 'Ethics',
    copy: 'Every transaction follows legal and ethical procedure — certified, documented, traceable.',
  },
];

export const VALUES = [
  'Business Integrity',
  'Professionalism',
  'Social Responsibility',
  'Team Work',
  'Learning Organization',
  'Customer Orientation',
];

export type Branch = {
  name: string;
  phone: string;
  lat: number;
  lng: number;
  outside?: boolean;
};

export const BRANCHES: Branch[] = [
  { name: 'Bole', phone: '+251 943 181 818', lat: 8.997386, lng: 38.786621 },
  { name: 'Piasa', phone: '+251 943 000 004', lat: 9.029436, lng: 38.751989 },
  { name: 'Lebu', phone: '+251 903 696 969', lat: 8.948693, lng: 38.728718 },
  { name: 'Tekelehaimanot', phone: '+251 943 171 717', lat: 9.026407, lng: 38.741033 },
  { name: 'Megenagna', phone: '+251 943 191 919', lat: 9.020318, lng: 38.81046 },
  { name: 'Ayat', phone: '+251 943 000 006', lat: 9.0297, lng: 38.8663 },
  { name: 'Bahirdar', phone: '+251 943 000 055', lat: 11.5936, lng: 37.3908, outside: true },
];

export const TEAM = [
  { name: 'Zelalem Alene', role: 'General Manager' },
  { name: 'Tilahun Tamirat', role: 'Supply Chain Director' },
  { name: 'Abreham Andarge', role: 'Customer Relation Manager' },
  { name: 'Hiwot Tilahun', role: 'Finance Manager' },
  { name: 'Mulugeta Awoke', role: 'MIS Manager' },
];

export const POSTS = [
  {
    title: 'ልዩ የዋጋ ቅናሽ ከአስተማማኝ የስቶክ ክምችት ጋር',
    sub: 'Special price drop — backed by reliable stock',
    date: 'May 20, 2026',
    tag: 'Offers',
    href: 'https://yegnatradinget.com/%e1%88%8d%e1%8b%a9-%e1%8b%a8%e1%8b%8b%e1%8c%8b-%e1%89%85%e1%8a%93%e1%88%bd-%e1%8a%a8%e1%8a%a0%e1%88%b5%e1%89%b0%e1%88%9b%e1%88%9b%e1%8a%9d-%e1%8b%a8%e1%88%b5%e1%89%b6%e1%8a%ad-%e1%8a%ad%e1%88%9d/',
  },
  {
    title: 'OPC vs PPC Cement',
    sub: 'Deciding the ideal choice for house construction',
    date: 'Jul 21, 2025',
    tag: 'Cement',
    href: 'https://yegnatradinget.com/opc-vs-ppc-cement-deciding-the-ideal-choice-for-house-construction/',
  },
  {
    title: 'Why Timely Rebar Delivery Matters',
    sub: 'Delivery timing can decide a project’s success',
    date: 'Jul 14, 2025',
    tag: 'Rebar',
    href: 'https://yegnatradinget.com/why-timely-rebar-delivery-is-essential-for-construction-project-success/',
  },
];
