'use client';

import { useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import type { Product } from '@/lib/products';
import { ShopProvider, useShop } from '@/lib/store';
import PriceCalculator from './PriceCalculator';
import CartDrawer from './CartDrawer';

// Live 3D finish preview — deferred so it never blocks the PDP first paint
const Hero3D = dynamic(() => import('./Hero3D'), {
  ssr: false,
  loading: () => <div className="flex h-[420px] items-center justify-center bg-cream text-[12px] uppercase tracking-[0.25em] text-charcoal/50">Preparing 360°…</div>
});

export const METAL_FINISHES = [
  { name: 'Yellow Gold', tint: '#b98a2e' },
  { name: 'Rose Gold', tint: '#c08a72' },
  { name: 'White Gold', tint: '#d7d7dc' }
] as const;

function DetailsInner({ product, ratePerGram, rateLabel }: { product: Product; ratePerGram: number; rateLabel: string }) {
  const [tab, setTab] = useState<'photos' | 'view3d'>('photos');
  const [photo, setPhoto] = useState(0);
  const [metal, setMetal] = useState<(typeof METAL_FINISHES)[number]>(METAL_FINISHES[0]);
  const [cartOpen, setCartOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { cart, wishlist, toggleWish } = useShop();
  const wished = wishlist.includes(product.slug);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, text: `${product.name} — ${product.sku}`, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      /* dismissed */
    }
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[12px] uppercase tracking-[0.2em] text-charcoal/55">
          <a href="/" className="hover:text-deepgold">Home</a> · {product.category} · <span className="text-deepgold">{product.sku}</span>
        </p>
        <button onClick={() => setCartOpen(true)} className="bg-charcoal px-6 py-3 text-[12px] uppercase tracking-[0.18em] text-ivory hover:bg-deepgold">
          Cart · {cart.length}
        </button>
      </div>

      <div className="grid items-start gap-10 lg:grid-cols-2">
        {/* Media: photos | 360° (ringbuilder-style switch) */}
        <div>
          <div className="mb-4 flex gap-2">
            {(['photos', 'view3d'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`border px-5 py-2.5 text-[12px] uppercase tracking-[0.18em] ${tab === t ? 'border-charcoal bg-charcoal text-ivory' : 'border-sand bg-white'}`}
              >
                {t === 'photos' ? 'Photos' : '◉ View in 360°'}
              </button>
            ))}
            <a href={`/try-on?product=${product.slug}`} className="border border-deepgold bg-cream px-5 py-2.5 text-[12px] uppercase tracking-[0.18em] text-deepgold">
              Try on live
            </a>
          </div>

          {tab === 'photos' ? (
            <div>
              <div className="group relative h-[440px] cursor-zoom-in overflow-hidden rounded-[20px] border border-sand bg-white">
                <Image
                  src={product.images[photo]}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover transition duration-500 group-hover:scale-150"
                />
                <span className="absolute left-4 top-4 bg-white/90 px-3 py-1 text-[11px] uppercase tracking-[0.2em]">⛨ BIS {product.purity}</span>
              </div>
              {product.images.length > 1 && (
                <div className="mt-3 flex gap-2">
                  {product.images.map((img, i) => (
                    <button key={i} onClick={() => setPhoto(i)} className={`relative h-20 w-20 overflow-hidden rounded-xl border ${photo === i ? 'border-deepgold' : 'border-sand'}`}>
                      <Image src={img} alt={`${product.name} view ${i + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-hidden rounded-[20px] border border-sand" style={{ height: 440 }}>
              <Hero3D metalColor={metal.tint} />
              <p className="bg-white px-4 py-2 text-center text-[11px] uppercase tracking-[0.2em] text-charcoal/50">
                Finish preview — your piece in {metal.name} · drag to rotate
              </p>
            </div>
          )}
        </div>

        {/* Configurator (Qween-style summary + ringbuilder freedom) */}
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-deepgold">{product.category} · {product.sku}</p>
          <h1 className="mt-2 font-serif text-[44px] leading-none sm:text-[56px]">{product.name}</h1>
          <p className="mt-3 text-[13px] uppercase tracking-[0.2em] text-charcoal/60">
            {product.purity} · {product.grossWeight} gross · BIS 916
          </p>
          <p className="mt-4 font-light leading-relaxed text-charcoal/70">{product.description}</p>

          <div className="mt-6">
            <p className="text-[12px] uppercase tracking-[0.2em] text-charcoal/60">Metal finish — {metal.name}</p>
            <div className="mt-2 flex gap-2">
              {METAL_FINISHES.map((m) => (
                <button
                  key={m.name}
                  onClick={() => setMetal(m)}
                  title={m.name}
                  aria-label={m.name}
                  className={`h-9 w-9 rounded-full border ${metal.name === m.name ? 'border-charcoal ring-2 ring-gold ring-offset-2' : 'border-sand'}`}
                  style={{ background: m.tint }}
                />
              ))}
            </div>
          </div>

          <div className="mt-5">
            <PriceCalculator product={product} liveRatePerGram={ratePerGram} rateLabel={rateLabel} />
          </div>

          <div className="mt-4 flex gap-3">
            <button onClick={() => toggleWish(product.slug)} className={`flex-1 border py-3.5 text-[12px] uppercase tracking-[0.2em] ${wished ? 'border-deepgold bg-cream text-deepgold' : 'border-sand bg-white'}`}>
              {wished ? '♥ Wishlisted' : '♡ Add to wishlist'}
            </button>
            <button onClick={share} className="flex-1 border border-sand bg-white py-3.5 text-[12px] uppercase tracking-[0.2em]">
              {copied ? '✓ Link copied' : 'Share this piece'}
            </button>
          </div>

          <div className="mt-4 rounded-[14px] border border-sand bg-cream/60 px-5 py-4 text-[13px] text-charcoal/70">
            <b className="text-charcoal">Store pickup, Nagpur</b> — Bhagwan Nagar, Near Bhagwan Nagar Ground.
            Order on WhatsApp, pay on confirmation, collect in store. Insured delivery across India on request.
          </div>
        </div>
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

export default function ProductDetails(props: { product: Product; ratePerGram: number; rateLabel: string }) {
  return (
    <ShopProvider>
      <DetailsInner {...props} />
    </ShopProvider>
  );
}
