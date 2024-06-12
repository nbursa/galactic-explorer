import * as THREE from 'three';

export class Player {
  public mesh: THREE.Mesh;

  constructor(mesh: THREE.Mesh) {
    this.mesh = mesh;
  }
}
