'use client';

import { useMemo, useEffect } from 'react';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';

// Measured from the actual files (see repo notes):
// - bust.glb: upright display bust, neck opening faces straight up at
//   ≈ (−5.3, 15, 36), chest front ≈ z 30–35, plus an invisible-from-front
//   backdrop slab at z 45–55. Front faces +z.
// - necklace scene.gltf: loop lying FLAT in XZ (≈11.6 × 12.2), pendant stones
//   on the +z edge, chain thickness ≈6 in y.
const NECK_X = -5; // under the neck opening
const LOOP_TOP_Y = 13; // loop top tucks just under the neck
const PLANE_Z = 36.5; // resting on the chest front, clear of the surface
const TARGET_WIDTH = 16; // necklace width vs ~21-wide shoulders
const LEAN = 0.12; // top tips back toward the neck, bottom kicks onto chest

// Necklace seated on the bust from MEASURED bounding boxes — placement is
// derived from the real geometry, so it survives either GLB being swapped.
export default function NecklaceOnBust({ finish }: { finish: 'marble' | string }) {
  const { scene: bustScene } = useGLTF('/bust.glb');
  const { scene: neckScene } = useGLTF('/necklace_models/scene.gltf');

  // Clone per mount: one Object3D can only live in ONE canvas — the bust
  // renders in both the hero and the gallery card, so sharing the cached
  // scene would silently unparent it from the first canvas (blank view).
  // Clones share geometry (cheap); each gets its own material below.
  const bust = useMemo(() => bustScene.clone(true), [bustScene]);
  const necklace = useMemo(() => neckScene.clone(true), [neckScene]);

  // Bust finish: ivory marble for showcase, skin tone for avatar try-on
  useEffect(() => {
    const mat =
      finish === 'marble'
        ? new THREE.MeshPhysicalMaterial({
            color: '#fdfbf6', roughness: 0.3, metalness: 0.1,
            clearcoat: 0.5, clearcoatRoughness: 0.2
          })
        : new THREE.MeshStandardMaterial({ color: finish, roughness: 0.4, metalness: 0.1 });
    bust.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) (child as THREE.Mesh).material = mat;
    });
    return () => { mat.dispose(); };
  }, [bust, finish]);

  const placement = useMemo(() => {
    const bustBox = new THREE.Box3().setFromObject(bust);
    const neckBox = new THREE.Box3().setFromObject(necklace);
    const bustSize = bustBox.getSize(new THREE.Vector3());
    const bustCenter = bustBox.getCenter(new THREE.Vector3());
    const neckSize = neckBox.getSize(new THREE.Vector3());
    if (bustSize.x <= 0 || neckSize.x <= 0) return null;
    // Stand the flat loop upright: +90° about X sends the +z pendant edge
    // to the bottom; LEAN tips the top back onto the neck slope.
    const scale = (TARGET_WIDTH / neckSize.x) * 1.0;
    const standingH = neckSize.z * scale;
    const world = new THREE.Vector3(
      NECK_X,
      LOOP_TOP_Y - standingH / 2 + 0.5,
      PLANE_Z
    );
    return { scale, position: world.sub(bustCenter).toArray() as [number, number, number] };
  }, [bust, necklace]);

  return (
    <group>
      <Center position={[0, 0, 0]}>
        <primitive object={bust} />
      </Center>
      {placement && (
        <Center position={placement.position}>
          <group rotation={[Math.PI / 2 - LEAN, 0, 0]} scale={placement.scale}>
            <primitive object={necklace} />
          </group>
        </Center>
      )}
    </group>
  );
}

useGLTF.preload('/bust.glb');
useGLTF.preload('/necklace_models/scene.gltf');
