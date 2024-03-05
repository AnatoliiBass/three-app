"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader, OrbitControls } from "three/examples/jsm/Addons.js";

export default function Models() {
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

      camera.position.set(0, 2, 10);
      const controls = new OrbitControls(camera, containerRef.current);
      controls.enableDamping = true;

      scene.add(camera);

      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10),
        new THREE.MeshStandardMaterial({
          color: "#666666",
          metalness: 0,
          roughness: 0.5,
        })
      );
      floor.receiveShadow = true;
      floor.rotation.x = -Math.PI * 0.5;
      scene.add(floor);

      const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
      hemiLight.position.set(0, 50, 0);
      scene.add(hemiLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
      dirLight.position.set(-8, 12, 8);
      dirLight.castShadow = true;
      dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
      scene.add(dirLight);

      const loader = new GLTFLoader();
      let mixer: THREE.AnimationMixer | null = null;
      loader.load(
        "models/Flag/Flag.glb",
        async (gltf) => {
          console.log("Result: ", gltf);
          mixer = new THREE.AnimationMixer(gltf.scene);
          // const action1 = mixer.clipAction(gltf.animations[0]);
          // action1.play();
          const action2 = mixer.clipAction(gltf.animations[1]);
          action2.play();
          gltf.scene.scale.set(1, 1, 1);
          gltf.scene.position.set(0, 1, 0);
          scene.add(gltf.scene);
        },
        async (progress: any) => {
          console.log("Progress: ", progress);
        },
        async (error: any) => {
          console.log("Error: ", error);
        }
      );

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
      const clock = new THREE.Clock();
      const tick = () => {
        controls.update();
        renderer.render(scene, camera);

        const delta = clock.getDelta();
        if (mixer) mixer.update(delta);
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
