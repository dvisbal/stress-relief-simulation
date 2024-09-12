import { Particle } from "./Particle.js";
import { 
    TriangleParticle, 
    verticesArrayToTriangleParticlesArray, 
    triangleParticlesArrayToVerticesArray 
} from "./TriangleParticle.js";

export class Cube {

    constructor() {
        // front
        const frontFace_1 = new TriangleParticle(
            -0.5, -0.5, 0.5,
             0.5, -0.5, 0.5,
            -0.5,  0.5, 0.5,
            0.0, 0.0,
            1.0, 0.0, 
            0.0, 1.0
        );
        const frontFace_2 = new TriangleParticle(
             0.5, -0.5, 0.5,
             0.5,  0.5, 0.5,
            -0.5,  0.5, 0.5,
             1.0,  0.0,
             1.0,  1.0,
             0.0,  1.0
        )

        // right
        const rightFace_1 = frontFace_1.getTriangleParticleRotated90DegToTheRight();
        const rightFace_2 = frontFace_2.getTriangleParticleRotated90DegToTheRight();

        // back
        const backFace_1 = rightFace_1.getTriangleParticleRotated90DegToTheRight();
        const backFace_2 = rightFace_2.getTriangleParticleRotated90DegToTheRight();

        // left
        const leftFace_1 = backFace_1.getTriangleParticleRotated90DegToTheRight();
        const leftFace_2 = backFace_2.getTriangleParticleRotated90DegToTheRight();

        // top
        const topFace_1 = frontFace_1.getTriangleParticleRotated90DegUp();
        const topFace_2 = frontFace_2.getTriangleParticleRotated90DegUp();

        // bottom
        const bottomFace_1 = backFace_1.getTriangleParticleRotated90DegUp();
        const bottomFace_2 = backFace_2.getTriangleParticleRotated90DegUp();
        
        const triangleParticles = [
            frontFace_1, frontFace_2,
            rightFace_1, rightFace_2,
            backFace_1, backFace_2,
            leftFace_1, leftFace_2,
            topFace_1, topFace_2,
            bottomFace_1, bottomFace_2
        ];

        const [vertices, uvs] = triangleParticlesArrayToVerticesArray(triangleParticles);

        const textureLoader = new THREE.TextureLoader();
        const earthTexture = textureLoader.load('earth.jpg');
        const material = new THREE.MeshBasicMaterial({ map: earthTexture });

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3)); // 3 coordinates per vertex (x, y, z)
        geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2)); // 2 coordinates per UV (u, v)

        // Create the mesh and add it to the scene
        this.mesh = new THREE.Mesh(geometry, material);

        this.mesh.position.set(0, 0, -5);

        this.particles = [];
        this.exploding = false;
        this.slowExplostionAtFirst = 0.005;
    }

    explode() {
        let vertices = this.mesh.geometry.attributes.position.array;
        let uvs = this.mesh.geometry.attributes.uv.array;

        let triangleParticles = verticesArrayToTriangleParticlesArray(vertices, uvs);

        const maxTriangleParticles = 50000; // triangleParticles.length;
        while (triangleParticles.length < maxTriangleParticles) {
            const currentParticleCount = triangleParticles.length;
            for(let i = 0; i < currentParticleCount; i++) {
                if (triangleParticles.length >= maxTriangleParticles) {
                    break;
                }
                // split the triangle at index i
                // put one of the two new triangles back at index i
                // put the other new triangle at the end of the triangleParticles list
                triangleParticles.push(triangleParticles[i].split())
            }
        }

        const [newVertices, newUVs] = triangleParticlesArrayToVerticesArray(triangleParticles);

        this.mesh.geometry.setAttribute('position', new THREE.BufferAttribute(newVertices, 3)); // 3 coordinates per vertex (x, y, z)
        this.mesh.geometry.setAttribute('uv', new THREE.BufferAttribute(newUVs, 2)); // 2 coordinates per UV (u, v)

        vertices = this.mesh.geometry.attributes.position.array;
        this.velocities = [];

        for(let i=0; i<vertices.length; i+=9) {
            let a = new THREE.Vector3(vertices[i], vertices[i + 1], vertices[i + 2]);
            let b = new THREE.Vector3(vertices[i + 3], vertices[i + 3 + 1], vertices[i + 2]);
            let c = new THREE.Vector3(vertices[i + 6], vertices[i + 6 + 1], vertices[i + 6 + 2]);

            const triangleCenter = new THREE.Vector3(
                (a.x + b.x + c.x) / 3,
                (a.y + b.y + c.y) / 3,
                (a.z + b.z + c.z) / 3,
            );

            const explostionCenter = new THREE.Vector3(0.0, 0.0, 0.0);

            const velocity = triangleCenter.clone().sub(explostionCenter).normalize().multiplyScalar(0.1 * Math.random());
            this.velocities.push(velocity);
        }

        this.exploding = true;
    }

    update() {
        if(this.exploding) {
            const vertices = this.mesh.geometry.attributes.position.array;

            for(let i=0; i<vertices.length; i+=9) { // (9 because 3 triangles x 3 vertices for each triangle)
                let velocity = this.velocities[i / 9];
                if (this.slowExplostionAtFirst < 1.0) {
                    velocity = velocity.clone().multiplyScalar(this.slowExplostionAtFirst);
                }
                for(let j=0; j<9; j+=3) {
                    vertices[i + j] += velocity.x;
                    vertices[i + j + 1] += velocity.y;
                    vertices[i + j + 2] += velocity.z;
                }
            }
            
            this.mesh.geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
            
            if (this.slowExplostionAtFirst < 1.0) {
                this.slowExplostionAtFirst += 0.05;
            }
        }
    }
}