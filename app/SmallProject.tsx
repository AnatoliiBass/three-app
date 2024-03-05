"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import TWEEN from "three/examples/jsm/libs/tween.module.js";


export default function SmallProject() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window !== "undefined" && containerRef.current) {
            const sizes = { width: window.innerWidth, height: window.innerHeight };
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(
                75,
                sizes.width / sizes.height
            );
            camera.position.z = 30;
            const controls = new OrbitControls(camera, containerRef.current);
            controls.enableDamping = true;

            scene.add(camera);
            const renderer = new THREE.WebGLRenderer();

            let activeIndex = "";

            const basePosition:THREE.Vector3[] = [];

            containerRef.current.appendChild(renderer.domElement);
            renderer.setSize(sizes.width, sizes.height);
            renderer.render(scene, camera);
            const group = new THREE.Group();

            const geometries = [
                new THREE.BoxGeometry(1, 1, 1),
                new THREE.ConeGeometry(1, 2, 32, 1),
                new THREE.RingGeometry(0.5, 1, 16),
                new THREE.TorusGeometry(1, 0.5, 16, 100),
                new THREE.DodecahedronGeometry(1, 0),
                new THREE.SphereGeometry(1, 32, 16),
                new THREE.TorusKnotGeometry(1, 0.25, 100, 16, 1, 5),
                new THREE.OctahedronGeometry(1, 0),
                new THREE.CylinderGeometry(0.5, 1, 2, 16, 4),
            ];
            let index = 0;
            for (let i = -5; i <= 5; i += 5) {
                for (let j = -5; j <= 5; j += 5) {
                    const material = new THREE.MeshBasicMaterial({
                        color: "red",
                        wireframe: true,
                    });
                    const mesh = new THREE.Mesh(geometries[index], material);
                    mesh.position.set(i, j, 10);
                    basePosition[index] = new THREE.Vector3(i, j, 10);
                    group.add(mesh);
                    index += 1;
                }
            }
            scene.add(group);

            const resetActive = () => {
                group.children.forEach((child, index) => {
                    const material = (child as THREE.Mesh).material;
                    if (material instanceof THREE.MeshBasicMaterial && material.uuid === activeIndex) {
                        material.color.set("red");
                        new TWEEN.Tween(child.position)
                        .to({ x: basePosition[index].x, y: basePosition[index].y, z: basePosition[index].z }, 
                            Math.random() * 1000 + 1000)
                        .easing(TWEEN.Easing.Exponential.InOut).start();
                        activeIndex = "";
                    }
                });
            };
            const clock = new THREE.Clock();
            const tick = () => {
                const delta = clock.getDelta();
                if (activeIndex !== "") {
                    group.children.forEach((child) => {
                        const material = (child as THREE.Mesh).material;
                        if (material instanceof THREE.MeshBasicMaterial && material.uuid === activeIndex) {
                            child.rotation.y += 0.5 * delta;
                        }
                    });
                }
                controls.update();
                TWEEN.update();
                renderer.render(scene, camera);
                window.requestAnimationFrame(tick);
            };

            tick();

            
            const raycaster = new THREE.Raycaster();
            const handleClick = (event: MouseEvent) => {
                const pointer = new THREE.Vector2();
                pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
                pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
                raycaster.setFromCamera(pointer, camera);
                const intersects = raycaster.intersectObjects(group.children);
                if (activeIndex !== "") {
                    resetActive();
                }
                for (let i = 0; i < intersects.length; i++) {
                    const material = (intersects[i].object as THREE.Mesh).material;
                    if (material instanceof THREE.MeshBasicMaterial) {
                        material.color.set("blue");
                        activeIndex = material.uuid;
                        new TWEEN.Tween(intersects[i].object.position)
                        .to({ x: 0, y: 0, z: 25 }, Math.random() * 1000 + 1000)
                        .easing(TWEEN.Easing.Exponential.InOut).start();
                    }
                }
            };
            
            window.addEventListener("click", handleClick);
            window.addEventListener("resize", () => {
                sizes.width = window.innerWidth;
                sizes.height = window.innerHeight;
                camera.aspect = sizes.width / sizes.height;
                camera.updateProjectionMatrix();
                renderer.setSize(sizes.width, sizes.height);
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                renderer.render(scene, camera);
            });


            return () => {
                window.removeEventListener("resize", () => { });
                window.removeEventListener("click", handleClick);
            };
        }
    }, []);

    return <div className={`fixed top-0 left-0`} ref={containerRef}></div>;
}
