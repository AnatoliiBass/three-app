"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export default function FlexsabileCanvas() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (typeof window !== "undefined" && containerRef.current) {
        const sizes = { width: window.innerWidth, height: window.innerHeight };
        const cursor = { x: 0, y: 0 };
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
          75,
          sizes.width / sizes.height
        );
        camera.position.z = 3;
          const controls = new OrbitControls(camera, containerRef.current);
          controls.enableDamping = true;
  
        scene.add(camera);
  
        // const geometry = new THREE.BoxGeometry(1, 1, 1, 10, 10, 10);
        // const geometry = new THREE.CircleGeometry(1, 24, 2, Math.PI * 2);
        // const geometry = new THREE.PlaneGeometry(1, 1, 10, 10);
        // const geometry = new THREE.ConeGeometry(1, 2, 32, 1, true, 0, Math.PI * 2);
        // const geometry = new THREE.CylinderGeometry(0.5, 1, 2, 32, 4, true, 0, Math.PI / 2);
        // const geometry = new THREE.RingGeometry(0.5, 1, 32, 10, 0, Math.PI);
        // const geometry = new THREE.TorusGeometry(0.5, 0.2, 16, 100, Math.PI);
        // const geometry = new THREE.TorusKnotGeometry(1, 0.25, 100, 16, 1, 5);
        // const geometry = new THREE.DodecahedronGeometry(1, 0);
        // const geometry = new THREE.OctahedronGeometry(1, 0);
        // const geometry = new THREE.TetrahedronGeometry(1, 0);
        // const geometry = new THREE.IcosahedronGeometry(1, 0);
        // const geometry = new THREE.SphereGeometry(1, 32, 16, 0, Math.PI / 2, 0, Math.PI / 2);
        const geometry = new THREE.BufferGeometry();
        const amount = 50;
        const points = new Float32Array(amount * 3 * 3);
        for (let i = 0; i < amount * 3 * 3; i++) {
          points[i] = (Math.random() - 0.5) * 4;

        }

        const pointsBuffer = new THREE.BufferAttribute(points, 3);
        geometry.setAttribute("position", pointsBuffer);

        const material = new THREE.MeshBasicMaterial({
          color: "red",
          wireframe: true,
        });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
  
        const renderer = new THREE.WebGLRenderer();
  
          containerRef.current.appendChild(renderer.domElement);
        
        renderer.setSize(sizes.width, sizes.height);
        renderer.render(scene, camera);
  
        window.addEventListener("mousemove", (event) => {
          cursor.x = -(event.clientX / sizes.width - 0.5);
          cursor.y = event.clientY / sizes.height - 0.5;
        });

        window.addEventListener("resize", () => {
          sizes.width = window.innerWidth;
          sizes.height = window.innerHeight;
          camera.aspect = sizes.width / sizes.height;
          camera.updateProjectionMatrix();
          renderer.setSize(sizes.width, sizes.height);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          renderer.render(scene, camera);
        });

        const handleDoubleClick = () => {
            const element = containerRef.current;
    
            if (element && document.fullscreenEnabled) {
              if (document.fullscreenElement) {
                document.exitFullscreen();
              } else {
                element.addEventListener("click", () => {
                  element.requestFullscreen().catch((err) => {
                    console.error("Error attempting to enable fullscreen:", err);
                  });
                }, { once: true });
    
                element.click();
              }
            }
          };

        window.addEventListener("dblclick", handleDoubleClick);
  
        const tick = () => {
          // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 2;
          // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 2;
          // camera.position.y = cursor.y * 2;
          // camera.lookAt(cube.position);
          controls.update();
          renderer.render(scene, camera);
          window.requestAnimationFrame(tick);
        };
  
          tick();
  
        return () => {
          window.removeEventListener("mousemove", () => {});
            window.removeEventListener("resize", () => {});
            window.removeEventListener("dblclick", handleDoubleClick);
        }
      }
    }, []);
  
    return <div className={`fixed top-0 left-0`} ref={containerRef}></div>;
}