import { Cube } from "./Cube.js";
import { Sphere } from "./Sphere.js";

// Setup basic Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add lighting
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

let shapeActive = false;
const shapes = [];

// Load texture for the sphere
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('earth.jpg');



// Animation loop
function animate() {
    requestAnimationFrame(animate);
    for (let shape of shapes) {
        // Rotate the cube and sphere
        shape.mesh.rotation.x += 0.01;
        shape.mesh.rotation.y += 0.01;
        shape.update();
    }
    renderer.render(scene, camera);
}

// Start the animation loop
animate();

// Handle keyboard input
document.addEventListener('keydown', function(event) {
    switch(event.key) {
        case 'ArrowUp':
            camera.position.z -= 0.1;
            break;
        case 'ArrowDown':
            camera.position.z += 0.1;
            break;
        case 'ArrowLeft':
            camera.position.x -= 0.1;
            break;
        case 'ArrowRight':
            camera.position.x += 0.1;
            break;
        case 'u':
            camera.position.y += 0.1;
            break;
        case 'j':
            camera.position.y -= 0.1;
            break;
        case 'c':
            if (shapeActive == false) {
                const cube = new Cube();
                scene.add(cube.mesh);
                shapes.push(cube);
                shapeActive = true;
            }
            break;
        case 'e':
            if (shapeActive == false) {
                const sphere = new Sphere();
                scene.add(sphere.mesh);
                shapes.push(sphere);
                shapeActive = true;
            }
            break;
        case ' ':
            const shape = shapes.at(-1);
            shape.explode();
            shape.particles.forEach(particle => scene.add(particle.mesh))
            // scene.remove(shape);
            // shape.geometry.dispose();
            // shape.material.dispose();
            shapeActive = false;
            break;
    }
});

// Handle window resize
window.addEventListener('resize', function() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});
