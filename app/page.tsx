import Image from 'next/image';
import Link from 'next/link';
import TextReveal from '@/components/TextReveal';
import HomeShop from '@/components/HomeShop';
import StoreSections from '@/components/StoreSections';
import Faq from '@/components/Faq';
import ConciergeBot from '@/components/ConciergeBot';

const WA_NUMBER = '918554012234';
const SHOP_NAME = 'Nexora Jewellers';

export const metadata = {
  title: 'Nexora Jewellers | Fine Diamond & Gold Jewelry',
  description: 'Experience timeless elegance with Nexora. Custom lab-grown diamond rings and heirloom gold jewelry.',
};

export default function Home() {
  const categories = [
    { name: 'Engagement', image: 'https://images.unsplash.com/photo-1605100804763-247f67b254a6?auto=format&fit=crop&q=80&w=800' },
    { name: 'Wedding Bands', image: 'https://images.unsplash.com/photo-1599643478514-4a4e06d649d0?auto=format&fit=crop&q=80&w=800' },
    { name: 'Fine Necklaces', image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=800' },
    { name: 'Bridal Sets', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800' },
  ];

  return (
    <main className="relative min-h-screen bg-[#faf9f8] selection:bg-deepgold/20">
      {/* 
        HERO SECTION 
        Dribbble-style: Clean, split layout with large cinematic imagery.
      */}
      <section className="relative pt-[70px] lg:pt-[85px] min-h-[90vh] flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side: Copy */}
        <div className="flex-1 flex flex-col justify-center px-6 lg:px-16 xl:px-24 py-16 z-10">
          <p className="mb-6 flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.3em] text-deepgold">
            <span className="inline-block h-px w-10 bg-deepgold/60" />
            <TextReveal delay={0.1}>Bespoke Fine Jewelry</TextReveal>
          </p>
          
          <h1 className="font-serif text-[60px] leading-[0.95] text-charcoal sm:text-[80px] lg:text-[100px] mb-8">
            <span className="block overflow-hidden pb-2"><TextReveal delay={0.3}>Elegance</TextReveal></span>
            <span className="block overflow-hidden pb-2"><TextReveal delay={0.5}><span className="italic text-deepgold">without</span></TextReveal></span>
            <span className="block overflow-hidden pb-2"><TextReveal delay={0.7}>compromise.</TextReveal></span>
          </h1>
          
          <div className="max-w-md text-[15px] font-light leading-relaxed text-charcoal/70 mb-10">
            <TextReveal delay={0.9}>
              Discover our signature collection of conflict-free diamonds and heirloom-quality 22K gold. Custom-designed to celebrate your unique story.
            </TextReveal>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <Link href="/builder" className="bg-charcoal px-10 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-ivory transition hover:bg-deepgold shadow-xl">
              Design Your Ring
            </Link>
            <a href="#collections" className="px-10 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-charcoal transition hover:text-deepgold border-b border-transparent hover:border-deepgold">
              View Collections
            </a>
          </div>
        </div>

        {/* Right Side: Cinematic Image */}
        <div className="flex-1 relative min-h-[50vh] lg:min-h-full">
          <div className="absolute inset-0 lg:rounded-bl-[100px] overflow-hidden">
            <Image 
              src="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=1200" 
              alt="High fashion jewelry model"
              fill
              className="object-cover object-center scale-105 hover:scale-100 transition-transform duration-[2s] ease-out"
              priority
            />
            {/* Soft gradient overlay for text readability if it overlaps on mobile */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#faf9f8] via-transparent to-transparent lg:hidden" />
          </div>
        </div>
      </section>

      {/* FEATURED CATEGORIES (Dribbble Grid Style) */}
      <section id="collections" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-deepgold mb-3">Curated Selection</p>
            <h2 className="font-serif text-[44px] leading-none sm:text-[60px] text-charcoal">
              Shop by <span className="italic text-deepgold">category</span>
            </h2>
          </div>
          <Link href="/builder" className="mt-6 md:mt-0 text-[12px] uppercase tracking-widest border-b border-charcoal pb-1 hover:text-deepgold transition-colors inline-block w-max">
            Open Ring Builder &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((c, i) => (
            <div key={c.name} className="group relative aspect-[4/5] overflow-hidden bg-zinc-100 cursor-pointer">
              <Image 
                src={c.image} 
                alt={c.name} 
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="font-serif text-2xl text-ivory mb-1">{c.name}</p>
                <span className="text-[11px] uppercase tracking-widest text-ivory/70 group-hover:text-gold transition-colors flex items-center gap-2">
                  Explore <span className="translate-x-0 group-hover:translate-x-2 transition-transform">&rarr;</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATALOG / QUICK SHOP */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-16">
            <h2 className="font-serif text-[40px] text-charcoal">New Arrivals</h2>
            <div className="w-12 h-px bg-deepgold mx-auto mt-6" />
          </div>
          <HomeShop ratePerGram={7200} rateLabel="22K Gold" />
        </div>
      </section>

      {/* BRAND STORY / VISIT */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <StoreSections />
      </section>

      <section className="bg-zinc-50 border-t border-zinc-200">
        <Faq />
      </section>

      {/* Floating WhatsApp */}
      <a
        href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hi ${SHOP_NAME}! I would like to design a custom ring.`)}`}
        target="_blank"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-[70] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-2xl text-white shadow-2xl hover:scale-110 transition-transform"
      >
        &#x1F4AC;
      </a>
      
      <ConciergeBot />

      {/* FOOTER */}
      <footer className="bg-charcoal text-ivory pt-20 pb-10">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:px-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <h3 className="font-serif text-3xl mb-4 italic text-gold">Nexora</h3>
            <p className="text-[14px] font-light text-ivory/60 max-w-sm leading-relaxed">
              Crafting extraordinary jewelry for life&apos;s most precious moments. From bespoke engagement rings to timeless temple heritage pieces.
            </p>
          </div>
          <div>
            <p className="mb-6 text-[11px] uppercase tracking-[0.3em] text-gold font-bold">Boutique</p>
            <address className="text-[14px] text-ivory/70 not-italic leading-loose">
              Bhagwan Nagar Ground<br />
              Nagpur, MH 440027<br />
              Open Daily 11AM - 8PM
            </address>
          </div>
          <div>
            <p className="mb-6 text-[11px] uppercase tracking-[0.3em] text-gold font-bold">Connect</p>
            <ul className="text-[14px] text-ivory/70 space-y-3">
              <li><a href="#" className="hover:text-gold transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Pinterest</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">WhatsApp Concierge</a></li>
            </ul>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-6 lg:px-10 mt-16 pt-8 border-t border-ivory/10 text-center flex flex-col md:flex-row justify-between items-center text-[11px] uppercase tracking-widest text-ivory/40">
          <p>&copy; {new Date().getFullYear()} Nexora Jewellers.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-ivory">Privacy Policy</a>
            <a href="#" className="hover:text-ivory">Terms of Service</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
