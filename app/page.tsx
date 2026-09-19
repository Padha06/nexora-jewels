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
import Hero3D from '@/components/Hero3D';
import DemoGallery from '@/components/DemoGallery';
import { TextReveal } from '@/components/TextReveal';

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
    <main className="min-h-screen bg-cream text-charcoal">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <RateTicker />

      {/* Polished Header */}
      <header className="fixed top-0 z-[60] w-full bg-cream/90 backdrop-blur-md border-b border-sand/50">
        <div className="mx-auto flex h-[80px] max-w-7xl items-center justify-between px-6 lg:px-10">
          <a href="#" className="flex items-center gap-3">
            <Image src="/logo.jpg" alt="Nexora Jewellers" width={160} height={40} className="h-[40px] w-auto object-contain mix-blend-darken" />
          </a>
          <nav className="hidden items-center gap-10 text-[11px] uppercase tracking-[0.2em] font-medium text-charcoal/70 md:flex">
            <a href="#collections" className="hover:text-deepgold transition-colors">Collections</a>
            <a href="#flagship" className="hover:text-deepgold transition-colors">High Jewelry</a>
            <a href="/try-on" className="hover:text-deepgold transition-colors">Virtual Try-On</a>
            <a href="#visit" className="hover:text-deepgold transition-colors">Boutique</a>
          </nav>
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hi ${SHOP_NAME}! Please share today's gold rate`)}`}
            target="_blank"
            className="border border-charcoal/20 px-6 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] transition hover:bg-charcoal hover:text-ivory rounded-full shadow-sm"
          >
            Gold rate
          </a>
        </div>
      </header>

      {/* Luxury Hero Section */}
      <section className="relative min-h-screen flex items-center pt-[80px] overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-gold/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="mx-auto grid max-w-7xl w-full gap-12 px-6 lg:grid-cols-2 lg:px-10 items-center">
          <div className="relative z-10 pt-10 lg:pt-0">
            <p className="text-[11px] uppercase tracking-[0.3em] text-deepgold font-bold mb-8">
              <TextReveal delay={0.1}>The Art of Adornment</TextReveal>
            </p>
            <h1 className="font-serif text-[60px] leading-[0.9] sm:text-[80px] lg:text-[100px] text-charcoal">
              <div className="overflow-hidden pb-2"><TextReveal delay={0.3}>Heirlooms,</TextReveal></div>
              <div className="overflow-hidden pb-2"><TextReveal delay={0.5}><span className="italic text-deepgold">reimagined</span></TextReveal></div>
              <div className="overflow-hidden pb-2"><TextReveal delay={0.7}>in gold.</TextReveal></div>
            </h1>
            <div className="mt-10 max-w-md text-[15px] font-light leading-relaxed text-charcoal/70">
              <TextReveal delay={0.9}>
                Discover BIS-hallmarked craftsmanship. Live pricing, transparent making charges, and seamless WhatsApp ordering directly from our Nagpur boutique.
              </TextReveal>
            </div>
            
            <div className="mt-12 flex flex-wrap gap-5">
              <a href="#collections" className="bg-charcoal px-10 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-ivory transition hover:bg-deepgold rounded-full shadow-xl shadow-charcoal/10">
                Explore Collections
              </a>
              <a
                href="#visit"
                className="border border-charcoal/20 px-10 py-4 text-[11px] font-bold uppercase tracking-[0.2em] transition hover:bg-white rounded-full flex items-center gap-3"
              >
                <span>Visit Boutique</span>
                <span className="w-8 h-[1px] bg-charcoal/30 inline-block"></span>
              </a>
            </div>
          </div>
          
          <div className="relative h-[500px] lg:h-[700px] flex items-center justify-center">
            {/* Signature 3D Piece floats here cleanly */}
            <div className="absolute inset-0">
              <Hero3D />
            </div>
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
