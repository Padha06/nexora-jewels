'use client';

import { useState, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Bounds } from '@react-three/drei';
import NecklaceOnBust from './NecklaceOnBust';

const SKIN_TONES = {
  Fair: '#f1c27d',
  Wheatish: '#e0ac69',
  Dusky: '#8d5524',
};

export default function AvatarTryOn({ onClose }: { onClose: () => void }) {
  const [skin, setSkin] = useState<keyof typeof SKIN_TONES>('Wheatish');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const takeScreenshot = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.setAttribute('download', 'nexora-avatar-tryon.png');
      link.setAttribute('href', canvasRef.current.toDataURL('image/png').replace('image/png', 'image/octet-stream'));
      link.click();
    }
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent("Hi NEXORA! I tried on this necklace via your Virtual 3D Avatar and would like to know the price and details.");
    window.open(`https://wa.me/918554012234?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-50 flex flex-col overflow-hidden touch-none">
      {/* Top Bar */}
      <div className="absolute top-0 w-full px-6 py-5 flex justify-between items-center z-[102] bg-gradient-to-b from-black/10 to-transparent">
        <h2 className="font-serif text-2xl text-charcoal drop-shadow-sm">Virtual Avatar</h2>
        <button onClick={onClose} className="bg-white text-charcoal w-10 h-10 rounded-full flex items-center justify-center shadow-lg border border-zinc-200">
          ✕
        </button>
      </div>

      {/* 3D Canvas */}
      <div className="flex-1 w-full relative bg-gradient-to-b from-zinc-200 to-zinc-400">
        <Canvas 
          ref={canvasRef}
          gl={{ preserveDrawingBuffer: true, antialias: true }} 
          camera={{ position: [0, 0, 4], fov: 45 }}
        >
          <Suspense fallback={null}>
            <Environment preset="city" />
            <ambientLight intensity={0.4} />
            <spotLight position={[5, 10, 5]} intensity={1} penumbra={1} angle={0.5} />
            
        <Bounds fit clip observe margin={0.9}>
          <group position={[0, -1, 0]}>
            {/* Necklace auto-seated on the bust; skin tone switches live */}
            <NecklaceOnBust finish={SKIN_TONES[skin]} />
          </group>
        </Bounds>
            
            <ContactShadows position={[0, -2.5, 0]} opacity={0.5} scale={10} blur={2} far={4} />
            
            <OrbitControls 
              makeDefault
              enablePan={false} 
              minDistance={1.0} 
              maxDistance={5}
              minPolarAngle={Math.PI / 4} 
              maxPolarAngle={Math.PI / 2 + 0.1}
              minAzimuthAngle={-1.1}
              maxAzimuthAngle={1.1}
              autoRotate
              autoRotateSpeed={1.0}
            />
          </Suspense>
        </Canvas>

        <p className="absolute top-24 w-full text-center text-[10px] tracking-widest uppercase text-charcoal/60 font-bold z-10 pointer-events-none">
          Drag to rotate • Pinch to zoom
        </p>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 w-full bg-white rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-6 z-[102] pb-10">
        <div className="mb-6">
          <p className="text-[11px] uppercase tracking-[0.2em] text-charcoal/60 text-center mb-4 font-bold">Skin Tone</p>
          <div className="flex justify-center gap-5">
            {(Object.keys(SKIN_TONES) as Array<keyof typeof SKIN_TONES>).map((tone) => (
              <button 
                key={tone}
                onClick={() => setSkin(tone)}
                className={`w-14 h-14 rounded-full border-4 transition-transform duration-300 ${skin === tone ? 'border-deepgold scale-110 shadow-md' : 'border-transparent shadow-sm'}`}
                style={{ backgroundColor: SKIN_TONES[tone] }}
                aria-label={tone}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={takeScreenshot}
            className="border border-charcoal/20 bg-zinc-50 text-charcoal py-4 rounded-xl text-[12px] uppercase tracking-widest font-bold flex items-center justify-center gap-2 hover:bg-zinc-100 transition shadow-sm"
          >
            📸 Screenshot
          </button>
          <button 
            onClick={openWhatsApp}
            className="bg-[#25D366] text-white py-4 rounded-xl text-[12px] uppercase tracking-widest font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/30 hover:bg-[#20bd5a] transition"
          >
            💬 Enquire
          </button>
        </div>
      </div>
    </div>
  );
}
