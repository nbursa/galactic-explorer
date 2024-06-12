import * as THREE from 'three';
import { Player } from '../models/Player';

export class PlayerService {
  private static player: Player;

  static init(scene: THREE.Scene): void {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const mesh = new THREE.Mesh(geometry, material);
    this.player = new Player(mesh);
    this.player.mesh.position.set(0.5, 0.5, 0.5);
    scene.add(this.player.mesh);
  }

  static movePlayer(direction: THREE.Vector3): void {
    const newPosition = this.player.mesh.position.clone().add(direction);
    this.player.mesh.position.set(
      Math.round(newPosition.x),
      Math.round(newPosition.y),
      Math.round(newPosition.z)
    );
    console.log(
      `Player new position: ${this.player.mesh.position.x}, ${this.player.mesh.position.y}, ${this.player.mesh.position.z}`
    );
  }

  static getPlayerPosition(): THREE.Vector3 {
    return this.player.mesh.position;
  }
}
