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

// Procedural Placeholder Necklace
function GoldNecklace() {
  return (
    <group position={[0, 0, 0]}>
      {/* Choker/Chain around the neck */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2 + 0.2, 0, 0]}>
        <torusGeometry args={[0.48, 0.03, 32, 100]} />
        <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.15} envMapIntensity={2} />
      </mesh>
      {/* Pendant hanging down */}
      <mesh position={[0, -0.35, 0.45]} rotation={[Math.PI / 4, 0, Math.PI / 4]}>
        <octahedronGeometry args={[0.15]} />
        <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1} envMapIntensity={2.5} />
      </mesh>
      {/* Diamond in the center */}
      <mesh position={[0, -0.35, 0.55]}>
        <sphereGeometry args={[0.05, 32, 32]} />
        <meshPhysicalMaterial color="#FFFFFF" metalness={0.1} roughness={0} transmission={1} ior={2.4} thickness={0.5} envMapIntensity={3} />
      </mesh>
    </group>
  );
}

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
        
        <Bounds fit clip observe margin={1.2}>
          <Center position={[0, 0, 0]}>
            <Mannequin />
            <group position={[0, 1.2, 0]} scale={1}>
              <GoldNecklace />
            </group>
          </Center>
        </Bounds>
        
        <ContactShadows position={[0, -2.2, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
        <OrbitControls
          makeDefault
          enableDamping
          enablePan={false}
          minDistance={3}
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
