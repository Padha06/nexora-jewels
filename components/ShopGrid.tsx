'use client';

import Image from 'next/image';
import { products, type Product } from '@/lib/products';
import { useShop } from '@/lib/store';
import QuickView from './QuickView';

// Catalog grid: quick view, wishlist, BIS badge, size hint.
export default function ShopGrid({ onQuickView }: { onQuickView: (p: Product) => void }) {
  const { wishlist, toggleWish } = useShop();
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((p) => (
        <article key={p.slug} className="spot-card group rounded-[20px]">
          <div className="relative overflow-hidden rounded-t-[20px]">
            <Image src={p.images[0]} alt={p.name} width={700} height={500} loading="lazy" className="h-72 w-full object-cover transition duration-700 group-hover:scale-105" />
            <span className="absolute left-3 top-3 bg-white/90 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em]">⛨ BIS {p.purity}</span>
            <button
              onClick={() => toggleWish(p.slug)}
              aria-label="Wishlist"
              className="absolute right-3 top-3 bg-white/90 px-2.5 py-1 text-lg"
            >
              {wishlist.includes(p.slug) ? '♥' : '♡'}
            </button>
          </div>
          <div className="p-5">
            <p className="text-[11px] uppercase tracking-[0.25em] text-deepgold">{p.sku} · {p.grossWeight}</p>
            <p className="mt-1 font-serif text-2xl">{p.name}</p>
            <p className="text-[12.5px] text-charcoal/55">{p.purity} {p.metal}{p.sizes ? ` · Sizes ${p.sizes.join('/')}` : ''}</p>
            <button onClick={() => onQuickView(p)} className="mt-3 w-full border border-charcoal py-2.5 text-[12px] uppercase tracking-[0.18em] transition hover:bg-charcoal hover:text-ivory">
              Quick view
            </button>
            <a href={`/try-on?product=${p.slug}`} className="mt-2 block w-full bg-cream py-2.5 text-center text-[12px] uppercase tracking-[0.18em] text-deepgold transition hover:bg-gold hover:text-charcoal">
              ◉ Try on live
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}

// Re-export for page wiring convenience
export { QuickView };
