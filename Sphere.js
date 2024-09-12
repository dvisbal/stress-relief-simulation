import { Particle } from "./Particle.js";
import { 
    TriangleParticle, 
    verticesArrayToTriangleParticlesArray, 
    triangleParticlesArrayToVerticesArray 
} from "./TriangleParticle.js";

export class Sphere {

    constructor() {
        this.createTriangles();
        this.mesh.position.z = -5
        this.mesh.rotation.x += 4.8; // fixes a glitch that turns the world sideways

        this.exploding = false;
        this.slowExplostionAtFirst = 0.0005;
    }

    createTriangles() {
        const radius = 1.0;
        const space = 10;
        const pi = Math.PI;

        const vertices = [];
        const uvs = [];
        const triangleParticles = [];

        // top of earth
        for (let v = 0; v <= 90 - space; v += space) {
            for (let h = 0; h <= 360 - space; h += space) {
                // b----d
                // | \  |
                // |  \ |
                // a----c
                const a = new THREE.Vector3(
                    radius * Math.sin((h) * pi / 180) * Math.sin((v) * pi / 180),
                    radius * Math.cos((h) * pi / 180) * Math.sin((v) * pi / 180),
                    radius * Math.cos((v) * pi / 180)
                );
                const a_u = -(h) / 360;
                const a_v = -(2 * v) / 360;

                const b = new THREE.Vector3(
                    radius * Math.sin((h) * pi / 180) * Math.sin((v + space) * pi / 180),
                    radius * Math.cos((h) * pi / 180) * Math.sin((v + space) * pi / 180),
                    radius * Math.cos((v + space) * pi / 180)
                );
                const b_u = -(h) / 360;
                const b_v = -(2 * (v + space)) / 360;

                const c = new THREE.Vector3(
                    radius * Math.sin((h + space) * pi / 180) * Math.sin((v) * pi / 180),
                    radius * Math.cos((h + space) * pi / 180) * Math.sin((v) * pi / 180),
                    radius * Math.cos((v) * pi / 180)
                );
                const c_u = -(h + space) / 360;
                const c_v = -(2 * v) / 360;

                const d = new THREE.Vector3(
                    radius * Math.sin((h + space) * pi / 180) * Math.sin((v + space) * pi / 180),
                    radius * Math.cos((h + space) * pi / 180) * Math.sin((v + space) * pi / 180),
                    radius * Math.cos((v + space) * pi / 180)
                );
                const d_u = -(h + space) / 360;
                const d_v = -(2 * (v + space)) / 360;

                triangleParticles.push(
                    new TriangleParticle(
                        c.x, c.y, c.z,
                        d.x, d.y, d.z,
                        b.x, b.y, b.z,
                        c_u, c_v,
                        d_u, d_v,
                        b_u, b_v
                    ),
                    new TriangleParticle(
                        b.x, b.y, b.z,
                        a.x, a.y, a.z,
                        c.x, c.y, c.z,
                        b_u, b_v,
                        a_u, a_v,
                        c_u, c_v
                    )
                )

                // Add triangles to the geometry (2 triangles per quad)
                // Triangle 1
                vertices.push(c.x, c.y, c.z);
                vertices.push(d.x, d.y, d.z);
                vertices.push(b.x, b.y, b.z);

                // Triangle 2
                vertices.push(b.x, b.y, b.z);
                vertices.push(a.x, a.y, a.z);
                vertices.push(c.x, c.y, c.z);

                // UVs for Triangle 1
                uvs.push(1 - ((h + space) / 360), 1 - ((2 * v) / 360));
                uvs.push(1 - ((h + space) / 360), 1 - ((2 * (v + space)) / 360));
                uvs.push(1 - ((h) / 360), 1 - ((2 * (v + space)) / 360));

                // UVs for Triangle 2
                uvs.push(1 - ((h) / 360), 1 - ((2 * (v + space)) / 360));
                uvs.push(1 - ((h) / 360), 1 - ((2 * v) / 360));
                uvs.push(1 - ((h + space) / 360), 1 - ((2 * v) / 360));
            }
        }

        // bottom half of earth
        for (let v = 0; v <= 90 - space; v += space) {
            for (let h = 0; h <= 360 - space; h += space) {
                let a = new THREE.Vector3(
                    radius * Math.sin(h * pi / 180) * Math.sin(v * pi / 180),
                    radius * Math.cos(h * pi / 180) * Math.sin(v * pi / 180),
                    -radius * Math.cos(v * pi / 180)
                );
                let b = new THREE.Vector3(
                    radius * Math.sin(h * pi / 180) * Math.sin((v + space) * pi / 180),
                    radius * Math.cos(h * pi / 180) * Math.sin((v + space) * pi / 180),
                    -radius * Math.cos((v + space) * pi / 180)
                );
                let c = new THREE.Vector3(
                    radius * Math.sin((h + space) * pi / 180) * Math.sin(v * pi / 180),
                    radius * Math.cos((h + space) * pi / 180) * Math.sin(v * pi / 180),
                    -radius * Math.cos(v * pi / 180)
                );
                let d = new THREE.Vector3(
                    radius * Math.sin((h + space) * pi / 180) * Math.sin((v + space) * pi / 180),
                    radius * Math.cos((h + space) * pi / 180) * Math.sin((v + space) * pi / 180),
                    -radius * Math.cos((v + space) * pi / 180)
                );
    
                vertices.push(c.x, c.y, c.z);
                vertices.push(d.x, d.y, d.z);
                vertices.push(b.x, b.y, b.z);
    
                vertices.push(b.x, b.y, b.z);
                vertices.push(a.x, a.y, a.z);
                vertices.push(c.x, c.y, c.z);

                uvs.push(-(h + space) / 360, (2 * v) / 360);
                uvs.push(-(h + space) / 360, (2 * (v + space)) / 360);
                uvs.push(-h / 360, (2 * (v + space)) / 360);
    
                uvs.push(-h / 360, (2 * (v + space)) / 360);
                uvs.push(-h / 360, (2 * v) / 360);
                uvs.push(-(h + space) / 360, (2 * v) / 360);
            }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

        const textureLoader = new THREE.TextureLoader();
        const earthTexture = textureLoader.load('earth.jpg');
        earthTexture.wrapS = THREE.RepeatWrapping;
        earthTexture.wrapT = THREE.RepeatWrapping;
        const material = new THREE.MeshBasicMaterial({ 
            map: earthTexture,
            side: THREE.DoubleSide

        });

        this.mesh = new THREE.Mesh(geometry, material);
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

        this.mesh.geometry.setAttribute('position', new THREE.BufferAttribute(newVertices, 3)); // 3 components per vertex (x, y, z)
        this.mesh.geometry.setAttribute('uv', new THREE.BufferAttribute(newUVs, 2)); // 2 components per UV (u, v)

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

            const velocity = triangleCenter.clone().sub(explostionCenter).normalize().multiplyScalar(0.005 * Math.random());
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