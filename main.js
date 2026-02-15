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
// ===============================
// HEXAGON GEOMETRY (REAL SHAPE)
// ===============================

const HEX_RADIUS = 1.8;
const HEX_DEPTH = 0.6;

// Create precise hexagon shape
const hexShape = new THREE.Shape();

for (let i = 0; i < 6; i++) {

    const angle = (i / 6) * Math.PI * 2;
    const x = Math.cos(angle) * HEX_RADIUS;
    const y = Math.sin(angle) * HEX_RADIUS;

    if (i === 0) {
        hexShape.moveTo(x, y);
    } else {
        hexShape.lineTo(x, y);
    }
}

hexShape.closePath();

// Extrude settings with bevel
const extrudeSettings = {
    depth: HEX_DEPTH,
    bevelEnabled: true,
    bevelThickness: 0.08,
    bevelSize: 0.06,
    bevelSegments: 4,
    curveSegments: 64
};

const hexGeometry = new THREE.ExtrudeGeometry(hexShape, extrudeSettings);
hexGeometry.center();

// ===============================
// METAL MATERIAL (CINEMATIC)
// ===============================

const metalMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x1c1f26,
    metalness: 0.9,
    roughness: 0.22,
    reflectivity: 1,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    envMapIntensity: 1.5
});

const hexMesh = new THREE.Mesh(hexGeometry, metalMaterial);
hexMesh.castShadow = true;
hexMesh.receiveShadow = true;

scene.add(hexMesh);

// ===============================
// EDGE OUTLINE (ORANGE GLOW)
// ===============================

const edges = new THREE.EdgesGeometry(hexGeometry);

const edgeMaterial = new THREE.LineBasicMaterial({
    color: 0xE8752A,
    transparent: true,
    opacity: 0.55
});

const edgeLines = new THREE.LineSegments(edges, edgeMaterial);
scene.add(edgeLines);

// ===============================
// SUBTLE FLOAT ANIMATION
// ===============================

let clock = new THREE.Clock();

function animate() {

    requestAnimationFrame(animate);

    const elapsed = clock.getElapsedTime();

    // Subtle idle motion
    hexMesh.rotation.y += 0.003;
    hexMesh.rotation.x = Math.sin(elapsed * 0.6) * 0.08;

    edgeLines.rotation.copy(hexMesh.rotation);

    controls.update();
    renderer.render(scene, camera);
}

animate();
// ======================================
// TEXT ENGRAVING (BEELABS)
// ======================================

const loader = new THREE.FontLoader();

loader.load(
    'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
    function (font) {

        const textGeometry = new THREE.TextGeometry("BEELABS", {
            font: font,
            size: 0.55,
            height: 0.08,
            curveSegments: 32,
            bevelEnabled: false
        });

        textGeometry.computeBoundingBox();
        textGeometry.center();

        const textMaterial = new THREE.MeshStandardMaterial({
            color: 0x0c0d10,
            metalness: 0.2,
            roughness: 0.8
        });

        const textMesh = new THREE.Mesh(textGeometry, textMaterial);

        // Position in front face and push slightly inside
        textMesh.position.z = HEX_DEPTH / 2 - 0.15;

        scene.add(textMesh);

        // Sync rotation with hexagon
        function syncTextRotation() {
            textMesh.rotation.copy(hexMesh.rotation);
            requestAnimationFrame(syncTextRotation);
        }

        syncTextRotation();
    }
);
