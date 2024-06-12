import * as THREE from 'three';
import { Player } from '../models/Player';

export class PlayerService {
  private static player: Player;

  static init(scene: THREE.Scene): void {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const mesh = new THREE.Mesh(geometry, material);
    this.player = new Player(mesh);
    this.player.mesh.position.y = 0.5;
    scene.add(this.player.mesh);
  }

  static movePlayer(direction: THREE.Vector3): void {
    this.player.mesh.position.add(direction);
  }

  static getPlayerPosition(): THREE.Vector3 {
    return this.player.mesh.position;
  }
}
