import * as THREE from 'three';

export class CameraService {
  private static camera: THREE.PerspectiveCamera;

  static init(): THREE.PerspectiveCamera {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 10, 10);
    this.camera.lookAt(0, 0, 0);
    return this.camera;
  }

  static followPlayer(playerPosition: THREE.Vector3): void {
    this.camera.position.x = playerPosition.x;
    this.camera.position.z = playerPosition.z + 10;
    this.camera.position.y = 10;
    this.camera.lookAt(playerPosition);
  }

  static getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }
}
