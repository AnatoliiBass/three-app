"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import Stats from "stats.js";
import * as dat from "lil-gui";

export default function ControllPanel() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && containerRef.current) {
        const sizes = { width: window.innerWidth, height: window.innerHeight };
      const cursor = { x: 0, y: 0 };
      const parameters = {
        color: "red",
      };
      const gui = new dat.GUI({closeFolders: true});
      const stats = new Stats();
      stats.showPanel(0);
      document.body.appendChild(stats.dom);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        sizes.width / sizes.height
      );
      camera.position.z = 3;
        const controls = new OrbitControls(camera, containerRef.current);
        controls.enableDamping = true;

      scene.add(camera);

      const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
      const material = new THREE.MeshBasicMaterial({
        color: parameters.color,
        wireframe: true,
      });
      const cube = new THREE.Mesh(geometry, material);
        const scaleFolder = gui.addFolder("Scale")
        scaleFolder.add(cube.scale, "x").min(0).max(5).step(0.01).name("scaleX");
        scaleFolder.add(cube.scale, "y").min(0).max(5).step(0.01).name("scaleY");
        scaleFolder.add(cube.scale, "z").min(0).max(5).step(0.01).name("scaleZ");
        gui.add(cube, "visible");
        gui.add(material, "wireframe");
        gui.addColor(parameters, "color").onChange(() => {
          material.color.set(parameters.color);
        });
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
        stats.begin();
        controls.update();
        renderer.render(scene, camera);
        stats.end();
        window.requestAnimationFrame(tick);
      };

        tick();

      return () => {
        window.removeEventListener("mousemove", () => {});
        window.removeEventListener("resize", () => {});
      }
    }
  }, []);

  return <div className={`fixed top-0 left-0`} ref={containerRef}></div>;
}