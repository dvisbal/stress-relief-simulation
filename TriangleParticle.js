import { Vertex } from "./Vertex.js";

export class TriangleParticle {

    constructor(
        v1_x, v1_y, v1_z, // a
        v2_x, v2_y, v2_z, // b
        v3_x, v3_y, v3_z, // c
        v1_u, v1_v,
        v2_u, v2_v,
        v3_u, v3_v
    ) {
        this.a = new Vertex(v1_x, v1_y, v1_z, v1_u, v1_v);
        this.b = new Vertex(v2_x, v2_y, v2_z, v2_u, v2_v);
        this.c = new Vertex(v3_x, v3_y, v3_z, v3_u, v3_v);
    }

    getTriangleParticleRotated90DegToTheRight() {
        const a = this.a.getVertexRotated90DegAlongYAxis();
        const b = this.b.getVertexRotated90DegAlongYAxis();
        const c = this.c.getVertexRotated90DegAlongYAxis();

        return new TriangleParticle(
            a.position.x, a.position.y, a.position.z,
            b.position.x, b.position.y, b.position.z,
            c.position.x, c.position.y, c.position.z,
            a.uv.x, a.uv.y,
            b.uv.x, b.uv.y,
            c.uv.x, c.uv.y,
        );
    }

    getTriangleParticleRotated90DegUp() {
        const a = this.a.getVertexRotated90DegAlongXAxis();
        const b = this.b.getVertexRotated90DegAlongXAxis();
        const c = this.c.getVertexRotated90DegAlongXAxis();

        return new TriangleParticle(
            a.position.x, a.position.y, a.position.z,
            b.position.x, b.position.y, b.position.z,
            c.position.x, c.position.y, c.position.z,
            a.uv.x, a.uv.y,
            b.uv.x, b.uv.y,
            c.uv.x, c.uv.y,
        );
    }

    split() {
        // split the triangle
        // put one of the two new triangles back at index i
        // put the other new triangle at the end of the triangleParticles list

        let a = this.a.position.clone();
        let b = this.b.position.clone();
        let c = this.c.position.clone();
        let a_uv = this.a.uv.clone();
        let b_uv = this.b.uv.clone();
        let c_uv = this.c.uv.clone();

        let distance_ab = a.distanceTo(b);
        let distance_ac = a.distanceTo(c);
        let distance_bc = b.distanceTo(c);

        let newTriangle = null;

        if (distance_ab >= distance_ac && distance_ab >= distance_bc) {

            let ab = new THREE.Vector3().lerpVectors(a, b, 0.5); // midpoint
            let ab_uv = new THREE.Vector2().lerpVectors(a_uv, b_uv, 0.5); // midpoint for the two uv points

            this.a.position.x = ab.x; this.a.position.y = ab.y; this.a.position.z = ab.z;
            this.b.position.x = c.x; this.b.position.y = c.y; this.b.position.z = c.z;
            this.c.position.x = a.x; this.c.position.y = a.y; this.c.position.z = a.z;
            this.a.uv.x = ab_uv.x; this.a.uv.y = ab_uv.y;
            this.b.uv.x = c_uv.x; this.b.uv.y = c_uv.y;
            this.c.uv.x = a_uv.x; this.c.uv.y = a_uv.y;

            // second new triangle goes to end of triangleParticles array
            newTriangle = new TriangleParticle(
                ab.x, ab.y, ab.z,
                b.x, b.y, b.z,
                c.x, c.y, c.z,
                ab_uv.x, ab_uv.y,
                b_uv.x, b_uv.y,
                c_uv.x, c_uv.y
            );
        } else if (distance_ac >= distance_ab && distance_ac >= distance_bc) {
            let ac = new THREE.Vector3().lerpVectors(a, c, 0.5); // midpoint
            let ac_uv = new THREE.Vector2().lerpVectors(a_uv, c_uv, 0.5); // midpoint for the two uv points

            this.a.position.x = ac.x; this.a.position.y = ac.y; this.a.position.z = ac.z;
            this.b.position.x = c.x; this.b.position.y = c.y; this.b.position.z = c.z;
            this.c.position.x = b.x; this.c.position.y = b.y; this.c.position.z = b.z;
            this.a.uv.x = ac_uv.x; this.a.uv.y = ac_uv.y;
            this.b.uv.x = c_uv.x; this.b.uv.y = c_uv.y;
            this.c.uv.x = b_uv.x; this.c.uv.y = b_uv.y;

            newTriangle = new TriangleParticle(
                ac.x, ac.y, ac.z,
                a.x, a.y, a.z,
                b.x, b.y, b.z,
                ac_uv.x, ac_uv.y,
                a_uv.x, a_uv.y,
                b_uv.x, b_uv.y
            );
        } else {
            let bc = new THREE.Vector3().lerpVectors(b, c, 0.5); // midpoint
            let bc_uv = new THREE.Vector2().lerpVectors(b_uv, c_uv, 0.5) // midpoint for the two uv points

            this.a.position.x = bc.x; this.a.position.y = bc.y; this.a.position.z = bc.z;
            this.b.position.x = c.x; this.b.position.y = c.y; this.b.position.z = c.z;
            this.c.position.x = a.x; this.c.position.y = a.y; this.c.position.z = a.z;
            this.a.uv.x = bc_uv.x; this.a.uv.y = bc_uv.y;
            this.b.uv.x = c_uv.x; this.b.uv.y = c_uv.y;
            this.c.uv.x = a_uv.x; this.c.uv.y = a_uv.y;

            newTriangle = new TriangleParticle(
                bc.x, bc.y, bc.z,
                b.x, b.y, b.z,
                a.x, a.y, a.z,
                bc_uv.x, bc_uv.y,
                b_uv.x, b_uv.y,
                a_uv.x, a_uv.y
            );
        }

        return newTriangle;
    }
}

