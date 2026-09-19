'use client';

import { useEffect, useRef, useState } from 'react';
import '@google/model-viewer';

const METALS = [
  { id: 'white', name: 'Platinum / White Gold', color: [0.95, 0.95, 0.95, 1], hex: '#f0f0f0' },
  { id: 'yellow', name: '18K Yellow Gold', color: [1, 0.843, 0, 1], hex: '#FFD700' },
  { id: 'rose', name: '18K Rose Gold', color: [0.95, 0.65, 0.58, 1], hex: '#B76E79' },
];

export default function RingConfigurator() {
  const viewerRef = useRef<any>(null);
  const [activeMetal, setActiveMetal] = useState(METALS[0]);
  const [isLoaded, setIsLoaded] = useState(false);

  // We use the same scene.gltf or a placeholder ring.glb.
  // For now, we fallback to a beautiful sample ring if no specific ring GLB is provided.
  const ringSrc = 'https://modelviewer.dev/shared-assets/models/Ring.glb';

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    const handleLoad = () => {
      setIsLoaded(true);
      updateMaterial(activeMetal);
    };

    viewer.addEventListener('load', handleLoad);
    return () => viewer.removeEventListener('load', handleLoad);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      updateMaterial(activeMetal);
    }
  }, [activeMetal, isLoaded]);

  const updateMaterial = (metal: typeof METALS[0]) => {
    const viewer = viewerRef.current;
    if (!viewer || !viewer.model || !viewer.model.materials) return;

    // Apply the chosen metal color to the ring's base material
    // Note: The index [0] corresponds to the primary metal body in the standard sample Ring.glb
    // If using a custom GLB, this index might need to target the specific metal mesh by name.
    for (const material of viewer.model.materials) {
      if (material.name.toLowerCase().includes('metal') || material.name.toLowerCase().includes('gold') || material.name.toLowerCase().includes('base')) {
         material.pbrMetallicRoughness.setBaseColorFactor(metal.color);
         material.pbrMetallicRoughness.setMetallicFactor(1.0);
         material.pbrMetallicRoughness.setRoughnessFactor(0.1);
      }
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-10 min-h-[80vh] items-center bg-[#faf9f8]">
      {/* Left: 3D Viewer Area */}
      <div className="relative w-full h-[60vh] lg:h-[80vh] bg-zinc-100 flex items-center justify-center overflow-hidden">
        {/* @ts-ignore */}
        <model-viewer
          ref={viewerRef}
          src={ringSrc}
          alt="Custom 3D Ring"
          auto-rotate
          camera-controls
          environment-image="neutral"
          shadow-intensity="1.5"
          shadow-softness="1"
          exposure="1.2"
          style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
        >
          <div slot="progress-bar" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-sm tracking-widest text-zinc-500 animate-pulse">
            LOADING 3D MODEL...
          </div>
        {/* @ts-ignore */}
        </model-viewer>
      </div>

      {/* Right: Configuration Controls */}
      <div className="flex flex-col justify-center px-8 lg:px-16 py-12">
        <div className="max-w-md">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-deepgold mb-4">
            Create Your Own
          </p>
          <h1 className="font-serif text-[42px] leading-tight text-charcoal mb-4">
            The Signature Solitaire
          </h1>
          <p className="text-zinc-500 font-light leading-relaxed mb-10 text-sm">
            Customize your dream ring. Experience it in fully interactive 3D, select your preferred precious metal, and view exactly how it will catch the light from every angle.
          </p>

          <div className="space-y-8">
            {/* Metal Selection */}
            <div>
              <div className="flex justify-between items-end mb-4">
                <h3 className="font-serif text-lg text-charcoal">Precious Metal</h3>
                <span className="text-[11px] uppercase tracking-widest text-zinc-400 font-bold">
                  {activeMetal.name}
                </span>
              </div>
              <div className="flex gap-4">
                {METALS.map((metal) => (
                  <button
                    key={metal.id}
                    onClick={() => setActiveMetal(metal)}
                    className={`w-14 h-14 rounded-full border-2 transition-all flex items-center justify-center
                      ${activeMetal.id === metal.id ? 'border-charcoal p-1 scale-110 shadow-lg' : 'border-transparent hover:scale-105'}
                    `}
                    aria-label={`Select ${metal.name}`}
                  >
                    <span 
                      className="w-full h-full rounded-full shadow-inner block"
                      style={{ 
                        background: `linear-gradient(135deg, ${metal.hex}88 0%, ${metal.hex} 50%, ${metal.hex}dd 100%)`
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-zinc-200" />

            {/* Simulated Add to Cart */}
            <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center">
              <div className="w-full sm:w-auto flex-grow text-center sm:text-left">
                <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400 font-bold">Estimated Price</p>
                <p className="font-serif text-2xl text-charcoal">, 45,000</p>
              </div>
              <button className="w-full sm:w-auto bg-charcoal text-ivory px-10 py-4 text-[11px] font-bold uppercase tracking-[0.2em] transition hover:bg-deepgold rounded-full shadow-xl">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
