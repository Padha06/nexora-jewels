'use client';

import { useEffect } from 'react';

// Using a generic rings/jewelry GLB URL from Google's model-viewer examples if available, 
// or providing a fallback that the user can replace with their own.
export default function ModelViewer({
  src = 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Models/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
  iosSrc = 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Models/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.usdz',
  alt = '22K Gold Ring',
  fallbackImage = 'https://images.unsplash.com/photo-1605100804763-247f67b254a6?auto=format&fit=crop&q=80&w=800'
}: {
  src?: string;
  iosSrc?: string;
  alt?: string;
  fallbackImage?: string;
}) {
  useEffect(() => {
    // Dynamically load the model-viewer script only on the client
    import('@google/model-viewer');
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-zinc-50 border border-zinc-200 shadow-inner group flex items-center justify-center min-h-[400px]">
      <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-0 transition duration-500 pointer-events-none">
         <p className="font-serif text-3xl font-bold tracking-widest text-zinc-400 uppercase">360° View</p>
      </div>
      
      {/* @ts-ignore - model-viewer is a custom element */}
      <model-viewer
        src={src}
        {...(iosSrc ? { 'ios-src': iosSrc } : {})}
        alt={alt}
        auto-rotate
        camera-controls
        ar
        ar-modes="webxr scene-viewer quick-look"
        shadow-intensity="1"
        style={{ width: '100%', height: '400px', backgroundColor: 'transparent' }}
      >
        <div slot="poster" className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${fallbackImage})` }}>
           {/* Fallback image shown while model loads */}
        </div>
      {/* @ts-ignore */}
      </model-viewer>
      
      <p className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-widest font-bold rounded-sm shadow-sm border border-zinc-200 text-zinc-600">
        Interact to Rotate
      </p>
    </div>
  );
}
