'use client';

import ModelViewer from './ModelViewer';

export default function DemoGallery() {
  const models = [
    {
      id: 'ring',
      name: '22K Solitaire Ring',
      src: 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Models/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
      fallback: 'https://images.unsplash.com/photo-1605100804763-247f67b254a6?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'bangle',
      name: 'Bridal Gold Bangle',
      src: 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Models/2.0/Corset/glTF-Binary/Corset.glb',
      fallback: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'earring',
      name: 'Jhumki Earrings',
      src: 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Models/2.0/Lantern/glTF-Binary/Lantern.glb',
      fallback: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600'
    }
  ];

  return (
    <section className="bg-zinc-50 border-y border-sand py-20 px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <p className="eyebrow mb-3">Live Try-On Demo</p>
          <h2 className="font-serif text-[40px] text-charcoal">Interactive <span className="italic text-deepgold">3D & AR</span></h2>
          <p className="mt-4 text-charcoal/60 max-w-lg mx-auto text-sm">
            Drag to view the pieces from every angle. On mobile, tap "View in AR" to see the jewellery in your own space or try it on.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {models.map((model) => (
            <div key={model.id} className="bg-white p-4 rounded-[24px] shadow-sm border border-sand">
              <div className="mb-4">
                <ModelViewer src={model.src} alt={model.name} fallbackImage={model.fallback} />
              </div>
              <div className="text-center">
                <p className="font-serif text-xl">{model.name}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-deepgold mt-1">View in 360°</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
