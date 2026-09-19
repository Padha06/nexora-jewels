'use client';

import ModelViewer from './ModelViewer';

export default function DemoGallery() {
  return (
    <section className="bg-zinc-50 border-y border-sand py-20 px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <p className="eyebrow mb-3">Live Try-On Demo</p>
          <h2 className="font-serif text-[40px] text-charcoal">Interactive <span className="italic text-deepgold">3D & AR</span></h2>
          <p className="mt-4 text-charcoal/60 max-w-lg mx-auto text-sm">
            Drag to view the signature piece from every angle. On mobile, tap "View in AR" to see the jewellery in your own space or try it on.
          </p>
        </div>
        <div className="bg-white p-4 rounded-[24px] shadow-sm border border-sand">
          <div className="mb-4">
            <ModelViewer src="showcase" alt="Signature gold showcase piece" fallbackImage="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80&auto=format&fit=crop" />
          </div>
          <div className="text-center pb-2">
            <p className="font-serif text-2xl">Signature Showcase</p>
            <p className="text-xs uppercase tracking-[0.2em] text-deepgold mt-1">View in 360°</p>
          </div>
        </div>
      </div>
    </section>
  );
}
