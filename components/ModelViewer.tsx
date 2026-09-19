'use client';

import { useEffect, useRef, useState } from 'react';

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

  const [showWebAR, setShowWebAR] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleARClick = async () => {
    try {
      const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
      const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      
      // On iOS, Native AR Quick Look is extremely reliable and doesn't have the ARCore fragmentation issue.
      if (isIOS && iosSrc) {
        const anchor = document.createElement('a');
        anchor.setAttribute('rel', 'ar');
        anchor.setAttribute('href', iosSrc);
        anchor.appendChild(document.createElement('img'));
        anchor.click();
        return;
      }

      // For Android and other devices (especially Betas like Android 16 without ARCore), 
      // we use an instant, ultra-compatible Web Camera Overlay!
      setShowWebAR(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Camera launch failed", err);
      alert("Please allow camera permissions to try this piece on.");
      setShowWebAR(false);
    }
  };

  const closeWebAR = () => {
    setShowWebAR(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Universal Web AR Overlay */}
      {showWebAR && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden touch-none">
          <video 
            ref={videoRef} 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover" 
          />
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[101]">
            <img 
              src={fallbackImage} 
              alt={alt} 
              className="w-2/3 max-w-[250px] drop-shadow-2xl opacity-90 mix-blend-multiply" 
              style={{ filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.5))' }}
            />
          </div>

          <div className="absolute top-10 w-full px-6 flex justify-between items-start z-[102]">
            <p className="bg-black/50 text-white text-xs px-4 py-2 rounded-full backdrop-blur-md">
              Line up your hand or face with the piece
            </p>
            <button 
              onClick={closeWebAR}
              className="bg-white/20 text-white w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30"
            >
              ✕
            </button>
          </div>
        </div>
      )}

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
