export class Vertex {

    constructor(x, y, z, u, v) {
        this.position = new THREE.Vector3(x, y, z);
        this.uv = new THREE.Vector2(u, v);
    }

    getVertexRotated90DegAlongYAxis() {
        return new Vertex(this.position.z, this.position.y, -(this.position.x), this.uv.x, this.uv.y);
    }

    getVertexRotated90DegAlongXAxis() {
        return new Vertex(this.position.x, -(this.position.z), this.position.y, this.uv.x, this.uv.y);
    }
}