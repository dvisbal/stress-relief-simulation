export class Particle {
    
    constructor(position) {
        this.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.2,
            (Math.random() - 0.5) * 0.2,
            (Math.random() - 0.5) * 0.2
        );
        this.mesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.05, 8, 8),  // A small sphere as the particle
            new THREE.MeshBasicMaterial({ color: 0xff0000 })
        );
        this.mesh.position.copy(position);
        this.slow = 0.1; // used to start explosion slowly
    }

    update() {
        if(this.slow < 1.0) {
            let slowVelocity = this.velocity.multiplyScalar(this.slow);
            this.mesh.position.add(slowVelocity);
            this.slow += 1;
        } else {
            this.mesh.position.add(this.velocity);
        }
    }
}