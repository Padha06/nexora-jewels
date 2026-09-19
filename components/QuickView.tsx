'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Product } from '@/lib/products';
import { BANGLE_SIZE_CHART, RING_SIZE_CHART } from '@/lib/products';
import { useShop } from '@/lib/store';

// Quick view: image zoom on hover, variant pick, wishlist, add-to-cart
// without leaving the page. Tracks recently-viewed.
export default function QuickView({
  product,
  onClose
}: {
  product: Product;
  onClose: () => void;
}) {
  const { addLine, wishlist, toggleWish, pushViewed } = useShop();
  const [zoom, setZoom] = useState(false);
  const [size, setSize] = useState(product.sizes?.[1] ?? 'One size');
  const [showSizes, setShowSizes] = useState(false);
  const wished = wishlist.includes(product.slug);
  const chart = product.category === 'Bangles' ? BANGLE_SIZE_CHART : RING_SIZE_CHART;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-charcoal/55" onClick={onClose} />
      <div className="relative grid max-h-[90vh] w-full max-w-3xl overflow-auto bg-ivory md:grid-cols-2" style={{ borderRadius: 20 }}>
        <div
          className="relative h-72 cursor-zoom-in overflow-hidden md:h-full md:min-h-[480px]"
          onMouseEnter={() => { setZoom(true); pushViewed(product.slug); }}
          onMouseLeave={() => setZoom(false)}
        >
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className={`object-cover transition duration-500 ${zoom ? 'scale-150' : 'scale-100'}`}
          />
          <span className="absolute left-4 top-4 border border-sand bg-white/90 px-3 py-1 text-[11px] uppercase tracking-[0.2em]">⛨ BIS {product.purity}</span>
        </div>
        <div className="p-7">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-deepgold">{product.sku} · {product.category}</p>
              <h3 className="mt-1 font-serif text-3xl">{product.name}</h3>
              <p className="mt-1 text-[13px] text-charcoal/60">{product.purity} {product.metal} · {product.grossWeight} · Making {product.makingCharges}</p>
            </div>
            <button onClick={onClose} className="text-2xl leading-none">×</button>
          </div>
          <p className="mt-4 text-[14px] font-light leading-relaxed text-charcoal/70">{product.description}</p>

          {product.sizes && (
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <p className="text-[12px] uppercase tracking-[0.2em] text-charcoal/60">Size — {size}</p>
                <button onClick={() => setShowSizes((s) => !s)} className="text-[12px] text-deepgold underline">Size guide</button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button key={s} onClick={() => setSize(s)} className={`border px-4 py-2 text-[13px] ${size === s ? 'border-charcoal bg-charcoal text-ivory' : 'border-sand bg-white'}`}>{s}</button>
                ))}
              </div>
              {showSizes && (
                <table className="mt-3 w-full border border-sand bg-white text-[13px]">
                  <tbody>
                    {chart.map((r) => (
                      <tr key={r.size} className="border-b border-sand/60"><td className="px-3 py-1.5">Size {r.size}</td><td className="px-3 py-1.5 text-charcoal/60">{r.mm}</td></tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => { addLine({ sku: product.sku, name: product.name, variant: `${product.purity} ${product.metal}, Size ${size} · ${product.grossWeight}`, price: 0, qty: 1 }); onClose(); }}
              className="flex-1 bg-charcoal py-3.5 text-[12px] uppercase tracking-[0.2em] text-ivory hover:bg-deepgold"
            >
              Add to cart
            </button>
            <button onClick={() => toggleWish(product.slug)} className={`border px-5 ${wished ? 'border-deepgold bg-cream' : 'border-sand bg-white'}`} aria-label="Wishlist">
              {wished ? '♥' : '♡'}
            </button>
          </div>
          <a href={`/try-on?product=${product.slug}`} className="mt-2 block w-full border border-deepgold bg-cream py-3 text-center text-[12px] uppercase tracking-[0.2em] text-deepgold">
            ◉ Try this exact piece on live
          </a>
          <p className="mt-3 text-[12px] text-charcoal/50">Exact price at today&apos;s rate — confirmed on WhatsApp before you pay anything.</p>
        </div>
      </div>
    </div>
  );
}
