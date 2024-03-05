"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function DComponent() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const sizes = { width: window.innerWidth, height: window.innerHeight };
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
      camera.position.z = 3;
      scene.add(camera);

      const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);

      const group = new THREE.Group();
      const cubes:THREE.Mesh[] = [];
      const colors = ["red", "green", "blue"];
      for (let x = -0.3; x <= 0.3; x += 0.3) {
          for (let y = -0.3; y <= 0.3; y += 0.3) {
            const material = new THREE.MeshBasicMaterial({ color: colors[((Math.random() * 3) | 0) + 1], 
              wireframe: true});
              const cube = new THREE.Mesh(geometry, material);
              cube.scale.set(0.5, 0.5, 0.5);
              cube.position.set(x, y, 0);
              cubes.push(cube);
          }
      }

      group.add(...cubes);
      scene.add(group);

      const renderer = new THREE.WebGLRenderer();
      if (containerRef.current) {
        containerRef.current.appendChild(renderer.domElement);
      }
      renderer.setSize(sizes.width, sizes.height);

      window.addEventListener("resize", () => {
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;
        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.render(scene, camera);
      });

      const clock = new THREE.Clock();
      const MAX_SCALE = 1;
      const MIN_SCALE = 0.5;
      let grow = false;
      const animate = () => {
        const delta = clock.getDelta();
        cubes.forEach((cube, index) => {
          const mult = index % 2 === 0 ? 1 : -1;
          cube.rotation.x += mult * delta;
          cube.rotation.y += mult * delta * 0.4;
        });
        const epalsen = clock.getElapsedTime();
        camera.position.x = Math.sin(epalsen);
        camera.position.z = Math.cos(epalsen);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        const mult = grow ? 1 : -1;
        group.scale.x += mult * delta * 0.2;
        group.scale.y += mult * delta * 0.2;
        group.scale.z += mult * delta * 0.2;
        if (grow && group.scale.x >= MAX_SCALE) {
          grow = false;
        } else if (group.scale.x <= MIN_SCALE) {
          grow = true;
        }
        renderer.render(scene, camera);
        window.requestAnimationFrame(animate);
      };
      animate();

      return () => {
        window.removeEventListener("resize", () => {});
      };
    }
  }, []);

  return <div className={`fixed top-0 left-0`} ref={containerRef}></div>;
}
