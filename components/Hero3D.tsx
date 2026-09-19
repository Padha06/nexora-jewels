'use client';

import Image from 'next/image';
import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Sparkles, useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';

// Client showcase model: a raw photogrammetry scan (position-only geometry,
// no materials) — we compute normals and dress it in rich gold PBR here,
// which is the "texture" upgrade: faceted clearcoat gold + studio lighting.
function ShowcasePiece() {
  const { scene } = useGLTF('/showcase.glb');
  const spin = useRef<THREE.Group>(null);

  const model = useMemo(() => {
    const clone = scene.clone(true);
    const gold = new THREE.MeshPhysicalMaterial({
      color: '#d9b45c',
      metalness: 1,
      roughness: 0.27,
      clearcoat: 0.7,
      clearcoatRoughness: 0.25,
      envMapIntensity: 1.35,
      flatShading: true // faceted jewel sparkle suits the scan surface
    });
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.geometry.computeVertexNormals();
        mesh.material = gold;
        mesh.castShadow = true;
      }
    });
    return clone;
  }, [scene]);

  useFrame((state, delta) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (spin.current) spin.current.rotation.y += delta * 0.45;
  });

  return (
    <group ref={spin} position={[0, 1.15, 0]}>
      <Center>
        <primitive object={model} />
      </Center>
    </group>
  );
}
useGLTF.preload('/showcase.glb');

function Pedestal() {
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.11, 0]} receiveShadow>
        <cylinderGeometry args={[2.4, 2.55, 0.22, 64]} />
        <meshStandardMaterial color="#1c1917" roughness={0.35} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.22, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.4, 0.035, 12, 96]} />
        <meshStandardMaterial color="#c6a15b" roughness={0.25} metalness={1} />
      </mesh>
    </group>
  );
}

// Signature 3D showcase — homepage hero + gallery card.
export default function Hero3D({
  poster = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900&q=70&auto=format&fit=crop'
}: {
  poster?: string;
}) {
  return (
    <div className="relative h-full w-full cursor-grab active:cursor-grabbing">
      {/* Instant poster behind the transparent canvas while the model streams in */}
      <Image
        src={poster}
        alt="Gold jewellery showcase"
        fill
        className="object-cover opacity-90"
        priority={false}
      />
      <Canvas
        shadows
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        camera={{ position: [0, 3.4, 11.5], fov: 35 }}
        className="!absolute !inset-0"
      >
        <ambientLight intensity={0.45} color="#fff6e5" />
        <directionalLight position={[5, 8, 5]} intensity={1.6} castShadow />
        <pointLight position={[-6, 3, -4]} intensity={50} color="#c6a15b" />
        <pointLight position={[4, 2, 5]} intensity={25} color="#ffe9c4" />

        <ShowcasePiece />
        <Pedestal />
        <Sparkles count={36} scale={[7, 4, 4]} size={3} speed={0.35} color="#e9c877" opacity={0.55} />
        <ContactShadows position={[0, -0.02, 0]} opacity={0.45} scale={16} blur={2.4} far={5} />

        <OrbitControls
          makeDefault
          target={[0, 1.1, 0]}
          enableDamping
          enablePan={false}
          minDistance={5}
          maxDistance={24}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2 + 0.1}
          autoRotate={
            typeof window !== 'undefined' &&
            !window.matchMedia('(prefers-reduced-motion: reduce)').matches
          }
          autoRotateSpeed={1.0}
        />
        <Environment preset="city" />
      </Canvas>
      <p className="absolute bottom-4 left-0 right-0 text-center text-[10px] uppercase tracking-[0.3em] text-charcoal/40 font-bold pointer-events-none">
        Drag to rotate
      </p>
    </div>
  );
}
