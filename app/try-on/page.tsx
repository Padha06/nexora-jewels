import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { products } from '@/lib/products';
import { SHOP_ADDRESS, SHOP_PHONE_DISPLAY } from '@/lib/whatsapp';

const TryOn = dynamic(() => import('@/components/TryOn'), {
  ssr: false,
  loading: () => (
    <div className="flex aspect-[4/3] items-center justify-center rounded-[20px] bg-charcoal text-ivory">
      <p className="font-serif text-2xl italic">Preparing your mirror…</p>
    </div>
  )
});

export const metadata: Metadata = {
  title: 'Virtual Try-On — NEXORA Jeweller',
  description: 'Try the actual piece on yourself — earrings on ears, rings on finger. Live in your browser, private, nothing uploaded.'
};

export default function TryOnPage({ searchParams }: { searchParams: { product?: string } }) {
  const product = products.find((p) => p.slug === searchParams.product) ?? null;
  return (
    <main className="mx-auto max-w-6xl px-6 py-14">
      <p className="eyebrow">Virtual mirror · Your actual piece</p>
      <h1 className="mt-2 font-serif text-[44px] leading-tight sm:text-[60px]">
        See it <span className="italic text-deepgold">on you</span>
      </h1>
      <p className="mt-3 max-w-xl font-light text-charcoal/70">
        Your real product photo — cut out automatically, tracked onto your ears, neck, finger or
        wrist. Nothing is recorded or uploaded. Then visit us at {SHOP_ADDRESS} ({SHOP_PHONE_DISPLAY}).
      </p>
      <div className="mt-8">
        <TryOn product={product} all={products} />
      </div>
      <a href="/" className="mt-8 inline-block border border-charcoal px-6 py-3 text-[12px] uppercase tracking-[0.2em]">← Back to site</a>
    </main>
  );
}
