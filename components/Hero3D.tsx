'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Bounds } from '@react-three/drei';
import NecklaceOnBust from './NecklaceOnBust';

// Signature 3D hero piece — homepage only
export default function Hero3D() {
  return (
    <div className="relative h-full w-full cursor-grab active:cursor-grabbing">
      <Canvas 
        gl={{ preserveDrawingBuffer: true, antialias: true }} 
        camera={{ position: [0, 0, 4.5], fov: 35 }}
      >
        <ambientLight intensity={0.5} color="#fff6e5" />
        <directionalLight position={[4, 6, 5]} intensity={1.5} />
        <pointLight position={[-5, 2, -3]} intensity={40} color="#c6a15b" />
        
        <Bounds fit clip observe margin={0.9}>
          <group position={[0, -1, 0]}> {/* Shift down slightly so it's centered in the viewport */}
            {/* Necklace auto-seated on the bust from measured bounding boxes */}
            <NecklaceOnBust finish="marble" />
          </group>
        </Bounds>
        
        <ContactShadows position={[0, -2.2, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
        <OrbitControls
          makeDefault
          enableDamping
          enablePan={false}
          minDistance={1.5}
          maxDistance={7}
          // Front hemisphere only — the bust's display backdrop lives behind it
          minAzimuthAngle={-1.1}
          maxAzimuthAngle={1.1}
          minPolarAngle={Math.PI / 5}
          maxPolarAngle={Math.PI / 2 + 0.15}
          autoRotate={
            typeof window !== 'undefined' &&
            !window.matchMedia('(prefers-reduced-motion: reduce)').matches
          }
          autoRotateSpeed={0.8}
        />
        <Environment preset="city" />
      </Canvas>
      <p className="absolute bottom-4 left-0 right-0 text-center text-[10px] uppercase tracking-[0.3em] text-charcoal/40 font-bold pointer-events-none">
        Drag to rotate
      </p>
    </div>
  );
}
