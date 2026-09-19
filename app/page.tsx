import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { products, categories } from '@/lib/products';
import { WA_NUMBER, SHOP_NAME } from '@/lib/whatsapp';
import { getLiveRates, FALLBACK_RATES, formatInr } from '@/lib/rates';
import ConciergeBot from '@/components/ConciergeBot';
import RateTicker from '@/components/RateTicker';
import HomeShop from '@/components/HomeShop';
import StoreSections from '@/components/StoreSections';
import Faq from '@/components/Faq';
import ModelViewer from '@/components/ModelViewer';
import DemoGallery from '@/components/DemoGallery';

export const metadata: Metadata = {
  title: 'NEXORA Jeweller — BIS Hallmarked Fine Jewellery',
  description:
    'Live gold rates, transparent price calculator, WhatsApp checkout. BIS-hallmarked 22K craftsmanship.'
};

export default async function Home() {
  const flagship = products.find((p) => p.flagship) ?? products[0];
  let rates = FALLBACK_RATES;
  try {
    rates = await getLiveRates();
  } catch {
    /* fallback already set */
  }
  const rateKey = flagship.purity === '925' ? 'silver925' : flagship.purity;
  const flagshipRate = rates.perGramInr[rateKey];
  const rateLabel =
    rates.source === 'live' ? `today's live ${flagship.purity} rate (${formatInr(flagshipRate)}/g)` : 'indicative rate — live rate confirmed on WhatsApp';

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${flagship.name} — ${flagship.purity} BIS Hallmarked Gold`,
    category: flagship.category,
    material: `${flagship.purity} ${flagship.metal}`,
    weight: flagship.grossWeight,
    sku: flagship.sku,
    brand: { '@type': 'Brand', name: SHOP_NAME },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'INR',
      description: "Transparent calculator pricing at today's rate — confirm on WhatsApp"
    }
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <RateTicker />

      {/* nav */}
      <header className="sticky top-0 z-50 border-b border-sand bg-ivory/85 backdrop-blur-md">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6 lg:px-10">
          <span className="font-serif text-[26px] tracking-wide flex items-center gap-2">
            NEXORA <span className="italic text-deepgold">Jeweller</span>
            <span className="hidden sm:inline-block ml-3 px-2 py-0.5 border border-amber-300 bg-amber-50 text-[9px] uppercase tracking-widest text-amber-800 rounded-sm">BIS Hallmarked 916</span>
          </span>
          <nav className="hidden items-center gap-9 text-[13px] uppercase tracking-[0.18em] text-charcoal/80 md:flex">
            <a href="#collections" className="hover:text-deepgold">Collections</a>
            <a href="#flagship" className="hover:text-deepgold">Flagship</a>
            <a href="/try-on" className="hover:text-deepgold">Virtual Try-On</a>
            <a href="#visit" className="hover:text-deepgold">Visit</a>
          </nav>
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hi ${SHOP_NAME}! Please share today's gold rate`)}`}
            target="_blank"
            className="border border-charcoal px-5 py-2.5 text-[12px] uppercase tracking-[0.15em] transition hover:bg-charcoal hover:text-ivory"
          >
            Gold rate
          </a>
        </div>
      </header>

      {/* hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-10 pt-14 lg:grid-cols-2 lg:px-10 lg:pb-16 lg:pt-20">
          <div>
            <p className="eyebrow mb-6">Nagpur · Bhagwan Nagar</p>
            <h1 className="font-serif text-[56px] leading-[0.95] sm:text-[76px] lg:text-[92px]">
              Heirlooms,
              <br />
              <span className="italic text-deepgold">reimagined</span>
              <br />
              in gold.
            </h1>
            <p className="mt-7 max-w-md text-[17px] font-light leading-relaxed text-charcoal/70">
              Live rates on top. Exact price with making charges + GST on every piece.
              Order on WhatsApp in one tap — pickup at store, zero commission.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <a href="#collections" className="bg-charcoal px-8 py-4 text-[12px] uppercase tracking-[0.2em] text-ivory transition hover:bg-deepgold shadow-lg shadow-black/10">
                Shop with live pricing
              </a>
              <a
                href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hi! I want to join the monthly Gold Savings Scheme')}`}
                target="_blank"
                className="border border-deepgold text-deepgold bg-deepgold/5 px-8 py-4 text-[12px] uppercase tracking-[0.2em] transition hover:bg-deepgold hover:text-ivory"
              >
                Gold Savings Scheme
              </a>
            </div>
            <div className="mt-10 flex flex-wrap gap-2.5 text-[12px]">
              {['✓ BIS 916 Hallmark', '✓ Live rate pricing', '✓ Making charges shown', '✓ WhatsApp ordering'].map((b) => (
                <span key={b} className="border border-sand bg-white px-4 py-2 shadow-sm">{b}</span>
              ))}
            </div>
          </div>
          <div className="spot-card rounded-[28px] border-gold/40 shadow-xl overflow-hidden bg-white p-4">
            <div className="flex items-center justify-between px-2 pt-2 pb-4 text-[11px] uppercase tracking-[0.25em] text-charcoal/60">
              <span>Solitaire nº 1 — 22K</span>
              <span className="text-deepgold font-bold">● Live 360° AR</span>
            </div>
            {/* The newly requested model-viewer component replaces the threejs one */}
            <ModelViewer />
          </div>
        </div>
      </section>

      {/* categories */}
      <section id="collections" className="mx-auto max-w-7xl px-6 pt-8 lg:px-10">
        <p className="eyebrow">The Vault</p>
        <h2 className="mt-3 font-serif text-[44px] leading-none sm:text-[60px]">
          Shop by <span className="italic text-deepgold">ritual</span>
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <a key={c.name} href="#catalog" className="spot-card group rounded-[20px]">
              <div className="overflow-hidden rounded-t-[20px]">
                <Image src={c.image} alt={c.name} width={700} height={500} loading="lazy" className="h-56 w-full object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="flex items-center justify-between p-5">
                <div>
                  <p className="font-serif text-2xl">{c.name}</p>
                  <p className="text-[12.5px] text-charcoal/55">{c.tagline}</p>
                </div>
                <span className="text-xl text-deepgold">→</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* catalog + flagship calculator */}
      <section id="catalog" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-20 lg:px-10">
        <HomeShop ratePerGram={flagshipRate} rateLabel={rateLabel} />
      </section>

      <DemoGallery />

      {/* testimonials */}
      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-10">
        <p className="eyebrow">Worn &amp; loved</p>
        <h2 className="mt-2 font-serif text-[40px]">Brides who <span className="italic text-deepgold">chose once</span></h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            ['“They shared today\u2019s rate on WhatsApp before I paid a rupee. Total trust.”', 'Meera · Delhi'],
            ['“The price breakup showed making charges openly. Nobody else does that.”', 'Aishwarya · Jaipur'],
            ['“Ordered on WhatsApp, picked up in store next day. Zero hassle.”', 'Fatima · Mumbai']
          ].map(([q, a]) => (
            <figure key={a} className="rounded-[18px] border border-sand bg-white p-7">
              <blockquote className="font-serif text-[21px] italic leading-snug">{q}</blockquote>
              <figcaption className="mt-4 text-[12px] uppercase tracking-[0.2em] text-deepgold">{a}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <div id="visit" className="scroll-mt-24">
        <StoreSections />
      </div>

      <Faq />

      {/* floating WhatsApp */}
      <a
        href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hi ${SHOP_NAME}! I have a question`)}`}
        target="_blank"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-[70] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-2xl text-white shadow-2xl"
      >
        ✆
      </a>
      <ConciergeBot />

      <footer className="bg-charcoal text-ivory">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-3 lg:px-10">
          <div>
            <p className="font-serif text-3xl">NEXORA Jeweller</p>
            <p className="mt-3 text-[14px] font-light text-ivory/60">
              Rings · Necklaces · Earrings · Bangles. Client logo &amp; photos swap in when shared.
            </p>
          </div>
          <div className="text-[14px] text-ivory/70">
            <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-gold">Visit us</p>
            <p>Bhagwan Nagar, Near Bhagwan Nagar Ground, Nagpur 440027<br />+91 85540 12234 · Open daily 11–8<br />WhatsApp ordering · Store pickup, no delivery setup.</p>
          </div>
          <div className="text-[14px] text-ivory/70">
            <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-gold">Zero monthly cost</p>
            <p>Rates: goldprice.dev free · Maps: embed · Booking: Cal.com free · Chat: wa.me free · Hosting: Vercel free.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
