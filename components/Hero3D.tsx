'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useGLTF, Center, Bounds } from '@react-three/drei';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

// GLB Mannequin loaded from client's file
function Mannequin() {
  const { scene } = useGLTF('/bust.glb');
  
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        // Apply a premium luxury marble/resin look to the bust for the homepage
        mesh.material = new THREE.MeshPhysicalMaterial({ 
          color: '#fdfbf6', 
          roughness: 0.3,
          metalness: 0.1,
          clearcoat: 0.5,
          clearcoatRoughness: 0.2
        });
      }
    });
  }, [scene]);

  return <primitive object={scene} />;
}
useGLTF.preload('/bust.glb');

// Actual Necklace loaded from client's file
function RealNecklace() {
  const { scene } = useGLTF('/necklace_models/scene.gltf');
  
  useEffect(() => {
    // Optional: enforce a high-end gold material if the source GLTF materials aren't PBR perfect
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        // Comment out the line below to use the necklace's original native materials
        // mesh.material = new THREE.MeshStandardMaterial({ color: '#FFD700', metalness: 1, roughness: 0.15 });
      }
    });
  }, [scene]);

  return <primitive object={scene} />;
}
useGLTF.preload('/necklace_models/scene.gltf');

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
          <Center position={[0, 0, 0]}>
            <Mannequin />
            {/* User-provided transform values for the real necklace */}
            <group position={[0, 0.42, 0.08]} rotation={[-0.15, 0, 0]} scale={0.9}>
              <RealNecklace />
            </group>
          </Center>
        </Bounds>
        
        <ContactShadows position={[0, -2.2, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
        <OrbitControls
          makeDefault
          enableDamping
          enablePan={false}
          minDistance={1.5}
          maxDistance={7}
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
