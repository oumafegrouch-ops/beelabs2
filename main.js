// ===============================
// BEELABS PREMIUM 3D ENGINE
// ===============================

// --- IMPORTS (ES MODULES CDN) ---
import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.158.0/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'https://unpkg.com/three@0.158.0/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://unpkg.com/three@0.158.0/examples/jsm/geometries/TextGeometry.js';
import { RGBELoader } from 'https://unpkg.com/three@0.158.0/examples/jsm/loaders/RGBELoader.js';

// ===============================
// BASIC SCENE SETUP
// ===============================

const container = document.getElementById('hexCanvas');

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);

camera.position.set(0, 0, 6);

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

container.appendChild(renderer.domElement);

// ===============================
// CONTROLS (INERTIA DRAG)
// ===============================

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enablePan = false;
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.rotateSpeed = 0.6;

// ===============================
// CINEMATIC LIGHTING SETUP
// ===============================

// Ambient base
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

// Key light (warm)
const keyLight = new THREE.DirectionalLight(0xffe1c4, 3);
keyLight.position.set(-5, 6, 5);
keyLight.castShadow = true;
keyLight.shadow.mapSize.width = 2048;
keyLight.shadow.mapSize.height = 2048;
scene.add(keyLight);

// Rim light (orange accent)
const rimLight = new THREE.DirectionalLight(0xE8752A, 2);
rimLight.position.set(5, -3, -5);
scene.add(rimLight);

// Fill light (cool contrast)
const fillLight = new THREE.DirectionalLight(0x6ea8ff, 0.8);
fillLight.position.set(0, -5, 5);
scene.add(fillLight);

// ===============================
// HDR ENVIRONMENT (Metal realism)
// ===============================

new RGBELoader()
    .load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_09_1k.hdr', function (texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture;
    });

// ===============================
// RESPONSIVE
// ===============================

window.addEventListener('resize', () => {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

});

// ===============================
// GLOBAL EXPORT (for next parts)
// ===============================

export {
    scene,
    camera,
    renderer,
    controls,
    THREE,
    FontLoader,
    TextGeometry
};
