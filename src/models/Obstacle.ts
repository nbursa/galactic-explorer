import * as THREE from 'three';

export class Obstacle {
  public mesh: THREE.Mesh;

  constructor(mesh: THREE.Mesh) {
    this.mesh = mesh;
  }
}
