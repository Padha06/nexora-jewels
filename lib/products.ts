export type Category = 'Rings' | 'Necklaces' | 'Earrings' | 'Bangles';

export interface Product {
  slug: string;
  sku: string;
  name: string;
  category: Category;
  metal: string;
  purity: '22K' | '18K' | '925';
  grossWeight: string;
  weightG: number;
  makingCharges: string;
  makingPct: number;
  stoneCharges?: number;
  sizes?: string[]; // ring/bangle sizes; undefined = one-size
  priceInr: number | null; // null = live-rate price via calculator
  images: string[];
  description: string;
  flagship?: boolean;
}

// Placeholder catalog — client photos + final specs swap in when shared.
// Mirrors the Prisma Product model (see prisma/schema.prisma).
export const products: Product[] = [
  {
    slug: 'nexora-solitaire-ring',
    sku: 'NX-R101',
    name: 'The Nexora Solitaire',
    category: 'Rings',
    metal: 'Yellow Gold',
    purity: '22K',
    grossWeight: '8.4 g',
    weightG: 8.4,
    makingCharges: '12%',
    makingPct: 12,
    priceInr: null,
    sizes: ['12', '14', '16', '18'],
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1000&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1000&q=80&auto=format&fit=crop'
    ],
    description:
      'High-domed 22K shank, six-claw setting. BIS certificate + stone report, insured delivery, lifetime exchange in writing.',
    flagship: true
  },
  {
    slug: 'temple-pendant-necklace',
    sku: 'NX-N202',
    name: 'Temple Pendant Necklace',
    category: 'Necklaces',
    metal: 'Yellow Gold',
    purity: '22K',
    grossWeight: '18.2 g',
    weightG: 18.2,
    makingCharges: '14%',
    makingPct: 14,
    priceInr: null,
    images: [
      '/temple-necklace.jpg'
    ],
    description: 'Antique-finish temple necklace with ruby, emerald and pearl detailing. Photographed at our Nagpur boutique.'
  },
  {
    slug: 'chandbali-earrings',
    sku: 'NX-E303',
    name: 'Chandbali Earrings',
    category: 'Earrings',
    metal: 'Yellow Gold',
    purity: '22K',
    grossWeight: '9.6 g',
    weightG: 9.6,
    makingCharges: '13%',
    makingPct: 13,
    stoneCharges: 2500,
    priceInr: null,
    images: [
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1000&q=80&auto=format&fit=crop'
    ],
    description: 'Classic chandbalis with pearl drops. Placeholder photo until client shoot.'
  },
  {
    slug: 'heritage-kada-bangle',
    sku: 'NX-B404',
    name: 'Heritage Kada (Single)',
    category: 'Bangles',
    metal: 'Yellow Gold',
    purity: '22K',
    grossWeight: '22.0 g',
    weightG: 22,
    makingCharges: '11%',
    makingPct: 11,
    priceInr: null,
    sizes: ['2.4', '2.6', '2.8'],
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1000&q=80&auto=format&fit=crop'
    ],
    description: 'Heavy hand-hammered kada, annealed seven times. Placeholder photo until client shoot.'
  }
];

export const categories: { name: Category; tagline: string; image: string }[] = [
  {
    name: 'Rings',
    tagline: 'Solitaires · bands · cocktail',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=700&q=70&auto=format&fit=crop'
  },
  {
    name: 'Necklaces',
    tagline: 'Polki · temple · pendants',
    image: '/temple-necklace.jpg'
  },
  {
    name: 'Earrings',
    tagline: 'Jhumkas · studs · chandbalis',
    image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=700&q=70&auto=format&fit=crop'
  },
  {
    name: 'Bangles',
    tagline: 'Kadas · bracelets · sets',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=700&q=70&auto=format&fit=crop'
  }
];

export const RING_SIZE_CHART = [
  { size: '12', mm: '16.5 mm' },
  { size: '14', mm: '17.3 mm' },
  { size: '16', mm: '18.1 mm' },
  { size: '18', mm: '18.9 mm' }
];

export const BANGLE_SIZE_CHART = [
  { size: '2.4', mm: '60.3 mm' },
  { size: '2.6', mm: '63.5 mm' },
  { size: '2.8', mm: '66.6 mm' }
];
