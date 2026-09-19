import type { MetadataRoute } from 'next';
import { products } from '@/lib/products';

const BASE = 'https://nexora-jewels.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, lastModified: new Date(), priority: 1 },
    { url: `${BASE}/try-on`, lastModified: new Date(), priority: 0.9 },
    ...products.map((p) => ({
      url: `${BASE}/product/${p.slug}`,
      lastModified: new Date(),
      priority: 0.8
    }))
  ];
}
