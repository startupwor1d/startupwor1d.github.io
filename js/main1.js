import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202030);

// Camera
const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(4, 3, 6);

// Renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderer.domElement);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lights
const ambient = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambient);

const directional = new THREE.DirectionalLight(0xffffff, 2);
directional.position.set(5, 10, 7);
scene.add(directional);

// Grid
const grid = new THREE.GridHelper(20, 20);
scene.add(grid);

// Cube
const geometry = new THREE.BoxGeometry();

const material = new THREE.MeshStandardMaterial({
    color:0x00ff88,
    metalness:0.4,
    roughness:0.4
});

const cube = new THREE.Mesh(geometry, material);
cube.position.y = 0.5;
scene.add(cube);

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20,20),
    new THREE.MeshStandardMaterial({
        color:0x444444
    })
);

floor.rotation.x = -Math.PI/2;
scene.add(floor);

// Axes
const axes = new THREE.AxesHelper(3);
scene.add(axes);

// Resize
window.addEventListener("resize", () => {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

});

// Animation Loop
function animate(){

    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    controls.update();

    renderer.render(scene, camera);

}

animate();
