'use client';

import { useEffect, useRef } from 'react';

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
  const viewerRef = useRef<any>(null);

  useEffect(() => {
    // Dynamically load the model-viewer script only on the client
    import('@google/model-viewer');
  }, []);

  const handleARClick = () => {
    try {
      const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
      const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      const isAndroid = /android/i.test(ua);

      if (isIOS && iosSrc) {
        // Direct Apple AR Quick Look launch
        const anchor = document.createElement('a');
        anchor.setAttribute('rel', 'ar');
        anchor.setAttribute('href', iosSrc);
        anchor.appendChild(document.createElement('img')); // Required by older iOS
        anchor.click();
      } else if (isAndroid) {
        // Direct Google Scene Viewer launch
        const intentUrl = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(src)}&mode=ar_only#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;end;`;
        window.location.href = intentUrl;
      } else {
        // Fallback for other systems
        if (viewerRef.current) {
          viewerRef.current.activateAR();
        }
      }
    } catch (err) {
      console.error("AR Launch failed", err);
      // Failsafe
      if (viewerRef.current) viewerRef.current.activateAR();
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="relative w-full overflow-hidden rounded-2xl bg-zinc-50 border border-zinc-200 shadow-inner group flex items-center justify-center min-h-[400px]">
        <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-0 transition duration-500 pointer-events-none">
           <p className="font-serif text-3xl font-bold tracking-widest text-zinc-400 uppercase">360° View</p>
        </div>
        
        {/* @ts-ignore - model-viewer is a custom element */}
        <model-viewer
          ref={viewerRef}
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
          {/* Hide the default internal AR button to avoid confusion */}
          <div slot="ar-button" className="hidden"></div>
        {/* @ts-ignore */}
        </model-viewer>
        
        <p className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-widest font-bold rounded-sm shadow-sm border border-zinc-200 text-zinc-600">
          Interact to Rotate
        </p>
      </div>

      <button 
        onClick={handleARClick}
        className="mt-6 w-full bg-charcoal text-ivory py-4 rounded-xl uppercase tracking-widest text-[13px] font-bold hover:bg-deepgold transition-colors shadow-md flex items-center justify-center gap-3 lg:hidden"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><rect x="7" y="7" width="10" height="10" rx="1"/><path d="M10 14.5v-5L14.5 12z"/></svg>
        Try on in your space
      </button>
    </div>
  );
}
