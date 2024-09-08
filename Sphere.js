import { Particle } from "./Particle.js";

export class Sphere {

    constructor() {
        const textureLoader = new THREE.TextureLoader();
        const earthTexture = textureLoader.load('earth.jpg');

        const material = new THREE.MeshPhongMaterial({ map: earthTexture });
        const geometry = new THREE.SphereGeometry(1, 32, 32);

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.z = -5

        this.particles = [];
        this.exploding = false;
    }

    explode() {
        const vertices = this.mesh.geometry.attributes.position.array;
        for(let i = 0; i< vertices.length; i += 3) {
            const spherePosition = this.mesh.position.clone();
            const vertexPosition = new THREE.Vector3(vertices[i], vertices[i + 1], vertices[i + 2]);

            const particlePosition = spherePosition.add(vertexPosition);

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