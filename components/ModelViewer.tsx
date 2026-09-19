'use client';

import { useEffect, useRef, useState } from 'react';
import MediaPipeAR from './MediaPipeAR';
import AvatarTryOn from './AvatarTryOn';
import Hero3D from './Hero3D';

export default function ModelViewer({
  src = 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Models/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
  iosSrc = 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Models/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.usdz',
  alt = '22K Gold Ring',
  fallbackImage = 'https://images.unsplash.com/photo-1605100804763-247f67b254a6?auto=format&fit=crop&q=80&w=800',
  category = 'Rings'
}: {
  src?: string;
  iosSrc?: string;
  alt?: string;
  fallbackImage?: string;
  category?: string;
}) {
  const viewerRef = useRef<any>(null);

  useEffect(() => {
    import('@google/model-viewer');
  }, []);

  const [showAI, setShowAI] = useState(false);
  const [showAvatar, setShowAvatar] = useState(false);

  const handleLiveARClick = async () => {
    try {
      const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
      const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      
      if (isIOS && iosSrc) {
        const anchor = document.createElement('a');
        anchor.setAttribute('rel', 'ar');
        anchor.setAttribute('href', iosSrc);
        anchor.appendChild(document.createElement('img'));
        anchor.click();
        return;
      }

      setShowAI(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* 3D Avatar Try-On */}
      {showAvatar && (
        <AvatarTryOn onClose={() => setShowAvatar(false)} />
      )}

      {/* Universal Web AR Overlay using MediaPipe */}
      {showAI && (
        <MediaPipeAR 
          category={category} 
          imageUrl={fallbackImage} 
          onClose={() => setShowAI(false)} 
        />
      )}

      <div className="relative w-full overflow-hidden rounded-2xl bg-zinc-50 border border-zinc-200 shadow-inner group flex items-center justify-center min-h-[400px]">
        <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-0 transition duration-500 pointer-events-none">
           <p className="font-serif text-3xl font-bold tracking-widest text-zinc-400 uppercase">360° View</p>
        </div>
        
        {src === 'combined-bust' ? (
          <div className="absolute inset-0 z-10">
            <Hero3D />
          </div>
        ) : src ? (
          /* @ts-ignore */
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
            <div slot="poster" className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${fallbackImage})` }}></div>
            <div slot="ar-button" className="hidden"></div>
          {/* @ts-ignore */}
          </model-viewer>
        ) : (
          <div className="absolute inset-0 bg-cover bg-center opacity-50" style={{ backgroundImage: `url(${fallbackImage})` }}></div>
        )}
        
        <p className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-widest font-bold rounded-sm shadow-sm border border-zinc-200 text-zinc-600">
          Interact to Rotate
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3 lg:hidden">
        <button 
          onClick={() => setShowAvatar(true)}
          className="w-full bg-charcoal text-ivory py-4 rounded-xl uppercase tracking-widest text-[13px] font-bold hover:bg-deepgold transition-colors shadow-md flex items-center justify-center gap-3"
        >
          👤 Virtual 3D Try-On
        </button>
        <button 
          onClick={handleLiveARClick}
          className="w-full bg-white text-charcoal py-4 rounded-xl uppercase tracking-widest text-[13px] font-bold hover:bg-zinc-50 border border-charcoal/20 transition-colors shadow-sm flex items-center justify-center gap-3"
        >
          📸 Live Camera AR
        </button>
      </div>
    </div>
  );
}
