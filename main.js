import { Cube } from "./Cube.js";
import { Sphere } from "./Sphere.js";

// basic setup: scene + camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// lighting
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// Create canvas for text
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
canvas.width = 512;
canvas.height = 256;

function drawText() {
    context.clearRect(0, 0, canvas.width, canvas.height);  // Clear the previous text
    context.fillStyle = 'white';
    context.font = '30px Arial';
    context.fillText('arrow keys: move camera', 10, 50);
    context.fillText('u/j: camera up/down', 10, 100);
    context.fillText('e: new earth', 10, 150);
    context.fillText('c: new cube earth', 10, 200);
    context.fillText('space: release stress', 10, 250);
}
drawText();

const textTexture = new THREE.CanvasTexture(canvas);
const textMaterial = new THREE.SpriteMaterial({ map: textTexture });
const textSprite = new THREE.Sprite(textMaterial);

// scene + camera for text overlay
const overlayScene = new THREE.Scene();
const overlayCamera = new THREE.OrthographicCamera(
    -window.innerWidth / 2, window.innerWidth / 2,
    window.innerHeight / 2, -window.innerHeight / 2,
    0, 10
);
overlayScene.add(textSprite);

function positionTextSprite() {
    // Scale text
    const spriteWidth = canvas.width * 0.75;
    const spriteHeight = canvas.height * 0.75;
    textSprite.scale.set(spriteWidth, spriteHeight, 1);

    textSprite.position.set(-(window.innerWidth / 2) + (spriteWidth / 2) + 20,  // 20px from left
        (window.innerHeight / 2) - (spriteHeight / 2) - 20,  // 20px from top
        0);
}
positionTextSprite();

let shapeActive = false;
const shapes = [];

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    for (let shape of shapes) {
        shape.mesh.rotation.z += 0.01;
        shape.update();
    }

    renderer.render(scene, camera);

    // Render overlay text after main scene
    renderer.autoClear = false;  // Disable automatic clearing so both scenes render
    renderer.clearDepth();       // Clear depth buffer before overlay rendering
    renderer.render(overlayScene, overlayCamera);
}

animate();

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

    // Update orthographic camera for the overlay scene
    overlayCamera.left = -width / 2;
    overlayCamera.right = width / 2;
    overlayCamera.top = height / 2;
    overlayCamera.bottom = -height / 2;
    overlayCamera.updateProjectionMatrix();

    // Reposition text sprite
    positionTextSprite();
});
