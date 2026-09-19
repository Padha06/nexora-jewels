'use client';

import { useMemo, useEffect } from 'react';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';

// Tunables (only touch if a new bust/necklace pair looks off)
const NECKLACE_WIDTH_RATIO = 0.62; // necklace width as a fraction of bust width
const NECK_DROP_RATIO = 0.3; // how far below the bust top the necklace sits (× bust height)
const NECK_FORWARD_RATIO = 0.3; // how far in front of bust centre (× bust depth)
const NECK_TILT = -0.12; // lean back onto the chest slope

// Necklace seated on the bust from MEASURED bounding boxes — no magic numbers,
// so it stays correct even if the client swaps either GLB file.
export default function NecklaceOnBust({ finish }: { finish: 'marble' | string }) {
  const { scene: bust } = useGLTF('/bust.glb');
  const { scene: necklace } = useGLTF('/necklace_models/scene.gltf');

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

  // Measure in LOCAL space; <Center> re-frames both models to the same origin,
  // so local sizes map 1:1 onto the centered world.
  const placement = useMemo(() => {
    const bustBox = new THREE.Box3().setFromObject(bust);
    const neckBox = new THREE.Box3().setFromObject(necklace);
    const bustSize = bustBox.getSize(new THREE.Vector3());
    const neckSize = neckBox.getSize(new THREE.Vector3());
    if (bustSize.x <= 0 || neckSize.x <= 0) return null;
    return {
      scale: (bustSize.x * NECKLACE_WIDTH_RATIO) / neckSize.x,
      position: new THREE.Vector3(
        0,
        bustSize.y * 0.5 - bustSize.y * NECK_DROP_RATIO,
        bustSize.z * NECK_FORWARD_RATIO
      )
    };
  }, [bust, necklace]);

  return (
    <group>
      <Center position={[0, 0, 0]}>
        <primitive object={bust} />
      </Center>
      {placement && (
        <Center position={placement.position.toArray() as [number, number, number]}>
          <group rotation={[NECK_TILT, 0, 0]} scale={placement.scale}>
            <primitive object={necklace} />
          </group>
        </Center>
      )}
    </group>
  );
}

useGLTF.preload('/bust.glb');
useGLTF.preload('/necklace_models/scene.gltf');
