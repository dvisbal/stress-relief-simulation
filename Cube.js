import { Particle } from "./Particle.js";

export class Cube {

    constructor() {
        const textureLoader = new THREE.TextureLoader();
        const earthTexture = textureLoader.load('earth.jpg');

        const material = new THREE.MeshPhongMaterial({ map: earthTexture });
        const geometry = new THREE.BoxGeometry(1, 1, 1);

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(-2, 0, -5);

        this.particles = [];
        this.exploding = false;
    }

    explode() {
        const vertices = this.mesh.geometry.attributes.position.array;
        for(let i = 0; i< vertices.length; i += 3) {
            const cubePosition = this.mesh.position.clone();
            const vertexPosition = new THREE.Vector3(vertices[i], vertices[i + 1], vertices[i + 2]);

            const particlePosition = cubePosition.add(vertexPosition);

            const particle = new Particle(particlePosition);
            this.particles.push(particle);
        }
        this.exploding = true;
    }

    update() {
        if(this.exploding) {
                this.particles.forEach(p => p.update());
            }
    }
}