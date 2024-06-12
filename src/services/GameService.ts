import * as THREE from 'three';
import { PlayerService } from './PlayerService';
import { CameraService } from './CameraService';
import { Obstacle } from '../models/Obstacle';

export class GameService {
  private static scene: THREE.Scene;
  private static camera: THREE.PerspectiveCamera;
  private static renderer: THREE.WebGLRenderer;
  private static obstacles: THREE.Group;
  private static platform: THREE.Group;
  private static cellSize = 1;

  static init(containerId: string): void {
    this.scene = new THREE.Scene();
    this.camera = CameraService.init();
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById(containerId)?.appendChild(this.renderer.domElement);

    this.createPlatform(100, 100);
    PlayerService.init(this.scene);
    this.createObstacles(50); // initial number of obstacles

    this.addEventListeners();
    this.animate();
  }

  private static createPlatform(width: number, height: number): void {
    this.platform = new THREE.Group();
    const geometry = new THREE.PlaneGeometry(width * this.cellSize, height * this.cellSize);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = 0;
    this.platform.add(plane);
    this.scene.add(this.platform);

    this.createGrid(width, height);
  }

  private static createGrid(width: number, height: number): void {
    const grid = new THREE.Group();
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

    for (let i = -width / 2; i <= width / 2; i++) {
      const lineGeometryX = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(i * this.cellSize, 0, (-height / 2) * this.cellSize),
        new THREE.Vector3(i * this.cellSize, 0, (height / 2) * this.cellSize)
      ]);
      const lineX = new THREE.Line(lineGeometryX, lineMaterial);
      grid.add(lineX);

      const lineGeometryZ = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3((-width / 2) * this.cellSize, 0, i * this.cellSize),
        new THREE.Vector3((width / 2) * this.cellSize, 0, i * this.cellSize)
      ]);
      const lineZ = new THREE.Line(lineGeometryZ, lineMaterial);
      grid.add(lineZ);
    }

    this.platform.add(grid);
  }

  private static createObstacles(count: number): void {
    this.obstacles = new THREE.Group();
    const geometry = new THREE.BoxGeometry(this.cellSize, this.cellSize, this.cellSize);
    const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    for (let i = 0; i < count; i++) {
      const obstacle = new Obstacle(new THREE.Mesh(geometry, material));
      obstacle.mesh.position.set(
        (Math.floor(Math.random() * 100) - 50) * this.cellSize + this.cellSize / 2,
        this.cellSize / 2,
        (Math.floor(Math.random() * 100) - 50) * this.cellSize + this.cellSize / 2
      );
      this.obstacles.add(obstacle.mesh);
    }
    this.scene.add(this.obstacles);
  }

  private static addEventListeners(): void {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  private static handleKeyDown(event: KeyboardEvent): void {
    const moveDistance = this.cellSize;
    let direction = new THREE.Vector3(0, 0, 0);

    switch (event.key) {
      case 'ArrowUp':
        direction.set(0, 0, -moveDistance);
        break;
      case 'ArrowDown':
        direction.set(0, 0, moveDistance);
        break;
      case 'ArrowLeft':
        direction.set(-moveDistance, 0, 0);
        break;
      case 'ArrowRight':
        direction.set(moveDistance, 0, 0);
        break;
      default:
        return; // exit this handler for other keys
    }

    console.log(
      `Key pressed: ${event.key}, Direction: ${direction.x}, ${direction.y}, ${direction.z}`
    );

    const newPosition = PlayerService.getPlayerPosition().clone().add(direction);
    const halfWidth = 50 * this.cellSize;
    const halfHeight = 50 * this.cellSize;

    // Ensure the player stays within the platform bounds
    if (
      newPosition.x >= -halfWidth &&
      newPosition.x <= halfWidth &&
      newPosition.z >= -halfHeight &&
      newPosition.z <= halfHeight
    ) {
      PlayerService.movePlayer(direction);
      console.log(
        `Player moved to: ${PlayerService.getPlayerPosition().x}, ${PlayerService.getPlayerPosition().y}, ${PlayerService.getPlayerPosition().z}`
      );
    }
  }

  private static animate(): void {
    requestAnimationFrame(this.animate.bind(this));
    CameraService.followPlayer(PlayerService.getPlayerPosition());
    this.renderer.render(this.scene, this.camera);
  }
}
