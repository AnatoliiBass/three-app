"use client";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import * as THREE from "three";
interface BoxProps {
    position: [number, number, number];
}
const Plane = () => {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
            <planeBufferGeometry attach="geometry" args={[100, 100]} />
            <shadowMaterial attach="material" opacity={0.3} />
        </mesh>
    );
};
const Box = (props: BoxProps) => {
    const ref = useRef<THREE.Mesh | null>(null);
    const [crate, stone] = useLoader(THREE.TextureLoader, ["textures/boxes/wood.jpg", 
    "textures/boxes/stones.jpg"]);
    useFrame(()=>{
        if(ref.current){
            ref.current.rotation.x += 0.01;
        }
    });
  return (
    <>
        {ref && (
            <mesh {...props} ref={ref}>
            <boxGeometry />
            <meshStandardMaterial map={crate} />
          </mesh>
        )}
    </>
  );
};
export default function FallingBoxes() {
  return (
    <div className="h-screen w-full flex items-center">
      <Suspense fallback={null}>
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Box position={[1, 2, 0]} />
          <Box position={[-1, 2, 0]} />
        </Canvas>
      </Suspense>
    </div>
  );
}
