'use client';

import { useMemo, useState } from 'react';
import type { Product } from '@/lib/products';
import { calcPrice, breakupLines } from '@/lib/pricing';
import { formatInr } from '@/lib/rates';
import { useShop } from '@/lib/store';
import { buildEnquiryUrl } from '@/lib/whatsapp';

const STONE_OPTIONS = [
  { name: 'No stones', charges: 0 },
  { name: 'Pearl drops', charges: 2500 },
  { name: 'Solitaire setting', charges: 8500 },
  { name: 'Halo setting', charges: 15000 }
] as const;

// Enhanced calculator: purity/size/weight/stone variants + live breakup +
// date-stamped rate + one-tap quote-to-WhatsApp + add-to-cart.
export default function PriceCalculator({
  product,
  liveRatePerGram,
  rateLabel
}: {
  product: Product;
  liveRatePerGram: number;
  rateLabel: string;
}) {
  const { addLine } = useShop();
  const [purity, setPurity] = useState(product.purity);
  const [size, setSize] = useState(product.sizes?.[1] ?? 'One size');
  const [weight, setWeight] = useState(product.weightG);
  const [stone, setStone] = useState(
    STONE_OPTIONS.find((o) => o.charges === (product.stoneCharges ?? 0)) ?? STONE_OPTIONS[0]
  );

  // Purity switch reprices against 24K base (standard Indian practice)
  const rate = useMemo(() => {
    if (purity === product.purity) return liveRatePerGram;
    const base24 = product.purity === '22K' ? (liveRatePerGram * 24) / 22 : liveRatePerGram;
    if (purity === '22K') return (base24 * 22) / 24;
    if (purity === '18K') return (base24 * 18) / 24;
    return liveRatePerGram;
  }, [purity, liveRatePerGram, product.purity]);

  const b = useMemo(
    () =>
      calcPrice({ weightG: weight, ratePerGram: rate, makingPct: product.makingPct, stoneCharges: stone.charges }),
    [weight, rate, product.makingPct, stone]
  );

  const variant = `${purity} ${product.metal}, Size ${size} · ${weight.toFixed(1)}g${stone.charges ? ` · ${stone.name}` : ''}`;
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const quoteUrl = buildEnquiryUrl('Price quote request', {
    Piece: `${product.name} (SKU: ${product.sku})`,
    Variant: variant,
    ...Object.fromEntries(breakupLines(b).map((l) => l.split(': '))),
    'Rate date': today
  });

  return (
    <div className="border border-sand bg-white p-6" style={{ borderRadius: 18 }}>
      <div className="flex flex-wrap gap-2">
        {(['22K', '18K'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPurity(p)}
            className={`border px-4 py-2 text-[12px] uppercase tracking-[0.15em] ${purity === p ? 'border-charcoal bg-charcoal text-ivory' : 'border-sand'}`}
          >
            {p}
          </button>
        ))}
        {product.sizes?.map((s) => (
          <button
            key={s}
            onClick={() => setSize(s)}
            className={`border px-4 py-2 text-[12px] tracking-[0.15em] ${size === s ? 'border-deepgold bg-cream' : 'border-sand'}`}
          >
            Size {s}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-[12px] uppercase tracking-[0.2em] text-charcoal/60">Weight — {weight.toFixed(1)} g</label>
          <input
            type="range" min={Math.max(1, product.weightG - 6)} max={product.weightG + 10} step={0.1}
            value={weight} onChange={(e) => setWeight(+e.target.value)}
            className="w-full accent-[#9a7b2e]"
          />
        </div>
        <div>
          <label className="text-[12px] uppercase tracking-[0.2em] text-charcoal/60">Stones</label>
          <select value={stone.name} onChange={(e) => setStone(STONE_OPTIONS.find((o) => o.name === e.target.value)!)} className="mt-1 w-full border border-sand bg-ivory px-3 py-2 text-[14px]">
            {STONE_OPTIONS.map((o) => (
              <option key={o.name} value={o.name}>{o.name}{o.charges ? ` (+${formatInr(o.charges)})` : ''}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 space-y-1.5 text-[14px] text-charcoal/75">
        <div className="flex justify-between"><span>Metal ({weight.toFixed(1)} g × {formatInr(rate)}/g)</span><b className="text-charcoal">{formatInr(b.metalValue)}</b></div>
        <div className="flex justify-between"><span>Making ({product.makingPct}%)</span><b className="text-charcoal">{formatInr(b.making)}</b></div>
        {b.stone > 0 && <div className="flex justify-between"><span>Stones ({stone.name})</span><b className="text-charcoal">{formatInr(b.stone)}</b></div>}
        <div className="flex justify-between"><span>GST (3%)</span><b className="text-charcoal">{formatInr(b.gst)}</b></div>
        <div className="gold-line my-2" />
        <div className="flex justify-between font-serif text-2xl"><span>Total</span><span className="text-deepgold">{formatInr(b.total)}</span></div>
        <p className="text-[12px] text-charcoal/50">Priced at {rateLabel} · {today}. Final bill confirms weight on scale.</p>
      </div>

      <button
        onClick={() => addLine({ sku: product.sku, name: product.name, variant, price: Math.round(b.total), qty: 1 })}
        className="mt-5 w-full bg-charcoal py-4 text-[12px] uppercase tracking-[0.2em] text-ivory transition hover:bg-deepgold"
      >
        Add to cart — {formatInr(b.total)}
      </button>
      <a href={quoteUrl} target="_blank" className="mt-2 block w-full border border-charcoal py-3.5 text-center text-[12px] uppercase tracking-[0.2em] transition hover:bg-charcoal hover:text-ivory">
        Send this quote on WhatsApp
      </a>
    </div>
  );
}
