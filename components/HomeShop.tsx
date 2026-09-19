'use client';

import { useState } from 'react';
import { ShopProvider, useShop } from '@/lib/store';
import type { Product } from '@/lib/products';
import { products } from '@/lib/products';
import ShopGrid, { QuickView } from './ShopGrid';
import CartDrawer from './CartDrawer';
import PriceCalculator from './PriceCalculator';

function ShopInner({ ratePerGram, rateLabel }: { ratePerGram: number; rateLabel: string }) {
  const [quick, setQuick] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const { cart, recentlyViewed } = useShop();
  const flagship = products.find((p) => p.flagship) ?? products[0];
  const seen = products.filter((p) => recentlyViewed.includes(p.slug));

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[13px] text-charcoal/60">Tap any piece for quick view — size, zoom, wishlist.</p>
        <button onClick={() => setCartOpen(true)} className="bg-charcoal px-6 py-3 text-[12px] uppercase tracking-[0.18em] text-ivory hover:bg-deepgold">
          Cart · {cart.length}
        </button>
      </div>

      <ShopGrid onQuickView={setQuick} />

      {seen.length > 0 && (
        <div className="mt-10">
          <p className="eyebrow">Recently viewed</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {seen.map((p) => (
              <button key={p.slug} onClick={() => setQuick(p)} className="border border-sand bg-white px-4 py-2 text-[13px] hover:border-gold">
                {p.name} · {p.sku}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-16 grid items-start gap-8 lg:grid-cols-2" id="flagship">
        <div>
          <p className="eyebrow">Flagship · {flagship.sku}</p>
          <h2 className="mt-2 font-serif text-[48px] leading-none">
            The Nexora <span className="italic text-deepgold">Solitaire</span>
          </h2>
          <div className="mt-4 flex flex-wrap gap-2 text-[12px]">
            {[`⛨ BIS ${flagship.purity === '22K' ? '916' : flagship.purity}`, `◆ ${flagship.metal}`, `${flagship.purity} · ${flagship.grossWeight}`, `Making ${flagship.makingCharges}`].map((b) => (
              <span key={b} className="border border-sand bg-white px-3 py-1.5">{b}</span>
            ))}
          </div>
          <p className="mt-4 font-light leading-relaxed text-charcoal/70">{flagship.description}</p>
          <p className="mt-4 font-serif text-[22px] italic text-deepgold">Priced live below — no “contact for price” dead-end.</p>
          <a href={`/try-on?product=${flagship.slug}`} className="mt-4 inline-block border border-deepgold bg-cream px-6 py-3 text-[12px] uppercase tracking-[0.2em] text-deepgold">
            ◉ Try this ring on your finger — live
          </a>
        </div>
        <PriceCalculator product={flagship} liveRatePerGram={ratePerGram} rateLabel={rateLabel} />
      </div>

      {quick && <QuickView product={quick} onClose={() => setQuick(null)} />}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

export default function HomeShop({ ratePerGram, rateLabel }: { ratePerGram: number; rateLabel: string }) {
  return (
    <ShopProvider>
      <ShopInner ratePerGram={ratePerGram} rateLabel={rateLabel} />
    </ShopProvider>
  );
}
