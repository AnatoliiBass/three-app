"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export default function Textures() {
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

      const loadingManager = new THREE.LoadingManager();
      loadingManager.onStart = () => {
        console.log("loading started");
      };
      loadingManager.onLoad = () => {
        console.log("loading finished");
      };
      loadingManager.onProgress = () => {
        console.log("loading in progress");
      };
      loadingManager.onError = () => {
        console.log("loading error");
      };
      const textureLoader = new THREE.TextureLoader(loadingManager);
      const texture1 = textureLoader.load("textures/door/basecolor.jpg");
        const texture2 = textureLoader.load("textures/door/normal.jpg");
        const texture3 = textureLoader.load("textures/door/roughness.jpg");
        const texture4 = textureLoader.load("textures/door/ambientOcclusion.jpg");
        const texture5 = textureLoader.load("textures/door/height.png");
        const texture6 = textureLoader.load("textures/door/metallic.jpg");
        const texture7 = textureLoader.load("textures/door/opacity.jpg");
        const texture8 = textureLoader.load("textures/door/Material_843.png");

      //   const image = new Image();
      //   image.src = "textures/door/basecolor.jpg";
      //   const texture = new THREE.Texture(image);
      //   image.onload = () => {
      //     texture.needsUpdate = true;
      //   };

      const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
      const material = new THREE.MeshBasicMaterial({
        map: texture8,
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

      const tick = () => {
        controls.update();
        renderer.render(scene, camera);
        window.requestAnimationFrame(tick);
      };

      tick();

      return () => {
        window.removeEventListener("mousemove", () => {});
        window.removeEventListener("resize", () => {});
      };
    }
  }, []);

  return <div className={`fixed top-0 left-0`} ref={containerRef}></div>;
}
