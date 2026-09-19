'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Sparkles } from '@react-three/drei';
import { useRef, useState } from 'react';
import * as THREE from 'three';

export const METALS = [
  { name: 'Yellow Gold', color: '#d4af37' },
  { name: 'Rose Gold', color: '#e0a387' },
  { name: 'White Gold', color: '#e8e8ec' }
] as const;

// Correct ring construction (per three.js jewelry references):
// upright shank (torus in XY plane) → seat/basket → girdle sits ON the band,
// pavilion tip hidden inside the shank, 4 prongs grip the crown, halo + shoulders.
function Ring({ metalColor }: { metalColor: string }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = state.clock.elapsedTime;
    if (group.current) group.current.position.y = Math.sin(t * 1.1) * 0.07;
  });

  const gold = (
    <meshPhysicalMaterial color={metalColor} metalness={1} roughness={0.18} clearcoat={1} clearcoatRoughness={0.1} envMapIntensity={1.4} />
  );
  const diamond = (
    <meshPhysicalMaterial
      color="#ffffff"
      metalness={0}
      roughness={0}
      transmission={1}
      thickness={0.55}
      ior={2.33}
      dispersion={5}
      clearcoat={1}
      clearcoatRoughness={0}
      envMapIntensity={1.6}
      flatShading
      side={THREE.DoubleSide}
    />
  );

  return (
    <group ref={group} rotation={[0.1, 0, 0.06]}>
      {/* shank — upright, opening faces the camera */}
      <mesh>
        <torusGeometry args={[1.5, 0.26, 40, 128]} />
        {gold}
      </mesh>

      {/* seat / basket the stone sits in (top of shank ≈ y 1.5) */}
      <mesh position={[0, 1.58, 0]}>
        <cylinderGeometry args={[0.34, 0.44, 0.3, 6]} />
        {gold}
      </mesh>

      {/* solitaire: pavilion (tip down into the seat) + girdle + crown + table */}
      <group position={[0, 1.62, 0]}>
        <mesh position={[0, 0.28, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.58, 0.62, 8]} />
          {diamond}
        </mesh>
        <mesh position={[0, 0.72, 0]}>
          <cylinderGeometry args={[0.36, 0.58, 0.3, 8]} />
          {diamond}
        </mesh>
        {/* 4 prongs gripping the crown */}
        {[45, 135, 225, 315].map((deg) => {
          const a = (deg * Math.PI) / 180;
          return (
            <mesh key={deg} position={[Math.cos(a) * 0.52, 0.72, Math.sin(a) * 0.52]}>
              <cylinderGeometry args={[0.045, 0.055, 0.55, 8]} />
              {gold}
            </mesh>
          );
        })}
      </group>

      {/* halo ring of melee stones around the seat */}
      <group position={[0, 1.52, 0]}>
        {Array.from({ length: 14 }).map((_, i) => {
          const a = (i / 14) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 0.82, 0, Math.sin(a) * 0.82]}>
              <sphereGeometry args={[0.075, 12, 12]} />
              {diamond}
            </mesh>
          );
        })}
      </group>

      {/* shoulder stones sunk into each side of the shank */}
      {[-1, 1].map((side) =>
        [0.42, 0.72, 1.0].map((ang, i) => (
          <mesh
            key={`${side}-${i}`}
            position={[side * Math.sin(ang) * 1.5, Math.cos(ang) * 1.5, 0]}
          >
            <octahedronGeometry args={[0.11 - i * 0.015, 0]} />
            {diamond}
          </mesh>
        ))
      )}
    </group>
  );
}

// Signature 3D hero piece — homepage + flagship only, lazy-loaded via dynamic import.
export default function Hero3D() {
  const [metal, setMetal] = useState<(typeof METALS)[number]>(METALS[0]);
  return (
    <div>
      <div className="relative h-[440px] cursor-grab active:cursor-grabbing sm:h-[520px]">
        <Canvas camera={{ position: [0, 0.9, 7.4], fov: 36 }} dpr={[1, 2]}>
          <ambientLight intensity={0.7} color="#fff6e5" />
          <directionalLight position={[4, 6, 5]} intensity={1.6} />
          <pointLight position={[-5, 2, -3]} intensity={60} color="#c6a15b" />
          <pointLight position={[3, -2, 4]} intensity={30} color="#ffe9c4" />
          <Ring metalColor={metal.color} />
          <Sparkles count={40} scale={[6, 4, 3]} size={3} speed={0.35} color="#e9c877" opacity={0.6} />
          <ContactShadows position={[0, -2.1, 0]} opacity={0.35} blur={2.6} />
          <OrbitControls
            target={[0, 0.7, 0]}
            enableDamping
            enablePan={false}
            minDistance={4.5}
            maxDistance={10}
            autoRotate={
              typeof window !== 'undefined' &&
              !window.matchMedia('(prefers-reduced-motion: reduce)').matches
            }
            autoRotateSpeed={1.2}
          />
          <Environment preset="studio" />
        </Canvas>
        <p className="absolute bottom-4 left-0 right-0 text-center text-[11px] uppercase tracking-[0.3em] text-charcoal/50">
          Drag to rotate · Scroll to zoom
        </p>
      </div>
      {/* live metal configurator — try the ring in your metal */}
      <div className="flex items-center justify-center gap-2 border-t border-sand py-3">
        <span className="mr-1 text-[11px] uppercase tracking-[0.2em] text-charcoal/55">Metal:</span>
        {METALS.map((m) => (
          <button
            key={m.name}
            onClick={() => setMetal(m)}
            title={m.name}
            aria-label={m.name}
            className={`h-6 w-6 rounded-full border ${metal.name === m.name ? 'border-charcoal ring-2 ring-gold ring-offset-2' : 'border-sand'}`}
            style={{ background: m.color }}
          />
        ))}
        <span className="ml-1 text-[12px] text-charcoal/60">{metal.name}</span>
      </div>
    </div>
  );
}
