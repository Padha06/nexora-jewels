'use client';

import ModelViewer from './ModelViewer';

export default function DemoGallery() {
  return (
    <section className="border-y border-sand bg-cream/60 py-20 px-6 lg:px-10">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <p className="eyebrow mb-3">Live Try-On Demo</p>
          <h2 className="font-serif text-[40px] text-charcoal">Interactive <span className="italic text-deepgold">3D & AR</span></h2>
          <p className="mt-4 text-charcoal/60 max-w-lg mx-auto text-sm">
            Drag to view the signature piece from every angle. On mobile, tap "View in AR" to see the jewellery in your own space or try it on.
          </p>
        </div>
        <ModelViewer src="showcase" alt="Signature gold showcase piece" fallbackImage="/temple-necklace.jpg" />
        <div className="text-center mt-6 pb-2">
          <p className="font-serif text-2xl">Signature Showcase</p>
          <p className="text-xs uppercase tracking-[0.2em] text-deepgold mt-1">View in 360°</p>
        </div>
      </div>
    </section>
  );
}
