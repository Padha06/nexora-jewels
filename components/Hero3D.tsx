'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Sparkles, useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';

// Temple-gold dressing for the raw scan (position-only geometry, no materials):
// smooth computed normals + baked antique patina (mottled warm tone, darker
// crevices) via per-vertex colours — the "texture" that echoes the client's
// temple-necklace reference (antique gold, ruby/emerald/pearl on ivory).
function hash3(x: number, y: number, z: number): number {
  const s = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
  return s - Math.floor(s);
}

function ShowcasePiece() {
  const { scene } = useGLTF('/showcase.glb');
  const spin = useRef<THREE.Group>(null);

  const model = useMemo(() => {
    const clone = scene.clone(true);
    const gold = new THREE.MeshPhysicalMaterial({
      color: '#b98a2e', // deep antique temple gold
      metalness: 1,
      roughness: 0.38,
      clearcoat: 0.45,
      clearcoatRoughness: 0.35,
      envMapIntensity: 1.1,
      vertexColors: true
    });
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const geo = mesh.geometry;
        geo.computeVertexNormals();
        // Bake patina: mottled tone + darker downward crevices
        const pos = geo.attributes.position as THREE.BufferAttribute;
        const nor = geo.attributes.normal as THREE.BufferAttribute;
        const colors = new Float32Array(pos.count * 3);
        for (let i = 0; i < pos.count; i++) {
          const mottle =
            0.9 +
            0.1 *
              hash3(
                Math.floor(pos.getX(i) * 7),
                Math.floor(pos.getY(i) * 7),
                Math.floor(pos.getZ(i) * 7)
              );
          const crevice = nor.getY(i) < 0 ? Math.min(1, -nor.getY(i)) : 0;
          colors[i * 3] = mottle * (1 - 0.28 * crevice);
          colors[i * 3 + 1] = mottle * (0.95 - 0.32 * crevice);
          colors[i * 3 + 2] = mottle * (0.88 - 0.34 * crevice);
        }
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
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

// Ivory-marble pedestal — echoes the reference bust, moulds into the theme.
function Pedestal() {
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.11, 0]} receiveShadow>
        <cylinderGeometry args={[2.4, 2.55, 0.22, 64]} />
        <meshPhysicalMaterial color="#ece1cf" roughness={0.45} metalness={0} clearcoat={0.4} />
      </mesh>
      <mesh position={[0, 0.22, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.4, 0.035, 12, 96]} />
        <meshStandardMaterial color="#9a7b2e" roughness={0.3} metalness={1} />
      </mesh>
    </group>
  );
}

// Signature 3D showcase in a jharokha-arch frame — no photography, pure theme:
// ivory gradient, gold hairlines, the piece on ivory marble.
export default function Hero3D() {
  return (
    <div className="relative mx-auto h-[520px] w-full max-w-md lg:h-[640px]">
      {/* arch frame */}
      <div className="absolute inset-0 rounded-t-[999px] rounded-b-[28px] border border-gold/60" />
      <div className="absolute inset-[10px] rounded-t-[999px] rounded-b-[22px] border border-gold/30" />
      {/* theme backdrop: ivory glow, zero stock photos */}
      <div
        className="absolute inset-[10px] overflow-hidden rounded-t-[999px] rounded-b-[22px]"
        style={{
          background:
            'radial-gradient(ellipse 70% 45% at 50% 30%, #fffdf8 0%, #f6efe0 45%, #eadfc8 100%)'
        }}
      >
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 45% 28% at 50% 68%, rgba(198,161,91,0.28), transparent 70%)' }}
        />
        {/* faint concentric hairlines */}
        <div className="absolute left-1/2 top-[30%] h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/20" />
        <div className="absolute left-1/2 top-[30%] h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/20" />
      </div>

      <Canvas
        shadows
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        camera={{ position: [0, 3.4, 11.5], fov: 35 }}
        className="!absolute !inset-[10px] !overflow-hidden"
        style={{ borderRadius: '999px 999px 22px 22px' }}
      >
        <ambientLight intensity={0.5} color="#fff6e5" />
        <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow />
        <pointLight position={[-6, 3, -4]} intensity={50} color="#c6a15b" />
        <pointLight position={[4, 2, 5]} intensity={25} color="#ffe9c4" />
        {/* jewel-tone kisses: ruby + emerald glints like the reference stones */}
        <pointLight position={[-4, 1.5, 4]} intensity={7} color="#c22744" distance={12} />
        <pointLight position={[4, 1.5, 4]} intensity={7} color="#1f9d63" distance={12} />

        <ShowcasePiece />
        <Pedestal />
        <Sparkles count={30} scale={[7, 4, 4]} size={3} speed={0.35} color="#e9c877" opacity={0.5} />
        <ContactShadows position={[0, -0.02, 0]} opacity={0.4} scale={16} blur={2.4} far={5} />

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

      {/* floating spec chips */}
      <div className="absolute -left-3 top-[24%] hidden rounded-full border border-sand bg-ivory/90 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-deepgold shadow-lg backdrop-blur sm:block">
        22K Antique Gold
      </div>
      <div className="absolute -right-3 top-[46%] hidden rounded-full border border-sand bg-ivory/90 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-deepgold shadow-lg backdrop-blur sm:block">
        Ruby · Emerald · Pearls
      </div>
      <div className="absolute -left-2 bottom-[16%] hidden rounded-full border border-sand bg-ivory/90 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-charcoal/70 shadow-lg backdrop-blur sm:block">
        ◉ Live 360°
      </div>
    </div>
  );
}
