'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { Product } from '@/lib/products';
import ModelViewer from './ModelViewer';

export default function TryOn({ product, all }: { product: Product | null; all: Product[] }) {
  const [slug, setSlug] = useState<string | null>(product?.slug ?? null);
  const active = all.find((p) => p.slug === slug) ?? null;

  if (!active) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {all.map((p) => (
          <button key={p.slug} onClick={() => setSlug(p.slug)} className="spot-card group rounded-[20px] text-left">
            <div className="relative h-56 overflow-hidden rounded-t-[20px]">
              <Image src={p.images[0]} alt={p.name} fill className="object-cover transition duration-700 group-hover:scale-105" />
            </div>
            <div className="p-4">
              <p className="text-[11px] uppercase tracking-[0.25em] text-deepgold">{p.sku}</p>
              <p className="font-serif text-xl">{p.name}</p>
            </div>
          </button>
        ))}
      </div>
    );
  }

  // Use a generic placeholder GLB or one specific to the category
  const getGlbUrl = (category: string) => {
    if (category === 'Rings') return 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Models/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb';
    if (category === 'Bangles') return 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Models/2.0/Corset/glTF-Binary/Corset.glb';
    return 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Models/2.0/Lantern/glTF-Binary/Lantern.glb'; // Earrings/Necklaces
  };

    const [currentUrl, setCurrentUrl] = useState('');

  // Set the current URL dynamically so the QR code works correctly
  // whether on localhost, a local IP, or in production.
  useEffect(() => {
    setCurrentUrl(`${window.location.origin}/try-on?product=${active.slug}`);
  }, [active.slug]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <button onClick={() => setSlug(null)} className="border border-sand bg-white px-4 py-2 text-[13px]">← All pieces</button>
        <p className="font-serif text-2xl">{active.name} <span className="text-[13px] font-sans uppercase tracking-[0.2em] text-deepgold">{active.sku}</span></p>
      </div>
      
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-[24px] bg-white border border-sand p-4 shadow-sm">
           <ModelViewer src={getGlbUrl(active.category)} alt={active.name} fallbackImage={active.images[0]} />
        </div>

        <div className="flex flex-col justify-center space-y-6">
          <div className="rounded-[18px] border border-sand bg-white p-8 text-center shadow-sm">
            <p className="text-[11px] uppercase tracking-[0.25em] text-deepgold font-bold mb-4">Mobile AR Try-On</p>
            <h3 className="font-serif text-3xl mb-4">Experience it in your space</h3>
            <p className="text-sm text-charcoal/70 mb-6 max-w-md mx-auto">
              For the most seamless AR Try-On experience, point your phone camera at this QR code. No apps to download, it works natively on iOS and Android.
            </p>
            
            <div className="mx-auto w-48 h-48 bg-zinc-100 border border-zinc-200 rounded-2xl flex items-center justify-center p-4">
              {currentUrl ? (
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(currentUrl)}`} alt="Scan to try on" className="w-full h-full opacity-80" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-zinc-400">Loading QR...</div>
              )}
            </div>
            
            <p className="text-[11px] uppercase tracking-widest text-charcoal/50 mt-6">
              Powered by Google ARCore & Apple ARKit
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