export function verticesArrayToTriangleParticlesArray(vertices, uvs) {
    let triangleParticles = [];
    for(let i=0; i<vertices.length; i+=9) {
        const triangle_index = i / 9;
        const uv_index_for_triangle_index = triangle_index * 6 // 1 triangle takes up 6 cords in the uv array (x, y for each point in the triangle)

        triangleParticles.push(new TriangleParticle(
                vertices[i    ], vertices[i + 1], vertices[i + 2],
                vertices[i + 3], vertices[i + 4], vertices[i + 5],
                vertices[i + 6], vertices[i + 7], vertices[i + 8],
                uvs[uv_index_for_triangle_index    ], uvs[uv_index_for_triangle_index + 1],
                uvs[uv_index_for_triangle_index + 2], uvs[uv_index_for_triangle_index + 3],
                uvs[uv_index_for_triangle_index + 4], uvs[uv_index_for_triangle_index + 5]
            )
        );
    }

    return triangleParticles;
}

export function triangleParticlesArrayToVerticesArray(triangleParticles) {
    let vertices = new Float32Array(triangleParticles.length * 9); // vertices length = triangles (3 points x 3 coords = 9)
    let uvs = new Float32Array(triangleParticles.length * 6); // uvs length = triangles (3 points x 2 coords (u, v) = 9)
    
    for(let i=0; i<triangleParticles.length; i++) {

        const a_x = triangleParticles[i].a.position.x;
        const a_y = triangleParticles[i].a.position.y;
        const a_z = triangleParticles[i].a.position.z;
        
        const b_x = triangleParticles[i].b.position.x;
        const b_y = triangleParticles[i].b.position.y;
        const b_z = triangleParticles[i].b.position.z;
        
        const c_x = triangleParticles[i].c.position.x;
        const c_y = triangleParticles[i].c.position.y;
        const c_z = triangleParticles[i].c.position.z;
        
        vertices[(i * 9)    ] = a_x; vertices[(i * 9) + 1] = a_y; vertices[(i * 9) + 2] = a_z;
        vertices[(i * 9) + 3] = b_x; vertices[(i * 9) + 4] = b_y; vertices[(i * 9) + 5] = b_z;
        vertices[(i * 9) + 6] = c_x; vertices[(i * 9) + 7] = c_y; vertices[(i * 9) + 8] = c_z;

        const a_u = triangleParticles[i].a.uv.x;
        const a_v = triangleParticles[i].a.uv.y;
        
        const b_u = triangleParticles[i].b.uv.x;
        const b_v = triangleParticles[i].b.uv.y;
        
        const c_u = triangleParticles[i].c.uv.x;
        const c_v = triangleParticles[i].c.uv.y;

        uvs[(i * 6)   ] = a_u; uvs[(i * 6) + 1] = a_v;
        uvs[(i * 6) + 2] = b_u; uvs[(i * 6) + 3] = b_v;
        uvs[(i * 6) + 4] = c_u; uvs[(i * 6) + 5] = c_v;
    }

    return [vertices, uvs];
}