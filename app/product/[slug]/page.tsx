import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { products } from '@/lib/products';
import { SHOP_NAME } from '@/lib/whatsapp';
import { getLiveRates, FALLBACK_RATES, formatInr } from '@/lib/rates';
import ProductDetails from '@/components/ProductDetails';

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = products.find((p) => p.slug === params.slug);
  if (!product) return {};
  return {
    title: `${product.name} — ${product.purity} Gold | ${SHOP_NAME}`,
    description: `${product.name} (${product.sku}): ${product.purity} gold, ${product.grossWeight}. Live pricing, BIS hallmarked, WhatsApp ordering.`,
    openGraph: { title: product.name, description: product.description, images: [product.images[0]] }
  };
}

const CARE: [string, string][] = [
  ['Store thoughtfully', 'Keep each piece in a soft pouch or separate compartment so surfaces never scratch.'],
  ['Wear after getting ready', 'Put jewellery on once perfume and skincare have settled to protect the finish.'],
  ['Clean lightly', 'A soft dry cloth keeps antique gold glowing. Bring it to our Nagpur boutique for a professional refresh anytime.']
];

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = products.find((p) => p.slug === params.slug);
  if (!product) notFound();

  let rates = FALLBACK_RATES;
  try {
    rates = await getLiveRates();
  } catch {
    /* fallback */
  }
  const rateKey = product.purity === '925' ? 'silver925' : product.purity;
  const rate = rates.perGramInr[rateKey];
  const rateLabel =
    rates.source === 'live'
      ? `today's live ${product.purity} rate (${formatInr(rate)}/g)`
      : 'indicative rate — live rate confirmed on WhatsApp';

  const related = products.filter((p) => p.slug !== product.slug && p.category === product.category);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    sku: product.sku,
    category: product.category,
    material: `${product.purity} ${product.metal}`,
    weight: product.grossWeight,
    image: product.images,
    description: product.description,
    brand: { '@type': 'Brand', name: SHOP_NAME },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'INR',
      description: "Transparent calculator pricing at today's rate — confirm on WhatsApp"
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ProductDetails product={product} ratePerGram={rate} rateLabel={rateLabel} />

      {/* story */}
      <section className="mx-auto mt-24 max-w-3xl text-center">
        <p className="eyebrow">The making</p>
        <blockquote className="mt-4 font-serif text-[28px] italic leading-snug sm:text-[34px]">
          “{product.story}”
        </blockquote>
        <p className="mt-6 text-[13px] uppercase tracking-[0.2em] text-deepgold">Styling — {product.styling}</p>
      </section>

      {/* trust badges */}
      <section className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['⛨ BIS 916', 'Every piece hallmarked + certified'],
          ['◉ Lifetime exchange', 'Buyback value in writing on your bill'],
          ['✓ Insured delivery', 'Fully insured, tracking included'],
          ['₹ Transparent pricing', 'Metal + making + GST, shown openly']
        ].map(([t, d]) => (
          <div key={t} className="rounded-[16px] border border-sand bg-white p-6 text-center">
            <p className="text-[13px] font-bold uppercase tracking-[0.18em]">{t}</p>
            <p className="mt-2 text-[13px] font-light text-charcoal/65">{d}</p>
          </div>
        ))}
      </section>

      {/* care + origin */}
      <section className="mx-auto mt-16 max-w-3xl">
        <h2 className="font-serif text-[32px]">Care & <span className="italic text-deepgold">origin</span></h2>
        <div className="mt-4 space-y-3">
          {CARE.map(([q, a]) => (
            <details key={q} className="rounded-2xl border border-sand bg-white px-6 py-4">
              <summary className="cursor-pointer font-medium">{q}</summary>
              <p className="mt-2 text-[14px] font-light text-charcoal/70">{a}</p>
            </details>
          ))}
        </div>
        <p className="mt-6 text-[13px] text-charcoal/55">
          Handcrafted in India · Sold from our boutique at Bhagwan Nagar, Near Bhagwan Nagar Ground, Nagpur 440027.
        </p>
      </section>

      {/* related */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-serif text-[36px]">Pairs <span className="italic text-deepgold">well with</span></h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <Link key={p.slug} href={`/product/${p.slug}`} className="spot-card group rounded-[20px]">
                <div className="relative h-64 overflow-hidden rounded-t-[20px]">
                  <Image src={p.images[0]} alt={p.name} fill loading="lazy" className="object-cover transition duration-700 group-hover:scale-105" />
                </div>
                <div className="flex items-center justify-between p-5">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.25em] text-deepgold">{p.sku}</p>
                    <p className="font-serif text-2xl">{p.name}</p>
                  </div>
                  <span className="text-xl text-deepgold">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
